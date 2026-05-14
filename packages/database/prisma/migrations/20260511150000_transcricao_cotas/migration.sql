-- CreateTable
CREATE TABLE "OrganizationTranscricaoCota" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "limite" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationTranscricaoCota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationTranscricaoUso" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "visitaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationTranscricaoUso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationTranscricaoCota_organizationId_userId_key" ON "OrganizationTranscricaoCota"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "OrganizationTranscricaoCota_organizationId_idx" ON "OrganizationTranscricaoCota"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationTranscricaoCota_userId_idx" ON "OrganizationTranscricaoCota"("userId");

-- CreateIndex
CREATE INDEX "OrganizationTranscricaoUso_organizationId_createdAt_idx" ON "OrganizationTranscricaoUso"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "OrganizationTranscricaoUso_organizationId_userId_createdAt_idx" ON "OrganizationTranscricaoUso"("organizationId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "OrganizationTranscricaoUso_userId_idx" ON "OrganizationTranscricaoUso"("userId");

-- AddForeignKey
ALTER TABLE "OrganizationTranscricaoCota" ADD CONSTRAINT "OrganizationTranscricaoCota_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTranscricaoUso" ADD CONSTRAINT "OrganizationTranscricaoUso_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
