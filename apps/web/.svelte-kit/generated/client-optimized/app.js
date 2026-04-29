export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/aceitar-convite/[token]": [~3],
		"/dashboard": [~4],
		"/dashboard/agenda": [5],
		"/dashboard/equipe": [~6],
		"/dashboard/especialidades": [7],
		"/dashboard/gestor": [~8],
		"/dashboard/materiais": [9],
		"/dashboard/notificacoes": [~10],
		"/dashboard/perfil": [~11],
		"/dashboard/pipeline": [12],
		"/dashboard/profissionais": [13],
		"/dashboard/profissionais/[id]": [14],
		"/dashboard/relatorios": [~15],
		"/dashboard/visitas": [16],
		"/dashboard/[...404]": [17],
		"/login": [~18],
		"/onboarding": [19],
		"/planos": [20]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';