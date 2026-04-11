import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "@clerk/backend";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    orgId?: string;
  }
}

export async function verifyClerkToken(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      reply.code(401).send({ error: "Unauthorized" });
      return;
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
      jwtKey: process.env.CLERK_JWT_KEY!,
    });

    request.userId = payload.sub;
  } catch (err) {
    request.log.error({ err }, "Clerk token verification failed");
    reply.code(401).send({ error: "Unauthorized" });
  }
}
