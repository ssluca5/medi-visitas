import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Webhook } from "svix";
import { prisma } from "../../lib/prisma";

interface ClerkUserData {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
}

interface ClerkUserDeletedData {
  id: string;
}

export default async function clerkWebhookRoutes(app: FastifyInstance) {
  app.post(
    "/webhooks/clerk",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        request.log.error("CLERK_WEBHOOK_SECRET not configured");
        return reply.code(500).send({ error: "Webhook secret not configured" });
      }

      // Verificar assinatura svix
      const svixId = request.headers["svix-id"] as string;
      const svixTimestamp = request.headers["svix-timestamp"] as string;
      const svixSignature = request.headers["svix-signature"] as string;

      if (!svixId || !svixTimestamp || !svixSignature) {
        return reply.code(400).send({ error: "Missing svix headers" });
      }

      const wh = new Webhook(WEBHOOK_SECRET);
      const body = JSON.stringify(request.body);

      let evt: { type: string; data: ClerkUserData | ClerkUserDeletedData };

      try {
        evt = wh.verify(body, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        }) as typeof evt;
      } catch (err) {
        request.log.error({ err }, "Webhook signature verification failed");
        return reply.code(400).send({ error: "Invalid signature" });
      }

      const { type, data } = evt;

      switch (type) {
        case "user.created":
        case "user.updated": {
          const userData = data as ClerkUserData;
          const email = userData.email_addresses[0]?.email_address;
          const name = [userData.first_name, userData.last_name]
            .filter(Boolean)
            .join(" ");

          if (!email) {
            request.log.warn({ clerkId: userData.id }, "User has no email");
            return reply.code(200).send({ received: true });
          }

          await prisma.user.upsert({
            where: { clerkId: userData.id },
            update: {
              email,
              name: name || null,
              deletedAt: null, // Reativar se estava soft-deleted
            },
            create: {
              clerkId: userData.id,
              email,
              name: name || null,
            },
          });

          request.log.info(
            { clerkId: userData.id, type },
            "User synced from Clerk",
          );
          break;
        }

        case "user.deleted": {
          const deletedData = data as ClerkUserDeletedData;

          await prisma.user.updateMany({
            where: { clerkId: deletedData.id },
            data: { deletedAt: new Date() },
          });

          request.log.info(
            { clerkId: deletedData.id },
            "User soft-deleted from Clerk webhook",
          );
          break;
        }

        default:
          request.log.info({ type }, "Unhandled Clerk webhook event");
      }

      return reply.code(200).send({ received: true });
    },
  );
}
