import * as server from '../entries/pages/dashboard/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CpLLelVW.js","_app/immutable/chunks/BOdCM5Y3.js","_app/immutable/chunks/hSgsWFqJ.js","_app/immutable/chunks/Bsd9pSKX.js","_app/immutable/chunks/yg_k7E3W.js","_app/immutable/chunks/B7OvSXdl.js","_app/immutable/chunks/Bio2vzpC.js","_app/immutable/chunks/2TU3FloQ.js","_app/immutable/chunks/WTJKHoOn2.js","_app/immutable/chunks/B0-n5Z9H.js","_app/immutable/chunks/fxBe4e8Y.js","_app/immutable/chunks/BMoNTCgo.js","_app/immutable/chunks/CHaPBP4d.js","_app/immutable/chunks/DqZzN1eu.js","_app/immutable/chunks/DVzjkqah.js","_app/immutable/chunks/CbwYRFhN.js","_app/immutable/chunks/BGNsZQZy2.js","_app/immutable/chunks/CAG8AiEC.js","_app/immutable/chunks/Kp3T8TQ1.js","_app/immutable/chunks/Cx1q6H0X.js","_app/immutable/chunks/jXVVLnEA.js","_app/immutable/chunks/B9Ji2gVc.js","_app/immutable/chunks/RCaLO5UV.js","_app/immutable/chunks/ps8rnDDV.js","_app/immutable/chunks/B4Heqghf.js","_app/immutable/chunks/Dr6Ce1n7.js","_app/immutable/chunks/BzS8haFU.js","_app/immutable/chunks/BHAX6OMg.js","_app/immutable/chunks/CRglv0fT2.js","_app/immutable/chunks/9hiKLn2m2.js","_app/immutable/chunks/D0d2t4Aj2.js","_app/immutable/chunks/DsyC3dH-.js","_app/immutable/chunks/DdgCrWf8.js","_app/immutable/chunks/S0HxW7tT.js"];
export const stylesheets = ["_app/immutable/assets/4.DJSQhhWY.css"];
export const fonts = [];
