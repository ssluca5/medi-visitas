export const index = 1;
let component_cache;
export const component = async () =>
  (component_cache ??= (await import("../entries/fallbacks/error.svelte.js"))
    .default);
export const imports = [
  "_app/immutable/nodes/1.BvwFZ28I.js",
  "_app/immutable/chunks/Bzak7iHL.js",
  "_app/immutable/chunks/CUONaVJB.js",
  "_app/immutable/chunks/CZsNqhY1.js",
  "_app/immutable/chunks/D4SvF6kG.js",
  "_app/immutable/chunks/BLFvJadL.js",
  "_app/immutable/chunks/Cat8nRvO.js",
  "_app/immutable/chunks/DCnew6Fl.js",
  "_app/immutable/chunks/BGWMiPqM.js",
  "_app/immutable/chunks/BGJvssSt.js",
];
export const stylesheets = [];
export const fonts = [];
