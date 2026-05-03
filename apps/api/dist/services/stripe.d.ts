import Stripe from "stripe";
export declare const stripe: Stripe;
export declare function criarCheckout(organizationId: string, stripeCustomerId: string | null, plano: "BASICO" | "PROFISSIONAL" | "EQUIPE", userId: string, priceId: string): Promise<string>;
export declare function criarCheckoutPacoteIa(organizationId: string, stripeCustomerId: string | null, quantidade: 20 | 50 | 100, priceId: string): Promise<string>;
export declare function criarPortal(stripeCustomerId: string): Promise<string>;
