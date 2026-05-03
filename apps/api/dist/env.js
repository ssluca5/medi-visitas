import { config } from "dotenv";
import { resolve } from "path";
// Carregar .env primeiro, depois .env.local sobrescreve (prioridade)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });
