import type { FastifyPluginAsync } from "fastify";
type AlertaTipo =
  | "SEM_VISITA_30_DIAS"
  | "SEM_VISITA_60_DIAS"
  | "VISITA_ATRASADA"
  | "AGENDAMENTO_HOJE"
  | "PROSPECTADO_SEM_VISITA";
type AlertaSeveridade = "info" | "warning" | "danger";
interface Alerta {
  tipo: AlertaTipo;
  severidade: AlertaSeveridade;
  profissionalId: string;
  profissionalNome: string;
  mensagem: string;
  dataReferencia?: string;
}
export declare function buildAlertas(params: {
  profissionaisComVisitas: Array<{
    id: string;
    nome: string;
    estagioPipeline: string;
    visitas: Array<{
      dataVisita: Date;
    }>;
  }>;
  agendaAtrasados: Array<{
    id: string;
    profissionalId: string;
    profissional: {
      nome: string;
    };
    dataHoraInicio: Date;
  }>;
  agendaHoje: Array<{
    id: string;
    profissionalId: string;
    profissional: {
      nome: string;
    };
    dataHoraInicio: Date;
  }>;
  prospectadosSemVisita: Array<{
    id: string;
    nome: string;
  }>;
  agora: Date;
}): Alerta[];
declare const dashboardRoutes: FastifyPluginAsync;
export default dashboardRoutes;
