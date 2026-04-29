import { J as attr, X as escape_html, h as spread_props, l as ensure_array_like, m as slot, p as sanitize_props } from "../../../../chunks/dev.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Bell } from "../../../../chunks/bell.js";
import { t as ItemNotificacao } from "../../../../chunks/ItemNotificacao.js";
import { t as EmptyState } from "../../../../chunks/EmptyState.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/check-check.svelte
function Check_check($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "check-check" },
		sanitize_props($$props),
		{
			/**
			* @component @name CheckCheck
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA3IDE3bC01LTUiIC8+CiAgPHBhdGggZD0ibTIyIDEwLTcuNSA3LjVMMTMgMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check-check
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M18 6 7 17l-5-5" }], ["path", { "d": "m22 10-7.5 7.5L13 16" }]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region src/routes/dashboard/notificacoes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let page = data.page;
		let filtroLida = "";
		let notificacoes = data.data;
		let total = data.total;
		let naoLidas = data.naoLidas;
		let totalPages = data.totalPages;
		$$renderer.push(`<div><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
		Bell($$renderer, { class: "h-5 w-5 text-white" });
		$$renderer.push(`<!----></div> <div><h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">Notificações</h1> <p class="text-sm text-[rgb(var(--slate-500))] mt-0.5">${escape_html(total)} notificação${escape_html(total !== 1 ? "ões" : "")} · ${escape_html(naoLidas)} não lida${escape_html(naoLidas !== 1 ? "s" : "")}</p></div></div> <div class="flex items-center gap-3">`);
		$$renderer.select({
			value: filtroLida,
			class: "h-9 px-3 text-sm rounded-lg border border-[rgb(var(--slate-200))] bg-white text-[rgb(var(--slate-700))] cursor-pointer"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`Todas`);
			});
			$$renderer.option({ value: "false" }, ($$renderer) => {
				$$renderer.push(`Não lidas`);
			});
			$$renderer.option({ value: "true" }, ($$renderer) => {
				$$renderer.push(`Lidas`);
			});
		});
		$$renderer.push(` `);
		if (naoLidas > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors duration-200" style="background-color: rgb(var(--accent)); border-radius: var(--radius);">`);
			Check_check($$renderer, { class: "h-4 w-4" });
			$$renderer.push(`<!----> Marcar todas como lidas</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="rounded-xl border border-[rgb(var(--slate-200))] overflow-hidden bg-white">`);
		if (notificacoes.length === 0) {
			$$renderer.push("<!--[1-->");
			EmptyState($$renderer, {
				icon: Bell,
				titulo: "Nenhuma notificação encontrada",
				descricao: "Você será notificado sobre visitas, lembretes e atualizações."
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="divide-y divide-[rgb(var(--slate-100))]"><!--[-->`);
			const each_array = ensure_array_like(notificacoes);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let notif = each_array[$$index];
				ItemNotificacao($$renderer, {
					notif,
					sessionToken: data.sessionToken,
					onLida: () => {
						notificacoes = notificacoes.map((n) => n.id === notif.id ? {
							...n,
							lida: true
						} : n);
						naoLidas = Math.max(0, naoLidas - 1);
					},
					onDeletada: () => {
						notificacoes = notificacoes.filter((n) => n.id !== notif.id);
						total = Math.max(0, total - 1);
					}
				});
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (totalPages > 1) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center justify-center gap-3 mt-6"><button class="px-3 py-1.5 text-sm rounded-lg border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] transition-colors duration-200 hover:bg-[rgb(var(--slate-50))] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"${attr("disabled", page === 1, true)}>← Anterior</button> <span class="text-sm text-[rgb(var(--slate-500))]">${escape_html(page)} / ${escape_html(totalPages)}</span> <button class="px-3 py-1.5 text-sm rounded-lg border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] transition-colors duration-200 hover:bg-[rgb(var(--slate-50))] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"${attr("disabled", page === totalPages, true)}>Próxima →</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
