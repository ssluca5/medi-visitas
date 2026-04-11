export const index = 12;
let component_cache;
export const component = async () =>
  (component_cache ??= (await import("../entries/pages/login/_page.svelte.js"))
    .default);
export const imports = [
  "_app/immutable/nodes/12.D0ybK90-.js",
  "_app/immutable/chunks/Bzak7iHL.js",
  "_app/immutable/chunks/CUONaVJB.js",
  "_app/immutable/chunks/CZsNqhY1.js",
  "_app/immutable/chunks/C57bVzq3.js",
  "_app/immutable/chunks/DDioZlon.js",
  "_app/immutable/chunks/BLFvJadL.js",
];
export const stylesheets = [];
export const fonts = [];
