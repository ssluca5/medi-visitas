-- CreateEnum
CREATE TYPE "StatusAgenda" AS ENUM ('PLANEJADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PrioridadeAgenda" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateTable
CREATE TABLE "AgendaItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "visitaId" TEXT,
    "dataHoraInicio" TIMESTAMP(3) NOT NULL,
    "dataHoraFim" TIMESTAMP(3) NOT NULL,
    "status" "StatusAgenda" NOT NULL DEFAULT 'PLANEJADO',
    "prioridade" "PrioridadeAgenda" NOT NULL DEFAULT 'MEDIA',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgendaItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgendaItem_userId_idx" ON "AgendaItem"("userId");

-- CreateIndex
CREATE INDEX "AgendaItem_profissionalId_idx" ON "AgendaItem"("profissionalId");

-- CreateIndex
CREATE INDEX "AgendaItem_dataHoraInicio_idx" ON "AgendaItem"("dataHoraInicio");

-- CreateIndex
CREATE INDEX "AgendaItem_status_idx" ON "AgendaItem"("status");

-- CreateIndex
CREATE INDEX "AgendaItem_deletedAt_idx" ON "AgendaItem"("deletedAt");

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
