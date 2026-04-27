import type { FastifyInstance } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { z } from "zod";

const ConvidarSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["MEMBER", "OWNER"]).default("MEMBER"),
});

const AlterarRoleSchema = z.object({
  role: z.enum(["MEMBER", "OWNER"]),
});

function requireOwner(
  request: { role?: string },
  reply: { status: (code: number) => { send: (body: unknown) => unknown } },
) {
  if (request.role !== "OWNER") {
    reply
      .status(403)
      .send({ error: "Apenas o proprietário pode gerenciar membros" });
    return false;
  }
  return true;
}

export default async function organizacaoRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  // GET /membros — Listar membros (OWNER only)
  app.get("/membros", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const membros = await prisma.organizationMembro.findMany({
      where: { organizationId: request.organizationId, deletedAt: null },
      select: {
        id: true,
        userId: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return reply.send({ data: membros });
  });

  // POST /membros/convidar — Convidar membro (OWNER only)
  app.post("/membros/convidar", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const { email, role } = ConvidarSchema.parse(request.body);

    // Check plan limits
    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId },
    });
    if (!org) {
      return reply.status(404).send({ error: "Organização não encontrada" });
    }

    const membrosAtivos = await prisma.organizationMembro.count({
      where: { organizationId: request.organizationId, deletedAt: null },
    });

    if (membrosAtivos >= org.limiteUsuarios) {
      return reply.status(403).send({
        error: `Limite de ${org.limiteUsuarios} usuário(s) atingido. Faça upgrade do plano.`,
      });
    }

    // Check if user already member
    const existente = await prisma.organizationMembro.findFirst({
      where: {
        organizationId: request.organizationId,
        userId: email,
        deletedAt: null,
      },
    });
    if (existente) {
      return reply
        .status(409)
        .send({ error: "Usuário já é membro desta organização" });
    }

    const membro = await prisma.organizationMembro.create({
      data: {
        organizationId: request.organizationId!,
        userId: email,
        role,
      },
    });

    return reply.status(201).send({ data: membro });
  });

  // DELETE /membros/:userId — Remover membro (OWNER only)
  app.delete("/membros/:userId", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const { userId } = request.params as { userId: string };

    // Cannot remove self
    if (userId === request.userId) {
      return reply
        .status(400)
        .send({ error: "Você não pode remover a si mesmo" });
    }

    const membro = await prisma.organizationMembro.findFirst({
      where: {
        organizationId: request.organizationId,
        userId,
        deletedAt: null,
      },
    });

    if (!membro) {
      return reply.status(404).send({ error: "Membro não encontrado" });
    }

    await prisma.organizationMembro.update({
      where: { id: membro.id },
      data: { deletedAt: new Date() },
    });

    return reply.code(204).send();
  });

  // PATCH /membros/:userId/role — Alterar role (OWNER only)
  app.patch("/membros/:userId/role", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const { userId } = request.params as { userId: string };
    const { role } = AlterarRoleSchema.parse(request.body);

    const membro = await prisma.organizationMembro.findFirst({
      where: {
        organizationId: request.organizationId,
        userId,
        deletedAt: null,
      },
    });

    if (!membro) {
      return reply.status(404).send({ error: "Membro não encontrado" });
    }

    const atualizado = await prisma.organizationMembro.update({
      where: { id: membro.id },
      data: { role },
    });

    return reply.send({ data: atualizado });
  });
}
