import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import {
  PipelineQuerySchema,
  MetricasQuerySchema,
  EvolucaoQuerySchema,
  VisitasPeriodoQuerySchema,
} from "./schemas.js";
const ESTAGIOS = [
  "PROSPECTADO",
  "VISITADO",
  "INTERESSADO",
  "PRESCRITOR",
  "FIDELIZADO",
];
// ─── Funções puras de métricas ───────────────────────────
export async function calcularTaxaConversao(
  estagioOrigem,
  estagioDestino,
  dataInicio,
  dataFim,
  prismaClient,
) {
  const chegaram = await prismaClient.estagioLog.count({
    where: {
      estagioAnterior: estagioOrigem,
      estagioNovo: estagioDestino,
      createdAt: { gte: dataInicio, lte: dataFim },
    },
  });
  const sairamOrigem = await prismaClient.estagioLog.count({
    where: {
      estagioAnterior: estagioOrigem,
      createdAt: { gte: dataInicio, lte: dataFim },
    },
  });
  return sairamOrigem === 0 ? 0 : chegaram / sairamOrigem;
}
export async function profissionaisSemVisita(diasLimite, prismaClient) {
  const limite = new Date();
  limite.setDate(limite.getDate() - diasLimite);
  const comVisita = await prismaClient.visita.findMany({
    where: {
      status: "REALIZADA",
      dataVisita: { gte: limite },
    },
    select: { profissionalId: true },
    distinct: ["profissionalId"],
  });
  const idsComVisita = comVisita.map((v) => v.profissionalId);
  return prismaClient.profissional.count({
    where: {
      deletedAt: null,
      id: { notIn: idsComVisita },
    },
  });
}
// ─── Helpers de período ──────────────────────────────────
function getWeekKey(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function getWeekLabel(weekKey) {
  const parts = weekKey.split("-W");
  return `Semana ${parts[1]}`;
}
function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${meses[parseInt(month) - 1]} ${year}`;
}
function generatePeriodKeys(dataInicio, dataFim, granularidade) {
  const keys = [];
  const current = new Date(dataInicio);
  if (granularidade === "semana") {
    while (current <= dataFim) {
      const key = getWeekKey(current);
      if (!keys.includes(key)) keys.push(key);
      current.setDate(current.getDate() + 7);
    }
  } else {
    while (current <= dataFim) {
      const key = getMonthKey(current);
      if (!keys.includes(key)) keys.push(key);
      current.setMonth(current.getMonth() + 1);
    }
  }
  return keys;
}
// ─── Plugin principal ────────────────────────────────────
const pipelineRoutes = async (app) => {
  app.addHook("preHandler", verifyClerkToken);
  // ── GET /pipeline ─────────────────────────────────────
  app.get("/", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const query = PipelineQuerySchema.parse(request.query);
    const where = { deletedAt: null };
    if (query.busca) {
      where.OR = [
        { nome: { contains: query.busca, mode: "insensitive" } },
        { crm: { contains: query.busca, mode: "insensitive" } },
      ];
    }
    if (query.potencial) {
      where.potencial = query.potencial;
    }
    if (query.especialidadeId) {
      where.especialidadeId = query.especialidadeId;
    }
    const profissionais = await prisma.profissional.findMany({
      where,
      include: {
        especialidade: { select: { id: true, nome: true, categoria: true } },
        subEspecialidade: { select: { id: true, nome: true } },
        endereco: true,
      },
      orderBy: { nome: "asc" },
    });
    // Agrupar por estágio
    const data = {};
    const totaisPorEstagio = {};
    for (const estagio of ESTAGIOS) {
      data[estagio] = [];
      totaisPorEstagio[estagio] = 0;
    }
    for (const prof of profissionais) {
      const estagio = prof.estagioPipeline;
      if (data[estagio]) {
        data[estagio].push(prof);
        totaisPorEstagio[estagio]++;
      }
    }
    return {
      data,
      totaisPorEstagio,
      totalGeral: profissionais.length,
    };
  });
  // ── GET /pipeline/metricas ────────────────────────────
  app.get("/metricas", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const query = MetricasQuerySchema.parse(request.query);
    const dataFim = query.dataFim ?? new Date();
    const dataInicio =
      query.dataInicio ??
      new Date(dataFim.getTime() - 30 * 24 * 60 * 60 * 1000);
    // Totais
    const totalProfissionais = await prisma.profissional.count({
      where: { deletedAt: null },
    });
    const totalAtivos = await prisma.profissional.count({
      where: { deletedAt: null },
    });
    // Visitas no período
    const visitasRealizadas = await prisma.visita.count({
      where: {
        userId,
        status: "REALIZADA",
        dataVisita: { gte: dataInicio, lte: dataFim },
      },
    });
    const visitasPlanejadas = await prisma.visita.count({
      where: {
        userId,
        status: "AGENDADA",
        dataVisita: { gte: dataInicio, lte: dataFim },
      },
    });
    // Taxas de conversão
    const pares = [
      ["PROSPECTADO", "VISITADO"],
      ["VISITADO", "INTERESSADO"],
      ["INTERESSADO", "PRESCRITOR"],
      ["PRESCRITOR", "FIDELIZADO"],
    ];
    const taxas = await Promise.all(
      pares.map(([origem, destino]) =>
        calcularTaxaConversao(origem, destino, dataInicio, dataFim, prisma),
      ),
    );
    // Profissionais sem visita
    const semVisita = await profissionaisSemVisita(30, prisma);
    // Média de visitas por semana
    const semanas = Math.max(
      1,
      Math.ceil(
        (dataFim.getTime() - dataInicio.getTime()) / (7 * 24 * 60 * 60 * 1000),
      ),
    );
    const mediaVisitasPorSemana =
      Math.round((visitasRealizadas / semanas) * 10) / 10;
    return {
      totalProfissionais,
      totalAtivos,
      visitasRealizadas,
      visitasPlanejadas,
      taxaConversaoProspectadoVisitado: taxas[0],
      taxaConversaoVisitadoInteressado: taxas[1],
      taxaConversaoInteressadoPrescritor: taxas[2],
      taxaConversaoPrescritorFidelizado: taxas[3],
      profissionaisSemVisitaUltimos30Dias: semVisita,
      mediaVisitasPorSemana,
      periodo: {
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
      },
    };
  });
  // ── GET /pipeline/evolucao ────────────────────────────
  app.get("/evolucao", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const query = EvolucaoQuerySchema.parse(request.query);
    const { dataInicio, dataFim, granularidade } = query;
    // Buscar EstagioLogs no período
    const logs = await prisma.estagioLog.findMany({
      where: {
        createdAt: { gte: dataInicio, lte: dataFim },
      },
      orderBy: { createdAt: "asc" },
    });
    // Gerar chaves de período
    const periodKeys = generatePeriodKeys(dataInicio, dataFim, granularidade);
    // Inicializar contadores
    const contadores = {};
    for (const key of periodKeys) {
      contadores[key] = {};
      for (const estagio of ESTAGIOS) {
        contadores[key][estagio] = 0;
      }
    }
    // Contar transições por período
    for (const log of logs) {
      const key =
        granularidade === "semana"
          ? getWeekKey(log.createdAt)
          : getMonthKey(log.createdAt);
      if (contadores[key] && log.estagioNovo) {
        contadores[key][log.estagioNovo] =
          (contadores[key][log.estagioNovo] ?? 0) + 1;
      }
    }
    // Montar resposta
    const data = periodKeys.map((key) => ({
      periodo: key,
      label:
        granularidade === "semana" ? getWeekLabel(key) : getMonthLabel(key),
      ...contadores[key],
    }));
    return { data };
  });
  // ── GET /pipeline/visitas-por-periodo ─────────────────
  app.get("/visitas-por-periodo", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const query = VisitasPeriodoQuerySchema.parse(request.query);
    const { dataInicio, dataFim, granularidade } = query;
    // Buscar visitas no período
    const visitas = await prisma.visita.findMany({
      where: {
        userId,
        dataVisita: { gte: dataInicio, lte: dataFim },
      },
      select: { dataVisita: true, status: true },
      orderBy: { dataVisita: "asc" },
    });
    // Gerar chaves de período
    const periodKeys = generatePeriodKeys(dataInicio, dataFim, granularidade);
    // Inicializar contadores
    const contadores = {};
    for (const key of periodKeys) {
      contadores[key] = {
        AGENDADA: 0,
        REALIZADA: 0,
        CANCELADA: 0,
        NAO_REALIZADA: 0,
        total: 0,
      };
    }
    // Contar visitas por período e status
    for (const visita of visitas) {
      const key =
        granularidade === "semana"
          ? getWeekKey(visita.dataVisita)
          : getMonthKey(visita.dataVisita);
      if (contadores[key]) {
        contadores[key][visita.status]++;
        contadores[key]["total"]++;
      }
    }
    // Montar resposta
    const data = periodKeys.map((key) => ({
      periodo: key,
      label:
        granularidade === "semana" ? getWeekLabel(key) : getMonthLabel(key),
      ...contadores[key],
    }));
    return { data };
  });
  // ── GET /pipeline/exportar ────────────────────────────
  app.get("/exportar", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const profissionais = await prisma.profissional.findMany({
      where: { deletedAt: null },
      include: {
        especialidade: { select: { nome: true } },
        endereco: { select: { cidade: true, estado: true } },
        visitas: {
          where: { status: "REALIZADA" },
          orderBy: { dataVisita: "desc" },
          take: 1,
          select: { dataVisita: true },
        },
        _count: {
          select: { visitas: true },
        },
      },
      orderBy: { nome: "asc" },
    });
    const linhas = [
      [
        "Nome",
        "CRM/CRF/CRO",
        "Especialidade",
        "Potencial",
        "Estágio",
        "Última Visita",
        "Total de Visitas",
        "Cidade",
        "Estado",
      ].join(","),
      ...profissionais.map((p) => {
        const ultimaVisita = p.visitas[0]?.dataVisita;
        return [
          `"${p.nome}"`,
          p.crm ?? "",
          `"${p.especialidade?.nome ?? ""}"`,
          p.potencial,
          p.estagioPipeline,
          ultimaVisita
            ? new Date(ultimaVisita).toISOString().split("T")[0]
            : "",
          p._count.visitas,
          `"${p.endereco?.cidade ?? ""}"`,
          p.endereco?.estado ?? "",
        ].join(",");
      }),
    ];
    const hoje = new Date().toISOString().split("T")[0];
    return reply
      .header("Content-Type", "text/csv; charset=utf-8")
      .header(
        "Content-Disposition",
        `attachment; filename="pipeline-${hoje}.csv"`,
      )
      .send(linhas.join("\n"));
  });
};
export default pipelineRoutes;
