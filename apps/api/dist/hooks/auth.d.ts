import type { FastifyRequest, FastifyReply } from "fastify";
declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
        orgId?: string;
        userEmail?: string;
        userName?: string;
    }
}
export declare function verifyClerkToken(request: FastifyRequest, reply: FastifyReply): Promise<void>;
