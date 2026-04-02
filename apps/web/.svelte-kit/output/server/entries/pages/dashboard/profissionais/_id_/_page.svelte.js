import { s as sanitize_props, a as spread_props, b as slot, m as getContext, l as head, f as escape_html, k as derived, c as store_get, i as attr_class, d as stringify, e as ensure_array_like, g as unsubscribe_stores } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { B as Button, a as apiFetch } from "../../../../../chunks/Sheet.js";
import { V as VisitaSheet, S as StatusVisitaBadge } from "../../../../../chunks/VisitaSheet.js";
import { C as Chevron_left } from "../../../../../chunks/chevron-left.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
function Calendar_plus($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "path",
      {
        "d": "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"
      }
    ],
    ["path", { "d": "M3 10h18" }],
    ["path", { "d": "M16 19h6" }],
    ["path", { "d": "M19 16v6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "calendar-plus" },
    $$sanitized_props,
    {
      /**
       * @component @name CalendarPlus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cGF0aCBkPSJNMjEgMTNWNmEyIDIgMCAwIDAtMi0ySDVhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDgiIC8+CiAgPHBhdGggZD0iTTMgMTBoMTgiIC8+CiAgPHBhdGggZD0iTTE2IDE5aDYiIC8+CiAgPHBhdGggZD0iTTE5IDE2djYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/calendar-plus
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
      $$slots: { default: true }
    }
  ]));
}
function History($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
    ],
    ["path", { "d": "M3 3v5h5" }],
    ["path", { "d": "M12 7v5l4 2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "history" },
    $$sanitized_props,
    {
      /**
       * @component @name History
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgogIDxwYXRoIGQ9Ik0xMiA3djVsNCAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/history
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
      $$slots: { default: true }
    }
  ]));
}
function User($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "12", "cy": "7", "r": "4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "user" },
    $$sanitized_props,
    {
      /**
       * @component @name User
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
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
      $$slots: { default: true }
    }
  ]));
}
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let id = derived(() => store_get($$store_subs ??= {}, "$page", page).params.id);
    let profissional = null;
    let visitas = [];
    let materiaisOptions = [];
    let loading = true;
    let visitaSheetOpen = false;
    let visitaEmEdicao = null;
    async function loadData() {
      loading = true;
      try {
        const [profRes, visitasRes, matRes] = await Promise.all([
          apiFetch(`/profissionais/${id()}`, data.sessionToken),
          apiFetch(`/visitas?profissionalId=${id()}`, data.sessionToken),
          apiFetch(`/materiais`, data.sessionToken)
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
      } catch (err) {
        console.error(err);
      } finally {
        loading = false;
      }
    }
    function handleNovaVisita() {
      visitaEmEdicao = null;
      visitaSheetOpen = true;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("aho02t", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(profissional ? profissional.nome : "Perfil do Profissional")} — MediVisitas</title>`);
        });
      });
      $$renderer3.push(`<div class="space-y-6"><div class="flex items-center gap-4">`);
      Button($$renderer3, {
        href: "/dashboard/profissionais",
        variant: "outline",
        size: "sm",
        class: "gap-2",
        children: ($$renderer4) => {
          Chevron_left($$renderer4, { class: "w-4 h-4" });
          $$renderer4.push(`<!----> Voltar`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <h1 class="text-2xl font-bold text-gray-900">Perfil do Profissional</h1></div> `);
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex justify-center p-12"><div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>`);
      } else if (profissional) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<div class="bg-white rounded-lg shadow-sm border p-6 flex items-start gap-6"><div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold shadow-sm">${escape_html(profissional.nome.charAt(0).toUpperCase())}</div> <div class="flex-1"><h2 class="text-xl font-bold text-gray-900">${escape_html(profissional.nome)}</h2> <div class="text-sm text-gray-500 mt-1 flex gap-4"><span>CRM: ${escape_html(profissional.crm || "N/A")}</span> <span>Especialidade: ${escape_html(profissional.especialidade?.nome || "N/A")}</span></div></div> <div>`);
        Button($$renderer3, {
          class: "gap-2",
          onclick: handleNovaVisita,
          children: ($$renderer4) => {
            Calendar_plus($$renderer4, { class: "w-4 h-4" });
            $$renderer4.push(`<!----> Registrar Visita`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div> <div class="border-b border-gray-200"><nav class="-mb-px flex space-x-8" aria-label="Tabs"><button${attr_class(`flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${stringify(
          "border-indigo-500 text-indigo-600"
        )}`)}>`);
        History($$renderer3, { class: "w-4 h-4" });
        $$renderer3.push(`<!----> Histórico de Visitas</button> <button${attr_class(`flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${stringify("border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700")}`)}>`);
        User($$renderer3, { class: "w-4 h-4" });
        $$renderer3.push(`<!----> Dados Cadastrais</button></nav></div> <div class="py-4">`);
        {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="space-y-4">`);
          if (visitas.length === 0) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500"><p>Nenhuma visita registrada para este profissional.</p> `);
            Button($$renderer3, {
              variant: "outline",
              class: "mt-4 gap-2",
              onclick: handleNovaVisita,
              children: ($$renderer4) => {
                Calendar_plus($$renderer4, { class: "w-4 h-4" });
                $$renderer4.push(`<!----> Primeira Visita`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(visitas);
            for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
              let visita = each_array[$$index_1];
              $$renderer3.push(`<button class="w-full text-left bg-white rounded-lg border shadow-sm p-5 transition hover:shadow-md cursor-pointer block"><div class="flex justify-between items-start mb-2"><div><div class="text-sm font-semibold text-slate-700">${escape_html(new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(visita.dataVisita)))} às ${escape_html(new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(visita.dataVisita)))}</div> `);
              if (visita.objetivoVisita) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="text-slate-600 text-sm mt-2">${escape_html(visita.objetivoVisita)}</div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(`<div class="text-slate-400 italic text-sm mt-2">Nenhum objetivo detalhado</div>`);
              }
              $$renderer3.push(`<!--]--></div> `);
              StatusVisitaBadge($$renderer3, { status: visita.status });
              $$renderer3.push(`<!----></div> `);
              if (visita.resumo) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<p class="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded border">${escape_html(visita.resumo)}</p>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> `);
              if (visita.materiais && visita.materiais.length > 0) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="mt-3 flex gap-2 flex-wrap"><!--[-->`);
                const each_array_1 = ensure_array_like(visita.materiais);
                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                  let vm = each_array_1[$$index];
                  $$renderer3.push(`<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">${escape_html(vm.quantidade)}x ${escape_html(vm.materialTecnico?.nome)}</span>`);
                }
                $$renderer3.push(`<!--]--></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></button>`);
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="text-center py-12 text-gray-500">Profissional não encontrado.</div>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      VisitaSheet($$renderer3, {
        onclose: () => {
          visitaSheetOpen = false;
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
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
