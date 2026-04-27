import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere } from "../../lib/tenant.js";

// ─── Alert types ──────────────────────────────────────────

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

// ─── Pure helper for testability ──────────────────────────

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

  // 1. Sem visita 30/60 dias
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

  // 2. Visitas atrasadas
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

  // 3. Agendamentos hoje
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

  // 4. Prospectado sem visita
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

// ─── Plugin principal ─────────────────────────────────────

const dashboardRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  // ── GET /dashboard/resumo ─────────────────────────────
  app.get("/resumo", async (request, reply) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(fimSemana.getDate() + 7);

    const [
      totalProfissionais,
      totalEspecialidades,
      visitasHoje,
      visitasSemana,
      ultimasVisitas,
      proximosAgendamentos,
    ] = await Promise.all([
      prisma.profissional.count({ where: buildTenantWhere(request) }),
      prisma.especialidade.count({ where: buildTenantWhere(request) }),
      prisma.visita.count({
        where: {
          ...buildTenantWhere(request, { hasDeletedAt: false }),
          status: "REALIZADA",
          dataVisita: { gte: hoje, lt: amanha },
        },
      }),
      prisma.visita.count({
        where: {
          ...buildTenantWhere(request, { hasDeletedAt: false }),
          status: "REALIZADA",
          dataVisita: { gte: inicioSemana, lt: fimSemana },
        },
      }),
      prisma.visita.findMany({
        where: {
          ...buildTenantWhere(request, { hasDeletedAt: false }),
          status: "REALIZADA",
        },
        orderBy: { dataVisita: "desc" },
        take: 5,
        include: {
          profissional: {
            select: { nome: true, especialidade: { select: { nome: true } } },
          },
        },
      }),
      prisma.agendaItem.findMany({
        where: {
          ...buildTenantWhere(request),
          status: "PLANEJADO",
          dataHoraInicio: { gte: new Date() },
        },
        orderBy: { dataHoraInicio: "asc" },
        take: 5,
        include: {
          profissional: {
            select: { nome: true, especialidade: { select: { nome: true } } },
          },
        },
      }),
    ]);

    return {
      totalProfissionais,
      totalEspecialidades,
      visitasHoje,
      visitasSemana,
      ultimasVisitas,
      proximosAgendamentos,
    };
  });

  // ── GET /dashboard/alertas ────────────────────────────
  app.get("/alertas", async (request, reply) => {
    const agora = new Date();

    // Today boundaries
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

    const alertas = buildAlertas({
      profissionaisComVisitas,
      agendaAtrasados,
      agendaHoje,
      prospectadosSemVisita,
      agora,
    });

    return alertas;
  });
};

export default dashboardRoutes;
