// apps/api/src/services/stripe.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});

export async function criarCheckout(
  organizationId: string,
  stripeCustomerId: string | null,
  plano: "INDIVIDUAL" | "EMPRESA",
  userId: string,
): Promise<string> {
  const priceId =
    plano === "INDIVIDUAL"
      ? process.env.STRIPE_PRICE_INDIVIDUAL!
      : process.env.STRIPE_PRICE_EMPRESA!;

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

  return session.url!;
}

export async function criarPortal(stripeCustomerId: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.APP_URL}/dashboard/configuracoes`,
  });
  return session.url;
}
