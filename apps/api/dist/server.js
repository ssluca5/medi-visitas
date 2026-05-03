import "./env.js";
// Sentry deve ser importado PRIMEIRO, antes de qualquer outro módulo (logo após variáveis de ambiente)
import "./instrument.js";
import { buildApp } from "./app.js";
async function start() {
    const app = await buildApp();
    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || "0.0.0.0";
    try {
        await app.listen({ port, host });
        console.log(`🚀 API running at http://${host}:${port}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();
