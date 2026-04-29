import type { FastifyRequest } from "fastify";

export function buildTenantWhere(
  request: FastifyRequest,
  options?: { hasDeletedAt?: boolean },
) {
  const where: Record<string, unknown> = {
    organizationId: request.organizationId,
  };
  if (options?.hasDeletedAt !== false) {
    where.deletedAt = null;
  }
  if (request.role === "MEMBER") {
    where.userId = request.userId;
  }
  return where;
}

// Verifica se o usuário tem acesso ao recurso individual (IDOR protection)
// MEMBER só pode acessar recursos que criou; OWNER acessa todos da org
export function buildResourceWhere(
  request: FastifyRequest,
  options?: { hasDeletedAt?: boolean },
) {
  const where: Record<string, unknown> = {
    organizationId: request.organizationId,
  };
  if (options?.hasDeletedAt !== false) {
    where.deletedAt = null;
  }
  // MEMBER só pode manipular seus próprios recursos
  if (request.role === "MEMBER") {
    where.userId = request.userId;
  }
  return where;
}
