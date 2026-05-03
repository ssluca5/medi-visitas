import type { FastifyRequest } from "fastify";
export declare function buildTenantWhere(request: FastifyRequest, options?: {
    hasDeletedAt?: boolean;
}): Record<string, unknown>;
export declare function buildResourceWhere(request: FastifyRequest, options?: {
    hasDeletedAt?: boolean;
}): Record<string, unknown>;
