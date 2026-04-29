import { n as onDestroy } from "../../../../chunks/index-server.js";
import { J as attr, X as escape_html, _ as stringify, a as await_block, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, r as attr_style, s as derived, u as head } from "../../../../chunks/dev.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Calendar_days } from "../../../../chunks/calendar-days.js";
import { t as Calendar_plus } from "../../../../chunks/calendar-plus.js";
import { t as Chevron_left } from "../../../../chunks/chevron-left.js";
import { t as Chevron_right } from "../../../../chunks/chevron-right.js";
import { t as Clock } from "../../../../chunks/clock.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import "../../../../chunks/ConfirmDialog.js";
import { t as Trending_up } from "../../../../chunks/trending-up.js";
import { t as apiFetch } from "../../../../chunks/api.js";
import "../../../../chunks/Button.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/calendar-range.svelte
function Calendar_range($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "calendar-range" },
		sanitize_props($$props),
		{
			/**
			* @component @name CalendarRange
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0xNiAydjQiIC8+CiAgPHBhdGggZD0iTTMgMTBoMTgiIC8+CiAgPHBhdGggZD0iTTggMnY0IiAvPgogIDxwYXRoIGQ9Ik0xNyAxNGgtNiIgLz4KICA8cGF0aCBkPSJNMTMgMThINyIgLz4KICA8cGF0aCBkPSJNNyAxNGguMDEiIC8+CiAgPHBhdGggZD0iTTE3IDE4aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/calendar-range
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
					"y": "4",
					"rx": "2"
				}],
				["path", { "d": "M16 2v4" }],
				["path", { "d": "M3 10h18" }],
				["path", { "d": "M8 2v4" }],
				["path", { "d": "M17 14h-6" }],
				["path", { "d": "M13 18H7" }],
				["path", { "d": "M7 14h.01" }],
				["path", { "d": "M17 18h.01" }]
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
//#region src/lib/components/ui/AgendaItemCard.svelte
function AgendaItemCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item, onclick } = $$props;
		const prioridadeCores = {
			URGENTE: "rgb(239 68 68)",
			ALTA: "rgb(245 158 11)",
			MEDIA: "rgb(59 130 246)",
			BAIXA: "rgb(148 163 184)"
		};
		const statusLabels = {
			PLANEJADO: "Planejado",
			CONFIRMADO: "Confirmado",
			REALIZADO: "Realizado",
			CANCELADO: "Cancelado"
		};
		const statusColors = {
			PLANEJADO: "bg-blue-50 text-blue-700",
			CONFIRMADO: "bg-emerald-50 text-emerald-700",
			REALIZADO: "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]",
			CANCELADO: "bg-red-50 text-red-600"
		};
		let horaInicio = derived(() => new Intl.DateTimeFormat("pt-BR", {
			hour: "2-digit",
			minute: "2-digit"
		}).format(new Date(item.dataHoraInicio)));
		let horaFim = derived(() => new Intl.DateTimeFormat("pt-BR", {
			hour: "2-digit",
			minute: "2-digit"
		}).format(new Date(item.dataHoraFim)));
		let duracaoPx = derived(() => {
			const diffMs = new Date(item.dataHoraFim).getTime() - new Date(item.dataHoraInicio).getTime();
			const minutos = Math.max(1, diffMs / 6e4);
			return Math.max(minutos * 2, 75);
		});
		$$renderer.push(`<div class="group relative z-10 shrink-0 rounded-lg bg-white border border-[rgb(var(--slate-200))] p-3 cursor-pointer will-change-transform transition-all duration-200 ease-out hover:-translate-y-[1px] shadow-sm hover:shadow-md hover:z-20 active:scale-[0.98] overflow-hidden"${attr_style(`border-left: 3px solid ${stringify(prioridadeCores[item.prioridade])}; height: ${stringify(duracaoPx())}px;`)}><div class="flex items-start justify-between gap-2"><div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-[rgb(var(--slate-800))] truncate">${escape_html(item.profissional?.nome ?? "Profissional")}</p> `);
		if (item.profissional?.especialidade) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-[10px] uppercase tracking-wider text-[rgb(var(--slate-400))] font-medium mt-0.5">${escape_html(item.profissional.especialidade.nome)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <span${attr_class(`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${stringify(statusColors[item.status])}`)}>${escape_html(statusLabels[item.status])}</span></div> <div class="mt-2 flex items-center gap-1.5 text-[11px] text-[rgb(var(--slate-500))]">`);
		Clock($$renderer, { class: "h-3 w-3 text-[rgb(var(--slate-400))]" });
		$$renderer.push(`<!----> <span class="font-medium">${escape_html(horaInicio())} – ${escape_html(horaFim())}</span></div> `);
		if (item.observacoes) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mt-1.5 text-[11px] text-[rgb(var(--slate-400))] truncate">${escape_html(item.observacoes)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/ui/CalendarioSemanal.svelte
function CalendarioSemanal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items, currentDate, onNavigate, onItemClick, onSlotClick } = $$props;
		function getLocalISODate(d) {
			return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		}
		const HORA_INICIO = 7;
		const SLOT_HORAS = Array.from({ length: 19 - HORA_INICIO }, (_, i) => HORA_INICIO + i);
		let agora = /* @__PURE__ */ new Date();
		let timerInterval;
		onDestroy(() => {
			clearInterval(timerInterval);
		});
		function getInicioSemana(d) {
			const result = new Date(d);
			const day = result.getDay();
			const diff = day === 0 ? -6 : 1 - day;
			result.setDate(result.getDate() + diff);
			result.setHours(0, 0, 0, 0);
			return result;
		}
		let inicioSemana = derived(() => getInicioSemana(currentDate));
		let diasSemana = derived(() => Array.from({ length: 7 }, (_, i) => {
			const d = new Date(inicioSemana());
			d.setDate(d.getDate() + i);
			return d;
		}));
		let itemsPorDia = derived(() => {
			const map = /* @__PURE__ */ new Map();
			for (const d of diasSemana()) {
				const key = getLocalISODate(d);
				map.set(key, []);
			}
			for (const item of items) {
				const key = getLocalISODate(new Date(item.dataHoraInicio));
				if (map.has(key)) map.get(key).push(item);
			}
			return map;
		});
		function isHoje(d) {
			const hoje = /* @__PURE__ */ new Date();
			return d.toISOString().slice(0, 10) === hoje.toISOString().slice(0, 10);
		}
		const dayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
		const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" });
		function formatMonth(d) {
			const str = new Intl.DateTimeFormat("pt-BR", {
				month: "long",
				year: "numeric"
			}).format(d);
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
		function getItemsParaHora(dia, hora) {
			const key = getLocalISODate(dia);
			return (itemsPorDia().get(key) ?? []).filter((item) => {
				return new Date(item.dataHoraInicio).getHours() === hora;
			});
		}
		function getCurrentTimePosition(hora) {
			const h = agora.getHours();
			const m = agora.getMinutes();
			if (h !== hora) return null;
			return m / 60 * 100;
		}
		$$renderer.push(`<div class="flex flex-col h-full"><div class="flex items-center justify-between px-1 mb-4"><button type="button" class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer" aria-label="Semana anterior">`);
		Chevron_left($$renderer, { class: "h-5 w-5" });
		$$renderer.push(`<!----></button> <h3 class="text-lg font-bold text-[rgb(var(--slate-800))]">${escape_html(formatMonth(currentDate))}</h3> <button type="button" class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer" aria-label="Próxima semana">`);
		Chevron_right($$renderer, { class: "h-5 w-5" });
		$$renderer.push(`<!----></button></div> <div class="flex-1 overflow-auto"><div class="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] min-w-[720px]"><div class="sticky top-0 z-10 bg-white border-b border-[rgb(var(--slate-100))]"></div> <!--[-->`);
		const each_array = ensure_array_like(diasSemana());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let dia = each_array[$$index];
			$$renderer.push(`<div class="sticky top-0 z-10 bg-white border-b border-[rgb(var(--slate-100))] text-center py-2.5 px-1"><p${attr_class(`text-[10px] uppercase tracking-wider font-semibold ${stringify(isHoje(dia) ? "text-blue-600 font-bold" : "text-[rgb(var(--slate-400))]")}`)}>${escape_html(dayFormatter.format(dia))}</p> <div class="flex items-center justify-center mt-1">`);
			if (isHoje(dia)) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">${escape_html(dateFormatter.format(dia))}</span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="text-sm font-bold text-[rgb(var(--slate-700))]">${escape_html(dateFormatter.format(dia))}</span>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(SLOT_HORAS);
		for (let $$index_3 = 0, $$length = each_array_1.length; $$index_3 < $$length; $$index_3++) {
			let hora = each_array_1[$$index_3];
			$$renderer.push(`<div class="relative border-r border-[rgb(var(--slate-100))] pr-3 text-right" style="height: 120px;"><span class="absolute top-1 right-3 text-[11px] font-medium text-[rgb(var(--slate-400))] tabular-nums">${escape_html(String(hora).padStart(2, "0"))}:00</span></div> <!--[-->`);
			const each_array_2 = ensure_array_like(diasSemana());
			for (let diaIdx = 0, $$length = each_array_2.length; diaIdx < $$length; diaIdx++) {
				let dia = each_array_2[diaIdx];
				$$renderer.push(`<div${attr_class(`relative border-b border-r border-[rgb(var(--slate-100))] p-1 flex flex-col gap-1 transition-colors duration-150 cursor-pointer ${stringify(isHoje(dia) ? "bg-blue-50/30" : "")} hover:bg-blue-50/50 hover:z-10`)} style="height: 120px;">`);
				if (isHoje(dia)) {
					$$renderer.push("<!--[0-->");
					const pos = getCurrentTimePosition(hora);
					if (pos !== null) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="absolute left-0 right-0 z-20 pointer-events-none"${attr_style(`top: ${stringify(pos)}%;`)}><div class="relative flex items-center"><div class="absolute -left-[5px] w-[10px] h-[10px] rounded-full bg-red-500 shadow-sm"></div> <div class="w-full h-[2px] bg-red-500/80"></div></div></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <!--[-->`);
				const each_array_3 = ensure_array_like(getItemsParaHora(dia, hora));
				for (let $$index_1 = 0, $$length = each_array_3.length; $$index_1 < $$length; $$index_1++) {
					let item = each_array_3[$$index_1];
					AgendaItemCard($$renderer, {
						item,
						onclick: () => onItemClick(item)
					});
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
//#region src/lib/components/ui/CalendarioMensal.svelte
function CalendarioMensal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items, currentDate, onNavigate, onDayClick } = $$props;
		function getLocalISODate(d) {
			return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		}
		let ano = derived(() => currentDate.getFullYear());
		let mes = derived(() => currentDate.getMonth());
		let primeiroDia = derived(() => new Date(ano(), mes(), 1));
		let ultimoDia = derived(() => new Date(ano(), mes() + 1, 0));
		let diasGrid = derived(() => () => {
			const dias = [];
			let startDow = primeiroDia().getDay();
			startDow = startDow === 0 ? 6 : startDow - 1;
			for (let i = 0; i < startDow; i++) dias.push(null);
			for (let d = 1; d <= ultimoDia().getDate(); d++) dias.push(new Date(ano(), mes(), d));
			while (dias.length % 7 !== 0) dias.push(null);
			return dias;
		});
		let contagemPorDia = derived(() => {
			const map = /* @__PURE__ */ new Map();
			for (const item of items) {
				const key = getLocalISODate(new Date(item.dataHoraInicio));
				map.set(key, (map.get(key) ?? 0) + 1);
			}
			return map;
		});
		function isHoje(d) {
			const hoje = /* @__PURE__ */ new Date();
			return d.toISOString().slice(0, 10) === hoje.toISOString().slice(0, 10);
		}
		function formatMonth(d) {
			const str = new Intl.DateTimeFormat("pt-BR", {
				month: "long",
				year: "numeric"
			}).format(d);
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
		const diasHeader = [
			"Seg",
			"Ter",
			"Qua",
			"Qui",
			"Sex",
			"Sáb",
			"Dom"
		];
		$$renderer.push(`<div class="flex flex-col"><div class="flex items-center justify-between mb-4"><button type="button" class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer" aria-label="Mês anterior">`);
		Chevron_left($$renderer, { class: "h-5 w-5" });
		$$renderer.push(`<!----></button> <h3 class="text-lg font-bold text-[rgb(var(--slate-800))]">${escape_html(formatMonth(currentDate))}</h3> <button type="button" class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer" aria-label="Próximo mês">`);
		Chevron_right($$renderer, { class: "h-5 w-5" });
		$$renderer.push(`<!----></button></div> <div class="grid grid-cols-7 gap-px mb-1"><!--[-->`);
		const each_array = ensure_array_like(diasHeader);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let d = each_array[$$index];
			$$renderer.push(`<div class="text-center text-[10px] uppercase tracking-wider font-semibold text-[rgb(var(--slate-400))] py-1">${escape_html(d)}</div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="grid grid-cols-7 gap-px"><!--[-->`);
		const each_array_1 = ensure_array_like(diasGrid()());
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let dia = each_array_1[$$index_1];
			if (dia) {
				$$renderer.push("<!--[0-->");
				const key = getLocalISODate(dia);
				const count = contagemPorDia().get(key) ?? 0;
				$$renderer.push(`<button type="button"${attr_class(`relative h-16 rounded-lg text-center p-1 transition-all duration-150 cursor-pointer ${stringify(isHoje(dia) ? "bg-blue-50 border-2 border-blue-300" : "bg-white border border-[rgb(var(--slate-100))] hover:bg-[rgb(var(--slate-50))] hover:border-[rgb(var(--slate-200))]")}`)}><span${attr_class(`text-xs font-semibold ${stringify(isHoje(dia) ? "text-blue-700" : "text-[rgb(var(--slate-700))]")}`)}>${escape_html(dia.getDate())}</span> `);
				if (count > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5"><span class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-100 px-1 text-[9px] font-bold text-blue-700">${escape_html(count)}</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></button>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="h-16"></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/lib/components/ui/PainelSugestoes.svelte
function PainelSugestoes($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { sugestoes, onAgendar, loading = false } = $$props;
		const potencialLabels = {
			ESTRATEGICO: "Estratégico",
			ALTO: "Alto",
			MEDIO: "Médio",
			BAIXO: "Baixo"
		};
		const potencialColors = {
			ESTRATEGICO: "bg-violet-50 text-violet-700 ring-1 ring-violet-300",
			ALTO: "bg-amber-50 text-amber-700 ring-1 ring-amber-300",
			MEDIO: "bg-blue-50 text-blue-700 ring-1 ring-blue-300",
			BAIXO: "bg-[rgb(var(--slate-50))] text-[rgb(var(--slate-600))] ring-1 ring-slate-200"
		};
		function formatDias(dias) {
			if (dias === null) return "Nunca visitado";
			if (dias === 0) return "Hoje";
			if (dias === 1) return "1 dia";
			return `${dias} dias`;
		}
		$$renderer.push(`<div class="flex flex-col h-full"><div class="flex items-center gap-2 mb-4"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">`);
		Trending_up($$renderer, { class: "h-4 w-4 text-blue-600" });
		$$renderer.push(`<!----></div> <div><h3 class="text-sm font-semibold text-[rgb(var(--slate-800))]">Sugestões</h3> <p class="text-[10px] text-[rgb(var(--slate-400))]">Quem você deve visitar</p></div></div> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex justify-center py-8"><div class="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div></div>`);
		} else if (sugestoes.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="text-center py-8"><p class="text-sm text-[rgb(var(--slate-400))]">Nenhuma sugestão disponível</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3 flex-1 overflow-y-auto"><!--[-->`);
			const each_array = ensure_array_like(sugestoes.slice(0, 10));
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let sug = each_array[$$index];
				$$renderer.push(`<div class="group bg-white border border-[rgb(var(--slate-200))] shadow-sm rounded-xl p-4 will-change-transform transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-md hover:border-[rgb(var(--slate-300))]"><div class="flex items-start justify-between gap-2"><div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-[rgb(var(--slate-700))] truncate group-hover:text-[rgb(var(--slate-900))] transition-colors">${escape_html(sug.profissional.nome)}</p> `);
				if (sug.profissional.especialidade) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-[10px] text-[rgb(var(--slate-400))] mt-0.5 truncate">${escape_html(sug.profissional.especialidade.nome)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-[rgb(var(--slate-50))] text-[10px] font-bold text-[rgb(var(--slate-600))]" title="Pontuação de prioridade">`);
				Trending_up($$renderer, { class: "h-2.5 w-2.5" });
				$$renderer.push(`<!----> ${escape_html(sug.pontuacao)}</div></div> <div class="mt-2 flex items-center gap-3"><span${attr_class(`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${stringify(potencialColors[sug.profissional.potencial])}`)}>${escape_html(potencialLabels[sug.profissional.potencial])}</span> <span class="flex items-center gap-1 text-[10px] text-[rgb(var(--slate-400))]">`);
				Clock($$renderer, { class: "h-2.5 w-2.5" });
				$$renderer.push(`<!----> ${escape_html(formatDias(sug.diasSemVisita))}</span></div> <button type="button" class="flex w-full items-center justify-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 mt-3 py-2 rounded-lg font-medium text-[12px] transition-colors duration-200 ease-out active:scale-[0.98] cursor-pointer">`);
				Calendar_plus($$renderer, { class: "h-3.5 w-3.5" });
				$$renderer.push(`<!----> Agendar Visita</button></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/routes/dashboard/agenda/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const VisitaSheetPromise = import("../../../../chunks/VisitaSheet2.js").then((m) => m.default);
		let { data } = $$props;
		let items = [];
		let sugestoes = [];
		let loading = true;
		let loadingSugestoes = false;
		let materiaisOptions = [];
		let currentDate = /* @__PURE__ */ new Date();
		let viewMode = "semanal";
		let sheetOpen = false;
		let selectedVisita = null;
		let agendarProfissionalId = "";
		let agendarProfissionalNome = "";
		let defaultDateStr = "";
		let defaultTimeStr = "";
		let showSugestoes = true;
		let dateRange = derived(() => () => {
			if (viewMode === "semanal") {
				const d = new Date(currentDate);
				const day = d.getDay();
				const diff = day === 0 ? -6 : 1 - day;
				const start = new Date(d);
				start.setDate(d.getDate() + diff);
				start.setHours(0, 0, 0, 0);
				const end = new Date(start);
				end.setDate(start.getDate() + 6);
				end.setHours(23, 59, 59, 999);
				return {
					start,
					end
				};
			} else return {
				start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
				end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
			};
		});
		async function loadItems() {
			loading = true;
			try {
				const range = dateRange()();
				const res = await apiFetch(`/visitas?${new URLSearchParams({
					dataInicio: range.start.toISOString(),
					dataFim: range.end.toISOString(),
					pageSize: "100"
				})}`, data.sessionToken);
				let newItems = [];
				if (res.ok) {
					const visitas = (await res.json()).data || [];
					for (const v of visitas) {
						const startDt = new Date(v.dataVisita);
						const endDt = new Date(startDt);
						endDt.setMinutes(startDt.getMinutes() + (v.duracaoMinutos || 30));
						let mapStatus = "REALIZADO";
						if (v.status === "AGENDADA") mapStatus = "CONFIRMADO";
						else if (v.status === "CANCELADA" || v.status === "NAO_REALIZADA") mapStatus = "CANCELADO";
						newItems.push({
							id: `v-${v.id}`,
							profissionalId: v.profissionalId,
							visitaId: v.id,
							dataHoraInicio: startDt.toISOString(),
							dataHoraFim: endDt.toISOString(),
							status: mapStatus,
							prioridade: "MEDIA",
							observacoes: v.resumo || v.objetivoVisita || null,
							profissional: {
								id: v.profissionalId,
								nome: v.profissional?.nome || "Profissional",
								especialidade: v.profissional?.especialidade || null
							},
							createdAt: v.createdAt,
							updatedAt: v.updatedAt,
							rawVisita: v
						});
					}
				}
				newItems.sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());
				items = newItems;
			} catch (e) {
				console.error("Erro ao carregar agenda:", e);
			} finally {
				loading = false;
			}
		}
		async function loadSugestoes() {
			loadingSugestoes = true;
			try {
				const range = dateRange()();
				const res = await apiFetch(`/agenda/sugestoes?${new URLSearchParams({
					dataInicio: range.start.toISOString(),
					dataFim: range.end.toISOString()
				})}`, data.sessionToken);
				if (res.ok) sugestoes = (await res.json()).data || [];
			} catch (e) {
				console.error("Erro ao carregar sugestões:", e);
			} finally {
				loadingSugestoes = false;
			}
		}
		function handleNavigate(newDate) {
			currentDate = newDate;
		}
		function handleItemClick(item) {
			selectedVisita = item.rawVisita || null;
			agendarProfissionalId = "";
			agendarProfissionalNome = "";
			sheetOpen = true;
		}
		function handleDayClick(date) {
			viewMode = "semanal";
			currentDate = date;
		}
		function handleAgendar(profissionalId) {
			const sug = sugestoes.find((s) => s.profissional.id === profissionalId);
			selectedVisita = null;
			agendarProfissionalId = profissionalId;
			agendarProfissionalNome = sug?.profissional.nome ?? "";
			defaultDateStr = "";
			defaultTimeStr = "";
			sheetOpen = true;
		}
		function handleSlotClick(date, hour) {
			defaultDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
			defaultTimeStr = `${String(hour).padStart(2, "0")}:00`;
			selectedVisita = null;
			agendarProfissionalId = "";
			agendarProfissionalNome = "";
			sheetOpen = true;
		}
		function handleVisitaDelete(id) {
			loadItems();
			loadSugestoes();
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1vajkwu", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Agenda | MediVisitas</title>`);
				});
				$$renderer.push(`<meta name="description" content="Agenda inteligente de visitas médicas"/>`);
			});
			$$renderer.push(`<div class="flex flex-col h-full overflow-hidden"><div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
			Calendar_days($$renderer, { class: "h-4.5 w-4.5 text-white" });
			$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Agenda</h1> <p class="text-[11px] text-[rgb(var(--slate-400))]">Planeje visitas e acompanhe compromissos</p></div></div> <div class="flex items-center gap-2"><div class="flex rounded-lg bg-[rgb(var(--slate-100))] p-0.5"><button type="button"${attr_class(`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${stringify(viewMode === "semanal" ? "bg-white text-[rgb(var(--slate-800))] shadow-sm" : "text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))]")}`)}${attr("aria-pressed", viewMode === "semanal")} aria-label="Visualizar por semana">`);
			Calendar_range($$renderer, { class: "h-3.5 w-3.5" });
			$$renderer.push(`<!----> Semana</button> <button type="button"${attr_class(`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${stringify(viewMode === "mensal" ? "bg-white text-[rgb(var(--slate-800))] shadow-sm" : "text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))]")}`)}${attr("aria-pressed", viewMode === "mensal")} aria-label="Visualizar por mês">`);
			Calendar_days($$renderer, { class: "h-3.5 w-3.5" });
			$$renderer.push(`<!----> Mês</button></div> <button type="button"${attr_class(`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${stringify("border-blue-200 bg-blue-50 text-blue-700")}`)}${attr("aria-pressed", showSugestoes)} aria-label="Mostrar sugestões de visitas">`);
			Sparkles($$renderer, { class: "h-3.5 w-3.5" });
			$$renderer.push(`<!----> Sugestões</button></div></div> <div class="flex flex-1 overflow-hidden"><div class="flex-1 overflow-auto p-4">`);
			if (loading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center justify-center h-64"><div class="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div></div>`);
			} else if (viewMode === "semanal") {
				$$renderer.push("<!--[1-->");
				CalendarioSemanal($$renderer, {
					items,
					currentDate,
					onNavigate: handleNavigate,
					onItemClick: handleItemClick,
					onSlotClick: handleSlotClick
				});
			} else {
				$$renderer.push("<!--[-1-->");
				CalendarioMensal($$renderer, {
					items,
					currentDate,
					onNavigate: handleNavigate,
					onDayClick: handleDayClick
				});
			}
			$$renderer.push(`<!--]--></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="hidden lg:block w-[300px] border-l border-[rgb(var(--slate-100))] bg-[rgb(var(--slate-50))]/50 p-4 overflow-y-auto">`);
			PainelSugestoes($$renderer, {
				sugestoes,
				loading: loadingSugestoes,
				onAgendar: handleAgendar
			});
			$$renderer.push(`<!----></div>`);
			$$renderer.push(`<!--]--></div></div> `);
			await_block($$renderer, VisitaSheetPromise, () => {}, (VisitaSheet) => {
				if (VisitaSheet) {
					$$renderer.push("<!--[-->");
					VisitaSheet($$renderer, {
						visita: selectedVisita,
						profissionalId: agendarProfissionalId,
						profissionalNome: agendarProfissionalNome,
						defaultDateTime: defaultDateStr && defaultTimeStr ? `${defaultDateStr}T${defaultTimeStr}` : void 0,
						sessionToken: data.sessionToken,
						materiaisOptions,
						onclose: () => sheetOpen = false,
						onsave: () => {
							loadItems();
							loadSugestoes();
						},
						ondelete: handleVisitaDelete,
						get open() {
							return sheetOpen;
						},
						set open($$value) {
							sheetOpen = $$value;
							$$settled = false;
						}
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			});
			$$renderer.push(`<!--]-->`);
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
export { _page as default };
