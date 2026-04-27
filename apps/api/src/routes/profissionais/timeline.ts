import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere } from "../../lib/tenant.js";

export async function timelineRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  app.get("/profissionais/:id/timeline", async (request, reply) => {
    const { id } = request.params as { id: string };

    const profissional = await prisma.profissional.findFirst({
      where: { id, ...buildTenantWhere(request) },
      select: { id: true, nome: true },
    });

    if (!profissional) {
      return reply.status(404).send({ error: "Profissional não encontrado" });
    }

    const [visitas, estagioLogs, agendaItems] = await Promise.all([
      prisma.visita.findMany({
        where: {
          profissionalId: id,
          ...buildTenantWhere(request, { hasDeletedAt: false }),
        },
        orderBy: { dataVisita: "desc" },
        select: {
          id: true,
          dataVisita: true,
          status: true,
          objetivoVisita: true,
          resumo: true,
          duracaoMinutos: true,
        },
      }),
      prisma.estagioLog.findMany({
        where: { profissionalId: id, organizationId: request.organizationId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          estagioAnterior: true,
          estagioNovo: true,
        },
      }),
      prisma.agendaItem.findMany({
        where: { profissionalId: id, ...buildTenantWhere(request) },
        orderBy: { dataHoraInicio: "desc" },
        select: {
          id: true,
          dataHoraInicio: true,
          dataHoraFim: true,
          status: true,
          prioridade: true,
          observacoes: true,
        },
      }),
    ]);

    // Merge and sort by date descending
    const itens = [
      ...visitas.map((v) => ({
        tipo: "VISITA" as const,
        id: v.id,
        data: v.dataVisita.toISOString(),
        status: v.status,
        objetivoVisita: v.objetivoVisita,
        resumo: v.resumo,
        duracaoMinutos: v.duracaoMinutos,
      })),
      ...estagioLogs.map((e) => ({
        tipo: "ESTAGIO" as const,
        id: e.id,
        data: e.createdAt.toISOString(),
        estagioAnterior: e.estagioAnterior,
        estagioNovo: e.estagioNovo,
      })),
      ...agendaItems.map((a) => ({
        tipo: "AGENDAMENTO" as const,
        id: a.id,
        data: a.dataHoraInicio.toISOString(),
        dataFim: a.dataHoraFim.toISOString(),
        status: a.status,
        prioridade: a.prioridade,
        observacoes: a.observacoes,
      })),
    ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return { profissional, itens };
  });
}
