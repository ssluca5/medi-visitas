import { verifyClerkToken } from "../../hooks/auth";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import {
  CreateProfissionalInputSchema,
  UpdateProfissionalInputSchema,
  ListProfissionaisQuerySchema,
  UpdateEstagioInputSchema,
  ProfissionalOutputSchema,
} from "./schemas";
export default async function profissionaisRoutes(app) {
  // ============================================
  // POST /profissionais - Criar profissional
  // ============================================
  app.post(
    "/profissionais",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { userId } = request;
      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }
      const data = CreateProfissionalInputSchema.parse(request.body);
      const { endereco, contatos, ...profissionalData } = data;
      // Criar endereço se fornecido
      let enderecoId;
      if (endereco && Object.keys(endereco).length > 0) {
        const novoEndereco = await prisma.endereco.create({
          data: endereco,
        });
        enderecoId = novoEndereco.id;
      }
      // Criar profissional
      const profissional = await prisma.profissional.create({
        data: {
          ...profissionalData,
          enderecoId,
        },
      });
      // Criar contatos se fornecidos
      if (contatos && contatos.length > 0) {
        await prisma.contatoProfissional.createMany({
          data: contatos.map((contato) => ({
            ...contato,
            profissionalId: profissional.id,
          })),
        });
      }
      // Criar log inicial de estágio
      await prisma.estagioLog.create({
        data: {
          profissionalId: profissional.id,
          estagioAnterior: null,
          estagioNovo: profissional.estagioPipeline,
          userId,
        },
      });
      // Buscar profissional completo com relacionamentos
      const profissionalCompleto = await prisma.profissional.findUnique({
        where: { id: profissional.id },
        include: {
          especialidade: true,
          subEspecialidade: true,
          endereco: true,
          contatos: {
            where: { deletedAt: null },
          },
        },
      });
      return reply
        .code(201)
        .send(ProfissionalOutputSchema.parse(profissionalCompleto));
    },
  );
  // ============================================
  // GET /profissionais - Listar profissionais (paginado)
  // ============================================
  app.get(
    "/profissionais",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const query = ListProfissionaisQuerySchema.parse(request.query);
      const {
        page,
        pageSize,
        busca,
        potencial,
        estagioPipeline,
        especialidadeId,
      } = query;
      const where = {
        deletedAt: null,
      };
      // Filtro de busca textual (nome, crm, email)
      if (busca) {
        where.OR = [
          { nome: { contains: busca, mode: "insensitive" } },
          { crm: { contains: busca, mode: "insensitive" } },
          { email: { contains: busca, mode: "insensitive" } },
        ];
      }
      // Filtros exatos
      if (potencial) {
        where.potencial = potencial;
      }
      if (estagioPipeline) {
        where.estagioPipeline = estagioPipeline;
      }
      if (especialidadeId) {
        where.especialidadeId = especialidadeId;
      }
      // Contar total
      const total = await prisma.profissional.count({ where });
      // Buscar profissionais
      const profissionais = await prisma.profissional.findMany({
        where,
        include: {
          especialidade: true,
          subEspecialidade: true,
          endereco: true,
          contatos: {
            where: { deletedAt: null },
          },
        },
        orderBy: { nome: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return reply.send({
        data: profissionais,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    },
  );
  // ============================================
  // GET /profissionais/:id - Buscar profissional por ID
  // ============================================
  app.get(
    "/profissionais/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const profissional = await prisma.profissional.findUnique({
        where: { id, deletedAt: null },
        include: {
          especialidade: true,
          subEspecialidade: true,
          endereco: true,
          contatos: {
            where: { deletedAt: null },
          },
        },
      });
      if (!profissional) {
        return reply.code(404).send({ error: "Profissional não encontrado" });
      }
      return reply.send(ProfissionalOutputSchema.parse(profissional));
    },
  );
  // ============================================
  // PUT /profissionais/:id - Atualizar profissional
  // ============================================
  app.put(
    "/profissionais/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const data = UpdateProfissionalInputSchema.parse(request.body);
      // Verificar se profissional existe
      const existente = await prisma.profissional.findUnique({
        where: { id, deletedAt: null },
      });
      if (!existente) {
        return reply.code(404).send({ error: "Profissional não encontrado" });
      }
      const { endereco, contatos, ...profissionalData } = data;
      // Atualizar endereço se fornecido
      let novoEnderecoId = existente.enderecoId;
      if (endereco && Object.keys(endereco).length > 0) {
        if (existente.enderecoId) {
          await prisma.endereco.update({
            where: { id: existente.enderecoId },
            data: endereco,
          });
        } else {
          const novoEndereco = await prisma.endereco.create({
            data: endereco,
          });
          novoEnderecoId = novoEndereco.id;
        }
      }
      // Atualizar profissional
      const updateData = { ...profissionalData };
      if (novoEnderecoId !== existente.enderecoId) {
        updateData.enderecoId = novoEnderecoId;
      }
      const profissional = await prisma.profissional.update({
        where: { id },
        data: updateData,
      });
      // Atualizar contatos se fornecidos
      if (contatos) {
        // Soft delete dos contatos existentes
        await prisma.contatoProfissional.updateMany({
          where: { profissionalId: id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
        // Criar novos contatos
        if (contatos.length > 0) {
          await prisma.contatoProfissional.createMany({
            data: contatos.map((contato) => ({
              ...contato,
              profissionalId: id,
            })),
          });
        }
      }
      // Buscar profissional completo com relacionamentos
      const profissionalCompleto = await prisma.profissional.findUnique({
        where: { id: profissional.id },
        include: {
          especialidade: true,
          subEspecialidade: true,
          endereco: true,
          contatos: {
            where: { deletedAt: null },
          },
        },
      });
      return reply.send(ProfissionalOutputSchema.parse(profissionalCompleto));
    },
  );
  // ============================================
  // PATCH /profissionais/:id/ativo - Ativar/Inativar profissional
  // ============================================
  app.patch(
    "/profissionais/:id/ativo",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const { ativo } = z.object({ ativo: z.boolean() }).parse(request.body);
      const profissional = await prisma.profissional.findUnique({
        where: { id },
      });
      if (!profissional) {
        return reply.code(404).send({ error: "Profissional não encontrado" });
      }
      const profissionalAtualizado = await prisma.profissional.update({
        where: { id },
        data: { deletedAt: ativo ? null : new Date() },
        include: {
          especialidade: true,
          subEspecialidade: true,
          endereco: true,
          contatos: {
            where: { deletedAt: null },
          },
        },
      });
      return reply.send(ProfissionalOutputSchema.parse(profissionalAtualizado));
    },
  );
  // ============================================
  // DELETE /profissionais/:id - Soft delete
  // ============================================
  app.delete(
    "/profissionais/:id",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { id } = request.params;
      const profissional = await prisma.profissional.findUnique({
        where: { id, deletedAt: null },
      });
      if (!profissional) {
        return reply.code(404).send({ error: "Profissional não encontrado" });
      }
      // Soft delete
      await prisma.profissional.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return reply.code(204).send();
    },
  );
  // ============================================
  // PATCH /profissionais/:id/estagio - Atualizar estágio do pipeline
  // ============================================
  app.patch(
    "/profissionais/:id/estagio",
    {
      preHandler: [verifyClerkToken],
    },
    async (request, reply) => {
      const { userId } = request;
      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }
      const { id } = request.params;
      const { estagioNovo } = UpdateEstagioInputSchema.parse(request.body);
      // Buscar profissional atual
      const profissional = await prisma.profissional.findUnique({
        where: { id, deletedAt: null },
      });
      if (!profissional) {
        return reply.code(404).send({ error: "Profissional não encontrado" });
      }
      // Não fazer nada se já está no mesmo estágio
      if (profissional.estagioPipeline === estagioNovo) {
        return reply
          .code(400)
          .send({ error: "Profissional já está neste estágio" });
      }
      // Atualizar profissional e criar log na mesma transação
      const estagioAnterior = profissional.estagioPipeline;
      const [profissionalAtualizado] = await prisma.$transaction([
        prisma.profissional.update({
          where: { id },
          data: { estagioPipeline: estagioNovo },
        }),
        prisma.estagioLog.create({
          data: {
            profissionalId: id,
            estagioAnterior,
            estagioNovo,
            userId,
          },
        }),
      ]);
      // Buscar profissional completo com relacionamentos
      const profissionalCompleto = await prisma.profissional.findUnique({
        where: { id: profissionalAtualizado.id },
        include: {
          especialidade: true,
          subEspecialidade: true,
          endereco: true,
          contatos: {
            where: { deletedAt: null },
          },
        },
      });
      return reply.send(ProfissionalOutputSchema.parse(profissionalCompleto));
    },
  );
}
