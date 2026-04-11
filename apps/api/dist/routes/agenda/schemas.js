import { z } from "zod";
export const StatusAgendaSchema = z.enum([
  "PLANEJADO",
  "CONFIRMADO",
  "REALIZADO",
  "CANCELADO",
]);
export const PrioridadeAgendaSchema = z.enum([
  "BAIXA",
  "MEDIA",
  "ALTA",
  "URGENTE",
]);
export const CreateAgendaItemSchema = z.object({
  profissionalId: z.string().min(1, "profissionalId é obrigatório"),
  dataHoraInicio: z.coerce.date().or(z.string()),
  dataHoraFim: z.coerce.date().or(z.string()),
  prioridade: PrioridadeAgendaSchema.default("MEDIA"),
  observacoes: z.string().max(2000).nullable().optional(),
});
export const UpdateAgendaItemSchema = z.object({
  profissionalId: z.string().min(1).optional(),
  dataHoraInicio: z.coerce.date().or(z.string()).optional(),
  dataHoraFim: z.coerce.date().or(z.string()).optional(),
  prioridade: PrioridadeAgendaSchema.optional(),
  status: StatusAgendaSchema.optional(),
  observacoes: z.string().max(2000).nullable().optional(),
});
export const ListAgendaQuerySchema = z.object({
  dataInicio: z.coerce.date().or(z.string()),
  dataFim: z.coerce.date().or(z.string()),
  status: StatusAgendaSchema.optional(),
  profissionalId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});
export const VincularVisitaSchema = z.object({
  visitaId: z.string().min(1, "visitaId é obrigatório"),
});
export const SugestoesQuerySchema = z.object({
  dataInicio: z.coerce.date().or(z.string()),
  dataFim: z.coerce.date().or(z.string()),
});
