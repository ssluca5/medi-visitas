import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere } from "../../lib/tenant.js";

interface VisitaRow {
  id: string;
  dataVisita: Date;
  status: string;
  objetivoVisita: string | null;
  resumo: string | null;
  duracaoMinutos: number | null;
  proximaAcao: string | null;
}

interface EstagioLogRow {
  id: string;
  createdAt: Date;
  estagioAnterior: string | null;
  estagioNovo: string;
}

export async function visaoGeralRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  app.get("/profissionais/:id/visao-geral", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const profissional = await prisma.profissional.findFirst({
        where: { id, ...buildTenantWhere(request) },
        select: { id: true, nome: true, estagioPipeline: true },
      });

      if (!profissional) {
        return reply.status(404).send({ error: "Profissional não encontrado" });
      }

      const [visitas, estagioLogs] = await Promise.all([
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
            proximaAcao: true,
          },
        }) as Promise<VisitaRow[]>,
        prisma.estagioLog.findMany({
          where: { profissionalId: id, organizationId: request.organizationId },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            createdAt: true,
            estagioAnterior: true,
            estagioNovo: true,
          },
        }),
      ]);

      // Resumo
      const realizadas = visitas.filter((v) => v.status === "REALIZADA");
      const totalVisitas = realizadas.length;
      let frequenciaMensal = 0;
      let diasSemVisita = 0;
      let tendencia: "crescendo" | "estavel" | "caindo" | null = null;

      if (totalVisitas > 0) {
        const primeiraData = new Date(
          realizadas[realizadas.length - 1].dataVisita,
        );
        const ultimaData = new Date(realizadas[0].dataVisita);
        const mesesDesdePrimeira =
          (new Date().getTime() - primeiraData.getTime()) /
            (1000 * 60 * 60 * 24 * 30.44) +
          1;
        frequenciaMensal = totalVisitas / Math.max(1, mesesDesdePrimeira);
        diasSemVisita = Math.floor(
          (new Date().getTime() - ultimaData.getTime()) / (1000 * 60 * 60 * 24),
        );

        const now = new Date();
        const inicioMesAtual = new Date(now.getFullYear(), now.getMonth(), 1);
        const inicioMesAnterior = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const visitasMesAtual = realizadas.filter(
          (v) => new Date(v.dataVisita) >= inicioMesAtual,
        ).length;
        const visitasMesAnterior = realizadas.filter(
          (v) =>
            new Date(v.dataVisita) >= inicioMesAnterior &&
            new Date(v.dataVisita) < inicioMesAtual,
        ).length;

        if (visitasMesAnterior === 0) {
          tendencia = visitasMesAtual > 0 ? "crescendo" : "estavel";
        } else {
          const ratio = visitasMesAtual / visitasMesAnterior;
          if (ratio > 1.2) tendencia = "crescendo";
          else if (ratio < 0.8) tendencia = "caindo";
          else tendencia = "estavel";
        }
      }

      const resumo =
        totalVisitas > 0
          ? {
              totalVisitas,
              frequenciaMensal: Math.round(frequenciaMensal * 10) / 10,
              diasSemVisita,
              tendencia: tendencia!,
            }
          : null;

      // Frequencia
      let frequencia = null;
      if (totalVisitas > 0) {
        const now = new Date();
        const ultimos30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ultimos60d = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const ultimos90d = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        let maiorIntervalo = 0;
        const datasOrdenadas = realizadas
          .map((v) => new Date(v.dataVisita).getTime())
          .sort((a, b) => a - b);
        for (let i = 1; i < datasOrdenadas.length; i++) {
          const intervalo =
            (datasOrdenadas[i] - datasOrdenadas[i - 1]) / (1000 * 60 * 60 * 24);
          if (intervalo > maiorIntervalo) maiorIntervalo = intervalo;
        }

        frequencia = {
          mediaMensal: Math.round(frequenciaMensal * 10) / 10,
          maiorIntervalo: Math.round(maiorIntervalo),
          ultimos30d: realizadas.filter(
            (v) => new Date(v.dataVisita) >= ultimos30d,
          ).length,
          ultimos60d: realizadas.filter(
            (v) => new Date(v.dataVisita) >= ultimos60d,
          ).length,
          ultimos90d: realizadas.filter(
            (v) => new Date(v.dataVisita) >= ultimos90d,
          ).length,
        };
      }

      // Pipeline
      let pipeline = null;
      if (estagioLogs.length > 0) {
        const primeiroLog = estagioLogs[0];
        const ultimoLog = estagioLogs[estagioLogs.length - 1];
        const historico: { estagio: string; dias: number }[] = [];

        if (primeiroLog.estagioAnterior) {
          historico.push({
            estagio: primeiroLog.estagioAnterior,
            dias: 0,
          });
        }

        for (let i = 0; i < estagioLogs.length; i++) {
          const atual = estagioLogs[i];
          const proximo = estagioLogs[i + 1];
          const dias = proximo
            ? Math.round(
                (new Date(proximo.createdAt).getTime() -
                  new Date(atual.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24),
              )
            : Math.round(
                (new Date().getTime() - new Date(atual.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24),
              );

          historico.push({ estagio: atual.estagioNovo, dias });
        }

        pipeline = {
          estagioAtual: ultimoLog.estagioNovo,
          dataEntrada: ultimoLog.createdAt.toISOString(),
          historico,
        };
      }

      // Timeline (apenas VISITA + ESTAGIO)
      const timeline = [
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
      ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      // Follow-ups Pendentes
      const realizadasComAcao = realizadas.filter(
        (v) => v.proximaAcao && v.proximaAcao.trim().length > 0,
      );

      const followUps = realizadasComAcao
        .filter((v) => {
          const dataOriginal = new Date(v.dataVisita).getTime();
          return !realizadas.some(
            (r) => new Date(r.dataVisita).getTime() > dataOriginal,
          );
        })
        .map((v) => ({
          visitaId: v.id,
          acao: v.proximaAcao!,
          dataVisitaOrigem: v.dataVisita.toISOString(),
        }));

      return {
        resumo,
        frequencia,
        pipeline,
        timeline,
        followUps,
      };
    } catch (error) {
      request.log.error(
        { err: error, profissionalId: id },
        "Erro ao carregar visao-geral",
      );
      return reply.status(500).send({ error: "Erro ao carregar dados" });
    }
  });
}
