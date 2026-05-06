import { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere, buildResourceWhere } from "../../lib/tenant.js";
import {
  CreateVisitaInputSchema,
  UpdateVisitaInputSchema,
  PatchVisitaStatusInputSchema,
  ListVisitasQuerySchema,
} from "./schemas.js";
import {
  transcreverAudio,
  extrairCamposVisita,
} from "../../services/minimax.js";
import { sanitizeAudioBuffer } from "../../services/sanitize-audio.js";
import {
  verificarLimiteTranscricao,
  incrementarTranscricao,
} from "../../services/transcricoes.js";

const STATUS_FINAIS = ["REALIZADA", "CANCELADA", "NAO_REALIZADA"];
const AUDIO_TYPES = [
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
];
const ORDEM_ESTAGIOS = [
  "PROSPECTADO",
  "VISITADO",
  "INTERESSADO",
  "PRESCRITOR",
  "FIDELIZADO",
] as const;

const visitasRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  app.post("/", async (request, reply) => {
    const input = CreateVisitaInputSchema.parse(request.body);

    const { materiais, ...visitaData } = input;

    const dataVisitaValue = new Date(visitaData.dataVisita);

    const visita = await prisma.visita.create({
      data: {
        ...visitaData,
        dataVisita: dataVisitaValue,
        userId: request.userId!,
        organizationId: request.organizationId!,
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
    const query = ListVisitasQuerySchema.parse(request.query);

    const where: any = buildTenantWhere(request, { hasDeletedAt: false });
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
            select: {
              nome: true,
              estagioPipeline: true,
              especialidade: { select: { nome: true } },
            },
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
    const { id } = request.params as { id: string };

    const visita = await prisma.visita.findUnique({
      where: { id, ...buildTenantWhere(request, { hasDeletedAt: false }) },
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
    const { id } = request.params as { id: string };
    const input = UpdateVisitaInputSchema.parse(request.body);

    // IDOR protection: MEMBER só pode editar suas próprias visitas
    const existing = await prisma.visita.findUnique({
      where: { id, ...buildResourceWhere(request, { hasDeletedAt: false }) },
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

    const dataPayload: any = { ...visitaData };
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
    const { id } = request.params as { id: string };
    const input = PatchVisitaStatusInputSchema.parse(request.body);

    // IDOR protection: MEMBER só pode alterar status de suas próprias visitas
    const existing = await prisma.visita.findUnique({
      where: { id, ...buildResourceWhere(request, { hasDeletedAt: false }) },
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

  // POST /visitas/:id/transcricao — gravação de áudio → STT → Chat
  app.post("/:id/transcricao", async (request, reply) => {
    const limite = await verificarLimiteTranscricao(request.organizationId!);

    if (!limite.permitido) {
      return reply.status(402).send({
        error: "Limite de transcrições atingido.",
        code: "TRANSCRIPTION_LIMIT_REACHED",
        usadas: limite.usadas,
        limite: limite.limite,
        extras: limite.extras,
      });
    }

    const { id } = request.params as { id: string };

    const visita = await prisma.visita.findUnique({
      where: { id, ...buildResourceWhere(request, { hasDeletedAt: false }) },
    });

    if (!visita) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }

    const file = await (request as any).file();
    if (!file) {
      return reply
        .status(400)
        .send({ error: "Arquivo de áudio é obrigatório" });
    }

    const mimeType = file.mimetype;
    if (!AUDIO_TYPES.includes(mimeType)) {
      return reply.status(400).send({
        error: `Tipo de arquivo inválido: ${mimeType}. Aceitos: ${AUDIO_TYPES.join(", ")}`,
      });
    }

    const buffer = await file.toBuffer();
    if (buffer.length > 10 * 1024 * 1024) {
      return reply.status(400).send({ error: "Arquivo excede 10MB" });
    }

    // Sanitizar metadados do áudio antes de enviar para API externa
    const { buffer: cleanBuffer, sanitized } = sanitizeAudioBuffer(
      buffer,
      mimeType,
    );
    if (sanitized) {
      request.log.info(
        { visitaId: id, mimeType },
        "Metadados de áudio removidos",
      );
    }

    // Passo 1: STT (Speech-to-Text)
    const transcricao = await transcreverAudio(cleanBuffer, mimeType);

    // Passo 2: Chat Completion (extração estruturada)
    const campos = await extrairCamposVisita(transcricao);

    // Atualizar visita com campos extraídos
    await prisma.visita.update({
      where: { id },
      data: {
        resumo: campos.resumo,
        proximaAcao: campos.proximaAcao,
        objetivoVisita: campos.objetivoVisita,
      },
    });

    await incrementarTranscricao(request.organizationId!);

    return reply.send(campos);
  });

  // PATCH /visitas/:id/audio — salvar URL do áudio
  app.patch("/:id/audio", async (request, reply) => {
    const { id } = request.params as { id: string };

    const { audioUrl } = request.body as { audioUrl?: string };
    if (!audioUrl || typeof audioUrl !== "string") {
      return reply.status(400).send({ error: "audioUrl é obrigatório" });
    }

    // IDOR protection: MEMBER só pode associar áudio às suas próprias visitas
    const existing = await prisma.visita.findUnique({
      where: { id, ...buildResourceWhere(request, { hasDeletedAt: false }) },
    });

    if (!existing) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }

    await prisma.visita.update({
      where: { id },
      data: { audioUrl },
    });

    return reply.status(204).send();
  });

  app.post("/:id/confirmar-agenda", async (request, reply) => {
    const { id } = request.params as { id: string };

    const { dataISO, observacao } = request.body as {
      dataISO: string | null;
      observacao: string;
    };

    const visita = await prisma.visita.findUnique({
      where: { id, ...buildResourceWhere(request, { hasDeletedAt: false }) },
    });

    if (!visita) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }

    const dataHoraInicio = dataISO
      ? new Date(dataISO)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (Number.isNaN(dataHoraInicio.getTime())) {
      return reply.status(400).send({ error: "dataISO inválida" });
    }

    const dataHoraFim = new Date(dataHoraInicio.getTime() + 60 * 60 * 1000);

    const agendaItem = await prisma.agendaItem.create({
      data: {
        userId: request.userId!,
        profissionalId: visita.profissionalId,
        visitaId: null,
        dataHoraInicio,
        dataHoraFim,
        status: "PLANEJADO",
        prioridade: "MEDIA",
        observacoes: observacao || null,
        organizationId: request.organizationId!,
      },
    });

    return reply.status(201).send(agendaItem);
  });

  app.post("/:id/confirmar-estagio", async (request, reply) => {
    const { id } = request.params as { id: string };

    const { novoEstagio } = request.body as {
      novoEstagio: (typeof ORDEM_ESTAGIOS)[number];
    };

    const visita = await prisma.visita.findUnique({
      where: { id, ...buildResourceWhere(request, { hasDeletedAt: false }) },
      include: { profissional: true },
    });

    if (!visita) {
      return reply.status(404).send({ error: "Visita não encontrada" });
    }

    const estagioAtual = visita.profissional.estagioPipeline;
    const idxAtual = ORDEM_ESTAGIOS.indexOf(estagioAtual);
    const idxNovo = ORDEM_ESTAGIOS.indexOf(novoEstagio);

    if (idxNovo <= idxAtual) {
      return reply.status(400).send({
        error: "Não é possível regredir o estágio do pipeline.",
        estagioAtual,
        novoEstagio,
      });
    }

    await prisma.$transaction([
      prisma.profissional.update({
        where: { id: visita.profissionalId },
        data: { estagioPipeline: novoEstagio },
      }),
      prisma.estagioLog.create({
        data: {
          profissionalId: visita.profissionalId,
          estagioAnterior: estagioAtual,
          estagioNovo: novoEstagio,
          userId: request.userId!,
          organizationId: request.organizationId!,
        },
      }),
    ]);

    return reply.status(200).send({ estagioAtual, novoEstagio });
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    // IDOR protection: MEMBER só pode cancelar suas próprias visitas
    const existing = await prisma.visita.findUnique({
      where: { id, ...buildResourceWhere(request, { hasDeletedAt: false }) },
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
