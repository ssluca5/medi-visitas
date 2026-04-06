import { z } from "zod";

export const BuscaQuerySchema = z.object({
  q: z.string().min(1),
  limite: z.coerce.number().int().positive().max(50).default(10),
});
