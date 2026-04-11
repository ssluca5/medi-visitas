import { z } from "zod";

export const StatusVisitaSchema = z.enum([
  "AGENDADA",
  "REALIZADA",
  "CANCELADA",
  "NAO_REALIZADA",
]);

export const VisitaMaterialInputSchema = z.object({
  materialTecnicoId: z.string(),
  quantidade: z.number().int().positive().default(1),
});

export const CreateVisitaInputSchema = z.object({
  profissionalId: z.string(),
  dataVisita: z.coerce.date().or(z.string()),
  duracaoMinutos: z.number().int().nullable().optional(),
  status: StatusVisitaSchema.default("AGENDADA"),
  objetivoVisita: z.string().max(1000).nullable().optional(),
  resumo: z.string().max(5000).nullable().optional(),
  proximaAcao: z.string().max(1000).nullable().optional(),
  motivoCancelamento: z.string().max(2000).nullable().optional(),
  motivoNaoRealizacao: z.string().max(2000).nullable().optional(),
  materiais: z.array(VisitaMaterialInputSchema).default([]),
});

export const UpdateVisitaInputSchema = CreateVisitaInputSchema.omit({
  profissionalId: true,
}).partial();

export const PatchVisitaStatusInputSchema = z.object({
  status: StatusVisitaSchema,
});

export const ListVisitasQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  profissionalId: z.string().optional(),
  status: StatusVisitaSchema.optional(),
  dataInicio: z.coerce.date().or(z.string()).optional(),
  dataFim: z.coerce.date().or(z.string()).optional(),
  q: z.string().optional(),
});
