import { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import {
  CreateMaterialInputSchema,
  UpdateMaterialInputSchema,
  ListMateriaisQuerySchema,
} from "./schemas.js";

const materiaisRoutes: FastifyPluginAsync = async (app) => {
  // Autenticação obrigatória
  app.addHook("preHandler", verifyClerkToken);

  app.post("/", async (request, reply) => {
    const input = CreateMaterialInputSchema.parse(request.body);
    const material = await prisma.materialTecnico.create({
      data: input,
    });
    return reply.status(201).send(material);
  });

  app.get("/", async (request, reply) => {
    const query = ListMateriaisQuerySchema.parse(request.query);
    // Cast manual for incluirInativos because schema doesn't have it explicitly right now, or just use request.query
    const { incluirInativos } = request.query as { incluirInativos?: string };

    const where: any = {};
    if (incluirInativos !== "true") {
      where.deletedAt = null;
    }

    if (query.busca) {
      where.OR = [
        { nome: { contains: query.busca, mode: "insensitive" } },
        { descricao: { contains: query.busca, mode: "insensitive" } },
      ];
    }
    if (query.tipo) {
      where.tipo = query.tipo;
    }

    const [materiais, total] = await Promise.all([
      prisma.materialTecnico.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { nome: "asc" },
      }),
      prisma.materialTecnico.count({ where }),
    ]);

    return {
      data: materiais,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  });

  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const input = UpdateMaterialInputSchema.parse(request.body);

    const existing = await prisma.materialTecnico.findFirst({
      where: { id },
    });

    if (!existing) {
      return reply.status(404).send({ error: "Material não encontrado" });
    }

    const material = await prisma.materialTecnico.update({
      where: { id },
      data: input,
    });

    return material;
  });

  app.patch("/:id/ativo", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { ativo } = request.body as { ativo: boolean };

    const existing = await prisma.materialTecnico.findUnique({
      where: { id },
    });

    if (!existing) {
      return reply.status(404).send({ error: "Material não encontrado" });
    }

    const updated = await prisma.materialTecnico.update({
      where: { id },
      data: { deletedAt: ativo ? null : new Date() },
    });

    return updated;
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.materialTecnico.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return reply.status(404).send({ error: "Material não encontrado" });
    }

    await prisma.materialTecnico.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return reply.status(204).send();
  });
};

export default materiaisRoutes;
