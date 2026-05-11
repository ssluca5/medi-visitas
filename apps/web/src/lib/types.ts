// ──────────────────────────────────────────────
// Tipos compartilhados — MediVisitas Frontend
// ──────────────────────────────────────────────

// Literais espelhados do Prisma para evitar @prisma/client no frontend.
export const StatusVisita = {
  AGENDADA: "AGENDADA",
  REALIZADA: "REALIZADA",
  CANCELADA: "CANCELADA",
  NAO_REALIZADA: "NAO_REALIZADA",
} as const;

export const TipoMaterial = {
  BULA: "BULA",
  FOLDER: "FOLDER",
  APRESENTACAO: "APRESENTACAO",
  AMOSTRA: "AMOSTRA",
  OUTRO: "OUTRO",
} as const;

export const PotencialPrescricao = {
  BAIXO: "BAIXO",
  MEDIO: "MEDIO",
  ALTO: "ALTO",
  ESTRATEGICO: "ESTRATEGICO",
} as const;

export const EstagioPipeline = {
  PROSPECTADO: "PROSPECTADO",
  VISITADO: "VISITADO",
  INTERESSADO: "INTERESSADO",
  PRESCRITOR: "PRESCRITOR",
  FIDELIZADO: "FIDELIZADO",
} as const;

export const ClassificacaoRelacionamento = {
  FORTE: "FORTE",
  INTERMEDIARIO: "INTERMEDIARIO",
  FRACO: "FRACO",
} as const;

export const Sexo = {
  MASCULINO: "MASCULINO",
  FEMININO: "FEMININO",
  NAO_INFORMADO: "NAO_INFORMADO",
} as const;

export const StatusAgenda = {
  PLANEJADO: "PLANEJADO",
  CONFIRMADO: "CONFIRMADO",
  REALIZADO: "REALIZADO",
  CANCELADO: "CANCELADO",
} as const;

export const PrioridadeAgenda = {
  BAIXA: "BAIXA",
  MEDIA: "MEDIA",
  ALTA: "ALTA",
  URGENTE: "URGENTE",
} as const;

export const Tratamento = {
  DR: "DR",
  DRA: "DRA",
  PROF: "PROF",
  PROFA: "PROFA",
  SR: "SR",
  SRA: "SRA",
} as const;

export const TipoNotificacao = {
  VISITA_HOJE: "VISITA_HOJE",
  VISITA_ATRASADA: "VISITA_ATRASADA",
  SEM_VISITA_30_DIAS: "SEM_VISITA_30_DIAS",
  SEM_VISITA_60_DIAS: "SEM_VISITA_60_DIAS",
  PROSPECTADO_PENDENTE: "PROSPECTADO_PENDENTE",
  SISTEMA: "SISTEMA",
} as const;

export const PrioridadeNotificacao = {
  INFO: "INFO",
  NORMAL: "NORMAL",
  ALTA: "ALTA",
  URGENTE: "URGENTE",
} as const;

export const TipoContato = {
  TELEFONE: "TELEFONE",
  EMAIL: "EMAIL",
  WHATSAPP: "WHATSAPP",
  OUTRO: "OUTRO",
} as const;

export type StatusVisita = (typeof StatusVisita)[keyof typeof StatusVisita];
export type TipoMaterial = (typeof TipoMaterial)[keyof typeof TipoMaterial];
export type PotencialPrescricao =
  (typeof PotencialPrescricao)[keyof typeof PotencialPrescricao];
export type EstagioPipeline =
  (typeof EstagioPipeline)[keyof typeof EstagioPipeline];
export type ClassificacaoRelacionamento =
  (typeof ClassificacaoRelacionamento)[keyof typeof ClassificacaoRelacionamento];
export type Sexo = (typeof Sexo)[keyof typeof Sexo];
export type StatusAgenda = (typeof StatusAgenda)[keyof typeof StatusAgenda];
export type PrioridadeAgenda =
  (typeof PrioridadeAgenda)[keyof typeof PrioridadeAgenda];
export type Tratamento = (typeof Tratamento)[keyof typeof Tratamento];
export type TipoNotificacao =
  (typeof TipoNotificacao)[keyof typeof TipoNotificacao];
export type PrioridadeNotificacao =
  (typeof PrioridadeNotificacao)[keyof typeof PrioridadeNotificacao];
export type TipoContato = (typeof TipoContato)[keyof typeof TipoContato];

// Alias para compatibilidade (frontend usa ContatoTipo, Prisma usa TipoContato)
export type ContatoTipo = TipoContato;
export type PlanoMeta = "PROFISSIONAL" | "EQUIPE";
export type StatusMeta = "ATIVA" | "ATINGIDA" | "EXPIRADA";

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

export interface MetaProgressoItem {
  realizado: number;
  percentual: number;
}

export interface Meta {
  id: string;
  nome: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string;
  metaVisitas: number;
  metaAvancosPipeline: number;
  metaPrescritores: number;
  responsavelId: string;
  criadaPorId: string;
  plano: PlanoMeta;
  status: StatusMeta;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  progresso: {
    visitas: MetaProgressoItem;
    avancosPipeline: MetaProgressoItem;
    prescritores: MetaProgressoItem;
    geral: number;
  };
  alertas: {
    emRisco: boolean;
    prazoCritico: boolean;
  };
}

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
  audioUrl?: string | null;
  motivoCancelamento?: string | null;
  motivoNaoRealizacao?: string | null;
  createdAt: string;
  updatedAt: string;

  profissional?: {
    nome: string;
    estagioPipeline?: EstagioPipeline;
    especialidade?: {
      nome: string;
    } | null;
  };
  materiais: VisitaMaterial[];
}

export interface AgendaItem {
  id: string;
  profissionalId: string;
  visitaId: string | null;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: StatusAgenda;
  prioridade: PrioridadeAgenda;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
  profissional?: {
    id: string;
    nome: string;
    potencial?: PotencialPrescricao;
    estagioPipeline?: EstagioPipeline;
    especialidade?: { nome: string } | null;
  };
}

export interface SugestaoProfissional {
  profissional: {
    id: string;
    nome: string;
    potencial: PotencialPrescricao;
    estagioPipeline: EstagioPipeline;
    especialidadeId: string | null;
    especialidade: { nome: string } | null;
  };
  diasSemVisita: number | null;
  pontuacao: number;
}

// ── Pipeline Analytics ──

export interface PipelineResponse {
  data: Record<EstagioPipeline, Profissional[]>;
  totaisPorEstagio: Record<EstagioPipeline, number>;
  totalGeral: number;
}

export interface MetricasPipeline {
  totalProfissionais: number;
  totalAtivos: number;
  visitasRealizadas: number;
  visitasPlanejadas: number;
  taxaConversaoProspectadoVisitado: number;
  taxaConversaoVisitadoInteressado: number;
  taxaConversaoInteressadoPrescritor: number;
  taxaConversaoPrescritorFidelizado: number;
  profissionaisSemVisitaUltimos30Dias: number;
  mediaVisitasPorSemana: number;
  periodo: { dataInicio: string; dataFim: string };
}

export interface EvolucaoPeriodo {
  periodo: string;
  label: string;
  PROSPECTADO: number;
  VISITADO: number;
  INTERESSADO: number;
  PRESCRITOR: number;
  FIDELIZADO: number;
}

export interface VisitasPeriodo {
  periodo: string;
  label: string;
  AGENDADA: number;
  REALIZADA: number;
  CANCELADA: number;
  NAO_REALIZADA: number;
  total: number;
}

// ── Dashboard (legado) ──

export interface DashboardResumo {
  totalProfissionais: number;
  totalEspecialidades: number;
  visitasHoje: number;
  visitasSemana: number;
  ultimasVisitas: Array<{
    id: string;
    dataVisita: string;
    status: StatusVisita;
    objetivoVisita: string | null;
    resumo: string | null;
    profissional: {
      nome: string;
      especialidade: { nome: string } | null;
    } | null;
  }>;
  proximosAgendamentos: Array<{
    id: string;
    dataHoraInicio: string;
    dataHoraFim: string;
    status: StatusAgenda;
    prioridade: PrioridadeAgenda;
    profissional: {
      nome: string;
      especialidade: { nome: string } | null;
    } | null;
  }>;
}

// ── Dashboard V2 ──

export interface DashboardKpis {
  visitasHoje: number;
  metaDiaria: number;
  visitasSemana: number;
  metaSemanal: number;
  visitasMes: number;
  metaMensal: number;
  medicosSemVisita30d: number;
  taxaConversao: number;
}

export interface DashboardProximaVisita {
  id: string;
  profissionalId: string;
  profissionalNome: string;
  especialidade: string;
  dataHora: string;
  prioridade: string;
  status: string;
}

export interface DashboardUltimaVisita {
  id: string;
  profissionalId: string;
  profissionalNome: string;
  especialidade: string;
  dataHora: string;
  status: string;
  resumo: string | null;
}

export interface DashboardPipeline {
  PROSPECTADO: number;
  VISITADO: number;
  INTERESSADO: number;
  PRESCRITOR: number;
  FIDELIZADO: number;
}

export interface DashboardAlerta {
  tipo: "SEM_VISITA" | "META_EM_RISCO" | "ESTAGIO_PARADO";
  profissionalId: string;
  profissionalNome: string;
  descricao: string;
  urgencia: "alta" | "media";
}

export interface DashboardMedicoSemVisita {
  id: string;
  nome: string;
  especialidade: string;
  diasSemVisita: number;
  estagioPipeline: string;
}

export interface DashboardResumoV2 {
  kpis: DashboardKpis;
  proximasVisitas: DashboardProximaVisita[];
  ultimasVisitas: DashboardUltimaVisita[];
  pipeline: DashboardPipeline;
  alertas: DashboardAlerta[];
  medicosSemVisita: DashboardMedicoSemVisita[];
}

export interface SugestaoBusca {
  id: string;
  nome: string;
  especialidade: string;
}

export type AlertaTipo =
  | "SEM_VISITA_30_DIAS"
  | "SEM_VISITA_60_DIAS"
  | "VISITA_ATRASADA"
  | "AGENDAMENTO_HOJE"
  | "PROSPECTADO_SEM_VISITA";

export type AlertaSeveridade = "info" | "warning" | "danger";

export interface Alerta {
  tipo: AlertaTipo;
  severidade: AlertaSeveridade;
  profissionalId: string;
  profissionalNome: string;
  mensagem: string;
  dataReferencia?: string;
}

export interface BuscaResultado {
  id: string;
  tipo: "PROFISSIONAL";
  nome: string;
  crm: string | null;
  especialidade: string | null;
  cidade: string | null;
}

export type TimelineItemType = "VISITA" | "ESTAGIO" | "AGENDAMENTO";

export interface TimelineItem {
  tipo: TimelineItemType;
  id: string;
  data: string;
  status?: string;
  objetivoVisita?: string | null;
  resumo?: string | null;
  duracaoMinutos?: number | null;
  estagioAnterior?: string | null;
  estagioNovo?: string;
  dataFim?: string;
  prioridade?: string;
  observacoes?: string | null;
}

// ── Visão Geral do Profissional ──

export interface VisaoGeralData {
  resumo: VisaoGeralResumo | null;
  frequencia: VisaoGeralFrequencia | null;
  pipeline: VisaoGeralPipeline | null;
  timeline: TimelineItem[];
  followUps: VisaoGeralFollowUp[];
}

export interface VisaoGeralResumo {
  totalVisitas: number;
  frequenciaMensal: number;
  diasSemVisita: number;
  tendencia: "crescendo" | "estavel" | "caindo";
}

export interface VisaoGeralFrequencia {
  mediaMensal: number;
  maiorIntervalo: number;
  ultimos30d: number;
  ultimos60d: number;
  ultimos90d: number;
}

export interface VisaoGeralPipeline {
  estagioAtual: string;
  dataEntrada: string;
  historico: { estagio: string; dias: number }[];
}

export interface VisaoGeralFollowUp {
  visitaId: string;
  acao: string;
  dataVisitaOrigem: string;
}

// ── Notificações (Fase 8) ──

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  prioridade: PrioridadeNotificacao;
  titulo: string;
  mensagem: string;
  lida: boolean;
  lidaEm: string | null;
  profissionalId: string | null;
  agendaItemId: string | null;
  visitaId: string | null;
  createdAt: string;
}
