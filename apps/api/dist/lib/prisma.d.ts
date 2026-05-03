import { Prisma } from "@prisma/client";
export declare const prisma: import("@prisma/client/runtime/library").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
    result: {};
    model: {
        $allModels: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        user: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        organization: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        organizationMembro: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        organizationConvite: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        especialidade: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        endereco: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        subEspecialidade: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        profissional: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        contatoProfissional: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        estagioLog: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        visita: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        materialTecnico: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        visitaMaterial: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        agendaItem: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        notificacao: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
    };
    query: {};
    client: {};
}, Prisma.PrismaClientOptions>, Prisma.TypeMapCb, {
    result: {};
    model: {
        $allModels: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        user: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        organization: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        organizationMembro: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        organizationConvite: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        especialidade: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        endereco: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        subEspecialidade: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        profissional: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        contatoProfissional: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        estagioLog: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        visita: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        materialTecnico: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        visitaMaterial: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        agendaItem: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
        notificacao: {
            softDelete: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
            softDeleteMany: () => <T>(this: T, where: Record<string, unknown>) => Promise<any>;
        };
    };
    query: {};
    client: {};
}, {}>;
