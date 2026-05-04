import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
declare const ESTAGIOS: readonly [
  "PROSPECTADO",
  "VISITADO",
  "INTERESSADO",
  "PRESCRITOR",
  "FIDELIZADO",
];
type EstagioPipeline = (typeof ESTAGIOS)[number];
export declare function calcularTaxaConversao(
  estagioOrigem: EstagioPipeline,
  estagioDestino: EstagioPipeline,
  dataInicio: Date,
  dataFim: Date,
  prismaClient: typeof prisma,
): Promise<number>;
export declare function profissionaisSemVisita(
  diasLimite: number,
  prismaClient: typeof prisma,
): Promise<number>;
declare const pipelineRoutes: FastifyPluginAsync;
export default pipelineRoutes;
