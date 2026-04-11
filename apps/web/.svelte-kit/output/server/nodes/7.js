import * as server from "../entries/pages/dashboard/notificacoes/_page.server.ts.js";

export const index = 7;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/dashboard/notificacoes/_page.svelte.js")
  ).default);
export { server };
export const server_id = "src/routes/dashboard/notificacoes/+page.server.ts";
export const imports = [
  "_app/immutable/nodes/7.B1dhsiXB.js",
  "_app/immutable/chunks/Bzak7iHL.js",
  "_app/immutable/chunks/CZsNqhY1.js",
  "_app/immutable/chunks/D4SvF6kG.js",
  "_app/immutable/chunks/BLFvJadL.js",
  "_app/immutable/chunks/CsBhEEN0.js",
  "_app/immutable/chunks/D_ntMQAe.js",
  "_app/immutable/chunks/CUONaVJB.js",
  "_app/immutable/chunks/DDioZlon.js",
  "_app/immutable/chunks/Cat8nRvO.js",
  "_app/immutable/chunks/CwQHtGrs.js",
  "_app/immutable/chunks/Bj1gaHN5.js",
  "_app/immutable/chunks/CkHy_-7l.js",
  "_app/immutable/chunks/DYTuZaAl.js",
];
export const stylesheets = [];
export const fonts = [];
