import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import {
  CreateAgendaItemSchema,
  UpdateAgendaItemSchema,
  ListAgendaQuerySchema,
  VincularVisitaSchema,
  SugestoesQuerySchema,
} from "./schemas.js";
function calcularPontuacao(potencial, diasSemVisita) {
  const pesoPotencial = {
    ESTRATEGICO: 40,
    ALTO: 30,
    MEDIO: 20,
    BAIXO: 10,
  };
  const pp = pesoPotencial[potencial] ?? 10;
  let pesoTempo;
  if (diasSemVisita === null) {
    pesoTempo = 50; // nunca visitado — máxima prioridade
  } else if (diasSemVisita > 60) {
    pesoTempo = 40;
  } else if (diasSemVisita > 30) {
    pesoTempo = 30;
  } else if (diasSemVisita > 15) {
    pesoTempo = 20;
  } else {
    pesoTempo = 10;
  }
  return pp + pesoTempo;
}
const agendaRoutes = async (app) => {
  app.addHook("preHandler", verifyClerkToken);
  // ────────────────────────────────────────────
  // 1. GET /sugestoes — REGISTRAR ANTES de /:id
  // ────────────────────────────────────────────
  app.get("/sugestoes", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const query = SugestoesQuerySchema.parse(request.query);
    const dataInicio = new Date(query.dataInicio);
    const dataFim = new Date(query.dataFim);
    // Profissionais já agendados (PLANEJADO) no período — excluir das sugestões
    const jaAgendados = await prisma.agendaItem.findMany({
      where: {
        userId,
        deletedAt: null,
        status: "PLANEJADO",
        dataHoraInicio: { gte: dataInicio, lte: dataFim },
      },
      select: { profissionalId: true },
    });
    const idsJaAgendados = [
      ...new Set(jaAgendados.map((a) => a.profissionalId)),
    ];
    // Buscar profissionais elegíveis
    const whereClause = {
      deletedAt: null,
      estagioPipeline: {
        in: ["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR"],
      },
    };
    if (idsJaAgendados.length > 0) {
      whereClause.id = { notIn: idsJaAgendados };
    }
    const profissionais = await prisma.profissional.findMany({
      where: whereClause,
      include: {
        especialidade: { select: { nome: true } },
        visitas: {
          where: { status: "REALIZADA" },
          orderBy: { dataVisita: "desc" },
          take: 1,
          select: { dataVisita: true },
        },
      },
    });
    // Calcular pontuação e dias sem visita
    const agora = new Date();
    const sugestoes = profissionais.map((p) => {
      const ultimaVisita =
        p.visitas.length > 0 ? p.visitas[0].dataVisita : null;
      const diasSemVisita = ultimaVisita
        ? Math.floor(
            (agora.getTime() - ultimaVisita.getTime()) / (1000 * 60 * 60 * 24),
          )
        : null;
      return {
        profissional: {
          id: p.id,
          nome: p.nome,
          potencial: p.potencial,
          estagioPipeline: p.estagioPipeline,
          especialidadeId: p.especialidadeId,
          especialidade: p.especialidade,
        },
        diasSemVisita,
        pontuacao: calcularPontuacao(p.potencial, diasSemVisita),
      };
    });
    // Ordenar por pontuação DESC, nome ASC
    sugestoes.sort((a, b) => {
      if (b.pontuacao !== a.pontuacao) return b.pontuacao - a.pontuacao;
      return a.profissional.nome.localeCompare(b.profissional.nome);
    });
    return { data: sugestoes };
  });
  // ────────────────────────────────────────────
  // 2. GET / — lista por período
  // ────────────────────────────────────────────
  app.get("/", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const query = ListAgendaQuerySchema.parse(request.query);
    const where = {
      userId,
      deletedAt: null,
      dataHoraInicio: {
        gte: new Date(query.dataInicio),
        lte: new Date(query.dataFim),
      },
    };
    if (query.status) where.status = query.status;
    if (query.profissionalId) where.profissionalId = query.profissionalId;
    const [items, total] = await Promise.all([
      prisma.agendaItem.findMany({
        where,
        include: {
          profissional: {
            select: {
              id: true,
              nome: true,
              potencial: true,
              estagioPipeline: true,
              especialidade: { select: { nome: true } },
            },
          },
        },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { dataHoraInicio: "asc" },
      }),
      prisma.agendaItem.count({ where }),
    ]);
    return {
      data: items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  });
  // ────────────────────────────────────────────
  // 3. POST / — criar agendamento
  // ────────────────────────────────────────────
  app.post("/", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const input = CreateAgendaItemSchema.parse(request.body);
    // Validar profissional existe e não está deletado
    const profissional = await prisma.profissional.findFirst({
      where: { id: input.profissionalId, deletedAt: null },
    });
    if (!profissional) {
      return reply.status(404).send({ error: "Profissional não encontrado" });
    }
    const item = await prisma.agendaItem.create({
      data: {
        userId,
        profissionalId: input.profissionalId,
        dataHoraInicio: new Date(input.dataHoraInicio),
        dataHoraFim: new Date(input.dataHoraFim),
        prioridade: input.prioridade,
        observacoes: input.observacoes ?? null,
      },
      include: {
        profissional: {
          select: {
            id: true,
            nome: true,
            potencial: true,
            especialidade: { select: { nome: true } },
          },
        },
      },
    });
    return reply.status(201).send(item);
  });
  // ────────────────────────────────────────────
  // 4. GET /:id — detalhe com profissional
  // ────────────────────────────────────────────
  app.get("/:id", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const { id } = request.params;
    const item = await prisma.agendaItem.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        profissional: {
          select: {
            id: true,
            nome: true,
            potencial: true,
            estagioPipeline: true,
            especialidade: { select: { nome: true } },
          },
        },
        visita: true,
      },
    });
    if (!item) {
      return reply.status(404).send({ error: "Item de agenda não encontrado" });
    }
    return item;
  });
  // ────────────────────────────────────────────
  // 5. PUT /:id — atualizar agendamento
  // ────────────────────────────────────────────
  app.put("/:id", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const { id } = request.params;
    const input = UpdateAgendaItemSchema.parse(request.body);
    const existing = await prisma.agendaItem.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!existing) {
      return reply.status(404).send({ error: "Item de agenda não encontrado" });
    }
    const data = { ...input };
    if (data.dataHoraInicio)
      data.dataHoraInicio = new Date(data.dataHoraInicio);
    if (data.dataHoraFim) data.dataHoraFim = new Date(data.dataHoraFim);
    const item = await prisma.agendaItem.update({
      where: { id },
      data,
      include: {
        profissional: {
          select: {
            id: true,
            nome: true,
            potencial: true,
            especialidade: { select: { nome: true } },
          },
        },
      },
    });
    return item;
  });
  // ────────────────────────────────────────────
  // 6. DELETE /:id — soft delete
  // ────────────────────────────────────────────
  app.delete("/:id", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const { id } = request.params;
    const existing = await prisma.agendaItem.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!existing) {
      return reply.status(404).send({ error: "Item de agenda não encontrado" });
    }
    await prisma.agendaItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return reply.status(204).send();
  });
  // ────────────────────────────────────────────
  // 7. PATCH /:id/vincular-visita
  // ────────────────────────────────────────────
  app.patch("/:id/vincular-visita", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const { id } = request.params;
    const input = VincularVisitaSchema.parse(request.body);
    const agendaItem = await prisma.agendaItem.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!agendaItem) {
      return reply.status(404).send({ error: "Item de agenda não encontrado" });
    }
    // Validar que a visita existe
    const visita = await prisma.visita.findUnique({
      where: { id: input.visitaId },
    });
    if (!visita) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }
    // Validar que o profissionalId da visita é o mesmo do AgendaItem
    if (visita.profissionalId !== agendaItem.profissionalId) {
      return reply.status(400).send({
        error: "O profissional da visita não corresponde ao do agendamento",
      });
    }
    const updated = await prisma.agendaItem.update({
      where: { id },
      data: {
        visitaId: input.visitaId,
        status: "REALIZADO",
      },
      include: {
        profissional: {
          select: { id: true, nome: true },
        },
        visita: true,
      },
    });
    return updated;
  });
};
export default agendaRoutes;
