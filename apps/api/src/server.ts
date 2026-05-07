import "./env.js";

// Sentry deve ser importado PRIMEIRO, antes de qualquer outro modulo
import "./instrument.js";

import { buildApp } from "./app.js";
import { atualizarStatusMetas } from "./jobs/atualizarStatusMetas.js";

async function start() {
  const app = await buildApp();

  const port = Number(process.env.PORT) || 3002;
  const host = process.env.HOST || "0.0.0.0";

  // Jobs de background nunca devem crashar o servidor.
  try {
    await atualizarStatusMetas(app.log);
  } catch (err) {
    app.log.warn(
      { err },
      "Job inicial de metas falhou (tabela pode nao existir ainda)",
    );
  }

  setInterval(
    () => {
      atualizarStatusMetas(app.log).catch((err) => {
        app.log.error({ err }, "Erro ao atualizar status das metas");
      });
    },
    60 * 60 * 1000,
  );

  try {
    await app.listen({ port, host });
    console.log(`API running at http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
