import Fastify from "fastify";
import cors from "@fastify/cors";
import meRoutes from "./routes/me";
import profissionaisRoutes from "./routes/profissionais/index";
import especialidadesRoutes from "./routes/especialidades/index";
import subespecialidadesRoutes from "./routes/subespecialidades/index.js";
import materiaisRoutes from "./routes/materiais/index.js";
import visitasRoutes from "./routes/visitas/index.js";
export async function buildApp() {
    const app = Fastify({
        logger: true,
    });
    // CORS
    await app.register(cors, {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:5173", // SvelteKit dev
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    // Rotas
    await app.register(meRoutes);
    await app.register(profissionaisRoutes);
    await app.register(especialidadesRoutes);
    await app.register(subespecialidadesRoutes);
    await app.register(materiaisRoutes, { prefix: "/materiais" });
    await app.register(visitasRoutes, { prefix: "/visitas" });
    return app;
}
