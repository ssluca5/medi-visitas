-- Sincroniza schema com banco: avatarUrl em User + indexes faltantes.
-- Compara com `prisma migrate diff` em 2026-05-14 (modelos já existem em schema.prisma,
-- apenas o banco estava sem essas estruturas).

-- AlterTable: adiciona coluna avatarUrl
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- CreateIndex (idempotente)
CREATE INDEX IF NOT EXISTS "AgendaItem_organizationId_userId_deletedAt_idx"
  ON "AgendaItem"("organizationId", "userId", "deletedAt");

CREATE INDEX IF NOT EXISTS "Especialidade_organizationId_deletedAt_idx"
  ON "Especialidade"("organizationId", "deletedAt");

CREATE INDEX IF NOT EXISTS "MaterialTecnico_organizationId_deletedAt_idx"
  ON "MaterialTecnico"("organizationId", "deletedAt");

CREATE INDEX IF NOT EXISTS "Notificacao_userId_deletedAt_lida_idx"
  ON "Notificacao"("userId", "deletedAt", "lida");

CREATE INDEX IF NOT EXISTS "Notificacao_organizationId_userId_deletedAt_idx"
  ON "Notificacao"("organizationId", "userId", "deletedAt");

CREATE INDEX IF NOT EXISTS "Profissional_organizationId_deletedAt_idx"
  ON "Profissional"("organizationId", "deletedAt");

CREATE INDEX IF NOT EXISTS "Profissional_organizationId_estagioPipeline_deletedAt_idx"
  ON "Profissional"("organizationId", "estagioPipeline", "deletedAt");
