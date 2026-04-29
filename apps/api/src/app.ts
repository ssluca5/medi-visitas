import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
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
import clerkWebhookRoutes from "./routes/webhooks/clerk.js";
import stripeWebhookRoutes from "./routes/webhooks/stripe.js";
import billingRoutes from "./routes/billing/index.js";
import onboardingRoutes from "./routes/onboarding/index.js";
import organizacaoRoutes from "./routes/organizacao/index.js";
import transcricoesRoutes from "./routes/transcricoes/index.js";
import gestorRoutes from "./routes/gestor/index.js";
import relatoriosRoutes from "./routes/relatorios/index.js";
export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Helmet — security headers (X-Frame-Options, HSTS, X-Content-Type-Options)
  // CSP configurada no frontend SvelteKit onde HTML é renderizado
  await app.register(helmet, {
    frameguard: { action: "deny" },
    noSniff: true,
    hsts: { maxAge: 31536000, includeSubDomains: true },
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // CORS — configurable via environment; fallback vazio exige configuração explícita em prod
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  await app.register(cors, {
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Multipart — upload de áudio (10MB max)
  await app.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  // Raw body — needed for Stripe webhook signature verification
  // Uses built-in parser instead of fastify-raw-body (peer dep requires Fastify 5)
  app.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (req, body, done) => {
      (req as any).rawBody = body;
      try {
        const json = JSON.parse(body.toString());
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    },
  );

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
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500;
    const message = (error as { message?: string }).message ?? "Erro interno";
    return reply.status(statusCode).send({ error: message });
  });

  // Rotas
  await app.register(clerkWebhookRoutes); // Webhook público (sem auth)
  await app.register(stripeWebhookRoutes); // Stripe webhook público (sem auth)
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
  await app.register(onboardingRoutes, { prefix: "/onboarding" });
  await app.register(organizacaoRoutes, { prefix: "/organizacao" });
  await app.register(billingRoutes, { prefix: "/billing" });
  await app.register(transcricoesRoutes, { prefix: "/transcricoes" });
  await app.register(gestorRoutes, { prefix: "/gestor" });
  await app.register(relatoriosRoutes, { prefix: "/relatorios" });

  return app;
}
