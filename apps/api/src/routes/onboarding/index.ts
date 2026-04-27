import type { FastifyPluginAsync } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { prisma } from "../../lib/prisma.js";
import { z } from "zod";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EmpresaSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
});

const onboardingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", verifyClerkToken);

  // GET /status
  app.get("/status", async (request, reply) => {
    const userId = request.userId;
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });

    const membro = await prisma.organizationMembro.findFirst({
      where: { userId, deletedAt: null },
      include: { organization: true },
    });

    if (!membro) {
      return reply.send({ concluido: false });
    }

    return reply.send({
      concluido: true,
      organizationId: membro.organizationId,
      role: membro.role,
      plano: membro.organization.plano,
      status: membro.organization.status,
      trialExpiraEm: membro.organization.trialExpiraEm.toISOString(),
    });
  });

  // POST /individual
  app.post("/individual", async (request, reply) => {
    const userId = request.userId;
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });

    // Check if already onboarded
    const existing = await prisma.organizationMembro.findFirst({
      where: { userId, deletedAt: null },
    });
    if (existing) {
      return reply.status(409).send({ error: "Onboarding já concluído" });
    }

    const org = await prisma.organization.create({
      data: {
        clerkOrgId: `org_${userId}`,
        nome: "Minha Conta",
        slug: `conta-${userId.slice(-8)}-${Date.now().toString(36)}`,
        plano: "INDIVIDUAL",
        status: "TRIAL_ATIVO",
        trialExpiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        limiteUsuarios: 1,
      },
    });

    await prisma.organizationMembro.create({
      data: {
        organizationId: org.id,
        userId,
        role: "OWNER",
      },
    });

    return reply.status(201).send(org);
  });

  // POST /empresa
  app.post("/empresa", async (request, reply) => {
    const userId = request.userId;
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });

    const { nomeEmpresa } = EmpresaSchema.parse(request.body);

    const existing = await prisma.organizationMembro.findFirst({
      where: { userId, deletedAt: null },
    });
    if (existing) {
      return reply.status(409).send({ error: "Onboarding já concluído" });
    }

    const slug = slugify(nomeEmpresa);
    const org = await prisma.organization.create({
      data: {
        clerkOrgId: `org_${userId}`,
        nome: nomeEmpresa,
        slug: `${slug}-${userId.slice(-4)}`,
        plano: "EMPRESA",
        status: "TRIAL_ATIVO",
        trialExpiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        limiteUsuarios: 10,
      },
    });

    await prisma.organizationMembro.create({
      data: {
        organizationId: org.id,
        userId,
        role: "OWNER",
      },
    });

    return reply.status(201).send(org);
  });
};

export default onboardingRoutes;
