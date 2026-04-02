import { z } from "zod";
export declare const TipoMaterialSchema: z.ZodEnum<["BULA", "FOLDER", "APRESENTACAO", "AMOSTRA", "OUTRO"]>;
export declare const CreateMaterialInputSchema: z.ZodObject<{
    nome: z.ZodString;
    descricao: z.ZodOptional<z.ZodString>;
    tipo: z.ZodEnum<["BULA", "FOLDER", "APRESENTACAO", "AMOSTRA", "OUTRO"]>;
    arquivoUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
    nome: string;
    descricao?: string | undefined;
    arquivoUrl?: string | undefined;
}, {
    tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
    nome: string;
    descricao?: string | undefined;
    arquivoUrl?: string | undefined;
}>;
export declare const UpdateMaterialInputSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    descricao: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tipo: z.ZodOptional<z.ZodEnum<["BULA", "FOLDER", "APRESENTACAO", "AMOSTRA", "OUTRO"]>>;
    arquivoUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    tipo?: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA" | undefined;
    nome?: string | undefined;
    descricao?: string | undefined;
    arquivoUrl?: string | undefined;
}, {
    tipo?: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA" | undefined;
    nome?: string | undefined;
    descricao?: string | undefined;
    arquivoUrl?: string | undefined;
}>;
export declare const MaterialOutputSchema: z.ZodObject<{
    id: z.ZodString;
    nome: z.ZodString;
    descricao: z.ZodNullable<z.ZodString>;
    tipo: z.ZodEnum<["BULA", "FOLDER", "APRESENTACAO", "AMOSTRA", "OUTRO"]>;
    arquivoUrl: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    deletedAt: z.ZodNullable<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
    nome: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    descricao: string | null;
    arquivoUrl: string | null;
}, {
    tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
    nome: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    descricao: string | null;
    arquivoUrl: string | null;
}>;
export declare const ListMateriaisQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    busca: z.ZodOptional<z.ZodString>;
    tipo: z.ZodOptional<z.ZodEnum<["BULA", "FOLDER", "APRESENTACAO", "AMOSTRA", "OUTRO"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    tipo?: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA" | undefined;
    busca?: string | undefined;
}, {
    tipo?: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA" | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    busca?: string | undefined;
}>;
export declare const MateriaisListOutputSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        nome: z.ZodString;
        descricao: z.ZodNullable<z.ZodString>;
        tipo: z.ZodEnum<["BULA", "FOLDER", "APRESENTACAO", "AMOSTRA", "OUTRO"]>;
        arquivoUrl: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        deletedAt: z.ZodNullable<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
        nome: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descricao: string | null;
        arquivoUrl: string | null;
    }, {
        tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
        nome: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descricao: string | null;
        arquivoUrl: string | null;
    }>, "many">;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
        nome: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descricao: string | null;
        arquivoUrl: string | null;
    }[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}, {
    data: {
        tipo: "OUTRO" | "BULA" | "FOLDER" | "APRESENTACAO" | "AMOSTRA";
        nome: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descricao: string | null;
        arquivoUrl: string | null;
    }[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}>;
export type CreateMaterialInput = z.infer<typeof CreateMaterialInputSchema>;
export type UpdateMaterialInput = z.infer<typeof UpdateMaterialInputSchema>;
export type MaterialOutput = z.infer<typeof MaterialOutputSchema>;
export type ListMateriaisQuery = z.infer<typeof ListMateriaisQuerySchema>;
export type MateriaisListOutput = z.infer<typeof MateriaisListOutputSchema>;
