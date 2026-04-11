import { z } from "zod";
export declare const StatusVisitaSchema: z.ZodEnum<
  ["AGENDADA", "REALIZADA", "CANCELADA", "NAO_REALIZADA"]
>;
export declare const VisitaMaterialInputSchema: z.ZodObject<
  {
    materialTecnicoId: z.ZodString;
    quantidade: z.ZodDefault<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    materialTecnicoId: string;
    quantidade: number;
  },
  {
    materialTecnicoId: string;
    quantidade?: number | undefined;
  }
>;
export declare const CreateVisitaInputSchema: z.ZodObject<
  {
    profissionalId: z.ZodString;
    dataVisita: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    duracaoMinutos: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodDefault<
      z.ZodEnum<["AGENDADA", "REALIZADA", "CANCELADA", "NAO_REALIZADA"]>
    >;
    objetivoVisita: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resumo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    proximaAcao: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    motivoCancelamento: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    motivoNaoRealizacao: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    materiais: z.ZodDefault<
      z.ZodArray<
        z.ZodObject<
          {
            materialTecnicoId: z.ZodString;
            quantidade: z.ZodDefault<z.ZodNumber>;
          },
          "strip",
          z.ZodTypeAny,
          {
            materialTecnicoId: string;
            quantidade: number;
          },
          {
            materialTecnicoId: string;
            quantidade?: number | undefined;
          }
        >,
        "many"
      >
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    status: "AGENDADA" | "REALIZADA" | "CANCELADA" | "NAO_REALIZADA";
    profissionalId: string;
    materiais: {
      materialTecnicoId: string;
      quantidade: number;
    }[];
    dataVisita: string | Date;
    duracaoMinutos?: number | null | undefined;
    objetivoVisita?: string | null | undefined;
    resumo?: string | null | undefined;
    proximaAcao?: string | null | undefined;
    motivoCancelamento?: string | null | undefined;
    motivoNaoRealizacao?: string | null | undefined;
  },
  {
    profissionalId: string;
    dataVisita: string | Date;
    status?:
      | "AGENDADA"
      | "REALIZADA"
      | "CANCELADA"
      | "NAO_REALIZADA"
      | undefined;
    materiais?:
      | {
          materialTecnicoId: string;
          quantidade?: number | undefined;
        }[]
      | undefined;
    duracaoMinutos?: number | null | undefined;
    objetivoVisita?: string | null | undefined;
    resumo?: string | null | undefined;
    proximaAcao?: string | null | undefined;
    motivoCancelamento?: string | null | undefined;
    motivoNaoRealizacao?: string | null | undefined;
  }
>;
export declare const UpdateVisitaInputSchema: z.ZodObject<
  {
    status: z.ZodOptional<
      z.ZodDefault<
        z.ZodEnum<["AGENDADA", "REALIZADA", "CANCELADA", "NAO_REALIZADA"]>
      >
    >;
    materiais: z.ZodOptional<
      z.ZodDefault<
        z.ZodArray<
          z.ZodObject<
            {
              materialTecnicoId: z.ZodString;
              quantidade: z.ZodDefault<z.ZodNumber>;
            },
            "strip",
            z.ZodTypeAny,
            {
              materialTecnicoId: string;
              quantidade: number;
            },
            {
              materialTecnicoId: string;
              quantidade?: number | undefined;
            }
          >,
          "many"
        >
      >
    >;
    dataVisita: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    duracaoMinutos: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    objetivoVisita: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    resumo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    proximaAcao: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    motivoCancelamento: z.ZodOptional<
      z.ZodOptional<z.ZodNullable<z.ZodString>>
    >;
    motivoNaoRealizacao: z.ZodOptional<
      z.ZodOptional<z.ZodNullable<z.ZodString>>
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    status?:
      | "AGENDADA"
      | "REALIZADA"
      | "CANCELADA"
      | "NAO_REALIZADA"
      | undefined;
    materiais?:
      | {
          materialTecnicoId: string;
          quantidade: number;
        }[]
      | undefined;
    dataVisita?: string | Date | undefined;
    duracaoMinutos?: number | null | undefined;
    objetivoVisita?: string | null | undefined;
    resumo?: string | null | undefined;
    proximaAcao?: string | null | undefined;
    motivoCancelamento?: string | null | undefined;
    motivoNaoRealizacao?: string | null | undefined;
  },
  {
    status?:
      | "AGENDADA"
      | "REALIZADA"
      | "CANCELADA"
      | "NAO_REALIZADA"
      | undefined;
    materiais?:
      | {
          materialTecnicoId: string;
          quantidade?: number | undefined;
        }[]
      | undefined;
    dataVisita?: string | Date | undefined;
    duracaoMinutos?: number | null | undefined;
    objetivoVisita?: string | null | undefined;
    resumo?: string | null | undefined;
    proximaAcao?: string | null | undefined;
    motivoCancelamento?: string | null | undefined;
    motivoNaoRealizacao?: string | null | undefined;
  }
>;
export declare const PatchVisitaStatusInputSchema: z.ZodObject<
  {
    status: z.ZodEnum<["AGENDADA", "REALIZADA", "CANCELADA", "NAO_REALIZADA"]>;
  },
  "strip",
  z.ZodTypeAny,
  {
    status: "AGENDADA" | "REALIZADA" | "CANCELADA" | "NAO_REALIZADA";
  },
  {
    status: "AGENDADA" | "REALIZADA" | "CANCELADA" | "NAO_REALIZADA";
  }
>;
export declare const ListVisitasQuerySchema: z.ZodObject<
  {
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    profissionalId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<
      z.ZodEnum<["AGENDADA", "REALIZADA", "CANCELADA", "NAO_REALIZADA"]>
    >;
    dataInicio: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    dataFim: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    q: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    page: number;
    pageSize: number;
    status?:
      | "AGENDADA"
      | "REALIZADA"
      | "CANCELADA"
      | "NAO_REALIZADA"
      | undefined;
    profissionalId?: string | undefined;
    dataInicio?: string | Date | undefined;
    dataFim?: string | Date | undefined;
    q?: string | undefined;
  },
  {
    status?:
      | "AGENDADA"
      | "REALIZADA"
      | "CANCELADA"
      | "NAO_REALIZADA"
      | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    profissionalId?: string | undefined;
    dataInicio?: string | Date | undefined;
    dataFim?: string | Date | undefined;
    q?: string | undefined;
  }
>;
