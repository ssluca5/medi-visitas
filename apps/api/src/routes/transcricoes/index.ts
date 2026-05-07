import { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { verificarLimiteTranscricao } from "../../services/transcricoes.js";
import { criarCheckoutPacoteIa } from "../../services/stripe.js";
import { getLimitesPlano } from "../../services/planos.js";
import { z } from "zod";

const ComprarPacoteSchema = z.object({
  quantidade: z
    .union([z.literal(20), z.literal(50), z.literal(100)])
    .default(20),
});

function getPriceIdPacoteIa(quantidade: 20 | 50 | 100): string {
  const legacy = process.env.STRIPE_PRICE_PACOTE_TRANSCRICOES;

  const map: Record<number, string | undefined> = {
    20: process.env.STRIPE_PRICE_IA_20 ?? legacy,
    50: process.env.STRIPE_PRICE_IA_50 ?? legacy,
    100: process.env.STRIPE_PRICE_IA_100 ?? legacy,
  };

  const priceId = map[quantidade];
  if (!priceId) {
    throw new Error(
      `Price ID nao configurado para pacote IA +${quantidade}. ` +
        `Defina STRIPE_PRICE_IA_${quantidade} ou STRIPE_PRICE_PACOTE_TRANSCRICOES no .env`,
    );
  }
  return priceId;
}

const transcricoesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  app.get("/status", async (request, reply) => {
    const { permitido, usadas, limite, extras } =
      await verificarLimiteTranscricao(request.organizationId!);
    return { usadas, limite, extras, restantes: limite - usadas, permitido };
  });

  app.post(
    "/comprar-pacote",
    { config: { rateLimit: { max: 5, timeWindow: "1 hour" } } },
    async (request, reply) => {
      const org = await prisma.organization.findUnique({
        where: { id: request.organizationId! },
        select: { plano: true, stripeCustomerId: true },
      });

      if (!org) {
        return reply.status(404).send({ error: "Organizacao nao encontrada" });
      }

      const limites = getLimitesPlano(org.plano);
      if (!limites.pacotesIaDisponiveis) {
        return reply.status(402).send({
          error:
            "Pacotes adicionais de IA estao disponiveis a partir do Plano Profissional.",
          code: "FEATURE_NOT_AVAILABLE",
        });
      }

      const body = ComprarPacoteSchema.parse(request.body ?? {});
      const checkoutUrl = await criarCheckoutPacoteIa(
        request.organizationId!,
        org.stripeCustomerId,
        body.quantidade,
        getPriceIdPacoteIa(body.quantidade),
      );

      return { checkoutUrl };
    },
  );
};

export default transcricoesRoutes;
