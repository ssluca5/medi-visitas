import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { BuscaQuerySchema } from "./schemas.js";

const buscaRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", verifyClerkToken);

  app.get("/", async (request, reply) => {
    const query = BuscaQuerySchema.parse(request.query);

    if (query.q.length < 2) {
      return reply
        .status(400)
        .send({ error: "Query deve ter pelo menos 2 caracteres" });
    }

    const termo = { contains: query.q, mode: "insensitive" as const };

    const profissionais = await prisma.profissional.findMany({
      where: {
        deletedAt: null,
        OR: [
          { nome: termo },
          { crm: termo },
          { especialidade: { nome: termo } },
          { endereco: { cidade: termo } },
        ],
      },
      include: {
        especialidade: { select: { id: true, nome: true, categoria: true } },
        endereco: { select: { cidade: true, estado: true } },
      },
      take: query.limite,
      orderBy: { nome: "asc" },
    });

    return {
      resultados: profissionais.map((p) => ({
        id: p.id,
        tipo: "PROFISSIONAL" as const,
        nome: p.nome,
        crm: p.crm,
        especialidade: p.especialidade?.nome ?? null,
        cidade: p.endereco?.cidade ?? null,
      })),
      total: profissionais.length,
    };
  });
};

export default buscaRoutes;
