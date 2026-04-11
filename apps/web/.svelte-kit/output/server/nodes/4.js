export const index = 4;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/dashboard/agenda/_page.svelte.js")
  ).default);
export const imports = [
  "_app/immutable/nodes/4.e3GytRhg.js",
  "_app/immutable/chunks/Bzak7iHL.js",
  "_app/immutable/chunks/BGJvssSt.js",
  "_app/immutable/chunks/CZsNqhY1.js",
  "_app/immutable/chunks/D4SvF6kG.js",
  "_app/immutable/chunks/BLFvJadL.js",
  "_app/immutable/chunks/CsBhEEN0.js",
  "_app/immutable/chunks/C57bVzq3.js",
  "_app/immutable/chunks/DDioZlon.js",
  "_app/immutable/chunks/DFOm60R7.js",
  "_app/immutable/chunks/D_ntMQAe.js",
  "_app/immutable/chunks/CUONaVJB.js",
  "_app/immutable/chunks/Cat8nRvO.js",
  "_app/immutable/chunks/CjOXa5Yh.js",
  "_app/immutable/chunks/qvlMHhdT.js",
  "_app/immutable/chunks/3qHYYpT2.js",
  "_app/immutable/chunks/CqukC_q6.js",
  "_app/immutable/chunks/Bz-yDreG.js",
  "_app/immutable/chunks/D8FNBZgZ.js",
  "_app/immutable/chunks/CSHFKzA8.js",
  "_app/immutable/chunks/D-vgaD8G.js",
  "_app/immutable/chunks/BuANLyWW.js",
  "_app/immutable/chunks/DYTuZaAl.js",
  "_app/immutable/chunks/DI35S9H6.js",
  "_app/immutable/chunks/EGrcUm4A.js",
  "_app/immutable/chunks/aDnaZvbC.js",
];
export const stylesheets = [];
export const fonts = [];
