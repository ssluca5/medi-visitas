# Fase 10B — Planos + Trial + Billing (Stripe)

> MediVisitas · CRM para propagandistas farmacêuticos
> Pré-requisito: Fase 10A concluída (multi-tenant funcionando)

---

## Objetivo da Fase

Implementar o sistema de cobrança com Stripe, trial de 7 dias e gestão de planos:

- Trial gratuito de 7 dias — sem cartão obrigatório no início
- Planos: Individual e Empresa com limites diferentes
- Checkout via Stripe Checkout (hosted page)
- Webhooks do Stripe para atualizar status da organização
- Portal do cliente Stripe para gerenciar assinatura
- Edge Function para verificar trials expirados diariamente

---

## Planos e Preços

```typescript
const PLANOS = {
  INDIVIDUAL: {
    nome: "Individual",
    descricao: "Para propagandistas autônomos",
    preco: "R$ 79/mês",
    stripePriceId: process.env.STRIPE_PRICE_INDIVIDUAL,
    limiteUsuarios: 1,
    recursos: [
      "Cadastro ilimitado de profissionais",
      "Agenda inteligente",
      "Histórico de visitas",
      "Pipeline comercial",
      "Transcrição por IA (50/mês)",
      "Notificações automáticas",
    ],
  },
  EMPRESA: {
    nome: "Empresa",
    descricao: "Para equipes de propagandistas",
    preco: "R$ 49/mês por usuário",
    stripePriceId: process.env.STRIPE_PRICE_EMPRESA,
    limiteUsuarios: 999, // ilimitado na prática
    recursos: [
      "Tudo do Individual",
      "Múltiplos propagandistas",
      "Dashboard do gestor",
      "Relatórios consolidados",
      "Transcrição por IA (ilimitada)",
      "Suporte prioritário",
    ],
  },
};
```

---

## Contratos de API

### `POST /billing/checkout` → 200

```json
// Body
{ "plano": "INDIVIDUAL" }  // ou "EMPRESA"

// Response
{ "checkoutUrl": "https://checkout.stripe.com/pay/cs_..." }
// Frontend redireciona para essa URL
```

### `POST /billing/portal` → 200

```json
// Response
{ "portalUrl": "https://billing.stripe.com/session/..." }
// Abre portal do Stripe para gerenciar assinatura
```

### `POST /webhooks/stripe` → 200

```
Headers: stripe-signature (verificação HMAC)
Events tratados:
  - checkout.session.completed → ativar plano
  - invoice.payment_succeeded → renovar assinatura
  - invoice.payment_failed → suspender conta
  - customer.subscription.deleted → cancelar conta
```

### `GET /billing/status` → 200

```json
{
  "plano": "INDIVIDUAL",
  "status": "ATIVO",
  "trialExpiraEm": null,
  "proximaCobranca": "2026-05-06T00:00:00.000Z",
  "limiteUsuarios": 1,
  "usuariosAtivos": 1
}
```

---

## Serviço Stripe

```typescript
// apps/api/src/services/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
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
    metadata: { organizationId, userId },
    subscription_data: {
      metadata: { organizationId },
      trial_end: "now", // trial já foi dado no cadastro, não no Stripe
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
```

---

## Webhook Handler

```typescript
// apps/api/src/routes/webhooks/stripe.ts
import { stripe } from "../../services/stripe.js";

export async function stripeWebhookRoutes(app: FastifyInstance) {
  // Rota SEM verifyClerkToken — autenticação via stripe-signature
  app.post(
    "/webhooks/stripe",
    {
      config: { rawBody: true }, // necessário para verificar assinatura
    },
    async (request, reply) => {
      const sig = request.headers["stripe-signature"] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          (request as any).rawBody,
          sig,
          endpointSecret,
        );
      } catch {
        return reply.status(400).send({ error: "Assinatura inválida" });
      }

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.CheckoutSession;
          const { organizationId } = session.metadata!;

          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              status: "ATIVO",
              stripeCustomerId: session.customer as string,
              stripeSubId: session.subscription as string,
              planoAtivoEm: new Date(),
              plano: session.metadata!.plano as any,
            },
          });
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const sub = await stripe.subscriptions.retrieve(
            invoice.subscription as string,
          );
          const orgId = sub.metadata.organizationId;

          await prisma.organization.update({
            where: { id: orgId },
            data: { status: "SUSPENSO" },
          });
          break;
        }

        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          await prisma.organization.updateMany({
            where: { stripeSubId: sub.id },
            data: { status: "CANCELADO" },
          });
          break;
        }
      }

      return { received: true };
    },
  );
}
```

---

## Edge Function — Verificar Trials Expirados

```typescript
// supabase/functions/verificar-trials/index.ts
// Roda diariamente às 06:00 BRT junto com gerar-lembretes

Deno.serve(async () => {
  const agora = new Date().toISOString();

  // Suspender organizações com trial expirado
  const { data: expiradas } = await supabase
    .from("Organization")
    .update({ status: "SUSPENSO" })
    .eq("status", "TRIAL_ATIVO")
    .lt("trialExpiraEm", agora)
    .select("id, nome");

  // Notificar OWNER de cada organização expirada
  for (const org of expiradas ?? []) {
    const { data: owner } = await supabase
      .from("OrganizationMembro")
      .select("userId")
      .eq("organizationId", org.id)
      .eq("role", "OWNER")
      .single();

    if (owner) {
      await supabase.from("Notificacao").insert({
        userId: owner.userId,
        organizationId: org.id,
        tipo: "SISTEMA",
        prioridade: "URGENTE",
        titulo: "Trial expirado",
        mensagem:
          "Seu período gratuito terminou. Assine um plano para continuar usando o MediVisitas.",
      });
    }
  }

  return new Response(JSON.stringify({ expiradas: expiradas?.length ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

## Página de Planos — Frontend

```
/planos

┌─────────────────────────────────────────────────────┐
│  Escolha seu plano                                  │
│  Trial de 7 dias gratuitos em qualquer plano        │
├─────────────────────┬───────────────────────────────┤
│  Individual         │  Empresa                      │
│  R$ 79/mês          │  R$ 49/mês por usuário        │
│                     │                               │
│  ✓ Cadastro ilimit. │  ✓ Tudo do Individual         │
│  ✓ Agenda           │  ✓ Múltiplos propagandistas   │
│  ✓ Pipeline         │  ✓ Dashboard gestor           │
│  ✓ IA 50/mês        │  ✓ IA ilimitada               │
│                     │                               │
│  [Assinar agora]    │  [Assinar agora]              │
└─────────────────────┴───────────────────────────────┘
│  ← Voltar ao dashboard (se ainda em trial)          │
└─────────────────────────────────────────────────────┘
```

---

## Variáveis de Ambiente

```env
# apps/api/.env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_INDIVIDUAL=price_...
STRIPE_PRICE_EMPRESA=price_...
APP_URL=https://app.medivisitas.com

# Para teste local
STRIPE_SECRET_KEY=sk_test_...
```

---

## Dependências

```powershell
pnpm --filter api add stripe
```

---

## Sequência de Implementação

```
1.  [PLAN]    skill brainstorming → fluxo de checkout, webhook, trial expiry
2.  [PLAN]    skill write-plan → subtarefas atômicas

3.  [STRIPE]  Criar produtos e preços no dashboard Stripe (Individual + Empresa)
4.  [STRIPE]  Configurar webhook endpoint no Stripe Dashboard
5.  [API]     Instalar stripe: pnpm --filter api add stripe
6.  [API]     Implementar services/stripe.ts
7.  [API]     Implementar POST /billing/checkout
8.  [API]     Implementar POST /billing/portal
9.  [API]     Implementar GET /billing/status
10. [API]     Implementar POST /webhooks/stripe (sem Clerk auth)
11. [API]     Registrar rawBody no Fastify para o webhook
12. [EDGE]    Implementar verificar-trials Edge Function
13. [WEB]     Página /planos com cards de planos
14. [WEB]     Botão "Assinar" chama POST /billing/checkout + redireciona
15. [WEB]     Botão "Gerenciar assinatura" chama POST /billing/portal
16. [WEB]     Banner de trial expirando (últimas 48h) na Sidebar

17. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 10B

```
Stripe
[ ] Produtos e preços criados no Stripe Dashboard
[ ] Webhook endpoint configurado
[ ] STRIPE_PRICE_INDIVIDUAL e STRIPE_PRICE_EMPRESA no .env

API
[ ] stripe instalado
[ ] POST /billing/checkout → retorna URL de checkout
[ ] POST /billing/portal → retorna URL do portal
[ ] GET /billing/status → retorna plano + status + próxima cobrança
[ ] POST /webhooks/stripe → trata 4 eventos corretamente
[ ] checkout.session.completed → ativa plano
[ ] invoice.payment_failed → suspende conta
[ ] customer.subscription.deleted → cancela conta
[ ] Verificação de assinatura Stripe (stripe-signature)

Edge Function
[ ] verificar-trials suspende organizações expiradas
[ ] Notificação URGENTE criada para OWNER ao expirar
[ ] Cron configurado junto com gerar-lembretes

Frontend
[ ] Página /planos com dois cards
[ ] Botão Assinar → checkout Stripe
[ ] Botão Gerenciar → portal Stripe
[ ] Banner de trial expirando na Sidebar (< 2 dias)
[ ] Redirecionamento para /planos quando suspenso

Geral
[ ] Teste de ponta a ponta com Stripe CLI (stripe listen)
[ ] CLAUDE.md: Fase 10B marcada como Concluída
```
