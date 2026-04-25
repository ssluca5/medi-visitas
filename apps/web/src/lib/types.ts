// ──────────────────────────────────────────────
// Tipos compartilhados — MediVisitas Frontend
// ──────────────────────────────────────────────

export type PotencialPrescricao = "ALTO" | "MEDIO" | "BAIXO" | "ESTRATEGICO";
export type EstagioPipeline =
  | "PROSPECTADO"
  | "VISITADO"
  | "INTERESSADO"
  | "PRESCRITOR"
  | "FIDELIZADO";
export type ClassificacaoRelacionamento = "FORTE" | "INTERMEDIARIO" | "FRACO";
export type ContatoTipo = "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
export type Sexo = "MASCULINO" | "FEMININO" | "NAO_INFORMADO";
export type Tratamento = "DR" | "DRA" | "PROF" | "PROFA" | "SR" | "SRA";

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

export type TipoMaterial =
  | "BULA"
  | "FOLDER"
  | "APRESENTACAO"
  | "AMOSTRA"
  | "OUTRO";
export type StatusVisita =
  | "AGENDADA"
  | "REALIZADA"
  | "CANCELADA"
  | "NAO_REALIZADA";
export type StatusAgenda =
  | "PLANEJADO"
  | "CONFIRMADO"
  | "REALIZADO"
  | "CANCELADO";
export type PrioridadeAgenda = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";

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

// ── Dashboard ──

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

// ── Notificações (Fase 8) ──

export type TipoNotificacao =
  | "VISITA_HOJE"
  | "VISITA_ATRASADA"
  | "SEM_VISITA_30_DIAS"
  | "SEM_VISITA_60_DIAS"
  | "PROSPECTADO_PENDENTE"
  | "SISTEMA";

export type PrioridadeNotificacao = "INFO" | "NORMAL" | "ALTA" | "URGENTE";

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
