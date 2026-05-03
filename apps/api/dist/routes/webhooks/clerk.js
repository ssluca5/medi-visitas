import { Webhook } from "svix";
import { prisma } from "../../lib/prisma";
export default async function clerkWebhookRoutes(app) {
    app.post("/webhooks/clerk", async (request, reply) => {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            request.log.error("CLERK_WEBHOOK_SECRET not configured");
            return reply.code(500).send({ error: "Webhook secret not configured" });
        }
        // Verificar assinatura svix
        const svixId = request.headers["svix-id"];
        const svixTimestamp = request.headers["svix-timestamp"];
        const svixSignature = request.headers["svix-signature"];
        if (!svixId || !svixTimestamp || !svixSignature) {
            return reply.code(400).send({ error: "Missing svix headers" });
        }
        const wh = new Webhook(WEBHOOK_SECRET);
        const body = JSON.stringify(request.body);
        let evt;
        try {
            evt = wh.verify(body, {
                "svix-id": svixId,
                "svix-timestamp": svixTimestamp,
                "svix-signature": svixSignature,
            });
        }
        catch (err) {
            request.log.error({ err }, "Webhook signature verification failed");
            return reply.code(400).send({ error: "Invalid signature" });
        }
        const { type, data } = evt;
        switch (type) {
            case "user.created":
            case "user.updated": {
                const userData = data;
                const email = userData.email_addresses[0]?.email_address;
                const name = [userData.first_name, userData.last_name]
                    .filter(Boolean)
                    .join(" ");
                if (!email) {
                    request.log.warn({ clerkId: userData.id }, "User has no email");
                    return reply.code(200).send({ received: true });
                }
                // Verificar se usuário existe e não está soft-deleted antes de reativar
                const existingUser = await prisma.user.findUnique({
                    where: { clerkId: userData.id },
                });
                if (existingUser && existingUser.deletedAt !== null) {
                    await prisma.user.update({
                        where: { clerkId: userData.id },
                        data: { email, name: name || null, deletedAt: null },
                    });
                }
                else if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            clerkId: userData.id,
                            email,
                            name: name || null,
                        },
                    });
                }
                else {
                    await prisma.user.update({
                        where: { clerkId: userData.id },
                        data: { email, name: name || null },
                    });
                }
                request.log.info({ clerkId: userData.id, type }, "User synced from Clerk");
                break;
            }
            case "user.deleted": {
                const deletedData = data;
                await prisma.user.updateMany({
                    where: { clerkId: deletedData.id },
                    data: { deletedAt: new Date() },
                });
                request.log.info({ clerkId: deletedData.id }, "User soft-deleted from Clerk webhook");
                break;
            }
            default:
                request.log.info({ type }, "Unhandled Clerk webhook event");
        }
        return reply.code(200).send({ received: true });
    });
}
