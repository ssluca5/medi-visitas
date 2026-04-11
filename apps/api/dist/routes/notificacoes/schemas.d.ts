import { z } from "zod";
export declare const TipoNotificacaoSchema: z.ZodEnum<
  [
    "VISITA_HOJE",
    "VISITA_ATRASADA",
    "SEM_VISITA_30_DIAS",
    "SEM_VISITA_60_DIAS",
    "PROSPECTADO_PENDENTE",
    "SISTEMA",
  ]
>;
export declare const ListNotificacoesQuerySchema: z.ZodObject<
  {
    lida: z.ZodOptional<
      z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">
    >;
    tipo: z.ZodOptional<
      z.ZodEnum<
        [
          "VISITA_HOJE",
          "VISITA_ATRASADA",
          "SEM_VISITA_30_DIAS",
          "SEM_VISITA_60_DIAS",
          "PROSPECTADO_PENDENTE",
          "SISTEMA",
        ]
      >
    >;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    page: number;
    pageSize: number;
    tipo?:
      | "SEM_VISITA_30_DIAS"
      | "SEM_VISITA_60_DIAS"
      | "VISITA_ATRASADA"
      | "VISITA_HOJE"
      | "PROSPECTADO_PENDENTE"
      | "SISTEMA"
      | undefined;
    lida?: boolean | undefined;
  },
  {
    tipo?:
      | "SEM_VISITA_30_DIAS"
      | "SEM_VISITA_60_DIAS"
      | "VISITA_ATRASADA"
      | "VISITA_HOJE"
      | "PROSPECTADO_PENDENTE"
      | "SISTEMA"
      | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    lida?: "true" | "false" | undefined;
  }
>;
