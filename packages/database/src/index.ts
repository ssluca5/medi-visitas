import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Enums re-exportados para uso no frontend (evita duplicação de string literals)
export {
  StatusVisita,
  TipoMaterial,
  PotencialPrescricao,
  EstagioPipeline,
  ClassificacaoRelacionamento,
  TipoContato,
  Sexo,
  StatusAgenda,
  PrioridadeAgenda,
  Tratamento,
  PlanoOrganizacao,
  StatusOrganizacao,
  RoleMembro,
  PlanoMeta,
  StatusMeta,
  TipoNotificacao,
  PrioridadeNotificacao,
} from "@prisma/client";
