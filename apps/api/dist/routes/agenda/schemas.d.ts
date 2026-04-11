import { z } from "zod";
export declare const StatusAgendaSchema: z.ZodEnum<
  ["PLANEJADO", "CONFIRMADO", "REALIZADO", "CANCELADO"]
>;
export declare const PrioridadeAgendaSchema: z.ZodEnum<
  ["BAIXA", "MEDIA", "ALTA", "URGENTE"]
>;
export declare const CreateAgendaItemSchema: z.ZodObject<
  {
    profissionalId: z.ZodString;
    dataHoraInicio: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    dataHoraFim: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    prioridade: z.ZodDefault<z.ZodEnum<["BAIXA", "MEDIA", "ALTA", "URGENTE"]>>;
    observacoes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    profissionalId: string;
    dataHoraInicio: string | Date;
    dataHoraFim: string | Date;
    prioridade: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";
    observacoes?: string | null | undefined;
  },
  {
    profissionalId: string;
    dataHoraInicio: string | Date;
    dataHoraFim: string | Date;
    observacoes?: string | null | undefined;
    prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE" | undefined;
  }
>;
export declare const UpdateAgendaItemSchema: z.ZodObject<
  {
    profissionalId: z.ZodOptional<z.ZodString>;
    dataHoraInicio: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    dataHoraFim: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    prioridade: z.ZodOptional<z.ZodEnum<["BAIXA", "MEDIA", "ALTA", "URGENTE"]>>;
    status: z.ZodOptional<
      z.ZodEnum<["PLANEJADO", "CONFIRMADO", "REALIZADO", "CANCELADO"]>
    >;
    observacoes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    status?: "PLANEJADO" | "CONFIRMADO" | "REALIZADO" | "CANCELADO" | undefined;
    observacoes?: string | null | undefined;
    profissionalId?: string | undefined;
    dataHoraInicio?: string | Date | undefined;
    dataHoraFim?: string | Date | undefined;
    prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE" | undefined;
  },
  {
    status?: "PLANEJADO" | "CONFIRMADO" | "REALIZADO" | "CANCELADO" | undefined;
    observacoes?: string | null | undefined;
    profissionalId?: string | undefined;
    dataHoraInicio?: string | Date | undefined;
    dataHoraFim?: string | Date | undefined;
    prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE" | undefined;
  }
>;
export declare const ListAgendaQuerySchema: z.ZodObject<
  {
    dataInicio: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    dataFim: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    status: z.ZodOptional<
      z.ZodEnum<["PLANEJADO", "CONFIRMADO", "REALIZADO", "CANCELADO"]>
    >;
    profissionalId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    page: number;
    pageSize: number;
    dataInicio: string | Date;
    dataFim: string | Date;
    status?: "PLANEJADO" | "CONFIRMADO" | "REALIZADO" | "CANCELADO" | undefined;
    profissionalId?: string | undefined;
  },
  {
    dataInicio: string | Date;
    dataFim: string | Date;
    status?: "PLANEJADO" | "CONFIRMADO" | "REALIZADO" | "CANCELADO" | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    profissionalId?: string | undefined;
  }
>;
export declare const VincularVisitaSchema: z.ZodObject<
  {
    visitaId: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    visitaId: string;
  },
  {
    visitaId: string;
  }
>;
export declare const SugestoesQuerySchema: z.ZodObject<
  {
    dataInicio: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    dataFim: z.ZodUnion<[z.ZodDate, z.ZodString]>;
  },
  "strip",
  z.ZodTypeAny,
  {
    dataInicio: string | Date;
    dataFim: string | Date;
  },
  {
    dataInicio: string | Date;
    dataFim: string | Date;
  }
>;
