import { s as sanitize_props, a as spread_props, b as slot, l as head, f as escape_html, h as attr, e as ensure_array_like, d as stringify, i as attr_class, k as derived } from "../../../../chunks/index.js";
import { B as Button, S as Sheet, a as apiFetch } from "../../../../chunks/Sheet.js";
import { t as toasts } from "../../../../chunks/toast.js";
import { P as Plus, C as ConfirmDialog, T as Trash_2 } from "../../../../chunks/ConfirmDialog.js";
import { S as Search } from "../../../../chunks/search.js";
import { U as Users } from "../../../../chunks/users.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { X } from "../../../../chunks/x.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { P as Power, a as Play } from "../../../../chunks/power.js";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function Arrow_left($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "m12 19-7-7 7-7" }],
    ["path", { "d": "M19 12H5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTktNy03IDctNyIgLz4KICA8cGF0aCBkPSJNMTkgMTJINSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-left
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
function Arrow_right($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "m12 5 7 7-7 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
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
function Eye($$renderer, $$props) {
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
      {
        "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "eye" },
    $$sanitized_props,
    {
      /**
       * @component @name Eye
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
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
function Map_pin($$renderer, $$props) {
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
      {
        "d": "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "10", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "map-pin" },
    $$sanitized_props,
    {
      /**
       * @component @name MapPin
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTBjMCA0Ljk5My01LjUzOSAxMC4xOTMtNy4zOTkgMTEuNzk5YTEgMSAwIDAgMS0xLjIwMiAwQzkuNTM5IDIwLjE5MyA0IDE0Ljk5MyA0IDEwYTggOCAwIDAgMSAxNiAwIiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/map-pin
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
function Pencil($$renderer, $$props) {
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
      {
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ],
    ["path", { "d": "m15 5 4 4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "pencil" },
    $$sanitized_props,
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
function Phone($$renderer, $$props) {
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
      {
        "d": "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "phone" },
    $$sanitized_props,
    {
      /**
       * @component @name Phone
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTYuOTJ2M2EyIDIgMCAwIDEtMi4xOCAyIDE5Ljc5IDE5Ljc5IDAgMCAxLTguNjMtMy4wNyAxOS41IDE5LjUgMCAwIDEtNi02IDE5Ljc5IDE5Ljc5IDAgMCAxLTMuMDctOC42N0EyIDIgMCAwIDEgNC4xMSAyaDNhMiAyIDAgMCAxIDIgMS43MiAxMi44NCAxMi44NCAwIDAgMCAuNyAyLjgxIDIgMiAwIDAgMS0uNDUgMi4xMUw4LjA5IDkuOTFhMTYgMTYgMCAwIDAgNiA2bDEuMjctMS4yN2EyIDIgMCAwIDEgMi4xMS0uNDUgMTIuODQgMTIuODQgMCAwIDAgMi44MS43QTIgMiAwIDAgMSAyMiAxNi45MnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/phone
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let profissionais = [];
    let pagination = { page: 1, pageSize: 20, total: 0, totalPages: 0 };
    let loading = true;
    let error = null;
    let filtroBusca = "";
    let filtroPotencial = "";
    let filtroEstagio = "";
    let filtroClassificacao = "";
    let sheetOpen = false;
    let profissionalEmEdicao = null;
    let especialidades = [];
    let subEspecialidades = [];
    let deleteConfirmOpen = false;
    let profToDelete = null;
    let formNome = "";
    let formCrm = "";
    let formEmail = "";
    let formTelefone = "";
    let formPotencial = "";
    let formEstagio = "PROSPECTADO";
    let formEspecialidadeId = "";
    let formSubEspecialidadeId = "";
    let formClassificacao = "";
    let formCep = "";
    let formLogradouro = "";
    let formNumero = "";
    let formComplemento = "";
    let formBairro = "";
    let formCidade = "";
    let formEstado = "";
    let formContatos = [];
    let formCpfCnpj = "";
    let formSexo = "NAO_INFORMADO";
    let formDataNascimento = "";
    let formTratamento = "";
    let formObservacoes = "";
    let formNomeConjuge = "";
    let formDataNascConjuge = "";
    const potencialConfig = {
      ALTO: { label: "Alto", class: "bg-emerald-50 text-emerald-700" },
      MEDIO: { label: "Médio", class: "bg-amber-50 text-amber-700" },
      BAIXO: { label: "Baixo", class: "bg-red-50 text-red-600" },
      ESTRATEGICO: { label: "Estratégico", class: "bg-violet-50 text-violet-700" }
    };
    const estagioConfig = {
      PROSPECTADO: { label: "Prospectado", class: "bg-slate-100 text-slate-600" },
      VISITADO: { label: "Visitado", class: "bg-blue-50 text-blue-700" },
      INTERESSADO: { label: "Interessado", class: "bg-purple-50 text-purple-700" },
      PRESCRITOR: { label: "Prescritor", class: "bg-emerald-50 text-emerald-700" },
      FIDELIZADO: { label: "Fidelizado", class: "bg-amber-50 text-amber-700" }
    };
    const estagios = [
      "PROSPECTADO",
      "VISITADO",
      "INTERESSADO",
      "PRESCRITOR",
      "FIDELIZADO"
    ];
    let especialidadesAgrupadas = derived(() => especialidades.reduce(
      (acc, esp) => {
        const cat = esp.categoria;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(esp);
        return acc;
      },
      {}
    ));
    let categoriasOrdenadas = derived(() => Object.keys(especialidadesAgrupadas()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())));
    let isFetchingData = false;
    async function fetchProfissionais(page = 1) {
      if (isFetchingData) return;
      isFetchingData = true;
      loading = true;
      error = null;
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pagination.pageSize.toString()
        });
        if (filtroBusca) ;
        if (filtroPotencial) ;
        if (filtroEstagio) ;
        if (filtroClassificacao) ;
        const response = await apiFetch(`/profissionais?${params}`, data.sessionToken);
        if (!response.ok) throw new Error("Erro ao carregar profissionais");
        const json = await response.json();
        profissionais = json.data ?? json;
        if (json.pagination) {
          pagination = json.pagination;
        }
      } catch (err) {
        error = err instanceof Error ? err.message : "Erro desconhecido";
      } finally {
        loading = false;
        isFetchingData = false;
      }
    }
    function handleNovoProfissional() {
      profissionalEmEdicao = null;
      formNome = "";
      formCrm = "";
      formEmail = "";
      formTelefone = "";
      formPotencial = "";
      formEstagio = "PROSPECTADO";
      formEspecialidadeId = "";
      formSubEspecialidadeId = "";
      formClassificacao = "";
      formCep = "";
      formLogradouro = "";
      formNumero = "";
      formComplemento = "";
      formBairro = "";
      formCidade = "";
      formEstado = "";
      formContatos = [];
      formCpfCnpj = "";
      formSexo = "NAO_INFORMADO";
      formDataNascimento = "";
      formTratamento = "";
      formObservacoes = "";
      formNomeConjuge = "";
      formDataNascConjuge = "";
      sheetOpen = true;
    }
    async function handleSalvarProfissional() {
      if (!formNome.trim()) {
        toasts.show("error", "O nome do profissional é obrigatório.");
        return;
      }
      const endObj = {
        cep: formCep.trim() || void 0,
        logradouro: formLogradouro.trim() || void 0,
        numero: formNumero.trim() || void 0,
        complemento: formComplemento.trim() || void 0,
        bairro: formBairro.trim() || void 0,
        cidade: formCidade.trim() || void 0,
        estado: formEstado.trim() || void 0
      };
      const temEndereco = Object.values(endObj).some((v) => v !== void 0);
      const contatosLimpos = formContatos.filter((c) => c.valor.trim()).map((c) => ({
        tipo: c.tipo,
        valor: c.valor.trim(),
        observacao: c.observacao.trim() || void 0
      }));
      const apiData = {
        nome: formNome.trim(),
        crm: formCrm.trim() || void 0,
        email: formEmail.trim() || void 0,
        telefone: formTelefone.trim() || void 0,
        potencial: formPotencial || void 0,
        estagioPipeline: formEstagio,
        especialidadeId: formEspecialidadeId || void 0,
        subEspecialidadeId: formSubEspecialidadeId || void 0,
        classificacao: formClassificacao || void 0,
        cpfCnpj: formCpfCnpj.trim() || void 0,
        sexo: formSexo || void 0,
        dataNascimento: formDataNascimento ? new Date(formDataNascimento).toISOString() : void 0,
        tratamento: formTratamento || void 0,
        observacoes: formObservacoes.trim() || void 0,
        nomeConjuge: formNomeConjuge.trim() || void 0,
        dataNascConjuge: formDataNascConjuge ? new Date(formDataNascConjuge).toISOString() : void 0,
        endereco: temEndereco ? endObj : void 0,
        contatos: contatosLimpos.length > 0 ? contatosLimpos : void 0
      };
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === void 0) delete apiData[key];
      });
      if (!formSubEspecialidadeId) {
        apiData.subEspecialidadeId = null;
      }
      if (!formEspecialidadeId) {
        apiData.especialidadeId = null;
      }
      if (!formClassificacao) {
        apiData.classificacao = null;
      }
      const url = profissionalEmEdicao?.id ? `/profissionais/${profissionalEmEdicao.id}` : "/profissionais";
      const method = profissionalEmEdicao?.id ? "PUT" : "POST";
      try {
        const response = await apiFetch(url, data.sessionToken, { method, body: JSON.stringify(apiData) });
        if (!response.ok) {
          const errBody = await response.json().catch(() => null);
          const msg = errBody?.error || errBody?.message || `Erro ${response.status}`;
          throw new Error(msg);
        }
        const updated = await response.json();
        if (profissionalEmEdicao?.id) {
          profissionais = profissionais.map((p) => p.id === updated.id ? updated : p);
        } else {
          fetchProfissionais(pagination.page);
        }
        sheetOpen = false;
        toasts.show("success", profissionalEmEdicao?.id ? "Profissional atualizado!" : "Profissional criado!");
      } catch (err) {
        toasts.show("error", err instanceof Error ? err.message : "Erro ao salvar");
      }
    }
    async function confirmDeleteProfissional() {
      if (!profToDelete) return;
      const response = await apiFetch(`/profissionais/${profToDelete.id}`, data.sessionToken, { method: "DELETE" });
      if (!response.ok) {
        const d = await response.json();
        toasts.show("error", d.error || "Erro ao excluir");
        deleteConfirmOpen = false;
        return;
      }
      profissionais = profissionais.filter((p) => p.id !== profToDelete.id);
      pagination.total = pagination.total - 1;
      toasts.show("success", `"${profToDelete.nome}" excluído.`);
      deleteConfirmOpen = false;
      profToDelete = null;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("5tv8ml", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Profissionais — MediVisitas</title>`);
        });
      });
      $$renderer3.push(`<header class="mb-6 flex items-center justify-between"><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Profissionais</h2> <p class="text-sm text-slate-400 mt-1">${escape_html(pagination.total)} profissionais cadastrados</p></div> `);
      Button($$renderer3, {
        onclick: handleNovoProfissional,
        class: "hidden sm:inline-flex gap-2",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-4 w-4" });
          $$renderer4.push(`<!----> Novo Profissional`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></header> <div class="card-surface p-4 mb-6"><div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"><div class="relative">`);
      Search($$renderer3, {
        class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
      });
      $$renderer3.push(`<!----> <input type="text" placeholder="Buscar por nome ou CRM..."${attr("value", filtroBusca)} class="input-base !pl-9"/></div> `);
      $$renderer3.select(
        {
          value: filtroPotencial,
          onchange: () => fetchProfissionais(1),
          class: "input-base"
        },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`Todos os potenciais`);
          });
          $$renderer4.option({ value: "ALTO" }, ($$renderer5) => {
            $$renderer5.push(`Alto`);
          });
          $$renderer4.option({ value: "MEDIO" }, ($$renderer5) => {
            $$renderer5.push(`Médio`);
          });
          $$renderer4.option({ value: "BAIXO" }, ($$renderer5) => {
            $$renderer5.push(`Baixo`);
          });
          $$renderer4.option({ value: "ESTRATEGICO" }, ($$renderer5) => {
            $$renderer5.push(`Estratégico`);
          });
        }
      );
      $$renderer3.push(` `);
      $$renderer3.select(
        {
          value: filtroEstagio,
          onchange: () => fetchProfissionais(1),
          class: "input-base"
        },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`Todos os estágios`);
          });
          $$renderer4.push(`<!--[-->`);
          const each_array = ensure_array_like(estagios);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let est = each_array[$$index];
            $$renderer4.option({ value: est }, ($$renderer5) => {
              $$renderer5.push(`${escape_html(estagioConfig[est].label)}`);
            });
          }
          $$renderer4.push(`<!--]-->`);
        }
      );
      $$renderer3.push(` `);
      $$renderer3.select(
        {
          value: filtroClassificacao,
          onchange: () => fetchProfissionais(1),
          class: "input-base"
        },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`Todas as classificações`);
          });
          $$renderer4.option({ value: "FORTE" }, ($$renderer5) => {
            $$renderer5.push(`Forte`);
          });
          $$renderer4.option({ value: "INTERMEDIARIO" }, ($$renderer5) => {
            $$renderer5.push(`Intermediário`);
          });
          $$renderer4.option({ value: "FRACO" }, ($$renderer5) => {
            $$renderer5.push(`Fraco`);
          });
        }
      );
      $$renderer3.push(`</div></div> `);
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="card-surface flex items-center justify-center py-20"><div class="flex flex-col items-center gap-3"><div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div> <span class="text-sm text-slate-400">Carregando profissionais...</span></div></div>`);
      } else if (error) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">`);
        Users($$renderer3, { class: "h-6 w-6 text-red-400" });
        $$renderer3.push(`<!----></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Erro ao carregar</p> <p class="text-xs text-slate-400 mt-1">${escape_html(error)}</p></div> `);
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          onclick: () => fetchProfissionais(1),
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Tentar novamente`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      } else if (profissionais.length === 0) {
        $$renderer3.push("<!--[2-->");
        $$renderer3.push(`<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">`);
        Users($$renderer3, { class: "h-7 w-7 text-slate-400" });
        $$renderer3.push(`<!----></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Nenhum profissional encontrado</p> <p class="text-xs text-slate-400 mt-1">Use os filtros acima ou adicione um novo</p></div> `);
        Button($$renderer3, {
          size: "sm",
          onclick: handleNovoProfissional,
          class: "gap-2",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "h-4 w-4" });
            $$renderer4.push(`<!----> Adicionar Profissional`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[24%]">Nome</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[18%]">Especialidade</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[16%]">Subespecialidade</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Potencial</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Estágio</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[18%]">Ações</th></tr></thead><tbody><!--[-->`);
        const each_array_1 = ensure_array_like(profissionais);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let prof = each_array_1[$$index_1];
          const isAtivo = !prof.deletedAt;
          $$renderer3.push(`<tr${attr_class("group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60", void 0, { "opacity-50": !isAtivo })}><td class="p-3.5"><div class="flex items-center gap-3"><div${attr_class("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm", void 0, {
            "bg-gradient-to-br": isAtivo,
            "from-blue-500": isAtivo,
            "to-indigo-600": isAtivo,
            "text-white": isAtivo,
            "bg-slate-200": !isAtivo,
            "text-slate-400": !isAtivo
          })}>${escape_html(prof.nome.charAt(0).toUpperCase())}</div> <div class="min-w-0"><p${attr_class("text-sm font-medium truncate", void 0, { "text-slate-900": isAtivo, "text-slate-400": !isAtivo })}>${escape_html(prof.nome)}</p> <p${attr_class("text-xs truncate", void 0, { "text-slate-400": isAtivo, "text-slate-300": !isAtivo })}>${escape_html(prof.crm || "Sem CRM")}</p></div></div></td><td class="p-3.5 text-center"><span class="text-sm text-slate-700 truncate block font-medium">${escape_html(prof.especialidade?.nome || "—")}</span></td><td class="p-3.5 text-center"><span class="text-sm text-slate-500 truncate block">${escape_html(prof.subEspecialidade?.nome || "-")}</span></td><td class="p-3.5 text-center"><span${attr_class(`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${stringify(potencialConfig[prof.potencial]?.class ?? "bg-slate-100 text-slate-600")}`)}>${escape_html(potencialConfig[prof.potencial]?.label ?? prof.potencial)}</span></td><td class="p-3.5 text-center"><span${attr_class(`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${stringify(estagioConfig[prof.estagioPipeline].class)}`)}>${escape_html(estagioConfig[prof.estagioPipeline].label)}</span></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button title="Ver detalhes" class="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer">`);
          Eye($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(`<!----></button> <a${attr("href", `/dashboard/profissionais/${prof.id}`)} title="Agenda / Visitas" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer">`);
          Calendar($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(`<!----></a> <button${attr("disabled", prof.estagioPipeline === "PROSPECTADO" || !isAtivo, true)} title="Retroceder estágio" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">`);
          Arrow_left($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(`<!----></button> <button${attr("disabled", prof.estagioPipeline === "FIDELIZADO" || !isAtivo, true)} title="Avançar estágio" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">`);
          Arrow_right($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(`<!----></button> <button${attr("title", isAtivo ? "Inativar" : "Ativar")}${attr_class(`p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer ${stringify(isAtivo ? "hover:text-amber-600" : "hover:text-green-600")}`)}>`);
          if (isAtivo) {
            $$renderer3.push("<!--[0-->");
            Power($$renderer3, { class: "w-3.5 h-3.5" });
          } else {
            $$renderer3.push("<!--[-1-->");
            Play($$renderer3, { class: "w-3.5 h-3.5" });
          }
          $$renderer3.push(`<!--]--></button> <button title="Editar" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-blue-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer">`);
          Pencil($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(`<!----></button> <button title="Excluir" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer">`);
          Trash_2($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(`<!----></button></div></td></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody></table></div> `);
        if (pagination.totalPages > 1) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mt-4 flex items-center justify-between"><p class="text-xs text-slate-400">Página ${escape_html(pagination.page)} de ${escape_html(pagination.totalPages)} · ${escape_html(pagination.total)} total</p> <div class="flex gap-1.5">`);
          Button($$renderer3, {
            variant: "outline",
            size: "sm",
            onclick: () => fetchProfissionais(pagination.page - 1),
            disabled: pagination.page <= 1,
            children: ($$renderer4) => {
              Chevron_left($$renderer4, { class: "h-4 w-4" });
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            variant: "outline",
            size: "sm",
            onclick: () => fetchProfissionais(pagination.page + 1),
            disabled: pagination.page >= pagination.totalPages,
            children: ($$renderer4) => {
              Chevron_right($$renderer4, { class: "h-4 w-4" });
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--> `);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<div class="space-y-5"><div><h3 class="text-lg font-semibold text-slate-900">${escape_html(profissionalEmEdicao ? "Editar Profissional" : "Novo Profissional")}</h3> <p class="text-sm text-slate-400 mt-1">${escape_html(profissionalEmEdicao ? "Atualize os dados abaixo" : "Preencha os dados para cadastrar")}</p></div> <section><h4 class="section-header">`);
          Users($$renderer4, { class: "h-3.5 w-3.5" });
          $$renderer4.push(`<!----> Dados Básicos</h4> <div class="space-y-3"><div class="grid gap-3" style="grid-template-columns: 30% 1fr"><div><label for="prof-tratamento" class="input-label">Tratamento</label> `);
          $$renderer4.select(
            {
              id: "prof-tratamento",
              value: formTratamento,
              class: "input-base"
            },
            ($$renderer5) => {
              $$renderer5.option({ value: "" }, ($$renderer6) => {
                $$renderer6.push(`Nenhum`);
              });
              $$renderer5.option({ value: "DR" }, ($$renderer6) => {
                $$renderer6.push(`Dr.`);
              });
              $$renderer5.option({ value: "DRA" }, ($$renderer6) => {
                $$renderer6.push(`Dra.`);
              });
              $$renderer5.option({ value: "PROF" }, ($$renderer6) => {
                $$renderer6.push(`Prof.`);
              });
              $$renderer5.option({ value: "PROFA" }, ($$renderer6) => {
                $$renderer6.push(`Profa.`);
              });
              $$renderer5.option({ value: "SR" }, ($$renderer6) => {
                $$renderer6.push(`Sr.`);
              });
              $$renderer5.option({ value: "SRA" }, ($$renderer6) => {
                $$renderer6.push(`Sra.`);
              });
            }
          );
          $$renderer4.push(`</div> <div><label for="prof-nome" class="input-label">Nome completo *</label> <input id="prof-nome" type="text"${attr("value", formNome)} class="input-base" placeholder="João Silva"/></div></div> <div><label for="prof-cpfcnpj" class="input-label">CPF/CNPJ</label> <input id="prof-cpfcnpj" type="text"${attr("value", formCpfCnpj)} class="input-base" placeholder="000.000.000-00"/></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-crm" class="input-label">CRM</label> <input id="prof-crm" type="text"${attr("value", formCrm)} class="input-base" placeholder="123456"/> <p class="text-xs text-slate-400 mt-1">Registro profissional</p></div> <div><label for="prof-crm-uf" class="input-label">UF do CRM</label> <input id="prof-crm-uf" type="text"${attr("value", formEstado)} class="input-base" placeholder="SP"${attr("maxlength", 2)}/> <p class="text-xs text-slate-400 mt-1">Estado do registro</p></div></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-sexo" class="input-label">Sexo</label> `);
          $$renderer4.select({ id: "prof-sexo", value: formSexo, class: "input-base" }, ($$renderer5) => {
            $$renderer5.option({ value: "NAO_INFORMADO" }, ($$renderer6) => {
              $$renderer6.push(`Não informado`);
            });
            $$renderer5.option({ value: "MASCULINO" }, ($$renderer6) => {
              $$renderer6.push(`Masculino`);
            });
            $$renderer5.option({ value: "FEMININO" }, ($$renderer6) => {
              $$renderer6.push(`Feminino`);
            });
          });
          $$renderer4.push(`</div> <div><label for="prof-nascimento" class="input-label">Data de Nascimento</label> <input id="prof-nascimento" type="date"${attr("value", formDataNascimento)} class="input-base"/></div></div> <div><label for="prof-cadastro" class="input-label">Data de Cadastro</label> <input id="prof-cadastro" type="date"${attr("value", profissionalEmEdicao?.id ? profissionais.find((p) => p.id === profissionalEmEdicao?.id)?.createdAt?.split("T")[0] ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0])} disabled="" class="input-base opacity-60 cursor-not-allowed"/> <p class="text-xs text-slate-400 mt-1">Preenchido automaticamente</p></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header">`);
          Phone($$renderer4, { class: "h-3.5 w-3.5" });
          $$renderer4.push(`<!----> Contato</h4> <div class="space-y-3"><div><label for="prof-tel" class="input-label">Telefone</label> <input id="prof-tel" type="text"${attr("value", formTelefone)} class="input-base" placeholder="(11) 99999-0000"/></div> <div><label for="prof-email" class="input-label">E-mail</label> <input id="prof-email" type="email"${attr("value", formEmail)} class="input-base" placeholder="email@exemplo.com"/></div> <div class="mt-2"><div class="flex items-center justify-between mb-2"><span class="text-xs font-medium text-slate-500">Contatos adicionais</span> <button type="button" class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 cursor-pointer hover:-translate-y-[1px] active:scale-[0.98]">`);
          Plus($$renderer4, { class: "h-3.5 w-3.5" });
          $$renderer4.push(`<!----> Adicionar</button></div> `);
          if (formContatos.length === 0) {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<p class="text-xs text-slate-400 italic py-2">Nenhum contato adicional cadastrado</p>`);
          } else {
            $$renderer4.push("<!--[-1-->");
            $$renderer4.push(`<div class="space-y-2.5"><!--[-->`);
            const each_array_2 = ensure_array_like(formContatos);
            for (let idx = 0, $$length = each_array_2.length; idx < $$length; idx++) {
              let contato = each_array_2[idx];
              $$renderer4.push(`<div class="relative rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-all duration-200 hover:border-slate-300"><button type="button" title="Remover contato" class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95">`);
              X($$renderer4, { class: "h-3 w-3" });
              $$renderer4.push(`<!----></button> <div class="space-y-2"><div class="w-full"><label${attr("for", `contato-tipo-${stringify(idx)}`)} class="input-label text-[10px]">Tipo</label> `);
              $$renderer4.select(
                {
                  id: `contato-tipo-${stringify(idx)}`,
                  value: contato.tipo,
                  class: "input-base text-xs w-full"
                },
                ($$renderer5) => {
                  $$renderer5.option({ value: "TELEFONE" }, ($$renderer6) => {
                    $$renderer6.push(`Telefone`);
                  });
                  $$renderer5.option({ value: "EMAIL" }, ($$renderer6) => {
                    $$renderer6.push(`Email`);
                  });
                  $$renderer5.option({ value: "WHATSAPP" }, ($$renderer6) => {
                    $$renderer6.push(`WhatsApp`);
                  });
                  $$renderer5.option({ value: "OUTRO" }, ($$renderer6) => {
                    $$renderer6.push(`Outro`);
                  });
                }
              );
              $$renderer4.push(`</div> <div class="w-full"><label${attr("for", `contato-valor-${stringify(idx)}`)} class="input-label text-[10px]">Valor</label> <input${attr("id", `contato-valor-${stringify(idx)}`)}${attr("type", contato.tipo === "EMAIL" ? "email" : "text")}${attr("value", contato.valor)} class="input-base text-xs w-full"${attr("placeholder", contato.tipo === "EMAIL" ? "email@exemplo.com" : contato.tipo === "WHATSAPP" ? "(11) 99999-0000" : contato.tipo === "TELEFONE" ? "(11) 99999-0000" : "Valor do contato")}/></div> <div class="w-full"><label${attr("for", `contato-obs-${stringify(idx)}`)} class="input-label text-[10px]">Observação</label> <textarea${attr("id", `contato-obs-${stringify(idx)}`)}${attr("rows", 2)} class="input-base text-xs resize-none w-full" placeholder="Secretária, horário...">`);
              const $$body = escape_html(contato.observacao);
              if ($$body) {
                $$renderer4.push(`${$$body}`);
              }
              $$renderer4.push(`</textarea></div></div></div>`);
            }
            $$renderer4.push(`<!--]--></div>`);
          }
          $$renderer4.push(`<!--]--></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header">`);
          Map_pin($$renderer4, { class: "h-3.5 w-3.5" });
          $$renderer4.push(`<!----> Atuação</h4> <div class="space-y-3"><div><label for="prof-esp" class="input-label">Especialidade</label> `);
          $$renderer4.select(
            {
              id: "prof-esp",
              value: formEspecialidadeId,
              class: "input-base"
            },
            ($$renderer5) => {
              $$renderer5.option({ value: "" }, ($$renderer6) => {
                $$renderer6.push(`Selecione a especialidade...`);
              });
              $$renderer5.push(`<!--[-->`);
              const each_array_3 = ensure_array_like(categoriasOrdenadas());
              for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
                let cat = each_array_3[$$index_4];
                $$renderer5.push(`<optgroup${attr("label", cat)}><!--[-->`);
                const each_array_4 = ensure_array_like(especialidadesAgrupadas()[cat]);
                for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
                  let esp = each_array_4[$$index_3];
                  $$renderer5.option({ value: esp.id }, ($$renderer6) => {
                    $$renderer6.push(`${escape_html(esp.nome)}`);
                  });
                }
                $$renderer5.push(`<!--]--></optgroup>`);
              }
              $$renderer5.push(`<!--]-->`);
            }
          );
          $$renderer4.push(`</div> `);
          if (formEspecialidadeId && subEspecialidades.length > 0) {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div><label for="prof-sub" class="input-label">Subespecialidade</label> `);
            $$renderer4.select(
              {
                id: "prof-sub",
                value: formSubEspecialidadeId,
                class: "input-base"
              },
              ($$renderer5) => {
                $$renderer5.option({ value: "" }, ($$renderer6) => {
                  $$renderer6.push(`Nenhuma`);
                });
                $$renderer5.push(`<!--[-->`);
                const each_array_5 = ensure_array_like(subEspecialidades);
                for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
                  let sub = each_array_5[$$index_5];
                  $$renderer5.option({ value: sub.id }, ($$renderer6) => {
                    $$renderer6.push(`${escape_html(sub.nome)}`);
                  });
                }
                $$renderer5.push(`<!--]-->`);
              }
            );
            $$renderer4.push(`</div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> <div><label for="prof-cep" class="input-label">CEP</label> <div class="relative max-w-xs"><input id="prof-cep" type="text"${attr("value", formCep)} class="input-base !pr-8" placeholder="01001-000"${attr("maxlength", 9)}/> `);
          {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--></div> <p class="text-xs text-slate-400 mt-1">Preenche endereço, bairro, cidade e UF</p></div> <div><label for="prof-logradouro" class="input-label">Endereço</label> <textarea id="prof-logradouro"${attr("rows", 2)} class="input-base resize-none leading-relaxed" placeholder="Rua, Av., Alameda...">`);
          const $$body_1 = escape_html(formLogradouro);
          if ($$body_1) {
            $$renderer4.push(`${$$body_1}`);
          }
          $$renderer4.push(`</textarea></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-numero" class="input-label">Número</label> <input id="prof-numero" type="text"${attr("value", formNumero)} class="input-base" placeholder="123"/></div> <div><label for="prof-complemento" class="input-label">Complemento</label> <input id="prof-complemento" type="text"${attr("value", formComplemento)} class="input-base" placeholder="Sala 10, Bloco B"/></div></div> <div><label for="prof-bairro" class="input-label">Bairro</label> <input id="prof-bairro" type="text"${attr("value", formBairro)} class="input-base" placeholder="Centro"/></div> <div class="grid grid-cols-4 gap-3"><div class="col-span-3"><label for="prof-cidade" class="input-label">Cidade</label> <input id="prof-cidade" type="text"${attr("value", formCidade)} class="input-base" placeholder="São Paulo"/></div> <div class="col-span-1"><label for="prof-estado" class="input-label">UF</label> <input id="prof-estado" type="text"${attr("value", formEstado)} class="input-base text-center" placeholder="SP"${attr("maxlength", 2)}/></div></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Classificação</h4> <div class="space-y-5"><div><span class="input-label">Potencial de prescrição</span> <div class="segmented-control" role="group" aria-label="Potencial de prescrição"><!--[-->`);
          const each_array_6 = ensure_array_like([
            { value: "ALTO", label: "Alto", active: "seg-active-emerald" },
            { value: "MEDIO", label: "Médio", active: "seg-active-amber" },
            { value: "BAIXO", label: "Baixo", active: "seg-active-orange" },
            {
              value: "ESTRATEGICO",
              label: "Estratégico",
              active: "seg-active-indigo"
            }
          ]);
          for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
            let opt = each_array_6[$$index_6];
            $$renderer4.push(`<button type="button"${attr_class(`segmented-btn ${stringify(formPotencial === opt.value ? opt.active : "")}`)}>${escape_html(opt.label)}</button>`);
          }
          $$renderer4.push(`<!--]--></div> <p class="text-xs text-slate-400 mt-1.5">Volume estimado de prescrições</p></div> <div class="mt-5"><span class="input-label">Estágio no pipeline</span> <div class="segmented-control" role="group" aria-label="Estágio no pipeline"><!--[-->`);
          const each_array_7 = ensure_array_like([
            {
              value: "PROSPECTADO",
              label: "Prospectado",
              active: "seg-active-blue"
            },
            {
              value: "VISITADO",
              label: "Visitado",
              active: "seg-active-sky"
            },
            {
              value: "INTERESSADO",
              label: "Interessado",
              active: "seg-active-amber"
            },
            {
              value: "PRESCRITOR",
              label: "Prescritor",
              active: "seg-active-emerald"
            },
            {
              value: "FIDELIZADO",
              label: "Fidelizado",
              active: "seg-active-indigo"
            }
          ]);
          for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
            let opt = each_array_7[$$index_7];
            $$renderer4.push(`<button type="button"${attr_class(`segmented-btn ${stringify(formEstagio === opt.value ? opt.active : "")}`)}>${escape_html(opt.label)}</button>`);
          }
          $$renderer4.push(`<!--]--></div> <p class="text-xs text-slate-400 mt-1.5">Acompanhamento do relacionamento</p></div> <div class="mt-5"><span class="input-label">Classificação do relacionamento</span> <div class="rounded-lg border border-slate-200 bg-slate-50 p-1"><div class="grid grid-cols-3 gap-1" role="group" aria-label="Classificação do relacionamento"><button type="button"${attr_class(`segmented-btn col-span-1 ${stringify(formClassificacao === "FORTE" ? "seg-active-emerald" : "")}`)}>Forte</button> <button type="button"${attr_class(`segmented-btn col-span-1 ${stringify(formClassificacao === "INTERMEDIARIO" ? "seg-active-amber" : "")}`)}>Intermediário</button> <button type="button"${attr_class(`segmented-btn col-span-1 ${stringify(formClassificacao === "FRACO" ? "seg-active-rose" : "")}`)}>Fraco</button> <button type="button"${attr_class(`segmented-btn col-span-3 ${stringify(formClassificacao === "" ? "seg-active-slate" : "")}`)}>Não definida</button></div></div></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> Informações Complementares</h4> <div class="space-y-3"><div><label for="prof-observacoes" class="input-label">Observações</label> <textarea id="prof-observacoes"${attr("rows", 3)} class="input-base resize-none" placeholder="Anotações gerais...">`);
          const $$body_2 = escape_html(formObservacoes);
          if ($$body_2) {
            $$renderer4.push(`${$$body_2}`);
          }
          $$renderer4.push(`</textarea></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-conjuge" class="input-label">Nome do Cônjuge</label> <input id="prof-conjuge" type="text"${attr("value", formNomeConjuge)} class="input-base" placeholder="Nome do cônjuge"/></div> <div><label for="prof-nasc-conjuge" class="input-label">Data Nasc. Cônjuge</label> <input id="prof-nasc-conjuge" type="date"${attr("value", formDataNascConjuge)} class="input-base"/></div></div></div></section> <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">`);
          Button($$renderer4, {
            variant: "outline",
            onclick: () => sheetOpen = false,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Cancelar`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            onclick: handleSalvarProfissional,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html(profissionalEmEdicao ? "Salvar Alterações" : "Cadastrar Profissional")}`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div>`);
        };
        Sheet($$renderer3, {
          onclose: () => sheetOpen = false,
          get open() {
            return sheetOpen;
          },
          set open($$value) {
            sheetOpen = $$value;
            $$settled = false;
          },
          children,
          $$slots: { default: true }
        });
      }
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      Button($$renderer3, {
        class: "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden",
        onclick: handleNovoProfissional,
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-6 w-6 text-white" });
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      {
        let description = function($$renderer4) {
          if (profToDelete) {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<p>Você está prestes a excluir <strong>"${escape_html(profToDelete.nome)}"</strong>.</p> <p>Esta ação não pode ser desfeita.</p>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        ConfirmDialog($$renderer3, {
          open: deleteConfirmOpen,
          onclose: () => {
            deleteConfirmOpen = false;
            profToDelete = null;
          },
          title: "Excluir profissional",
          onconfirm: confirmDeleteProfissional,
          variant: "danger",
          description
        });
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
