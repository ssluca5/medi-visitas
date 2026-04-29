import { J as attr, X as escape_html, _ as stringify, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, r as attr_style, s as derived, u as head } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Arrow_right } from "../../../chunks/arrow-right.js";
import { t as Calendar_check } from "../../../chunks/calendar-check.js";
import { t as Calendar_days } from "../../../chunks/calendar-days.js";
import { t as Calendar } from "../../../chunks/calendar.js";
import { t as Chart_column } from "../../../chunks/chart-column.js";
import { t as Circle_alert } from "../../../chunks/circle-alert.js";
import { t as Clock } from "../../../chunks/clock.js";
import { t as Info } from "../../../chunks/info.js";
import { t as Loader_circle } from "../../../chunks/loader-circle.js";
import { t as Search } from "../../../chunks/search.js";
import { t as Sparkles } from "../../../chunks/sparkles.js";
import { t as Stethoscope } from "../../../chunks/stethoscope.js";
import { t as Trending_up } from "../../../chunks/trending-up.js";
import { t as Triangle_alert } from "../../../chunks/triangle-alert.js";
import { t as Users } from "../../../chunks/users.js";
import { t as X } from "../../../chunks/x.js";
import { t as CardResumo } from "../../../chunks/CardResumo.js";
import { t as StatusVisitaBadge } from "../../../chunks/StatusVisitaBadge.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/check.svelte
function Check($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "check" },
		sanitize_props($$props),
		{
			/**
			* @component @name Check
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M20 6 9 17l-5-5" }]],
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
//#region src/lib/components/dashboard/PainelAlertas.svelte
function PainelAlertas($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { alertas } = $$props;
		const severidadeConfig = {
			info: {
				icon: Info,
				borderClass: "border-l-blue-400",
				iconClass: "text-blue-500"
			},
			warning: {
				icon: Triangle_alert,
				borderClass: "border-l-amber-400",
				iconClass: "text-amber-500"
			},
			danger: {
				icon: Circle_alert,
				borderClass: "border-l-red-400",
				iconClass: "text-red-500"
			}
		};
		$$renderer.push(`<div class="card-surface p-5 h-full"><h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Alertas</h3> `);
		if (alertas.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-8"><p class="text-sm text-[rgb(var(--slate-400))]">Nenhum alerta no momento</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-2"><!--[-->`);
			const each_array = ensure_array_like(alertas);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let alerta = each_array[$$index];
				const config = severidadeConfig[alerta.severidade] ?? severidadeConfig.info;
				const Icon = config.icon;
				$$renderer.push(`<a${attr("href", `/dashboard/profissionais/${stringify(alerta.profissionalId)}`)}${attr_class(`flex items-start gap-3 p-3 rounded-lg border-l-3 ${stringify(config.borderClass)} bg-[rgb(var(--slate-50))]/50 hover:bg-[rgb(var(--slate-50))] will-change-transform transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm`)}>`);
				if (Icon) {
					$$renderer.push("<!--[-->");
					Icon($$renderer, { class: `h-4 w-4 ${stringify(config.iconClass)} mt-0.5 shrink-0` });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` <div class="min-w-0 flex-1"><p class="text-[13px] font-medium text-[rgb(var(--slate-700))] leading-snug">${escape_html(alerta.mensagem)}</p> <p class="text-[11px] text-[rgb(var(--slate-400))] mt-0.5">${escape_html(alerta.profissionalNome)}</p></div></a>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/dashboard/ListaProximasVisitas.svelte
function ListaProximasVisitas($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { agendamentos } = $$props;
		function formatHora(iso) {
			return new Intl.DateTimeFormat("pt-BR", {
				hour: "2-digit",
				minute: "2-digit"
			}).format(new Date(iso));
		}
		function formatData(iso) {
			return new Intl.DateTimeFormat("pt-BR", {
				day: "2-digit",
				month: "short"
			}).format(new Date(iso));
		}
		const prioridadeBadge = {
			URGENTE: "bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
			ALTA: "bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
			MEDIA: "bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
			BAIXA: "bg-[rgb(var(--slate-50))] text-[rgb(var(--slate-400))] px-2 py-0.5 rounded text-[10px] font-bold ml-2"
		};
		$$renderer.push(`<div class="card-surface p-5 h-full"><h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Próximos Agendamentos</h3> `);
		if (agendamentos.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-8"><p class="text-sm text-[rgb(var(--slate-400))]">Nenhum agendamento futuro</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-2.5"><!--[-->`);
			const each_array = ensure_array_like(agendamentos);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let ag = each_array[$$index];
				$$renderer.push(`<div class="flex items-center gap-3 p-3 rounded-lg hover:bg-[rgb(var(--slate-50))] transition-all duration-200 group"><div class="flex-shrink-0 w-12 text-center"><span class="text-[13px] font-bold text-violet-600">${escape_html(formatHora(ag.dataHoraInicio))}</span> <span class="block text-[10px] text-[rgb(var(--slate-400))] mt-0.5">${escape_html(formatData(ag.dataHoraInicio))}</span></div> <div class="min-w-0 border-l border-[rgb(var(--slate-100))] pl-3 flex-1"><p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate group-hover:text-blue-600 transition-colors">${escape_html(ag.profissional?.nome ?? "Sem profissional")}</p> <p class="text-[11px] text-[rgb(var(--slate-400))] truncate">${escape_html(ag.profissional?.especialidade?.nome ?? "")} `);
				if (ag.prioridade) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(prioridadeBadge[ag.prioridade] ?? prioridadeBadge.BAIXA)}>${escape_html(ag.prioridade)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div> `);
				Clock($$renderer, { class: "h-3.5 w-3.5 text-[rgb(var(--slate-300))] shrink-0" });
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/ui/TourPrimeiroAcesso.svelte
function TourPrimeiroAcesso($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { sessionToken, onclose } = $$props;
		let currentStep = 0;
		const steps = [
			{
				icon: Sparkles,
				title: "Bem-vindo ao MediVisitas!",
				desc: "Vamos conhecer as principais funcionalidades em alguns passos rápidos.",
				color: "#2563eb",
				destaque: "data-tour-dashboard"
			},
			{
				icon: Users,
				title: "Gerencie Profissionais",
				desc: "Cadastre médicos e profissionais de saúde. Acompanhe potencial de prescrição.",
				color: "#059669",
				destaque: "data-tour-profissionais"
			},
			{
				icon: Calendar,
				title: "Agenda Inteligente",
				desc: "Planeje visitas com calendário interativo. Arraste e solte para reagendar.",
				color: "#7c3aed",
				destaque: "data-tour-agenda"
			},
			{
				icon: Chart_column,
				title: "Pipeline Comercial",
				desc: "Visualize o funil de vendas e acompanhe a evolução no pipeline.",
				color: "#ea580c",
				destaque: "data-tour-pipeline"
			},
			{
				icon: Stethoscope,
				title: "Especialidades & Materiais",
				desc: "Organize especialidades médicas e materiais técnicos para cada visita.",
				color: "#0891b2",
				destaque: "data-tour-especialidades"
			}
		];
		let totalSteps = steps.length;
		let StepIcon = derived(() => steps[currentStep].icon);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="fixed inset-0 z-[9988] pointer-events-none" style="background: rgba(0,0,0,0.55); transition: opacity 300ms;"></div> <div class="fixed z-[9991]" style="bottom: 24px; right: 24px;"><!---->`);
		{
			$$renderer.push(`<div class="w-80 rounded-2xl bg-white shadow-2xl border border-[rgb(var(--slate-200))] overflow-hidden"><div class="relative px-6 pt-6 pb-5 text-center"${attr_style(`background-color: ${stringify(steps[currentStep].color)};`)}><button class="absolute top-3 right-3 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Pular tour">`);
			X($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button> <div class="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3" style="background-color: rgba(255,255,255,0.15);">`);
			if (StepIcon()) {
				$$renderer.push("<!--[-->");
				StepIcon()($$renderer, { class: "w-6 h-6 text-white" });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div> <h2 class="text-sm font-bold text-white">${escape_html(steps[currentStep].title)}</h2></div> <div class="px-6 py-4"><p class="text-xs text-center leading-relaxed text-[rgb(var(--slate-500))]">${escape_html(steps[currentStep].desc)}</p></div> <div class="px-6 pb-5 flex items-center justify-between"><div class="flex gap-1.5"><!--[-->`);
			const each_array = ensure_array_like(steps);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				$$renderer.push(`<div class="h-1.5 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(i === currentStep ? "16px" : "6px")}; background-color: ${stringify(i === currentStep ? steps[currentStep].color : "#e5e7eb")};`)}></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex items-center gap-1.5">`);
			if (currentStep > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer hover:bg-gray-50" style="color: #6b7280; border-color: #e5e7eb;">Anterior</button>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button class="px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer hover:bg-gray-50" style="color: #9ca3af;">Pular</button>`);
			}
			$$renderer.push(`<!--]--> <button class="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-lg text-white transition-all duration-200 cursor-pointer hover:-translate-y-[1px] hover:shadow-md"${attr_style(`background-color: ${stringify(steps[currentStep].color)};`)}>`);
			if (currentStep === totalSteps - 1) {
				$$renderer.push("<!--[0-->");
				Check($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Começar`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Próximo `);
				Arrow_right($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!---->`);
			}
			$$renderer.push(`<!--]--></button></div></div></div>`);
		}
		$$renderer.push(`<!----></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/dashboard/WidgetTranscricoes.svelte
function WidgetTranscricoes($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { sessionToken } = $$props;
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="h-full min-h-32 flex items-center justify-center rounded-xl border border-[rgb(var(--slate-100))] bg-white/50 backdrop-blur-sm p-5">`);
		Loader_circle($$renderer, { class: "h-6 w-6 text-violet-500 animate-spin" });
		$$renderer.push(`<!----></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/dashboard/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let mostrarTour = false;
		let { data } = $$props;
		const resumo = derived(() => data.resumo);
		const alertas = derived(() => data.alertas);
		let query = "";
		let aberto = false;
		head("x1i5gj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Dashboard — MediVisitas</title>`);
			});
		});
		$$renderer.push(`<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
		Trending_up($$renderer, { class: "h-[18px] w-[18px] text-white" });
		$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Dashboard</h1> <p class="text-[11px] text-[rgb(var(--slate-400))]">Visão geral da sua operação</p></div></div></div> <div class="flex justify-between items-center mb-6"><div role="search" aria-label="Buscar profissionais" class="relative w-96"><div class="flex items-center gap-2 rounded-lg border border-[rgb(var(--slate-200))] bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-blue-300 focus-within:shadow-md">`);
		Search($$renderer, { class: "h-4 w-4 text-[rgb(var(--slate-400))] shrink-0" });
		$$renderer.push(`<!----> <input type="text" placeholder="Buscar profissionais..."${attr("value", query)} role="combobox"${attr("aria-expanded", aberto)} aria-haspopup="listbox" aria-controls="search-results"${attr("aria-activedescendant", void 0)} class="w-full bg-transparent text-sm text-[rgb(var(--slate-700))] placeholder:text-[rgb(var(--slate-400))] outline-none"/> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="card-surface p-5 mb-6 transition-all duration-200 hover:shadow-sm"><h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Acesso Rápido</h3> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><a href="/dashboard/profissionais" class="group flex items-center gap-3 rounded-xl border border-[rgb(var(--slate-100))] p-3.5 will-change-transform transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--slate-50))] group-hover:bg-white transition-colors">`);
		Users($$renderer, { class: "h-4 w-4 text-[rgb(var(--slate-400))] group-hover:text-blue-600 transition-colors" });
		$$renderer.push(`<!----></div> <div><p class="text-[13px] font-semibold text-[rgb(var(--slate-700))] group-hover:text-[rgb(var(--slate-900))]">Profissionais</p> <p class="text-[11px] text-[rgb(var(--slate-400))] font-medium">Gerenciar cadastros</p></div></a> <a href="/dashboard/visitas" class="group flex items-center gap-3 rounded-xl border border-[rgb(var(--slate-100))] p-3.5 will-change-transform transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-sky-200 hover:bg-sky-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--slate-50))] group-hover:bg-white transition-colors">`);
		Calendar_days($$renderer, { class: "h-4 w-4 text-[rgb(var(--slate-400))] group-hover:text-sky-600 transition-colors" });
		$$renderer.push(`<!----></div> <div><p class="text-[13px] font-semibold text-[rgb(var(--slate-700))] group-hover:text-[rgb(var(--slate-900))]">Visitas</p> <p class="text-[11px] text-[rgb(var(--slate-400))] font-medium">Histórico de visitas</p></div></a> <a href="/dashboard/especialidades" class="group flex items-center gap-3 rounded-xl border border-[rgb(var(--slate-100))] p-3.5 will-change-transform transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--slate-50))] group-hover:bg-white transition-colors">`);
		Stethoscope($$renderer, { class: "h-4 w-4 text-[rgb(var(--slate-400))] group-hover:text-emerald-600 transition-colors" });
		$$renderer.push(`<!----></div> <div><p class="text-[13px] font-semibold text-[rgb(var(--slate-700))] group-hover:text-[rgb(var(--slate-900))]">Especialidades</p> <p class="text-[11px] text-[rgb(var(--slate-400))] font-medium">Categorias e subs</p></div></a> <a href="/dashboard/pipeline" class="group flex items-center gap-3 rounded-xl border border-[rgb(var(--slate-100))] p-3.5 will-change-transform transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-violet-200 hover:bg-violet-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--slate-50))] group-hover:bg-white transition-colors">`);
		Trending_up($$renderer, { class: "h-4 w-4 text-[rgb(var(--slate-400))] group-hover:text-violet-600 transition-colors" });
		$$renderer.push(`<!----></div> <div><p class="text-[13px] font-semibold text-[rgb(var(--slate-700))] group-hover:text-[rgb(var(--slate-900))]">Pipeline</p> <p class="text-[11px] text-[rgb(var(--slate-400))] font-medium">Funil de conversão</p></div></a></div></div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 items-stretch"><div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
		CardResumo($$renderer, {
			titulo: "Visitas Hoje",
			valor: resumo()?.visitasHoje ?? 0,
			icone: Calendar_check,
			corIcone: "text-violet-600",
			corFundo: "bg-violet-50"
		});
		$$renderer.push(`<!----></div> <div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
		CardResumo($$renderer, {
			titulo: "Visitas Semana",
			valor: resumo()?.visitasSemana ?? 0,
			icone: Calendar,
			corIcone: "text-blue-600",
			corFundo: "bg-blue-50"
		});
		$$renderer.push(`<!----></div> <div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
		CardResumo($$renderer, {
			titulo: "Profissionais",
			valor: resumo()?.totalProfissionais ?? 0,
			icone: Users,
			corIcone: "text-emerald-600",
			corFundo: "bg-emerald-50"
		});
		$$renderer.push(`<!----></div> <div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`);
		CardResumo($$renderer, {
			titulo: "Especialidades",
			valor: resumo()?.totalEspecialidades ?? 0,
			icone: Stethoscope,
			corIcone: "text-amber-600",
			corFundo: "bg-amber-50"
		});
		$$renderer.push(`<!----></div></div> <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">`);
		PainelAlertas($$renderer, { alertas: alertas() });
		$$renderer.push(`<!----> `);
		ListaProximasVisitas($$renderer, { agendamentos: resumo()?.proximosAgendamentos ?? [] });
		$$renderer.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"><div class="lg:col-span-2 flex flex-col h-full">`);
		if (resumo()?.ultimasVisitas && resumo().ultimasVisitas.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="card-surface p-5 h-full flex flex-col"><h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Últimas Visitas</h3> <div class="space-y-2.5 flex-1"><!--[-->`);
			const each_array_1 = ensure_array_like(resumo().ultimasVisitas);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let visita = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/dashboard/profissionais/${stringify(visita.id)}`)} class="flex items-center gap-3 p-3 rounded-lg hover:bg-[rgb(var(--slate-50))] transition-all duration-200 group"><div class="flex-shrink-0 w-16 text-center"><span class="text-[13px] font-bold text-[rgb(var(--slate-700))]">${escape_html(new Intl.DateTimeFormat("pt-BR", {
					day: "2-digit",
					month: "short"
				}).format(new Date(visita.dataVisita)))}</span> <span class="block text-[10px] text-[rgb(var(--slate-400))] mt-0.5">${escape_html(new Intl.DateTimeFormat("pt-BR", {
					hour: "2-digit",
					minute: "2-digit"
				}).format(new Date(visita.dataVisita)))}</span></div> <div class="min-w-0 border-l border-[rgb(var(--slate-100))] pl-3 flex-1"><p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate group-hover:text-blue-600 transition-colors">${escape_html(visita.profissional?.nome ?? "Profissional")}</p> <p class="text-[11px] text-[rgb(var(--slate-400))] truncate">${escape_html(visita.profissional?.especialidade?.nome ?? "")} `);
				if (visita.objetivoVisita) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-[rgb(var(--slate-300))]">·</span>${escape_html(visita.objetivoVisita)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p></div> `);
				StatusVisitaBadge($$renderer, { status: visita.status });
				$$renderer.push(`<!----></a>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="lg:col-span-1 h-full">`);
		WidgetTranscricoes($$renderer, { sessionToken: data.sessionToken });
		$$renderer.push(`<!----></div></div> `);
		if (mostrarTour) {
			$$renderer.push("<!--[0-->");
			TourPrimeiroAcesso($$renderer, {
				sessionToken: data.sessionToken,
				onclose: () => mostrarTour = false
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
