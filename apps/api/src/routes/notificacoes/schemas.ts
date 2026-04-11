import { z } from "zod";

export const TipoNotificacaoSchema = z.enum([
  "VISITA_HOJE",
  "VISITA_ATRASADA",
  "SEM_VISITA_30_DIAS",
  "SEM_VISITA_60_DIAS",
  "PROSPECTADO_PENDENTE",
  "SISTEMA",
]);

export const ListNotificacoesQuerySchema = z.object({
  lida: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  tipo: TipoNotificacaoSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
});
