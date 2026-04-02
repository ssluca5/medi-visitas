-- CreateEnum
CREATE TYPE "ClassificacaoRelacionamento" AS ENUM ('FORTE', 'INTERMEDIARIO', 'FRACO');

-- CreateTable
CREATE TABLE "SubEspecialidade" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "nome" VARCHAR(255) NOT NULL,
    "especialidadeId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deletedAt" TIMESTAMPTZ NULL,
    CONSTRAINT "SubEspecialidade_especialidadeId_fkey"
        FOREIGN KEY ("especialidadeId")
        REFERENCES "Especialidade"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SubEspecialidade_nome_especialidadeId_unique"
    ON "SubEspecialidade"("nome", "especialidadeId")
    WHERE "deletedAt" IS NULL;

-- CreateIndex
CREATE INDEX "SubEspecialidade_especialidadeId_deletedAt_idx"
    ON "SubEspecialidade"("especialidadeId", "deletedAt");

-- AddColumn to Profissional
ALTER TABLE "Profissional"
    ADD COLUMN "subEspecialidadeId" TEXT NULL,
    ADD COLUMN "classificacao" "ClassificacaoRelacionamento" NULL;

-- CreateIndex for Profissional
CREATE INDEX "Profissional_classificacao_idx" ON "Profissional"("classificacao");

-- CreateIndex for Profissional subEspecialidadeId
CREATE INDEX "Profissional_subEspecialidadeId_idx" ON "Profissional"("subEspecialidadeId");

-- AddForeignKey for Profissional subEspecialidade
ALTER TABLE "Profissional"
    ADD CONSTRAINT "Profissional_subEspecialidadeId_fkey"
    FOREIGN KEY ("subEspecialidadeId")
    REFERENCES "SubEspecialidade"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
