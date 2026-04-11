import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import meRoutes from "./routes/me";
import profissionaisRoutes from "./routes/profissionais/index";
import especialidadesRoutes from "./routes/especialidades/index";
import subespecialidadesRoutes from "./routes/subespecialidades/index.js";
import materiaisRoutes from "./routes/materiais/index.js";
import visitasRoutes from "./routes/visitas/index.js";
import agendaRoutes from "./routes/agenda/index.js";
import pipelineRoutes from "./routes/pipeline/index.js";
import dashboardRoutes from "./routes/dashboard/index.js";
import buscaRoutes from "./routes/busca/index.js";
import notificacoesRoutes from "./routes/notificacoes/index.js";
import { timelineRoutes } from "./routes/profissionais/timeline.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Helmet — security headers
  await app.register(helmet);

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // CORS — configurable via environment
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
      ];

  await app.register(cors, {
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Zod error handler
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Dados inválidos",
        details: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    // Default Fastify error handling for everything else
    return reply.status(error.statusCode ?? 500).send({
      error: error.message,
    });
  });

  // Rotas
  await app.register(meRoutes);
  await app.register(profissionaisRoutes);
  await app.register(especialidadesRoutes);
  await app.register(subespecialidadesRoutes);
  await app.register(materiaisRoutes, { prefix: "/materiais" });
  await app.register(visitasRoutes, { prefix: "/visitas" });
  await app.register(agendaRoutes, { prefix: "/agenda" });
  await app.register(pipelineRoutes, { prefix: "/pipeline" });
  await app.register(dashboardRoutes, { prefix: "/dashboard" });
  await app.register(buscaRoutes, { prefix: "/busca" });
  await app.register(notificacoesRoutes, { prefix: "/notificacoes" });
  await app.register(timelineRoutes);

  return app;
}
