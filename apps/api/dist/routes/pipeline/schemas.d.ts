import { z } from "zod";
export declare const EstagioPipelineSchema: z.ZodEnum<
  ["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]
>;
export declare const PotencialPrescricaoSchema: z.ZodEnum<
  ["ALTO", "MEDIO", "BAIXO", "ESTRATEGICO"]
>;
export declare const PipelineQuerySchema: z.ZodObject<
  {
    busca: z.ZodOptional<z.ZodString>;
    potencial: z.ZodOptional<
      z.ZodEnum<["ALTO", "MEDIO", "BAIXO", "ESTRATEGICO"]>
    >;
    especialidadeId: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    potencial?: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO" | undefined;
    especialidadeId?: string | undefined;
    busca?: string | undefined;
  },
  {
    potencial?: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO" | undefined;
    especialidadeId?: string | undefined;
    busca?: string | undefined;
  }
>;
export declare const MetricasQuerySchema: z.ZodObject<
  {
    dataInicio: z.ZodOptional<z.ZodDate>;
    dataFim: z.ZodOptional<z.ZodDate>;
  },
  "strip",
  z.ZodTypeAny,
  {
    dataInicio?: Date | undefined;
    dataFim?: Date | undefined;
  },
  {
    dataInicio?: Date | undefined;
    dataFim?: Date | undefined;
  }
>;
export declare const EvolucaoQuerySchema: z.ZodObject<
  {
    dataInicio: z.ZodDate;
    dataFim: z.ZodDate;
    granularidade: z.ZodDefault<z.ZodEnum<["semana", "mes"]>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    dataInicio: Date;
    dataFim: Date;
    granularidade: "semana" | "mes";
  },
  {
    dataInicio: Date;
    dataFim: Date;
    granularidade?: "semana" | "mes" | undefined;
  }
>;
export declare const VisitasPeriodoQuerySchema: z.ZodObject<
  {
    dataInicio: z.ZodDate;
    dataFim: z.ZodDate;
    granularidade: z.ZodDefault<z.ZodEnum<["semana", "mes"]>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    dataInicio: Date;
    dataFim: Date;
    granularidade: "semana" | "mes";
  },
  {
    dataInicio: Date;
    dataFim: Date;
    granularidade?: "semana" | "mes" | undefined;
  }
>;
