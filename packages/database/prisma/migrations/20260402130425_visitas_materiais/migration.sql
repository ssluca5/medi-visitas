-- CreateEnum
CREATE TYPE "StatusVisita" AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA', 'NAO_REALIZADA');

-- CreateEnum
CREATE TYPE "TipoMaterial" AS ENUM ('BULA', 'FOLDER', 'APRESENTACAO', 'AMOSTRA', 'OUTRO');

-- CreateTable
CREATE TABLE "Visita" (
    "id" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dataVisita" TIMESTAMP(3) NOT NULL,
    "duracaoMinutos" INTEGER,
    "status" "StatusVisita" NOT NULL DEFAULT 'AGENDADA',
    "objetivoVisita" TEXT,
    "resumo" TEXT,
    "proximaAcao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialTecnico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoMaterial" NOT NULL,
    "arquivoUrl" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialTecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitaMaterial" (
    "id" TEXT NOT NULL,
    "visitaId" TEXT NOT NULL,
    "materialTecnicoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitaMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visita_profissionalId_idx" ON "Visita"("profissionalId");

-- CreateIndex
CREATE INDEX "Visita_userId_idx" ON "Visita"("userId");

-- CreateIndex
CREATE INDEX "Visita_status_idx" ON "Visita"("status");

-- CreateIndex
CREATE INDEX "Visita_dataVisita_idx" ON "Visita"("dataVisita");

-- CreateIndex
CREATE INDEX "MaterialTecnico_tipo_idx" ON "MaterialTecnico"("tipo");

-- CreateIndex
CREATE INDEX "MaterialTecnico_deletedAt_idx" ON "MaterialTecnico"("deletedAt");

-- CreateIndex
CREATE INDEX "VisitaMaterial_visitaId_idx" ON "VisitaMaterial"("visitaId");

-- CreateIndex
CREATE INDEX "VisitaMaterial_materialTecnicoId_idx" ON "VisitaMaterial"("materialTecnicoId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitaMaterial_visitaId_materialTecnicoId_key" ON "VisitaMaterial"("visitaId", "materialTecnicoId");

-- AddForeignKey
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitaMaterial" ADD CONSTRAINT "VisitaMaterial_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitaMaterial" ADD CONSTRAINT "VisitaMaterial_materialTecnicoId_fkey" FOREIGN KEY ("materialTecnicoId") REFERENCES "MaterialTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
