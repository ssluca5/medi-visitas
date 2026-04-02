/*
  Warnings:

  - A unique constraint covering the columns `[nome,especialidadeId]` on the table `SubEspecialidade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "Tratamento" AS ENUM ('DR', 'DRA', 'PROF', 'PROFA', 'SR', 'SRA');

-- DropForeignKey
ALTER TABLE "ContatoProfissional" DROP CONSTRAINT "ContatoProfissional_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "EstagioLog" DROP CONSTRAINT "EstagioLog_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "Profissional" DROP CONSTRAINT "Profissional_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "Profissional" DROP CONSTRAINT "Profissional_especialidadeId_fkey";

-- AlterTable
ALTER TABLE "ContatoProfissional" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Endereco" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Especialidade" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EstagioLog" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Profissional" ADD COLUMN     "cpfCnpj" TEXT,
ADD COLUMN     "dataNascConjuge" TIMESTAMP(3),
ADD COLUMN     "dataNascimento" TIMESTAMP(3),
ADD COLUMN     "nomeConjuge" TEXT,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "sexo" "Sexo",
ADD COLUMN     "tratamento" "Tratamento",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SubEspecialidade" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "nome" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "SubEspecialidade_nome_especialidadeId_key" ON "SubEspecialidade"("nome", "especialidadeId");

-- AddForeignKey
ALTER TABLE "Profissional" ADD CONSTRAINT "Profissional_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profissional" ADD CONSTRAINT "Profissional_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContatoProfissional" ADD CONSTRAINT "ContatoProfissional_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstagioLog" ADD CONSTRAINT "EstagioLog_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
