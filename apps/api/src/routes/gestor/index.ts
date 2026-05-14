import type { FastifyInstance } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { getLimitesPlano } from "../../services/planos.js";

function requireOwner(
  request: { role?: string },
  reply: { status: (code: number) => { send: (body: unknown) => unknown } },
) {
  if (request.role !== "OWNER") {
    reply
      .status(403)
      .send({ error: "Apenas gestores têm acesso a esta funcionalidade" });
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
      error: "Dashboard do gestor disponivel no Plano Equipe.",
      code: "FEATURE_NOT_AVAILABLE",
    });
    return false;
  }
  return true;
}

export default async function gestorRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  app.get("/resumo", async (request, reply) => {
    if (!requireGestaoEquipe(request, reply)) return;
    if (!requireOwner(request, reply)) return;

    const organizationId = request.organizationId!;
    const { userId } = request.query as { userId?: string };

    // When filtering by a specific member, scope profissionais and visitas
    const visitaWhere = userId
      ? { organizationId, userId }
      : { organizationId };
    const profissionalWhere = userId
      ? { organizationId, deletedAt: null, visitas: { some: { userId } } }
      : { organizationId, deletedAt: null };

    // Aggregations using parallel queries
    const [
      totalMembros,
      totalProfissionais,
      totalVisitas,
      pipelineStats,
      visitasRecentesData,
    ] = await Promise.all([
      prisma.organizationMembro.count({
        where: { organizationId, deletedAt: null },
      }),
      prisma.profissional.count({
        where: profissionalWhere,
      }),
      prisma.visita.count({
        where: visitaWhere,
      }),
      prisma.profissional.groupBy({
        by: ["estagioPipeline"],
        where: profissionalWhere,
        _count: { _all: true },
      }),
      prisma.visita.findMany({
        where: visitaWhere,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { profissional: true },
      }),
    ]);

    // Fetch user details for the recent visits
    const visitUserIds = Array.from(
      new Set(visitasRecentesData.map((v) => v.userId)),
    );
    const users = await prisma.user.findMany({
      where: { clerkId: { in: visitUserIds } },
      select: { clerkId: true, name: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.clerkId, u]));

    const visitasRecentes = visitasRecentesData.map((v) => ({
      ...v,
      userName: userMap.get(v.userId)?.name || "Usuário",
    }));

    // Format pipeline stats
    const pipelineMap = pipelineStats.reduce(
      (acc, curr) => {
        acc[curr.estagioPipeline] = curr._count._all;
        return acc;
      },
      {} as Record<string, number>,
    );

    return reply.send({
      kpis: {
        totalMembros,
        totalProfissionais,
        totalVisitas,
      },
      pipeline: {
        PROSPECTADO: pipelineMap["PROSPECTADO"] || 0,
        VISITADO: pipelineMap["VISITADO"] || 0,
        INTERESSADO: pipelineMap["INTERESSADO"] || 0,
        PRESCRITOR: pipelineMap["PRESCRITOR"] || 0,
        FIDELIZADO: pipelineMap["FIDELIZADO"] || 0,
      },
      visitasRecentes,
    });
  });
}
