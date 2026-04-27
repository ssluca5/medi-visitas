-- Fase 10A: Multi-tenant SaaS migration
-- Strategy: Create nullable → backfill → NOT NULL (safe for existing data)

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

-- 6. Insert default organization (migration-only placeholder)
INSERT INTO "Organization" (id, "clerkOrgId", nome, slug, plano, status, "trialExpiraEm", "limiteUsuarios", "createdAt", "updatedAt")
VALUES ('org_default', 'org_default', 'Organização Padrão', 'organizacao-padrao', 'TRIAL', 'TRIAL_ATIVO', now() + interval '7 days', 999, now(), now());

-- 7. Backfill organizationId on all 7 tables
UPDATE "Profissional" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "Especialidade" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "Visita" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "AgendaItem" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "Notificacao" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "MaterialTecnico" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
UPDATE "EstagioLog" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;

-- 8. Migrate existing users to OWNER members of default org
INSERT INTO "OrganizationMembro" (id, "organizationId", "userId", role, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'org_default', "clerkId", 'OWNER', now(), now()
FROM "User" WHERE "deletedAt" IS NULL;

-- 9. Set NOT NULL on all organizationId columns
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

-- 11. Create indexes on organizationId
CREATE INDEX "Profissional_organizationId_idx" ON "Profissional"("organizationId");
CREATE INDEX "Especialidade_organizationId_idx" ON "Especialidade"("organizationId");
CREATE INDEX "Visita_organizationId_idx" ON "Visita"("organizationId");
CREATE INDEX "AgendaItem_organizationId_idx" ON "AgendaItem"("organizationId");
CREATE INDEX "Notificacao_organizationId_idx" ON "Notificacao"("organizationId");
CREATE INDEX "MaterialTecnico_organizationId_idx" ON "MaterialTecnico"("organizationId");
CREATE INDEX "EstagioLog_organizationId_idx" ON "EstagioLog"("organizationId");
