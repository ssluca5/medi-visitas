import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere } from "../../lib/tenant.js";
import { ListNotificacoesQuerySchema } from "./schemas.js";

const notificacoesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  // ────────────────────────────────────────────
  // 1. GET /contagem — REGISTRAR PRIMEIRO (estática)
  // ────────────────────────────────────────────
  app.get("/contagem", async (request, reply) => {
    const naoLidas = await prisma.notificacao.count({
      where: { ...buildTenantWhere(request), lida: false },
    });

    return { naoLidas };
  });

  // ────────────────────────────────────────────
  // 2. PATCH /marcar-todas-lidas — REGISTRAR ANTES de :id
  // ────────────────────────────────────────────
  app.patch("/marcar-todas-lidas", async (request, reply) => {
    const result = await prisma.notificacao.updateMany({
      where: { ...buildTenantWhere(request), lida: false },
      data: { lida: true, lidaEm: new Date() },
    });

    return { atualizadas: result.count };
  });

  // ────────────────────────────────────────────
  // 3. GET / — listagem com filtros e paginação
  // ────────────────────────────────────────────
  app.get("/", async (request, reply) => {
    const query = ListNotificacoesQuerySchema.parse(request.query);

    const where: any = buildTenantWhere(request);
    if (query.lida !== undefined) where.lida = query.lida;
    if (query.tipo) where.tipo = query.tipo;

    const [data, total, naoLidas] = await Promise.all([
      prisma.notificacao.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notificacao.count({ where }),
      prisma.notificacao.count({
        where: { ...buildTenantWhere(request), lida: false },
      }),
    ]);

    return {
      data,
      total,
      naoLidas,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    };
  });

  // ────────────────────────────────────────────
  // 4. PATCH /:id/lida — dinâmica
  // ────────────────────────────────────────────
  app.patch("/:id/lida", async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.notificacao.findFirst({
      where: { id, ...buildTenantWhere(request) },
    });

    if (!existing) {
      return reply.status(404).send({ error: "Notificação não encontrada" });
    }

    const updated = await prisma.notificacao.update({
      where: { id },
      data: { lida: true, lidaEm: new Date() },
    });

    return updated;
  });

  // ────────────────────────────────────────────
  // 5. DELETE /:id — soft delete, dinâmica
  // ────────────────────────────────────────────
  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.notificacao.findFirst({
      where: { id, ...buildTenantWhere(request) },
    });

    if (!existing) {
      return reply.status(404).send({ error: "Notificação não encontrada" });
    }

    await prisma.notificacao.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return reply.status(204).send();
  });
};

export default notificacoesRoutes;
