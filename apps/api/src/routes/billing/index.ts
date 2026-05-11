import type { FastifyPluginAsync } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { stripe, criarCheckout, criarPortal } from "../../services/stripe.js";
import { getLimitesPlano } from "../../services/planos.js";
import { z } from "zod";

const CheckoutSchema = z.object({
  plano: z.enum(["BASICO", "PROFISSIONAL", "EQUIPE"]),
});

function getPriceId(plano: "BASICO" | "PROFISSIONAL" | "EQUIPE"): string {
  const map = {
    BASICO:
      process.env.STRIPE_PRICE_BASICO ?? process.env.STRIPE_PRICE_INDIVIDUAL,
    PROFISSIONAL: process.env.STRIPE_PRICE_PROFISSIONAL,
    EQUIPE: process.env.STRIPE_PRICE_EQUIPE ?? process.env.STRIPE_PRICE_EMPRESA,
  };

  const priceId = map[plano];
  if (!priceId) throw new Error(`Price ID nao configurado para plano ${plano}`);
  return priceId;
}

const billingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", verifyClerkToken);
  app.addHook("preHandler", resolveTenant);

  app.post(
    "/checkout",
    { config: { rateLimit: { max: 5, timeWindow: "1 hour" } } },
    async (request, reply) => {
      if (request.role !== "OWNER") {
        return reply
          .status(403)
          .send({ error: "Apenas o proprietario pode assinar" });
      }

      const body = CheckoutSchema.parse(request.body);
      const org = await prisma.organization.findUnique({
        where: { id: request.organizationId! },
        select: { id: true, stripeCustomerId: true },
      });

      if (!org) {
        return reply.status(404).send({ error: "Organizacao nao encontrada" });
      }

      try {
        const checkoutUrl = await criarCheckout(
          org.id,
          org.stripeCustomerId,
          body.plano,
          request.userId!,
          getPriceId(body.plano),
        );
        return reply.send({ checkoutUrl });
      } catch (err) {
        request.log.error({ err }, "Stripe checkout creation failed");
        return reply
          .status(502)
          .send({ error: "Erro ao criar sessao de checkout" });
      }
    },
  );

  app.post("/portal", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
    if (request.role !== "OWNER") {
      return reply
        .status(403)
        .send({ error: "Apenas o proprietario pode gerenciar assinatura" });
    }

    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId! },
      select: { stripeCustomerId: true },
    });

    if (!org) {
      return reply.status(404).send({ error: "Organizacao nao encontrada" });
    }

    if (!org.stripeCustomerId) {
      return reply
        .status(400)
        .send({ error: "Organizacao nao possui assinatura ativa" });
    }

    try {
      const portalUrl = await criarPortal(org.stripeCustomerId);
      return reply.send({ portalUrl });
    } catch (err) {
      request.log.error({ err }, "Stripe portal creation failed");
      return reply
        .status(502)
        .send({ error: "Erro ao criar portal de gerenciamento" });
    }
  });

  app.get("/status", async (request, reply) => {
    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId! },
      select: {
        plano: true,
        status: true,
        trialExpiraEm: true,
        planoAtivoEm: true,
        stripeCustomerId: true,
        stripeSubId: true,
        limiteUsuarios: true,
        limiteProfissionais: true,
        transcricoesLimite: true,
        transcricoesUsadas: true,
        transcricoesExtras: true,
        transcricoesMes: true,
      },
    });

    if (!org) {
      return reply.status(404).send({ error: "Organizacao nao encontrada" });
    }

    let proximaCobranca: string | null = null;
    if (org.stripeSubId) {
      try {
        const sub = await stripe.subscriptions.retrieve(org.stripeSubId);
        const periodEnd = sub.items.data[0]?.current_period_end;
        if (periodEnd) {
          proximaCobranca = new Date(periodEnd * 1000).toISOString();
        }
      } catch {
        // Subscription may have been deleted, status still comes from DB.
      }
    }

    const usuariosAtivos = await prisma.organizationMembro.count({
      where: { organizationId: request.organizationId!, deletedAt: null },
    });

    let diasRestantes = 0;
    if (org.trialExpiraEm) {
      const diff = org.trialExpiraEm.getTime() - Date.now();
      diasRestantes = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    const mesAtual = new Date().toISOString().slice(0, 7);
    const transcricoesUsadasMes =
      org.plano !== "TRIAL" && org.transcricoesMes !== mesAtual
        ? 0
        : org.transcricoesUsadas;
    const transcricoesRestantes = Math.max(
      0,
      org.transcricoesLimite + org.transcricoesExtras - transcricoesUsadasMes,
    );

    return reply.send({
      plano: org.plano,
      status: org.status,
      diasRestantes,
      trialExpiraEm: org.trialExpiraEm.toISOString(),
      planoAtivoEm: org.planoAtivoEm?.toISOString() ?? null,
      proximaCobranca,
      temStripe: Boolean(org.stripeSubId),
      limiteUsuarios: org.limiteUsuarios,
      limiteProfissionais: org.limiteProfissionais,
      usuariosAtivos,
      limites: getLimitesPlano(org.plano),
      transcricoes: {
        usadas: transcricoesUsadasMes,
        limite: org.transcricoesLimite,
        extras: org.transcricoesExtras,
        restantes: transcricoesRestantes,
      },
    });
  });
};

export default billingRoutes;
