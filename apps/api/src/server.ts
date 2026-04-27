import { config } from "dotenv";
import { resolve } from "path";

// Carregar .env primeiro, depois .env.local sobrescreve (prioridade)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

import { buildApp } from "./app";

async function start() {
  const app = await buildApp();

  const port = Number(process.env.PORT) || 3001;
  const host = process.env.HOST || "0.0.0.0";

  try {
    await app.listen({ port, host });
    console.log(`🚀 API running at http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
