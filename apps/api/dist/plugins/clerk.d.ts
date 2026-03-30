import { FastifyInstance, FastifyPluginOptions } from 'fastify';
declare module 'fastify' {
    interface FastifyInstance {
        verifyClerkToken: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
declare function clerkPlugin(app: FastifyInstance, _opts: FastifyPluginOptions): Promise<void>;
declare const _default: typeof clerkPlugin;
export default _default;
