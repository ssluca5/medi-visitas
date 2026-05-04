import { z } from "zod";
export declare const BuscaQuerySchema: z.ZodObject<
  {
    q: z.ZodString;
    limite: z.ZodDefault<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    q: string;
    limite: number;
  },
  {
    q: string;
    limite?: number | undefined;
  }
>;
