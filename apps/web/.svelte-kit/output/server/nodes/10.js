import * as server from '../entries/pages/dashboard/notificacoes/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/notificacoes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/notificacoes/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.Bk_VSaq_.js","_app/immutable/chunks/B7OvSXdl.js","_app/immutable/chunks/Dz_zDEG_.js","_app/immutable/chunks/hSgsWFqJ.js","_app/immutable/chunks/Bsd9pSKX.js","_app/immutable/chunks/yg_k7E3W.js","_app/immutable/chunks/Bio2vzpC.js","_app/immutable/chunks/2TU3FloQ.js","_app/immutable/chunks/WTJKHoOn2.js","_app/immutable/chunks/B0-n5Z9H.js","_app/immutable/chunks/fxBe4e8Y.js","_app/immutable/chunks/BMoNTCgo.js","_app/immutable/chunks/CHaPBP4d.js","_app/immutable/chunks/DqZzN1eu.js","_app/immutable/chunks/DVzjkqah.js","_app/immutable/chunks/CbwYRFhN.js","_app/immutable/chunks/BGNsZQZy2.js","_app/immutable/chunks/DeR83cCv.js","_app/immutable/chunks/Dr6Ce1n7.js","_app/immutable/chunks/BHAX6OMg.js","_app/immutable/chunks/CHD5SdBE.js"];
export const stylesheets = [];
export const fonts = [];
