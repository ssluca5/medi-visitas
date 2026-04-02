export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.B-AqhhKv.js",app:"_app/immutable/entry/app.Ck26Z0DP.js",imports:["_app/immutable/entry/start.B-AqhhKv.js","_app/immutable/chunks/CD8SjCPA.js","_app/immutable/chunks/Cv8w_ml4.js","_app/immutable/chunks/CXr_JAAF.js","_app/immutable/chunks/DDGEypSB.js","_app/immutable/chunks/C7gqJRyU.js","_app/immutable/entry/app.Ck26Z0DP.js","_app/immutable/chunks/CXr_JAAF.js","_app/immutable/chunks/DDGEypSB.js","_app/immutable/chunks/C7gqJRyU.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/Cv8w_ml4.js","_app/immutable/chunks/D0RLiUbJ.js","_app/immutable/chunks/I_vi0e1d.js","_app/immutable/chunks/DCjQXsER.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/token",
				pattern: /^\/api\/token\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/token/_server.ts.js'))
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/dashboard/especialidades",
				pattern: /^\/dashboard\/especialidades\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/dashboard/materiais",
				pattern: /^\/dashboard\/materiais\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/dashboard/profissionais",
				pattern: /^\/dashboard\/profissionais\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/dashboard/profissionais/[id]",
				pattern: /^\/dashboard\/profissionais\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/dashboard/visitas",
				pattern: /^\/dashboard\/visitas\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
