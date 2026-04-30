import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async (_request, reply) => {
    try {
      await prisma.$queryRawUnsafe("SELECT 1");
      return { status: "ok", timestamp: new Date().toISOString() };
    } catch {
      return reply
        .status(503)
        .send({ status: "degraded", database: "unreachable" });
    }
  });
};

export default healthRoutes;
