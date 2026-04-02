import { z } from "zod";
export declare const MeResponseSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    id: string;
    name: string | null;
}, {
    email: string;
    id: string;
    name: string | null;
}>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
