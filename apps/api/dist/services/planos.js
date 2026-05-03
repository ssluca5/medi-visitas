export const LIMITES_POR_PLANO = {
    TRIAL: {
        limiteProfissionais: 100,
        transcricoesLimite: 7,
        limiteUsuarios: 1,
        temRelatorios: false,
        temGestaoEquipe: false,
        temIa: true,
        pacotesIaDisponiveis: false,
        suporte: "48h",
    },
    BASICO: {
        limiteProfissionais: 100,
        transcricoesLimite: 0,
        limiteUsuarios: 1,
        temRelatorios: false,
        temGestaoEquipe: false,
        temIa: false,
        pacotesIaDisponiveis: false,
        suporte: "48h",
    },
    PROFISSIONAL: {
        limiteProfissionais: 999999,
        transcricoesLimite: 50,
        limiteUsuarios: 1,
        temRelatorios: true,
        temGestaoEquipe: false,
        temIa: true,
        pacotesIaDisponiveis: true,
        suporte: "24h",
    },
    EQUIPE: {
        limiteProfissionais: 999999,
        transcricoesLimite: 200,
        limiteUsuarios: 10,
        temRelatorios: true,
        temGestaoEquipe: true,
        temIa: true,
        pacotesIaDisponiveis: true,
        suporte: "4h",
    },
    EMPRESARIAL: {
        limiteProfissionais: 999999,
        transcricoesLimite: 999999,
        limiteUsuarios: 999999,
        temRelatorios: true,
        temGestaoEquipe: true,
        temIa: true,
        pacotesIaDisponiveis: true,
        suporte: "dedicado",
    },
};
export function getLimitesPlano(plano) {
    if (plano && plano in LIMITES_POR_PLANO) {
        return LIMITES_POR_PLANO[plano];
    }
    return LIMITES_POR_PLANO.TRIAL;
}
