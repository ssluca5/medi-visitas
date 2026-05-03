import { verifyClerkToken } from "../hooks/auth.js";
import { prisma } from "../lib/prisma.js";
export default async function meRoutes(app) {
    app.get("/me", { preHandler: [verifyClerkToken] }, async (request, reply) => {
        if (!request.userId) {
            return reply.code(401).send({ error: "Unauthorized" });
        }
        // Upsert: criar User se não existir (dados vêm do JWT)
        const user = await prisma.user.upsert({
            where: { clerkId: request.userId },
            update: {
                // Atualizar email/nome caso tenham mudado no Clerk
                ...(request.userEmail ? { email: request.userEmail } : {}),
                ...(request.userName ? { name: request.userName } : {}),
            },
            create: {
                clerkId: request.userId,
                email: request.userEmail ?? `${request.userId}@placeholder.local`,
                name: request.userName ?? null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                tourConcluidoEm: true,
            },
        });
        // Buscar membership para organizationId e role
        const membro = await prisma.organizationMembro.findFirst({
            where: { userId: request.userId, deletedAt: null },
            select: {
                organizationId: true,
                role: true,
                organization: {
                    select: {
                        plano: true,
                        transcricoesUsadas: true,
                        transcricoesMes: true,
                        transcricoesExtras: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return reply.code(200).send({
            id: user.id,
            email: user.email,
            name: user.name,
            organizationId: membro?.organizationId ?? null,
            role: membro?.role ?? null,
            tourConcluidoEm: user.tourConcluidoEm,
            organization: membro?.organization ?? null,
        });
    });
    // Marcar tour como concluído
    app.patch("/me/tour", { preHandler: [verifyClerkToken] }, async (request, reply) => {
        if (!request.userId) {
            return reply.code(401).send({ error: "Unauthorized" });
        }
        // Upsert para garantir que User existe antes de atualizar
        await prisma.user.upsert({
            where: { clerkId: request.userId },
            update: { tourConcluidoEm: new Date() },
            create: {
                clerkId: request.userId,
                email: request.userEmail ?? `${request.userId}@placeholder.local`,
                name: request.userName ?? null,
                tourConcluidoEm: new Date(),
            },
        });
        return reply.code(200).send({ ok: true });
    });
}
