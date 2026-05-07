import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere } from "../../lib/tenant.js";

// ─── Tipos ──────────────────────────────────────────────

type AlertaTipo =
  | "SEM_VISITA_30_DIAS"
  | "SEM_VISITA_60_DIAS"
  | "VISITA_ATRASADA"
  | "AGENDAMENTO_HOJE"
  | "PROSPECTADO_SEM_VISITA";

type AlertaSeveridade = "info" | "warning" | "danger";

interface Alerta {
  tipo: AlertaTipo;
  severidade: AlertaSeveridade;
  profissionalId: string;
  profissionalNome: string;
  mensagem: string;
  dataReferencia?: string;
}

// ─── Pure helper (usado por /alertas) ──────────────────

export function buildAlertas(params: {
  profissionaisComVisitas: Array<{
    id: string;
    nome: string;
    estagioPipeline: string;
    visitas: Array<{ dataVisita: Date }>;
  }>;
  agendaAtrasados: Array<{
    id: string;
    profissionalId: string;
    profissional: { nome: string };
    dataHoraInicio: Date;
  }>;
  agendaHoje: Array<{
    id: string;
    profissionalId: string;
    profissional: { nome: string };
    dataHoraInicio: Date;
  }>;
  prospectadosSemVisita: Array<{ id: string; nome: string }>;
  agora: Date;
}): Alerta[] {
  const alertas: Alerta[] = [];

  for (const p of params.profissionaisComVisitas) {
    const ultimaVisita = p.visitas[0]?.dataVisita;
    if (!ultimaVisita) continue;

    const diasSemVisita = Math.floor(
      (params.agora.getTime() - ultimaVisita.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diasSemVisita > 60) {
      alertas.push({
        tipo: "SEM_VISITA_60_DIAS",
        severidade: "danger",
        profissionalId: p.id,
        profissionalNome: p.nome,
        mensagem: `Sem visita há ${diasSemVisita} dias`,
        dataReferencia: ultimaVisita.toISOString(),
      });
    } else if (diasSemVisita > 30) {
      alertas.push({
        tipo: "SEM_VISITA_30_DIAS",
        severidade: "warning",
        profissionalId: p.id,
        profissionalNome: p.nome,
        mensagem: `Sem visita há ${diasSemVisita} dias`,
        dataReferencia: ultimaVisita.toISOString(),
      });
    }
  }

  for (const a of params.agendaAtrasados) {
    alertas.push({
      tipo: "VISITA_ATRASADA",
      severidade: "danger",
      profissionalId: a.profissionalId,
      profissionalNome: a.profissional.nome,
      mensagem: "Visita agendada não realizada",
      dataReferencia: a.dataHoraInicio.toISOString(),
    });
  }

  for (const a of params.agendaHoje) {
    alertas.push({
      tipo: "AGENDAMENTO_HOJE",
      severidade: "info",
      profissionalId: a.profissionalId,
      profissionalNome: a.profissional.nome,
      mensagem: "Agendamento para hoje",
      dataReferencia: a.dataHoraInicio.toISOString(),
    });
  }

  for (const p of params.prospectadosSemVisita) {
    alertas.push({
      tipo: "PROSPECTADO_SEM_VISITA",
      severidade: "info",
      profissionalId: p.id,
      profissionalNome: p.nome,
      mensagem: "Prospectado sem nenhuma visita registrada",
    });
  }

  return alertas;
}

// ─── Helpers de data ────────────────────────────────────

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function startOfWeek(d: Date): Date {
  const r = startOfDay(d);
  const day = r.getDay();
  const diff = day === 0 ? -6 : 1 - day; // segunda-feira
  r.setDate(r.getDate() + diff);
  return r;
}

function endOfWeek(d: Date): Date {
  const r = startOfWeek(d);
  r.setDate(r.getDate() + 7);
  return r;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

// ─── Constantes ─────────────────────────────────────────

const META_DIARIA = 8;
const META_SEMANAL = 40;
const META_MENSAL = 160;

// ─── Plugin principal ───────────────────────────────────

const dashboardRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  // ── GET /dashboard/resumo ───────────────────────────
  app.get("/resumo", async (request) => {
    const { profissionalId } = request.query as {
      profissionalId?: string;
    };

    const agora = new Date();
    const hoje = startOfDay(agora);
    const amanha = startOfDay(new Date(agora.getTime() + 86400000));
    const inicioSemana = startOfWeek(agora);
    const fimSemana = endOfWeek(agora);
    const inicioMes = startOfMonth(agora);
    const fimMes = endOfMonth(agora);
    const trintaDiasAtras = new Date(agora.getTime() - 30 * 86400000);
    const sessentaDiasAtras = new Date(agora.getTime() - 60 * 86400000);

    const tenantWhere = buildTenantWhere(request);
    const tenantWhereVisita = {
      organizationId: request.organizationId,
      ...(request.role === "MEMBER" ? { userId: request.userId } : {}),
    };

    const profFilter = profissionalId ? { profissionalId } : {};

    // ── Queries paralelas ──────────────────────────────

    const [
      profissionaisAtivos,
      pipelineGroupBy,
      visitasHojeCount,
      visitasSemanaCount,
      visitasMesCount,
      proximasVisitasRaw,
      ultimasVisitasRaw,
      profissionaisComUltimaVisita,
      profissionaisComLog,
    ] = await Promise.all([
      // Total de profissionais ativos
      prisma.profissional.count({ where: tenantWhere }),

      // Pipeline agrupado por estágio
      prisma.profissional.groupBy({
        by: ["estagioPipeline"],
        where: tenantWhere,
        _count: { id: true },
      }),

      // Visitas hoje
      prisma.visita.count({
        where: {
          ...tenantWhereVisita,
          ...profFilter,
          status: { not: "CANCELADA" },
          dataVisita: { gte: hoje, lt: amanha },
        },
      }),

      // Visitas na semana
      prisma.visita.count({
        where: {
          ...tenantWhereVisita,
          ...profFilter,
          status: { not: "CANCELADA" },
          dataVisita: { gte: inicioSemana, lt: fimSemana },
        },
      }),

      // Visitas no mês
      prisma.visita.count({
        where: {
          ...tenantWhereVisita,
          ...profFilter,
          status: { not: "CANCELADA" },
          dataVisita: { gte: inicioMes, lt: fimMes },
        },
      }),

      // Próximas visitas (agenda futura)
      prisma.agendaItem.findMany({
        where: {
          ...buildTenantWhere(request),
          ...profFilter,
          status: { in: ["PLANEJADO", "CONFIRMADO"] },
          dataHoraInicio: { gte: agora },
        },
        orderBy: { dataHoraInicio: "asc" },
        take: 5,
        include: {
          profissional: {
            select: {
              id: true,
              nome: true,
              especialidade: { select: { nome: true } },
            },
          },
        },
      }),

      // Últimas visitas realizadas
      prisma.visita.findMany({
        where: {
          ...tenantWhereVisita,
          ...profFilter,
          status: { not: "CANCELADA" },
        },
        orderBy: { dataVisita: "desc" },
        take: 5,
        include: {
          profissional: {
            select: {
              id: true,
              nome: true,
              especialidade: { select: { nome: true } },
            },
          },
        },
      }),

      // Profissionais com data da última visita (para alertas e lista "sem visita")
      prisma.profissional.findMany({
        where: {
          ...tenantWhere,
          ...(profissionalId ? { id: profissionalId } : {}),
        },
        select: {
          id: true,
          nome: true,
          estagioPipeline: true,
          especialidade: { select: { nome: true } },
          visitas: {
            where: { status: "REALIZADA" },
            orderBy: { dataVisita: "desc" },
            take: 1,
            select: { dataVisita: true },
          },
        },
      }),

      // Profissionais sem visita há 30+ dias (para a lista completa)
      // Usamos a mesma query acima e filtramos em memória

      // Profissionais com log de estágio (para alerta ESTAGIO_PARADO)
      prisma.profissional.findMany({
        where: {
          ...tenantWhere,
          ...(profissionalId ? { id: profissionalId } : {}),
          estagioPipeline: { not: "PROSPECTADO" },
        },
        select: {
          id: true,
          nome: true,
          estagioPipeline: true,
          especialidade: { select: { nome: true } },
          createdAt: true,
          estagioLogs: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { createdAt: true },
          },
        },
      }),
    ]);

    // ── Pipeline counts ────────────────────────────────

    const pipeline = {
      PROSPECTADO: 0,
      VISITADO: 0,
      INTERESSADO: 0,
      PRESCRITOR: 0,
      FIDELIZADO: 0,
    };

    for (const g of pipelineGroupBy) {
      pipeline[g.estagioPipeline as keyof typeof pipeline] = g._count.id;
    }

    const totalPipeline = Object.values(pipeline).reduce((a, b) => a + b, 0);

    // ── KPIs ────────────────────────────────────────────

    const prescritorFidelizado = pipeline.PRESCRITOR + pipeline.FIDELIZADO;
    const taxaConversao =
      totalPipeline > 0
        ? Math.round((prescritorFidelizado / totalPipeline) * 100)
        : 0;

    // Médicos sem visita há 30+ dias
    const medicosSemVisitaList = profissionaisComUltimaVisita
      .map((p) => {
        const ultima = p.visitas[0]?.dataVisita;
        const diasSemVisita = ultima
          ? Math.floor(
              (agora.getTime() - ultima.getTime()) / (1000 * 60 * 60 * 24),
            )
          : 999; // nunca visitado
        return {
          id: p.id,
          nome: p.nome,
          especialidade: p.especialidade?.nome ?? "",
          diasSemVisita,
          estagioPipeline: p.estagioPipeline,
        };
      })
      .filter((m) => m.diasSemVisita > 30)
      .sort((a, b) => b.diasSemVisita - a.diasSemVisita)
      .slice(0, 10);

    const medicosSemVisita30d = medicosSemVisitaList.length;

    const kpis = {
      visitasHoje: visitasHojeCount,
      metaDiaria: profissionalId ? 1 : META_DIARIA,
      visitasSemana: visitasSemanaCount,
      metaSemanal: profissionalId ? 5 : META_SEMANAL,
      visitasMes: visitasMesCount,
      metaMensal: profissionalId ? 20 : META_MENSAL,
      medicosSemVisita30d,
      taxaConversao,
    };

    // ── Próximas visitas (formatadas) ──────────────────

    const proximasVisitas = proximasVisitasRaw.map((a) => ({
      id: a.id,
      profissionalId: a.profissionalId,
      profissionalNome: a.profissional.nome,
      especialidade: a.profissional.especialidade?.nome ?? "",
      dataHora: a.dataHoraInicio.toISOString(),
      prioridade: a.prioridade,
      status: a.status,
    }));

    // ── Últimas visitas (formatadas) ───────────────────

    const ultimasVisitas = ultimasVisitasRaw.map((v) => ({
      id: v.id,
      profissionalId: v.profissionalId,
      profissionalNome: v.profissional.nome,
      especialidade: v.profissional.especialidade?.nome ?? "",
      dataHora: v.dataVisita.toISOString(),
      status: v.status,
      resumo: v.resumo,
    }));

    // ── Alertas ─────────────────────────────────────────

    const alertas: Array<{
      tipo: "SEM_VISITA" | "META_EM_RISCO" | "ESTAGIO_PARADO";
      profissionalId: string;
      profissionalNome: string;
      descricao: string;
      urgencia: "alta" | "media";
    }> = [];

    // SEM_VISITA: 30+ dias sem visita
    for (const m of medicosSemVisitaList) {
      alertas.push({
        tipo: "SEM_VISITA",
        profissionalId: m.id,
        profissionalNome: m.nome,
        descricao: `${m.nome} está há ${m.diasSemVisita} dias sem visita`,
        urgencia: m.diasSemVisita > 60 ? "alta" : "media",
      });
    }

    // META_EM_RISCO: quinta ou sexta e meta semanal < 60%
    const diaDaSemana = agora.getDay(); // 0=dom, 4=qui, 5=sex
    if (diaDaSemana === 4 || diaDaSemana === 5) {
      const progresso =
        kpis.metaSemanal > 0 ? visitasSemanaCount / kpis.metaSemanal : 0;
      if (progresso < 0.6) {
        alertas.push({
          tipo: "META_EM_RISCO",
          profissionalId: "",
          profissionalNome: "",
          descricao: `Meta semanal em risco: ${Math.round(progresso * 100)}% cumprida (${visitasSemanaCount}/${kpis.metaSemanal})`,
          urgencia: "alta",
        });
      }
    }

    // ESTAGIO_PARADO: mesmo estágio há 60+ dias
    for (const p of profissionaisComLog) {
      const ultimaMudanca = p.estagioLogs[0]?.createdAt ?? p.createdAt;
      if (ultimaMudanca < sessentaDiasAtras) {
        const diasParado = Math.floor(
          (agora.getTime() - ultimaMudanca.getTime()) / (1000 * 60 * 60 * 24),
        );
        alertas.push({
          tipo: "ESTAGIO_PARADO",
          profissionalId: p.id,
          profissionalNome: p.nome,
          descricao: `${p.nome} está no estágio "${p.estagioPipeline}" há ${diasParado} dias sem mudança`,
          urgencia: "media",
        });
      }
    }

    return {
      kpis,
      proximasVisitas,
      ultimasVisitas,
      pipeline,
      alertas,
      medicosSemVisita: medicosSemVisitaList,
    };
  });

  // ── GET /dashboard/alertas ──────────────────────────
  app.get("/alertas", async (request) => {
    const agora = new Date();

    const hojeInicio = new Date(agora);
    hojeInicio.setHours(0, 0, 0, 0);
    const hojeFim = new Date(hojeInicio);
    hojeFim.setDate(hojeFim.getDate() + 1);

    const [
      profissionaisComVisitas,
      agendaAtrasados,
      agendaHoje,
      prospectadosSemVisita,
    ] = await Promise.all([
      prisma.profissional.findMany({
        where: buildTenantWhere(request),
        select: {
          id: true,
          nome: true,
          estagioPipeline: true,
          visitas: {
            where: { status: "REALIZADA" },
            orderBy: { dataVisita: "desc" },
            take: 1,
            select: { dataVisita: true },
          },
        },
      }),
      prisma.agendaItem.findMany({
        where: {
          ...buildTenantWhere(request),
          status: "PLANEJADO",
          dataHoraInicio: { lt: agora },
        },
        include: {
          profissional: { select: { nome: true } },
        },
      }),
      prisma.agendaItem.findMany({
        where: {
          ...buildTenantWhere(request),
          status: "PLANEJADO",
          dataHoraInicio: { gte: hojeInicio, lt: hojeFim },
        },
        include: {
          profissional: { select: { nome: true } },
        },
      }),
      prisma.profissional.findMany({
        where: {
          ...buildTenantWhere(request),
          estagioPipeline: "PROSPECTADO",
          visitas: { none: {} },
        },
        select: { id: true, nome: true },
      }),
    ]);

    return buildAlertas({
      profissionaisComVisitas,
      agendaAtrasados,
      agendaHoje,
      prospectadosSemVisita,
      agora,
    });
  });

  // ── GET /dashboard/gestor ───────────────────────────
  app.get("/gestor", async (request, reply) => {
    if (request.role !== "OWNER") {
      return reply.code(403).send({ error: "Acesso restrito a gestores." });
    }

    const tenantWhere = {
      organizationId: request.organizationId,
      deletedAt: null,
    };

    const membros = await prisma.organizationMembro.findMany({
      where: tenantWhere,
    });

    const users = await prisma.user.findMany({
      where: { clerkId: { in: membros.map((m) => m.userId) } },
    });

    const [totalProfissionais, totalVisitas, funilAgregadoDb, visitasMembros] =
      await Promise.all([
        prisma.profissional.count({ where: tenantWhere }),
        prisma.visita.count({
          where: {
            ...tenantWhere,
            status: { not: "CANCELADA" },
          },
        }),
        prisma.profissional.groupBy({
          by: ["estagioPipeline"],
          where: tenantWhere,
          _count: { id: true },
        }),
        prisma.visita.groupBy({
          by: ["userId"],
          where: {
            ...tenantWhere,
            status: { not: "CANCELADA" },
          },
          _count: { id: true },
        }),
      ]);

    const funilAgregado = funilAgregadoDb.map((item) => ({
      estagio: item.estagioPipeline,
      total: item._count.id,
    }));

    const visitasPorMembro = membros.map((membro) => {
      const vis = visitasMembros.find((v) => v.userId === membro.userId);
      const user = users.find((u) => u.clerkId === membro.userId);
      return {
        membroId: membro.userId,
        nome: user?.name || user?.email || membro.userId,
        totalVisitas: vis ? vis._count.id : 0,
      };
    });

    return {
      totalMembros: membros.length,
      totalProfissionais,
      totalVisitas,
      visitasPorMembro,
      funilAgregado,
    };
  });
};

export default dashboardRoutes;
