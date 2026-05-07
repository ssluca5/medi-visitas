-- CreateEnum
CREATE TYPE "PlanoMeta" AS ENUM ('PROFISSIONAL', 'EQUIPE');

-- CreateEnum
CREATE TYPE "StatusMeta" AS ENUM ('ATIVA', 'ATINGIDA', 'EXPIRADA');

-- CreateTable
CREATE TABLE "Meta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "metaVisitas" INTEGER NOT NULL DEFAULT 0,
    "metaAvancosPipeline" INTEGER NOT NULL DEFAULT 0,
    "metaPrescritores" INTEGER NOT NULL DEFAULT 0,
    "responsavelId" TEXT NOT NULL,
    "criadaPorId" TEXT NOT NULL,
    "plano" "PlanoMeta" NOT NULL,
    "status" "StatusMeta" NOT NULL DEFAULT 'ATIVA',
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Meta_responsavelId_idx" ON "Meta"("responsavelId");

-- CreateIndex
CREATE INDEX "Meta_criadaPorId_idx" ON "Meta"("criadaPorId");

-- CreateIndex
CREATE INDEX "Meta_status_idx" ON "Meta"("status");

-- CreateIndex
CREATE INDEX "Meta_dataInicio_dataFim_idx" ON "Meta"("dataInicio", "dataFim");

-- CreateIndex
CREATE INDEX "Meta_deletedAt_idx" ON "Meta"("deletedAt");

-- CreateIndex
CREATE INDEX "Meta_organizationId_idx" ON "Meta"("organizationId");

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
