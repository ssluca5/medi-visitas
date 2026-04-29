import { J as attr, X as escape_html, Y as clsx, _ as stringify, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, r as attr_style, s as derived, u as head, v as unsubscribe_stores } from "../../chunks/dev.js";
import { n as onNavigate } from "../../chunks/client.js";
import "../../chunks/navigation.js";
import { t as page } from "../../chunks/state.js";
import { n as toasts } from "../../chunks/toast.svelte.js";
import { t as Icon } from "../../chunks/Icon.js";
import { t as Bell } from "../../chunks/bell.js";
import { t as Calendar } from "../../chunks/calendar.js";
import { t as Chart_column } from "../../chunks/chart-column.js";
import { t as File_text } from "../../chunks/file-text.js";
import { t as Info } from "../../chunks/info.js";
import { t as Package } from "../../chunks/package.js";
import { t as Stethoscope } from "../../chunks/stethoscope.js";
import { t as Triangle_alert } from "../../chunks/triangle-alert.js";
import { t as Users } from "../../chunks/users.js";
import { t as X } from "../../chunks/x.js";
import "../../chunks/stores.js";
import "../../chunks/ItemNotificacao.js";
import { t as Sheet } from "../../chunks/Sheet.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/circle-check.svelte
function Circle_check($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "circle-check" },
		sanitize_props($$props),
		{
			/**
			* @component @name CircleCheck
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtOSAxMiAyIDIgNC00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}], ["path", { "d": "m9 12 2 2 4-4" }]],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/circle-x.svelte
function Circle_x($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "circle-x" },
		sanitize_props($$props),
		{
			/**
			* @component @name CircleX
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtMTUgOS02IDYiIC8+CiAgPHBhdGggZD0ibTkgOSA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-x
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["circle", {
					"cx": "12",
					"cy": "12",
					"r": "10"
				}],
				["path", { "d": "m15 9-6 6" }],
				["path", { "d": "m9 9 6 6" }]
			],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/layout-dashboard.svelte
function Layout_dashboard($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "layout-dashboard" },
		sanitize_props($$props),
		{
			/**
			* @component @name LayoutDashboard
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["rect", {
					"width": "7",
					"height": "9",
					"x": "3",
					"y": "3",
					"rx": "1"
				}],
				["rect", {
					"width": "7",
					"height": "5",
					"x": "14",
					"y": "3",
					"rx": "1"
				}],
				["rect", {
					"width": "7",
					"height": "9",
					"x": "14",
					"y": "12",
					"rx": "1"
				}],
				["rect", {
					"width": "7",
					"height": "5",
					"x": "3",
					"y": "16",
					"rx": "1"
				}]
			],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/log-out.svelte
function Log_out($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "log-out" },
		sanitize_props($$props),
		{
			/**
			* @component @name LogOut
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjEgMTIgMTYgNyIgLz4KICA8bGluZSB4MT0iMjEiIHgyPSI5IiB5MT0iMTIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/log-out
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
				["polyline", { "points": "16 17 21 12 16 7" }],
				["line", {
					"x1": "21",
					"x2": "9",
					"y1": "12",
					"y2": "12"
				}]
			],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/menu.svelte
function Menu($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "menu" },
		sanitize_props($$props),
		{
			/**
			* @component @name Menu
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iNiIgeTI9IjYiIC8+CiAgPGxpbmUgeDE9IjQiIHgyPSIyMCIgeTE9IjE4IiB5Mj0iMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/menu
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["line", {
					"x1": "4",
					"x2": "20",
					"y1": "12",
					"y2": "12"
				}],
				["line", {
					"x1": "4",
					"x2": "20",
					"y1": "6",
					"y2": "6"
				}],
				["line", {
					"x1": "4",
					"x2": "20",
					"y1": "18",
					"y2": "18"
				}]
			],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/panel-left-close.svelte
function Panel_left_close($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "panel-left-close" },
		sanitize_props($$props),
		{
			/**
			* @component @name PanelLeftClose
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+CiAgPHBhdGggZD0ibTE2IDE1LTMtMyAzLTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/panel-left-close
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["rect", {
					"width": "18",
					"height": "18",
					"x": "3",
					"y": "3",
					"rx": "2"
				}],
				["path", { "d": "M9 3v18" }],
				["path", { "d": "m16 15-3-3 3-3" }]
			],
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
//#region src/lib/components/ui/Toast.svelte
function Toast($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const iconMap = {
			success: Circle_check,
			error: Circle_x,
			info: Info,
			warning: Triangle_alert
		};
		const styleMap = {
			success: {
				bg: "#d1fae5",
				border: "#6ee7b7",
				text: "#065f46"
			},
			error: {
				bg: "#fee2e2",
				border: "#fca5a5",
				text: "#991b1b"
			},
			info: {
				bg: "#eff6ff",
				border: "#bfdbfe",
				text: "#1e40af"
			},
			warning: {
				bg: "#fef3c7",
				border: "#fde68a",
				text: "#92400e"
			}
		};
		$$renderer.push(`<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none"><!--[-->`);
		const each_array = ensure_array_like(toasts.value);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let t = each_array[$$index];
			const Icon = iconMap[t.type];
			const colors = styleMap[t.type];
			$$renderer.push(`<div class="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg pointer-events-auto min-w-72 max-w-sm"${attr_style(`background-color: ${stringify(colors.bg)}; border-color: ${stringify(colors.border)};`)}>`);
			Icon($$renderer, {
				class: "w-5 h-5 shrink-0",
				style: `color: ${stringify(colors.text)};`
			});
			$$renderer.push(`<!----> <span class="text-sm flex-1"${attr_style(`color: ${stringify(colors.text)};`)}>${escape_html(t.message)}</span> <button class="p-0.5 rounded hover:opacity-80 cursor-pointer shrink-0 transition-opacity"${attr_style(`color: ${stringify(colors.text)};`)}>`);
			X($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----></button></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/ui/ProgressBar.svelte
function ProgressBar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/notificacoes/PainelNotificacoes.svelte
function PainelNotificacoes($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { sessionToken, onFechar, onContagemAtualizada } = $$props;
		let notificacoes = [];
		let naoLidasCount = derived(() => notificacoes.filter((n) => !n.lida).length);
		$$renderer.push(`<div class="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--slate-200))]"><p class="text-sm font-semibold text-[rgb(var(--slate-900))]">Notificações `);
		if (naoLidasCount() > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium text-white" style="background-color: rgb(var(--accent));"${attr("aria-label", `${stringify(naoLidasCount())} não lidas`)}>${escape_html(naoLidasCount())}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></p> `);
		if (naoLidasCount() > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="text-xs font-medium transition-colors duration-200 cursor-pointer" style="color: rgb(var(--accent));" aria-label="Marcar todas as notificações como lidas">Marcar todas como lidas</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div role="list" aria-label="Lista de notificações" class="max-h-96 overflow-y-auto divide-y divide-[rgb(var(--slate-100))]">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-8" aria-live="polite"><p class="text-sm text-[rgb(var(--slate-400))]">Carregando...</p></div>`);
		$$renderer.push(`<!--]--></div> <div class="border-t border-[rgb(var(--slate-200))] px-4 py-2.5"><a href="/dashboard/notificacoes" class="text-xs font-medium block text-center transition-colors duration-200" style="color: rgb(var(--accent));">Ver histórico completo →</a></div>`);
	});
}
//#endregion
//#region src/lib/components/layout/SinoNotificacoes.svelte
function SinoNotificacoes($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { sessionToken } = $$props;
		let naoLidas = 0;
		let painelAberto = false;
		$$renderer.push(`<div class="relative"><button class="relative p-2 text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] rounded-full transition-colors cursor-pointer" aria-label="Notificações"${attr("aria-expanded", painelAberto)} aria-haspopup="true">`);
		Bell($$renderer, { class: "w-5 h-5" });
		$$renderer.push(`<!----> `);
		if (naoLidas > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"${attr("aria-label", `${stringify(naoLidas)} notificações não lidas`)} role="status"></span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></button> `);
		if (painelAberto) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-40"></div> <div class="absolute bottom-0 left-full ml-4 z-[100] w-80 rounded-xl border border-[rgb(var(--slate-100))] shadow-2xl overflow-hidden bg-white">`);
			PainelNotificacoes($$renderer, {
				sessionToken,
				onFechar: () => painelAberto = false,
				onContagemAtualizada: (n) => naoLidas = n
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/Sidebar.svelte
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { userName, sessionToken, plano, organizationId, trialExpiraEm, role } = $$props;
		let diasRestantes = derived(() => {
			if (!trialExpiraEm || plano !== "TRIAL") return null;
			const expira = new Date(trialExpiraEm);
			const agora = /* @__PURE__ */ new Date();
			const diff = Math.ceil((expira.getTime() - agora.getTime()) / (1e3 * 60 * 60 * 24));
			return Math.max(0, diff);
		});
		let collapsed = false;
		const navItems = [
			{
				href: "/dashboard",
				label: "Dashboard",
				icon: Layout_dashboard
			},
			{
				href: "/dashboard/agenda",
				label: "Agenda",
				icon: Calendar
			},
			{
				href: "/dashboard/visitas",
				label: "Visitas",
				icon: File_text
			},
			{
				href: "/dashboard/pipeline",
				label: "Pipeline",
				icon: Chart_column
			}
		];
		const adminItems = role === "OWNER" ? [{
			href: "/dashboard/equipe",
			label: "Equipe",
			icon: Users
		}, {
			href: "/dashboard/gestor",
			label: "Gestão/Resumo",
			icon: Chart_column
		}] : [];
		const cadAuxItems = [
			{
				href: "/dashboard/profissionais",
				label: "Profissionais",
				icon: Users
			},
			{
				href: "/dashboard/especialidades",
				label: "Especialidades",
				icon: Stethoscope
			},
			{
				href: "/dashboard/materiais",
				label: "Materiais e Amostras",
				icon: Package
			}
		];
		let currentPath = derived(() => page.url.pathname);
		function isActive(href) {
			if (href === "/dashboard") return currentPath() === "/dashboard";
			return currentPath().startsWith(href);
		}
		$$renderer.push(`<aside aria-label="Navegação principal"${attr_class("hidden flex-shrink-0 flex-col h-full bg-white border-r border-[rgb(var(--slate-200))] relative transition-[width] duration-300 ease-in-out lg:flex overflow-visible", void 0, {
			"w-64": true,
			"w-16": collapsed
		})}><div class="shrink-0 flex items-center justify-between px-5 pt-5 pb-4">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex-1 min-w-0"><h1 class="text-lg font-semibold tracking-tight text-[rgb(var(--slate-900))]">MediVisitas</h1> <p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">CRM para Propagandistas</p></div> <button aria-label="Recolher sidebar" aria-expanded="true" class="ml-2 shrink-0 p-1.5 rounded-md text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer" title="Recolher sidebar">`);
		Panel_left_close($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----></button>`);
		$$renderer.push(`<!--]--></div> <nav aria-label="Principal" class="flex-1 overflow-y-auto overflow-x-visible px-3 space-y-0.5"><!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			const active = isActive(item.href);
			const Icon = item.icon;
			$$renderer.push(`<a${attr("href", item.href)}${attr("aria-current", active ? "page" : void 0)}${attr_class(clsx(active ? "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]" : "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))] will-change-transform transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"))}${attr("title", void 0)}>`);
			if (Icon) {
				$$renderer.push("<!--[-->");
				Icon($$renderer, { class: active ? "h-[18px] w-[18px] text-blue-600 transition-colors duration-200" : "h-[18px] w-[18px] text-[rgb(var(--slate-400))] group-hover:text-[rgb(var(--slate-600))] transition-colors duration-200" });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(item.label)}</span>`);
			$$renderer.push(`<!--]--></a>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="pt-5 pb-1"><div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">Configurações</div></div>`);
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(adminItems);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let item = each_array_1[$$index_1];
			const active = isActive(item.href);
			const Icon = item.icon;
			$$renderer.push(`<a${attr("href", item.href)}${attr("aria-current", active ? "page" : void 0)}${attr_class(clsx(active ? "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]" : "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))] will-change-transform transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"))}${attr("title", void 0)}>`);
			if (Icon) {
				$$renderer.push("<!--[-->");
				Icon($$renderer, { class: active ? "h-[18px] w-[18px] text-blue-600 transition-colors duration-200" : "h-[18px] w-[18px] text-[rgb(var(--slate-400))] group-hover:text-[rgb(var(--slate-600))] transition-colors duration-200" });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(item.label)}</span>`);
			$$renderer.push(`<!--]--></a>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="pt-5 pb-1"><div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">Cadastros</div></div>`);
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_2 = ensure_array_like(cadAuxItems);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let item = each_array_2[$$index_2];
			const active = isActive(item.href);
			const Icon = item.icon;
			$$renderer.push(`<a${attr("href", item.href)}${attr("aria-current", active ? "page" : void 0)}${attr_class(clsx(active ? "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]" : "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))] will-change-transform transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"))}${attr("title", void 0)}>`);
			if (Icon) {
				$$renderer.push("<!--[-->");
				Icon($$renderer, { class: active ? "h-[18px] w-[18px] text-blue-600 transition-colors duration-200" : "h-[18px] w-[18px] text-[rgb(var(--slate-400))] group-hover:text-[rgb(var(--slate-600))] transition-colors duration-200" });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(item.label)}</span>`);
			$$renderer.push(`<!--]--></a>`);
		}
		$$renderer.push(`<!--]--></nav> `);
		if (plano && true) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="px-3 py-2 mb-1"><span${attr_class(`text-xs px-2 py-0.5 rounded-full font-medium ${stringify(plano === "TRIAL" || plano === "INDIVIDUAL" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800")}`)}>${escape_html(plano === "INDIVIDUAL" ? "Individual" : plano === "TRIAL" ? "Trial" : plano === "EMPRESA" ? "Empresa" : plano)}</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (diasRestantes() !== null && diasRestantes() <= 2 && true) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mx-3 mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200"><p class="text-xs font-medium text-amber-800">`);
			if (diasRestantes() === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`Trial expira hoje`);
			} else if (diasRestantes() === 1) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`Trial expira amanhã`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Trial expira em ${escape_html(diasRestantes())} dias`);
			}
			$$renderer.push(`<!--]--></p> <a href="/planos" class="mt-1 block text-xs text-amber-600 underline hover:text-amber-700">Assinar agora</a></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mt-auto shrink-0 border-t border-[rgb(var(--slate-200))] bg-white p-4"><div${attr_class("flex items-center w-full gap-3 px-1 py-2 transition-all duration-300", void 0, {
			"flex-col": collapsed,
			"gap-2": collapsed,
			"items-center": collapsed
		})}><a href="/dashboard/perfil" class="flex items-center gap-3 flex-1 min-w-0 rounded-lg hover:bg-[rgb(var(--slate-50))] transition-all duration-200 px-1 py-1" title="Meu Perfil"><div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm shrink-0">${escape_html(userName.charAt(0).toUpperCase())}</div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex-1 min-w-0"><p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate">${escape_html(userName)}</p></div>`);
		$$renderer.push(`<!--]--></a> <div class="relative z-10 shrink-0">`);
		SinoNotificacoes($$renderer, { sessionToken });
		$$renderer.push(`<!----></div></div> <form method="POST" action="/api/logout"><button type="submit" aria-label="Sair do sistema" class="mt-1 flex w-full items-center justify-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-400))] will-change-transform transition-all duration-200 ease-out hover:bg-[rgb(var(--slate-50))] hover:text-[rgb(var(--slate-600))] hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] cursor-pointer">`);
		Log_out($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span>Sair</span>`);
		$$renderer.push(`<!--]--></button></form></div></aside>`);
	});
}
//#endregion
//#region src/lib/components/MobileNav.svelte
function MobileNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { userName, sessionToken } = $$props;
		let drawerOpen = false;
		const navItems = [
			{
				href: "/dashboard",
				label: "Dashboard",
				icon: Layout_dashboard
			},
			{
				href: "/dashboard/agenda",
				label: "Agenda",
				icon: Calendar
			},
			{
				href: "/dashboard/visitas",
				label: "Visitas",
				icon: File_text
			},
			{
				href: "/dashboard/pipeline",
				label: "Pipeline",
				icon: Chart_column
			}
		];
		const cadAuxItems = [
			{
				href: "/dashboard/profissionais",
				label: "Profissionais",
				icon: Users
			},
			{
				href: "/dashboard/especialidades",
				label: "Especialidades",
				icon: Stethoscope
			},
			{
				href: "/dashboard/materiais",
				label: "Materiais e Amostras",
				icon: Package
			}
		];
		let currentPath = derived(() => page.url.pathname);
		function isActive(href) {
			if (href === "/dashboard") return currentPath() === "/dashboard";
			return currentPath().startsWith(href);
		}
		function closeDrawer() {
			drawerOpen = false;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<header class="flex lg:hidden items-center justify-between px-4 py-3 bg-white border-b border-[rgb(var(--slate-200))] shrink-0"><button type="button" aria-label="Abrir menu de navegação"${attr("aria-expanded", drawerOpen)} aria-haspopup="dialog" class="p-2 -ml-2 rounded-lg text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))] hover:bg-[rgb(var(--slate-100))] transition-colors cursor-pointer">`);
			Menu($$renderer, { class: "h-5 w-5" });
			$$renderer.push(`<!----></button> <div class="flex-1 min-w-0 text-center"><h1 class="text-base font-semibold text-[rgb(var(--slate-900))] tracking-tight">MediVisitas</h1></div> <div class="relative z-10">`);
			SinoNotificacoes($$renderer, { sessionToken });
			$$renderer.push(`<!----></div></header> `);
			Sheet($$renderer, {
				onclose: closeDrawer,
				side: "left",
				get open() {
					return drawerOpen;
				},
				set open($$value) {
					drawerOpen = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex flex-col h-full -m-6"><div class="shrink-0 px-5 pt-5 pb-4 border-b border-[rgb(var(--slate-100))]"><h1 class="text-lg font-semibold tracking-tight text-[rgb(var(--slate-900))]">MediVisitas</h1> <p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">CRM para Propagandistas</p></div> <nav aria-label="Navegação principal" class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5"><!--[-->`);
					const each_array = ensure_array_like(navItems);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let item = each_array[$$index];
						const active = isActive(item.href);
						const Icon = item.icon;
						$$renderer.push(`<a${attr("href", item.href)}${attr("aria-current", active ? "page" : void 0)}${attr_class(`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer ${stringify(active ? "font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]" : "text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]")}`)}>`);
						if (Icon) {
							$$renderer.push("<!--[-->");
							Icon($$renderer, { class: `h-[18px] w-[18px] ${stringify(active ? "text-blue-600" : "text-[rgb(var(--slate-400))]")} transition-colors duration-200` });
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` <span>${escape_html(item.label)}</span></a>`);
					}
					$$renderer.push(`<!--]--> <div class="pt-5 pb-1"><div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">Cadastros</div></div> <!--[-->`);
					const each_array_1 = ensure_array_like(cadAuxItems);
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let item = each_array_1[$$index_1];
						const active = isActive(item.href);
						const Icon = item.icon;
						$$renderer.push(`<a${attr("href", item.href)}${attr("aria-current", active ? "page" : void 0)}${attr_class(`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer ${stringify(active ? "font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]" : "text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]")}`)}>`);
						if (Icon) {
							$$renderer.push("<!--[-->");
							Icon($$renderer, { class: `h-[18px] w-[18px] ${stringify(active ? "text-blue-600" : "text-[rgb(var(--slate-400))]")} transition-colors duration-200` });
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` <span>${escape_html(item.label)}</span></a>`);
					}
					$$renderer.push(`<!--]--></nav> <div class="shrink-0 border-t border-[rgb(var(--slate-100))] p-4"><div class="flex items-center gap-3"><div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm">${escape_html(userName.charAt(0).toUpperCase())}</div> <div class="flex-1 min-w-0"><p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate">${escape_html(userName)}</p></div></div> <form method="POST" action="/api/logout"><button type="submit" aria-label="Sair do sistema" class="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-[rgb(var(--slate-400))] transition-all duration-200 ease-out hover:bg-[rgb(var(--slate-50))] hover:text-[rgb(var(--slate-600))] cursor-pointer">`);
					Log_out($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> <span>Sair</span></button></form></div></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		onNavigate((navigation) => {
			if (!document.startViewTransition) return;
			return new Promise((resolve) => {
				document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
				});
			});
		});
		let isDashboard = derived(() => page.url.pathname.startsWith("/dashboard"));
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>MediVisitas — CRM para Propagandistas</title>`);
			});
		});
		if (isDashboard()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-[rgb(var(--slate-50))]">`);
			MobileNav($$renderer, {
				userName: data.userName ?? "Usuário",
				sessionToken: data.sessionToken
			});
			$$renderer.push(`<!----> `);
			Sidebar($$renderer, {
				userName: data.userName ?? "Usuário",
				sessionToken: data.sessionToken,
				plano: data.plano,
				organizationId: data.organizationId,
				trialExpiraEm: data.trialExpiraEm,
				role: data.role
			});
			$$renderer.push(`<!----> <main class="flex-1 min-w-0 h-full overflow-y-auto"><div class="p-4 lg:p-8">`);
			children($$renderer);
			$$renderer.push(`<!----></div></main></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		}
		$$renderer.push(`<!--]--> `);
		ProgressBar($$renderer, {});
		$$renderer.push(`<!----> `);
		Toast($$renderer, {});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _layout as default };
