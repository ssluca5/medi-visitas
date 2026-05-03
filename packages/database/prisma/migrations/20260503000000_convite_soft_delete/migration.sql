-- AlterTable: Add soft delete to OrganizationConvite
ALTER TABLE "OrganizationConvite" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "OrganizationConvite_deletedAt_idx" ON "OrganizationConvite"("deletedAt");
