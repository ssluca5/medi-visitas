import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import { ZodError } from "zod";
import { Sentry } from "./instrument.js";
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
import healthRoutes from "./routes/health.js";
import contatoRoutes from "./routes/contato/index.js";
export async function buildApp() {
    const app = Fastify({
        logger: true,
    });
    // Helmet — security headers
    await app.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", process.env.FRONTEND_URL ?? ""],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false, // Clerk SDK precisa de recursos externos
        hsts: {
            maxAge: 63072000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: { action: "deny" },
        noSniff: true,
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        hidePoweredBy: true,
    });
    // Rate limiting — mais generoso em dev (SvelteKit SSR faz ~5 requests por page load)
    const isDevMode = process.env.NODE_ENV !== "production";
    await app.register(rateLimit, {
        max: isDevMode ? 300 : 100,
        timeWindow: "1 minute",
        errorResponseBuilder: (_request, context) => ({
            error: "Muitas requisições. Tente novamente em alguns instantes.",
            code: "RATE_LIMIT_EXCEEDED",
            retryAfter: context.after,
        }),
        keyGenerator: (request) => {
            return (request.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ??
                request.ip);
        },
    });
    // CORS — restrito aos domínios do MediVisitas em produção
    const isProduction = process.env.NODE_ENV === "production";
    const corsOrigins = isProduction
        ? [
            process.env.FRONTEND_URL ?? "https://app.medivisitas.com",
            process.env.LANDING_URL ?? "https://medivisitas.com",
        ]
        : ["http://localhost:5173", "http://localhost:4321"];
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
    app.addContentTypeParser("application/json", { parseAs: "buffer" }, (req, body, done) => {
        req.rawBody = body;
        try {
            const bodyStr = body.toString().trim();
            const json = bodyStr ? JSON.parse(bodyStr) : {};
            done(null, json);
        }
        catch (err) {
            done(err, undefined);
        }
    });
    // Handler global de erros — captura qualquer erro não tratado
    app.setErrorHandler((error, request, reply) => {
        // Log estruturado no servidor (Railway/Render captura)
        request.log.error({
            err: error,
            url: request.url,
            method: request.method,
            userId: request.userId ?? "anon",
        });
        // Erros de validação Zod
        if (error instanceof ZodError) {
            return reply.status(400).send({
                error: "Dados inválidos. Verifique os campos e tente novamente.",
                code: "VALIDATION_ERROR",
                details: error.errors.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            });
        }
        // Rate limit
        if (error.statusCode === 429) {
            return reply.status(429).send({
                error: "Muitas requisições. Tente novamente em alguns instantes.",
                code: "RATE_LIMIT_EXCEEDED",
            });
        }
        // Erros de validação do Fastify (schema)
        if (error.statusCode === 400) {
            return reply.status(400).send({
                error: "Dados inválidos. Verifique os campos e tente novamente.",
                code: "VALIDATION_ERROR",
            });
        }
        // Erros de autenticação
        if (error.statusCode === 401) {
            return reply.status(401).send({
                error: "Não autorizado.",
                code: "UNAUTHORIZED",
            });
        }
        // Qualquer outro erro — mensagem genérica em produção
        const statusCode = error.statusCode ?? 500;
        // Capturar erros 5xx no Sentry
        if (statusCode >= 500) {
            Sentry.captureException(error, {
                extra: { url: request.url, method: request.method },
            });
        }
        return reply.status(statusCode).send({
            error: process.env.NODE_ENV === "production"
                ? "Ocorreu um erro interno. Tente novamente."
                : error.message,
            code: "INTERNAL_ERROR",
        });
    });
    // Handler para rotas não encontradas
    app.setNotFoundHandler((request, reply) => {
        reply.status(404).send({
            error: "Rota não encontrada.",
            code: "NOT_FOUND",
        });
    });
    // Rotas
    await app.register(healthRoutes); // Health check público (sem auth)
    await app.register(clerkWebhookRoutes); // Webhook público (sem auth)
    await app.register(stripeWebhookRoutes); // Stripe webhook público (sem auth)
    await app.register(contatoRoutes, { prefix: "/contato" });
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
