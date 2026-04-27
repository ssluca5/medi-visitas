import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "@clerk/backend";

function getEnvVars() {
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  const CLERK_JWT_KEY = process.env.CLERK_JWT_KEY;

  if (!CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY environment variable is required");
  }
  if (!CLERK_JWT_KEY) {
    throw new Error("CLERK_JWT_KEY environment variable is required");
  }

  return { CLERK_SECRET_KEY, CLERK_JWT_KEY };
}

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

    const { CLERK_SECRET_KEY, CLERK_JWT_KEY } = getEnvVars();

    const payload = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
      jwtKey: CLERK_JWT_KEY,
    });

    request.userId = payload.sub;
    request.orgId = payload.org_id ?? undefined;
  } catch (err) {
    request.log.error({ err }, "Clerk token verification failed");
    reply.code(401).send({ error: "Unauthorized" });
  }
}
