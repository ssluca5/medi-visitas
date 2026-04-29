import "../../../chunks/index-server.js";
import { J as attr, X as escape_html, _ as stringify, l as ensure_array_like, u as head } from "../../../chunks/dev.js";
import { n as PUBLIC_CLERK_SIGN_IN_HOSTED_URL } from "../../../chunks/public.js";
import { t as Arrow_left } from "../../../chunks/arrow-left.js";
import { t as Arrow_right } from "../../../chunks/arrow-right.js";
import { t as Calendar } from "../../../chunks/calendar.js";
import { t as Chart_column } from "../../../chunks/chart-column.js";
import { t as Shield } from "../../../chunks/shield.js";
import { t as Users } from "../../../chunks/users.js";
//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let redirectUrl = PUBLIC_CLERK_SIGN_IN_HOSTED_URL;
		const features = [
			{
				icon: Users,
				label: "Gestão de profissionais"
			},
			{
				icon: Calendar,
				label: "Agenda inteligente"
			},
			{
				icon: Chart_column,
				label: "Pipeline comercial"
			},
			{
				icon: Shield,
				label: "Dados seguros"
			}
		];
		head("1x05zx6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Login — MediVisitas</title>`);
			});
			$$renderer.push(`<meta name="description" content="Faça login no MediVisitas — CRM para Propagandistas Farmacêuticos"/>`);
		});
		$$renderer.push(`<div class="h-screen w-full flex overflow-hidden font-sans"><div class="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden" style="background-color: rgb(var(--slate-900));"><div class="relative z-10"><div class="flex items-center gap-2"><p class="text-2xl font-bold tracking-tight" style="color: rgb(var(--slate-50));">MediVisitas</p> <span class="w-2 h-2 rounded-full" style="background-color: rgb(var(--accent));"></span></div> <p class="text-sm mt-1.5" style="color: rgb(var(--slate-300));">CRM para Propagandistas Farmacêuticos</p></div> <div class="flex flex-col gap-10 relative z-10"><div><blockquote class="text-3xl font-medium leading-normal max-w-md" style="color: rgb(var(--slate-50)); letter-spacing: -0.01em;">"A ferramenta que transformou minha gestão de visitas. Simples, eficiente e inteligente."</blockquote> <div class="mt-6 flex items-center gap-3"><div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style="background-color: rgb(var(--accent)); color: rgb(var(--slate-50));">JF</div> <div><p class="text-sm font-medium" style="color: rgb(var(--slate-50));">Jamille Fritz</p> <p class="text-xs" style="color: rgb(var(--slate-300));">Propagandista Farmacêutica · Natudermefarma</p></div></div></div></div> <div class="flex flex-wrap items-center gap-4 relative z-10"><!--[-->`);
		const each_array = ensure_array_like(features);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let feat = each_array[$$index];
			const Icon = feat.icon;
			$$renderer.push(`<div class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: rgb(var(--accent) / 0.12);">`);
			if (Icon) {
				$$renderer.push("<!--[-->");
				Icon($$renderer, {
					class: "w-4 h-4",
					style: "color: rgb(var(--accent));"
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div> <span class="text-xs font-medium" style="color: rgb(var(--slate-300));">${escape_html(feat.label)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 relative" style="background-color: rgb(var(--color-surface-2));"><div class="lg:hidden text-center mb-10"><div class="flex items-center justify-center gap-2"><span class="text-2xl font-bold" style="color: rgb(var(--color-text));">MediVisitas</span> <span class="w-2 h-2 rounded-full" style="background-color: rgb(var(--accent));"></span></div> <p class="text-sm mt-1" style="color: rgb(var(--color-text-muted));">CRM para Propagandistas Farmacêuticos</p></div> <div class="w-full max-w-md mx-auto"><div class="mb-10 text-center"><h1 class="text-3xl font-bold mb-2" style="color: rgb(var(--color-text));">Bem-vindo</h1> <p class="text-sm" style="color: rgb(var(--color-text-muted));">Faça login para acessar sua conta</p></div> <div class="flex flex-col gap-4"><a${attr("href", redirectUrl)} role="button" aria-label="Entrar no MediVisitas" class="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2 will-change-transform" style="background-color: rgb(var(--accent)); color: rgb(var(--slate-50)); box-shadow: 0 4px 14px -3px rgb(var(--accent) / 0.35); --tw-ring-color: rgb(var(--accent));">Entrar com sua conta `);
		Arrow_right($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></a> <a href="/onboarding" role="button" class="flex items-center justify-center w-full h-12 rounded-xl border font-semibold text-sm cursor-pointer transition-all duration-200 hover:shadow-sm hover:brightness-[0.98] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2 will-change-transform" style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text)); background-color: rgb(var(--color-surface)); --tw-ring-color: rgb(var(--accent));">Criar conta gratuita</a></div> <div class="mt-4 text-center"><a${attr("href", `${stringify(redirectUrl)}#/forgot-password`)} class="text-xs font-semibold transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm py-2 px-3 inline-block cursor-pointer" style="color: rgb(var(--accent)); --tw-ring-color: rgb(var(--accent));">Esqueceu sua senha?</a></div> <div class="mt-6 text-center"><a href="/" class="text-sm font-medium inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm py-2 px-3 cursor-pointer" style="color: rgb(var(--slate-400)); --tw-ring-color: rgb(var(--accent));">`);
		Arrow_left($$renderer, { class: "w-3.5 h-3.5" });
		$$renderer.push(`<!----> Voltar para o site</a></div> <div class="lg:hidden mt-8 text-center"><blockquote class="text-xs italic" style="color: rgb(var(--color-text-muted));">"A ferramenta que transformou minha gestão de visitas."</blockquote> <p class="text-xs mt-1.5 font-medium" style="color: rgb(var(--color-text-muted));">— Jamille Fritz, Propagandista Farmacêutica</p></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
