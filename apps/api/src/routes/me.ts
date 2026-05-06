import type { FastifyInstance, FastifyRequest } from "fastify";
import { verifyClerkToken } from "../hooks/auth.js";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const updateMeSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  notifVisitasDia: z.boolean().optional(),
  notifSemVisitaRecente: z.boolean().optional(),
  notifAgendaNaoRealizada: z.boolean().optional(),
  notifLembretesAuto: z.boolean().optional(),
});

const userSelect = {
  id: true,
  email: true,
  name: true,
  tourConcluidoEm: true,
} as const;

type NotificationPreferences = {
  notifVisitasDia: boolean;
  notifSemVisitaRecente: boolean;
  notifAgendaNaoRealizada: boolean;
  notifLembretesAuto: boolean;
};

type NotificationPreferenceKey = keyof NotificationPreferences;

const defaultNotificationPreferences: NotificationPreferences = {
  notifVisitasDia: true,
  notifSemVisitaRecente: true,
  notifAgendaNaoRealizada: true,
  notifLembretesAuto: true,
};

function fallbackEmail(userId: string): string {
  return `${userId}@placeholder.local`;
}

function isPlaceholderEmail(email: string, userId: string): boolean {
  return (
    email === fallbackEmail(userId) || email.endsWith("@placeholder.local")
  );
}

async function createUserFromRequest(userId: string, request: FastifyRequest) {
  return prisma.user.create({
    data: {
      clerkId: userId,
      email: request.userEmail ?? fallbackEmail(userId),
      name: request.userName ?? null,
    },
    select: userSelect,
  });
}

async function syncUserIdentityFromRequest<
  T extends { email: string; name: string | null },
>(userId: string, user: T, request: FastifyRequest): Promise<T> {
  const data: { email?: string; name?: string } = {};

  if (request.userEmail && isPlaceholderEmail(user.email, userId)) {
    const existingEmailOwner = await prisma.user.findUnique({
      where: { email: request.userEmail },
      select: { clerkId: true },
    });

    if (!existingEmailOwner || existingEmailOwner.clerkId === userId) {
      data.email = request.userEmail;
    }
  }

  if (!user.name && request.userName) {
    data.name = request.userName;
  }

  if (Object.keys(data).length === 0) {
    return user;
  }

  const updated = await prisma.user.update({
    where: { clerkId: userId },
    data,
    select: userSelect,
  });

  return updated as unknown as T;
}

function getNotificationUpdates(
  data: Partial<NotificationPreferences>,
): Partial<NotificationPreferences> {
  return {
    ...(data.notifVisitasDia !== undefined
      ? { notifVisitasDia: data.notifVisitasDia }
      : {}),
    ...(data.notifSemVisitaRecente !== undefined
      ? { notifSemVisitaRecente: data.notifSemVisitaRecente }
      : {}),
    ...(data.notifAgendaNaoRealizada !== undefined
      ? { notifAgendaNaoRealizada: data.notifAgendaNaoRealizada }
      : {}),
    ...(data.notifLembretesAuto !== undefined
      ? { notifLembretesAuto: data.notifLembretesAuto }
      : {}),
  };
}

async function getNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  const rows = await prisma.$queryRaw<NotificationPreferences[]>`
    SELECT
      "notifVisitasDia",
      "notifSemVisitaRecente",
      "notifAgendaNaoRealizada",
      "notifLembretesAuto"
    FROM "User"
    WHERE "clerkId" = ${userId}
    LIMIT 1
  `;

  return rows[0] ?? defaultNotificationPreferences;
}

async function updateNotificationPreference(
  userId: string,
  field: NotificationPreferenceKey,
  value: boolean,
): Promise<void> {
  switch (field) {
    case "notifVisitasDia":
      await prisma.$executeRaw`
        UPDATE "User"
        SET "notifVisitasDia" = ${value}, "updatedAt" = now()
        WHERE "clerkId" = ${userId}
      `;
      break;
    case "notifSemVisitaRecente":
      await prisma.$executeRaw`
        UPDATE "User"
        SET "notifSemVisitaRecente" = ${value}, "updatedAt" = now()
        WHERE "clerkId" = ${userId}
      `;
      break;
    case "notifAgendaNaoRealizada":
      await prisma.$executeRaw`
        UPDATE "User"
        SET "notifAgendaNaoRealizada" = ${value}, "updatedAt" = now()
        WHERE "clerkId" = ${userId}
      `;
      break;
    case "notifLembretesAuto":
      await prisma.$executeRaw`
        UPDATE "User"
        SET "notifLembretesAuto" = ${value}, "updatedAt" = now()
        WHERE "clerkId" = ${userId}
      `;
      break;
  }
}

async function updateNotificationPreferences(
  userId: string,
  updates: Partial<NotificationPreferences>,
): Promise<void> {
  for (const [field, value] of Object.entries(updates) as Array<
    [NotificationPreferenceKey, boolean]
  >) {
    await updateNotificationPreference(userId, field, value);
  }
}

export default async function meRoutes(app: FastifyInstance): Promise<void> {
  app.get("/me", { preHandler: [verifyClerkToken] }, async (request, reply) => {
    if (!request.userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    // findUnique primeiro (99.9% dos casos) — evita write desnecessário
    let user = await prisma.user.findUnique({
      where: { clerkId: request.userId },
      select: userSelect,
    });

    // Fallback: criar User se não existir (primeiro acesso)
    if (!user) {
      user = await createUserFromRequest(request.userId, request);
    } else {
      user = await syncUserIdentityFromRequest(request.userId, user, request);
    }

    const notificationPreferences = await getNotificationPreferences(
      request.userId,
    );

    // Buscar membership para organizationId e role
    const membro = await prisma.organizationMembro.findFirst({
      where: { userId: request.userId, deletedAt: null },
      select: {
        organizationId: true,
        role: true,
        organization: {
          select: {
            plano: true,
            transcricoesUsadas: true,
            transcricoesMes: true,
            transcricoesExtras: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reply.code(200).send({
      id: user.id,
      email: user.email,
      name: user.name,
      organizationId: membro?.organizationId ?? null,
      role: membro?.role ?? null,
      tourConcluidoEm: user.tourConcluidoEm,
      organization: membro?.organization ?? null,
      ...notificationPreferences,
    });
  });

  // PATCH /me — Atualizar nome e/ou preferências de notificação
  app.patch(
    "/me",
    { preHandler: [verifyClerkToken] },
    async (request, reply) => {
      if (!request.userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const parsed = updateMeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply
          .code(400)
          .send({ error: "Dados inválidos", details: parsed.error.flatten() });
      }

      const { name, ...notifPrefs } = parsed.data;
      const notificationUpdates = getNotificationUpdates(notifPrefs);
      const hasNameUpdate = name !== undefined;
      const hasNotificationUpdate = Object.keys(notificationUpdates).length > 0;

      if (!hasNameUpdate && !hasNotificationUpdate) {
        return reply.code(400).send({ error: "Nenhum campo para atualizar" });
      }

      let user = await prisma.user.findUnique({
        where: { clerkId: request.userId },
        select: userSelect,
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            clerkId: request.userId,
            email: request.userEmail ?? fallbackEmail(request.userId),
            name: name ?? request.userName ?? null,
          },
          select: userSelect,
        });
      } else if (hasNameUpdate) {
        user = await prisma.user.update({
          where: { clerkId: request.userId },
          data: { name },
          select: userSelect,
        });
      }

      if (hasNotificationUpdate) {
        await updateNotificationPreferences(
          request.userId,
          notificationUpdates,
        );
      }

      const notificationPreferences = await getNotificationPreferences(
        request.userId,
      );

      return reply.code(200).send({ ...user, ...notificationPreferences });
    },
  );

  // Marcar tour como concluído
  app.patch(
    "/me/tour",
    { preHandler: [verifyClerkToken] },
    async (request, reply) => {
      if (!request.userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const concluidoEm = new Date();

      // Upsert para garantir que User existe antes de atualizar
      await prisma.user.upsert({
        where: { clerkId: request.userId },
        update: { tourConcluidoEm: concluidoEm },
        create: {
          clerkId: request.userId,
          email: request.userEmail ?? fallbackEmail(request.userId),
          name: request.userName ?? null,
          tourConcluidoEm: concluidoEm,
        },
      });

      return reply.code(200).send({ ok: true, tourConcluidoEm: concluidoEm });
    },
  );
}
