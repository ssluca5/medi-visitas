import {
  h as attr_class,
  d as stringify,
  f as escape_html,
  e as ensure_array_like,
  i as attr,
  l as head,
  k as derived,
} from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { C as Circle_alert } from "../../../chunks/circle-alert.js";
import { T as Triangle_alert } from "../../../chunks/triangle-alert.js";
import { I as Info } from "../../../chunks/info.js";
import { C as Clock } from "../../../chunks/clock.js";
import { S as StatusVisitaBadge } from "../../../chunks/StatusVisitaBadge.js";
import { T as Trending_up } from "../../../chunks/trending-up.js";
import { S as Search } from "../../../chunks/search.js";
import { U as Users } from "../../../chunks/users.js";
import { S as Stethoscope } from "../../../chunks/stethoscope.js";
import { C as Calendar_check } from "../../../chunks/calendar-check.js";
import { C as Calendar } from "../../../chunks/calendar.js";
function CardResumo($$renderer, $$props) {
  let { titulo, valor, icone: Icon, corIcone, corFundo } = $$props;
  $$renderer.push(
    `<div class="card-surface flex flex-col items-center justify-center text-center p-6 h-full min-h-[120px] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"><div class="flex items-center gap-2"><div${attr_class(`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stringify(corFundo)}`)}>`,
  );
  if (Icon) {
    $$renderer.push("<!--[-->");
    Icon($$renderer, { class: `h-4 w-4 ${stringify(corIcone)}` });
    $$renderer.push("<!--]-->");
  } else {
    $$renderer.push("<!--[!-->");
    $$renderer.push("<!--]-->");
  }
  $$renderer.push(
    `</div> <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">${escape_html(titulo)}</p></div> <p class="text-3xl font-bold text-slate-800 mt-2">${escape_html(valor)}</p></div>`,
  );
}
function PainelAlertas($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { alertas } = $$props;
    const severidadeConfig = {
      info: {
        icon: Info,
        borderClass: "border-l-blue-400",
        iconClass: "text-blue-500",
      },
      warning: {
        icon: Triangle_alert,
        borderClass: "border-l-amber-400",
        iconClass: "text-amber-500",
      },
      danger: {
        icon: Circle_alert,
        borderClass: "border-l-red-400",
        iconClass: "text-red-500",
      },
    };
    $$renderer2.push(
      `<div class="card-surface p-5 h-full"><h3 class="text-sm font-semibold text-slate-700 mb-4">Alertas</h3> `,
    );
    if (alertas.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="text-center py-8"><p class="text-sm text-slate-400">Nenhum alerta no momento</p></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(
        `<div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-2"><!--[-->`,
      );
      const each_array = ensure_array_like(alertas);
      for (
        let $$index = 0, $$length = each_array.length;
        $$index < $$length;
        $$index++
      ) {
        let alerta = each_array[$$index];
        const config =
          severidadeConfig[alerta.severidade] ?? severidadeConfig.info;
        const Icon = config.icon;
        $$renderer2.push(
          `<a${attr("href", `/dashboard/profissionais/${stringify(alerta.profissionalId)}`)}${attr_class(`flex items-start gap-3 p-3 rounded-lg border-l-3 ${stringify(config.borderClass)} bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm`)}>`,
        );
        if (Icon) {
          $$renderer2.push("<!--[-->");
          Icon($$renderer2, {
            class: `h-4 w-4 ${stringify(config.iconClass)} mt-0.5 shrink-0`,
          });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
        $$renderer2.push(
          ` <div class="min-w-0 flex-1"><p class="text-[13px] font-medium text-slate-700 leading-snug">${escape_html(alerta.mensagem)}</p> <p class="text-[11px] text-slate-400 mt-0.5">${escape_html(alerta.profissionalNome)}</p></div></a>`,
        );
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function ListaProximasVisitas($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { agendamentos } = $$props;
    function formatHora(iso) {
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    }
    function formatData(iso) {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
      }).format(new Date(iso));
    }
    const prioridadeBadge = {
      URGENTE:
        "bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
      ALTA: "bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
      MEDIA:
        "bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
      BAIXA:
        "bg-slate-50 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
    };
    $$renderer2.push(
      `<div class="card-surface p-5 h-full"><h3 class="text-sm font-semibold text-slate-700 mb-4">Próximos Agendamentos</h3> `,
    );
    if (agendamentos.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="text-center py-8"><p class="text-sm text-slate-400">Nenhum agendamento futuro</p></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-2.5"><!--[-->`);
      const each_array = ensure_array_like(agendamentos);
      for (
        let $$index = 0, $$length = each_array.length;
        $$index < $$length;
        $$index++
      ) {
        let ag = each_array[$$index];
        $$renderer2.push(
          `<div class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"><div class="flex-shrink-0 w-12 text-center"><span class="text-[13px] font-bold text-violet-600">${escape_html(formatHora(ag.dataHoraInicio))}</span> <span class="block text-[10px] text-slate-400 mt-0.5">${escape_html(formatData(ag.dataHoraInicio))}</span></div> <div class="min-w-0 border-l border-slate-100 pl-3 flex-1"><p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">${escape_html(ag.profissional?.nome ?? "Sem profissional")}</p> <p class="text-[11px] text-slate-400 truncate">${escape_html(ag.profissional?.especialidade?.nome ?? "")} `,
        );
        if (ag.prioridade) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(
            `<span${attr_class(prioridadeBadge[ag.prioridade] ?? prioridadeBadge.BAIXA)}>${escape_html(ag.prioridade)}</span>`,
          );
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></p></div> `);
        Clock($$renderer2, { class: "h-3.5 w-3.5 text-slate-300 shrink-0" });
        $$renderer2.push(`<!----></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const resumo = derived(() => data.resumo);
    const alertas = derived(() => data.alertas);
    let query = "";
    head("x1i5gj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard — MediVisitas</title>`);
      });
    });
    $$renderer2.push(
      `<div class="mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">`,
    );
    Trending_up($$renderer2, { class: "h-[18px] w-[18px] text-white" });
    $$renderer2.push(
      `<!----></div> <div><h1 class="text-lg font-bold text-slate-800">Dashboard</h1> <p class="text-[11px] text-slate-400">Visão geral do seu dia</p></div></div></div> <div class="flex justify-between items-center mb-6"><div class="relative w-96"><div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-blue-300 focus-within:shadow-md">`,
    );
    Search($$renderer2, { class: "h-4 w-4 text-slate-400 shrink-0" });
    $$renderer2.push(
      `<!----> <input type="text" placeholder="Buscar profissionais..."${attr("value", query)} class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"/> `,
    );
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(
      `<!--]--></div></div> <div class="card-surface p-5 mb-6 transition-all duration-200 hover:shadow-sm"><h3 class="text-sm font-semibold text-slate-700 mb-4">Acesso Rápido</h3> <div class="grid grid-cols-1 gap-4 sm:grid-cols-3"><a href="/dashboard/profissionais" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">`,
    );
    Users($$renderer2, {
      class:
        "h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors",
    });
    $$renderer2.push(
      `<!----></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Profissionais</p> <p class="text-[11px] text-slate-400 font-medium">Gerenciar cadastros</p></div></a> <a href="/dashboard/especialidades" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">`,
    );
    Stethoscope($$renderer2, {
      class:
        "h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors",
    });
    $$renderer2.push(
      `<!----></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Especialidades</p> <p class="text-[11px] text-slate-400 font-medium">Categorias e subs</p></div></a> <a href="/dashboard/pipeline" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-violet-200 hover:bg-violet-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">`,
    );
    Trending_up($$renderer2, {
      class:
        "h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors",
    });
    $$renderer2.push(
      `<!----></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Pipeline</p> <p class="text-[11px] text-slate-400 font-medium">Funil de conversão</p></div></a></div></div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 items-stretch"><div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`,
    );
    CardResumo($$renderer2, {
      titulo: "Visitas Hoje",
      valor: resumo()?.visitasHoje ?? 0,
      icone: Calendar_check,
      corIcone: "text-violet-600",
      corFundo: "bg-violet-50",
    });
    $$renderer2.push(
      `<!----></div> <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`,
    );
    CardResumo($$renderer2, {
      titulo: "Visitas Semana",
      valor: resumo()?.visitasSemana ?? 0,
      icone: Calendar,
      corIcone: "text-blue-600",
      corFundo: "bg-blue-50",
    });
    $$renderer2.push(
      `<!----></div> <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`,
    );
    CardResumo($$renderer2, {
      titulo: "Profissionais",
      valor: resumo()?.totalProfissionais ?? 0,
      icone: Users,
      corIcone: "text-emerald-600",
      corFundo: "bg-emerald-50",
    });
    $$renderer2.push(
      `<!----></div> <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">`,
    );
    CardResumo($$renderer2, {
      titulo: "Especialidades",
      valor: resumo()?.totalEspecialidades ?? 0,
      icone: Stethoscope,
      corIcone: "text-amber-600",
      corFundo: "bg-amber-50",
    });
    $$renderer2.push(
      `<!----></div></div> <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">`,
    );
    PainelAlertas($$renderer2, { alertas: alertas() });
    $$renderer2.push(`<!----> `);
    ListaProximasVisitas($$renderer2, {
      agendamentos: resumo()?.proximosAgendamentos ?? [],
    });
    $$renderer2.push(`<!----></div> `);
    if (resumo()?.ultimasVisitas && resumo().ultimasVisitas.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="card-surface p-5 mb-6"><h3 class="text-sm font-semibold text-slate-700 mb-4">Últimas Visitas</h3> <div class="space-y-2.5"><!--[-->`,
      );
      const each_array_1 = ensure_array_like(resumo().ultimasVisitas);
      for (
        let $$index_1 = 0, $$length = each_array_1.length;
        $$index_1 < $$length;
        $$index_1++
      ) {
        let visita = each_array_1[$$index_1];
        $$renderer2.push(
          `<a${attr("href", `/dashboard/profissionais/${stringify(visita.id)}`)} class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"><div class="flex-shrink-0 w-16 text-center"><span class="text-[13px] font-bold text-slate-700">${escape_html(new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(visita.dataVisita)))}</span> <span class="block text-[10px] text-slate-400 mt-0.5">${escape_html(new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(visita.dataVisita)))}</span></div> <div class="min-w-0 border-l border-slate-100 pl-3 flex-1"><p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">${escape_html(visita.profissional?.nome ?? "Profissional")}</p> <p class="text-[11px] text-slate-400 truncate">${escape_html(visita.profissional?.especialidade?.nome ?? "")} `,
        );
        if (visita.objetivoVisita) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(
            `<span class="text-slate-300">·</span>${escape_html(visita.objetivoVisita)}`,
          );
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></p></div> `);
        StatusVisitaBadge($$renderer2, { status: visita.status });
        $$renderer2.push(`<!----></a>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export { _page as default };
