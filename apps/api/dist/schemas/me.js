import { z } from "zod";
export const MeResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
});
