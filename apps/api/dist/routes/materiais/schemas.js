import { z } from "zod";
export const TipoMaterialSchema = z.enum([
    "BULA",
    "FOLDER",
    "APRESENTACAO",
    "AMOSTRA",
    "OUTRO",
]);
export const CreateMaterialInputSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().optional(),
    tipo: TipoMaterialSchema,
    arquivoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});
export const UpdateMaterialInputSchema = CreateMaterialInputSchema.partial();
export const MaterialOutputSchema = z.object({
    id: z.string(),
    nome: z.string(),
    descricao: z.string().nullable(),
    tipo: TipoMaterialSchema,
    arquivoUrl: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export const ListMateriaisQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
    busca: z.string().optional(),
    tipo: TipoMaterialSchema.optional(),
});
export const MateriaisListOutputSchema = z.object({
    data: z.array(MaterialOutputSchema),
    pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
});
