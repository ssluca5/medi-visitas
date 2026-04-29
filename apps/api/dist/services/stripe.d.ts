import Stripe from "stripe";
export declare const stripe: Stripe;
export declare function criarCheckout(
  organizationId: string,
  stripeCustomerId: string | null,
  plano: "INDIVIDUAL" | "EMPRESA",
  userId: string,
): Promise<string>;
export declare function criarPortal(stripeCustomerId: string): Promise<string>;
