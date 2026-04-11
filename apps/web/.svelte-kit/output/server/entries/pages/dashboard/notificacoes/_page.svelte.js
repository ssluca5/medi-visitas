import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  h as attr_class,
  d as stringify,
  f as escape_html,
  k as derived,
  e as ensure_array_like,
  i as attr,
} from "../../../../chunks/index.js";
import { X } from "../../../../chunks/x.js";
import { C as Circle_alert } from "../../../../chunks/circle-alert.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { B as Bell } from "../../../../chunks/bell.js";
import { I as Info } from "../../../../chunks/info.js";
import { I as Icon } from "../../../../chunks/Icon.js";
function Check_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { d: "M18 6 7 17l-5-5" }],
    ["path", { d: "m22 10-7.5 7.5L13 16" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "check-check" },
      $$sanitized_props,
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
        iconNode,
        children: ($$renderer2) => {
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "default", {});
          $$renderer2.push(`<!--]-->`);
        },
        $$slots: { default: true },
      },
    ]),
  );
}
function ItemNotificacao($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { notif } = $$props;
    const iconeMap = {
      INFO: Info,
      NORMAL: Bell,
      ALTA: Triangle_alert,
      URGENTE: Circle_alert,
    };
    const corMap = {
      INFO: "#3b82f6",
      NORMAL: "#f59e0b",
      ALTA: "#ef4444",
      URGENTE: "#dc2626",
    };
    let Icon2 = derived(() => iconeMap[notif.prioridade]);
    let cor = derived(() => corMap[notif.prioridade]);
    function formatarTempoRelativo(dataIso) {
      const agora = Date.now();
      const data = new Date(dataIso).getTime();
      const diffMs = agora - data;
      const diffMin = Math.floor(diffMs / 6e4);
      const diffHora = Math.floor(diffMs / 36e5);
      const diffDia = Math.floor(diffMs / 864e5);
      if (diffMin < 1) return "agora";
      if (diffMin < 60) return `há ${diffMin}min`;
      if (diffHora < 24) return `há ${diffHora}h`;
      return `há ${diffDia}d`;
    }
    $$renderer2.push(
      `<div${attr_class(`flex items-start gap-3 px-4 py-3 transition-colors duration-200 cursor-default ${stringify(notif.lida ? "" : "bg-blue-50/40")} hover:bg-gray-50 group`)} role="button" tabindex="0"><div class="relative flex-shrink-0 mt-0.5">`,
    );
    if (Icon2()) {
      $$renderer2.push("<!--[-->");
      Icon2()($$renderer2, {
        class: "w-4 h-4",
        style: `color: ${stringify(cor())};`,
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
    $$renderer2.push(` `);
    if (!notif.lida) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style="background-color: #2563eb;"></span>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(
      `<!--]--></div> <div class="flex-1 min-w-0"><p${attr_class(`text-xs ${stringify(notif.lida ? "text-slate-500" : "font-semibold text-slate-900")}`)}>${escape_html(notif.titulo)}</p> <p class="text-xs mt-0.5 truncate text-slate-400">${escape_html(notif.mensagem)}</p> <p class="text-[10px] mt-1 text-slate-300">${escape_html(formatarTempoRelativo(notif.createdAt))}</p></div> <button class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 hover:bg-gray-200 cursor-pointer" aria-label="Remover notificação">`,
    );
    X($$renderer2, { class: "w-3 h-3 text-slate-400" });
    $$renderer2.push(`<!----></button></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let page = data.page;
    let filtroLida = "";
    let notificacoes = data.data;
    let total = data.total;
    let naoLidas = data.naoLidas;
    let totalPages = data.totalPages;
    $$renderer2.push(
      `<div class="max-w-3xl mx-auto"><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">`,
    );
    Bell($$renderer2, { class: "h-5 w-5 text-white" });
    $$renderer2.push(
      `<!----></div> <div><h1 class="text-2xl font-semibold text-slate-900">Notificações</h1> <p class="text-sm text-slate-500 mt-0.5">${escape_html(total)} notificação${escape_html(total !== 1 ? "ões" : "")} · ${escape_html(naoLidas)} não lida${escape_html(naoLidas !== 1 ? "s" : "")}</p></div></div> <div class="flex items-center gap-3">`,
    );
    $$renderer2.select(
      {
        value: filtroLida,
        class:
          "h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer",
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Todas`);
        });
        $$renderer3.option({ value: "false" }, ($$renderer4) => {
          $$renderer4.push(`Não lidas`);
        });
        $$renderer3.option({ value: "true" }, ($$renderer4) => {
          $$renderer4.push(`Lidas`);
        });
      },
    );
    $$renderer2.push(` `);
    if (naoLidas > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<button class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors duration-200" style="background-color: #2563eb; border-radius: 8px;">`,
      );
      Check_check($$renderer2, { class: "h-4 w-4" });
      $$renderer2.push(`<!----> Marcar todas como lidas</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(
      `<!--]--></div></div> <div class="rounded-xl border border-slate-200 overflow-hidden bg-white">`,
    );
    if (notificacoes.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(
        `<div class="flex flex-col items-center justify-center py-12 gap-2">`,
      );
      Bell($$renderer2, { class: "w-10 h-10 text-slate-200" });
      $$renderer2.push(
        `<!----> <p class="text-sm text-slate-400">Nenhuma notificação encontrada</p></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="divide-y divide-slate-100"><!--[-->`);
      const each_array = ensure_array_like(notificacoes);
      for (
        let $$index = 0, $$length = each_array.length;
        $$index < $$length;
        $$index++
      ) {
        let notif = each_array[$$index];
        ItemNotificacao($$renderer2, {
          notif,
          sessionToken: data.sessionToken,
        });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (totalPages > 1) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="flex items-center justify-center gap-3 mt-6"><button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"${attr("disabled", page === 1, true)}>← Anterior</button> <span class="text-sm text-slate-500">${escape_html(page)} / ${escape_html(totalPages)}</span> <button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"${attr("disabled", page === totalPages, true)}>Próxima →</button></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export { _page as default };
