-- CreateEnum
CREATE TYPE "PotencialPrescricao" AS ENUM ('BAIXO', 'MEDIO', 'ALTO', 'ESTRATEGICO');

-- CreateEnum
CREATE TYPE "EstagioPipeline" AS ENUM ('PROSPECTADO', 'VISITADO', 'INTERESSADO', 'PRESCRITOR', 'FIDELIZADO');

-- CreateEnum
CREATE TYPE "TipoContato" AS ENUM ('TELEFONE', 'EMAIL', 'WHATSAPP', 'OUTRO');

-- CreateTable
CREATE TABLE "Especialidade" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP
);

-- CreateTable
CREATE TABLE "Profissional" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "nome" TEXT NOT NULL,
    "crm" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "potencial" "PotencialPrescricao" NOT NULL DEFAULT 'MEDIO',
    "estagioPipeline" "EstagioPipeline" NOT NULL DEFAULT 'PROSPECTADO',
    "especialidadeId" TEXT,
    "enderecoId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    CONSTRAINT "Profissional_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT,
    CONSTRAINT "Profissional_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT
);

-- CreateTable
CREATE TABLE "ContatoProfissional" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "profissionalId" TEXT NOT NULL,
    "tipo" "TipoContato" NOT NULL,
    "valor" TEXT NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    CONSTRAINT "ContatoProfissional_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT
);

-- CreateTable
CREATE TABLE "EstagioLog" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "profissionalId" TEXT NOT NULL,
    "estagioAnterior" "EstagioPipeline",
    "estagioNovo" "EstagioPipeline" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "EstagioLog_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT
);

-- CreateIndex
CREATE INDEX "Especialidade_categoria_idx" ON "Especialidade"("categoria");

-- CreateIndex
CREATE INDEX "Especialidade_deletedAt_idx" ON "Especialidade"("deletedAt");

-- CreateIndex
CREATE INDEX "Profissional_potencial_idx" ON "Profissional"("potencial");

-- CreateIndex
CREATE INDEX "Profissional_estagioPipeline_idx" ON "Profissional"("estagioPipeline");

-- CreateIndex
CREATE INDEX "Profissional_deletedAt_idx" ON "Profissional"("deletedAt");

-- CreateIndex
CREATE INDEX "Profissional_especialidadeId_idx" ON "Profissional"("especialidadeId");

-- CreateIndex
CREATE INDEX "ContatoProfissional_profissionalId_idx" ON "ContatoProfissional"("profissionalId");

-- CreateIndex
CREATE INDEX "ContatoProfissional_deletedAt_idx" ON "ContatoProfissional"("deletedAt");

-- CreateIndex
CREATE INDEX "EstagioLog_profissionalId_idx" ON "EstagioLog"("profissionalId");

-- CreateIndex
CREATE INDEX "EstagioLog_userId_idx" ON "EstagioLog"("userId");