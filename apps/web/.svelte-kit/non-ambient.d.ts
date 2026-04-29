
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/aceitar-convite" | "/aceitar-convite/[token]" | "/api" | "/api/logout" | "/api/token" | "/dashboard" | "/dashboard/agenda" | "/dashboard/equipe" | "/dashboard/especialidades" | "/dashboard/gestor" | "/dashboard/materiais" | "/dashboard/notificacoes" | "/dashboard/perfil" | "/dashboard/pipeline" | "/dashboard/profissionais" | "/dashboard/profissionais/[id]" | "/dashboard/relatorios" | "/dashboard/visitas" | "/dashboard/[...404]" | "/login" | "/onboarding" | "/planos";
		RouteParams(): {
			"/aceitar-convite/[token]": { token: string };
			"/dashboard/profissionais/[id]": { id: string };
			"/dashboard/[...404]": { 404: string }
		};
		LayoutParams(): {
			"/": { token?: string; id?: string; 404?: string };
			"/aceitar-convite": { token?: string };
			"/aceitar-convite/[token]": { token: string };
			"/api": Record<string, never>;
			"/api/logout": Record<string, never>;
			"/api/token": Record<string, never>;
			"/dashboard": { id?: string; 404?: string };
			"/dashboard/agenda": Record<string, never>;
			"/dashboard/equipe": Record<string, never>;
			"/dashboard/especialidades": Record<string, never>;
			"/dashboard/gestor": Record<string, never>;
			"/dashboard/materiais": Record<string, never>;
			"/dashboard/notificacoes": Record<string, never>;
			"/dashboard/perfil": Record<string, never>;
			"/dashboard/pipeline": Record<string, never>;
			"/dashboard/profissionais": { id?: string };
			"/dashboard/profissionais/[id]": { id: string };
			"/dashboard/relatorios": Record<string, never>;
			"/dashboard/visitas": Record<string, never>;
			"/dashboard/[...404]": { 404: string };
			"/login": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/planos": Record<string, never>
		};
		Pathname(): "/" | `/aceitar-convite/${string}` & {} | "/api/logout" | "/api/token" | "/dashboard" | "/dashboard/agenda" | "/dashboard/equipe" | "/dashboard/especialidades" | "/dashboard/gestor" | "/dashboard/materiais" | "/dashboard/notificacoes" | "/dashboard/perfil" | "/dashboard/pipeline" | "/dashboard/profissionais" | `/dashboard/profissionais/${string}` & {} | "/dashboard/relatorios" | "/dashboard/visitas" | `/dashboard/${string}` & {} | "/login" | "/onboarding" | "/planos";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}