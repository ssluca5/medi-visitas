ALTER TYPE "PlanoOrganizacao" RENAME VALUE 'INDIVIDUAL' TO 'BASICO';
ALTER TYPE "PlanoOrganizacao" RENAME VALUE 'EMPRESA' TO 'EQUIPE';
ALTER TYPE "PlanoOrganizacao" RENAME VALUE 'ENTERPRISE' TO 'EMPRESARIAL';
ALTER TYPE "PlanoOrganizacao" ADD VALUE 'PROFISSIONAL';

ALTER TABLE "Organization"
  ADD COLUMN "limiteProfissionais" INTEGER NOT NULL DEFAULT 100,
  ADD COLUMN "transcricoesLimite" INTEGER NOT NULL DEFAULT 7;

UPDATE "Organization"
SET
  "limiteProfissionais" = CASE
    WHEN "plano" IN ('EQUIPE', 'EMPRESARIAL') THEN 999999
    ELSE 100
  END,
  "limiteUsuarios" = CASE
    WHEN "plano" = 'EQUIPE' THEN 10
    WHEN "plano" = 'EMPRESARIAL' THEN 999999
    ELSE 1
  END,
  "transcricoesLimite" = CASE
    WHEN "plano" = 'TRIAL' THEN 7
    WHEN "plano" = 'BASICO' THEN 0
    WHEN "plano" = 'EQUIPE' THEN 200
    WHEN "plano" = 'EMPRESARIAL' THEN 999999
    ELSE 7
  END;
