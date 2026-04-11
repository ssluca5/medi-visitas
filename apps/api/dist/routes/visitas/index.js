import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import {
  CreateVisitaInputSchema,
  UpdateVisitaInputSchema,
  PatchVisitaStatusInputSchema,
  ListVisitasQuerySchema,
} from "./schemas.js";
const STATUS_FINAIS = ["REALIZADA", "CANCELADA", "NAO_REALIZADA"];
const visitasRoutes = async (app) => {
  app.addHook("preHandler", verifyClerkToken);
  app.post("/", async (request, reply) => {
    const input = CreateVisitaInputSchema.parse(request.body);
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const { materiais, ...visitaData } = input;
    const dataVisitaValue = new Date(visitaData.dataVisita);
    const visita = await prisma.visita.create({
      data: {
        ...visitaData,
        dataVisita: dataVisitaValue,
        userId,
        materiais: {
          create: materiais.map((m) => ({
            materialTecnicoId: m.materialTecnicoId,
            quantidade: m.quantidade,
          })),
        },
      },
      include: {
        materiais: {
          include: { materialTecnico: true },
        },
      },
    });
    return reply.status(201).send(visita);
  });
  app.get("/", async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const query = ListVisitasQuerySchema.parse(request.query);
    const where = { userId };
    if (query.profissionalId) {
      where.profissionalId = query.profissionalId;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.dataInicio || query.dataFim) {
      where.dataVisita = {};
      if (query.dataInicio) where.dataVisita.gte = new Date(query.dataInicio);
      if (query.dataFim) where.dataVisita.lte = new Date(query.dataFim);
    }
    if (query.q) {
      where.profissional = {
        nome: { contains: query.q, mode: "insensitive" },
      };
    }
    const [visitas, total] = await Promise.all([
      prisma.visita.findMany({
        where,
        include: {
          profissional: {
            select: { nome: true, especialidade: { select: { nome: true } } },
          },
          materiais: {
            include: { materialTecnico: true },
          },
        },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { dataVisita: "desc" },
      }),
      prisma.visita.count({ where }),
    ]);
    return {
      data: visitas,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  });
  app.get("/:id", async (request, reply) => {
    const { id } = request.params;
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const visita = await prisma.visita.findUnique({
      where: { id, userId },
      include: {
        profissional: true,
        materiais: {
          include: { materialTecnico: true },
        },
      },
    });
    if (!visita) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }
    return visita;
  });
  app.put("/:id", async (request, reply) => {
    const { id } = request.params;
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const input = UpdateVisitaInputSchema.parse(request.body);
    const existing = await prisma.visita.findUnique({
      where: { id, userId },
    });
    if (!existing) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }
    if (STATUS_FINAIS.includes(existing.status)) {
      let hasPassed = false;
      if (existing.dataVisita) {
        const execTime = new Date(existing.dataVisita);
        if (existing.duracaoMinutos) {
          execTime.setMinutes(execTime.getMinutes() + existing.duracaoMinutos);
        }
        if (execTime < new Date()) {
          hasPassed = true;
        }
      }
      if (hasPassed) {
        return reply.status(409).send({
          error: "Não é possível editar uma visita passada com status final.",
        });
      }
    }
    const { materiais, ...visitaData } = input;
    const dataPayload = { ...visitaData };
    if (dataPayload.dataVisita) {
      dataPayload.dataVisita = new Date(dataPayload.dataVisita);
    }
    if (materiais) {
      // Usando prisma nested mutation para recriar as relações atomicamente
      dataPayload.materiais = {
        deleteMany: {},
        create: materiais.map((m) => ({
          materialTecnicoId: m.materialTecnicoId,
          quantidade: m.quantidade,
        })),
      };
    }
    const visita = await prisma.visita.update({
      where: { id },
      data: dataPayload,
      include: {
        materiais: {
          include: { materialTecnico: true },
        },
      },
    });
    return visita;
  });
  app.patch("/:id/status", async (request, reply) => {
    const { id } = request.params;
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const input = PatchVisitaStatusInputSchema.parse(request.body);
    const existing = await prisma.visita.findUnique({
      where: { id, userId },
    });
    if (!existing) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }
    if (STATUS_FINAIS.includes(existing.status)) {
      let hasPassed = false;
      if (existing.dataVisita) {
        const execTime = new Date(existing.dataVisita);
        if (existing.duracaoMinutos) {
          execTime.setMinutes(execTime.getMinutes() + existing.duracaoMinutos);
        }
        if (execTime < new Date()) {
          hasPassed = true;
        }
      }
      if (hasPassed) {
        return reply.status(409).send({
          error:
            "Não é possível alterar o status de uma visita finalizada que já passou.",
        });
      }
    }
    const visita = await prisma.visita.update({
      where: { id },
      data: { status: input.status },
      include: {
        materiais: {
          include: { materialTecnico: true },
        },
      },
    });
    return visita;
  });
  app.delete("/:id", async (request, reply) => {
    const { id } = request.params;
    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized: Missing user ID" });
    }
    const existing = await prisma.visita.findUnique({
      where: { id, userId },
    });
    if (!existing) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }
    // Soft delete: cancelar visita em vez de excluir fisicamente
    await prisma.visita.update({
      where: { id },
      data: { status: "CANCELADA" },
    });
    return reply.status(204).send();
  });
};
export default visitasRoutes;
