export { matchers } from "./matchers.js";

export const nodes = [
  () => import("./nodes/0"),
  () => import("./nodes/1"),
  () => import("./nodes/2"),
  () => import("./nodes/3"),
  () => import("./nodes/4"),
  () => import("./nodes/5"),
  () => import("./nodes/6"),
  () => import("./nodes/7"),
  () => import("./nodes/8"),
  () => import("./nodes/9"),
  () => import("./nodes/10"),
  () => import("./nodes/11"),
  () => import("./nodes/12"),
  () => import("./nodes/13"),
];

export const server_loads = [0];

export const dictionary = {
  "/": [~2],
  "/dashboard": [~3],
  "/dashboard/agenda": [4],
  "/dashboard/especialidades": [5],
  "/dashboard/materiais": [6],
  "/dashboard/notificacoes": [~7],
  "/dashboard/pipeline": [8],
  "/dashboard/profissionais": [9],
  "/dashboard/profissionais/[id]": [10],
  "/dashboard/visitas": [11],
  "/login": [12],
  "/signup": [13],
};

export const hooks = {
  handleError: ({ error }) => {
    console.error(error);
  },

  reroute: () => {},
  transport: {},
};

export const decoders = Object.fromEntries(
  Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]),
);
export const encoders = Object.fromEntries(
  Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]),
);

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from "../root.js";
