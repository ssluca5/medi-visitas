import { z } from "zod";
export const EstagioPipelineSchema = z.enum([
  "PROSPECTADO",
  "VISITADO",
  "INTERESSADO",
  "PRESCRITOR",
  "FIDELIZADO",
]);
export const PotencialPrescricaoSchema = z.enum([
  "ALTO",
  "MEDIO",
  "BAIXO",
  "ESTRATEGICO",
]);
export const PipelineQuerySchema = z.object({
  busca: z.string().optional(),
  potencial: PotencialPrescricaoSchema.optional(),
  especialidadeId: z.string().optional(),
});
export const MetricasQuerySchema = z.object({
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
});
export const EvolucaoQuerySchema = z.object({
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date(),
  granularidade: z.enum(["semana", "mes"]).default("semana"),
});
export const VisitasPeriodoQuerySchema = z.object({
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date(),
  granularidade: z.enum(["semana", "mes"]).default("semana"),
});
