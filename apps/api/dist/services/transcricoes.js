import { prisma } from "../lib/prisma.js";
const LIMITE_MENSAL_INDIVIDUAL = 20;
const LIMITE_MENSAL_EMPRESA = 999999; // ilimitado
export async function verificarLimiteTranscricao(organizationId) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      plano: true,
      transcricoesUsadas: true,
      transcricoesMes: true,
      transcricoesExtras: true,
    },
  });
  if (!org) throw new Error("Organização não encontrada");
  // Plano Empresa — ilimitado
  if (org.plano === "EMPRESA") {
    return {
      permitido: true,
      usadas: 0,
      limite: LIMITE_MENSAL_EMPRESA,
      extras: 0,
    };
  }
  const mesAtual = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  // Resetar contador se mudou o mês
  if (org.transcricoesMes !== mesAtual) {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        transcricoesUsadas: 0,
        transcricoesMes: mesAtual,
      },
    });
    return {
      permitido: true,
      usadas: 0,
      limite: LIMITE_MENSAL_INDIVIDUAL + org.transcricoesExtras,
      extras: org.transcricoesExtras,
    };
  }
  const limite = LIMITE_MENSAL_INDIVIDUAL + org.transcricoesExtras;
  const permitido = org.transcricoesUsadas < limite;
  return {
    permitido,
    usadas: org.transcricoesUsadas,
    limite,
    extras: org.transcricoesExtras,
  };
}
export async function incrementarTranscricao(organizationId) {
  const mesAtual = new Date().toISOString().slice(0, 7);
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      transcricoesUsadas: { increment: 1 },
      transcricoesMes: mesAtual,
    },
  });
}
