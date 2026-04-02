// ──────────────────────────────────────────────
// Tipos compartilhados — MediVisitas Frontend
// ──────────────────────────────────────────────

export type PotencialPrescricao = 'ALTO' | 'MEDIO' | 'BAIXO' | 'ESTRATEGICO';
export type EstagioPipeline = 'PROSPECTADO' | 'VISITADO' | 'INTERESSADO' | 'PRESCRITOR' | 'FIDELIZADO';
export type ClassificacaoRelacionamento = 'FORTE' | 'INTERMEDIARIO' | 'FRACO';
export type ContatoTipo = 'TELEFONE' | 'EMAIL' | 'WHATSAPP' | 'OUTRO';
export type Sexo = 'MASCULINO' | 'FEMININO' | 'NAO_INFORMADO';
export type Tratamento = 'DR' | 'DRA' | 'PROF' | 'PROFA' | 'SR' | 'SRA';

export interface SubEspecialidade {
	id: string;
	nome: string;
	especialidadeId: string;
	deletedAt?: string | null;
}

export interface Especialidade {
	id: string;
	nome: string;
	categoria: string;
	ativo: boolean;
	subEspecialidades?: SubEspecialidade[];
}

export interface EspecialidadeFormData {
	id?: string;
	nome: string;
	categoria: string;
}

export interface SubEspecialidadeFormData {
	id?: string;
	nome: string;
	especialidadeId: string;
}

export interface Contato {
	id?: string;
	tipo: ContatoTipo;
	valor: string;
	observacao: string | null;
}

export interface Endereco {
	id?: string;
	logradouro: string | null;
	numero: string | null;
	complemento: string | null;
	bairro: string | null;
	cidade: string | null;
	estado: string | null;
	cep: string | null;
}

export interface Profissional {
	id: string;
	nome: string;
	crm: string | null;
	email: string | null;
	telefone: string | null;
	potencial: PotencialPrescricao;
	estagioPipeline: EstagioPipeline;
	especialidadeId: string | null;
	cpfCnpj?: string | null;
	sexo?: Sexo | null;
	dataNascimento?: string | null;
	tratamento?: Tratamento | null;
	observacoes?: string | null;
	nomeConjuge?: string | null;
	dataNascConjuge?: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	classificacao: ClassificacaoRelacionamento | null;
	especialidade: { id: string; nome: string; categoria: string } | null;
	subEspecialidade: { id: string; nome: string } | null;
	endereco: Endereco | null;
	contatos: Contato[];
}

export interface ProfissionalFormData {
	id?: string;
	nome: string;
	crm: string;
	email: string;
	telefone: string;
	potencial: PotencialPrescricao;
	estagioPipeline: EstagioPipeline;
	especialidadeId: string;
	subEspecialidadeId: string;
	classificacao: string;
	endereco: {
		logradouro: string;
		numero: string;
		complemento: string;
		bairro: string;
		cidade: string;
		estado: string;
		cep: string;
	};
	contatos: Array<{ tipo: ContatoTipo; valor: string; observacao: string }>;
}

export interface PaginationInfo {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

export interface NavItem {
	href: string;
	label: string;
	icon: any;
}

export type TipoMaterial = 'BULA' | 'FOLDER' | 'APRESENTACAO' | 'AMOSTRA' | 'OUTRO';
export type StatusVisita = 'AGENDADA' | 'REALIZADA' | 'CANCELADA' | 'NAO_REALIZADA';

export interface MaterialTecnico {
	id: string;
	nome: string;
	descricao?: string | null;
	tipo: TipoMaterial;
	arquivoUrl?: string | null;
	deletedAt?: string | null;
}

export interface VisitaMaterial {
	materialTecnicoId: string;
	quantidade: number;
	materialTecnico?: MaterialTecnico;
}

export interface Visita {
	id: string;
	profissionalId: string;
	dataVisita: string;
	duracaoMinutos?: number | null;
	status: StatusVisita;
	objetivoVisita?: string | null;
	resumo?: string | null;
	proximaAcao?: string | null;
	createdAt: string;
	updatedAt: string;
	
	profissional?: {
		nome: string;
		especialidade?: {
			nome: string;
		} | null;
	};
	materiais: VisitaMaterial[];
}
