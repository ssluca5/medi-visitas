import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";

declare module "fastify" {
  interface FastifyRequest {
    organizationId?: string;
    role?: "OWNER" | "MEMBER";
  }
}

export async function resolveTenant(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.userId;
  if (!userId) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  let organizationId: string | undefined;

  // If Clerk JWT has org_id, find org by clerkOrgId
  if (request.orgId) {
    const org = await prisma.organization.findUnique({
      where: { clerkOrgId: request.orgId, deletedAt: null },
    });
    if (org) {
      organizationId = org.id;
    }
  }

  // Find membership
  const membro = await prisma.organizationMembro.findFirst({
    where: {
      userId,
      deletedAt: null,
      ...(organizationId ? { organizationId } : {}),
    },
    include: { organization: true },
    orderBy: { createdAt: "desc" },
  });

  if (!membro) {
    reply.status(403).send({
      error: "Organização não encontrada. Complete o onboarding.",
    });
    return;
  }

  const org = membro.organization;

  // Check trial expiration
  if (org.status === "TRIAL_ATIVO" && org.trialExpiraEm < new Date()) {
    await prisma.organization.update({
      where: { id: org.id },
      data: { status: "SUSPENSO" },
    });
    reply.status(402).send({
      error: "Trial expirado. Assine um plano para continuar.",
      code: "TRIAL_EXPIRED",
    });
    return;
  }

  // Check suspended/cancelled
  if (org.status === "SUSPENSO" || org.status === "CANCELADO") {
    reply.status(402).send({
      error: "Conta suspensa. Verifique o pagamento.",
      code: "ACCOUNT_SUSPENDED",
    });
    return;
  }

  request.organizationId = org.id;
  request.role = membro.role as "OWNER" | "MEMBER";
}
