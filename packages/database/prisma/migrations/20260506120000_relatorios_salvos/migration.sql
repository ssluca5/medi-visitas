-- CreateTable
CREATE TABLE "RelatorioSalvo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelatorioSalvo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RelatorioSalvo_userId_organizationId_idx" ON "RelatorioSalvo"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "RelatorioSalvo_organizationId_idx" ON "RelatorioSalvo"("organizationId");

-- AddForeignKey
ALTER TABLE "RelatorioSalvo" ADD CONSTRAINT "RelatorioSalvo_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
