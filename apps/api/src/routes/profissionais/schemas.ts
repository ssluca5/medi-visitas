import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

export const PotencialPrescricaoSchema = z.enum(['BAIXO', 'MEDIO', 'ALTO', 'ESTRATEGICO']);
export const EstagioPipelineSchema = z.enum(['PROSPECTADO', 'VISITADO', 'INTERESSADO', 'PRESCRITOR', 'FIDELIZADO']);
export const TipoContatoSchema = z.enum(['TELEFONE', 'EMAIL', 'WHATSAPP', 'OUTRO']);

// Default values
export const DEFAULT_POTENCIAL = 'MEDIO' as const;
export const DEFAULT_ESTAGIO = 'PROSPECTADO' as const;

// ============================================
// INPUT SCHEMAS
// ============================================

export const EnderecoInputSchema = z.object({
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
}).optional();

export const ContatoInputSchema = z.object({
  tipo: TipoContatoSchema,
  valor: z.string().min(1, 'Valor do contato é obrigatório'),
  observacao: z.string().optional(),
});

export const CreateProfissionalInputSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  crm: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  potencial: PotencialPrescricaoSchema.default('MEDIO'),
  estagioPipeline: EstagioPipelineSchema.default('PROSPECTADO'),
  especialidadeId: z.string().optional(),
  endereco: EnderecoInputSchema,
  contatos: z.array(ContatoInputSchema).optional(),
});

export const UpdateProfissionalInputSchema = CreateProfissionalInputSchema.partial();

export const ListProfissionaisQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  busca: z.string().optional(),
  potencial: PotencialPrescricaoSchema.optional(),
  estagioPipeline: EstagioPipelineSchema.optional(),
  especialidadeId: z.string().optional(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  especialidade: EspecialidadeOutputSchema.nullable(),
  endereco: EnderecoOutputSchema.nullable(),
  contatos: z.array(ContatoOutputSchema),
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

export type CreateProfissionalInput = z.infer<typeof CreateProfissionalInputSchema>;
export type UpdateProfissionalInput = z.infer<typeof UpdateProfissionalInputSchema>;
export type ListProfissionaisQuery = z.infer<typeof ListProfissionaisQuerySchema>;
export type UpdateEstagioInput = z.infer<typeof UpdateEstagioInputSchema>;
export type ProfissionalOutput = z.infer<typeof ProfissionalOutputSchema>;
export type ProfissionaisListOutput = z.infer<typeof ProfissionaisListOutputSchema>;
