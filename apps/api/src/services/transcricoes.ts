import { prisma } from "../lib/prisma.js";
import { getLimitesPlano } from "./planos.js";

export async function verificarLimiteTranscricao(
  organizationId: string,
): Promise<{
  permitido: boolean;
  usadas: number;
  limite: number;
  extras: number;
}> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      plano: true,
      transcricoesLimite: true,
      transcricoesUsadas: true,
      transcricoesMes: true,
      transcricoesExtras: true,
    },
  });

  if (!org) throw new Error("Organizacao nao encontrada");

  const limites = getLimitesPlano(org.plano);
  const limiteBase = org.transcricoesLimite ?? limites.transcricoesLimite;
  const mesAtual = new Date().toISOString().slice(0, 7);
  const usaCicloMensal = org.plano !== "TRIAL";

  if (usaCicloMensal && org.transcricoesMes !== mesAtual) {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        transcricoesUsadas: 0,
        transcricoesMes: mesAtual,
      },
    });

    return {
      permitido: limites.temIa && limiteBase > 0,
      usadas: 0,
      limite: limiteBase + org.transcricoesExtras,
      extras: org.transcricoesExtras,
    };
  }

  const limite = limiteBase + org.transcricoesExtras;

  return {
    permitido: limites.temIa && org.transcricoesUsadas < limite,
    usadas: org.transcricoesUsadas,
    limite,
    extras: org.transcricoesExtras,
  };
}

export async function incrementarTranscricao(
  organizationId: string,
): Promise<void> {
  const mesAtual = new Date().toISOString().slice(0, 7);
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      transcricoesUsadas: { increment: 1 },
      transcricoesMes: mesAtual,
    },
  });
}
