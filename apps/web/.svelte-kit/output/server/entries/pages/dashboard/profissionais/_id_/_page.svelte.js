import "../../../../../chunks/index-server.js";
import { J as attr, X as escape_html, _ as stringify, g as store_get, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, s as derived, u as head, v as unsubscribe_stores } from "../../../../../chunks/dev.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { t as Calendar_plus } from "../../../../../chunks/calendar-plus.js";
import { t as Calendar } from "../../../../../chunks/calendar.js";
import { t as Clock } from "../../../../../chunks/clock.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
import { t as Mail } from "../../../../../chunks/mail.js";
import { t as Map_pin } from "../../../../../chunks/map-pin.js";
import { t as Package } from "../../../../../chunks/package.js";
import { t as Phone } from "../../../../../chunks/phone.js";
import { t as Trending_up } from "../../../../../chunks/trending-up.js";
import { t as User } from "../../../../../chunks/user.js";
import { t as page } from "../../../../../chunks/stores.js";
import { t as apiFetch } from "../../../../../chunks/api.js";
import { t as StatusVisitaBadge } from "../../../../../chunks/StatusVisitaBadge.js";
import "../../../../../chunks/Button.js";
import { t as VisitaSheet } from "../../../../../chunks/VisitaSheet.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/activity.svelte
function Activity($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "activity" },
		sanitize_props($$props),
		{
			/**
			* @component @name Activity
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTJoLTIuNDhhMiAyIDAgMCAwLTEuOTMgMS40NmwtMi4zNSA4LjM2YS4yNS4yNSAwIDAgMS0uNDggMEw5LjI0IDIuMThhLjI1LjI1IDAgMCAwLS40OCAwbC0yLjM1IDguMzZBMiAyIDAgMCAxIDQuNDkgMTJIMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/activity
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" }]],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/list-todo.svelte
function List_todo($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "list-todo" },
		sanitize_props($$props),
		{
			/**
			* @component @name ListTodo
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIzIiB5PSI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cGF0aCBkPSJtMyAxNyAyIDIgNC00IiAvPgogIDxwYXRoIGQ9Ik0xMyA2aDgiIC8+CiAgPHBhdGggZD0iTTEzIDEyaDgiIC8+CiAgPHBhdGggZD0iTTEzIDE4aDgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list-todo
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["rect", {
					"x": "3",
					"y": "5",
					"width": "6",
					"height": "6",
					"rx": "1"
				}],
				["path", { "d": "m3 17 2 2 4-4" }],
				["path", { "d": "M13 6h8" }],
				["path", { "d": "M13 12h8" }],
				["path", { "d": "M13 18h8" }]
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/message-circle.svelte
function Message_circle($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "message-circle" },
		sanitize_props($$props),
		{
			/**
			* @component @name MessageCircle
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNy45IDIwQTkgOSAwIDEgMCA0IDE2LjFMMiAyMloiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/message-circle
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }]],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/pencil.svelte
function Pencil($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "pencil" },
		sanitize_props($$props),
		{
			/**
			* @component @name Pencil
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/target.svelte
function Target($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "target" },
		sanitize_props($$props),
		{
			/**
			* @component @name Target
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/target
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
				["circle", {
					"cx": "12",
					"cy": "12",
					"r": "6"
				}],
				["circle", {
					"cx": "12",
					"cy": "12",
					"r": "2"
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
//#region src/lib/components/crm/TimelineProfissional.svelte
function TimelineProfissional($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { itens } = $$props;
		function formatData(iso) {
			return new Intl.DateTimeFormat("pt-BR", {
				day: "2-digit",
				month: "short",
				year: "numeric"
			}).format(new Date(iso));
		}
		function formatHora(iso) {
			return new Intl.DateTimeFormat("pt-BR", {
				hour: "2-digit",
				minute: "2-digit"
			}).format(new Date(iso));
		}
		const statusVisitaClass = {
			REALIZADA: "bg-emerald-50 text-emerald-700",
			CANCELADA: "bg-red-50 text-red-600",
			NAO_REALIZADA: "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]",
			AGENDADA: "bg-blue-50 text-blue-700"
		};
		const statusAgendaClass = {
			REALIZADO: "bg-emerald-50 text-emerald-700",
			CANCELADO: "bg-red-50 text-red-600",
			CONFIRMADO: "bg-blue-50 text-blue-700",
			PLANEJADO: "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]"
		};
		const estagioLabels = {
			PROSPECTADO: "Prospectado",
			VISITADO: "Visitado",
			INTERESSADO: "Interessado",
			PRESCRITOR: "Prescritor",
			FIDELIZADO: "Fidelizado"
		};
		if (itens.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><p class="text-sm text-[rgb(var(--slate-400))]">Nenhum evento no histórico</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="relative ml-3 pl-6 space-y-5"><div class="absolute left-0 top-0 bottom-0 w-[2px] bg-[rgb(var(--slate-100))]"></div> <!--[-->`);
			const each_array = ensure_array_like(itens);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<div class="relative">`);
				if (item.tipo === "VISITA") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div${attr_class(`absolute -left-[calc(1.5rem+5px)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-[3px] ring-[rgb(var(--slate-50))] shadow-sm ${stringify(item.status === "REALIZADA" ? "bg-emerald-500" : item.status === "CANCELADA" ? "bg-red-500" : item.status === "NAO_REALIZADA" ? "bg-[rgb(var(--slate-50))]0" : "bg-blue-500")} `)}></div>`);
				} else if (item.tipo === "ESTAGIO") {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<div class="absolute -left-[calc(1.5rem+5px)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-[3px] ring-[rgb(var(--slate-50))] shadow-sm bg-violet-500"></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="absolute -left-[calc(1.5rem+5px)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-[3px] ring-[rgb(var(--slate-50))] shadow-sm bg-amber-500"></div>`);
				}
				$$renderer.push(`<!--]--> <div class="bg-white rounded-xl p-4 shadow-sm border border-[rgb(var(--slate-100))] will-change-transform hover:shadow-md transition-all duration-200"><div class="flex items-center gap-2 mb-2">`);
				if (item.tipo === "VISITA") {
					$$renderer.push("<!--[0-->");
					Calendar($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))]" });
				} else if (item.tipo === "ESTAGIO") {
					$$renderer.push("<!--[1-->");
					Trending_up($$renderer, { class: "w-3.5 h-3.5 text-violet-400" });
				} else {
					$$renderer.push("<!--[-1-->");
					Clock($$renderer, { class: "w-3.5 h-3.5 text-amber-400" });
				}
				$$renderer.push(`<!--]--> <span class="text-[13px] font-semibold text-[rgb(var(--slate-700))]">${escape_html(formatData(item.data))}</span> <span class="text-[rgb(var(--slate-300))]">·</span> <span class="text-[13px] text-[rgb(var(--slate-500))]">${escape_html(formatHora(item.data))}</span></div> `);
				if (item.tipo === "VISITA") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center gap-2 flex-wrap">`);
					if (item.status) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span${attr_class(`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(statusVisitaClass[item.status] ?? "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]")}`)}>${escape_html(item.status)}</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (item.duracaoMinutos) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-xs text-[rgb(var(--slate-400))]">${escape_html(item.duracaoMinutos)}min</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> `);
					if (item.objetivoVisita) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-[13px] text-[rgb(var(--slate-600))] mt-1.5">${escape_html(item.objetivoVisita)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (item.resumo) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-xs text-[rgb(var(--slate-500))] mt-1">${escape_html(item.resumo)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else if (item.tipo === "ESTAGIO") {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<p class="text-[13px] text-[rgb(var(--slate-600))]">`);
					if (item.estagioAnterior) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-[rgb(var(--slate-400))]">${escape_html(estagioLabels[item.estagioAnterior] ?? item.estagioAnterior)}</span> <span class="text-[rgb(var(--slate-300))] mx-1">→</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <span class="font-semibold text-violet-700">${escape_html(estagioLabels[item.estagioNovo ?? ""] ?? item.estagioNovo)}</span></p>`);
				} else if (item.tipo === "AGENDAMENTO") {
					$$renderer.push("<!--[2-->");
					$$renderer.push(`<div class="flex items-center gap-2 flex-wrap">`);
					if (item.status) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span${attr_class(`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(statusAgendaClass[item.status] ?? "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]")}`)}>${escape_html(item.status)}</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (item.prioridade) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span${attr_class(`text-xs font-semibold ${stringify(item.prioridade === "URGENTE" ? "text-red-600" : item.prioridade === "ALTA" ? "text-amber-600" : item.prioridade === "MEDIA" ? "text-blue-600" : "text-[rgb(var(--slate-400))]")} `)}>${escape_html(item.prioridade)}</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> `);
					if (item.dataFim) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-xs text-[rgb(var(--slate-400))] mt-1">até ${escape_html(formatHora(item.dataFim))}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (item.observacoes) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-xs text-[rgb(var(--slate-500))] mt-1">${escape_html(item.observacoes)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/crm/DetalheContatos.svelte
function DetalheContatos($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { contatos, telefone, email, endereco } = $$props;
		const contatoIcon = {
			TELEFONE: Phone,
			EMAIL: Mail,
			WHATSAPP: Message_circle,
			OUTRO: Phone
		};
		const contatoLabel = {
			TELEFONE: "Telefone",
			EMAIL: "E-mail",
			WHATSAPP: "WhatsApp",
			OUTRO: "Outro"
		};
		$$renderer.push(`<div class="space-y-6">`);
		if (telefone || email) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div><h3 class="text-xs font-bold text-[rgb(var(--slate-400))] uppercase tracking-widest mb-4">Contato Principal</h3> <div class="space-y-3">`);
			if (telefone) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", `tel:${stringify(telefone.replace(/\D/g, ""))}`)} class="flex items-center gap-3 mb-4">`);
				Phone($$renderer, { class: "w-4 h-4 text-[rgb(var(--slate-400))] shrink-0" });
				$$renderer.push(`<!----> <div><span class="block text-xs font-bold text-[rgb(var(--slate-400))] uppercase">Telefone</span> <span class="block text-sm font-semibold text-blue-600 hover:text-blue-700">${escape_html(telefone)}</span></div></a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (email) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", `mailto:${stringify(email)}`)} class="flex items-center gap-3 mb-4">`);
				Mail($$renderer, { class: "w-4 h-4 text-[rgb(var(--slate-400))] shrink-0" });
				$$renderer.push(`<!----> <div><span class="block text-xs font-bold text-[rgb(var(--slate-400))] uppercase">E-mail</span> <span class="block text-sm font-semibold text-blue-600 hover:text-blue-700 break-all">${escape_html(email)}</span></div></a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (contatos.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div><h3 class="text-xs font-bold text-[rgb(var(--slate-400))] uppercase tracking-widest mb-4">Contatos Adicionais</h3> <div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(contatos);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let contato = each_array[$$index];
				const Icon = contatoIcon[contato.tipo] ?? Phone;
				$$renderer.push(`<div class="flex items-center gap-3 mb-4">`);
				if (Icon) {
					$$renderer.push("<!--[-->");
					Icon($$renderer, { class: "w-4 h-4 text-[rgb(var(--slate-400))] shrink-0" });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` <div><span class="block text-xs font-bold text-[rgb(var(--slate-400))] uppercase">${escape_html(contatoLabel[contato.tipo] ?? contato.tipo)}</span> <span class="block text-sm font-semibold text-[rgb(var(--slate-800))]">${escape_html(contato.valor)}</span> `);
				if (contato.observacao) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="block text-xs text-[rgb(var(--slate-500))] italic mt-0.5">${escape_html(contato.observacao)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (endereco) {
			$$renderer.push("<!--[0-->");
			const enderecoStr = [endereco.logradouro, endereco.numero].filter(Boolean).join(", ");
			const cidadeUf = [endereco.cidade, endereco.estado].filter(Boolean).join(" / ");
			if (enderecoStr || cidadeUf) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div><h3 class="text-xs font-bold text-[rgb(var(--slate-400))] uppercase tracking-widest mb-4">Endereço</h3> <div class="flex items-start gap-3">`);
				Map_pin($$renderer, { class: "w-4 h-4 text-[rgb(var(--slate-400))] mt-0.5 shrink-0" });
				$$renderer.push(`<!----> <div>`);
				if (enderecoStr) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="block text-sm font-semibold text-[rgb(var(--slate-800))]">${escape_html(enderecoStr)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (endereco.bairro) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="block text-xs text-[rgb(var(--slate-500))] mt-0.5">${escape_html(endereco.bairro)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (cidadeUf) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="block text-xs text-[rgb(var(--slate-500))] mt-0.5">${escape_html(cidadeUf)}${escape_html(endereco.cep ? ` · CEP ${endereco.cep}` : "")}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/routes/dashboard/profissionais/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { data } = $$props;
		let id = derived(() => store_get($$store_subs ??= {}, "$page", page).params.id);
		let profissional = null;
		let visitas = [];
		let materiaisOptions = [];
		let timelineItens = [];
		let loading = true;
		let abaAtiva = "timeline";
		let visitaSheetOpen = false;
		let visitaEmEdicao = null;
		const potencialConfig = {
			ALTO: {
				label: "Alto",
				class: "bg-emerald-50 text-emerald-700"
			},
			MEDIO: {
				label: "Médio",
				class: "bg-amber-50 text-amber-700"
			},
			BAIXO: {
				label: "Baixo",
				class: "bg-red-50 text-red-600"
			},
			ESTRATEGICO: {
				label: "Estratégico",
				class: "bg-violet-50 text-violet-700"
			}
		};
		const estagioConfig = {
			PROSPECTADO: {
				label: "Prospectado",
				class: "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]"
			},
			VISITADO: {
				label: "Visitado",
				class: "bg-blue-50 text-blue-700"
			},
			INTERESSADO: {
				label: "Interessado",
				class: "bg-purple-50 text-purple-700"
			},
			PRESCRITOR: {
				label: "Prescritor",
				class: "bg-emerald-50 text-emerald-700"
			},
			FIDELIZADO: {
				label: "Fidelizado",
				class: "bg-amber-50 text-amber-700"
			}
		};
		const classificacaoConfig = {
			FORTE: {
				label: "Forte",
				class: "bg-emerald-50 text-emerald-700"
			},
			INTERMEDIARIO: {
				label: "Intermediário",
				class: "bg-amber-50 text-amber-700"
			},
			FRACO: {
				label: "Fraco",
				class: "bg-red-50 text-red-600"
			}
		};
		const tratamentoLabels = {
			DR: "Dr.",
			DRA: "Dra.",
			PROF: "Prof.",
			PROFA: "Profa.",
			SR: "Sr.",
			SRA: "Sra."
		};
		const sexoLabels = {
			MASCULINO: "Masculino",
			FEMININO: "Feminino",
			NAO_INFORMADO: "Não informado"
		};
		async function loadData() {
			loading = true;
			try {
				const [profRes, visitasRes, matRes, timelineRes] = await Promise.all([
					apiFetch(`/profissionais/${id()}`, data.sessionToken),
					apiFetch(`/visitas?profissionalId=${id()}&pageSize=50`, data.sessionToken),
					apiFetch(`/materiais?pageSize=100`, data.sessionToken),
					apiFetch(`/profissionais/${id()}/timeline`, data.sessionToken)
				]);
				if (profRes.ok) profissional = await profRes.json();
				if (visitasRes.ok) {
					const json = await visitasRes.json();
					visitas = json.data || json;
				}
				if (matRes.ok) {
					const json = await matRes.json();
					materiaisOptions = json.data || json;
				}
				if (timelineRes.ok) timelineItens = (await timelineRes.json()).itens || [];
			} catch (err) {
				console.error(err);
			} finally {
				loading = false;
			}
		}
		function getInitials(nome) {
			return nome.split(" ").slice(0, 2).map((n) => n.charAt(0)).join("").toUpperCase();
		}
		function getNomeCompleto(prof) {
			return (prof.tratamento ? (tratamentoLabels[prof.tratamento] ?? "") + " " : "") + prof.nome;
		}
		const tabs = [
			{
				id: "timeline",
				label: "Timeline",
				icon: Activity
			},
			{
				id: "visitas",
				label: "Visitas",
				icon: Calendar
			},
			{
				id: "agenda",
				label: "Agenda",
				icon: List_todo
			},
			{
				id: "dados",
				label: "Dados",
				icon: User
			}
		];
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("aho02t", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(profissional ? profissional.nome : "Perfil do Profissional")} — MediVisitas</title>`);
				});
			});
			$$renderer.push(`<div class="min-h-screen bg-[rgb(var(--slate-50))] p-4 lg:p-8"><div class="flex items-center mb-6"><a href="/dashboard/profissionais" class="flex items-center gap-1.5 text-sm font-medium text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] transition-colors group">`);
			Arrow_left($$renderer, { class: "w-4 h-4 group-hover:-translate-x-0.5 transition-transform" });
			$$renderer.push(`<!----> Voltar para CRM</a></div> `);
			if (loading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-center items-start pt-32"><div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>`);
			} else if (profissional) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10 items-start"><div class="col-span-1 lg:sticky lg:top-8"><div class="w-full bg-white rounded-xl border border-[rgb(var(--slate-200))] shadow-sm p-6 flex flex-col"><div class="flex flex-col items-center text-center"><div class="w-14 h-14 rounded-full bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-700))] flex items-center justify-center text-xl font-bold mb-3 ring-4 ring-[rgb(var(--slate-50))]">${escape_html(getInitials(profissional.nome))}</div> <h1 class="text-[22px] leading-tight font-bold text-[rgb(var(--slate-900))] mb-1">${escape_html(getNomeCompleto(profissional))}</h1> <p class="text-sm font-medium text-[rgb(var(--slate-500))] mb-2">${escape_html(profissional.especialidade?.nome ?? "Sem especialidade")} `);
				if (profissional.subEspecialidade?.nome) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-[rgb(var(--slate-300))]">·</span>${escape_html(profissional.subEspecialidade.nome)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div> <hr class="border-[rgb(var(--slate-100))] my-6"/> <div class="flex flex-wrap gap-2 justify-center mb-4">`);
				if (profissional.potencial && potencialConfig[profissional.potencial]) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(`inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(potencialConfig[profissional.potencial].class)}`)}>${escape_html(potencialConfig[profissional.potencial].label)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profissional.estagioPipeline && estagioConfig[profissional.estagioPipeline]) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(`inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(estagioConfig[profissional.estagioPipeline].class)}`)}>${escape_html(estagioConfig[profissional.estagioPipeline].label)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profissional.classificacao && classificacaoConfig[profissional.classificacao]) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(`inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(classificacaoConfig[profissional.classificacao].class)}`)}>${escape_html(classificacaoConfig[profissional.classificacao].label)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="space-y-3">`);
				if (profissional.crm) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex justify-between"><span class="text-[11px] font-bold text-[rgb(var(--slate-400))] uppercase tracking-wider">CRM</span> <span class="text-[13px] font-semibold text-[rgb(var(--slate-900))]">${escape_html(profissional.crm)}</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profissional.cpfCnpj) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex justify-between"><span class="text-[11px] font-bold text-[rgb(var(--slate-400))] uppercase tracking-wider">CPF/CNPJ</span> <span class="text-[13px] font-semibold text-[rgb(var(--slate-900))]">${escape_html(profissional.cpfCnpj)}</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profissional.sexo) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex justify-between"><span class="text-[11px] font-bold text-[rgb(var(--slate-400))] uppercase tracking-wider">Sexo</span> <span class="text-[13px] font-semibold text-[rgb(var(--slate-900))]">${escape_html(sexoLabels[profissional.sexo] ?? profissional.sexo)}</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profissional.dataNascimento) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex justify-between"><span class="text-[11px] font-bold text-[rgb(var(--slate-400))] uppercase tracking-wider">Nasc.</span> <span class="text-[13px] font-semibold text-[rgb(var(--slate-900))]">${escape_html(new Date(profissional.dataNascimento).toLocaleDateString("pt-BR", { timeZone: "UTC" }))}</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> `);
				if (profissional.observacoes) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<hr class="border-[rgb(var(--slate-100))] my-4"/> <p class="text-[13px] font-medium text-[rgb(var(--slate-600))] leading-relaxed bg-[rgb(var(--slate-50))]/50 rounded-md p-3 border border-[rgb(var(--slate-100))]/50">${escape_html(profissional.observacoes)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="mt-auto pt-6"><a${attr("href", `/dashboard/profissionais?editId=${stringify(profissional.id)}`)} class="flex items-center justify-center gap-2 w-full text-sm font-semibold text-[rgb(var(--slate-700))] bg-white border border-[rgb(var(--slate-200))] hover:border-[rgb(var(--slate-300))] hover:bg-[rgb(var(--slate-50))] hover:shadow-sm rounded-lg py-2.5 transition-all outline-none cursor-pointer">`);
				Pencil($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))]" });
				$$renderer.push(`<!----> Editar Cadastro</a></div></div></div> <div class="col-span-1 lg:col-span-2 xl:col-span-3"><div class="flex items-center justify-between mb-6"><div class="flex gap-1 bg-white rounded-lg border border-[rgb(var(--slate-200))] p-1 shadow-sm"><!--[-->`);
				const each_array = ensure_array_like(tabs);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let tab = each_array[$$index];
					const Icon = tab.icon;
					const active = abaAtiva === tab.id;
					$$renderer.push(`<button type="button"${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer ${stringify(active ? "bg-blue-600 text-white shadow-sm" : "text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))] hover:bg-[rgb(var(--slate-50))]")} `)}>`);
					if (Icon) {
						$$renderer.push("<!--[-->");
						Icon($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` ${escape_html(tab.label)}</button>`);
				}
				$$renderer.push(`<!--]--></div> <button type="button" class="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 will-change-transform shadow-sm transition-all hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer">`);
				Calendar_plus($$renderer, { class: "w-4 h-4" });
				$$renderer.push(`<!----> Registrar Visita</button></div> `);
				if (abaAtiva === "timeline") {
					$$renderer.push("<!--[0-->");
					TimelineProfissional($$renderer, { itens: timelineItens });
				} else if (abaAtiva === "visitas") {
					$$renderer.push("<!--[1-->");
					if (visitas.length === 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="text-center py-20 bg-white rounded-xl border border-dashed border-[rgb(var(--slate-200))]"><div class="flex justify-center mb-4"><div class="bg-[rgb(var(--slate-100))] p-3 rounded-full">`);
						Calendar($$renderer, { class: "w-7 h-7 text-[rgb(var(--slate-400))]" });
						$$renderer.push(`<!----></div></div> <p class="text-sm font-medium text-[rgb(var(--slate-600))]">Nenhuma visita registrada</p> <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Registre a primeira visita para este profissional.</p> <button type="button" class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">`);
						Calendar_plus($$renderer, { class: "w-4 h-4" });
						$$renderer.push(`<!----> Criar primeira visita</button></div>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div class="relative ml-3 pl-6 space-y-6"><div class="absolute left-0 top-0 bottom-0 w-[2px] bg-[rgb(var(--slate-100))]"></div> <!--[-->`);
						const each_array_1 = ensure_array_like(visitas);
						for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
							let visita = each_array_1[$$index_2];
							$$renderer.push(`<div class="relative"><div${attr_class(`absolute -left-[calc(1.5rem+5px)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-[3px] ring-[rgb(var(--slate-50))] shadow-sm ${stringify(visita.status === "REALIZADA" ? "bg-emerald-500" : visita.status === "CANCELADA" ? "bg-red-500" : visita.status === "NAO_REALIZADA" ? "bg-[rgb(var(--slate-50))]0" : "bg-blue-500")} `)}></div> <button type="button" class="w-full text-left bg-white rounded-xl p-5 will-change-transform shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-[1px] cursor-pointer border border-[rgb(var(--slate-100))] hover:border-[rgb(var(--slate-200))]"><div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2">`);
							Calendar($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))]" });
							$$renderer.push(`<!----> <span class="text-sm font-semibold text-[rgb(var(--slate-700))]">${escape_html(new Intl.DateTimeFormat("pt-BR", {
								day: "2-digit",
								month: "short",
								year: "numeric"
							}).format(new Date(visita.dataVisita)))}</span> <span class="text-[rgb(var(--slate-300))]">·</span> <span class="text-sm font-semibold text-[rgb(var(--slate-700))]">${escape_html(new Intl.DateTimeFormat("pt-BR", {
								hour: "2-digit",
								minute: "2-digit"
							}).format(new Date(visita.dataVisita)))}</span> `);
							if (visita.duracaoMinutos) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span class="text-[rgb(var(--slate-300))]">·</span> <span class="flex items-center gap-1 text-xs text-[rgb(var(--slate-400))]">`);
								Clock($$renderer, { class: "w-3 h-3" });
								$$renderer.push(`<!---->${escape_html(visita.duracaoMinutos)}min</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> `);
							StatusVisitaBadge($$renderer, { status: visita.status });
							$$renderer.push(`<!----></div> `);
							if (visita.objetivoVisita) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="flex items-start gap-2 mt-2">`);
								Target($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))] mt-0.5 shrink-0" });
								$$renderer.push(`<!----> <p class="text-[rgb(var(--slate-600))] text-sm">${escape_html(visita.objetivoVisita)}</p></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (visita.resumo) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="flex items-start gap-2 mt-2">`);
								File_text($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))] mt-0.5 shrink-0" });
								$$renderer.push(`<!----> <p class="text-[rgb(var(--slate-500))] text-sm">${escape_html(visita.resumo)}</p></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (visita.materiais && visita.materiais.length > 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-[rgb(var(--slate-50))]">`);
								Package($$renderer, { class: "w-3 h-3 text-[rgb(var(--slate-400))] shrink-0" });
								$$renderer.push(`<!----> <!--[-->`);
								const each_array_2 = ensure_array_like(visita.materiais);
								for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
									let vm = each_array_2[$$index_1];
									$$renderer.push(`<span class="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-md">${escape_html(vm.quantidade)}x ${escape_html(vm.materialTecnico?.nome || "Material")}</span>`);
								}
								$$renderer.push(`<!--]--></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></button></div>`);
						}
						$$renderer.push(`<!--]--></div>`);
					}
					$$renderer.push(`<!--]-->`);
				} else if (abaAtiva === "agenda") {
					$$renderer.push("<!--[2-->");
					$$renderer.push(`<div class="text-center py-12 bg-white rounded-xl border border-[rgb(var(--slate-100))]"><p class="text-sm text-[rgb(var(--slate-400))]">Agenda deste profissional será exibida aqui</p></div>`);
				} else if (abaAtiva === "dados") {
					$$renderer.push("<!--[3-->");
					$$renderer.push(`<div class="bg-white rounded-xl border border-[rgb(var(--slate-100))] p-6">`);
					DetalheContatos($$renderer, {
						contatos: profissional.contatos ?? [],
						telefone: profissional.telefone,
						email: profissional.email,
						endereco: profissional.endereco
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="text-center py-20"><p class="text-sm text-[rgb(var(--slate-500))]">Profissional não encontrado.</p> <a href="/dashboard/profissionais" class="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">Voltar à listagem</a></div>`);
			}
			$$renderer.push(`<!--]--></div> `);
			VisitaSheet($$renderer, {
				onclose: () => {
					visitaSheetOpen = false;
				},
				onsave: () => {
					loadData();
				},
				visita: visitaEmEdicao,
				profissionalId: id(),
				sessionToken: data.sessionToken,
				materiaisOptions,
				get open() {
					return visitaSheetOpen;
				},
				set open($$value) {
					visitaSheetOpen = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
