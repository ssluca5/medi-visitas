import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

// Plugin básico para decorar request com userId e orgId
// A verificação de token é feita via hook em hooks/auth.ts

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    orgId?: string;
  }
}

async function clerkPlugin(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  app.decorateRequest("userId", "");
  app.decorateRequest("orgId", "");
}

export default fp(clerkPlugin, {
  name: "clerk",
});
