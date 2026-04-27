# Multi-tenant SaaS Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform MediVisitas from single-user to multi-tenant with organization-based data isolation.

**Architecture:** Hook chain pattern — `verifyClerkToken` → `resolveTenant` sets `organizationId` and `role` on request. All queries filter by `organizationId`. MEMBER also filters by `userId`. Single Prisma migration with ordered SQL (create nullable → backfill → NOT NULL).

**Tech Stack:** Prisma 5.22, Fastify 4.28, SvelteKit 2, Svelte 5, Clerk, Supabase PostgreSQL

**Spec:** `docs/superpowers/specs/2026-04-26-multi-tenant-design.md`

---

## File Structure

| File                                                    | Action | Purpose                                                                                |
| ------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| `packages/database/prisma/schema.prisma`                | Modify | Add enums, expand Organization, add OrganizationMembro, add organizationId to 7 tables |
| `packages/database/prisma/migrations/.../migration.sql` | Create | Raw SQL migration                                                                      |
| `apps/api/src/hooks/tenant.ts`                          | Create | `resolveTenant` hook + type augmentation                                               |
| `apps/api/src/lib/tenant.ts`                            | Create | `buildTenantWhere()` helper                                                            |
| `apps/api/src/routes/onboarding/index.ts`               | Create | Onboarding routes                                                                      |
| `apps/api/src/routes/onboarding/index.test.ts`          | Create | TDD tests                                                                              |
| `apps/api/src/routes/organizacao/index.ts`              | Create | Member management routes                                                               |
| `apps/api/src/hooks/tenant.test.ts`                     | Create | TDD tests for resolveTenant                                                            |
| `apps/api/src/routes/profissionais/index.ts`            | Modify | Add resolveTenant, use buildTenantWhere                                                |
| `apps/api/src/routes/visitas/index.ts`                  | Modify | same                                                                                   |
| `apps/api/src/routes/agenda/index.ts`                   | Modify | same                                                                                   |
| `apps/api/src/routes/pipeline/index.ts`                 | Modify | same                                                                                   |
| `apps/api/src/routes/dashboard/index.ts`                | Modify | same                                                                                   |
| `apps/api/src/routes/busca/index.ts`                    | Modify | same                                                                                   |
| `apps/api/src/routes/notificacoes/index.ts`             | Modify | same                                                                                   |
| `apps/api/src/routes/materiais/index.ts`                | Modify | same                                                                                   |
| `apps/api/src/routes/especialidades/index.ts`           | Modify | same                                                                                   |
| `apps/api/src/routes/subespecialidades/index.ts`        | Modify | same                                                                                   |
| `apps/api/src/routes/profissionais/timeline.ts`         | Modify | same (Pattern B — addHook)                                                             |
| `apps/api/src/routes/me.ts`                             | Modify | Add resolveTenant (Pattern A)                                                          |
| `apps/api/src/app.ts`                                   | Modify | Register onboarding + organizacao routes                                               |
| `apps/web/src/routes/+layout.server.ts`                 | Modify | Add onboarding/status check, redirects                                                 |
| `apps/web/src/routes/onboarding/+page.svelte`           | Create | Onboarding wizard                                                                      |
| `apps/web/src/routes/planos/+page.svelte`               | Create | Trial expired page                                                                     |
| `apps/web/src/lib/components/Sidebar.svelte`            | Modify | Add trial badge in footer                                                              |

---

## Route Pattern Reference

Two patterns exist in the codebase. Each task notes which pattern the file uses.

**Pattern A — per-route preHandler** (profissionais, especialidades, subespecialidades, me):

```typescript
app.get("/path", { preHandler: [verifyClerkToken] }, async (req, reply) => { ... })
```

Change to: `{ preHandler: [verifyClerkToken, resolveTenant] }`

**Pattern B — addHook at top** (visitas, agenda, pipeline, dashboard, busca, notificacoes, materiais, timeline):

```typescript
app.addHook("preHandler", verifyClerkToken);
```

Change to: `app.addHook("preHandler", async (req, reply) => { await verifyClerkToken(req, reply); if (!reply.sent) await resolveTenant(req, reply); });`

**userId filtering in existing routes:**

- `visitas`, `agenda`, `pipeline`, `dashboard`, `notificacoes`: filter by `userId` → keep for MEMBER, remove for OWNER (use `buildTenantWhere`)
- `profissionais`: no userId filter on GET list → add `organizationId` filter via `buildTenantWhere`
- `especialidades`, `subespecialidades`: no userId filter (shared data) → add `organizationId` filter
- `materiais`: no userId filter → add `organizationId` filter
- `busca`: no userId filter → add `organizationId` filter

**Models WITHOUT `deletedAt`** (must use `hasDeletedAt: false`):

- `Visita` — filter by `status` instead
- `EstagioLog` — immutable, no `deletedAt`, no `updatedAt`

Any query on these models must use `buildTenantWhere(request, { hasDeletedAt: false })` to avoid runtime errors.

---

## Chunk 1: Database Schema + Migration

### Task 1: Update Prisma schema

**Files:**

- Modify: `packages/database/prisma/schema.prisma`

- [ ] **Step 1: Add new enums**

Add after the existing enums (before `// MODELS`):

```prisma
enum PlanoOrganizacao {
  TRIAL
  INDIVIDUAL
  EMPRESA
  ENTERPRISE
}

enum StatusOrganizacao {
  TRIAL_ATIVO
  ATIVO
  SUSPENSO
  CANCELADO
}

enum RoleMembro {
  OWNER
  MEMBER
}
```

- [ ] **Step 2: Expand Organization model**

Replace the existing `Organization` model with:

```prisma
model Organization {
  id                String              @id @default(cuid())
  clerkOrgId        String              @unique
  nome              String
  slug              String              @unique
  plano             PlanoOrganizacao    @default(TRIAL)
  status            StatusOrganizacao   @default(TRIAL_ATIVO)
  trialExpiraEm     DateTime
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

- [ ] **Step 3: Add OrganizationMembro model**

Add after Organization:

```prisma
model OrganizationMembro {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)
  userId         String
  role           RoleMembro   @default(MEMBER)
  deletedAt      DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([organizationId, userId])
  @@index([userId])
  @@index([organizationId])
}
```

- [ ] **Step 4: Add organizationId to Profissional**

Add before `createdAt`:

```prisma
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)
```

Add index:

```prisma
  @@index([organizationId])
```

- [ ] **Step 5: Add organizationId to Especialidade**

Same pattern as Profissional.

- [ ] **Step 6: Add organizationId to Visita**

Same pattern. Note: Visita has no `deletedAt`.

- [ ] **Step 7: Add organizationId to AgendaItem**

Same pattern.

- [ ] **Step 8: Add organizationId to Notificacao**

Same pattern.

- [ ] **Step 9: Add organizationId to MaterialTecnico**

Same pattern.

- [ ] **Step 10: Add organizationId to EstagioLog**

Same pattern. Note: EstagioLog has no `updatedAt`.

- [ ] **Step 11: Validate schema**

Run: `pnpm --filter database prisma format`
Expected: No errors

### Task 2: Create and run migration

**Files:**

- Create: `packages/database/prisma/migrations/<timestamp>_tenant_multi_tenant/migration.sql`

- [ ] **Step 1: Generate migration**

Run: `pnpm --filter database prisma migrate dev --name tenant-multi-tenant`
Expected: Prisma generates a migration file. If it fails due to destructive changes, use `--create-only` and write SQL manually.

- [ ] **Step 2: Write/verify raw SQL in migration**

The migration must execute in this order (add raw SQL blocks if Prisma generated them differently):

```sql
-- 1. Create enums
CREATE TYPE "PlanoOrganizacao" AS ENUM ('TRIAL', 'INDIVIDUAL', 'EMPRESA', 'ENTERPRISE');
CREATE TYPE "StatusOrganizacao" AS ENUM ('TRIAL_ATIVO', 'ATIVO', 'SUSPENSO', 'CANCELADO');
CREATE TYPE "RoleMembro" AS ENUM ('OWNER', 'MEMBER');

-- 2. Rename Organization.name to nome
ALTER TABLE "Organization" RENAME COLUMN "name" TO "nome";

-- 3. Expand Organization table
ALTER TABLE "Organization" ADD COLUMN "slug" TEXT;
ALTER TABLE "Organization" ADD COLUMN "plano" "PlanoOrganizacao" NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "Organization" ADD COLUMN "status" "StatusOrganizacao" NOT NULL DEFAULT 'TRIAL_ATIVO';
ALTER TABLE "Organization" ADD COLUMN "trialExpiraEm" TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE "Organization" ADD COLUMN "planoAtivoEm" TIMESTAMP(3);
ALTER TABLE "Organization" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "Organization" ADD COLUMN "stripeSubId" TEXT;
ALTER TABLE "Organization" ADD COLUMN "limiteUsuarios" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_slug_key" UNIQUE ("slug");
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_stripeCustomerId_key" UNIQUE ("stripeCustomerId");
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_stripeSubId_key" UNIQUE ("stripeSubId");
CREATE INDEX "Organization_status_idx" ON "Organization"("status");
CREATE INDEX "Organization_trialExpiraEm_idx" ON "Organization"("trialExpiraEm");

-- 4. Create OrganizationMembro table
CREATE TABLE "OrganizationMembro" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RoleMembro" NOT NULL DEFAULT 'MEMBER',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OrganizationMembro_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OrganizationMembro_organizationId_userId_key" ON "OrganizationMembro"("organizationId", "userId");
CREATE INDEX "OrganizationMembro_userId_idx" ON "OrganizationMembro"("userId");
CREATE INDEX "OrganizationMembro_organizationId_idx" ON "OrganizationMembro"("organizationId");

-- 5. Add nullable organizationId to all 7 tables
ALTER TABLE "Profissional" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Especialidade" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Visita" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "AgendaItem" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Notificacao" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "MaterialTecnico" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "EstagioLog" ADD COLUMN "organizationId" TEXT;

-- 6. Insert default organization
INSERT INTO "Organization" (id, "clerkOrgId", nome, slug, plano, status, "trialExpiraEm", "limiteUsuarios", "createdAt", "updatedAt")
VALUES ('org_default', 'org_default', 'Organização Padrão', 'organizacao-padrao', 'TRIAL', 'TRIAL_ATIVO', now() + interval '7 days', 999, now(), now());

-- 7. Backfill organizationId
UPDATE "Profissional" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "Especialidade" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "Visita" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "AgendaItem" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "Notificacao" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "MaterialTecnico" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "EstagioLog" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;

-- 8. Migrate existing users to OWNER members
INSERT INTO "OrganizationMembro" (id, "organizationId", "userId", role, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'org_default', "clerkId", 'OWNER', now(), now()
FROM "User" WHERE "deletedAt" IS NULL;

-- 9. Set NOT NULL
ALTER TABLE "Profissional" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Especialidade" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Visita" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "AgendaItem" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Notificacao" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "MaterialTecnico" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "EstagioLog" ALTER COLUMN "organizationId" SET NOT NULL;

-- 10. Add FK constraints
ALTER TABLE "Profissional" ADD CONSTRAINT "Profissional_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;
ALTER TABLE "Especialidade" ADD CONSTRAINT "Especialidade_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;
ALTER TABLE "MaterialTecnico" ADD CONSTRAINT "MaterialTecnico_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;
ALTER TABLE "EstagioLog" ADD CONSTRAINT "EstagioLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;
ALTER TABLE "OrganizationMembro" ADD CONSTRAINT "OrganizationMembro_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT;

-- 11. Create indexes
CREATE INDEX "Profissional_organizationId_idx" ON "Profissional"("organizationId");
CREATE INDEX "Especialidade_organizationId_idx" ON "Especialidade"("organizationId");
CREATE INDEX "Visita_organizationId_idx" ON "Visita"("organizationId");
CREATE INDEX "AgendaItem_organizationId_idx" ON "AgendaItem"("organizationId");
CREATE INDEX "Notificacao_organizationId_idx" ON "Notificacao"("organizationId");
CREATE INDEX "MaterialTecnico_organizationId_idx" ON "MaterialTecnico"("organizationId");
CREATE INDEX "EstagioLog_organizationId_idx" ON "EstagioLog"("organizationId");
```

- [ ] **Step 3: Run migration**

Run: `pnpm --filter database prisma migrate dev --name tenant-multi-tenant`
Expected: Migration applied successfully

- [ ] **Step 4: Regenerate Prisma client**

Run: `pnpm --filter database prisma generate`
Expected: Client generated with new types

- [ ] **Step 5: Verify in Prisma Studio**

Run: `pnpm --filter database prisma studio`
Check: Organization has default org, all tables have organizationId, OrganizationMembro has existing users as OWNER

- [ ] **Step 6: Commit**

```bash
git add packages/database/prisma/schema.prisma packages/database/prisma/migrations/
git commit -m "feat(db): multi-tenant schema — Organization expanded, OrganizationMembro, organizationId on 7 tables"
```

---

## Chunk 2: API Infrastructure

### Task 3: Create resolveTenant hook (TDD)

**Files:**

- Create: `apps/api/src/hooks/tenant.ts`
- Create: `apps/api/src/hooks/tenant.test.ts`

- [ ] **Step 0: Verify verifyClerkToken extracts orgId**

Read `apps/api/src/hooks/auth.ts` and confirm it sets `request.orgId = payload.org_id ?? undefined`. This already exists in the codebase — if missing, add it before proceeding.

- [ ] **Step 1: Write failing tests for resolveTenant**

```typescript
// apps/api/src/hooks/tenant.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { resolveTenant } from "./tenant.js";

// Mock prisma
vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    organization: { findUnique: vi.fn(), update: vi.fn() },
    organizationMembro: { findFirst: vi.fn() },
  },
}));

describe("resolveTenant", () => {
  let request: any;
  let reply: any;

  beforeEach(() => {
    request = {
      userId: "user_123",
      orgId: undefined,
      log: { error: vi.fn() },
    };
    reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      sent: false,
    };
    vi.clearAllMocks();
  });

  it("returns 401 when userId is missing", async () => {
    request.userId = undefined;
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(401);
  });

  it("returns 403 when no membership found", async () => {
    const { prisma } = await import("../../lib/prisma.js");
    vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue(null);
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.sent).toBe(true);
  });

  it("returns 402 TRIAL_EXPIRED when trial expired", async () => {
    const { prisma } = await import("../../lib/prisma.js");
    const pastDate = new Date(Date.now() - 86400000); // yesterday
    vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "OWNER",
      organization: {
        id: "org1",
        status: "TRIAL_ATIVO",
        trialExpiraEm: pastDate,
      },
    } as any);
    vi.mocked(prisma.organization.update).mockResolvedValue({} as any);
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(402);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ code: "TRIAL_EXPIRED" }),
    );
  });

  it("returns 402 ACCOUNT_SUSPENDED when suspended", async () => {
    const { prisma } = await import("../../lib/prisma.js");
    vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "OWNER",
      organization: {
        id: "org1",
        status: "SUSPENSO",
        trialExpiraEm: new Date(),
      },
    } as any);
    await resolveTenant(request, reply);
    expect(reply.status).toHaveBeenCalledWith(402);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ code: "ACCOUNT_SUSPENDED" }),
    );
  });

  it("sets organizationId and role when active", async () => {
    const { prisma } = await import("../../lib/prisma.js");
    vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "MEMBER",
      organization: {
        id: "org1",
        status: "ATIVO",
        trialExpiraEm: new Date(Date.now() + 86400000),
      },
    } as any);
    await resolveTenant(request, reply);
    expect(request.organizationId).toBe("org1");
    expect(request.role).toBe("MEMBER");
    expect(reply.sent).toBe(false);
  });

  it("uses orgId from Clerk JWT to match organization", async () => {
    const { prisma } = await import("../../lib/prisma.js");
    request.orgId = "clerk_org_123";
    vi.mocked(prisma.organization.findUnique).mockResolvedValue({
      id: "org1",
      clerkOrgId: "clerk_org_123",
    } as any);
    vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue({
      id: "m1",
      organizationId: "org1",
      userId: "user_123",
      role: "OWNER",
      organization: {
        id: "org1",
        status: "ATIVO",
        trialExpiraEm: new Date(Date.now() + 86400000),
      },
    } as any);
    await resolveTenant(request, reply);
    expect(prisma.organization.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { clerkOrgId: "clerk_org_123" } }),
    );
    expect(request.organizationId).toBe("org1");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter api test -- --run apps/api/src/hooks/tenant.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement resolveTenant hook**

```typescript
// apps/api/src/hooks/tenant.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";

declare module "fastify" {
  interface FastifyRequest {
    organizationId?: string;
    role?: "OWNER" | "MEMBER";
  }
}

export async function resolveTenant(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.userId;
  if (!userId) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  let organizationId: string | undefined;

  // If Clerk JWT has org_id, find org by clerkOrgId
  if (request.orgId) {
    const org = await prisma.organization.findUnique({
      where: { clerkOrgId: request.orgId, deletedAt: null },
    });
    if (org) {
      organizationId = org.id;
    }
  }

  // Find membership
  const membro = await prisma.organizationMembro.findFirst({
    where: {
      userId,
      deletedAt: null,
      ...(organizationId ? { organizationId } : {}),
    },
    include: { organization: true },
    orderBy: { createdAt: "desc" },
  });

  if (!membro) {
    reply.status(403).send({
      error: "Organização não encontrada. Complete o onboarding.",
    });
    return;
  }

  const org = membro.organization;

  // Check trial expiration
  if (org.status === "TRIAL_ATIVO" && org.trialExpiraEm < new Date()) {
    await prisma.organization.update({
      where: { id: org.id },
      data: { status: "SUSPENSO" },
    });
    reply.status(402).send({
      error: "Trial expirado. Assine um plano para continuar.",
      code: "TRIAL_EXPIRED",
    });
    return;
  }

  // Check suspended/cancelled
  if (org.status === "SUSPENSO" || org.status === "CANCELADO") {
    reply.status(402).send({
      error: "Conta suspensa. Verifique o pagamento.",
      code: "ACCOUNT_SUSPENDED",
    });
    return;
  }

  request.organizationId = org.id;
  request.role = membro.role as "OWNER" | "MEMBER";
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter api test -- --run apps/api/src/hooks/tenant.test.ts`
Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/hooks/tenant.ts apps/api/src/hooks/tenant.test.ts
git commit -m "feat(api): resolveTenant hook with TDD — 402 for expired/suspended, org resolution"
```

### Task 4: Create buildTenantWhere helper

**Files:**

- Create: `apps/api/src/lib/tenant.ts`

- [ ] **Step 1: Create helper**

```typescript
// apps/api/src/lib/tenant.ts
import type { FastifyRequest } from "fastify";

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

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/lib/tenant.ts
git commit -m "feat(api): buildTenantWhere helper for tenant-aware queries"
```

---

## Chunk 3: Update Existing Routes

### Task 5: Update profissionais route (Pattern A)

**Files:**

- Modify: `apps/api/src/routes/profissionais/index.ts`

- [ ] **Step 1: Add imports**

Add import for `resolveTenant` and `buildTenantWhere`:

```typescript
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere } from "../../lib/tenant.js";
```

- [ ] **Step 2: Update preHandler on all routes**

Change every `{ preHandler: [verifyClerkToken] }` to `{ preHandler: [verifyClerkToken, resolveTenant] }`.

There are 7 occurrences in this file (POST, GET, GET /:id, PUT /:id, PATCH /:id/ativo, DELETE /:id, PATCH /:id/estagio).

- [ ] **Step 3: Update GET /profissionais query**

Replace `const where: Record<string, unknown> = { deletedAt: null }` with `const where = buildTenantWhere(request)`.

Remove the manual `deletedAt: null` from the where clause since `buildTenantWhere` adds it.

- [ ] **Step 4: Update POST /profissionais to include organizationId**

In the `prisma.profissional.create` call, add `organizationId: request.organizationId` to the data.

- [ ] **Step 5: Update GET /:id to include organizationId in where**

Change `where: { id, deletedAt: null }` to `where: { id, ...buildTenantWhere(request) }`.

- [ ] **Step 6: Update PUT /:id existence check**

Change `where: { id, deletedAt: null }` to `where: { id, ...buildTenantWhere(request) }`.

- [ ] **Step 7: Update PATCH /:id/ativo existence check**

Change `where: { id }` to `where: { id, organizationId: request.organizationId }`.

- [ ] **Step 8: Update DELETE /:id existence check**

Change `where: { id, deletedAt: null }` to `where: { id, ...buildTenantWhere(request) }`.

- [ ] **Step 9: Update PATCH /:id/estagio existence check**

Change `where: { id, deletedAt: null }` to `where: { id, ...buildTenantWhere(request) }`.

- [ ] **Step 10: Commit**

```bash
git add apps/api/src/routes/profissionais/index.ts
git commit -m "feat(api): profissionais routes use resolveTenant + buildTenantWhere"
```

### Task 6: Update visitas route (Pattern B, no deletedAt)

**Files:**

- Modify: `apps/api/src/routes/visitas/index.ts`

- [ ] **Step 1: Add imports**

```typescript
import { resolveTenant } from "../../hooks/tenant.js";
import { buildTenantWhere } from "../../lib/tenant.js";
```

- [ ] **Step 2: Update addHook**

Change `app.addHook("preHandler", verifyClerkToken)` to:

```typescript
app.addHook("preHandler", async (request, reply) => {
  await verifyClerkToken(request, reply);
  if (!reply.sent) await resolveTenant(request, reply);
});
```

- [ ] **Step 3: Update POST / — add organizationId to create**

In `prisma.visita.create`, add `organizationId: request.organizationId` to the data.

Remove the manual `userId` check at the top of the handler (resolveTenant handles auth).

- [ ] **Step 4: Update GET / — use buildTenantWhere**

Replace `const where: any = { userId }` with:

```typescript
const where: any = buildTenantWhere(request, { hasDeletedAt: false });
```

Remove the `if (!userId)` check.

- [ ] **Step 5: Update GET /:id — add organizationId**

Replace `where: { id, userId }` with `where: { id, ...buildTenantWhere(request, { hasDeletedAt: false }) }`.

- [ ] **Step 6: Update PUT /:id — same pattern**

Replace `where: { id, userId }` with `where: { id, ...buildTenantWhere(request, { hasDeletedAt: false }) }`.

- [ ] **Step 7: Update PATCH /:id/status — same pattern**

- [ ] **Step 8: Update POST /:id/transcricao — same pattern**

- [ ] **Step 9: Update PATCH /:id/audio — same pattern**

- [ ] **Step 10: Update DELETE /:id — same pattern**

All steps 5-10: replace `{ id, userId }` with `{ id, ...buildTenantWhere(request, { hasDeletedAt: false }) }` for consistent MEMBER/OWNER filtering.

- [ ] **Step 11: Remove redundant userId checks**

Remove `if (!userId) { return reply.status(401)... }` from all handlers — `resolveTenant` already ensures auth.

- [ ] **Step 12: Commit**

```bash
git add apps/api/src/routes/visitas/index.ts
git commit -m "feat(api): visitas routes use resolveTenant + buildTenantWhere"
```

### Task 7: Update agenda route (Pattern B)

**Files:**

- Modify: `apps/api/src/routes/agenda/index.ts`

Same pattern as visitas:

- [ ] **Step 1: Add imports** for resolveTenant, buildTenantWhere
- [ ] **Step 2: Update addHook** to chain verifyClerkToken + resolveTenant
- [ ] **Step 3: Update GET /sugestoes** — add `organizationId` to profissional query
- [ ] **Step 4: Update GET /** — replace `{ userId, deletedAt: null }` with `buildTenantWhere(request)`
- [ ] **Step 5: Update POST /** — add `organizationId` to create data
- [ ] **Step 6: Update GET /:id** — replace `{ id, userId, deletedAt: null }` with `{ id, ...buildTenantWhere(request) }`
- [ ] **Step 7: Update PUT /:id** — same
- [ ] **Step 8: Update DELETE /:id** — same
- [ ] **Step 9: Update PATCH /:id/vincular-visita** — same
- [ ] **Step 10: Remove redundant userId checks**
- [ ] **Step 11: Commit**

### Task 8: Update pipeline route (Pattern B)

**Files:**

- Modify: `apps/api/src/routes/pipeline/index.ts`

- [ ] **Step 1: Add imports**
- [ ] **Step 2: Update addHook**
- [ ] **Step 3: Update all userId-based queries** to use `buildTenantWhere` or `organizationId`
- [ ] **Step 4: Remove redundant userId checks**
- [ ] **Step 5: Commit**

### Task 9: Update dashboard route (Pattern B)

**Files:**

- Modify: `apps/api/src/routes/dashboard/index.ts`

- [ ] **Step 1: Add imports**
- [ ] **Step 2: Update addHook**
- [ ] **Step 3: Update all userId-based queries**
- [ ] **Step 4: Remove redundant userId checks**
- [ ] **Step 5: Commit**

### Task 10: Update notificacoes route (Pattern B)

**Files:**

- Modify: `apps/api/src/routes/notificacoes/index.ts`

- [ ] **Step 1: Add imports**
- [ ] **Step 2: Update addHook**
- [ ] **Step 3: Update all userId-based queries** — Notificacao always filters by userId, so keep userId for MEMBER, add organizationId for all
- [ ] **Step 4: Remove redundant userId checks**
- [ ] **Step 5: Commit**

### Task 11: Update remaining routes (Pattern A/B)

**Files:**

- Modify: `apps/api/src/routes/busca/index.ts` (Pattern B)
- Modify: `apps/api/src/routes/materiais/index.ts` (Pattern B)
- Modify: `apps/api/src/routes/especialidades/index.ts` (Pattern A)
- Modify: `apps/api/src/routes/subespecialidades/index.ts` (Pattern A)
- Modify: `apps/api/src/routes/profissionais/timeline.ts` (Pattern B)
- Modify: `apps/api/src/routes/me.ts` (Pattern A)

For each (note: `timeline.ts` queries `EstagioLog` which has no `deletedAt` — use `buildTenantWhere(request, { hasDeletedAt: false })` for those queries):

- [ ] Add imports for resolveTenant, buildTenantWhere
- [ ] Update hook/preHandler pattern
- [ ] Add organizationId to queries
- [ ] Remove redundant userId checks
- [ ] Commit

### Task 12: Register new routes in app.ts

**Files:**

- Modify: `apps/api/src/app.ts`

- [ ] **Step 1: Add imports**

```typescript
import onboardingRoutes from "./routes/onboarding/index.js";
import organizacaoRoutes from "./routes/organizacao/index.js";
```

- [ ] **Step 2: Register routes**

Add before the `return app` line:

```typescript
await app.register(onboardingRoutes, { prefix: "/onboarding" });
await app.register(organizacaoRoutes, { prefix: "/organizacao" });
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/app.ts
git commit -m "feat(api): register onboarding and organizacao routes"
```

### Task 13: Run all existing tests

- [ ] **Step 1: Run tests**

Run: `pnpm --filter api test`
Expected: All tests pass (some may need updating for new tenant context in mocks)

- [ ] **Step 2: Fix any failing tests**

If tests fail due to missing `organizationId` in test data, add it to the test fixtures.

- [ ] **Step 3: Commit fixes if any**

---

## Chunk 4: Onboarding + Member Management

### Task 14: Implement onboarding routes (TDD)

**Files:**

- Create: `apps/api/src/routes/onboarding/index.test.ts`
- Create: `apps/api/src/routes/onboarding/index.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// apps/api/src/routes/onboarding/index.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import Fastify from "fastify";
import onboardingRoutes from "./index.js";

vi.mock("../../hooks/auth.js", () => ({
  verifyClerkToken: async (req: any) => {
    req.userId = "user_123";
  },
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    organizationMembro: { findFirst: vi.fn(), create: vi.fn() },
    organization: { create: vi.fn(), findUnique: vi.fn() },
  },
}));

describe("Onboarding routes", () => {
  let app: any;

  beforeEach(async () => {
    app = Fastify();
    await app.register(onboardingRoutes);
    vi.clearAllMocks();
  });

  describe("GET /status", () => {
    it("returns concluido=false when no membership", async () => {
      const { prisma } = await import("../../lib/prisma.js");
      vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue(null);
      const res = await app.inject({
        method: "GET",
        url: "/status",
        headers: { authorization: "Bearer test" },
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({ concluido: false });
    });

    it("returns concluido=true with org details when member exists", async () => {
      const { prisma } = await import("../../lib/prisma.js");
      vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue({
        organizationId: "org1",
        role: "OWNER",
        organization: { plano: "TRIAL", status: "TRIAL_ATIVO" },
      } as any);
      const res = await app.inject({
        method: "GET",
        url: "/status",
        headers: { authorization: "Bearer test" },
      });
      expect(res.json()).toEqual(
        expect.objectContaining({ concluido: true, role: "OWNER" }),
      );
    });
  });

  describe("POST /individual", () => {
    it("creates org with limiteUsuarios=1 and OWNER member", async () => {
      const { prisma } = await import("../../lib/prisma.js");
      vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue(null); // no existing
      vi.mocked(prisma.organization.create).mockResolvedValue({
        id: "org_new",
      } as any);
      vi.mocked(prisma.organizationMembro.create).mockResolvedValue({} as any);
      const res = await app.inject({
        method: "POST",
        url: "/individual",
        headers: { authorization: "Bearer test" },
      });
      expect(res.statusCode).toBe(201);
      expect(prisma.organization.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ limiteUsuarios: 1 }),
        }),
      );
    });
  });

  describe("POST /empresa", () => {
    it("creates org with company name and OWNER member", async () => {
      const { prisma } = await import("../../lib/prisma.js");
      vi.mocked(prisma.organizationMembro.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.organization.create).mockResolvedValue({
        id: "org_new",
      } as any);
      vi.mocked(prisma.organizationMembro.create).mockResolvedValue({} as any);
      const res = await app.inject({
        method: "POST",
        url: "/empresa",
        headers: { authorization: "Bearer test" },
        payload: { nomeEmpresa: "Farmácia Teste" },
      });
      expect(res.statusCode).toBe(201);
      expect(prisma.organization.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ nome: "Farmácia Teste" }),
        }),
      );
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter api test -- --run apps/api/src/routes/onboarding/index.test.ts`

- [ ] **Step 3: Implement onboarding routes**

```typescript
// apps/api/src/routes/onboarding/index.ts
import type { FastifyPluginAsync } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { prisma } from "../../lib/prisma.js";
import { z } from "zod";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EmpresaSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
});

const onboardingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", verifyClerkToken);

  // GET /status
  app.get("/status", async (request, reply) => {
    const userId = request.userId;
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });

    const membro = await prisma.organizationMembro.findFirst({
      where: { userId, deletedAt: null },
      include: { organization: true },
    });

    if (!membro) {
      return reply.send({ concluido: false });
    }

    return reply.send({
      concluido: true,
      organizationId: membro.organizationId,
      role: membro.role,
      plano: membro.organization.plano,
      status: membro.organization.status,
    });
  });

  // POST /individual
  app.post("/individual", async (request, reply) => {
    const userId = request.userId;
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });

    // Check if already onboarded
    const existing = await prisma.organizationMembro.findFirst({
      where: { userId, deletedAt: null },
    });
    if (existing) {
      return reply.status(409).send({ error: "Onboarding já concluído" });
    }

    const org = await prisma.organization.create({
      data: {
        clerkOrgId: `org_${userId}`,
        nome: "Minha Conta",
        slug: `conta-${userId.slice(-8)}-${Date.now().toString(36)}`,
        plano: "INDIVIDUAL",
        status: "TRIAL_ATIVO",
        trialExpiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        limiteUsuarios: 1,
      },
    });

    await prisma.organizationMembro.create({
      data: {
        organizationId: org.id,
        userId,
        role: "OWNER",
      },
    });

    return reply.status(201).send(org);
  });

  // POST /empresa
  app.post("/empresa", async (request, reply) => {
    const userId = request.userId;
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });

    const { nomeEmpresa } = EmpresaSchema.parse(request.body);

    const existing = await prisma.organizationMembro.findFirst({
      where: { userId, deletedAt: null },
    });
    if (existing) {
      return reply.status(409).send({ error: "Onboarding já concluído" });
    }

    const slug = slugify(nomeEmpresa);
    const org = await prisma.organization.create({
      data: {
        clerkOrgId: `org_${userId}`,
        nome: nomeEmpresa,
        slug: `${slug}-${userId.slice(-4)}`,
        plano: "EMPRESA",
        status: "TRIAL_ATIVO",
        trialExpiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        limiteUsuarios: 10,
      },
    });

    await prisma.organizationMembro.create({
      data: {
        organizationId: org.id,
        userId,
        role: "OWNER",
      },
    });

    return reply.status(201).send(org);
  });
};

export default onboardingRoutes;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter api test -- --run apps/api/src/routes/onboarding/index.test.ts`

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/routes/onboarding/index.ts apps/api/src/routes/onboarding/index.test.ts
git commit -m "feat(api): onboarding routes — individual, empresa, status (TDD)"
```

### Task 15: Implement member management routes

**Files:**

- Create: `apps/api/src/routes/organizacao/index.ts`

- [ ] **Step 1: Implement routes**

```typescript
// apps/api/src/routes/organizacao/index.ts
import type { FastifyPluginAsync } from "fastify";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { z } from "zod";

const ConvidarSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER"]).default("MEMBER"),
});

const AlterarRoleSchema = z.object({
  role: z.enum(["OWNER", "MEMBER"]),
});

const organizacaoRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });

  // Helper: require OWNER role
  function requireOwner(request: any, reply: any) {
    if (request.role !== "OWNER") {
      reply
        .status(403)
        .send({ error: "Apenas gestores podem realizar esta ação" });
      return false;
    }
    return true;
  }

  // GET /membros
  app.get("/membros", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const membros = await prisma.organizationMembro.findMany({
      where: {
        organizationId: request.organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: "asc" },
    });

    return reply.send({ data: membros });
  });

  // POST /membros/convidar
  app.post("/membros/convidar", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const { email, role } = ConvidarSchema.parse(request.body);

    // Check limit
    const org = await prisma.organization.findUnique({
      where: { id: request.organizationId },
    });
    const memberCount = await prisma.organizationMembro.count({
      where: { organizationId: request.organizationId, deletedAt: null },
    });
    if (org && memberCount >= org.limiteUsuarios) {
      return reply.status(400).send({ error: "Limite de usuários atingido" });
    }

    // Find user by email (from Clerk or User table)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(404).send({
        error: "Usuário não encontrado. O convite deve ser feito pelo Clerk.",
      });
    }

    // Check if already a member
    const existing = await prisma.organizationMembro.findFirst({
      where: {
        organizationId: request.organizationId,
        userId: user.clerkId,
        deletedAt: null,
      },
    });
    if (existing) {
      return reply
        .status(409)
        .send({ error: "Usuário já é membro desta organização" });
    }

    const membro = await prisma.organizationMembro.create({
      data: {
        organizationId: request.organizationId,
        userId: user.clerkId,
        role,
      },
    });

    return reply.status(201).send(membro);
  });

  // DELETE /membros/:userId
  app.delete("/membros/:userId", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const { userId: targetUserId } = request.params as { userId: string };

    // Cannot remove self
    if (targetUserId === request.userId) {
      return reply
        .status(400)
        .send({ error: "Você não pode remover a si mesmo" });
    }

    const membro = await prisma.organizationMembro.findFirst({
      where: {
        organizationId: request.organizationId,
        userId: targetUserId,
        deletedAt: null,
      },
    });

    if (!membro) {
      return reply.status(404).send({ error: "Membro não encontrado" });
    }

    await prisma.organizationMembro.update({
      where: { id: membro.id },
      data: { deletedAt: new Date() },
    });

    return reply.status(204).send();
  });

  // PATCH /membros/:userId/role
  app.patch("/membros/:userId/role", async (request, reply) => {
    if (!requireOwner(request, reply)) return;

    const { userId: targetUserId } = request.params as { userId: string };
    const { role } = AlterarRoleSchema.parse(request.body);

    const membro = await prisma.organizationMembro.findFirst({
      where: {
        organizationId: request.organizationId,
        userId: targetUserId,
        deletedAt: null,
      },
    });

    if (!membro) {
      return reply.status(404).send({ error: "Membro não encontrado" });
    }

    const updated = await prisma.organizationMembro.update({
      where: { id: membro.id },
      data: { role },
    });

    return reply.send(updated);
  });
};

export default organizacaoRoutes;
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/routes/organizacao/index.ts
git commit -m "feat(api): member management routes — list, invite, remove, change role (OWNER only)"
```

---

## Chunk 5: Frontend

### Task 16: Update layout server

**Files:**

- Modify: `apps/web/src/routes/+layout.server.ts`

- [ ] **Step 1: Update layout**

```typescript
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { PUBLIC_API_URL } from "$env/static/public";

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
  // Public routes — no redirect
  const publicRoutes = ["/login", "/signup", "/onboarding", "/planos"];
  if (publicRoutes.some((r) => url.pathname.startsWith(r))) {
    return {};
  }

  if (!locals.userId) {
    throw redirect(302, "/login");
  }

  // Check onboarding status
  try {
    const res = await fetch(`${PUBLIC_API_URL}/onboarding/status`, {
      headers: { Authorization: `Bearer ${locals.sessionToken}` },
    });

    if (res.ok) {
      const data = await res.json();

      if (!data.concluido) {
        throw redirect(302, "/onboarding");
      }

      if (data.status === "SUSPENSO") {
        throw redirect(302, "/planos?motivo=trial_expirado");
      }

      return {
        userId: locals.userId,
        sessionToken: locals.sessionToken,
        userName: locals.userName ?? "Usuário",
        role: data.role,
        plano: data.plano,
        organizationId: data.organizationId,
      };
    }
  } catch (e) {
    // If redirect, re-throw
    if (e && typeof e === "object" && "status" in e) throw e;
    // API error — let user through but log
    console.error("Failed to check onboarding status:", e);
  }

  return {
    userId: locals.userId,
    sessionToken: locals.sessionToken,
    userName: locals.userName ?? "Usuário",
  };
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/routes/+layout.server.ts
git commit -m "feat(web): layout checks onboarding status, redirects to /onboarding or /planos"
```

### Task 17: Create onboarding page

**Files:**

- Create: `apps/web/src/routes/onboarding/+page.svelte`

- [ ] **Step 1: Create onboarding wizard**

```svelte
<script lang="ts">
  import { goto } from '$app/navigation'
  import { PUBLIC_API_URL } from '$env/static/public'
  import { page } from '$app/state'

  let step = $state(1)
  let selectedType = $state<'individual' | 'empresa' | null>(null)
  let nomeEmpresa = $state('')
  let loading = $state(false)
  let error = $state('')

  const sessionToken = $derived(page.data.sessionToken)

  function selectType(type: 'individual' | 'empresa') {
    selectedType = type
    if (type === 'individual') {
      step = 2
    } else {
      step = 2
    }
  }

  async function submit() {
    loading = true
    error = ''

    try {
      const endpoint = selectedType === 'individual'
        ? `${PUBLIC_API_URL}/onboarding/individual`
        : `${PUBLIC_API_URL}/onboarding/empresa`

      const body = selectedType === 'empresa'
        ? JSON.stringify({ nomeEmpresa })
        : undefined

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar organização')
      }

      goto('/dashboard')
    } catch (e) {
      error = e instanceof Error ? e.message : 'Erro desconhecido'
    } finally {
      loading = false
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-[rgb(var(--slate-50))]">
  <div class="w-full max-w-md p-8">
    {#if step === 1}
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
          Bem-vindo ao MediVisitas
        </h1>
        <p class="mt-2 text-[rgb(var(--slate-500))]">
          Como você usará o sistema?
        </p>
      </div>

      <div class="space-y-3">
        <button
          onclick={() => selectType('individual')}
          class="w-full p-4 rounded-lg border-2 border-[rgb(var(--slate-200))] hover:border-[rgb(var(--blue-500))] hover:bg-[rgb(var(--blue-50))] transition-all text-left cursor-pointer"
        >
          <p class="font-medium text-[rgb(var(--slate-900))]">
            Sou propagandista individual
          </p>
          <p class="text-sm text-[rgb(var(--slate-500))] mt-1">
            Usuário único, gerencio meus próprios profissionais e visitas
          </p>
        </button>

        <button
          onclick={() => selectType('empresa')}
          class="w-full p-4 rounded-lg border-2 border-[rgb(var(--slate-200))] hover:border-[rgb(var(--blue-500))] hover:bg-[rgb(var(--blue-50))] transition-all text-left cursor-pointer"
        >
          <p class="font-medium text-[rgb(var(--slate-900))]">
            Represento uma empresa
          </p>
          <p class="text-sm text-[rgb(var(--slate-500))] mt-1">
            Gestor com múltiplos propagandistas na equipe
          </p>
        </button>
      </div>
    {/if}

    {#if step === 2 && selectedType === 'individual'}
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
          Configuração Individual
        </h1>
        <p class="mt-2 text-[rgb(var(--slate-500))]">
          Sua conta será configurada para uso pessoal.
        </p>
      </div>

      <div class="bg-white rounded-lg border border-[rgb(var(--slate-200))] p-6 mb-6">
        <p class="text-sm text-[rgb(var(--slate-600))]">
          Você terá 7 dias de trial gratuito para explorar todas as funcionalidades.
        </p>
      </div>

      <button
        onclick={submit}
        disabled={loading}
        class="w-full py-2.5 px-4 rounded-lg bg-[rgb(var(--blue-600))] text-white font-medium hover:bg-[rgb(var(--blue-700))] disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? 'Criando...' : 'Começar agora'}
      </button>
    {/if}

    {#if step === 2 && selectedType === 'empresa'}
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
          Nome da Empresa
        </h1>
        <p class="mt-2 text-[rgb(var(--slate-500))]">
          Identifique sua representação comercial
        </p>
      </div>

      <div class="space-y-4">
        <input
          type="text"
          bind:value={nomeEmpresa}
          placeholder="Ex: Farmácia Silva"
          class="w-full px-3 py-2 rounded-lg border border-[rgb(var(--slate-300))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onclick={submit}
          disabled={loading || nomeEmpresa.trim().length === 0}
          class="w-full py-2.5 px-4 rounded-lg bg-[rgb(var(--blue-600))] text-white font-medium hover:bg-[rgb(var(--blue-700))] disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Criando...' : 'Criar organização'}
        </button>
      </div>
    {/if}

    {#if error}
      <p class="mt-4 text-sm text-[rgb(var(--red-600))] text-center">{error}</p>
    {/if}
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/routes/onboarding/+page.svelte
git commit -m "feat(web): onboarding page — individual/empresa selection wizard"
```

### Task 18: Create planos page

**Files:**

- Create: `apps/web/src/routes/planos/+page.svelte`

- [ ] **Step 1: Create placeholder page**

```svelte
<script lang="ts">
  import { page } from '$app/state'

  const motivo = $derived(page.url.searchParams.get('motivo'))
</script>

<div class="min-h-screen flex items-center justify-center bg-[rgb(var(--slate-50))]">
  <div class="w-full max-w-md p-8 text-center">
    <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
      {motivo === 'trial_expirado' ? 'Seu trial expirou' : 'Conta suspensa'}
    </h1>
    <p class="mt-3 text-[rgb(var(--slate-500))]">
      {#if motivo === 'trial_expirado'}
        Seu período de teste gratuito de 7 dias chegou ao fim. Assine um plano para continuar usando o MediVisitas.
      {:else}
        Sua conta está suspensa. Verifique o pagamento para reativar o acesso.
      {/if}
    </p>

    <div class="mt-8 p-6 bg-white rounded-lg border border-[rgb(var(--slate-200))]">
      <p class="text-sm text-[rgb(var(--slate-400))]">
        Planos em breve. Entre em contato com o suporte para mais informações.
      </p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/routes/planos/+page.svelte
git commit -m "feat(web): planos placeholder page for trial expired / suspended"
```

### Task 19: Add trial badge to Sidebar

**Files:**

- Modify: `apps/web/src/lib/components/Sidebar.svelte`

- [ ] **Step 1: Add props**

Add `plano` and `trialExpiraEm` to the Props interface:

```typescript
interface Props {
  userName: string;
  sessionToken: string | null;
  plano?: string;
  trialExpiraEm?: string;
}

let { userName, sessionToken, plano, trialExpiraEm }: Props = $props();
```

- [ ] **Step 2: Add days remaining calculation**

```typescript
let diasRestantes = $derived.by(() => {
  if (plano !== "TRIAL" || !trialExpiraEm) return null;
  const expira = new Date(trialExpiraEm);
  const hoje = new Date();
  const diff = Math.ceil(
    (expira.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, diff);
});
```

- [ ] **Step 3: Add badge before user footer**

Add before the `<!-- User footer -->` section:

```svelte
{#if plano}
  <div class="px-3 py-2 mb-1">
    <span
      class="text-xs px-2 py-0.5 rounded-full font-medium"
      class={plano === 'TRIAL'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-emerald-100 text-emerald-800'}
    >
      {plano === 'TRIAL' && diasRestantes !== null
        ? `Trial — ${diasRestantes}d restantes`
        : plano}
    </span>
  </div>
{/if}
```

- [ ] **Step 4: Update Sidebar usage in layout**

Find where `<Sidebar>` is used (likely in a dashboard layout) and pass the new props.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/components/Sidebar.svelte
git commit -m "feat(web): Sidebar shows trial badge with days remaining"
```

---

## Chunk 6: Verification

### Task 20: Run full verification

- [ ] **Step 1: Run API tests**

Run: `pnpm --filter api test`
Expected: All tests pass

- [ ] **Step 2: Build API**

Run: `pnpm --filter api build`
Expected: No errors

- [ ] **Step 3: Build frontend**

Run: `pnpm --filter @medivisitas/web build`
Expected: No errors

- [ ] **Step 4: Verify migration data**

Run: `pnpm --filter database prisma studio`
Check: Default org exists, all tables have organizationId, existing users are OWNER members

- [ ] **Step 5: Update CLAUDE.md**

Change the Fase 10A row from `⬜ Pendente` to `✅ Concluída`.

- [ ] **Step 6: Final commit**

```bash
git add CLAUDE.md
git commit -m "docs: mark Phase 10A (Multi-tenant SaaS) as complete"
```
