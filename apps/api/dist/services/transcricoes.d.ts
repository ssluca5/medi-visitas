export declare function verificarLimiteTranscricao(organizationId: string): Promise<{
    permitido: boolean;
    usadas: number;
    limite: number;
    extras: number;
}>;
export declare function incrementarTranscricao(organizationId: string): Promise<void>;
