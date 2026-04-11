import * as server from "../entries/pages/_page.server.ts.js";

export const index = 2;
let component_cache;
export const component = async () =>
  (component_cache ??= (await import("../entries/pages/_page.svelte.js"))
    .default);
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = [
  "_app/immutable/nodes/2.CLFqqILH.js",
  "_app/immutable/chunks/Bzak7iHL.js",
  "_app/immutable/chunks/CUONaVJB.js",
  "_app/immutable/chunks/CZsNqhY1.js",
];
export const stylesheets = [];
export const fonts = [];
