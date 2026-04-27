# Multi-tenant SaaS — Design Spec

> MediVisitas Phase 10A
> Date: 2026-04-26
> Stack: SvelteKit 2 + Svelte 5 + Fastify + Prisma + Supabase + Clerk

---

## Summary

Transform MediVisitas from single-user to multi-tenant SaaS. Multiple companies (pharmaceutical sales reps) share the platform with complete data isolation via `organizationId` on all business tables. Clerk Organizations handles membership and invitations. Plans: trial (7 days), individual (1 user), empresa (multiuser).

**Scope limitation**: Clerk webhook handler for org membership sync is deferred to a future phase. The current implementation uses Clerk JWT `org_id` claim for tenant resolution and manual member management via API.

---

## Design Decisions

| Decision                                                                                 | Choice                                                 | Rationale                                                       |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| Child entities (`Endereco`, `ContatoProfissional`, `VisitaMaterial`, `SubEspecialidade`) | Inherit `organizationId` from parent FK                | Avoids duplication, prevents inconsistency                      |
| Existing `Organization` model                                                            | Extend in place                                        | Model exists but is minimal; no data loss risk                  |
| Migration strategy                                                                       | Single migration with ordered raw SQL                  | 3 logical steps (create nullable → fill → NOT NULL) in one file |
| Tenant resolution                                                                        | Separate `resolveTenant` hook after `verifyClerkToken` | Clean separation of concerns, follows existing Fastify patterns |
| Role filtering                                                                           | `buildTenantWhere()` helper                            | MEMBER filters by `userId`, OWNER sees all org data             |

---

## Data Model

### New enums

```prisma
enum PlanoOrganizacao {
  TRIAL        // 7 days free
  INDIVIDUAL   // 1 rep
  EMPRESA      // multiple reps
  ENTERPRISE   // custom
}

enum StatusOrganizacao {
  TRIAL_ATIVO
  ATIVO
  SUSPENSO     // payment failed
  CANCELADO
}

enum RoleMembro {
  OWNER    // manager — invites, manages billing
  MEMBER   // rep — sees own data only
}
```

### Expanded `Organization` model

> **Note**: Existing `Organization.name` is renamed to `nome` to match the Portuguese convention used across all other models.

```prisma
model Organization {
  id                String              @id @default(cuid())
  clerkOrgId        String              @unique
  nome              String
  slug              String              @unique  // kebab-case of nome, e.g. "farmacia-silva"
  plano             PlanoOrganizacao    @default(TRIAL)
  status            StatusOrganizacao   @default(TRIAL_ATIVO)
  trialExpiraEm     DateTime            // UTC
  planoAtivoEm      DateTime?
  stripeCustomerId  String?             @unique
  stripeSubId       String?             @unique
  limiteUsuarios    Int                 @default(1)
  deletedAt         DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  membros           OrganizationMembro[]
  profissionais     Profissional[]
  especialidades    Especialidade[]
  visitas           Visita[]
  agendaItems       AgendaItem[]
  notificacoes      Notificacao[]
  materiais         MaterialTecnico[]
  estagioLogs       EstagioLog[]

  @@index([clerkOrgId])
  @@index([status])
  @@index([trialExpiraEm])
}
```

**Slug generation**: Auto-generated as kebab-case of `nome` (e.g., "Farmácia Silva" → "farmacia-silva"). On collision, append a short cuid suffix. For the default migration org, use `'organizacao-padrao'`.

### New `OrganizationMembro` model

```prisma
model OrganizationMembro {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)
  userId         String       // Clerk userId (sub claim)
  role           RoleMembro   @default(MEMBER)
  deletedAt      DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([organizationId, userId])
  @@index([userId])
  @@index([organizationId])
}
```

### Tables receiving `organizationId`

Each table gets these additions:

```prisma
organizationId String
organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)
@@index([organizationId])
```

| Table             | Notes                                                            |
| ----------------- | ---------------------------------------------------------------- |
| `Profissional`    | Also keeps existing `userId` for MEMBER filtering                |
| `Especialidade`   |                                                                  |
| `Visita`          | No `deletedAt` — filter by `status` instead of `deletedAt: null` |
| `AgendaItem`      |                                                                  |
| `Notificacao`     |                                                                  |
| `MaterialTecnico` |                                                                  |
| `EstagioLog`      | Immutável — no `deletedAt`, no `updatedAt`                       |

### Tables WITHOUT `organizationId` (inherit from parent)

- `Endereco` — via `Profissional.enderecoId`
- `ContatoProfissional` — via `Profissional.id`
- `SubEspecialidade` — via `Especialidade.id`
- `VisitaMaterial` — via `Visita.id`

### `buildTenantWhere` model awareness

The `buildTenantWhere` helper must handle models without `deletedAt` (e.g., `Visita`):

```typescript
export function buildTenantWhere(
  request: FastifyRequest,
  options?: { hasDeletedAt?: boolean },
) {
  const where: Record<string, unknown> = {
    organizationId: request.organizationId,
  };
  if (options?.hasDeletedAt !== false) {
    where.deletedAt = null;
  }
  if (request.role === "MEMBER") {
    where.userId = request.userId;
  }
  return where;
}
```

---

## Migration Strategy

Single `prisma migrate dev --name tenant-multi-tenant` with raw SQL in order:

1. Create enums (`PlanoOrganizacao`, `StatusOrganizacao`, `RoleMembro`)
2. Rename `Organization.name` → `Organization.nome` (column rename)
3. Expand `Organization` table — add `slug`, `plano`, `status`, `trialExpiraEm`, `planoAtivoEm`, `stripeCustomerId`, `stripeSubId`, `limiteUsuarios`
4. Create `OrganizationMembro` table
5. Add nullable `organizationId` column to all 7 tables
6. Insert default organization (migration-only placeholder):
   ```sql
   INSERT INTO "Organization" (id, "clerkOrgId", nome, slug, plano, status, "trialExpiraEm", "limiteUsuarios", "createdAt", "updatedAt")
   VALUES ('org_default', 'org_default', 'Organização Padrão', 'organizacao-padrao', 'TRIAL', 'TRIAL_ATIVO', now() + interval '7 days', 999, now(), now());
   ```
7. Backfill `organizationId` on all 7 tables:
   ```sql
   UPDATE "Profissional" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
   UPDATE "Especialidade" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
   UPDATE "Visita" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
   UPDATE "AgendaItem" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
   UPDATE "Notificacao" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
   UPDATE "MaterialTecnico" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
   UPDATE "EstagioLog" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
   ```
8. Migrate existing users to OWNER members of default org:
   ```sql
   INSERT INTO "OrganizationMembro" (id, "organizationId", "userId", role, "createdAt", "updatedAt")
   SELECT gen_random_uuid(), 'org_default', "clerkId", 'OWNER', now(), now()
   FROM "User" WHERE "deletedAt" IS NULL;
   ```
9. Set NOT NULL on all `organizationId` columns
10. Add FK constraints with `ON DELETE RESTRICT`
11. Create indexes on `organizationId`

---

## API Architecture

### New files

| File                                       | Purpose                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `apps/api/src/hooks/tenant.ts`             | `resolveTenant` preHandler hook                                                     |
| `apps/api/src/lib/tenant.ts`               | `buildTenantWhere()` helper                                                         |
| `apps/api/src/routes/onboarding/index.ts`  | `POST /onboarding/individual`, `POST /onboarding/empresa`, `GET /onboarding/status` |
| `apps/api/src/routes/organizacao/index.ts` | Member management (OWNER only)                                                      |

### `resolveTenant` hook

**Type augmentation** (in `apps/api/src/hooks/tenant.ts`):

```typescript
declare module "fastify" {
  interface FastifyRequest {
    organizationId?: string;
    role?: "OWNER" | "MEMBER";
  }
}
```

**Flow**:

```
verifyClerkToken sets request.userId and request.orgId (from Clerk JWT org_id claim)
  ↓
resolveTenant:
  1. If request.orgId is set → lookup Organization by clerkOrgId, then find membership
  2. If request.orgId is not set → lookup first active OrganizationMembro for userId
  3. No membership → 403 "Complete o onboarding"
  4. Org TRIAL_ATIVO + trialExpiraEm < now → update to SUSPENSO → 402 TRIAL_EXPIRED
  5. Org SUSPENSO or CANCELADO → 402 ACCOUNT_SUSPENDED
  6. Active → set request.organizationId, request.role
```

**Multi-org handling**: Users can belong to multiple orgs. The active org is determined by the Clerk JWT `org_id` claim (set when user switches orgs in Clerk). If no `org_id` in JWT, fall back to the first active membership. This matches how Clerk Organizations works.

### `buildTenantWhere()` helper

```typescript
export function buildTenantWhere(
  request: FastifyRequest,
  options?: { hasDeletedAt?: boolean },
) {
  const where: Record<string, unknown> = {
    organizationId: request.organizationId,
  };
  // Visita has no deletedAt — filter by status instead
  if (options?.hasDeletedAt !== false) {
    where.deletedAt = null;
  }
  if (request.role === "MEMBER") {
    where.userId = request.userId;
  }
  return where;
}
```

Usage in routes:

```typescript
// Most models (have deletedAt)
const where = buildTenantWhere(request);
// Visita (no deletedAt)
const where = buildTenantWhere(request, { hasDeletedAt: false });
```

### Route changes

All existing routes change `preHandler: [verifyClerkToken]` → `preHandler: [verifyClerkToken, resolveTenant]`.

All queries use `buildTenantWhere(request)` instead of manual `userId` filtering.

### New API routes

| Route                                     | Auth  | Body/Response                                                |
| ----------------------------------------- | ----- | ------------------------------------------------------------ |
| `POST /onboarding/individual`             | Clerk | Creates org (limiteUsuarios=1) + OWNER member. Returns org.  |
| `POST /onboarding/empresa`                | Clerk | `{ nomeEmpresa }`. Creates org + OWNER member. Returns org.  |
| `GET /onboarding/status`                  | Clerk | `{ concluido, organizationId?, role?, plano?, status? }`     |
| `GET /organizacao/membros`                | OWNER | Lists active members with user info                          |
| `POST /organizacao/membros/convidar`      | OWNER | `{ email, role }`. Creates Clerk invitation + member record. |
| `DELETE /organizacao/membros/:userId`     | OWNER | Soft deletes member                                          |
| `PATCH /organizacao/membros/:userId/role` | OWNER | `{ role }`. Changes member role.                             |

---

## Frontend

### Layout (`+layout.server.ts`)

```
public routes (/login, /signup, /onboarding, /planos) → pass through
no userId → redirect /login
GET /onboarding/status:
  concluido=false → redirect /onboarding
  status=SUSPENSO → redirect /planos?motivo=trial_expirado
  active → return { role, plano, organizationId }
```

### New pages

**`/onboarding`** — Two-step wizard:

1. "Como voce usara o MediVisitas?" → [Sou propagandista individual] [Represento uma empresa]
   2A (individual): Confirm → POST /onboarding/individual → redirect /dashboard
   2B (empresa): Enter company name → POST /onboarding/empresa → redirect /dashboard

Uses `$state` for step tracking, `Button.svelte` for actions, CSS variables for styling.

**`/planos`** — Placeholder page for trial expired / suspended state. Shows message and "Em breve" for billing plans.

### Sidebar badge

Footer shows trial status badge:

- TRIAL: yellow badge with "Trial — Xd restantes"
- Active plans: green badge with plan name
- Days calculated from `trialExpiraEm` via `$derived`

---

## Testing Strategy

### TDD for new code

1. `resolveTenant` hook tests:
   - Returns 403 when no membership found
   - Returns 402 TRIAL_EXPIRED when trial expired
   - Returns 402 ACCOUNT_SUSPENDED when suspended
   - Sets organizationId and role when active
2. Onboarding route tests:
   - POST /onboarding/individual creates org + member
   - POST /onboarding/empresa creates org with name + member
   - GET /onboarding/status returns correct state
3. Existing route tests updated to include tenant context

### Integration verification

- All existing tests pass with tenant context
- MEMBER can only see own data
- OWNER can see all org data
- Cross-org isolation verified

---

## Files Modified

| File                                             | Change                                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `packages/database/prisma/schema.prisma`         | Add enums, expand Organization, add OrganizationMembro, add organizationId to 7 tables |
| `apps/api/src/hooks/auth.ts`                     | No changes (already extracts orgId)                                                    |
| `apps/api/src/hooks/tenant.ts`                   | NEW — resolveTenant hook                                                               |
| `apps/api/src/lib/tenant.ts`                     | NEW — buildTenantWhere helper                                                          |
| `apps/api/src/routes/onboarding/index.ts`        | NEW — onboarding routes                                                                |
| `apps/api/src/routes/organizacao/index.ts`       | NEW — member management routes                                                         |
| `apps/api/src/routes/profissionais/index.ts`     | Add resolveTenant, use buildTenantWhere                                                |
| `apps/api/src/routes/visitas/index.ts`           | same                                                                                   |
| `apps/api/src/routes/agenda/index.ts`            | same                                                                                   |
| `apps/api/src/routes/pipeline/index.ts`          | same                                                                                   |
| `apps/api/src/routes/dashboard/index.ts`         | same                                                                                   |
| `apps/api/src/routes/busca/index.ts`             | same                                                                                   |
| `apps/api/src/routes/notificacoes/index.ts`      | same                                                                                   |
| `apps/api/src/routes/materiais/index.ts`         | same                                                                                   |
| `apps/api/src/routes/especialidades/index.ts`    | same                                                                                   |
| `apps/api/src/routes/subespecialidades/index.ts` | same                                                                                   |
| `apps/web/src/routes/+layout.server.ts`          | Add onboarding/status check, redirects                                                 |
| `apps/web/src/routes/onboarding/+page.svelte`    | NEW — onboarding wizard                                                                |
| `apps/web/src/routes/planos/+page.svelte`        | NEW — trial expired page                                                               |
| Sidebar component                                | Add trial badge in footer                                                              |

---

## Scope Limitations (deferred)

- **Clerk webhook handler**: `organization.created`, `organizationMembership.created` webhooks for automatic sync are deferred. Current implementation uses JWT `org_id` claim + manual API member management.
- **Supabase RLS**: Not needed — tenant isolation is enforced at the application layer via Prisma queries with `organizationId` filter. RLS could be added as defense-in-depth in a future phase.
- **Stripe billing**: `stripeCustomerId` and `stripeSubId` fields are in the schema but billing integration is deferred. Trial → suspended flow works without Stripe.

---

## Checklist

- [ ] Migration: Enums created (`PlanoOrganizacao`, `StatusOrganizacao`, `RoleMembro`)
- [ ] Migration: `Organization.name` renamed to `nome`, new columns added
- [ ] Migration: `OrganizationMembro` table created
- [ ] Migration: `organizationId` on 7 tables with indexes and FKs
- [ ] Migration: Default org created, existing data backfilled, users migrated to OWNER members
- [ ] Migration: `prisma generate` run after migration
- [ ] API: `FastifyRequest` type augmentation for `organizationId` and `role`
- [ ] API: `resolveTenant` hook uses Clerk JWT `org_id` for multi-org resolution
- [ ] API: `resolveTenant` returns 402 for expired/suspended
- [ ] API: All routes use `[verifyClerkToken, resolveTenant]`
- [ ] API: `buildTenantWhere` filters by org + userId for MEMBER, handles `hasDeletedAt` option
- [ ] API: Onboarding routes create org + member
- [ ] API: Member management routes (OWNER only) with Clerk invitation integration
- [ ] Frontend: Layout redirects to /onboarding if not completed
- [ ] Frontend: Layout redirects to /planos if suspended
- [ ] Frontend: /onboarding wizard works for individual and empresa
- [ ] Frontend: Sidebar shows trial badge with days remaining
- [ ] Tests: All existing tests pass with tenant context
- [ ] Tests: New TDD tests for resolveTenant and onboarding
- [ ] CLAUDE.md: Phase 10A marked as complete
