# Fase 10B — Planos + Trial + Billing (Stripe) — Design Spec

> Date: 2026-04-19
> Status: Approved
> Prerequisite: Fase 10A (multi-tenant) complete

---

## Overview

Implement Stripe billing integration for MediVisitas SaaS platform:

- 7-day trial on signup (already in Organization model)
- Two plans: Individual (R$79/mo) and Empresa (R$49/mo per user)
- Stripe Checkout (hosted page) for subscription
- Stripe Customer Portal for self-service management
- Webhooks to sync subscription state
- Edge Function to suspend expired trials
- Frontend: planos page + sidebar trial banner

---

## Decisions

| Decision                         | Choice                                            | Rationale                                  |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| rawBody for webhook verification | `@fastify/rawBody` plugin                         | Official, clean API, zero per-route config |
| Billing routes structure         | Single `billing/index.ts`                         | 3 endpoints, follows existing pattern      |
| Trial banner data source         | Layout `+layout.server.ts` passes `trialExpiraEm` | No extra API call, data already loaded     |
| Webhook plano source             | `session.metadata`                                | Simpler, direct access in webhook handler  |

---

## Architecture

### Data Model (existing — no migration)

Organization model already has all required fields:

- `plano PlanoOrganizacao` (TRIAL, INDIVIDUAL, EMPRESA, ENTERPRISE)
- `status StatusOrganizacao` (TRIAL_ATIVO, ATIVO, SUSPENSO, CANCELADO)
- `trialExpiraEm DateTime`
- `planoAtivoEm DateTime?`
- `stripeCustomerId String?`
- `stripeSubId String?`
- `limiteUsuarios Int`

### API Flow

```
User clicks "Assinar" → POST /billing/checkout → Stripe Checkout URL → redirect
                                                              ↓
                                              Stripe processes payment
                                                              ↓
                                              POST /webhooks/stripe (checkout.session.completed)
                                                              ↓
                                              Organization updated (ATIVO + stripeIds)
```

```
User clicks "Gerenciar" → POST /billing/portal → Stripe Portal URL → redirect
```

```
Trial expired → tenant hook blocks with 402 → frontend shows /planos
```

---

## API Endpoints

### `POST /billing/checkout`

- Auth: `verifyClerkToken` + `resolveTenant` + **role === 'OWNER' check**
- Body: `{ "plano": "INDIVIDUAL" | "EMPRESA" }`
- Response: `{ "checkoutUrl": "https://checkout.stripe.com/..." }`
- Error cases:
  - 403 if role !== OWNER
  - 409 if org already has active subscription (status === ATIVO)
  - 502 if Stripe API call fails
- Creates Stripe Checkout Session with:
  - `mode: "subscription"`
  - `line_items: [{ price: STRIPE_PRICE_*, quantity: 1 }]` — Empresa: seat count managed via Stripe Portal, not checkout quantity
  - `metadata: { organizationId, userId, plano }`
  - `subscription_data.metadata: { organizationId }`
  - `success_url: APP_URL/dashboard?checkout=success`
  - `cancel_url: APP_URL/planos?checkout=cancelled`

### `POST /billing/portal`

- Auth: `verifyClerkToken` + `resolveTenant` + **role === 'OWNER' check**
- Response: `{ "portalUrl": "https://billing.stripe.com/..." }`
- Error cases:
  - 403 if role !== OWNER
  - 400 `{ error: "Organização não possui assinatura ativa" }` if `stripeCustomerId` is null
  - 502 if Stripe API call fails
- `return_url: APP_URL/dashboard/configuracoes`

### `GET /billing/status`

- Auth: `verifyClerkToken` + `resolveTenant`
- Response:

```json
{
  "plano": "TRIAL",
  "status": "TRIAL_ATIVO",
  "trialExpiraEm": "2026-04-26T00:00:00.000Z",
  "proximaCobranca": null,
  "limiteUsuarios": 1,
  "usuariosAtivos": 1
}
```

- `proximaCobranca`: fetched from Stripe via `stripe.subscriptions.retrieve(stripeSubId)` → `current_period_end`. Null if no active subscription.
- `usuariosAtivos`: `prisma.organizationMembro.count({ where: { organizationId, deletedAt: null } })`
- Error: 404 if org deleted (should not happen due to tenant hook)

### `POST /webhooks/stripe`

- Auth: **None** — verified via `stripe-signature` header
- **rawBody config**: `@fastify/rawBody` must be registered with `{ runFirst: true }` to ensure raw buffer is available before any body parser runs. `request.rawBody` MUST be a `Buffer`, not parsed JSON.
- **Idempotency**: For each event, check current org state before mutating. If org already in expected state, skip update and return 200.
- **Transaction**: All org updates in `checkout.session.completed` use `prisma.$transaction()`.
- **Always return 200**: After signature verification, always return `{ received: true }` — even if org not found or DB error. Log errors but don't let Stripe retry on unprocessable events.
- Events handled:
  - `checkout.session.completed` → org → ATIVO, store `stripeCustomerId` + `stripeSubId` + `plano` + `planoAtivoEm` + `limiteUsuarios` (1 for INDIVIDUAL, keep current for EMPRESA)
  - `invoice.payment_failed` → org → SUSPENSO (skip if already SUSPENSO/CANCELADO)
  - `customer.subscription.deleted` → org → CANCELADO (skip if already CANCELADO)
- **Re-subscription**: CANCELADO orgs can create new checkout — the endpoint allows it since status !== ATIVO.
- **Race condition (webhook vs redirect)**: Frontend `?checkout=success` page should poll `GET /billing/status` until status === ATIVO, or show "Ativando assinatura..." loading state.

---

## Edge Function: verificar-trials

- File: `supabase/functions/verificar-trials/index.ts`
- Queries: `Organization WHERE status=TRIAL_ATIVO AND trialExpiraEm < now()`
- Updates: set status to SUSPENSO
- Creates: Notificacao (tipo=SISTEMA, prioridade=URGENTE) for each org OWNER
- Cron: daily at 06:00 BRT (09:00 UTC)

---

## Frontend

### Planos Page (`/planos`)

Replace placeholder with two plan cards:

```
┌─────────────────────────┬──────────────────────────────┐
│  Individual             │  Empresa                     │
│  R$ 79/mês              │  R$ 49/mês por usuário       │
│                         │                              │
│  ✓ Cadastro ilimitado   │  ✓ Tudo do Individual        │
│  ✓ Agenda inteligente   │  ✓ Múltiplos propagandistas  │
│  ✓ Pipeline comercial   │  ✓ Dashboard do gestor       │
│  ✓ IA 50/mês            │  ✓ IA ilimitada              │
│                         │                              │
│  [Assinar agora]        │  [Assinar agora]             │
└─────────────────────────┴──────────────────────────────┘
```

- "Assinar" → `POST /billing/checkout` → redirect to `checkoutUrl`
- If active plan: show "Gerenciar assinatura" → `POST /billing/portal`
- Uses `PUBLIC_API_URL` from `$env/static/public`

### Sidebar Trial Banner

- When `plano === 'TRIAL'` and `diasRestantes <= 2`:
  - `diasRestantes === 0`: "Trial expira hoje" (still usable until end of day)
  - `diasRestantes === 1`: "Trial expira amanhã"
  - `diasRestantes === 2`: "Trial expira em 2 dias"
  - Amber banner below nav with link to `/planos`
- `diasRestantes` computed from `trialExpiraEm` prop (passed from layout)
- Existing plan badge remains unchanged

### Layout Changes

- `+layout.server.ts`: pass `trialExpiraEm` to Sidebar component
- Sidebar receives `trialExpiraEm` prop, computes `diasRestantes`

---

## Files to Create

| File                                           | Purpose                                     |
| ---------------------------------------------- | ------------------------------------------- |
| `apps/api/src/services/stripe.ts`              | Stripe client + criarCheckout + criarPortal |
| `apps/api/src/routes/billing/index.ts`         | 3 billing endpoints                         |
| `apps/api/src/routes/webhooks/stripe.ts`       | Stripe webhook handler                      |
| `supabase/functions/verificar-trials/index.ts` | Trial expiry edge function                  |

## Files to Modify

| File                                              | Change                                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `apps/api/src/app.ts`                             | Register `@fastify/rawBody` plugin (runFirst: true) + billing routes + stripe webhook |
| `apps/api/.env`                                   | Add STRIPE\_\* env vars                                                               |
| `apps/web/src/routes/planos/+page.svelte`         | Replace placeholder with plan cards                                                   |
| `apps/web/src/lib/components/Sidebar.svelte`      | Add trial banner                                                                      |
| `apps/web/src/routes/dashboard/+layout.server.ts` | Pass trialExpiraEm                                                                    |

---

## Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_INDIVIDUAL=price_...
STRIPE_PRICE_EMPRESA=price_...
APP_URL=http://localhost:3000
```

---

## Testing

- Webhook: `stripe listen --forward-to localhost:3002/webhooks/stripe`
- Checkout: create test subscription via Stripe test mode
- Trial: manually set `trialExpiraEm` to past date, verify 402 + notification
- Edge function: invoke locally via `supabase functions serve verificar-trials`
