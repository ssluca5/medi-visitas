import { prisma } from "../../lib/prisma.js";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { verificarLimiteTranscricao } from "../../services/transcricoes.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});
const transcricoesRoutes = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });
  app.get("/status", async (request, reply) => {
    const { permitido, usadas, limite, extras } =
      await verificarLimiteTranscricao(request.organizationId);
    return { usadas, limite, extras, restantes: limite - usadas, permitido };
  });
  app.post("/comprar-pacote", async (request, reply) => {
    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId },
      select: { stripeCustomerId: true },
    });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: org?.stripeCustomerId ?? undefined,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PACOTE_TRANSCRICOES,
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/dashboard?pacote=transcricoes`,
      cancel_url: `${process.env.APP_URL}/dashboard`,
      metadata: {
        organizationId: request.organizationId,
        tipo: "PACOTE_TRANSCRICOES",
        quantidade: "20",
      },
    });
    return { checkoutUrl: session.url };
  });
};
export default transcricoesRoutes;
