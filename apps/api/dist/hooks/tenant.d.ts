import type { FastifyRequest, FastifyReply } from "fastify";
declare module "fastify" {
  interface FastifyRequest {
    organizationId?: string;
    role?: "OWNER" | "MEMBER";
  }
}
export declare function resolveTenant(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void>;
