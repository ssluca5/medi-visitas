import * as server from "../entries/pages/dashboard/_page.server.ts.js";

export const index = 3;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/dashboard/_page.svelte.js")
  ).default);
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = [
  "_app/immutable/nodes/3.C4Q4wIu1.js",
  "_app/immutable/chunks/Bzak7iHL.js",
  "_app/immutable/chunks/CZsNqhY1.js",
  "_app/immutable/chunks/D4SvF6kG.js",
  "_app/immutable/chunks/BLFvJadL.js",
  "_app/immutable/chunks/CsBhEEN0.js",
  "_app/immutable/chunks/D_ntMQAe.js",
  "_app/immutable/chunks/CUONaVJB.js",
  "_app/immutable/chunks/DDioZlon.js",
  "_app/immutable/chunks/Cat8nRvO.js",
  "_app/immutable/chunks/C57bVzq3.js",
  "_app/immutable/chunks/DFOm60R7.js",
  "_app/immutable/chunks/BGWMiPqM.js",
  "_app/immutable/chunks/BGJvssSt.js",
  "_app/immutable/chunks/Bj1gaHN5.js",
  "_app/immutable/chunks/CkHy_-7l.js",
  "_app/immutable/chunks/DYTuZaAl.js",
  "_app/immutable/chunks/CjOXa5Yh.js",
  "_app/immutable/chunks/eFcn31mN.js",
  "_app/immutable/chunks/CqukC_q6.js",
  "_app/immutable/chunks/EGrcUm4A.js",
  "_app/immutable/chunks/DoHM5GQu.js",
  "_app/immutable/chunks/0So1ctTy.js",
  "_app/immutable/chunks/DROL47i9.js",
  "_app/immutable/chunks/D9kr8FOy.js",
];
export const stylesheets = [];
export const fonts = [];
