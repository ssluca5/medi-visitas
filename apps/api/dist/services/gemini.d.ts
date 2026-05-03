export declare function transcreverAudio(buffer: Buffer, mimeType: string): Promise<string>;
export declare function extrairCamposVisita(transcricao: string): Promise<{
    resumo: string;
    proximaAcao: string;
    objetivoVisita: string;
}>;
