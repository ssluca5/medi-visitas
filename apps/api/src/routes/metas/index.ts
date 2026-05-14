import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { getLimitesPlano } from "../../services/planos.js";
import {
  calcularProgressoMeta,
  calcularProgressoMetas,
  type MetaRecord,
} from "../../services/metas.js";

const CreateMetaSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime(),
  metaVisitas: z.number().int().min(0).default(0),
  metaAvancosPipeline: z.number().int().min(0).default(0),
  metaPrescritores: z.number().int().min(0).default(0),
  responsavelId: z.string().min(1),
  plano: z.enum(["PROFISSIONAL", "EQUIPE"]),
});

const UpdateMetaSchema = CreateMetaSchema.partial();

const ListMetasQuerySchema = z.object({
  status: z.enum(["ATIVA", "ATINGIDA", "EXPIRADA"]).optional(),
  responsavelId: z.string().min(1).optional(),
  periodo: z.enum(["mes_atual", "proximo_mes", "todos"]).optional(),
});

const UpdateStatusMetaSchema = z.object({
  status: z.enum(["ATINGIDA", "EXPIRADA"]),
});

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function getPeriodoRange(periodo?: string) {
  if (!periodo || periodo === "todos") return null;

  const agora = new Date();
  const base =
    periodo === "proximo_mes"
      ? new Date(agora.getFullYear(), agora.getMonth() + 1, 1)
      : agora;

  return {
    inicio: startOfMonth(base),
    fim: endOfMonth(base),
  };
}

function validarPeriodo(dataInicio: Date, dataFim: Date): boolean {
  return dataFim.getTime() > dataInicio.getTime();
}

function temIndicadorConfigurado(data: {
  metaVisitas?: number;
  metaAvancosPipeline?: number;
  metaPrescritores?: number;
}): boolean {
  return (
    (data.metaVisitas ?? 0) > 0 ||
    (data.metaAvancosPipeline ?? 0) > 0 ||
    (data.metaPrescritores ?? 0) > 0
  );
}

function buildAccessSql(request: {
  organizationId?: string;
  userId?: string;
  role?: string;
}) {
  // OWNER vê todas as metas da organização; MEMBER vê apenas as suas
  if (request.role === "OWNER") {
    return Prisma.sql`"organizationId" = ${request.organizationId} AND "deletedAt" IS NULL`;
  }
  return Prisma.sql`"organizationId" = ${request.organizationId} AND "deletedAt" IS NULL AND ("responsavelId" = ${request.userId} OR "criadaPorId" = ${request.userId})`;
}

async function findMetaByAccess(
  id: string,
  request: { organizationId?: string; userId?: string },
): Promise<MetaRecord | null> {
  const rows = await prisma.$queryRaw<MetaRecord[]>(
    Prisma.sql`SELECT * FROM "Meta" WHERE "id" = ${id} AND ${buildAccessSql(request)} LIMIT 1`,
  );
  return rows[0] ?? null;
}

async function findMetaByCreator(
  id: string,
  request: { organizationId?: string; userId?: string },
): Promise<MetaRecord | null> {
  const rows = await prisma.$queryRaw<MetaRecord[]>(
    Prisma.sql`SELECT * FROM "Meta" WHERE "id" = ${id} AND "organizationId" = ${request.organizationId} AND "deletedAt" IS NULL AND "criadaPorId" = ${request.userId} LIMIT 1`,
  );
  return rows[0] ?? null;
}

async function responsavelPertenceAOrganizacao(
  responsavelId: string,
  organizationId: string,
): Promise<boolean> {
  const membro = await prisma.organizationMembro.findFirst({
    where: {
      organizationId,
      userId: responsavelId,
      deletedAt: null,
    },
    select: { id: true },
  });

  return Boolean(membro);
}

const metasRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
    if (!reply.sent && !getLimitesPlano(request.plano).temMetas) {
      return reply.code(402).send({
        error: "Metas estao disponiveis a partir do Plano Profissional.",
        code: "FEATURE_NOT_AVAILABLE",
      });
    }
  });

  app.get("/", async (request) => {
    const query = ListMetasQuerySchema.parse(request.query);
    const conditions = [buildAccessSql(request)];

    if (query.status)
      conditions.push(Prisma.sql`"status" = ${query.status}::"StatusMeta"`);
    if (query.responsavelId) {
      conditions.push(Prisma.sql`"responsavelId" = ${query.responsavelId}`);
    }

    const periodo = getPeriodoRange(query.periodo);
    if (periodo) {
      conditions.push(Prisma.sql`"dataInicio" < ${periodo.fim}`);
      conditions.push(Prisma.sql`"dataFim" >= ${periodo.inicio}`);
    }

    const metas = await prisma.$queryRaw<MetaRecord[]>(
      Prisma.sql`SELECT * FROM "Meta" WHERE ${Prisma.join(conditions, " AND ")} ORDER BY "status" ASC, "dataFim" ASC`,
    );

    return calcularProgressoMetas(metas);
  });

  app.get("/alertas", async (request) => {
    const metas = await prisma.$queryRaw<MetaRecord[]>(
      Prisma.sql`SELECT * FROM "Meta" WHERE ${buildAccessSql(request)} AND "status" = 'ATIVA'::"StatusMeta" ORDER BY "dataFim" ASC`,
    );

    const metasComProgresso = await calcularProgressoMetas(metas);
    return metasComProgresso.filter(
      (meta) => meta.alertas.emRisco || meta.alertas.prazoCritico,
    );
  });

  app.post("/", async (request, reply) => {
    const data = CreateMetaSchema.parse(request.body);
    const dataInicio = new Date(data.dataInicio);
    const dataFim = new Date(data.dataFim);
    const limitesPlano = getLimitesPlano(request.plano);

    if (!validarPeriodo(dataInicio, dataFim)) {
      return reply
        .code(400)
        .send({ error: "A data final deve ser maior que a data inicial." });
    }

    if (!temIndicadorConfigurado(data)) {
      return reply.code(400).send({
        error: "Informe pelo menos um indicador da meta para acompanhamento.",
      });
    }

    if (data.plano === "EQUIPE" && !limitesPlano.temGestaoEquipe) {
      return reply.code(402).send({
        error: "Metas de equipe estao disponiveis no Plano Equipe.",
        code: "FEATURE_NOT_AVAILABLE",
      });
    }

    if (
      data.plano === "EQUIPE" &&
      !(await responsavelPertenceAOrganizacao(
        data.responsavelId,
        request.organizationId!,
      ))
    ) {
      return reply.code(400).send({
        error: "Responsavel nao pertence a esta organizacao.",
      });
    }

    if (
      data.plano === "PROFISSIONAL" &&
      data.responsavelId !== request.userId
    ) {
      return reply.code(400).send({
        error:
          "Metas profissionais devem ter o proprio usuario como responsavel.",
      });
    }

    const rows = await prisma.$queryRaw<MetaRecord[]>(
      Prisma.sql`
        INSERT INTO "Meta" (
          "id", "nome", "descricao", "dataInicio", "dataFim",
          "metaVisitas", "metaAvancosPipeline", "metaPrescritores",
          "responsavelId", "criadaPorId", "plano", "organizationId",
          "createdAt", "updatedAt"
        )
        VALUES (
          ${randomUUID()}, ${data.nome}, ${data.descricao ?? null}, ${dataInicio}, ${dataFim},
          ${data.metaVisitas}, ${data.metaAvancosPipeline}, ${data.metaPrescritores},
          ${data.responsavelId}, ${request.userId!}, ${data.plano}::"PlanoMeta", ${request.organizationId!},
          now(), now()
        )
        RETURNING *
      `,
    );
    const meta = rows[0];

    return reply.code(201).send(await calcularProgressoMeta(meta));
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const meta = await findMetaByAccess(id, request);

    if (!meta) {
      return reply.code(404).send({ error: "Meta nao encontrada." });
    }

    return calcularProgressoMeta(meta);
  });

  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = UpdateMetaSchema.parse(request.body);

    const existente = await findMetaByCreator(id, request);

    if (!existente) {
      return reply.code(404).send({ error: "Meta nao encontrada." });
    }

    if (existente.status === "ATINGIDA" || existente.status === "EXPIRADA") {
      return reply.code(400).send({
        error: "Metas atingidas ou expiradas nao podem ser editadas.",
      });
    }

    const dataInicio = data.dataInicio
      ? new Date(data.dataInicio)
      : existente.dataInicio;
    const dataFim = data.dataFim ? new Date(data.dataFim) : existente.dataFim;
    const plano = data.plano ?? existente.plano;
    const responsavelId = data.responsavelId ?? existente.responsavelId;
    const metaVisitas = data.metaVisitas ?? existente.metaVisitas;
    const metaAvancosPipeline =
      data.metaAvancosPipeline ?? existente.metaAvancosPipeline;
    const metaPrescritores =
      data.metaPrescritores ?? existente.metaPrescritores;

    if (!validarPeriodo(dataInicio, dataFim)) {
      return reply
        .code(400)
        .send({ error: "A data final deve ser maior que a data inicial." });
    }

    if (
      !temIndicadorConfigurado({
        metaVisitas,
        metaAvancosPipeline,
        metaPrescritores,
      })
    ) {
      return reply.code(400).send({
        error: "Informe pelo menos um indicador da meta para acompanhamento.",
      });
    }

    if (plano === "PROFISSIONAL" && responsavelId !== request.userId) {
      return reply.code(400).send({
        error:
          "Metas profissionais devem ter o proprio usuario como responsavel.",
      });
    }

    if (plano === "EQUIPE" && !getLimitesPlano(request.plano).temGestaoEquipe) {
      return reply.code(402).send({
        error: "Metas de equipe estao disponiveis no Plano Equipe.",
        code: "FEATURE_NOT_AVAILABLE",
      });
    }

    if (
      plano === "EQUIPE" &&
      !(await responsavelPertenceAOrganizacao(
        responsavelId,
        request.organizationId!,
      ))
    ) {
      return reply.code(400).send({
        error: "Responsavel nao pertence a esta organizacao.",
      });
    }

    const rows = await prisma.$queryRaw<MetaRecord[]>(
      Prisma.sql`
        UPDATE "Meta"
        SET
          "nome" = ${data.nome ?? existente.nome},
          "descricao" = ${data.descricao !== undefined ? data.descricao : existente.descricao},
          "dataInicio" = ${dataInicio},
          "dataFim" = ${dataFim},
          "metaVisitas" = ${metaVisitas},
          "metaAvancosPipeline" = ${metaAvancosPipeline},
          "metaPrescritores" = ${metaPrescritores},
          "responsavelId" = ${responsavelId},
          "plano" = ${plano}::"PlanoMeta",
          "updatedAt" = now()
        WHERE "id" = ${id}
        RETURNING *
      `,
    );
    const meta = rows[0];

    return calcularProgressoMeta(meta);
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const meta = await findMetaByCreator(id, request);

    if (!meta) {
      return reply.code(404).send({ error: "Meta nao encontrada." });
    }

    await prisma.$executeRaw(
      Prisma.sql`UPDATE "Meta" SET "deletedAt" = now(), "updatedAt" = now() WHERE "id" = ${id}`,
    );
    return reply.code(204).send();
  });

  app.patch("/:id/status", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = UpdateStatusMetaSchema.parse(request.body);

    const existente = await findMetaByCreator(id, request);

    if (!existente) {
      return reply.code(404).send({ error: "Meta nao encontrada." });
    }

    const rows = await prisma.$queryRaw<MetaRecord[]>(
      Prisma.sql`UPDATE "Meta" SET "status" = ${status}::"StatusMeta", "updatedAt" = now() WHERE "id" = ${id} RETURNING *`,
    );
    const meta = rows[0];

    return calcularProgressoMeta(meta);
  });
};

export default metasRoutes;
