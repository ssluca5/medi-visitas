// apps/api/src/services/stripe.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY não configurada — billing desativado");
}

// Usar chave vazia como fallback — evita crash na inicialização
// O Stripe só é chamado de fato quando o usuário assina
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder",
);

export async function criarCheckout(
  organizationId: string,
  stripeCustomerId: string | null,
  plano: "BASICO" | "PROFISSIONAL" | "EQUIPE",
  userId: string,
  priceId: string,
): Promise<string> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Billing não configurado. Adicione STRIPE_SECRET_KEY no .env",
    );
  }

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

export async function criarCheckoutPacoteIa(
  organizationId: string,
  stripeCustomerId: string | null,
  quantidade: 20 | 50 | 100,
  priceId: string,
): Promise<string> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Billing nao configurado. Adicione STRIPE_SECRET_KEY no .env",
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer: stripeCustomerId ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/dashboard?pacote=ia`,
    cancel_url: `${process.env.APP_URL}/dashboard`,
    metadata: {
      organizationId,
      tipo: "PACOTE_IA",
      quantidade: String(quantidade),
    },
    locale: "pt-BR",
  });

  return session.url!;
}

export async function criarPortal(stripeCustomerId: string): Promise<string> {
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
