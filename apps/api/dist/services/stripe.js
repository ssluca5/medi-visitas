// apps/api/src/services/stripe.ts
import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY não configurada — billing desativado");
}
// Usar chave vazia como fallback — evita crash na inicialização
// O Stripe só é chamado de fato quando o usuário assina
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder",
  {
    apiVersion: "2026-04-22.dahlia",
  },
);
export async function criarCheckout(
  organizationId,
  stripeCustomerId,
  plano,
  userId,
) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Billing não configurado. Adicione STRIPE_SECRET_KEY no .env",
    );
  }
  const priceId =
    plano === "INDIVIDUAL"
      ? process.env.STRIPE_PRICE_INDIVIDUAL
      : process.env.STRIPE_PRICE_EMPRESA;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: stripeCustomerId ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.APP_URL}/planos?checkout=cancelled`,
    metadata: { organizationId, userId, plano },
    subscription_data: {
      metadata: { organizationId },
    },
    locale: "pt-BR",
  });
  return session.url;
}
export async function criarPortal(stripeCustomerId) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Billing não configurado. Adicione STRIPE_SECRET_KEY no .env",
    );
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.APP_URL}/dashboard/configuracoes`,
  });
  return session.url;
}
