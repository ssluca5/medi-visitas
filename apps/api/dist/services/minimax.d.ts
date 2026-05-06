type ProximaVisitaSugerida = {
  dataISO: string | null;
  observacao: string;
} | null;
type CamposVisita = {
  resumo: string;
  proximaAcao: string;
  objetivoVisita: string;
  proximaVisitaSugerida: ProximaVisitaSugerida;
  sugestaoEstagio:
    | "PROSPECTADO"
    | "VISITADO"
    | "INTERESSADO"
    | "PRESCRITOR"
    | "FIDELIZADO"
    | null;
};
export declare function transcreverAudio(
  buffer: Buffer,
  mimeType: string,
): Promise<string>;
export declare function extrairCamposVisita(
  transcricao: string,
): Promise<CamposVisita>;
export {};
