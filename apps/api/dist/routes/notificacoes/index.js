import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { ListNotificacoesQuerySchema } from "./schemas.js";
const notificacoesRoutes = async (app) => {
  app.addHook("preHandler", verifyClerkToken);
  // ────────────────────────────────────────────
  // 1. GET /contagem — REGISTRAR PRIMEIRO (estática)
  // ────────────────────────────────────────────
  app.get("/contagem", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const naoLidas = await prisma.notificacao.count({
      where: { userId, lida: false, deletedAt: null },
    });
    return { naoLidas };
  });
  // ────────────────────────────────────────────
  // 2. PATCH /marcar-todas-lidas — REGISTRAR ANTES de :id
  // ────────────────────────────────────────────
  app.patch("/marcar-todas-lidas", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const result = await prisma.notificacao.updateMany({
      where: { userId, lida: false, deletedAt: null },
      data: { lida: true, lidaEm: new Date() },
    });
    return { atualizadas: result.count };
  });
  // ────────────────────────────────────────────
  // 3. GET / — listagem com filtros e paginação
  // ────────────────────────────────────────────
  app.get("/", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const query = ListNotificacoesQuerySchema.parse(request.query);
    const where = { userId, deletedAt: null };
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
        where: { userId, lida: false, deletedAt: null },
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
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const { id } = request.params;
    const existing = await prisma.notificacao.findFirst({
      where: { id, userId, deletedAt: null },
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
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const { id } = request.params;
    const existing = await prisma.notificacao.findFirst({
      where: { id, userId, deletedAt: null },
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
