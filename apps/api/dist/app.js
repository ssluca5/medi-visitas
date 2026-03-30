import Fastify from 'fastify';
import cors from '@fastify/cors';
import meRoutes from './routes/me';
import profissionaisRoutes from './routes/profissionais/index';
export async function buildApp() {
    const app = Fastify({
        logger: true,
    });
    // CORS
    await app.register(cors, {
        origin: true,
        credentials: true,
    });
    // Rotas
    await app.register(meRoutes);
    await app.register(profissionaisRoutes);
    return app;
}
