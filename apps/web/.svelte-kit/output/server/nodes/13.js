export const index = 13;
let component_cache;
export const component = async () =>
  (component_cache ??= (await import("../entries/pages/signup/_page.svelte.js"))
    .default);
export const imports = [
  "_app/immutable/nodes/13.Cjzz6fbd.js",
  "_app/immutable/chunks/Bzak7iHL.js",
  "_app/immutable/chunks/CUONaVJB.js",
  "_app/immutable/chunks/CZsNqhY1.js",
  "_app/immutable/chunks/C57bVzq3.js",
  "_app/immutable/chunks/DDioZlon.js",
  "_app/immutable/chunks/BLFvJadL.js",
];
export const stylesheets = [];
export const fonts = [];
