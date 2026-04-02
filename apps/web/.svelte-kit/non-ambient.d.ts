
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
		RouteId(): "/" | "/api" | "/api/token" | "/dashboard" | "/dashboard/especialidades" | "/dashboard/materiais" | "/dashboard/profissionais" | "/dashboard/profissionais/[id]" | "/dashboard/visitas" | "/login" | "/signup";
		RouteParams(): {
			"/dashboard/profissionais/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": Record<string, never>;
			"/api/token": Record<string, never>;
			"/dashboard": { id?: string };
			"/dashboard/especialidades": Record<string, never>;
			"/dashboard/materiais": Record<string, never>;
			"/dashboard/profissionais": { id?: string };
			"/dashboard/profissionais/[id]": { id: string };
			"/dashboard/visitas": Record<string, never>;
			"/login": Record<string, never>;
			"/signup": Record<string, never>
		};
		Pathname(): "/" | "/api/token" | "/dashboard" | "/dashboard/especialidades" | "/dashboard/materiais" | "/dashboard/profissionais" | `/dashboard/profissionais/${string}` & {} | "/dashboard/visitas" | "/login" | "/signup";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}