import type { FastifyInstance } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { getLimitesPlano } from "../../services/planos.js";
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

function requireGestaoEquipe(
  request: { plano?: string },
  reply: { status: (code: number) => { send: (body: unknown) => unknown } },
) {
  if (!getLimitesPlano(request.plano).temGestaoEquipe) {
    reply.status(402).send({
      error: "Gestao de equipe disponivel no Plano Equipe.",
      code: "FEATURE_NOT_AVAILABLE",
    });
    return false;
  }
  return true;
}

export default async function organizacaoRoutes(
  app: FastifyInstance,
): Promise<void> {
  // --- ROTAS PÚBLICAS ---
  // Obter info do convite via token (não requer auth)
  app.get("/convites/token/:token", async (request, reply) => {
    const { token } = request.params as { token: string };

    const convite = await prisma.organizationConvite.findUnique({
      where: { id: token },
      include: { organization: true },
    });

    if (!convite || convite.aceito || convite.expiradoEm < new Date()) {
      return reply.code(404).send({ error: "Convite inválido ou expirado." });
    }

    return reply.code(200).send({
      id: convite.id,
      email: convite.email,
      role: "MEMBER",
      organizationName: convite.organization.nome,
    });
  });

  // --- ROTAS AUTENTICADAS (Sem exigência de Tenant) ---
  app.register(async (authApp) => {
    authApp.addHook("preHandler", async (request, reply) => {
      await verifyClerkToken(request, reply);
    });

    // Aceitar convite
    authApp.post("/convites/token/:token/aceitar", async (request, reply) => {
      if (!request.userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const { token } = request.params as { token: string };

      const convite = await prisma.organizationConvite.findUnique({
        where: { id: token },
      });

      if (!convite || convite.aceito || convite.expiradoEm < new Date()) {
        return reply.code(404).send({ error: "Convite inválido ou expirado." });
      }

      await prisma.$transaction(async (tx) => {
        // 1. Atualiza convite
        await tx.organizationConvite.update({
          where: { id: convite.id },
          data: { aceito: true },
        });

        // 2. Remove da org atual (se tiver) - softDelete
        await tx.organizationMembro.updateMany({
          where: { userId: request.userId!, deletedAt: null },
          data: { deletedAt: new Date() },
        });

        // 3. Entra na nova
        await tx.organizationMembro.create({
          data: {
            organizationId: convite.organizationId,
            userId: request.userId!,
            role: "MEMBER",
          },
        });
      });

      return reply.code(200).send({ ok: true });
    });
  });

  // --- ROTAS PROTEGIDAS (Exigem Tenant) ---
  app.register(async (protectedApp) => {
    protectedApp.addHook("preHandler", async (request, reply) => {
      await verifyClerkToken(request, reply);
      if (!reply.sent) await resolveTenant(request, reply);
    });

    // GET /info — Informações da organização
    protectedApp.get("/info", async (request, reply) => {
      const org = await prisma.organization.findUnique({
        where: { id: request.organizationId! },
        select: {
          id: true,
          nome: true,
          plano: true,
          status: true,
          trialExpiraEm: true,
          createdAt: true,
          limiteUsuarios: true,
        },
      });

      if (!org) {
        return reply.status(404).send({ error: "Organização não encontrada" });
      }

      return reply.send(org);
    });

    // GET /membros — Listar membros (OWNER only)
    protectedApp.get("/membros", async (request, reply) => {
      if (!requireGestaoEquipe(request, reply)) return;
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

      const userIds = membros.map((m) => m.userId);
      const users = await prisma.user.findMany({
        where: { clerkId: { in: userIds } },
        select: { clerkId: true, name: true, email: true },
      });

      const userMap = new Map(users.map((u) => [u.clerkId, u]));

      const data = membros.map((m) => ({
        ...m,
        user: userMap.get(m.userId) || {
          name: "Usuário Desconhecido",
          email: "",
        },
      }));

      return reply.send({ data });
    });

    // GET /convites — Listar convites pendentes (OWNER only)
    protectedApp.get("/convites", async (request, reply) => {
      if (!requireGestaoEquipe(request, reply)) return;
      if (!requireOwner(request, reply)) return;

      const convites = await prisma.organizationConvite.findMany({
        where: { organizationId: request.organizationId, aceito: false },
        orderBy: { createdAt: "desc" },
      });

      return reply.send({ data: convites });
    });

    // POST /membros/convidar — Convidar membro (OWNER only)
    protectedApp.post(
      "/membros/convidar",
      { config: { rateLimit: { max: 5, timeWindow: "1 hour" } } },
      async (request, reply) => {
        if (!requireGestaoEquipe(request, reply)) return;
        if (!requireOwner(request, reply)) return;

        const { email } = ConvidarSchema.parse(request.body);

        // Check plan limits
        const org = await prisma.organization.findUnique({
          where: { id: request.organizationId },
        });
        if (!org) {
          return reply
            .status(404)
            .send({ error: "Organização não encontrada" });
        }

        const membrosAtivos = await prisma.organizationMembro.count({
          where: { organizationId: request.organizationId, deletedAt: null },
        });

        const convitesPendentes = await prisma.organizationConvite.count({
          where: { organizationId: request.organizationId, aceito: false },
        });

        if (membrosAtivos + convitesPendentes >= org.limiteUsuarios) {
          return reply.status(403).send({
            error: `Limite de ${org.limiteUsuarios} usuário(s) atingido (incluindo convites pendentes). Faça upgrade do plano.`,
          });
        }

        // Check if user already member by checking if user exists and has a membership
        const userExistente = await prisma.user.findUnique({
          where: { email },
          select: { clerkId: true },
        });

        if (userExistente) {
          const membroExistente = await prisma.organizationMembro.findFirst({
            where: {
              organizationId: request.organizationId,
              userId: userExistente.clerkId,
              deletedAt: null,
            },
          });
          if (membroExistente) {
            return reply
              .status(409)
              .send({ error: "Usuário já é membro desta organização" });
          }
        }

        // Check if there's already a pending invite for this email
        const conviteExistente = await prisma.organizationConvite.findFirst({
          where: {
            organizationId: request.organizationId,
            email,
            aceito: false,
          },
        });

        if (conviteExistente) {
          return reply
            .status(409)
            .send({ error: "Já existe um convite pendente para este email." });
        }

        // Expirar em 7 dias
        const expiradoEm = new Date();
        expiradoEm.setDate(expiradoEm.getDate() + 7);

        const convite = await prisma.organizationConvite.create({
          data: {
            organizationId: request.organizationId!,
            email,
            convidadoPorUserId: request.userId!,
            expiradoEm,
          },
        });

        return reply.status(201).send({ data: convite });
      },
    );

    // DELETE /convites/:id — Cancelar convite (OWNER only)
    protectedApp.delete("/convites/:id", async (request, reply) => {
      if (!requireGestaoEquipe(request, reply)) return;
      if (!requireOwner(request, reply)) return;

      const { id } = request.params as { id: string };

      const convite = await prisma.organizationConvite.findFirst({
        where: {
          id,
          organizationId: request.organizationId,
          aceito: false,
        },
      });

      if (!convite) {
        return reply
          .status(404)
          .send({ error: "Convite não encontrado ou já processado." });
      }

      await prisma.organizationConvite.delete({
        where: { id },
      });

      return reply.code(204).send();
    });

    // DELETE /membros/:userId — Remover membro (OWNER only)
    protectedApp.delete("/membros/:userId", async (request, reply) => {
      if (!requireGestaoEquipe(request, reply)) return;
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
    protectedApp.patch("/membros/:userId/role", async (request, reply) => {
      if (!requireGestaoEquipe(request, reply)) return;
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
  });
}
