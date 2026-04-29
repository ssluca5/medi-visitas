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
		client: {start:"_app/immutable/entry/start.D17YqVAB.js",app:"_app/immutable/entry/app.CH1WK3dM.js",imports:["_app/immutable/entry/start.D17YqVAB.js","_app/immutable/chunks/BOdCM5Y3.js","_app/immutable/chunks/hSgsWFqJ.js","_app/immutable/chunks/Bsd9pSKX.js","_app/immutable/chunks/yg_k7E3W.js","_app/immutable/chunks/B7OvSXdl.js","_app/immutable/chunks/Bio2vzpC.js","_app/immutable/chunks/2TU3FloQ.js","_app/immutable/chunks/WTJKHoOn2.js","_app/immutable/chunks/B0-n5Z9H.js","_app/immutable/chunks/fxBe4e8Y.js","_app/immutable/chunks/BMoNTCgo.js","_app/immutable/chunks/CHaPBP4d.js","_app/immutable/chunks/DqZzN1eu.js","_app/immutable/chunks/DVzjkqah.js","_app/immutable/chunks/CbwYRFhN.js","_app/immutable/chunks/BGNsZQZy2.js","_app/immutable/entry/app.CH1WK3dM.js","_app/immutable/chunks/CyoWzouY.js","_app/immutable/chunks/hSgsWFqJ.js","_app/immutable/chunks/Bsd9pSKX.js","_app/immutable/chunks/yg_k7E3W.js","_app/immutable/chunks/B7OvSXdl.js","_app/immutable/chunks/Bio2vzpC.js","_app/immutable/chunks/2TU3FloQ.js","_app/immutable/chunks/WTJKHoOn2.js","_app/immutable/chunks/B0-n5Z9H.js","_app/immutable/chunks/fxBe4e8Y.js","_app/immutable/chunks/BMoNTCgo.js","_app/immutable/chunks/CHaPBP4d.js","_app/immutable/chunks/DqZzN1eu.js","_app/immutable/chunks/DVzjkqah.js","_app/immutable/chunks/CbwYRFhN.js","_app/immutable/chunks/BGNsZQZy2.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js'))
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
				id: "/aceitar-convite/[token]",
				pattern: /^\/aceitar-convite\/([^/]+?)\/?$/,
				params: [{"name":"token","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/logout",
				pattern: /^\/api\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/logout/_server.ts.js'))
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
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/dashboard/agenda",
				pattern: /^\/dashboard\/agenda\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/dashboard/equipe",
				pattern: /^\/dashboard\/equipe\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/dashboard/especialidades",
				pattern: /^\/dashboard\/especialidades\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/dashboard/gestor",
				pattern: /^\/dashboard\/gestor\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/dashboard/materiais",
				pattern: /^\/dashboard\/materiais\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/dashboard/notificacoes",
				pattern: /^\/dashboard\/notificacoes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/dashboard/perfil",
				pattern: /^\/dashboard\/perfil\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/dashboard/pipeline",
				pattern: /^\/dashboard\/pipeline\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/dashboard/profissionais",
				pattern: /^\/dashboard\/profissionais\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/dashboard/profissionais/[id]",
				pattern: /^\/dashboard\/profissionais\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/dashboard/relatorios",
				pattern: /^\/dashboard\/relatorios\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/dashboard/visitas",
				pattern: /^\/dashboard\/visitas\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/dashboard/[...404]",
				pattern: /^\/dashboard(?:\/([^]*))?\/?$/,
				params: [{"name":"404","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/onboarding",
				pattern: /^\/onboarding\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/planos",
				pattern: /^\/planos\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
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
