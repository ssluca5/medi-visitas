import "../chunks/Bzak7iHL.js";
import { o as vo } from "../chunks/BGJvssSt.js";
import {
  e as Qt,
  f as Ee,
  a as c,
  p as po,
  U as v,
  V as $t,
  I as Ms,
  z as e,
  B as o,
  b as uo,
  h as mo,
  d as a,
  s,
  c as b,
  F as ye,
  W as Ka,
  t as I,
  $ as fo,
  r as t,
  X as z,
  Y as Qa,
} from "../chunks/CZsNqhY1.js";
import { s as f } from "../chunks/D4SvF6kG.js";
import {
  l as ts,
  s as as,
  i as U,
  a as bo,
  b as _o,
} from "../chunks/CsBhEEN0.js";
import {
  I as ss,
  s as os,
  e as Le,
  i as Ze,
  X as Ls,
} from "../chunks/D_ntMQAe.js";
import { h as xo } from "../chunks/C57bVzq3.js";
import {
  d as Ge,
  b as Z,
  g as go,
  s as P,
  r as H,
} from "../chunks/DDioZlon.js";
import { d as ho, a as O, e as wo } from "../chunks/BLFvJadL.js";
import { a as Be, b as F } from "../chunks/DFOm60R7.js";
import { P as yo, M as Eo, p as Po, A as Oo } from "../chunks/DTLLfViW.js";
import { g as $o } from "../chunks/BGWMiPqM.js";
import { t as me } from "../chunks/BG-wUOgw.js";
import { B as We } from "../chunks/DI35S9H6.js";
import { S as Co, C as Ao, T as ko } from "../chunks/CSHFKzA8.js";
import { S as Io } from "../chunks/eFcn31mN.js";
import { U as ba } from "../chunks/DoHM5GQu.js";
import { S as So } from "../chunks/EGrcUm4A.js";
import { P as _a } from "../chunks/DpW8pZ2L.js";
import "../chunks/CUONaVJB.js";
import { C as es } from "../chunks/D9kr8FOy.js";
import { P as To, a as No } from "../chunks/YBzjEPSW.js";
import { C as Ro } from "../chunks/qvlMHhdT.js";
import { C as jo } from "../chunks/3qHYYpT2.js";
import { C as Do } from "../chunks/CjOXa5Yh.js";
import { P as Fo } from "../chunks/DgL0CZso.js";
function Mo(Ye, M) {
  const qe = ts(M, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const Ke = [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "m12 5 7 7-7 7" }],
  ];
  ss(
    Ye,
    as({ name: "arrow-right" }, () => qe, {
      get iconNode() {
        return Ke;
      },
      children: (Qe, L) => {
        var S = Qt(),
          Te = Ee(S);
        (os(Te, M, "default", {}), c(Qe, S));
      },
      $$slots: { default: !0 },
    }),
  );
}
function Lo(Ye, M) {
  const qe = ts(M, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const Ke = [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }],
  ];
  ss(
    Ye,
    as({ name: "eye" }, () => qe, {
      get iconNode() {
        return Ke;
      },
      children: (Qe, L) => {
        var S = Qt(),
          Te = Ee(S);
        (os(Te, M, "default", {}), c(Qe, S));
      },
      $$slots: { default: !0 },
    }),
  );
}
function Bo(Ye, M) {
  const qe = ts(M, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const Ke = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]];
  ss(
    Ye,
    as({ name: "loader-circle" }, () => qe, {
      get iconNode() {
        return Ke;
      },
      children: (Qe, L) => {
        var S = Qt(),
          Te = Ee(S);
        (os(Te, M, "default", {}), c(Qe, S));
      },
      $$slots: { default: !0 },
    }),
  );
}
var Vo = b("<!> Novo Profissional", 1),
  zo = b("<option> </option>"),
  Uo = b(
    '<div class="card-surface flex items-center justify-center py-20"><div class="flex flex-col items-center gap-3"><div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div> <span class="text-sm text-slate-400">Carregando profissionais...</span></div></div>',
  ),
  Jo = b(
    '<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50"><!></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Erro ao carregar</p> <p class="text-xs text-slate-400 mt-1"> </p></div> <!></div>',
  ),
  Ho = b("<!> Adicionar Profissional", 1),
  Xo = b(
    '<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100"><!></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Nenhum profissional encontrado</p> <p class="text-xs text-slate-400 mt-1">Use os filtros acima ou adicione um novo</p></div> <!></div>',
  ),
  Zo = b(
    '<tr><td class="p-3.5"><div class="flex items-center gap-3"><div> </div> <div class="min-w-0"><p> </p> <p> </p></div></div></td><td class="p-3.5 text-center"><span class="text-sm text-slate-700 truncate block font-medium"> </span></td><td class="p-3.5 text-center"><span class="text-sm text-slate-500 truncate block"> </span></td><td class="p-3.5 text-center"><span> </span></td><td class="p-3.5 text-center"><span> </span></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button title="Ver detalhes" class="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"><!></button> <a title="Agenda / Visitas" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"><!></a> <button title="Retroceder estágio" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><!></button> <button title="Avançar estágio" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><!></button> <button><!></button> <button title="Excluir" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"><!></button></div></td></tr>',
  ),
  Go = b(
    '<div class="mt-4 flex items-center justify-between"><p class="text-xs text-slate-400"> </p> <div class="flex gap-1.5"><!> <!></div></div>',
  ),
  Wo = b(
    '<div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[24%]">Nome</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[18%]">Especialidade</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[16%]">Subespecialidade</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Potencial</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Estágio</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[18%]">Ações</th></tr></thead><tbody></tbody></table></div> <!>',
    1,
  ),
  Yo = b(
    '<p class="text-xs text-slate-400 italic py-2">Nenhum contato adicional cadastrado</p>',
  ),
  qo = b(
    '<div class="relative rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-all duration-200 hover:border-slate-300"><button type="button" title="Remover contato" class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"><!></button> <div class="space-y-2"><div class="w-full"><label class="input-label text-[10px]">Tipo</label> <select class="input-base text-xs w-full"><option>Telefone</option><option>Email</option><option>WhatsApp</option><option>Outro</option></select></div> <div class="w-full"><label class="input-label text-[10px]">Valor</label> <input class="input-base text-xs w-full"/></div> <div class="w-full"><label class="input-label text-[10px]">Observação</label> <textarea class="input-base text-xs resize-none w-full" placeholder="Secretária, horário..."></textarea></div></div></div>',
  ),
  Ko = b('<div class="space-y-2.5"></div>'),
  Qo = b("<option> </option>"),
  ei = b("<optgroup></optgroup>"),
  ti = b("<option> </option>"),
  ai = b(
    '<div><label for="prof-sub" class="input-label">Subespecialidade</label> <select id="prof-sub" class="input-base"><option>Nenhuma</option><!></select></div>',
  ),
  si = b('<div class="absolute right-2 top-1/2 -translate-y-1/2"><!></div>'),
  oi = b('<button type="button"> </button>'),
  ii = b('<button type="button"> </button>'),
  ri = b(
    '<div class="space-y-5"><div><h3 class="text-lg font-semibold text-slate-900"> </h3> <p class="text-sm text-slate-400 mt-1"> </p></div> <section><h4 class="section-header"><!> Dados Básicos</h4> <div class="space-y-3"><div class="grid gap-3" style="grid-template-columns: 30% 1fr"><div><label for="prof-tratamento" class="input-label">Tratamento</label> <select id="prof-tratamento" class="input-base"><option>Nenhum</option><option>Dr.</option><option>Dra.</option><option>Prof.</option><option>Profa.</option><option>Sr.</option><option>Sra.</option></select></div> <div><label for="prof-nome" class="input-label">Nome completo *</label> <input id="prof-nome" type="text" class="input-base" placeholder="João Silva"/></div></div> <div><label for="prof-cpfcnpj" class="input-label">CPF/CNPJ</label> <input id="prof-cpfcnpj" type="text" class="input-base" placeholder="000.000.000-00"/></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-crm" class="input-label">CRM</label> <input id="prof-crm" type="text" class="input-base" placeholder="123456"/> <p class="text-xs text-slate-400 mt-1">Registro profissional</p></div> <div><label for="prof-crm-uf" class="input-label">UF do CRM</label> <input id="prof-crm-uf" type="text" class="input-base" placeholder="SP"/> <p class="text-xs text-slate-400 mt-1">Estado do registro</p></div></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-sexo" class="input-label">Sexo</label> <select id="prof-sexo" class="input-base"><option>Não informado</option><option>Masculino</option><option>Feminino</option></select></div> <div><label for="prof-nascimento" class="input-label">Data de Nascimento</label> <input id="prof-nascimento" type="date" class="input-base"/></div></div> <div><label for="prof-cadastro" class="input-label">Data de Cadastro</label> <input id="prof-cadastro" type="date" disabled="" class="input-base opacity-60 cursor-not-allowed"/> <p class="text-xs text-slate-400 mt-1">Preenchido automaticamente</p></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header"><!> Contato</h4> <div class="space-y-3"><div><label for="prof-tel" class="input-label">Telefone</label> <input id="prof-tel" type="text" class="input-base" placeholder="(11) 99999-0000"/></div> <div><label for="prof-email" class="input-label">E-mail</label> <input id="prof-email" type="email" class="input-base" placeholder="email@exemplo.com"/></div> <div class="mt-2"><div class="flex items-center justify-between mb-2"><span class="text-xs font-medium text-slate-500">Contatos adicionais</span> <button type="button" class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 cursor-pointer hover:-translate-y-[1px] active:scale-[0.98]"><!> Adicionar</button></div> <!></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header"><!> Atuação</h4> <div class="space-y-3"><div><label for="prof-esp" class="input-label">Especialidade</label> <select id="prof-esp" class="input-base"><option>Selecione a especialidade...</option><!></select></div> <!> <div><label for="prof-cep" class="input-label">CEP</label> <div class="relative max-w-xs"><input id="prof-cep" type="text" class="input-base !pr-8" placeholder="01001-000"/> <!></div> <p class="text-xs text-slate-400 mt-1">Preenche endereço, bairro, cidade e UF</p></div> <div><label for="prof-logradouro" class="input-label">Endereço</label> <textarea id="prof-logradouro" class="input-base resize-none leading-relaxed" placeholder="Rua, Av., Alameda..."></textarea></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-numero" class="input-label">Número</label> <input id="prof-numero" type="text" class="input-base" placeholder="123"/></div> <div><label for="prof-complemento" class="input-label">Complemento</label> <input id="prof-complemento" type="text" class="input-base" placeholder="Sala 10, Bloco B"/></div></div> <div><label for="prof-bairro" class="input-label">Bairro</label> <input id="prof-bairro" type="text" class="input-base" placeholder="Centro"/></div> <div class="grid grid-cols-4 gap-3"><div class="col-span-3"><label for="prof-cidade" class="input-label">Cidade</label> <input id="prof-cidade" type="text" class="input-base" placeholder="São Paulo"/></div> <div class="col-span-1"><label for="prof-estado" class="input-label">UF</label> <input id="prof-estado" type="text" class="input-base text-center" placeholder="SP"/></div></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Classificação</h4> <div class="space-y-5"><div><span class="input-label">Potencial de prescrição</span> <div class="segmented-control" role="group" aria-label="Potencial de prescrição"></div> <p class="text-xs text-slate-400 mt-1.5">Volume estimado de prescrições</p></div> <div class="mt-5"><span class="input-label">Estágio no pipeline</span> <div class="segmented-control" role="group" aria-label="Estágio no pipeline"></div> <p class="text-xs text-slate-400 mt-1.5">Acompanhamento do relacionamento</p></div> <div class="mt-5"><span class="input-label">Classificação do relacionamento</span> <div class="rounded-lg border border-slate-200 bg-slate-50 p-1"><div class="grid grid-cols-3 gap-1" role="group" aria-label="Classificação do relacionamento"><button type="button">Forte</button> <button type="button">Intermediário</button> <button type="button">Fraco</button> <button type="button">Não definida</button></div></div></div></div></section> <section class="border-t border-slate-100 pt-6 mt-6"><h4 class="section-header"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> Informações Complementares</h4> <div class="space-y-3"><div><label for="prof-observacoes" class="input-label">Observações</label> <textarea id="prof-observacoes" class="input-base resize-none" placeholder="Anotações gerais..."></textarea></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-conjuge" class="input-label">Nome do Cônjuge</label> <input id="prof-conjuge" type="text" class="input-base" placeholder="Nome do cônjuge"/></div> <div><label for="prof-nasc-conjuge" class="input-label">Data Nasc. Cônjuge</label> <input id="prof-nasc-conjuge" type="date" class="input-base"/></div></div></div></section> <div class="flex justify-end gap-3 pt-4 border-t border-slate-100"><!> <!></div></div>',
  ),
  li = b(
    '<div class="mt-8"><p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Endereço</p> <div class="grid grid-cols-2 gap-x-8 gap-y-4"><div><p class="text-xs text-slate-500 mb-1">CEP</p> <p> </p></div> <div><p class="text-xs text-slate-500 mb-1">Logradouro</p> <p> </p></div> <div><p class="text-xs text-slate-500 mb-1">Bairro</p> <p> </p></div> <div><p class="text-xs text-slate-500 mb-1">Cidade/UF</p> <p> </p></div></div></div>',
  ),
  ni = b("<span> </span>"),
  di = b('<p class="text-sm font-semibold text-slate-300">—</p>'),
  ci = b("<span> </span>"),
  vi = b('<p class="text-sm font-semibold text-slate-300">—</p>'),
  pi = b("<span> </span>"),
  ui = b('<p class="text-sm font-semibold text-slate-300">—</p>'),
  mi = b(
    '<div class="mt-8"><p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Observações</p> <p class="text-sm font-semibold text-slate-800"> </p></div>',
  ),
  fi = b(
    '<div><p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dados Pessoais</p> <div class="grid grid-cols-2 gap-x-8 gap-y-4"><div><p class="text-xs text-slate-500 mb-1">CRM</p> <p> </p></div> <div><p class="text-xs text-slate-500 mb-1">CPF/CNPJ</p> <p> </p></div> <div><p class="text-xs text-slate-500 mb-1">Sexo</p> <p> </p></div> <div><p class="text-xs text-slate-500 mb-1">Nascimento</p> <p> </p></div></div></div> <div class="mt-8"><p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contato</p> <div class="grid grid-cols-2 gap-x-8 gap-y-4"><div><p class="text-xs text-slate-500 mb-1">Telefone</p> <p> </p></div> <div><p class="text-xs text-slate-500 mb-1">Email</p> <p> </p></div></div></div> <!> <div class="mt-8"><p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Classificação</p> <div class="grid grid-cols-3 gap-x-8 gap-y-4"><div><p class="text-xs text-slate-500 mb-1">Potencial</p> <!></div> <div><p class="text-xs text-slate-500 mb-1">Estágio</p> <!></div> <div><p class="text-xs text-slate-500 mb-1">Relacionamento</p> <!></div></div></div> <!>',
    1,
  ),
  bi = b(
    '<div class="flex justify-center py-12"><div class="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>',
  ),
  _i = b(
    '<div class="text-center py-16"><div class="flex justify-center mb-3"><div class="bg-slate-100 p-3 rounded-full"><!></div></div> <p class="text-sm font-medium text-slate-500">Nenhuma visita registrada</p> <p class="text-xs text-slate-400 mt-1">Este profissional ainda não possui visitas cadastradas.</p></div>',
  ),
  xi = b('<div class="flex items-center gap-1"><!> <span> </span></div>'),
  gi = b('<div class="flex items-center gap-1"><!> <span> </span></div>'),
  hi = b(
    '<p class="text-xs text-slate-600 mt-2 line-clamp-2"><span class="font-medium">Objetivo:</span> </p>',
  ),
  wi = b(
    '<p class="text-xs text-slate-600 mt-1 line-clamp-2"><span class="font-medium">Resumo:</span> </p>',
  ),
  yi = b(
    '<div class="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors"><div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2 text-sm"><!> <span class="font-semibold text-slate-700"> </span></div> <!></div> <div class="flex items-center gap-4 text-xs text-slate-500"><!> <!></div> <!> <!></div>',
  ),
  Ei = b('<div class="space-y-3"></div>'),
  Pi = b(
    '<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" tabindex="-1"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" role="document"><div class="flex items-start justify-between p-6 border-b border-slate-100"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0"> </div> <div><h2 class="text-xl font-bold text-slate-900"> </h2> <p class="text-sm font-medium text-slate-500 mt-0.5"> </p></div></div> <button class="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-4"><!></button></div> <div class="flex border-b border-slate-100"><button type="button">Dados</button> <button type="button">Últimas Visitas</button></div> <div class="p-6"><!></div> <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100"><button class="px-4 py-2 text-sm font-medium text-slate-600 border border-transparent hover:bg-slate-50 rounded-lg transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer">Fechar</button> <button class="px-4 py-2 text-sm font-medium text-white shadow-sm rounded-lg transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer" style="background-color: var(--color-blue-600, #2563eb)">Editar cadastro</button></div></div></div>',
  ),
  Oi = b(
    "<p>Você está prestes a excluir <strong> </strong>.</p> <p>Esta ação não pode ser desfeita.</p>",
    1,
  ),
  $i = b(
    '<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"><!></div> <div><h1 class="text-lg font-bold text-slate-800">Profissionais</h1> <p class="text-[11px] text-slate-400">Gerencie o cadastro e a classificação dos médicos</p></div></div> <div class="flex items-center gap-2"><!></div></div> <div class="card-surface p-4 mb-6"><div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"><div class="relative"><!> <input type="text" placeholder="Buscar por nome ou CRM..." class="input-base !pl-9"/></div> <select class="input-base"><option>Todos os potenciais</option><option>Alto</option><option>Médio</option><option>Baixo</option><option>Estratégico</option></select> <select class="input-base"><option>Todos os estágios</option><!></select> <select class="input-base"><option>Todas as classificações</option><option>Forte</option><option>Intermediário</option><option>Fraco</option></select></div></div> <!> <!> <!> <!> <!>',
    1,
  );
function Qi(Ye, M) {
  po(M, !0);
  const qe = () => _o(Po, "$page", Ke),
    [Ke, Qe] = bo();
  let L = v($t([])),
    S = v($t({ page: 1, pageSize: 20, total: 0, totalPages: 0 })),
    Te = v(!0),
    ea = v(null),
    ta = v(""),
    aa = v(""),
    sa = v(""),
    oa = v(""),
    et = v(!1),
    fe = v(null),
    is = v($t([])),
    tt = v($t([])),
    Ct = v(!1),
    Ne = v(null),
    pt = v(""),
    At = v(""),
    kt = v(""),
    It = v(""),
    St = v(""),
    Tt = v("PROSPECTADO"),
    Ve = v(""),
    Pe = v(""),
    be = v(""),
    ut = v(""),
    mt = v(""),
    Nt = v(""),
    Rt = v(""),
    ft = v(""),
    bt = v(""),
    ze = v(""),
    xa = v(!1),
    Re = v($t([])),
    jt = v(""),
    Dt = v("NAO_INFORMADO"),
    _t = v(""),
    Ft = v(""),
    Mt = v(""),
    Lt = v(""),
    xt = v(""),
    p = v(null),
    at = v(!1),
    gt = v("dados"),
    ia = v($t([])),
    ga = v(!1);
  async function Bs(i) {
    o(ga, !0);
    try {
      const r = await Be(
        `/visitas?profissionalId=${i}&pageSize=20`,
        M.data.sessionToken,
      );
      if (r.ok) {
        const l = await r.json();
        o(ia, l.data || l, !0);
      }
    } catch (r) {
      (console.error("Erro ao carregar visitas:", r), o(ia, [], !0));
    } finally {
      o(ga, !1);
    }
  }
  async function Vs() {
    const i = e(ut).replace(/\D/g, "");
    if (i.length === 8) {
      o(xa, !0);
      try {
        const r = await fetch(`https://viacep.com.br/ws/${i}/json/`);
        if (!r.ok) return;
        const l = await r.json();
        if (l.erro) {
          me.show("error", "CEP não encontrado");
          return;
        }
        (o(mt, l.logradouro || "", !0),
          o(ft, l.bairro || "", !0),
          o(bt, l.localidade || "", !0),
          o(ze, l.uf || "", !0));
      } catch {
        me.show("error", "Erro ao buscar CEP");
      } finally {
        o(xa, !1);
      }
    }
  }
  function zs() {
    o(Re, [...e(Re), { tipo: "TELEFONE", valor: "", observacao: "" }], !0);
  }
  function Us(i) {
    o(
      Re,
      e(Re).filter((r, l) => l !== i),
      !0,
    );
  }
  const Bt = {
      ALTO: { label: "Alto", class: "bg-emerald-50 text-emerald-700" },
      MEDIO: { label: "Médio", class: "bg-amber-50 text-amber-700" },
      BAIXO: { label: "Baixo", class: "bg-red-50 text-red-600" },
      ESTRATEGICO: {
        label: "Estratégico",
        class: "bg-violet-50 text-violet-700",
      },
    },
    Ue = {
      PROSPECTADO: {
        label: "Prospectado",
        class: "bg-slate-100 text-slate-600",
      },
      VISITADO: { label: "Visitado", class: "bg-blue-50 text-blue-700" },
      INTERESSADO: {
        label: "Interessado",
        class: "bg-purple-50 text-purple-700",
      },
      PRESCRITOR: {
        label: "Prescritor",
        class: "bg-emerald-50 text-emerald-700",
      },
      FIDELIZADO: { label: "Fidelizado", class: "bg-amber-50 text-amber-700" },
    },
    ha = {
      FORTE: { label: "Forte", class: "bg-emerald-50 text-emerald-700" },
      INTERMEDIARIO: {
        label: "Intermediário",
        class: "bg-amber-50 text-amber-700",
      },
      FRACO: { label: "Fraco", class: "bg-red-50 text-red-600" },
    },
    Vt = ["PROSPECTADO", "VISITADO", "INTERESSADO", "PRESCRITOR", "FIDELIZADO"];
  let rs = ye(() =>
      e(is).reduce((i, r) => {
        const l = r.categoria;
        return (i[l] || (i[l] = []), i[l].push(r), i);
      }, {}),
    ),
    Js = ye(() =>
      Object.keys(e(rs)).sort((i, r) =>
        i.toLowerCase().localeCompare(r.toLowerCase()),
      ),
    );
  Ms(() => {
    const i = e(Ve);
    if (!i) {
      (o(tt, [], !0), o(Pe, ""));
      return;
    }
    Hs(i);
  });
  async function Hs(i) {
    const r = e(Pe);
    try {
      const l = await Be(
        `/especialidades/${i}/subespecialidades`,
        M.data.sessionToken,
      );
      if (l.ok) {
        const d = await l.json();
        o(tt, d.data || [], !0);
      } else o(tt, [], !0);
    } catch {
      o(tt, [], !0);
    }
    e(tt).some((l) => l.id === r)
      ? setTimeout(() => {
          o(Pe, r, !0);
        }, 0)
      : o(Pe, "");
  }
  let wa = !1;
  async function je(i = 1) {
    if (!wa) {
      ((wa = !0), o(Te, !0), o(ea, null));
      try {
        const r = new URLSearchParams({
          page: i.toString(),
          pageSize: e(S).pageSize.toString(),
        });
        (e(ta) && r.append("busca", e(ta)),
          e(aa) && r.append("potencial", e(aa)),
          e(sa) && r.append("estagioPipeline", e(sa)),
          e(oa) && r.append("classificacao", e(oa)));
        const l = await Be(`/profissionais?${r}`, M.data.sessionToken);
        if (!l.ok) throw new Error("Erro ao carregar profissionais");
        const d = await l.json();
        (o(L, d.data ?? d, !0), d.pagination && o(S, d.pagination, !0));
      } catch (r) {
        o(ea, r instanceof Error ? r.message : "Erro desconhecido", !0);
      } finally {
        (o(Te, !1), (wa = !1));
      }
    }
  }
  async function Xs() {
    try {
      const i = await Be("/especialidades", M.data.sessionToken);
      if (i.ok) {
        const r = await i.json();
        o(is, r.data, !0);
      }
    } catch {}
  }
  vo(() => {
    (je(1), Xs());
  });
  let Zs = ye(() => qe().url.searchParams.get("editId")),
    ls = v(!1);
  Ms(() => {
    const i = e(Zs);
    if (!i || e(ls) || e(L).length === 0) return;
    o(ls, !0);
    const r = e(L).find((l) => l.id === i);
    r &&
      (Ea(r),
      $o("/dashboard/profissionais", { replaceState: !0, keepFocus: !0 }));
  });
  function ya() {
    (o(fe, null),
      o(pt, ""),
      o(At, ""),
      o(kt, ""),
      o(It, ""),
      o(St, ""),
      o(Tt, "PROSPECTADO"),
      o(Ve, ""),
      o(Pe, ""),
      o(be, ""),
      o(ut, ""),
      o(mt, ""),
      o(Nt, ""),
      o(Rt, ""),
      o(ft, ""),
      o(bt, ""),
      o(ze, ""),
      o(Re, [], !0),
      o(jt, ""),
      o(Dt, "NAO_INFORMADO"),
      o(_t, ""),
      o(Ft, ""),
      o(Mt, ""),
      o(Lt, ""),
      o(xt, ""),
      o(et, !0));
  }
  function Ea(i) {
    var r, l, d, x, $, j, C, m, g, _, G, A, K, B, Q, oe, re;
    (o(
      fe,
      {
        id: i.id,
        nome: i.nome,
        crm: i.crm || "",
        email: i.email || "",
        telefone: i.telefone || "",
        potencial: i.potencial,
        estagioPipeline: i.estagioPipeline,
        especialidadeId: i.especialidadeId || "",
        subEspecialidadeId:
          ((r = i.subEspecialidade) == null ? void 0 : r.id) || "",
        classificacao: i.classificacao || "",
        endereco: {
          logradouro: ((l = i.endereco) == null ? void 0 : l.logradouro) || "",
          numero: ((d = i.endereco) == null ? void 0 : d.numero) || "",
          complemento:
            ((x = i.endereco) == null ? void 0 : x.complemento) || "",
          bairro: (($ = i.endereco) == null ? void 0 : $.bairro) || "",
          cidade: ((j = i.endereco) == null ? void 0 : j.cidade) || "",
          estado: ((C = i.endereco) == null ? void 0 : C.estado) || "",
          cep: ((m = i.endereco) == null ? void 0 : m.cep) || "",
        },
        contatos: i.contatos.map((V) => ({
          tipo: V.tipo,
          valor: V.valor,
          observacao: V.observacao || "",
        })),
      },
      !0,
    ),
      o(pt, i.nome, !0),
      o(At, i.crm || "", !0),
      o(kt, i.email || "", !0),
      o(It, i.telefone || "", !0),
      o(St, i.potencial, !0),
      o(Tt, i.estagioPipeline, !0),
      o(Ve, i.especialidadeId || "", !0),
      o(Pe, ((g = i.subEspecialidade) == null ? void 0 : g.id) || "", !0),
      o(be, i.classificacao || "", !0),
      o(ut, ((_ = i.endereco) == null ? void 0 : _.cep) || "", !0),
      o(mt, ((G = i.endereco) == null ? void 0 : G.logradouro) || "", !0),
      o(Nt, ((A = i.endereco) == null ? void 0 : A.numero) || "", !0),
      o(Rt, ((K = i.endereco) == null ? void 0 : K.complemento) || "", !0),
      o(ft, ((B = i.endereco) == null ? void 0 : B.bairro) || "", !0),
      o(bt, ((Q = i.endereco) == null ? void 0 : Q.cidade) || "", !0),
      o(ze, ((oe = i.endereco) == null ? void 0 : oe.estado) || "", !0),
      o(
        Re,
        ((re = i.contatos) == null
          ? void 0
          : re.map((V) => ({
              tipo: V.tipo,
              valor: V.valor,
              observacao: V.observacao || "",
            }))) ?? [],
        !0,
      ),
      o(jt, i.cpfCnpj ?? "", !0),
      o(Dt, i.sexo ?? "NAO_INFORMADO", !0),
      o(_t, i.dataNascimento ? i.dataNascimento.split("T")[0] : "", !0),
      o(Ft, i.tratamento ?? "", !0),
      o(Mt, i.observacoes ?? "", !0),
      o(Lt, i.nomeConjuge ?? "", !0),
      o(xt, i.dataNascConjuge ? i.dataNascConjuge.split("T")[0] : "", !0),
      o(et, !0));
  }
  async function Gs() {
    var j, C, m, g;
    if (!e(pt).trim()) {
      me.show("error", "O nome do profissional é obrigatório.");
      return;
    }
    const i = {
        cep: e(ut).trim() || void 0,
        logradouro: e(mt).trim() || void 0,
        numero: e(Nt).trim() || void 0,
        complemento: e(Rt).trim() || void 0,
        bairro: e(ft).trim() || void 0,
        cidade: e(bt).trim() || void 0,
        estado: e(ze).trim() || void 0,
      },
      r = Object.values(i).some((_) => _ !== void 0),
      l = e(Re)
        .filter((_) => _.valor.trim())
        .map((_) => ({
          tipo: _.tipo,
          valor: _.valor.trim(),
          observacao: _.observacao.trim() || void 0,
        })),
      d = {
        nome: e(pt).trim(),
        crm: e(At).trim() || void 0,
        email: e(kt).trim() || void 0,
        telefone: e(It).trim() || void 0,
        potencial: e(St) || void 0,
        estagioPipeline: e(Tt),
        especialidadeId: e(Ve) || void 0,
        subEspecialidadeId: e(Pe) || void 0,
        classificacao: e(be) || void 0,
        cpfCnpj: e(jt).trim() || void 0,
        sexo: e(Dt) || void 0,
        dataNascimento: e(_t) ? new Date(e(_t)).toISOString() : void 0,
        tratamento: e(Ft) || void 0,
        observacoes: e(Mt).trim() || void 0,
        nomeConjuge: e(Lt).trim() || void 0,
        dataNascConjuge: e(xt) ? new Date(e(xt)).toISOString() : void 0,
        endereco: r ? i : void 0,
        contatos: l.length > 0 ? l : void 0,
      };
    (Object.keys(d).forEach((_) => {
      d[_] === void 0 && delete d[_];
    }),
      e(Pe) || (d.subEspecialidadeId = null),
      e(Ve) || (d.especialidadeId = null),
      e(be) || (d.classificacao = null));
    const x =
        (j = e(fe)) != null && j.id
          ? `/profissionais/${e(fe).id}`
          : "/profissionais",
      $ = (C = e(fe)) != null && C.id ? "PUT" : "POST";
    try {
      const _ = await Be(x, M.data.sessionToken, {
        method: $,
        body: JSON.stringify(d),
      });
      if (!_.ok) {
        const A = await _.json().catch(() => null),
          K =
            (A == null ? void 0 : A.error) ||
            (A == null ? void 0 : A.message) ||
            `Erro ${_.status}`;
        throw new Error(K);
      }
      const G = await _.json();
      ((m = e(fe)) != null && m.id
        ? o(
            L,
            e(L).map((A) => (A.id === G.id ? G : A)),
            !0,
          )
        : je(e(S).page),
        o(et, !1),
        me.show(
          "success",
          (g = e(fe)) != null && g.id
            ? "Profissional atualizado!"
            : "Profissional criado!",
        ));
    } catch (_) {
      me.show("error", _ instanceof Error ? _.message : "Erro ao salvar");
    }
  }
  async function Ws(i) {
    const r = Vt.indexOf(i.estagioPipeline),
      l = Vt[r + 1];
    if (l)
      try {
        const d = await Be(
          `/profissionais/${i.id}/estagio`,
          M.data.sessionToken,
          { method: "PATCH", body: JSON.stringify({ estagioNovo: l }) },
        );
        if (d.ok) {
          const x = await d.json();
          (o(
            L,
            e(L).map(($) => ($.id === x.id ? x : $)),
            !0,
          ),
            me.show("success", `${i.nome}: ${Ue[l].label}`));
        }
      } catch {
        me.show("error", "Erro ao avançar estágio");
      }
  }
  async function Ys(i) {
    const r = Vt.indexOf(i.estagioPipeline),
      l = Vt[r - 1];
    if (l)
      try {
        const d = await Be(
          `/profissionais/${i.id}/estagio`,
          M.data.sessionToken,
          { method: "PATCH", body: JSON.stringify({ estagioNovo: l }) },
        );
        if (d.ok) {
          const x = await d.json();
          (o(
            L,
            e(L).map(($) => ($.id === x.id ? x : $)),
            !0,
          ),
            me.show("success", `${i.nome}: ${Ue[l].label}`));
        }
      } catch {
        me.show("error", "Erro ao retroceder estágio");
      }
  }
  async function qs(i) {
    const r = !i.deletedAt;
    try {
      const l = await Be(`/profissionais/${i.id}/ativo`, M.data.sessionToken, {
        method: "PATCH",
        body: JSON.stringify({ ativo: !r }),
      });
      if (l.ok) {
        const d = await l.json();
        (o(
          L,
          e(L).map((x) => (x.id === d.id ? d : x)),
          !0,
        ),
          me.show(
            "success",
            r ? `"${i.nome}" inativado.` : `"${i.nome}" reativado.`,
          ));
      }
    } catch {
      me.show("error", "Erro ao alterar status");
    }
  }
  function Ks(i) {
    (o(Ne, i, !0), o(Ct, !0));
  }
  async function Qs() {
    if (!e(Ne)) return;
    const i = await Be(`/profissionais/${e(Ne).id}`, M.data.sessionToken, {
      method: "DELETE",
    });
    if (!i.ok) {
      const r = await i.json();
      (me.show("error", r.error || "Erro ao excluir"), o(Ct, !1));
      return;
    }
    (o(
      L,
      e(L).filter((r) => r.id !== e(Ne).id),
      !0,
    ),
      (e(S).total = e(S).total - 1),
      me.show("success", `"${e(Ne).nome}" excluído.`),
      o(Ct, !1),
      o(Ne, null));
  }
  var ns = $i();
  xo("5tv8ml", (i) => {
    mo(() => {
      fo.title = "Profissionais — MediVisitas";
    });
  });
  var Pa = Ee(ns),
    Oa = a(Pa),
    ds = a(Oa),
    eo = a(ds);
  (ba(eo, { class: "h-4.5 w-4.5 text-white" }), t(ds), z(2), t(Oa));
  var cs = s(Oa, 2),
    to = a(cs);
  (We(to, {
    onclick: ya,
    class: "hidden sm:inline-flex gap-2",
    children: (i, r) => {
      var l = Vo(),
        d = Ee(l);
      (_a(d, { class: "h-4 w-4" }), z(), c(i, l));
    },
    $$slots: { default: !0 },
  }),
    t(cs),
    t(Pa));
  var $a = s(Pa, 2),
    vs = a($a),
    Ca = a(vs),
    ps = a(Ca);
  So(ps, {
    class:
      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none",
  });
  var Aa = s(ps, 2);
  (H(Aa), t(Ca));
  var zt = s(Ca, 2),
    ka = a(zt);
  ka.value = ka.__value = "";
  var Ia = s(ka);
  Ia.value = Ia.__value = "ALTO";
  var Sa = s(Ia);
  Sa.value = Sa.__value = "MEDIO";
  var Ta = s(Sa);
  Ta.value = Ta.__value = "BAIXO";
  var us = s(Ta);
  ((us.value = us.__value = "ESTRATEGICO"), t(zt));
  var Ut = s(zt, 2),
    Na = a(Ut);
  Na.value = Na.__value = "";
  var ao = s(Na);
  (Le(
    ao,
    17,
    () => Vt,
    Ze,
    (i, r) => {
      var l = zo(),
        d = a(l, !0);
      t(l);
      var x = {};
      (I(() => {
        (f(d, Ue[e(r)].label),
          x !== (x = e(r)) && (l.value = (l.__value = e(r)) ?? ""));
      }),
        c(i, l));
    },
  ),
    t(Ut));
  var ra = s(Ut, 2),
    Ra = a(ra);
  Ra.value = Ra.__value = "";
  var ja = s(Ra);
  ja.value = ja.__value = "FORTE";
  var Da = s(ja);
  Da.value = Da.__value = "INTERMEDIARIO";
  var ms = s(Da);
  ((ms.value = ms.__value = "FRACO"), t(ra), t(vs), t($a));
  var fs = s($a, 2);
  {
    var so = (i) => {
        var r = Uo();
        c(i, r);
      },
      oo = (i) => {
        var r = Jo(),
          l = a(r),
          d = a(l);
        (ba(d, { class: "h-6 w-6 text-red-400" }), t(l));
        var x = s(l, 2),
          $ = s(a(x), 2),
          j = a($, !0);
        (t($), t(x));
        var C = s(x, 2);
        (We(C, {
          variant: "outline",
          size: "sm",
          onclick: () => je(1),
          children: (m, g) => {
            z();
            var _ = Ka("Tentar novamente");
            c(m, _);
          },
          $$slots: { default: !0 },
        }),
          t(r),
          I(() => f(j, e(ea))),
          c(i, r));
      },
      io = (i) => {
        var r = Xo(),
          l = a(r),
          d = a(l);
        (ba(d, { class: "h-7 w-7 text-slate-400" }), t(l));
        var x = s(l, 4);
        (We(x, {
          size: "sm",
          onclick: ya,
          class: "gap-2",
          children: ($, j) => {
            var C = Ho(),
              m = Ee(C);
            (_a(m, { class: "h-4 w-4" }), z(), c($, C));
          },
          $$slots: { default: !0 },
        }),
          t(r),
          c(i, r));
      },
      ro = (i) => {
        var r = Wo(),
          l = Ee(r),
          d = a(l),
          x = s(a(d));
        (Le(
          x,
          21,
          () => e(L),
          (C) => C.id,
          (C, m) => {
            const g = ye(() => !e(m).deletedAt);
            var _ = Zo();
            let G;
            var A = a(_),
              K = a(A),
              B = a(K);
            let Q;
            var oe = a(B, !0);
            t(B);
            var re = s(B, 2),
              V = a(re);
            let Oe;
            var st = a(V, !0);
            t(V);
            var Je = s(V, 2);
            let ot;
            var it = a(Je, !0);
            (t(Je), t(re), t(K), t(A));
            var $e = s(A),
              rt = a($e),
              D = a(rt, !0);
            (t(rt), t($e));
            var W = s($e),
              ie = a(W),
              De = a(ie, !0);
            (t(ie), t(W));
            var le = s(W),
              ne = a(le),
              X = a(ne, !0);
            (t(ne), t(le));
            var R = s(le),
              Y = a(R),
              T = a(Y, !0);
            (t(Y), t(R));
            var ee = s(R),
              de = a(ee),
              ce = a(de),
              Ce = a(ce);
            (Lo(Ce, { class: "w-3.5 h-3.5" }), t(ce));
            var te = s(ce, 2),
              Fe = a(te);
            (es(Fe, { class: "w-3.5 h-3.5" }), t(te));
            var ae = s(te, 2),
              Ae = a(ae);
            (Oo(Ae, { class: "w-3.5 h-3.5" }), t(ae));
            var se = s(ae, 2),
              he = a(se);
            (Mo(he, { class: "w-3.5 h-3.5" }), t(se));
            var ve = s(se, 2),
              ke = a(ve);
            {
              var we = (u) => {
                  To(u, { class: "w-3.5 h-3.5" });
                },
                He = (u) => {
                  No(u, { class: "w-3.5 h-3.5" });
                };
              U(ke, (u) => {
                e(g) ? u(we) : u(He, -1);
              });
            }
            t(ve);
            var _e = s(ve, 2),
              Me = a(_e);
            (ko(Me, { class: "w-3.5 h-3.5" }),
              t(_e),
              t(de),
              t(ee),
              t(_),
              I(
                (u) => {
                  var k, J, xe, ge;
                  ((G = P(
                    _,
                    1,
                    "group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60",
                    null,
                    G,
                    { "opacity-50": !e(g) },
                  )),
                    (Q = P(
                      B,
                      1,
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm",
                      null,
                      Q,
                      {
                        "bg-gradient-to-br": e(g),
                        "from-blue-500": e(g),
                        "to-indigo-600": e(g),
                        "text-white": e(g),
                        "bg-slate-200": !e(g),
                        "text-slate-400": !e(g),
                      },
                    )),
                    f(oe, u),
                    (Oe = P(V, 1, "text-sm font-medium truncate", null, Oe, {
                      "text-slate-900": e(g),
                      "text-slate-400": !e(g),
                    })),
                    f(st, e(m).nome),
                    (ot = P(Je, 1, "text-xs truncate", null, ot, {
                      "text-slate-400": e(g),
                      "text-slate-300": !e(g),
                    })),
                    f(it, e(m).crm || "Sem CRM"),
                    f(
                      D,
                      ((k = e(m).especialidade) == null ? void 0 : k.nome) ||
                        "—",
                    ),
                    f(
                      De,
                      ((J = e(m).subEspecialidade) == null ? void 0 : J.nome) ||
                        "-",
                    ),
                    P(
                      ne,
                      1,
                      `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${((xe = Bt[e(m).potencial]) == null ? void 0 : xe.class) ?? "bg-slate-100 text-slate-600" ?? ""}`,
                    ),
                    f(
                      X,
                      ((ge = Bt[e(m).potencial]) == null ? void 0 : ge.label) ??
                        e(m).potencial,
                    ),
                    P(
                      Y,
                      1,
                      `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${Ue[e(m).estagioPipeline].class ?? ""}`,
                    ),
                    f(T, Ue[e(m).estagioPipeline].label),
                    Z(te, "href", `/dashboard/profissionais/${e(m).id}`),
                    (ae.disabled =
                      e(m).estagioPipeline === "PROSPECTADO" || !e(g)),
                    (se.disabled =
                      e(m).estagioPipeline === "FIDELIZADO" || !e(g)),
                    Z(ve, "title", e(g) ? "Inativar" : "Ativar"),
                    P(
                      ve,
                      1,
                      `p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer ${e(g) ? "hover:text-amber-600" : "hover:text-green-600"}`,
                    ));
                },
                [() => e(m).nome.charAt(0).toUpperCase()],
              ),
              O("click", _, () => Ea(e(m))),
              O("click", ce, (u) => {
                (u.stopPropagation(),
                  o(p, e(m), !0),
                  o(gt, "dados"),
                  o(at, !0));
              }),
              O("click", te, (u) => u.stopPropagation()),
              O("click", ae, (u) => {
                (u.stopPropagation(), Ys(e(m)));
              }),
              O("click", se, (u) => {
                (u.stopPropagation(), Ws(e(m)));
              }),
              O("click", ve, (u) => {
                (u.stopPropagation(), qs(e(m)));
              }),
              O("click", _e, (u) => {
                (u.stopPropagation(), Ks(e(m)));
              }),
              c(C, _));
          },
        ),
          t(x),
          t(d),
          t(l));
        var $ = s(l, 2);
        {
          var j = (C) => {
            var m = Go(),
              g = a(m),
              _ = a(g);
            t(g);
            var G = s(g, 2),
              A = a(G);
            {
              let B = ye(() => e(S).page <= 1);
              We(A, {
                variant: "outline",
                size: "sm",
                onclick: () => je(e(S).page - 1),
                get disabled() {
                  return e(B);
                },
                children: (Q, oe) => {
                  Ro(Q, { class: "h-4 w-4" });
                },
                $$slots: { default: !0 },
              });
            }
            var K = s(A, 2);
            {
              let B = ye(() => e(S).page >= e(S).totalPages);
              We(K, {
                variant: "outline",
                size: "sm",
                onclick: () => je(e(S).page + 1),
                get disabled() {
                  return e(B);
                },
                children: (Q, oe) => {
                  jo(Q, { class: "h-4 w-4" });
                },
                $$slots: { default: !0 },
              });
            }
            (t(G),
              t(m),
              I(() =>
                f(
                  _,
                  `Página ${e(S).page ?? ""} de ${e(S).totalPages ?? ""} · ${e(S).total ?? ""} total`,
                ),
              ),
              c(C, m));
          };
          U($, (C) => {
            e(S).totalPages > 1 && C(j);
          });
        }
        c(i, r);
      };
    U(fs, (i) => {
      e(Te)
        ? i(so)
        : e(ea)
          ? i(oo, 1)
          : e(L).length === 0
            ? i(io, 2)
            : i(ro, -1);
    });
  }
  var bs = s(fs, 2);
  Co(bs, {
    onclose: () => o(et, !1),
    get open() {
      return e(et);
    },
    set open(r) {
      o(et, r, !0);
    },
    children: (r) => {
      var l = ri(),
        d = a(l),
        x = a(d),
        $ = a(x, !0);
      t(x);
      var j = s(x, 2),
        C = a(j, !0);
      (t(j), t(d));
      var m = s(d, 2),
        g = a(m),
        _ = a(g);
      (ba(_, { class: "h-3.5 w-3.5" }), z(), t(g));
      var G = s(g, 2),
        A = a(G),
        K = a(A),
        B = s(a(K), 2),
        Q = a(B);
      Q.value = Q.__value = "";
      var oe = s(Q);
      oe.value = oe.__value = "DR";
      var re = s(oe);
      re.value = re.__value = "DRA";
      var V = s(re);
      V.value = V.__value = "PROF";
      var Oe = s(V);
      Oe.value = Oe.__value = "PROFA";
      var st = s(Oe);
      st.value = st.__value = "SR";
      var Je = s(st);
      ((Je.value = Je.__value = "SRA"), t(B), t(K));
      var ot = s(K, 2),
        it = s(a(ot), 2);
      (H(it), t(ot), t(A));
      var $e = s(A, 2),
        rt = s(a($e), 2);
      (H(rt), t($e));
      var D = s($e, 2),
        W = a(D),
        ie = s(a(W), 2);
      (H(ie), z(2), t(W));
      var De = s(W, 2),
        le = s(a(De), 2);
      (H(le), Z(le, "maxlength", 2), z(2), t(De), t(D));
      var ne = s(D, 2),
        X = a(ne),
        R = s(a(X), 2),
        Y = a(R);
      Y.value = Y.__value = "NAO_INFORMADO";
      var T = s(Y);
      T.value = T.__value = "MASCULINO";
      var ee = s(T);
      ((ee.value = ee.__value = "FEMININO"), t(R), t(X));
      var de = s(X, 2),
        ce = s(a(de), 2);
      (H(ce), t(de), t(ne));
      var Ce = s(ne, 2),
        te = s(a(Ce), 2);
      (H(te), z(2), t(Ce), t(G), t(m));
      var Fe = s(m, 2),
        ae = a(Fe),
        Ae = a(ae);
      (yo(Ae, { class: "h-3.5 w-3.5" }), z(), t(ae));
      var se = s(ae, 2),
        he = a(se),
        ve = s(a(he), 2);
      (H(ve), t(he));
      var ke = s(he, 2),
        we = s(a(ke), 2);
      (H(we), t(ke));
      var He = s(ke, 2),
        _e = a(He),
        Me = s(a(_e), 2),
        u = a(Me);
      (_a(u, { class: "h-3.5 w-3.5" }), z(), t(Me), t(_e));
      var k = s(_e, 2);
      {
        var J = (n) => {
            var E = Yo();
            c(n, E);
          },
          xe = (n) => {
            var E = Ko();
            (Le(
              E,
              21,
              () => e(Re),
              Ze,
              (y, N, q) => {
                var ue = qo(),
                  Ie = a(ue),
                  Se = a(Ie);
                (Ls(Se, { class: "h-3 w-3" }), t(Ie));
                var ua = s(Ie, 2),
                  Ot = a(ua),
                  Ns = a(Ot);
                Z(Ns, "for", `contato-tipo-${q}`);
                var ma = s(Ns, 2);
                Z(ma, "id", `contato-tipo-${q}`);
                var Ga = a(ma);
                Ga.value = Ga.__value = "TELEFONE";
                var Wa = s(Ga);
                Wa.value = Wa.__value = "EMAIL";
                var Ya = s(Wa);
                Ya.value = Ya.__value = "WHATSAPP";
                var Rs = s(Ya);
                ((Rs.value = Rs.__value = "OUTRO"), t(ma), t(Ot));
                var qa = s(Ot, 2),
                  js = a(qa);
                Z(js, "for", `contato-valor-${q}`);
                var qt = s(js, 2);
                (H(qt), Z(qt, "id", `contato-valor-${q}`), t(qa));
                var Ds = s(qa, 2),
                  Fs = a(Ds);
                Z(Fs, "for", `contato-obs-${q}`);
                var fa = s(Fs, 2);
                (Qa(fa),
                  Z(fa, "id", `contato-obs-${q}`),
                  Z(fa, "rows", 2),
                  t(Ds),
                  t(ua),
                  t(ue),
                  I(() => {
                    (Z(qt, "type", e(N).tipo === "EMAIL" ? "email" : "text"),
                      Z(
                        qt,
                        "placeholder",
                        e(N).tipo === "EMAIL"
                          ? "email@exemplo.com"
                          : e(N).tipo === "WHATSAPP" || e(N).tipo === "TELEFONE"
                            ? "(11) 99999-0000"
                            : "Valor do contato",
                      ));
                  }),
                  O("click", Ie, () => Us(q)),
                  Ge(
                    ma,
                    () => e(N).tipo,
                    (Kt) => (e(N).tipo = Kt),
                  ),
                  F(
                    qt,
                    () => e(N).valor,
                    (Kt) => (e(N).valor = Kt),
                  ),
                  F(
                    fa,
                    () => e(N).observacao,
                    (Kt) => (e(N).observacao = Kt),
                  ),
                  c(y, ue));
              },
            ),
              t(E),
              c(n, E));
          };
        U(k, (n) => {
          e(Re).length === 0 ? n(J) : n(xe, -1);
        });
      }
      (t(He), t(se), t(Fe));
      var ge = s(Fe, 2),
        Jt = a(ge),
        Ht = a(Jt);
      (Eo(Ht, { class: "h-3.5 w-3.5" }), z(), t(Jt));
      var la = s(Jt, 2),
        Xt = a(la),
        Zt = s(a(Xt), 2),
        ht = a(Zt);
      ht.value = ht.__value = "";
      var Fa = s(ht);
      (Le(
        Fa,
        17,
        () => e(Js),
        Ze,
        (n, E) => {
          var y = ei();
          (Le(
            y,
            21,
            () => e(rs)[e(E)],
            Ze,
            (N, q) => {
              var ue = Qo(),
                Ie = a(ue, !0);
              t(ue);
              var Se = {};
              (I(() => {
                (f(Ie, e(q).nome),
                  Se !== (Se = e(q).id) &&
                    (ue.value = (ue.__value = e(q).id) ?? ""));
              }),
                c(N, ue));
            },
          ),
            t(y),
            I(() => Z(y, "label", e(E))),
            c(n, y));
        },
      ),
        t(Zt),
        t(Xt));
      var na = s(Xt, 2);
      {
        var Ma = (n) => {
          var E = ai(),
            y = s(a(E), 2),
            N = a(y);
          N.value = N.__value = "";
          var q = s(N);
          (Le(
            q,
            17,
            () => e(tt),
            Ze,
            (ue, Ie) => {
              var Se = ti(),
                ua = a(Se, !0);
              t(Se);
              var Ot = {};
              (I(() => {
                (f(ua, e(Ie).nome),
                  Ot !== (Ot = e(Ie).id) &&
                    (Se.value = (Se.__value = e(Ie).id) ?? ""));
              }),
                c(ue, Se));
            },
          ),
            t(y),
            t(E),
            Ge(
              y,
              () => e(Pe),
              (ue) => o(Pe, ue),
            ),
            c(n, E));
        };
        U(na, (n) => {
          e(Ve) && e(tt).length > 0 && n(Ma);
        });
      }
      var Gt = s(na, 2),
        da = s(a(Gt), 2),
        h = a(da);
      (H(h), Z(h, "maxlength", 9));
      var w = s(h, 2);
      {
        var pe = (n) => {
          var E = si(),
            y = a(E);
          (Bo(y, { class: "h-4 w-4 animate-spin text-slate-400" }),
            t(E),
            c(n, E));
        };
        U(w, (n) => {
          e(xa) && n(pe);
        });
      }
      (t(da), z(2), t(Gt));
      var Xe = s(Gt, 2),
        lt = s(a(Xe), 2);
      (Qa(lt), Z(lt, "rows", 2), t(Xe));
      var wt = s(Xe, 2),
        nt = a(wt),
        yt = s(a(nt), 2);
      (H(yt), t(nt));
      var ca = s(nt, 2),
        Et = s(a(ca), 2);
      (H(Et), t(ca), t(wt));
      var dt = s(wt, 2),
        va = s(a(dt), 2);
      (H(va), t(dt));
      var Pt = s(dt, 2),
        ct = a(Pt),
        pa = s(a(ct), 2);
      (H(pa), t(ct));
      var Wt = s(ct, 2),
        vt = s(a(Wt), 2);
      (H(vt), Z(vt, "maxlength", 2), t(Wt), t(Pt), t(la), t(ge));
      var Yt = s(ge, 2),
        gs = s(a(Yt), 2),
        La = a(gs),
        hs = s(a(La), 2);
      (Le(
        hs,
        20,
        () => [
          { value: "ALTO", label: "Alto", active: "seg-active-emerald" },
          { value: "MEDIO", label: "Médio", active: "seg-active-amber" },
          { value: "BAIXO", label: "Baixo", active: "seg-active-orange" },
          {
            value: "ESTRATEGICO",
            label: "Estratégico",
            active: "seg-active-indigo",
          },
        ],
        Ze,
        (n, E) => {
          var y = oi(),
            N = a(y, !0);
          (t(y),
            I(() => {
              (P(
                y,
                1,
                `segmented-btn ${(e(St) === E.value ? E.active : "") ?? ""}`,
              ),
                f(N, E.label));
            }),
            O("click", y, () => {
              o(St, E.value, !0);
            }),
            c(n, y));
        },
      ),
        t(hs),
        z(2),
        t(La));
      var Ba = s(La, 2),
        ws = s(a(Ba), 2);
      (Le(
        ws,
        20,
        () => [
          {
            value: "PROSPECTADO",
            label: "Prospectado",
            active: "seg-active-blue",
          },
          { value: "VISITADO", label: "Visitado", active: "seg-active-sky" },
          {
            value: "INTERESSADO",
            label: "Interessado",
            active: "seg-active-amber",
          },
          {
            value: "PRESCRITOR",
            label: "Prescritor",
            active: "seg-active-emerald",
          },
          {
            value: "FIDELIZADO",
            label: "Fidelizado",
            active: "seg-active-indigo",
          },
        ],
        Ze,
        (n, E) => {
          var y = ii(),
            N = a(y, !0);
          (t(y),
            I(() => {
              (P(
                y,
                1,
                `segmented-btn ${(e(Tt) === E.value ? E.active : "") ?? ""}`,
              ),
                f(N, E.label));
            }),
            O("click", y, () => {
              o(Tt, E.value, !0);
            }),
            c(n, y));
        },
      ),
        t(ws),
        z(2),
        t(Ba));
      var ys = s(Ba, 2),
        Es = s(a(ys), 2),
        Ps = a(Es),
        Va = a(Ps),
        za = s(Va, 2),
        Ua = s(za, 2),
        Os = s(Ua, 2);
      (t(Ps), t(Es), t(ys), t(gs), t(Yt));
      var Ja = s(Yt, 2),
        $s = s(a(Ja), 2),
        Ha = a($s),
        Xa = s(a(Ha), 2);
      (Qa(Xa), Z(Xa, "rows", 3), t(Ha));
      var Cs = s(Ha, 2),
        Za = a(Cs),
        As = s(a(Za), 2);
      (H(As), t(Za));
      var ks = s(Za, 2),
        Is = s(a(ks), 2);
      (H(Is), t(ks), t(Cs), t($s), t(Ja));
      var Ss = s(Ja, 2),
        Ts = a(Ss);
      We(Ts, {
        variant: "outline",
        onclick: () => o(et, !1),
        children: (n, E) => {
          z();
          var y = Ka("Cancelar");
          c(n, y);
        },
        $$slots: { default: !0 },
      });
      var co = s(Ts, 2);
      (We(co, {
        onclick: Gs,
        children: (n, E) => {
          z();
          var y = Ka();
          (I(() =>
            f(y, e(fe) ? "Salvar Alterações" : "Cadastrar Profissional"),
          ),
            c(n, y));
        },
        $$slots: { default: !0 },
      }),
        t(Ss),
        t(l),
        I(
          (n) => {
            (f($, e(fe) ? "Editar Profissional" : "Novo Profissional"),
              f(
                C,
                e(fe)
                  ? "Atualize os dados abaixo"
                  : "Preencha os dados para cadastrar",
              ),
              go(te, n),
              P(
                Va,
                1,
                `segmented-btn col-span-1 ${e(be) === "FORTE" ? "seg-active-emerald" : ""}`,
              ),
              P(
                za,
                1,
                `segmented-btn col-span-1 ${e(be) === "INTERMEDIARIO" ? "seg-active-amber" : ""}`,
              ),
              P(
                Ua,
                1,
                `segmented-btn col-span-1 ${e(be) === "FRACO" ? "seg-active-rose" : ""}`,
              ),
              P(
                Os,
                1,
                `segmented-btn col-span-3 ${e(be) === "" ? "seg-active-slate" : ""}`,
              ));
          },
          [
            () => {
              var n, E, y;
              return (n = e(fe)) != null && n.id
                ? (((y =
                    (E = e(L).find((N) => {
                      var q;
                      return N.id === ((q = e(fe)) == null ? void 0 : q.id);
                    })) == null
                      ? void 0
                      : E.createdAt) == null
                    ? void 0
                    : y.split("T")[0]) ??
                    new Date().toISOString().split("T")[0])
                : new Date().toISOString().split("T")[0];
            },
          ],
        ),
        Ge(
          B,
          () => e(Ft),
          (n) => o(Ft, n),
        ),
        F(
          it,
          () => e(pt),
          (n) => o(pt, n),
        ),
        F(
          rt,
          () => e(jt),
          (n) => o(jt, n),
        ),
        F(
          ie,
          () => e(At),
          (n) => o(At, n),
        ),
        F(
          le,
          () => e(ze),
          (n) => o(ze, n),
        ),
        Ge(
          R,
          () => e(Dt),
          (n) => o(Dt, n),
        ),
        F(
          ce,
          () => e(_t),
          (n) => o(_t, n),
        ),
        F(
          ve,
          () => e(It),
          (n) => o(It, n),
        ),
        F(
          we,
          () => e(kt),
          (n) => o(kt, n),
        ),
        O("click", Me, zs),
        Ge(
          Zt,
          () => e(Ve),
          (n) => o(Ve, n),
        ),
        wo("blur", h, Vs),
        F(
          h,
          () => e(ut),
          (n) => o(ut, n),
        ),
        F(
          lt,
          () => e(mt),
          (n) => o(mt, n),
        ),
        F(
          yt,
          () => e(Nt),
          (n) => o(Nt, n),
        ),
        F(
          Et,
          () => e(Rt),
          (n) => o(Rt, n),
        ),
        F(
          va,
          () => e(ft),
          (n) => o(ft, n),
        ),
        F(
          pa,
          () => e(bt),
          (n) => o(bt, n),
        ),
        F(
          vt,
          () => e(ze),
          (n) => o(ze, n),
        ),
        O("click", Va, () => {
          o(be, "FORTE");
        }),
        O("click", za, () => {
          o(be, "INTERMEDIARIO");
        }),
        O("click", Ua, () => {
          o(be, "FRACO");
        }),
        O("click", Os, () => {
          o(be, "");
        }),
        F(
          Xa,
          () => e(Mt),
          (n) => o(Mt, n),
        ),
        F(
          As,
          () => e(Lt),
          (n) => o(Lt, n),
        ),
        F(
          Is,
          () => e(xt),
          (n) => o(xt, n),
        ),
        c(r, l));
    },
    $$slots: { default: !0 },
  });
  var _s = s(bs, 2);
  {
    var lo = (i) => {
      const r = ye(() => ({
          DR: "Dr.",
          DRA: "Dra.",
          PROF: "Prof.",
          PROFA: "Profa.",
          SR: "Sr.",
          SRA: "Sra.",
        })),
        l = ye(() => ({
          MASCULINO: "Masculino",
          FEMININO: "Feminino",
          NAO_INFORMADO: "Não informado",
        }));
      var d = Pi(),
        x = a(d),
        $ = a(x),
        j = a($),
        C = a(j),
        m = a(C, !0);
      t(C);
      var g = s(C, 2),
        _ = a(g),
        G = a(_);
      t(_);
      var A = s(_, 2),
        K = a(A);
      (t(A), t(g), t(j));
      var B = s(j, 2),
        Q = a(B);
      (Ls(Q, { class: "w-4 h-4 text-slate-400" }), t(B), t($));
      var oe = s($, 2),
        re = a(oe),
        V = s(re, 2);
      t(oe);
      var Oe = s(oe, 2),
        st = a(Oe);
      {
        var Je = (D) => {
            var W = fi(),
              ie = Ee(W),
              De = s(a(ie), 2),
              le = a(De),
              ne = s(a(le), 2),
              X = a(ne, !0);
            (t(ne), t(le));
            var R = s(le, 2),
              Y = s(a(R), 2),
              T = a(Y, !0);
            (t(Y), t(R));
            var ee = s(R, 2),
              de = s(a(ee), 2),
              ce = a(de, !0);
            (t(de), t(ee));
            var Ce = s(ee, 2),
              te = s(a(Ce), 2),
              Fe = a(te, !0);
            (t(te), t(Ce), t(De), t(ie));
            var ae = s(ie, 2),
              Ae = s(a(ae), 2),
              se = a(Ae),
              he = s(a(se), 2),
              ve = a(he, !0);
            (t(he), t(se));
            var ke = s(se, 2),
              we = s(a(ke), 2),
              He = a(we, !0);
            (t(we), t(ke), t(Ae), t(ae));
            var _e = s(ae, 2);
            {
              var Me = (h) => {
                const w = ye(() => e(p).endereco),
                  pe = ye(() =>
                    [e(w).logradouro, e(w).numero, e(w).complemento]
                      .filter(Boolean)
                      .join(", "),
                  ),
                  Xe = ye(() =>
                    [e(w).cidade, e(w).estado].filter(Boolean).join("/"),
                  );
                var lt = li(),
                  wt = s(a(lt), 2),
                  nt = a(wt),
                  yt = s(a(nt), 2),
                  ca = a(yt, !0);
                (t(yt), t(nt));
                var Et = s(nt, 2),
                  dt = s(a(Et), 2),
                  va = a(dt, !0);
                (t(dt), t(Et));
                var Pt = s(Et, 2),
                  ct = s(a(Pt), 2),
                  pa = a(ct, !0);
                (t(ct), t(Pt));
                var Wt = s(Pt, 2),
                  vt = s(a(Wt), 2),
                  Yt = a(vt, !0);
                (t(vt),
                  t(Wt),
                  t(wt),
                  t(lt),
                  I(() => {
                    (P(
                      yt,
                      1,
                      `text-sm font-semibold ${e(w).cep ? "text-slate-800" : "text-slate-300"}`,
                    ),
                      f(ca, e(w).cep || "—"),
                      P(
                        dt,
                        1,
                        `text-sm font-semibold ${e(pe) ? "text-slate-800" : "text-slate-300"}`,
                      ),
                      f(va, e(pe) || "—"),
                      P(
                        ct,
                        1,
                        `text-sm font-semibold ${e(w).bairro ? "text-slate-800" : "text-slate-300"}`,
                      ),
                      f(pa, e(w).bairro || "—"),
                      P(
                        vt,
                        1,
                        `text-sm font-semibold ${e(Xe) ? "text-slate-800" : "text-slate-300"}`,
                      ),
                      f(Yt, e(Xe) || "—"));
                  }),
                  c(h, lt));
              };
              U(_e, (h) => {
                e(p).endereco && h(Me);
              });
            }
            var u = s(_e, 2),
              k = s(a(u), 2),
              J = a(k),
              xe = s(a(J), 2);
            {
              var ge = (h) => {
                  var w = ni(),
                    pe = a(w, !0);
                  (t(w),
                    I(() => {
                      (P(
                        w,
                        1,
                        `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${Bt[e(p).potencial].class ?? ""}`,
                      ),
                        f(pe, Bt[e(p).potencial].label));
                    }),
                    c(h, w));
                },
                Jt = (h) => {
                  var w = di();
                  c(h, w);
                };
              U(xe, (h) => {
                e(p).potencial && Bt[e(p).potencial] ? h(ge) : h(Jt, -1);
              });
            }
            t(J);
            var Ht = s(J, 2),
              la = s(a(Ht), 2);
            {
              var Xt = (h) => {
                  var w = ci(),
                    pe = a(w, !0);
                  (t(w),
                    I(() => {
                      (P(
                        w,
                        1,
                        `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${Ue[e(p).estagioPipeline].class ?? ""}`,
                      ),
                        f(pe, Ue[e(p).estagioPipeline].label));
                    }),
                    c(h, w));
                },
                Zt = (h) => {
                  var w = vi();
                  c(h, w);
                };
              U(la, (h) => {
                e(p).estagioPipeline && Ue[e(p).estagioPipeline]
                  ? h(Xt)
                  : h(Zt, -1);
              });
            }
            t(Ht);
            var ht = s(Ht, 2),
              Fa = s(a(ht), 2);
            {
              var na = (h) => {
                  var w = pi(),
                    pe = a(w, !0);
                  (t(w),
                    I(() => {
                      (P(
                        w,
                        1,
                        `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${ha[e(p).classificacao].class ?? ""}`,
                      ),
                        f(pe, ha[e(p).classificacao].label));
                    }),
                    c(h, w));
                },
                Ma = (h) => {
                  var w = ui();
                  c(h, w);
                };
              U(Fa, (h) => {
                e(p).classificacao && ha[e(p).classificacao]
                  ? h(na)
                  : h(Ma, -1);
              });
            }
            (t(ht), t(k), t(u));
            var Gt = s(u, 2);
            {
              var da = (h) => {
                var w = mi(),
                  pe = s(a(w), 2),
                  Xe = a(pe, !0);
                (t(pe), t(w), I(() => f(Xe, e(p).observacoes)), c(h, w));
              };
              U(Gt, (h) => {
                e(p).observacoes && h(da);
              });
            }
            (I(
              (h) => {
                (P(
                  ne,
                  1,
                  `text-sm font-semibold ${e(p).crm ? "text-slate-800" : "text-slate-300"}`,
                ),
                  f(X, e(p).crm || "—"),
                  P(
                    Y,
                    1,
                    `text-sm font-semibold ${e(p).cpfCnpj ? "text-slate-800" : "text-slate-300"}`,
                  ),
                  f(T, e(p).cpfCnpj || "—"),
                  P(
                    de,
                    1,
                    `text-sm font-semibold ${e(p).sexo ? "text-slate-800" : "text-slate-300"}`,
                  ),
                  f(ce, e(p).sexo ? (e(l)[e(p).sexo] ?? e(p).sexo) : "—"),
                  P(
                    te,
                    1,
                    `text-sm font-semibold ${e(p).dataNascimento ? "text-slate-800" : "text-slate-300"}`,
                  ),
                  f(Fe, h),
                  P(
                    he,
                    1,
                    `text-sm font-semibold ${e(p).telefone ? "text-slate-800" : "text-slate-300"}`,
                  ),
                  f(ve, e(p).telefone || "—"),
                  P(
                    we,
                    1,
                    `text-sm font-semibold ${e(p).email ? "text-slate-800" : "text-slate-300"}`,
                  ),
                  f(He, e(p).email || "—"));
              },
              [
                () =>
                  e(p).dataNascimento
                    ? new Date(e(p).dataNascimento).toLocaleDateString(
                        "pt-BR",
                        { timeZone: "UTC" },
                      )
                    : "—",
              ],
            ),
              c(D, W));
          },
          ot = (D) => {
            var W = Qt(),
              ie = Ee(W);
            {
              var De = (X) => {
                  var R = bi();
                  c(X, R);
                },
                le = (X) => {
                  var R = _i(),
                    Y = a(R),
                    T = a(Y),
                    ee = a(T);
                  (es(ee, { class: "w-6 h-6 text-slate-400" }),
                    t(T),
                    t(Y),
                    z(4),
                    t(R),
                    c(X, R));
                },
                ne = (X) => {
                  var R = Ei();
                  (Le(
                    R,
                    21,
                    () => e(ia),
                    Ze,
                    (Y, T) => {
                      var ee = yi(),
                        de = a(ee),
                        ce = a(de),
                        Ce = a(ce);
                      es(Ce, { class: "w-3.5 h-3.5 text-slate-400" });
                      var te = s(Ce, 2),
                        Fe = a(te);
                      (t(te), t(ce));
                      var ae = s(ce, 2);
                      (Io(ae, {
                        get status() {
                          return e(T).status;
                        },
                      }),
                        t(de));
                      var Ae = s(de, 2),
                        se = a(Ae);
                      {
                        var he = (u) => {
                          var k = xi(),
                            J = a(k);
                          Do(J, { class: "w-3 h-3 text-slate-400" });
                          var xe = s(J, 2),
                            ge = a(xe);
                          (t(xe),
                            t(k),
                            I(() => f(ge, `${e(T).duracaoMinutos ?? ""} min`)),
                            c(u, k));
                        };
                        U(se, (u) => {
                          e(T).duracaoMinutos && u(he);
                        });
                      }
                      var ve = s(se, 2);
                      {
                        var ke = (u) => {
                          var k = gi(),
                            J = a(k);
                          Fo(J, { class: "w-3 h-3 text-slate-400" });
                          var xe = s(J, 2),
                            ge = a(xe);
                          (t(xe),
                            t(k),
                            I(() =>
                              f(ge, `${e(T).materiais.length ?? ""} materiais`),
                            ),
                            c(u, k));
                        };
                        U(ve, (u) => {
                          e(T).materiais && e(T).materiais.length > 0 && u(ke);
                        });
                      }
                      t(Ae);
                      var we = s(Ae, 2);
                      {
                        var He = (u) => {
                          var k = hi(),
                            J = s(a(k));
                          (t(k),
                            I(() => f(J, ` ${e(T).objetivoVisita ?? ""}`)),
                            c(u, k));
                        };
                        U(we, (u) => {
                          e(T).objetivoVisita && u(He);
                        });
                      }
                      var _e = s(we, 2);
                      {
                        var Me = (u) => {
                          var k = wi(),
                            J = s(a(k));
                          (t(k),
                            I(() => f(J, ` ${e(T).resumo ?? ""}`)),
                            c(u, k));
                        };
                        U(_e, (u) => {
                          e(T).resumo && u(Me);
                        });
                      }
                      (t(ee),
                        I(
                          (u, k) =>
                            f(
                              Fe,
                              `${u ?? ""}
												às ${k ?? ""}`,
                            ),
                          [
                            () =>
                              new Intl.DateTimeFormat("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }).format(new Date(e(T).dataVisita)),
                            () =>
                              new Intl.DateTimeFormat("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(e(T).dataVisita)),
                          ],
                        ),
                        c(Y, ee));
                    },
                  ),
                    t(R),
                    c(X, R));
                };
              U(ie, (X) => {
                e(ga) ? X(De) : e(ia).length === 0 ? X(le, 1) : X(ne, -1);
              });
            }
            c(D, W);
          };
        U(st, (D) => {
          e(gt) === "dados" ? D(Je) : D(ot, -1);
        });
      }
      t(Oe);
      var it = s(Oe, 2),
        $e = a(it),
        rt = s($e, 2);
      (t(it),
        t(x),
        t(d),
        I(
          (D) => {
            var W, ie;
            (f(m, D),
              f(
                G,
                `${e(p).tratamento ? (e(r)[e(p).tratamento] ?? e(p).tratamento) + " " : ""}${e(p).nome ?? ""}`,
              ),
              f(
                K,
                `${((W = e(p).especialidade) == null ? void 0 : W.nome) ?? "Sem especialidade" ?? ""}${(ie = e(p).subEspecialidade) != null && ie.nome ? ` - ${e(p).subEspecialidade.nome}` : ""}`,
              ),
              P(
                re,
                1,
                `flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer
						${e(gt) === "dados" ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`,
              ),
              P(
                V,
                1,
                `flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer
						${e(gt) === "visitas" ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`,
              ));
          },
          [
            () =>
              e(p)
                .nome.split(" ")
                .slice(0, 2)
                .map((D) => D.charAt(0))
                .join("")
                .toUpperCase(),
          ],
        ),
        O("click", d, () => o(at, !1)),
        O("keydown", d, (D) => {
          D.key === "Escape" && o(at, !1);
        }),
        O("click", x, (D) => D.stopPropagation()),
        O("keydown", x, () => {}),
        O("click", B, () => o(at, !1)),
        O("click", re, () => {
          o(gt, "dados");
        }),
        O("click", V, () => {
          (o(gt, "visitas"), e(p) && Bs(e(p).id));
        }),
        O("click", $e, () => o(at, !1)),
        O("click", rt, () => {
          (o(at, !1), Ea(e(p)));
        }),
        c(i, d));
    };
    U(_s, (i) => {
      e(at) && e(p) && i(lo);
    });
  }
  var xs = s(_s, 2);
  We(xs, {
    class:
      "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden",
    onclick: ya,
    children: (i, r) => {
      _a(i, { class: "h-6 w-6 text-white" });
    },
    $$slots: { default: !0 },
  });
  var no = s(xs, 2);
  (Ao(no, {
    get open() {
      return e(Ct);
    },
    onclose: () => {
      (o(Ct, !1), o(Ne, null));
    },
    title: "Excluir profissional",
    onconfirm: Qs,
    variant: "danger",
    description: (r) => {
      var l = Qt(),
        d = Ee(l);
      {
        var x = ($) => {
          var j = Oi(),
            C = Ee(j),
            m = s(a(C)),
            g = a(m);
          (t(m),
            z(),
            t(C),
            z(2),
            I(() => f(g, `"${e(Ne).nome ?? ""}"`)),
            c($, j));
        };
        U(d, ($) => {
          e(Ne) && $(x);
        });
      }
      c(r, l);
    },
    $$slots: { description: !0 },
  }),
    O("input", Aa, () => je(1)),
    F(
      Aa,
      () => e(ta),
      (i) => o(ta, i),
    ),
    O("change", zt, () => je(1)),
    Ge(
      zt,
      () => e(aa),
      (i) => o(aa, i),
    ),
    O("change", Ut, () => je(1)),
    Ge(
      Ut,
      () => e(sa),
      (i) => o(sa, i),
    ),
    O("change", ra, () => je(1)),
    Ge(
      ra,
      () => e(oa),
      (i) => o(oa, i),
    ),
    c(Ye, ns),
    uo(),
    Qe());
}
ho(["input", "change", "click", "keydown"]);
export { Qi as component };
