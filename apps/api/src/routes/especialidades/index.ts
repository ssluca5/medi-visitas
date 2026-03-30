import type { FastifyInstance } from "fastify";
import { verifyClerkToken } from "../../hooks/auth";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

// ============================================
// SCHEMAS
// ============================================

const CreateEspecialidadeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
});

const UpdateEspecialidadeSchema = z.object({
  nome: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
});

const ListEspecialidadesQuerySchema = z.object({
  ativo: z.enum(["true", "false"]).optional(),
  incluirInativos: z.enum(["true", "false"]).optional(),
  categoria: z.string().optional(),
});

const ToggleAtivoSchema = z.object({
  ativo: z.boolean(),
});

// ============================================
// ROUTES
// ============================================

export default async function especialidadesRoutes(
  app: FastifyInstance,
): Promise<void> {
  // ============================================
  // GET /especialidades - Listar especialidades
  // ============================================
  app.get(
    "/especialidades",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const query = ListEspecialidadesQuerySchema.parse(request.query);
      const { ativo, categoria, incluirInativos } = query;

      const where: Record<string, unknown> = {};

      // Filtro por ativo
      // Se ativo=true, retorna apenas ativas (deletedAt=null)
      // Se ativo=false, retorna apenas inativas (deletedAt != null)
      // Se incluirInativos=true, retorna todas
      if (ativo !== undefined) {
        where.deletedAt = ativo === "true" ? null : { not: null };
      } else if (incluirInativos !== "true") {
        // Por padrão, mostra apenas ativas (para backward compatibility)
        where.deletedAt = null;
      }

      if (categoria) {
        where.categoria = categoria;
      }

      const especialidades = await prisma.especialidade.findMany({
        where,
        orderBy: { nome: "asc" },
      });

      return reply.send({
        data: especialidades.map(
          (e: {
            id: string;
            nome: string;
            categoria: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
          }) => ({
            id: e.id,
            nome: e.nome,
            categoria: e.categoria,
            ativo: e.deletedAt === null,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
          }),
        ),
      });
    },
  );

  // ============================================
  // GET /especialidades/:id - Buscar especialidade por ID
  // ============================================
  app.get(
    "/especialidades/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const especialidade = await prisma.especialidade.findUnique({
        where: { id, deletedAt: null },
      });

      if (!especialidade) {
        return reply.code(404).send({ error: "Especialidade não encontrada" });
      }

      return reply.send({
        ...especialidade,
        ativo: true,
      });
    },
  );

  // ============================================
  // POST /especialidades - Criar especialidade
  // ============================================
  app.post(
    "/especialidades",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const data = CreateEspecialidadeSchema.parse(request.body);

      const especialidade = await prisma.especialidade.create({
        data: {
          nome: data.nome,
          categoria: data.categoria,
        },
      });

      return reply.code(201).send({
        ...especialidade,
        ativo: true,
      });
    },
  );

  // ============================================
  // PUT /especialidades/:id - Atualizar especialidade
  // ============================================
  app.put(
    "/especialidades/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = UpdateEspecialidadeSchema.parse(request.body);

      // Verificar se especialidade existe
      const existente = await prisma.especialidade.findUnique({
        where: { id, deletedAt: null },
      });

      if (!existente) {
        return reply.code(404).send({ error: "Especialidade não encontrada" });
      }

      const especialidade = await prisma.especialidade.update({
        where: { id },
        data: {
          ...(data.nome && { nome: data.nome }),
          ...(data.categoria && { categoria: data.categoria }),
        },
      });

      return reply.send({
        ...especialidade,
        ativo: especialidade.deletedAt === null,
      });
    },
  );

  // ============================================
  // PATCH /especialidades/:id/ativo - Ativar/Inativar especialidade
  // ============================================
  app.patch(
    "/especialidades/:id/ativo",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { ativo } = ToggleAtivoSchema.parse(request.body);

      // Verificar se especialidade existe
      const existente = await prisma.especialidade.findUnique({
        where: { id },
      });

      if (!existente) {
        return reply.code(404).send({ error: "Especialidade não encontrada" });
      }

      const especialidade = await prisma.especialidade.update({
        where: { id },
        data: {
          deletedAt: ativo ? null : new Date(),
        },
      });

      return reply.send({
        ...especialidade,
        ativo: especialidade.deletedAt === null,
      });
    },
  );

  // ============================================
  // DELETE /especialidades/:id - Excluir especialidade (soft delete)
  // ============================================
  app.delete(
    "/especialidades/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      // Verificar se especialidade existe
      const existente = await prisma.especialidade.findUnique({
        where: { id, deletedAt: null },
      });

      if (!existente) {
        return reply.code(404).send({ error: "Especialidade não encontrada" });
      }

      // Verificar se tem profissionais vinculados
      const count = await prisma.profissional.count({
        where: { especialidadeId: id, deletedAt: null },
      });

      if (count > 0) {
        return reply.code(400).send({
          error: `Não é possível excluir. Esta especialidade está vinculada a ${count} profissional(is). Inative-a ao invés de excluí-la.`,
        });
      }

      // Soft delete
      await prisma.especialidade.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return reply.code(204).send();
    },
  );

  // ============================================
  // GET /especialidades/categorias - Listar categorias distintas
  // ============================================
  app.get(
    "/especialidades/categorias",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const categorias = await prisma.especialidade.findMany({
        where: { deletedAt: null },
        select: { categoria: true },
        distinct: ["categoria"],
        orderBy: { categoria: "asc" },
      });

      return reply.send({
        data: categorias.map((c: { categoria: string }) => c.categoria),
      });
    },
  );
}
