import { z } from "zod";

// ============================================
// ENUMS
// ============================================

export const PotencialPrescricaoSchema = z.enum([
  "BAIXO",
  "MEDIO",
  "ALTO",
  "ESTRATEGICO",
]);
export const EstagioPipelineSchema = z.enum([
  "PROSPECTADO",
  "VISITADO",
  "INTERESSADO",
  "PRESCRITOR",
  "FIDELIZADO",
]);
export const TipoContatoSchema = z.enum([
  "TELEFONE",
  "EMAIL",
  "WHATSAPP",
  "OUTRO",
]);
export const ClassificacaoRelacionamentoSchema = z.enum([
  "FORTE",
  "INTERMEDIARIO",
  "FRACO",
]);
export const SexoSchema = z.enum(["MASCULINO", "FEMININO", "NAO_INFORMADO"]);
export const TratamentoSchema = z.enum([
  "DR",
  "DRA",
  "PROF",
  "PROFA",
  "SR",
  "SRA",
]);

// Default values
export const DEFAULT_POTENCIAL = "MEDIO" as const;
export const DEFAULT_ESTAGIO = "PROSPECTADO" as const;

// ============================================
// INPUT SCHEMAS
// ============================================

export const EnderecoInputSchema = z
  .object({
    logradouro: z.string().max(255).optional(),
    numero: z.string().max(20).optional(),
    complemento: z.string().max(255).optional(),
    bairro: z.string().max(100).optional(),
    cidade: z.string().max(100).optional(),
    estado: z.string().max(2).optional(),
    cep: z
      .string()
      .regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)")
      .optional(),
  })
  .optional();

export const ContatoInputSchema = z.object({
  tipo: TipoContatoSchema,
  valor: z.string().min(1, "Valor do contato é obrigatório").max(255),
  observacao: z.string().max(500).optional(),
});

export const CreateProfissionalInputSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  crm: z.string().max(20).optional(),
  email: z
    .string()
    .email("Email inválido")
    .max(255)
    .optional()
    .or(z.literal("")),
  telefone: z.string().max(20).optional(),
  potencial: PotencialPrescricaoSchema.default("MEDIO"),
  estagioPipeline: EstagioPipelineSchema.default("PROSPECTADO"),
  especialidadeId: z.string().nullable().optional(),
  subEspecialidadeId: z.string().nullable().optional(),
  classificacao: ClassificacaoRelacionamentoSchema.nullable().optional(),
  cpfCnpj: z
    .string()
    .regex(
      /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{11}|\d{14})$/,
      "CPF/CNPJ inválido",
    )
    .optional(),
  sexo: SexoSchema.optional(),
  dataNascimento: z.string().datetime().optional(),
  tratamento: TratamentoSchema.optional(),
  observacoes: z.string().max(5000).optional(),
  nomeConjuge: z.string().max(255).optional(),
  dataNascConjuge: z.string().datetime().optional(),
  endereco: EnderecoInputSchema,
  contatos: z.array(ContatoInputSchema).optional(),
});

export const UpdateProfissionalInputSchema =
  CreateProfissionalInputSchema.partial();

export const ListProfissionaisQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  busca: z.string().optional(),
  potencial: PotencialPrescricaoSchema.optional(),
  estagioPipeline: EstagioPipelineSchema.optional(),
  especialidadeId: z.string().optional(),
  classificacao: ClassificacaoRelacionamentoSchema.optional(),
});

export const UpdateEstagioInputSchema = z.object({
  estagioNovo: EstagioPipelineSchema,
});

// ============================================
// OUTPUT SCHEMAS
// ============================================

export const EnderecoOutputSchema = z.object({
  id: z.string(),
  logradouro: z.string().nullable(),
  numero: z.string().nullable(),
  complemento: z.string().nullable(),
  bairro: z.string().nullable(),
  cidade: z.string().nullable(),
  estado: z.string().nullable(),
  cep: z.string().nullable(),
});

export const EspecialidadeOutputSchema = z.object({
  id: z.string(),
  nome: z.string(),
  categoria: z.string(),
});

export const SubEspecialidadeOutputSchema = z.object({
  id: z.string(),
  nome: z.string(),
});

export const ContatoOutputSchema = z.object({
  id: z.string(),
  tipo: TipoContatoSchema,
  valor: z.string(),
  observacao: z.string().nullable(),
});

export const ProfissionalOutputSchema = z.object({
  id: z.string(),
  nome: z.string(),
  crm: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  potencial: PotencialPrescricaoSchema,
  estagioPipeline: EstagioPipelineSchema,
  especialidadeId: z.string().nullable(),
  enderecoId: z.string().nullable(),
  cpfCnpj: z.string().nullable(),
  sexo: SexoSchema.nullable(),
  dataNascimento: z.date().nullable(),
  tratamento: TratamentoSchema.nullable(),
  observacoes: z.string().nullable(),
  nomeConjuge: z.string().nullable(),
  dataNascConjuge: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  especialidade: EspecialidadeOutputSchema.nullable(),
  subEspecialidade: SubEspecialidadeOutputSchema.nullable(),
  endereco: EnderecoOutputSchema.nullable(),
  contatos: z.array(ContatoOutputSchema),
  classificacao: ClassificacaoRelacionamentoSchema.nullable(),
});

export const PaginationMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const ProfissionaisListOutputSchema = z.object({
  data: z.array(ProfissionalOutputSchema),
  pagination: PaginationMetaSchema,
});

// ============================================
// TYPES (inferred from schemas)
// ============================================

export type CreateProfissionalInput = z.infer<
  typeof CreateProfissionalInputSchema
>;
export type UpdateProfissionalInput = z.infer<
  typeof UpdateProfissionalInputSchema
>;
export type ListProfissionaisQuery = z.infer<
  typeof ListProfissionaisQuerySchema
>;
export type UpdateEstagioInput = z.infer<typeof UpdateEstagioInputSchema>;
export type ClassificacaoRelacionamento = z.infer<
  typeof ClassificacaoRelacionamentoSchema
>;
export type ProfissionalOutput = z.infer<typeof ProfissionalOutputSchema>;
export type ProfissionaisListOutput = z.infer<
  typeof ProfissionaisListOutputSchema
>;
