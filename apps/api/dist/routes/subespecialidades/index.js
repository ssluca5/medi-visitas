import { verifyClerkToken } from "../../hooks/auth";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
// ============================================
// SCHEMAS
// ============================================
const CreateSubEspecialidadeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  especialidadeId: z.string().min(1, "Especialidade é obrigatória"),
});
const UpdateSubEspecialidadeSchema = z.object({
  nome: z.string().min(1).optional(),
  especialidadeId: z.string().min(1).optional(),
});
const ListSubEspecialidadesQuerySchema = z.object({
  especialidadeId: z.string().optional(),
});
// ============================================
// ROUTES
// ============================================
export default async function subespecialidadesRoutes(app) {
  // ============================================
  // GET /subespecialidades - Listar subespecialidades
  // ============================================
  app.get(
    "/subespecialidades",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const query = ListSubEspecialidadesQuerySchema.parse(request.query);
      const { especialidadeId } = query;
      const where = { deletedAt: null };
      if (especialidadeId) {
        where.especialidadeId = especialidadeId;
      }
      const subespecialidades = await prisma.subEspecialidade.findMany({
        where,
        include: {
          especialidade: {
            select: { id: true, nome: true, categoria: true },
          },
        },
        orderBy: { nome: "asc" },
      });
      return reply.send({ data: subespecialidades });
    },
  );
  // ============================================
  // GET /subespecialidades/:id - Buscar subespecialidade por ID
  // ============================================
  app.get(
    "/subespecialidades/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const subespecialidade = await prisma.subEspecialidade.findUnique({
        where: { id, deletedAt: null },
        include: {
          especialidade: {
            select: { id: true, nome: true, categoria: true },
          },
        },
      });
      if (!subespecialidade) {
        return reply
          .code(404)
          .send({ error: "SubEspecialidade não encontrada" });
      }
      return reply.send({ data: subespecialidade });
    },
  );
  // ============================================
  // POST /subespecialidades - Criar subespecialidade
  // ============================================
  app.post(
    "/subespecialidades",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const data = CreateSubEspecialidadeSchema.parse(request.body);
      // Verificar se especialidade existe
      const especialidade = await prisma.especialidade.findUnique({
        where: { id: data.especialidadeId, deletedAt: null },
      });
      if (!especialidade) {
        return reply.code(404).send({ error: "Especialidade não encontrada" });
      }
      // Verificar duplicata
      const existente = await prisma.subEspecialidade.findFirst({
        where: {
          nome: data.nome,
          especialidadeId: data.especialidadeId,
          deletedAt: null,
        },
      });
      if (existente) {
        return reply.code(409).send({
          error:
            "Já existe uma subespecialidade com este nome para esta especialidade",
        });
      }
      const subespecialidade = await prisma.subEspecialidade.create({
        data: {
          nome: data.nome,
          especialidadeId: data.especialidadeId,
        },
      });
      return reply.code(201).send({ data: subespecialidade });
    },
  );
  // ============================================
  // PUT /subespecialidades/:id - Atualizar subespecialidade
  // ============================================
  app.put(
    "/subespecialidades/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const data = UpdateSubEspecialidadeSchema.parse(request.body);
      const existente = await prisma.subEspecialidade.findUnique({
        where: { id, deletedAt: null },
      });
      if (!existente) {
        return reply
          .code(404)
          .send({ error: "SubEspecialidade não encontrada" });
      }
      if (data.especialidadeId) {
        const especialidade = await prisma.especialidade.findUnique({
          where: { id: data.especialidadeId, deletedAt: null },
        });
        if (!especialidade) {
          return reply
            .code(404)
            .send({ error: "Especialidade não encontrada" });
        }
      }
      if (data.nome && data.nome !== existente.nome) {
        const duplicada = await prisma.subEspecialidade.findFirst({
          where: {
            nome: data.nome,
            especialidadeId: data.especialidadeId || existente.especialidadeId,
            id: { not: id },
            deletedAt: null,
          },
        });
        if (duplicada) {
          return reply.code(409).send({
            error:
              "Já existe uma subespecialidade com este nome para esta especialidade",
          });
        }
      }
      const subespecialidade = await prisma.subEspecialidade.update({
        where: { id },
        data: {
          ...(data.nome && { nome: data.nome }),
          ...(data.especialidadeId && {
            especialidadeId: data.especialidadeId,
          }),
        },
      });
      return reply.send({ data: subespecialidade });
    },
  );
  // ============================================
  // PATCH /subespecialidades/:id/ativo - Ativar/Inativar subespecialidade
  // ============================================
  app.patch(
    "/subespecialidades/:id/ativo",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const { ativo } = z.object({ ativo: z.boolean() }).parse(request.body);
      const existente = await prisma.subEspecialidade.findUnique({
        where: { id },
      });
      if (!existente) {
        return reply
          .code(404)
          .send({ error: "SubEspecialidade não encontrada" });
      }
      const updated = await prisma.subEspecialidade.update({
        where: { id },
        data: { deletedAt: ativo ? null : new Date() },
      });
      return reply.send({
        ...updated,
        ativo: updated.deletedAt === null,
      });
    },
  );
  // ============================================
  // DELETE /subespecialidades/:id - Soft delete
  // Retorna 409 se houver profissionais ativos vinculados
  // ============================================
  app.delete(
    "/subespecialidades/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const subespecialidade = await prisma.subEspecialidade.findUnique({
        where: { id, deletedAt: null },
      });
      if (!subespecialidade) {
        return reply
          .code(404)
          .send({ error: "SubEspecialidade não encontrada" });
      }
      // Count ALL profissionais (active or soft-deleted) — FK restrict blocks hard delete
      const profissionaisVinculados = await prisma.profissional.count({
        where: { subEspecialidadeId: id },
      });
      if (profissionaisVinculados > 0) {
        return reply.code(409).send({
          error: `Não é possível excluir: ${profissionaisVinculados} profissional(is) vinculado(s) a esta subespecialidade`,
        });
      }
      // Soft delete
      await prisma.subEspecialidade.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return reply.code(204).send();
    },
  );
}
