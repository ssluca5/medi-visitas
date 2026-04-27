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
