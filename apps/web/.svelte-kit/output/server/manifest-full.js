export const manifest = (() => {
  function __memo(fn) {
    let value;
    return () => (value ??= value = fn());
  }

  return {
    appDir: "_app",
    appPath: "_app",
    assets: new Set([]),
    mimeTypes: {},
    _: {
      client: {
        start: "_app/immutable/entry/start.Cnw0XI6H.js",
        app: "_app/immutable/entry/app.vWj3FjR6.js",
        imports: [
          "_app/immutable/entry/start.Cnw0XI6H.js",
          "_app/immutable/chunks/BGWMiPqM.js",
          "_app/immutable/chunks/BGJvssSt.js",
          "_app/immutable/chunks/CZsNqhY1.js",
          "_app/immutable/chunks/D4SvF6kG.js",
          "_app/immutable/chunks/BLFvJadL.js",
          "_app/immutable/entry/app.vWj3FjR6.js",
          "_app/immutable/chunks/CZsNqhY1.js",
          "_app/immutable/chunks/D4SvF6kG.js",
          "_app/immutable/chunks/BLFvJadL.js",
          "_app/immutable/chunks/Bzak7iHL.js",
          "_app/immutable/chunks/BGJvssSt.js",
          "_app/immutable/chunks/CsBhEEN0.js",
          "_app/immutable/chunks/Bj1gaHN5.js",
          "_app/immutable/chunks/CRgIWMUr.js",
        ],
        stylesheets: [],
        fonts: [],
        uses_env_dynamic_public: false,
      },
      nodes: [
        __memo(() => import("./nodes/0.js")),
        __memo(() => import("./nodes/1.js")),
        __memo(() => import("./nodes/2.js")),
        __memo(() => import("./nodes/3.js")),
        __memo(() => import("./nodes/4.js")),
        __memo(() => import("./nodes/5.js")),
        __memo(() => import("./nodes/6.js")),
        __memo(() => import("./nodes/7.js")),
        __memo(() => import("./nodes/8.js")),
        __memo(() => import("./nodes/9.js")),
        __memo(() => import("./nodes/10.js")),
        __memo(() => import("./nodes/11.js")),
        __memo(() => import("./nodes/12.js")),
        __memo(() => import("./nodes/13.js")),
      ],
      remotes: {},
      routes: [
        {
          id: "/",
          pattern: /^\/$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: null,
        },
        {
          id: "/api/token",
          pattern: /^\/api\/token\/?$/,
          params: [],
          page: null,
          endpoint: __memo(
            () => import("./entries/endpoints/api/token/_server.ts.js"),
          ),
        },
        {
          id: "/dashboard",
          pattern: /^\/dashboard\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 3 },
          endpoint: null,
        },
        {
          id: "/dashboard/agenda",
          pattern: /^\/dashboard\/agenda\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 4 },
          endpoint: null,
        },
        {
          id: "/dashboard/especialidades",
          pattern: /^\/dashboard\/especialidades\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 5 },
          endpoint: null,
        },
        {
          id: "/dashboard/materiais",
          pattern: /^\/dashboard\/materiais\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 6 },
          endpoint: null,
        },
        {
          id: "/dashboard/notificacoes",
          pattern: /^\/dashboard\/notificacoes\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 7 },
          endpoint: null,
        },
        {
          id: "/dashboard/pipeline",
          pattern: /^\/dashboard\/pipeline\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 8 },
          endpoint: null,
        },
        {
          id: "/dashboard/profissionais",
          pattern: /^\/dashboard\/profissionais\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 9 },
          endpoint: null,
        },
        {
          id: "/dashboard/profissionais/[id]",
          pattern: /^\/dashboard\/profissionais\/([^/]+?)\/?$/,
          params: [
            { name: "id", optional: false, rest: false, chained: false },
          ],
          page: { layouts: [0], errors: [1], leaf: 10 },
          endpoint: null,
        },
        {
          id: "/dashboard/visitas",
          pattern: /^\/dashboard\/visitas\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 11 },
          endpoint: null,
        },
        {
          id: "/login",
          pattern: /^\/login\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 12 },
          endpoint: null,
        },
        {
          id: "/signup",
          pattern: /^\/signup\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 13 },
          endpoint: null,
        },
      ],
      prerendered_routes: new Set([]),
      matchers: async () => {
        return {};
      },
      server_assets: {},
    },
  };
})();
