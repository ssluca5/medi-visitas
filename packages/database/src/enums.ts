// Re-export apenas dos enums do Prisma — seguro para frontend
// (não importa PrismaClient, sem dependências Node.js)
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
