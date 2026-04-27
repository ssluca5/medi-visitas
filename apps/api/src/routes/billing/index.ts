import type { FastifyPluginAsync } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { stripe, criarCheckout, criarPortal } from "../../services/stripe.js";
import { z } from "zod";

const CheckoutSchema = z.object({
  plano: z.enum(["INDIVIDUAL", "EMPRESA"]),
});

const billingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", verifyClerkToken);
  app.addHook("preHandler", resolveTenant);

  // POST /billing/checkout
  app.post("/checkout", async (request, reply) => {
    if (request.role !== "OWNER") {
      return reply
        .status(403)
        .send({ error: "Apenas o proprietário pode assinar" });
    }

    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId! },
    });

    if (!org) {
      return reply.status(404).send({ error: "Organização não encontrada" });
    }

    if (org.status === "ATIVO") {
      return reply
        .status(409)
        .send({ error: "Organização já possui assinatura ativa" });
    }

    const body = CheckoutSchema.parse(request.body);

    try {
      const checkoutUrl = await criarCheckout(
        org.id,
        org.stripeCustomerId,
        body.plano,
        request.userId!,
      );
      return reply.send({ checkoutUrl });
    } catch (err) {
      request.log.error({ err }, "Stripe checkout creation failed");
      return reply
        .status(502)
        .send({ error: "Erro ao criar sessão de checkout" });
    }
  });

  // POST /billing/portal
  app.post("/portal", async (request, reply) => {
    if (request.role !== "OWNER") {
      return reply
        .status(403)
        .send({ error: "Apenas o proprietário pode gerenciar assinatura" });
    }

    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId! },
    });

    if (!org) {
      return reply.status(404).send({ error: "Organização não encontrada" });
    }

    if (!org.stripeCustomerId) {
      return reply
        .status(400)
        .send({ error: "Organização não possui assinatura ativa" });
    }

    try {
      const portalUrl = await criarPortal(org.stripeCustomerId);
      return reply.send({ portalUrl });
    } catch (err) {
      request.log.error({ err }, "Stripe portal creation failed");
      return reply
        .status(502)
        .send({ error: "Erro ao criar portal de gerenciamento" });
    }
  });

  // GET /billing/status
  app.get("/status", async (request, reply) => {
    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId! },
    });

    if (!org) {
      return reply.status(404).send({ error: "Organização não encontrada" });
    }

    let proximaCobranca: string | null = null;
    if (org.stripeSubId) {
      try {
        const sub = await stripe.subscriptions.retrieve(org.stripeSubId);
        const periodEnd = sub.items.data[0]?.current_period_end;
        if (periodEnd) {
          proximaCobranca = new Date(periodEnd * 1000).toISOString();
        }
      } catch {
        // Subscription may have been deleted — ignore
      }
    }

    const usuariosAtivos = await prisma.organizationMembro.count({
      where: { organizationId: org.id, deletedAt: null },
    });

    return reply.send({
      plano: org.plano,
      status: org.status,
      trialExpiraEm: org.trialExpiraEm.toISOString(),
      proximaCobranca,
      limiteUsuarios: org.limiteUsuarios,
      usuariosAtivos,
    });
  });
};

export default billingRoutes;
