import { z } from 'zod';
export declare const PotencialPrescricaoSchema: z.ZodEnum<["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"]>;
export declare const EstagioPipelineSchema: z.ZodEnum<["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]>;
export declare const TipoContatoSchema: z.ZodEnum<["TELEFONE", "EMAIL", "WHATSAPP", "OUTRO"]>;
export declare const DEFAULT_POTENCIAL: "MEDIO";
export declare const DEFAULT_ESTAGIO: "PROSPECTADO";
export declare const EnderecoInputSchema: z.ZodOptional<z.ZodObject<{
    logradouro: z.ZodOptional<z.ZodString>;
    numero: z.ZodOptional<z.ZodString>;
    complemento: z.ZodOptional<z.ZodString>;
    bairro: z.ZodOptional<z.ZodString>;
    cidade: z.ZodOptional<z.ZodString>;
    estado: z.ZodOptional<z.ZodString>;
    cep: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    logradouro?: string | undefined;
    numero?: string | undefined;
    complemento?: string | undefined;
    bairro?: string | undefined;
    cidade?: string | undefined;
    estado?: string | undefined;
    cep?: string | undefined;
}, {
    logradouro?: string | undefined;
    numero?: string | undefined;
    complemento?: string | undefined;
    bairro?: string | undefined;
    cidade?: string | undefined;
    estado?: string | undefined;
    cep?: string | undefined;
}>>;
export declare const ContatoInputSchema: z.ZodObject<{
    tipo: z.ZodEnum<["TELEFONE", "EMAIL", "WHATSAPP", "OUTRO"]>;
    valor: z.ZodString;
    observacao: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
    valor: string;
    observacao?: string | undefined;
}, {
    tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
    valor: string;
    observacao?: string | undefined;
}>;
export declare const CreateProfissionalInputSchema: z.ZodObject<{
    nome: z.ZodString;
    crm: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    telefone: z.ZodOptional<z.ZodString>;
    potencial: z.ZodDefault<z.ZodEnum<["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"]>>;
    estagioPipeline: z.ZodDefault<z.ZodEnum<["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]>>;
    especialidadeId: z.ZodOptional<z.ZodString>;
    endereco: z.ZodOptional<z.ZodObject<{
        logradouro: z.ZodOptional<z.ZodString>;
        numero: z.ZodOptional<z.ZodString>;
        complemento: z.ZodOptional<z.ZodString>;
        bairro: z.ZodOptional<z.ZodString>;
        cidade: z.ZodOptional<z.ZodString>;
        estado: z.ZodOptional<z.ZodString>;
        cep: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    }, {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    }>>;
    contatos: z.ZodOptional<z.ZodArray<z.ZodObject<{
        tipo: z.ZodEnum<["TELEFONE", "EMAIL", "WHATSAPP", "OUTRO"]>;
        valor: z.ZodString;
        observacao: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }, {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    nome: string;
    potencial: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO";
    estagioPipeline: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
    email?: string | undefined;
    endereco?: {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    } | undefined;
    crm?: string | undefined;
    telefone?: string | undefined;
    especialidadeId?: string | undefined;
    contatos?: {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }[] | undefined;
}, {
    nome: string;
    email?: string | undefined;
    endereco?: {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    } | undefined;
    crm?: string | undefined;
    telefone?: string | undefined;
    potencial?: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO" | undefined;
    estagioPipeline?: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO" | undefined;
    especialidadeId?: string | undefined;
    contatos?: {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }[] | undefined;
}>;
export declare const UpdateProfissionalInputSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    crm: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    telefone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    potencial: z.ZodOptional<z.ZodDefault<z.ZodEnum<["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"]>>>;
    estagioPipeline: z.ZodOptional<z.ZodDefault<z.ZodEnum<["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]>>>;
    especialidadeId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    endereco: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        logradouro: z.ZodOptional<z.ZodString>;
        numero: z.ZodOptional<z.ZodString>;
        complemento: z.ZodOptional<z.ZodString>;
        bairro: z.ZodOptional<z.ZodString>;
        cidade: z.ZodOptional<z.ZodString>;
        estado: z.ZodOptional<z.ZodString>;
        cep: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    }, {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    }>>>;
    contatos: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        tipo: z.ZodEnum<["TELEFONE", "EMAIL", "WHATSAPP", "OUTRO"]>;
        valor: z.ZodString;
        observacao: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }, {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    endereco?: {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    } | undefined;
    nome?: string | undefined;
    crm?: string | undefined;
    telefone?: string | undefined;
    potencial?: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO" | undefined;
    estagioPipeline?: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO" | undefined;
    especialidadeId?: string | undefined;
    contatos?: {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }[] | undefined;
}, {
    email?: string | undefined;
    endereco?: {
        logradouro?: string | undefined;
        numero?: string | undefined;
        complemento?: string | undefined;
        bairro?: string | undefined;
        cidade?: string | undefined;
        estado?: string | undefined;
        cep?: string | undefined;
    } | undefined;
    nome?: string | undefined;
    crm?: string | undefined;
    telefone?: string | undefined;
    potencial?: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO" | undefined;
    estagioPipeline?: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO" | undefined;
    especialidadeId?: string | undefined;
    contatos?: {
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao?: string | undefined;
    }[] | undefined;
}>;
export declare const ListProfissionaisQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    busca: z.ZodOptional<z.ZodString>;
    potencial: z.ZodOptional<z.ZodEnum<["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"]>>;
    estagioPipeline: z.ZodOptional<z.ZodEnum<["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]>>;
    especialidadeId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    potencial?: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO" | undefined;
    estagioPipeline?: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO" | undefined;
    especialidadeId?: string | undefined;
    busca?: string | undefined;
}, {
    potencial?: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO" | undefined;
    estagioPipeline?: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO" | undefined;
    especialidadeId?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    busca?: string | undefined;
}>;
export declare const UpdateEstagioInputSchema: z.ZodObject<{
    estagioNovo: z.ZodEnum<["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]>;
}, "strip", z.ZodTypeAny, {
    estagioNovo: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
}, {
    estagioNovo: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
}>;
export declare const EnderecoOutputSchema: z.ZodObject<{
    id: z.ZodString;
    logradouro: z.ZodNullable<z.ZodString>;
    numero: z.ZodNullable<z.ZodString>;
    complemento: z.ZodNullable<z.ZodString>;
    bairro: z.ZodNullable<z.ZodString>;
    cidade: z.ZodNullable<z.ZodString>;
    estado: z.ZodNullable<z.ZodString>;
    cep: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    logradouro: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
}, {
    id: string;
    logradouro: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
}>;
export declare const EspecialidadeOutputSchema: z.ZodObject<{
    id: z.ZodString;
    nome: z.ZodString;
    categoria: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    nome: string;
    categoria: string;
}, {
    id: string;
    nome: string;
    categoria: string;
}>;
export declare const ContatoOutputSchema: z.ZodObject<{
    id: z.ZodString;
    tipo: z.ZodEnum<["TELEFONE", "EMAIL", "WHATSAPP", "OUTRO"]>;
    valor: z.ZodString;
    observacao: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
    valor: string;
    observacao: string | null;
}, {
    id: string;
    tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
    valor: string;
    observacao: string | null;
}>;
export declare const ProfissionalOutputSchema: z.ZodObject<{
    id: z.ZodString;
    nome: z.ZodString;
    crm: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    telefone: z.ZodNullable<z.ZodString>;
    potencial: z.ZodEnum<["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"]>;
    estagioPipeline: z.ZodEnum<["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]>;
    especialidadeId: z.ZodNullable<z.ZodString>;
    enderecoId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    deletedAt: z.ZodNullable<z.ZodDate>;
    especialidade: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        nome: z.ZodString;
        categoria: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        nome: string;
        categoria: string;
    }, {
        id: string;
        nome: string;
        categoria: string;
    }>>;
    endereco: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        logradouro: z.ZodNullable<z.ZodString>;
        numero: z.ZodNullable<z.ZodString>;
        complemento: z.ZodNullable<z.ZodString>;
        bairro: z.ZodNullable<z.ZodString>;
        cidade: z.ZodNullable<z.ZodString>;
        estado: z.ZodNullable<z.ZodString>;
        cep: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        logradouro: string | null;
        numero: string | null;
        complemento: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        cep: string | null;
    }, {
        id: string;
        logradouro: string | null;
        numero: string | null;
        complemento: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        cep: string | null;
    }>>;
    contatos: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        tipo: z.ZodEnum<["TELEFONE", "EMAIL", "WHATSAPP", "OUTRO"]>;
        valor: z.ZodString;
        observacao: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao: string | null;
    }, {
        id: string;
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string | null;
    especialidade: {
        id: string;
        nome: string;
        categoria: string;
    } | null;
    endereco: {
        id: string;
        logradouro: string | null;
        numero: string | null;
        complemento: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        cep: string | null;
    } | null;
    nome: string;
    crm: string | null;
    telefone: string | null;
    potencial: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO";
    estagioPipeline: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
    especialidadeId: string | null;
    contatos: {
        id: string;
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao: string | null;
    }[];
    enderecoId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}, {
    id: string;
    email: string | null;
    especialidade: {
        id: string;
        nome: string;
        categoria: string;
    } | null;
    endereco: {
        id: string;
        logradouro: string | null;
        numero: string | null;
        complemento: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        cep: string | null;
    } | null;
    nome: string;
    crm: string | null;
    telefone: string | null;
    potencial: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO";
    estagioPipeline: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
    especialidadeId: string | null;
    contatos: {
        id: string;
        tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
        valor: string;
        observacao: string | null;
    }[];
    enderecoId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const PaginationMetaSchema: z.ZodObject<{
    page: z.ZodNumber;
    pageSize: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}, {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}>;
export declare const ProfissionaisListOutputSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        nome: z.ZodString;
        crm: z.ZodNullable<z.ZodString>;
        email: z.ZodNullable<z.ZodString>;
        telefone: z.ZodNullable<z.ZodString>;
        potencial: z.ZodEnum<["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"]>;
        estagioPipeline: z.ZodEnum<["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"]>;
        especialidadeId: z.ZodNullable<z.ZodString>;
        enderecoId: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        deletedAt: z.ZodNullable<z.ZodDate>;
        especialidade: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            nome: z.ZodString;
            categoria: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            nome: string;
            categoria: string;
        }, {
            id: string;
            nome: string;
            categoria: string;
        }>>;
        endereco: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            logradouro: z.ZodNullable<z.ZodString>;
            numero: z.ZodNullable<z.ZodString>;
            complemento: z.ZodNullable<z.ZodString>;
            bairro: z.ZodNullable<z.ZodString>;
            cidade: z.ZodNullable<z.ZodString>;
            estado: z.ZodNullable<z.ZodString>;
            cep: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            logradouro: string | null;
            numero: string | null;
            complemento: string | null;
            bairro: string | null;
            cidade: string | null;
            estado: string | null;
            cep: string | null;
        }, {
            id: string;
            logradouro: string | null;
            numero: string | null;
            complemento: string | null;
            bairro: string | null;
            cidade: string | null;
            estado: string | null;
            cep: string | null;
        }>>;
        contatos: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            tipo: z.ZodEnum<["TELEFONE", "EMAIL", "WHATSAPP", "OUTRO"]>;
            valor: z.ZodString;
            observacao: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
            valor: string;
            observacao: string | null;
        }, {
            id: string;
            tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
            valor: string;
            observacao: string | null;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string | null;
        especialidade: {
            id: string;
            nome: string;
            categoria: string;
        } | null;
        endereco: {
            id: string;
            logradouro: string | null;
            numero: string | null;
            complemento: string | null;
            bairro: string | null;
            cidade: string | null;
            estado: string | null;
            cep: string | null;
        } | null;
        nome: string;
        crm: string | null;
        telefone: string | null;
        potencial: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO";
        estagioPipeline: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
        especialidadeId: string | null;
        contatos: {
            id: string;
            tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
            valor: string;
            observacao: string | null;
        }[];
        enderecoId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, {
        id: string;
        email: string | null;
        especialidade: {
            id: string;
            nome: string;
            categoria: string;
        } | null;
        endereco: {
            id: string;
            logradouro: string | null;
            numero: string | null;
            complemento: string | null;
            bairro: string | null;
            cidade: string | null;
            estado: string | null;
            cep: string | null;
        } | null;
        nome: string;
        crm: string | null;
        telefone: string | null;
        potencial: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO";
        estagioPipeline: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
        especialidadeId: string | null;
        contatos: {
            id: string;
            tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
            valor: string;
            observacao: string | null;
        }[];
        enderecoId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>, "many">;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        id: string;
        email: string | null;
        especialidade: {
            id: string;
            nome: string;
            categoria: string;
        } | null;
        endereco: {
            id: string;
            logradouro: string | null;
            numero: string | null;
            complemento: string | null;
            bairro: string | null;
            cidade: string | null;
            estado: string | null;
            cep: string | null;
        } | null;
        nome: string;
        crm: string | null;
        telefone: string | null;
        potencial: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO";
        estagioPipeline: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
        especialidadeId: string | null;
        contatos: {
            id: string;
            tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
            valor: string;
            observacao: string | null;
        }[];
        enderecoId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}, {
    data: {
        id: string;
        email: string | null;
        especialidade: {
            id: string;
            nome: string;
            categoria: string;
        } | null;
        endereco: {
            id: string;
            logradouro: string | null;
            numero: string | null;
            complemento: string | null;
            bairro: string | null;
            cidade: string | null;
            estado: string | null;
            cep: string | null;
        } | null;
        nome: string;
        crm: string | null;
        telefone: string | null;
        potencial: "BAIXO" | "MEDIO" | "ALTO" | "ESTRATEGICO";
        estagioPipeline: "PROSPECTADO" | "VISITADO" | "INTERESSADO" | "PRESCRITOR" | "FIDELIZADO";
        especialidadeId: string | null;
        contatos: {
            id: string;
            tipo: "TELEFONE" | "EMAIL" | "WHATSAPP" | "OUTRO";
            valor: string;
            observacao: string | null;
        }[];
        enderecoId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}>;
export type CreateProfissionalInput = z.infer<typeof CreateProfissionalInputSchema>;
export type UpdateProfissionalInput = z.infer<typeof UpdateProfissionalInputSchema>;
export type ListProfissionaisQuery = z.infer<typeof ListProfissionaisQuerySchema>;
export type UpdateEstagioInput = z.infer<typeof UpdateEstagioInputSchema>;
export type ProfissionalOutput = z.infer<typeof ProfissionalOutputSchema>;
export type ProfissionaisListOutput = z.infer<typeof ProfissionaisListOutputSchema>;
