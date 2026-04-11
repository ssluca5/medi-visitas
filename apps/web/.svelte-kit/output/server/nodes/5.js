export const index = 5;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/dashboard/especialidades/_page.svelte.js")
  ).default);
export const imports = [
  "_app/immutable/nodes/5.DMHr9PaC.js",
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
  "_app/immutable/chunks/BG-wUOgw.js",
  "_app/immutable/chunks/DI35S9H6.js",
  "_app/immutable/chunks/D-vgaD8G.js",
  "_app/immutable/chunks/CSHFKzA8.js",
  "_app/immutable/chunks/BuANLyWW.js",
  "_app/immutable/chunks/DYTuZaAl.js",
  "_app/immutable/chunks/0So1ctTy.js",
  "_app/immutable/chunks/DpW8pZ2L.js",
  "_app/immutable/chunks/YBzjEPSW.js",
  "_app/immutable/chunks/3qHYYpT2.js",
];
export const stylesheets = [];
export const fonts = [];
