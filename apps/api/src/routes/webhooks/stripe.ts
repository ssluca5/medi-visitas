import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import Stripe from "stripe";
import { stripe } from "../../services/stripe.js";
import { prisma } from "../../lib/prisma.js";

export default async function stripeWebhookRoutes(app: FastifyInstance) {
  app.post(
    "/webhooks/stripe",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const sig = request.headers["stripe-signature"] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!endpointSecret) {
        request.log.error("STRIPE_WEBHOOK_SECRET not configured");
        return reply.code(500).send({ error: "Webhook secret not configured" });
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          (request as any).rawBody,
          sig,
          endpointSecret,
        );
      } catch (err) {
        request.log.error(
          { err },
          "Stripe webhook signature verification failed",
        );
        return reply.code(400).send({ error: "Invalid signature" });
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const { organizationId, plano } = session.metadata!;

            if (!organizationId || !plano) {
              request.log.error("Missing metadata in checkout session");
              break;
            }

            const org = await prisma.organization.findUnique({
              where: { id: organizationId },
            });

            if (!org) {
              request.log.error(
                { organizationId },
                "Organization not found for checkout",
              );
              break;
            }

            // Idempotency: skip if already ATIVO with same sub
            if (
              org.status === "ATIVO" &&
              org.stripeSubId === (session.subscription as string)
            ) {
              request.log.info(
                { organizationId },
                "Checkout already processed, skipping",
              );
              break;
            }

            await prisma.organization.update({
              where: { id: organizationId },
              data: {
                status: "ATIVO",
                stripeCustomerId: session.customer as string,
                stripeSubId: session.subscription as string,
                plano: plano as any,
                planoAtivoEm: new Date(),
                limiteUsuarios: plano === "INDIVIDUAL" ? 1 : org.limiteUsuarios,
              },
            });

            request.log.info(
              { organizationId, plano },
              "Organization activated via checkout",
            );
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionRaw =
              invoice.parent?.subscription_details?.subscription;
            const subscriptionId =
              typeof subscriptionRaw === "string"
                ? subscriptionRaw
                : subscriptionRaw?.id;

            if (!subscriptionId) {
              request.log.error("No subscription on failed invoice");
              break;
            }

            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const orgId = sub.metadata.organizationId;

            const org = await prisma.organization.findUnique({
              where: { id: orgId },
            });

            // Idempotency: skip if already SUSPENSO or CANCELADO
            if (
              !org ||
              org.status === "SUSPENSO" ||
              org.status === "CANCELADO"
            ) {
              break;
            }

            await prisma.organization.update({
              where: { id: orgId },
              data: { status: "SUSPENSO" },
            });

            request.log.info(
              { orgId },
              "Organization suspended due to payment failure",
            );
            break;
          }

          case "customer.subscription.deleted": {
            const sub = event.data.object as Stripe.Subscription;
            const org = await prisma.organization.findFirst({
              where: { stripeSubId: sub.id },
            });

            // Idempotency: skip if already CANCELADO
            if (!org || org.status === "CANCELADO") {
              break;
            }

            await prisma.organization.update({
              where: { id: org.id },
              data: { status: "CANCELADO" },
            });

            request.log.info(
              { orgId: org.id },
              "Organization cancelled via subscription deletion",
            );
            break;
          }

          default:
            request.log.info(
              { type: event.type },
              "Unhandled Stripe webhook event",
            );
        }
      } catch (err) {
        // Log but always return 200 to prevent Stripe retries
        request.log.error(
          { err, type: event.type },
          "Error processing Stripe webhook",
        );
      }

      return reply.code(200).send({ received: true });
    },
  );
}
