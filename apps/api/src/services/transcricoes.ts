import { prisma } from "../lib/prisma.js";
import { getLimitesPlano } from "./planos.js";

function getMesAtual(): string {
  return new Date().toISOString().slice(0, 7);
}

function getInicioMes(): Date {
  const agora = new Date();
  return new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
}

async function normalizarCicloMensal(
  organizationId: string,
  org: {
    plano: string;
    transcricoesMes: string | null;
  },
): Promise<boolean> {
  const mesAtual = getMesAtual();
  const usaCicloMensal = org.plano !== "TRIAL";

  if (!usaCicloMensal || org.transcricoesMes === mesAtual) return false;

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      transcricoesUsadas: 0,
      transcricoesMes: mesAtual,
    },
  });

  return true;
}

export async function verificarLimiteTranscricao(
  organizationId: string,
  userId?: string,
  role?: "OWNER" | "MEMBER",
): Promise<{
  permitido: boolean;
  usadas: number;
  limite: number;
  extras: number;
  usandoCotas: boolean;
  cotaUsuario: number | null;
  usadasUsuario: number;
  restantesUsuario: number | null;
  usadasOrganizacao: number;
  restantesOrganizacao: number;
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
  const resetouMes = await normalizarCicloMensal(organizationId, org);
  const usadasOrganizacao = resetouMes ? 0 : org.transcricoesUsadas;
  const limiteOrganizacao = limiteBase + org.transcricoesExtras;
  const restantesOrganizacao = Math.max(
    0,
    limiteOrganizacao - usadasOrganizacao,
  );

  if (!userId || role === "OWNER") {
    return {
      permitido: limites.temIa && usadasOrganizacao < limiteOrganizacao,
      usadas: usadasOrganizacao,
      limite: limiteOrganizacao,
      extras: org.transcricoesExtras,
      usandoCotas: false,
      cotaUsuario: null,
      usadasUsuario: 0,
      restantesUsuario: null,
      usadasOrganizacao,
      restantesOrganizacao,
    };
  }

  const membrosComCota = await prisma.organizationMembro.findMany({
    where: { organizationId, role: "MEMBER", deletedAt: null },
    select: { userId: true },
  });
  const memberUserIds = membrosComCota.map((membro) => membro.userId);
  const cotas = memberUserIds.length
    ? await prisma.organizationTranscricaoCota.findMany({
        where: { organizationId, userId: { in: memberUserIds } },
        select: { userId: true, limite: true },
      })
    : [];
  const usandoCotas = cotas.length > 0;

  if (!usandoCotas) {
    return {
      permitido: limites.temIa && usadasOrganizacao < limiteOrganizacao,
      usadas: usadasOrganizacao,
      limite: limiteOrganizacao,
      extras: org.transcricoesExtras,
      usandoCotas,
      cotaUsuario: null,
      usadasUsuario: 0,
      restantesUsuario: null,
      usadasOrganizacao,
      restantesOrganizacao,
    };
  }

  const cotaUsuario = cotas.find((cota) => cota.userId === userId)?.limite ?? 0;
  const usadasUsuario = await prisma.organizationTranscricaoUso.count({
    where: {
      organizationId,
      userId,
      createdAt: { gte: getInicioMes() },
    },
  });
  const restantesUsuario = Math.max(0, cotaUsuario - usadasUsuario);

  return {
    permitido:
      limites.temIa &&
      usadasOrganizacao < limiteOrganizacao &&
      usadasUsuario < cotaUsuario,
    usadas: usadasUsuario,
    limite: cotaUsuario,
    extras: org.transcricoesExtras,
    usandoCotas,
    cotaUsuario,
    usadasUsuario,
    restantesUsuario,
    usadasOrganizacao,
    restantesOrganizacao,
  };
}

export async function incrementarTranscricao(
  organizationId: string,
  userId?: string,
  visitaId?: string,
): Promise<void> {
  const mesAtual = getMesAtual();

  await prisma.$transaction(async (tx) => {
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        transcricoesUsadas: { increment: 1 },
        transcricoesMes: mesAtual,
      },
    });

    if (userId) {
      await tx.organizationTranscricaoUso.create({
        data: {
          organizationId,
          userId,
          visitaId,
        },
      });
    }
  });
}

export async function getTranscricoesEquipe(organizationId: string): Promise<{
  limite: number;
  usadas: number;
  extras: number;
  restantes: number;
  alocadas: number;
  semDistribuir: number;
  membros: Array<{
    userId: string;
    role: string;
    user: { name: string | null; email: string };
    cota: number;
    usadas: number;
    restantes: number;
  }>;
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
  const resetouMes = await normalizarCicloMensal(organizationId, org);
  const usadas = resetouMes ? 0 : org.transcricoesUsadas;
  const limite = limiteBase + org.transcricoesExtras;

  const membros = await prisma.organizationMembro.findMany({
    where: { organizationId, role: "MEMBER", deletedAt: null },
    select: { userId: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const userIds = membros.map((membro) => membro.userId);
  const [users, cotas, usos] = await Promise.all([
    prisma.user.findMany({
      where: { clerkId: { in: userIds } },
      select: { clerkId: true, name: true, email: true },
    }),
    prisma.organizationTranscricaoCota.findMany({
      where: { organizationId, userId: { in: userIds } },
      select: { userId: true, limite: true },
    }),
    prisma.organizationTranscricaoUso.groupBy({
      by: ["userId"],
      where: {
        organizationId,
        userId: { in: userIds },
        createdAt: { gte: getInicioMes() },
      },
      _count: { _all: true },
    }),
  ]);

  const userMap = new Map(users.map((user) => [user.clerkId, user]));
  const cotaMap = new Map(cotas.map((cota) => [cota.userId, cota.limite]));
  const usoMap = new Map(usos.map((uso) => [uso.userId, uso._count._all]));
  const alocadas = userIds.reduce(
    (total, userId) => total + (cotaMap.get(userId) ?? 0),
    0,
  );

  return {
    limite,
    usadas,
    extras: org.transcricoesExtras,
    restantes: Math.max(0, limite - usadas),
    alocadas,
    semDistribuir: Math.max(0, limite - alocadas),
    membros: membros.map((membro) => {
      const user = userMap.get(membro.userId);
      const cota = cotaMap.get(membro.userId) ?? 0;
      const usadasUsuario = usoMap.get(membro.userId) ?? 0;

      return {
        userId: membro.userId,
        role: membro.role,
        user: {
          name: user?.name ?? null,
          email: user?.email ?? "",
        },
        cota,
        usadas: usadasUsuario,
        restantes: Math.max(0, cota - usadasUsuario),
      };
    }),
  };
}
