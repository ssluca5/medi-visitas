import { FastifyInstance, FastifyPluginOptions } from "fastify";
declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
        orgId?: string;
    }
}
declare function clerkPlugin(app: FastifyInstance, _opts: FastifyPluginOptions): Promise<void>;
declare const _default: typeof clerkPlugin;
export default _default;
