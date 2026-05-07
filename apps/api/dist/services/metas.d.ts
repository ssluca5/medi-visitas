type ProgressoItem = {
  realizado: number;
  percentual: number;
};
export type MetaRecord = {
  id: string;
  nome: string;
  descricao: string | null;
  dataInicio: Date;
  dataFim: Date;
  metaVisitas: number;
  metaAvancosPipeline: number;
  metaPrescritores: number;
  responsavelId: string;
  criadaPorId: string;
  plano: "PROFISSIONAL" | "EQUIPE";
  status: "ATIVA" | "ATINGIDA" | "EXPIRADA";
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
export type MetaComProgresso = MetaRecord & {
  progresso: {
    visitas: ProgressoItem;
    avancosPipeline: ProgressoItem;
    prescritores: ProgressoItem;
    geral: number;
  };
  alertas: {
    emRisco: boolean;
    prazoCritico: boolean;
  };
};
export declare function calcularProgressoMeta(
  meta: MetaRecord,
): Promise<MetaComProgresso>;
export declare function calcularProgressoMetas(
  metas: MetaRecord[],
): Promise<MetaComProgresso[]>;
export {};
