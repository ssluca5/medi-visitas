import { z } from "zod";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
export default async function equipeRoutes(app) {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });
  // Lista membros e convites pendentes da organização
  app.get("/", async (request, reply) => {
    if (!request.userId || !request.organizationId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const membros = await prisma.organizationMembro.findMany({
      where: { organizationId: request.organizationId, deletedAt: null },
    });
    const users = await prisma.user.findMany({
      where: { clerkId: { in: membros.map((m) => m.userId) } },
    });
    const membrosDecorados = membros.map((m) => {
      const user = users.find((u) => u.clerkId === m.userId);
      return {
        ...m,
        user: user ? { name: user.name, email: user.email } : null,
      };
    });
    const convites = await prisma.organizationConvite.findMany({
      where: {
        organizationId: request.organizationId,
        aceito: false,
      },
    });
    return reply.code(200).send({
      membros: membrosDecorados,
      convites,
    });
  });
  // Criar convite
  app.post("/convites", async (request, reply) => {
    if (!request.userId || !request.organizationId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    if (request.role !== "OWNER") {
      return reply
        .code(403)
        .send({ error: "Apenas o proprietário pode convidar membros" });
    }
    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId },
    });
    if (!org) {
      return reply.code(404).send({ error: "Organização não encontrada" });
    }
    if (org.plano !== "EMPRESA" && org.plano !== "ENTERPRISE") {
      return reply.code(403).send({
        error:
          "Gestão de equipe disponível apenas no plano Empresa ou superior",
      });
    }
    const bodySchema = z.object({
      email: z.string().email(),
    });
    const result = bodySchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({ error: result.error.errors[0].message });
    }
    const { email } = result.data;
    // Verificar se já tem convite pendente
    const conviteExistente = await prisma.organizationConvite.findFirst({
      where: {
        organizationId: request.organizationId,
        email,
        aceito: false,
      },
    });
    if (conviteExistente) {
      return reply
        .code(400)
        .send({ error: "Já existe um convite pendente para este email." });
    }
    const expiradoEm = new Date();
    expiradoEm.setDate(expiradoEm.getDate() + 7);
    // Criar convite
    const convite = await prisma.organizationConvite.create({
      data: {
        organizationId: request.organizationId,
        email,
        convidadoPorUserId: request.userId,
        aceito: false,
        expiradoEm,
      },
    });
    // TODO: Enviar email (fase 11 ou usando Resend/AWS SES se configurado).
    return reply.code(201).send({ convite });
  });
  // Cancelar convite
  app.delete("/convites/:id", async (request, reply) => {
    if (
      !request.userId ||
      !request.organizationId ||
      request.role !== "OWNER"
    ) {
      return reply
        .code(403)
        .send({ error: "Apenas proprietários podem cancelar convites." });
    }
    const { id } = request.params;
    await prisma.organizationConvite.deleteMany({
      where: { id, organizationId: request.organizationId, aceito: false },
    });
    return reply.code(200).send({ ok: true });
  });
  // Remover membro
  app.delete("/membros/:clerkId", async (request, reply) => {
    if (
      !request.userId ||
      !request.organizationId ||
      request.role !== "OWNER"
    ) {
      return reply
        .code(403)
        .send({ error: "Apenas proprietários podem remover membros." });
    }
    const { clerkId } = request.params;
    if (clerkId === request.userId) {
      return reply
        .code(400)
        .send({ error: "Você não pode remover a si mesmo." });
    }
    // Soft delete
    await prisma.organizationMembro.updateMany({
      where: {
        organizationId: request.organizationId,
        userId: clerkId,
      },
      data: { deletedAt: new Date() },
    });
    return reply.code(200).send({ ok: true });
  });
  // Obter info do convite via token (não requer tenant context)
  app.get("/convites/token/:token", async (request, reply) => {
    const { token } = request.params;
    const convite = await prisma.organizationConvite.findUnique({
      where: { id: token },
      include: { organization: true },
    });
    if (!convite || convite.aceito || convite.expiradoEm < new Date()) {
      return reply.code(404).send({ error: "Convite inválido ou expirado." });
    }
    return reply.code(200).send({
      id: convite.id,
      email: convite.email,
      role: "MEMBER",
      organizationName: convite.organization.nome,
    });
  });
  // Aceitar convite
  app.post("/convites/token/:token/aceitar", async (request, reply) => {
    if (!request.userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const { token } = request.params;
    const convite = await prisma.organizationConvite.findUnique({
      where: { id: token },
    });
    if (!convite || convite.aceito || convite.expiradoEm < new Date()) {
      return reply.code(404).send({ error: "Convite inválido ou expirado." });
    }
    await prisma.$transaction(async (tx) => {
      // 1. Atualiza convite
      await tx.organizationConvite.update({
        where: { id: convite.id },
        data: { aceito: true },
      });
      // 2. Remove da org atual (se tiver) - softDelete
      await tx.organizationMembro.updateMany({
        where: { userId: request.userId, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      // 3. Entra na nova
      await tx.organizationMembro.create({
        data: {
          organizationId: convite.organizationId,
          userId: request.userId,
          role: "MEMBER",
        },
      });
    });
    return reply.code(200).send({ ok: true });
  });
}
