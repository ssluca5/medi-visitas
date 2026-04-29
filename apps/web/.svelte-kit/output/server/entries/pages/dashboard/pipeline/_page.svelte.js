import "../../../../chunks/index-server.js";
import { J as attr, X as escape_html, _ as stringify, a as await_block, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, r as attr_style, s as derived, u as head } from "../../../../chunks/dev.js";
import { n as toasts } from "../../../../chunks/toast.svelte.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Calendar_check } from "../../../../chunks/calendar-check.js";
import { t as Chart_column } from "../../../../chunks/chart-column.js";
import { t as Download } from "../../../../chunks/download.js";
import { t as Search } from "../../../../chunks/search.js";
import { t as Trending_up } from "../../../../chunks/trending-up.js";
import { t as Users } from "../../../../chunks/users.js";
import { t as X } from "../../../../chunks/x.js";
import { t as apiFetch } from "../../../../chunks/api.js";
import { t as Button } from "../../../../chunks/Button.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/grip-vertical.svelte
function Grip_vertical($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "grip-vertical" },
		sanitize_props($$props),
		{
			/**
			* @component @name GripVertical
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjUiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjE5IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iMTUiIGN5PSI1IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTkiIHI9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/grip-vertical
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["circle", {
					"cx": "9",
					"cy": "12",
					"r": "1"
				}],
				["circle", {
					"cx": "9",
					"cy": "5",
					"r": "1"
				}],
				["circle", {
					"cx": "9",
					"cy": "19",
					"r": "1"
				}],
				["circle", {
					"cx": "15",
					"cy": "12",
					"r": "1"
				}],
				["circle", {
					"cx": "15",
					"cy": "5",
					"r": "1"
				}],
				["circle", {
					"cx": "15",
					"cy": "19",
					"r": "1"
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/refresh-cw.svelte
function Refresh_cw($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "refresh-cw" },
		sanitize_props($$props),
		{
			/**
			* @component @name RefreshCw
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
				["path", { "d": "M21 3v5h-5" }],
				["path", { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
				["path", { "d": "M8 16H3v5" }]
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
//#region src/lib/components/pipeline/CardMetrica.svelte
function CardMetrica($$renderer, $$props) {
	let { titulo, valor, subtitulo, icone: Icon, corIcone, corFundo, variacao } = $$props;
	$$renderer.push(`<div class="card-surface flex flex-col items-center justify-center text-center p-6 h-full min-h-[120px]"><div class="flex items-center gap-2"><div${attr_class(`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stringify(corFundo)}`)}>`);
	if (Icon) {
		$$renderer.push("<!--[-->");
		Icon($$renderer, { class: `h-4 w-4 ${stringify(corIcone)}` });
		$$renderer.push("<!--]-->");
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push("<!--]-->");
	}
	$$renderer.push(`</div> <p class="text-sm font-bold text-[rgb(var(--slate-500))] uppercase tracking-wider">${escape_html(titulo)}</p></div> <div class="flex items-center gap-2 mt-2"><p class="text-3xl font-bold text-[rgb(var(--slate-800))]">${escape_html(valor)}</p> `);
	if (variacao !== void 0) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span${attr_class(`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${stringify(variacao >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}`)}>${escape_html(variacao >= 0 ? "+" : "")}${escape_html(variacao)}%</span>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div> `);
	if (subtitulo) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-[11px] text-[rgb(var(--slate-400))] mt-1.5">${escape_html(subtitulo)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/components/pipeline/FunilPipeline.svelte
function FunilPipeline($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { totaisPorEstagio } = $$props;
		const ETAPAS = [
			{
				key: "PROSPECTADO",
				label: "Prospectado",
				cssVar: "--pipeline-prospectado"
			},
			{
				key: "VISITADO",
				label: "Visitado",
				cssVar: "--pipeline-visitado"
			},
			{
				key: "INTERESSADO",
				label: "Interessado",
				cssVar: "--pipeline-interessado"
			},
			{
				key: "PRESCRITOR",
				label: "Prescritor",
				cssVar: "--pipeline-prescritor"
			},
			{
				key: "FIDELIZADO",
				label: "Fidelizado",
				cssVar: "--pipeline-fidelizado"
			}
		];
		const total = derived(() => totaisPorEstagio ? Object.values(totaisPorEstagio).reduce((a, b) => a + b, 0) : 0);
		$$renderer.push(`<div class="card-surface p-5"><h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Funil de Conversão</h3> <div class="grid grid-cols-5 gap-4"><!--[-->`);
		const each_array = ensure_array_like(ETAPAS);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let etapa = each_array[$$index];
			const count = totaisPorEstagio?.[etapa.key] ?? 0;
			const pct = total() > 0 ? Math.round(count / total() * 100) : 0;
			$$renderer.push(`<div class="flex flex-col items-center gap-2"><span class="text-[11px] font-medium text-[rgb(var(--slate-500))] truncate w-full text-center">${escape_html(etapa.label)}</span> <span class="text-2xl font-bold text-[rgb(var(--slate-800))]">${escape_html(pct)}%</span> <span class="text-[11px] text-[rgb(var(--slate-400))]">${escape_html(count)} prof.</span> <div class="w-full h-2 bg-[rgb(var(--slate-100))] rounded-full overflow-hidden"><div class="h-full rounded-full transition-[width] duration-500 ease-out"${attr_style(`width: ${stringify(pct)}%; background-color: var(${stringify(etapa.cssVar)})`)}></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/lib/components/pipeline/KanbanPipeline.svelte
function KanbanPipeline($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { pipeline, busca, onBuscaChange, onMove } = $$props;
		const COLUNAS = [
			{
				key: "PROSPECTADO",
				label: "Prospectado",
				cssVar: "--pipeline-prospectado"
			},
			{
				key: "VISITADO",
				label: "Visitado",
				cssVar: "--pipeline-visitado"
			},
			{
				key: "INTERESSADO",
				label: "Interessado",
				cssVar: "--pipeline-interessado"
			},
			{
				key: "PRESCRITOR",
				label: "Prescritor",
				cssVar: "--pipeline-prescritor"
			},
			{
				key: "FIDELIZADO",
				label: "Fidelizado",
				cssVar: "--pipeline-fidelizado"
			}
		];
		function potencialBadge(potencial) {
			switch (potencial) {
				case "ALTO": return "bg-emerald-100 text-emerald-800";
				case "MEDIO": return "bg-amber-100 text-amber-800";
				case "BAIXO": return "bg-orange-100 text-orange-800";
				case "ESTRATEGICO": return "bg-indigo-100 text-indigo-800";
				default: return "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-500))]";
			}
		}
		let dragProfId = null;
		let dropTarget = null;
		$$renderer.push(`<div class="mb-4"><div class="relative">`);
		Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate-400))]" });
		$$renderer.push(`<!----> <input type="text" placeholder="Buscar por nome ou CRM..."${attr("value", busca)} class="w-full pl-10 pr-8 h-9 rounded-lg border border-[rgb(var(--slate-200))] bg-white text-sm text-[rgb(var(--slate-700))] placeholder:text-[rgb(var(--slate-400))] focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"/> `);
		if (busca) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded hover:bg-[rgb(var(--slate-100))]">`);
			X($$renderer, { class: "h-3.5 w-3.5 text-[rgb(var(--slate-400))]" });
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="flex gap-3 h-[calc(100vh-350px)] min-h-[400px] overflow-x-auto"><!--[-->`);
		const each_array = ensure_array_like(COLUNAS);
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let col = each_array[$$index_1];
			const profissionais = pipeline?.data[col.key] ?? [];
			const total = pipeline?.totaisPorEstagio[col.key] ?? 0;
			$$renderer.push(`<div${attr_class(`flex-1 min-w-[160px] flex flex-col rounded-xl ${stringify(dropTarget === col.key ? "bg-blue-50/60 ring-2 ring-blue-300 ring-inset" : "")}`)}${attr("data-col", col.key)} role="region"><div class="h-10 flex items-center justify-between px-3 mb-2 flex-shrink-0"><div class="flex items-center gap-2"><div class="h-2.5 w-2.5 rounded-full flex-shrink-0"${attr_style(`background-color: var(${stringify(col.cssVar)})`)}></div> <span class="text-[12px] font-semibold text-[rgb(var(--slate-700))]">${escape_html(col.label)}</span> <span class="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-500))]">${escape_html(total)}</span></div></div> `);
			if (profissionais.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(`flex items-center justify-center h-[84px] rounded-lg border border-dashed border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))]/50 mx-0.5 ${stringify(dropTarget === col.key ? "border-blue-300 bg-blue-50/40" : "")}`)}><p class="text-[11px] text-[rgb(var(--slate-400))]">${escape_html(dropTarget === col.key ? "Solte aqui" : "Nenhum profissional")}</p></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5"><!--[-->`);
				const each_array_1 = ensure_array_like(profissionais);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let prof = each_array_1[$$index];
					const isDragging = dragProfId === prof.id;
					$$renderer.push(`<div role="button" tabindex="0" draggable="true"${attr_class(`text-left w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white hover:border-[rgb(var(--slate-300))] px-3 py-2.5 min-h-[80px] flex flex-col justify-between cursor-grab select-none will-change-transform transition-all duration-200 hover:shadow-sm ${stringify(isDragging ? "opacity-40 scale-95" : "")}`)}><div class="flex items-start gap-1.5">`);
					Grip_vertical($$renderer, { class: "h-3.5 w-3.5 text-[rgb(var(--slate-300))] mt-0.5 shrink-0" });
					$$renderer.push(`<!----> <p class="text-[13px] font-medium text-[rgb(var(--slate-800))] leading-snug min-w-0 flex-1">${escape_html(prof.nome)}</p></div> <div class="flex items-center justify-between mt-2 gap-1 pl-5"><p class="text-[10px] text-[rgb(var(--slate-400))] truncate flex-1">${escape_html(prof.especialidade?.nome ?? "—")}</p> <span${attr_class(`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${stringify(potencialBadge(prof.potencial))}`)}>${escape_html(prof.potencial)}</span></div> <p class="text-[10px] text-[rgb(var(--slate-400))] mt-1 pl-5">CRM ${escape_html(prof.crm ?? "—")}</p></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/routes/dashboard/pipeline/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const GraficoVisitasPromise = import("../../../../chunks/GraficoVisitas.js").then((m) => m.default);
		const GraficoConversaoPromise = import("../../../../chunks/GraficoConversao.js").then((m) => m.default);
		let { data } = $$props;
		let pipeline = null;
		let metricas = null;
		let evolucao = [];
		let visitasPeriodo = [];
		let loading = true;
		let erro = null;
		let busca = "";
		let granularidade = "semana";
		const hoje = /* @__PURE__ */ new Date();
		let dataInicio = (/* @__PURE__ */ new Date(hoje.getTime() - 720 * 60 * 60 * 1e3)).toISOString().split("T")[0];
		let dataFim = hoje.toISOString().split("T")[0];
		let pipelineFiltrado = derived(() => {
			if (!pipeline) return null;
			if (!busca.trim()) return pipeline;
			const termo = busca.toLowerCase();
			const filtrado = {
				PROSPECTADO: [],
				VISITADO: [],
				INTERESSADO: [],
				PRESCRITOR: [],
				FIDELIZADO: []
			};
			const totais = {
				PROSPECTADO: 0,
				VISITADO: 0,
				INTERESSADO: 0,
				PRESCRITOR: 0,
				FIDELIZADO: 0
			};
			for (const key of Object.keys(pipeline.data)) {
				filtrado[key] = pipeline.data[key].filter((p) => p.nome.toLowerCase().includes(termo) || p.crm && p.crm.toLowerCase().includes(termo));
				totais[key] = filtrado[key].length;
			}
			return {
				data: filtrado,
				totaisPorEstagio: totais,
				totalGeral: Object.values(totais).reduce((a, b) => a + b, 0)
			};
		});
		async function carregarDados() {
			loading = true;
			erro = null;
			try {
				const qs = `dataInicio=${dataInicio}&dataFim=${dataFim}`;
				const [pipelineRes, metricasRes] = await Promise.all([apiFetch("/pipeline", data.sessionToken), apiFetch(`/pipeline/metricas?${qs}`, data.sessionToken)]);
				if (pipelineRes.ok) pipeline = await pipelineRes.json();
				if (metricasRes.ok) metricas = await metricasRes.json();
				if (!pipelineRes.ok || !metricasRes.ok) erro = "Erro ao carregar alguns dados do pipeline";
				loading = false;
				const [evolucaoRes, visitasRes] = await Promise.all([apiFetch(`/pipeline/evolucao?${qs}&granularidade=${granularidade}`, data.sessionToken), apiFetch(`/pipeline/visitas-por-periodo?${qs}&granularidade=${granularidade}`, data.sessionToken)]);
				if (evolucaoRes.ok) evolucao = (await evolucaoRes.json()).data ?? [];
				if (visitasRes.ok) visitasPeriodo = (await visitasRes.json()).data ?? [];
			} catch (e) {
				erro = "Erro ao conectar com o servidor";
				console.error(e);
				loading = false;
			}
		}
		async function exportarCSV() {
			try {
				const res = await apiFetch("/pipeline/exportar", data.sessionToken);
				if (res.ok) {
					const blob = await res.blob();
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = `pipeline-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
					a.click();
					URL.revokeObjectURL(url);
				}
			} catch (e) {
				console.error("Erro ao exportar:", e);
			}
		}
		async function moverProfissional(profId, origem, destino) {
			if (!pipeline) return;
			const prof = pipeline.data[origem].find((p) => p.id === profId);
			if (!prof) return;
			pipeline.data[origem] = pipeline.data[origem].filter((p) => p.id !== profId);
			pipeline.data[destino] = [...pipeline.data[destino], {
				...prof,
				estagioPipeline: destino
			}];
			pipeline.totaisPorEstagio[origem] = pipeline.data[origem].length;
			pipeline.totaisPorEstagio[destino] = pipeline.data[destino].length;
			try {
				const res = await apiFetch(`/profissionais/${profId}/estagio`, data.sessionToken, {
					method: "PATCH",
					body: JSON.stringify({ estagioNovo: destino })
				});
				if (res.ok) toasts.show("success", `${prof.nome} movido para ${destino.toLowerCase()}`);
				else {
					pipeline.data[destino] = pipeline.data[destino].filter((p) => p.id !== profId);
					pipeline.data[origem] = [...pipeline.data[origem], prof];
					pipeline.totaisPorEstagio[origem] = pipeline.data[origem].length;
					pipeline.totaisPorEstagio[destino] = pipeline.data[destino].length;
					const err = await res.json().catch(() => null);
					toasts.show("error", err?.error || "Erro ao mover profissional");
				}
			} catch (e) {
				pipeline.data[destino] = pipeline.data[destino].filter((p) => p.id !== profId);
				pipeline.data[origem] = [...pipeline.data[origem], prof];
				pipeline.totaisPorEstagio[origem] = pipeline.data[origem].length;
				pipeline.totaisPorEstagio[destino] = pipeline.data[destino].length;
				toasts.show("error", "Erro ao conectar com o servidor");
			}
		}
		head("4u8lvo", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Pipeline — MediVisitas</title>`);
			});
		});
		$$renderer.push(`<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
		Chart_column($$renderer, { class: "h-4.5 w-4.5 text-white" });
		$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Pipeline</h1> <p class="text-[11px] text-[rgb(var(--slate-400))]">Funil de conversão e analytics</p></div></div> <div class="flex items-center gap-2">`);
		Button($$renderer, {
			variant: "outline",
			size: "sm",
			onclick: carregarDados,
			children: ($$renderer) => {
				Refresh_cw($$renderer, { class: "h-3.5 w-3.5 mr-1.5" });
				$$renderer.push(`<!----> Atualizar`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			variant: "outline",
			size: "sm",
			onclick: exportarCSV,
			children: ($$renderer) => {
				Download($$renderer, { class: "h-3.5 w-3.5 mr-1.5" });
				$$renderer.push(`<!----> Exportar CSV`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> <div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-4 mb-6" role="search" aria-label="Filtros de período do pipeline"><div class="flex flex-wrap items-end gap-3"><div class="min-w-[160px]"><label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="dataInicioPipeline">Data início</label> <input id="dataInicioPipeline" type="date"${attr("value", dataInicio)} class="block w-full rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50"/></div> <div class="min-w-[160px]"><label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="dataFimPipeline">Data fim</label> <input id="dataFimPipeline" type="date"${attr("value", dataFim)} class="block w-full rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50"/></div> <div><div class="h-[18px] mb-1.5"></div> <div class="flex items-center rounded-lg bg-[rgb(var(--slate-100))] p-0.5"><button${attr("aria-pressed", granularidade === "semana")} aria-label="Visualizar por semana"${attr_class(`px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${stringify(granularidade === "semana" ? "bg-white text-[rgb(var(--slate-800))] shadow-sm" : "text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))]")}`)}>Semana</button> <button${attr("aria-pressed", granularidade === "mes")} aria-label="Visualizar por mês"${attr_class(`px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${stringify(granularidade === "mes" ? "bg-white text-[rgb(var(--slate-800))] shadow-sm" : "text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))]")}`)}>Mês</button></div></div></div></div> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center justify-center h-64" role="status" aria-live="polite">`);
			Refresh_cw($$renderer, {
				class: "h-6 w-6 text-[rgb(var(--slate-400))] animate-spin",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <span class="sr-only">Carregando dados do pipeline...</span></div>`);
		} else if (erro) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="card-surface p-8 text-center"><p class="text-sm text-red-500 font-medium">${escape_html(erro)}</p> `);
			Button($$renderer, {
				variant: "outline",
				size: "sm",
				class: "mt-3",
				onclick: carregarDados,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Tentar novamente`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 items-stretch"><div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
			CardMetrica($$renderer, {
				titulo: "Total Profissionais",
				valor: metricas?.totalProfissionais ?? 0,
				icone: Users,
				corIcone: "text-blue-600",
				corFundo: "bg-blue-50"
			});
			$$renderer.push(`<!----></div> <div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
			CardMetrica($$renderer, {
				titulo: "Visitas Realizadas",
				valor: metricas?.visitasRealizadas ?? 0,
				subtitulo: `${stringify(metricas?.visitasPlanejadas ?? 0)} planejadas no período`,
				icone: Calendar_check,
				corIcone: "text-violet-600",
				corFundo: "bg-violet-50"
			});
			$$renderer.push(`<!----></div> <div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
			CardMetrica($$renderer, {
				titulo: "Média/Semana",
				valor: metricas?.mediaVisitasPorSemana ?? 0,
				icone: Trending_up,
				corIcone: "text-emerald-600",
				corFundo: "bg-emerald-50"
			});
			$$renderer.push(`<!----></div> <div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
			CardMetrica($$renderer, {
				titulo: "Sem Visita (30d)",
				valor: metricas?.profissionaisSemVisitaUltimos30Dias ?? 0,
				icone: Users,
				corIcone: "text-amber-600",
				corFundo: "bg-amber-50"
			});
			$$renderer.push(`<!----></div></div> <div class="mb-6">`);
			FunilPipeline($$renderer, { totaisPorEstagio: pipeline?.totaisPorEstagio ?? null });
			$$renderer.push(`<!----></div> <div class="w-full mb-6">`);
			KanbanPipeline($$renderer, {
				pipeline: pipelineFiltrado(),
				busca,
				onBuscaChange: (v) => busca = v,
				onMove: moverProfissional
			});
			$$renderer.push(`<!----></div> <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6 mt-10">`);
			await_block($$renderer, GraficoVisitasPromise, () => {}, (GraficoVisitas) => {
				if (GraficoVisitas) {
					$$renderer.push("<!--[-->");
					GraficoVisitas($$renderer, { dados: visitasPeriodo });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			});
			$$renderer.push(`<!--]--> `);
			await_block($$renderer, GraficoConversaoPromise, () => {}, (GraficoConversao) => {
				if (GraficoConversao) {
					$$renderer.push("<!--[-->");
					GraficoConversao($$renderer, {
						dados: evolucao,
						granularidade
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			});
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
