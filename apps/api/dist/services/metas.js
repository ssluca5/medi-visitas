import { prisma } from "../lib/prisma.js";
function percentual(realizado, meta) {
  if (meta <= 0) return 100;
  return Math.round((realizado / meta) * 100);
}
function calcularAlertas(meta, progressoGeral) {
  if (meta.status !== "ATIVA") {
    return { emRisco: false, prazoCritico: false };
  }
  const agora = new Date();
  const duracao = meta.dataFim.getTime() - meta.dataInicio.getTime();
  const decorrido =
    duracao <= 0
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            ((agora.getTime() - meta.dataInicio.getTime()) / duracao) * 100,
          ),
        );
  return {
    emRisco: decorrido >= 70 && progressoGeral < 50,
    prazoCritico: decorrido >= 90 && progressoGeral < 100,
  };
}
export async function calcularProgressoMeta(meta) {
  const [visitasRealizadas, avancosPipeline, prescritores] = await Promise.all([
    prisma.visita.count({
      where: {
        organizationId: meta.organizationId,
        userId: meta.responsavelId,
        status: "REALIZADA",
        dataVisita: {
          gte: meta.dataInicio,
          lte: meta.dataFim,
        },
      },
    }),
    prisma.estagioLog.count({
      where: {
        organizationId: meta.organizationId,
        userId: meta.responsavelId,
        createdAt: {
          gte: meta.dataInicio,
          lte: meta.dataFim,
        },
      },
    }),
    prisma.profissional.count({
      where: {
        organizationId: meta.organizationId,
        deletedAt: null,
        estagioPipeline: "PRESCRITOR",
        updatedAt: {
          gte: meta.dataInicio,
          lte: meta.dataFim,
        },
        estagioLogs: {
          some: {
            userId: meta.responsavelId,
            estagioNovo: "PRESCRITOR",
            createdAt: {
              gte: meta.dataInicio,
              lte: meta.dataFim,
            },
          },
        },
      },
    }),
  ]);
  const visitas = {
    realizado: visitasRealizadas,
    percentual: percentual(visitasRealizadas, meta.metaVisitas),
  };
  const avancos = {
    realizado: avancosPipeline,
    percentual: percentual(avancosPipeline, meta.metaAvancosPipeline),
  };
  const novosPrescritores = {
    realizado: prescritores,
    percentual: percentual(prescritores, meta.metaPrescritores),
  };
  const geral = Math.round(
    (visitas.percentual + avancos.percentual + novosPrescritores.percentual) /
      3,
  );
  return {
    ...meta,
    progresso: {
      visitas,
      avancosPipeline: avancos,
      prescritores: novosPrescritores,
      geral,
    },
    alertas: calcularAlertas(meta, geral),
  };
}
export async function calcularProgressoMetas(metas) {
  return Promise.all(metas.map((meta) => calcularProgressoMeta(meta)));
}
