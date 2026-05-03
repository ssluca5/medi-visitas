export declare const LIMITES_POR_PLANO: {
    readonly TRIAL: {
        readonly limiteProfissionais: 100;
        readonly transcricoesLimite: 7;
        readonly limiteUsuarios: 1;
        readonly temRelatorios: false;
        readonly temGestaoEquipe: false;
        readonly temIa: true;
        readonly pacotesIaDisponiveis: false;
        readonly suporte: "48h";
    };
    readonly BASICO: {
        readonly limiteProfissionais: 100;
        readonly transcricoesLimite: 0;
        readonly limiteUsuarios: 1;
        readonly temRelatorios: false;
        readonly temGestaoEquipe: false;
        readonly temIa: false;
        readonly pacotesIaDisponiveis: false;
        readonly suporte: "48h";
    };
    readonly PROFISSIONAL: {
        readonly limiteProfissionais: 999999;
        readonly transcricoesLimite: 50;
        readonly limiteUsuarios: 1;
        readonly temRelatorios: true;
        readonly temGestaoEquipe: false;
        readonly temIa: true;
        readonly pacotesIaDisponiveis: true;
        readonly suporte: "24h";
    };
    readonly EQUIPE: {
        readonly limiteProfissionais: 999999;
        readonly transcricoesLimite: 200;
        readonly limiteUsuarios: 10;
        readonly temRelatorios: true;
        readonly temGestaoEquipe: true;
        readonly temIa: true;
        readonly pacotesIaDisponiveis: true;
        readonly suporte: "4h";
    };
    readonly EMPRESARIAL: {
        readonly limiteProfissionais: 999999;
        readonly transcricoesLimite: 999999;
        readonly limiteUsuarios: 999999;
        readonly temRelatorios: true;
        readonly temGestaoEquipe: true;
        readonly temIa: true;
        readonly pacotesIaDisponiveis: true;
        readonly suporte: "dedicado";
    };
};
export type PlanoKey = keyof typeof LIMITES_POR_PLANO;
export declare function getLimitesPlano(plano: string | null | undefined): {
    readonly limiteProfissionais: 100;
    readonly transcricoesLimite: 7;
    readonly limiteUsuarios: 1;
    readonly temRelatorios: false;
    readonly temGestaoEquipe: false;
    readonly temIa: true;
    readonly pacotesIaDisponiveis: false;
    readonly suporte: "48h";
} | {
    readonly limiteProfissionais: 100;
    readonly transcricoesLimite: 0;
    readonly limiteUsuarios: 1;
    readonly temRelatorios: false;
    readonly temGestaoEquipe: false;
    readonly temIa: false;
    readonly pacotesIaDisponiveis: false;
    readonly suporte: "48h";
} | {
    readonly limiteProfissionais: 999999;
    readonly transcricoesLimite: 50;
    readonly limiteUsuarios: 1;
    readonly temRelatorios: true;
    readonly temGestaoEquipe: false;
    readonly temIa: true;
    readonly pacotesIaDisponiveis: true;
    readonly suporte: "24h";
} | {
    readonly limiteProfissionais: 999999;
    readonly transcricoesLimite: 200;
    readonly limiteUsuarios: 10;
    readonly temRelatorios: true;
    readonly temGestaoEquipe: true;
    readonly temIa: true;
    readonly pacotesIaDisponiveis: true;
    readonly suporte: "4h";
} | {
    readonly limiteProfissionais: 999999;
    readonly transcricoesLimite: 999999;
    readonly limiteUsuarios: 999999;
    readonly temRelatorios: true;
    readonly temGestaoEquipe: true;
    readonly temIa: true;
    readonly pacotesIaDisponiveis: true;
    readonly suporte: "dedicado";
};
