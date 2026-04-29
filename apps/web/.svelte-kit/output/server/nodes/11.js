import * as server from '../entries/pages/dashboard/perfil/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/perfil/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/perfil/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.BwgatmD9.js","_app/immutable/chunks/BOdCM5Y3.js","_app/immutable/chunks/hSgsWFqJ.js","_app/immutable/chunks/Bsd9pSKX.js","_app/immutable/chunks/yg_k7E3W.js","_app/immutable/chunks/B7OvSXdl.js","_app/immutable/chunks/Bio2vzpC.js","_app/immutable/chunks/2TU3FloQ.js","_app/immutable/chunks/WTJKHoOn2.js","_app/immutable/chunks/B0-n5Z9H.js","_app/immutable/chunks/fxBe4e8Y.js","_app/immutable/chunks/BMoNTCgo.js","_app/immutable/chunks/CHaPBP4d.js","_app/immutable/chunks/DqZzN1eu.js","_app/immutable/chunks/DVzjkqah.js","_app/immutable/chunks/CbwYRFhN.js","_app/immutable/chunks/BGNsZQZy2.js","_app/immutable/chunks/Cx1q6H0X.js","_app/immutable/chunks/DeR83cCv.js","_app/immutable/chunks/B7UNaCwz.js","_app/immutable/chunks/DgYYSMea2.js","_app/immutable/chunks/ZRA4SNIU2.js","_app/immutable/chunks/BV4lHRnS.js"];
export const stylesheets = [];
export const fonts = [];
