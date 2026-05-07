import type { FastifyBaseLogger } from "fastify";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { calcularProgressoMeta, type MetaRecord } from "../services/metas.js";

export async function atualizarStatusMetas(
  logger?: FastifyBaseLogger,
): Promise<void> {
  const agora = new Date();

  const metasExpiradas = await prisma.$queryRaw<MetaRecord[]>(
    Prisma.sql`SELECT * FROM "Meta" WHERE "status" = 'ATIVA'::"StatusMeta" AND "deletedAt" IS NULL AND "dataFim" < ${agora}`,
  );

  for (const meta of metasExpiradas) {
    const metaComProgresso = await calcularProgressoMeta(meta);
    const status =
      metaComProgresso.progresso.geral >= 100 ? "ATINGIDA" : "EXPIRADA";

    await prisma.$executeRaw(
      Prisma.sql`UPDATE "Meta" SET "status" = ${status}::"StatusMeta", "updatedAt" = now() WHERE "id" = ${meta.id}`,
    );
  }

  if (metasExpiradas.length > 0) {
    logger?.info(
      { total: metasExpiradas.length },
      "Status de metas atualizado automaticamente",
    );
  }
}
