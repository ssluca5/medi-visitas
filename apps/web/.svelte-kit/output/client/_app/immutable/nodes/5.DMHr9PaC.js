import "../chunks/Bzak7iHL.js";
import {
  e as Fe,
  f as z,
  a as c,
  p as na,
  U as h,
  V as St,
  I as da,
  B as o,
  z as e,
  b as ca,
  h as ua,
  d as r,
  s as l,
  c as f,
  W as it,
  t as A,
  F as B,
  $ as va,
  r as a,
  X as D,
} from "../chunks/CZsNqhY1.js";
import { s as w } from "../chunks/D4SvF6kG.js";
import { l as pa, s as fa, i as P } from "../chunks/CsBhEEN0.js";
import { I as ma, s as xa, e as Re, i as At } from "../chunks/D_ntMQAe.js";
import { h as ha } from "../chunks/C57bVzq3.js";
import { b as Ue, r as lt, s as be } from "../chunks/DDioZlon.js";
import { d as _a, e as Pt, a as S } from "../chunks/BLFvJadL.js";
import { a as G, b as nt } from "../chunks/DFOm60R7.js";
import { t as x } from "../chunks/BG-wUOgw.js";
import { B as ge } from "../chunks/DI35S9H6.js";
import { S as ba, C as dt, T as ct } from "../chunks/CSHFKzA8.js";
import { S as Be } from "../chunks/0So1ctTy.js";
import "../chunks/CUONaVJB.js";
import { P as Je } from "../chunks/DpW8pZ2L.js";
import { P as Tt, a as jt } from "../chunks/YBzjEPSW.js";
import { C as ga } from "../chunks/3qHYYpT2.js";
function Dt(Ve, T) {
  const C = pa(T, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const we = [["path", { d: "m6 9 6 6 6-6" }]];
  ma(
    Ve,
    fa({ name: "chevron-down" }, () => C, {
      get iconNode() {
        return we;
      },
      children: (ce, ee) => {
        var W = Fe(),
          te = z(W);
        (xa(te, T, "default", {}), c(ce, W));
      },
      $$slots: { default: !0 },
    }),
  );
}
var wa = f("<!> Nova Especialidade", 1),
  ya = f(
    '<div class="card-surface flex items-center justify-center py-20"><div class="flex flex-col items-center gap-3"><div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div> <span class="text-sm text-slate-400">Carregando especialidades...</span></div></div>',
  ),
  Ea = f(
    '<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50"><!></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Erro ao carregar</p> <p class="text-xs text-slate-400 mt-1"> </p></div> <!></div>',
  ),
  ka = f("<!> Criar Especialidade", 1),
  $a = f(
    '<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100"><!></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Nenhuma especialidade cadastrada</p> <p class="text-xs text-slate-400 mt-1">Comece adicionando a primeira especialidade</p></div> <!></div>',
  ),
  Ca = f(
    '<button class="p-1 rounded-md hover:bg-slate-100 transition-all duration-200 cursor-pointer"><!></button>',
  ),
  Sa = f(
    '<span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-medium text-slate-600"> </span>',
  ),
  Aa = f('<span class="text-xs text-slate-300">—</span>'),
  Pa = f(
    '<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-400">Inativa</span>',
  ),
  Ta = f(
    '<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700">Ativa</span>',
  ),
  ja = f(
    '<tr><td class="p-3.5"></td><td class="p-3.5 pl-9"><span class="text-sm text-slate-500"> </span></td><td class="p-3.5"></td><td class="p-3.5"><!></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button><!></button> <button title="Excluir subespecialidade" class="p-2 rounded-lg text-slate-500 opacity-40 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"><!></button></div></td></tr>',
  ),
  Da = f(
    '<tr class="border-t border-slate-50 bg-blue-50/30"><td class="p-3.5"></td><td class="p-2.5 pl-9" colspan="2"><div class="flex items-center gap-2"><span class="text-sm text-slate-400">↳</span> <input type="text" class="input-base text-sm py-1.5" placeholder="Nome da subespecialidade"/></div></td><td class="p-2.5"></td><td class="p-2.5"><div class="flex justify-center items-center gap-1"><button class="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"> </button> <button class="px-2.5 py-1 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">Cancelar</button></div></td></tr>',
  ),
  Na = f(
    '<tr class="border-t border-slate-50"><td class="p-2.5"></td><td class="p-2.5 pl-9" colspan="4"><button class="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"><!> Adicionar subespecialidade</button></td></tr>',
  ),
  Ia = f("<!> <!>", 1),
  Oa = f(
    '<tr><td class="p-3.5"><!></td><td class="p-3.5"><span> </span></td><td class="p-3.5 text-center"><!></td><td class="p-3.5"><span> </span></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button><!></button> <button title="Excluir" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"><!></button></div></td></tr> <!>',
    1,
  ),
  La = f(
    '<div class="group"><div class="mb-3 flex items-center justify-between"><div class="flex items-center gap-2.5"><div class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100"><!></div> <h3 class="text-sm font-semibold text-slate-700 tracking-wide"> </h3> <span class="text-xs text-slate-400"> </span></div> <button title="Excluir categoria" class="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer"><!></button></div> <div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-12"></th><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[40%]">Nome</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Subs</th><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[20%]">Status</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[25%]">Ações</th></tr></thead><tbody></tbody></table></div></div>',
  ),
  za = f('<div class="space-y-6"></div>'),
  Ra = f(
    '<button type="button" class="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"><span> </span></button>',
  ),
  Ua = f(
    '<button type="button" class="w-full px-3 py-2.5 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-2 border-t border-slate-100"><span class="text-blue-500">+</span> <span>Criar "<strong> </strong>"</span></button>',
  ),
  Ba = f(
    '<div class="px-3 py-2.5 text-sm text-slate-400">Digite para criar uma categoria</div>',
  ),
  Ja = f(
    '<div class="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto"><!> <!> <!></div>',
  ),
  Fa =
    f(`<div class="space-y-6"><div><h3 class="text-lg font-semibold text-slate-900"> </h3> <p class="text-sm text-slate-400 mt-1"> </p></div> <div class="space-y-5"><div><label for="esp-nome" class="input-label">Nome</label> <input id="esp-nome" type="text" class="input-base" placeholder="Ex: Cardiologia"/> <p class="input-hint">Nome da especialidade médica</p></div> <div class="relative"><label for="esp-categoria" class="input-label">Categoria</label> <div class="relative"><input id="esp-categoria" type="text" class="input-base pr-9" placeholder="Selecione ou crie uma categoria" autocomplete="off"/> <button type="button" class="absolute inset-y-0 right-0 flex items-center px-2.5
								text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><!></button></div> <p class="input-hint">Selecione existente ou digite para criar nova</p> <!></div></div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-100"><!> <!></div></div>`),
  Va = f("<p> </p>"),
  Ha = f(
    "<p>Você está prestes a excluir a especialidade <strong> </strong>.</p> <p>Esta ação não pode ser desfeita.</p>",
    1,
  ),
  Ma = f(
    `<p>A exclusão da categoria <strong> </strong> também excluirá todas
			as especialidades e subespecialidades vinculadas.</p> <p>Esta ação não pode ser desfeita.</p>`,
    1,
  ),
  Ga = f(
    "<p>Excluir a subespecialidade <strong> </strong> </p> <p>Esta ação não pode ser desfeita.</p>",
    1,
  ),
  Wa = f(
    '<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"><!></div> <div><h1 class="text-lg font-bold text-slate-800">Especialidades</h1> <p class="text-[11px] text-slate-400">Gerencie as especialidades e subespecialidades médicas</p></div></div> <div class="flex items-center gap-2"><!></div></div> <!> <!> <!> <!> <!> <!>',
    1,
  );
function us(Ve, T) {
  na(T, !0);
  let C = h(St([])),
    we = h(!0),
    ce = h(null),
    ee = h(!1),
    W = h(null),
    te = h(St(new Set())),
    ue = h(""),
    y = h(""),
    ve = h(!1),
    Ae = h(null),
    re = h(!1),
    X = h(null),
    ye = h(!1),
    ae = h(null),
    oe = h(null),
    Pe = h(!1),
    Te = h(null),
    ie = h(""),
    je = h(!1);
  function ut(t) {
    if (!t) return "";
    const s = t.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function Nt(t) {
    const s = new Set(e(te));
    (s.has(t) ? s.delete(t) : s.add(t), o(te, s, !0));
  }
  async function He() {
    (o(we, !0), o(ce, null));
    try {
      const t = await G(
        "/especialidades?incluirInativos=true",
        T.data.sessionToken,
      );
      if (!t.ok) throw new Error(`Erro ${t.status}`);
      const s = await t.json(),
        i = await Promise.all(
          s.data.map(async (d) => {
            try {
              const n = await G(
                `/especialidades/${d.id}/subespecialidades?incluirInativas=true`,
                T.data.sessionToken,
              );
              if (n.ok) {
                const v = await n.json();
                return { ...d, subEspecialidades: v.data || [] };
              }
            } catch {}
            return { ...d, subEspecialidades: [] };
          }),
        );
      o(C, i, !0);
    } catch (t) {
      o(ce, t instanceof Error ? t.message : "Erro desconhecido", !0);
    } finally {
      o(we, !1);
    }
  }
  da(() => {
    He();
  });
  let Me = B(() =>
      e(C).reduce((t, s) => {
        const i = ut(s.categoria);
        return (t[i] || (t[i] = []), t[i].push(s), t);
      }, {}),
    ),
    De = B(() =>
      Object.keys(e(Me)).sort((t, s) =>
        t.toLowerCase().localeCompare(s.toLowerCase()),
      ),
    ),
    q = h(!1),
    Ge = B(() =>
      e(De).filter((t) => t.toLowerCase().includes(e(y).toLowerCase())),
    );
  function We() {
    (o(W, null), o(ue, ""), o(y, ""), o(ee, !0));
  }
  function It(t) {
    (o(W, { id: t.id, nome: t.nome, categoria: t.categoria }, !0),
      o(ue, t.nome, !0),
      o(y, t.categoria, !0),
      o(ee, !0));
  }
  async function Ot() {
    var d;
    if (!e(ue).trim() || !e(y).trim()) {
      x.show("error", "Nome e categoria são obrigatórios.");
      return;
    }
    const t = {
        id: (d = e(W)) == null ? void 0 : d.id,
        nome: e(ue),
        categoria: e(y).charAt(0).toUpperCase() + e(y).slice(1).toLowerCase(),
      },
      s = t.id ? `/especialidades/${t.id}` : "/especialidades",
      i = t.id ? "PUT" : "POST";
    try {
      const n = await G(s, T.data.sessionToken, {
        method: i,
        body: JSON.stringify(t),
      });
      if (!n.ok) throw new Error(`Erro ${n.status}`);
      (o(ee, !1),
        x.show(
          "success",
          t.id ? "Especialidade atualizada!" : "Especialidade criada!",
        ),
        He());
    } catch (n) {
      x.show("error", n instanceof Error ? n.message : "Erro ao salvar");
    }
  }
  async function Lt(t) {
    try {
      const s = await G(`/especialidades/${t.id}/ativo`, T.data.sessionToken, {
        method: "PATCH",
        body: JSON.stringify({ ativo: !t.ativo }),
      });
      if (s.ok) {
        const i = await s.json();
        (o(
          C,
          e(C).map((d) => {
            if (d.id === t.id) {
              const n = i.ativo;
              return {
                ...d,
                ativo: n,
                subEspecialidades: (d.subEspecialidades || []).map((v) => ({
                  ...v,
                  deletedAt: n ? null : new Date().toISOString(),
                })),
              };
            }
            return d;
          }),
          !0,
        ),
          i.filhasInativadas > 0
            ? x.show(
                "info",
                `"${t.nome}" inativada. ${i.filhasInativadas} sub(s) também.`,
              )
            : i.filhasReativadas > 0
              ? x.show(
                  "info",
                  `"${t.nome}" reativada. ${i.filhasReativadas} sub(s) também.`,
                )
              : x.show(
                  "success",
                  i.ativo ? `"${t.nome}" reativada.` : `"${t.nome}" inativada.`,
                ));
      }
    } catch {
      x.show("error", "Erro ao alterar status");
    }
  }
  async function zt(t, s) {
    const i = !t.deletedAt;
    try {
      (
        await G(`/subespecialidades/${t.id}/ativo`, T.data.sessionToken, {
          method: "PATCH",
          body: JSON.stringify({ ativo: !i }),
        })
      ).ok &&
        (o(
          C,
          e(C).map((n) =>
            n.id !== s
              ? n
              : {
                  ...n,
                  subEspecialidades: (n.subEspecialidades || []).map((v) =>
                    v.id === t.id
                      ? { ...v, deletedAt: i ? new Date().toISOString() : null }
                      : v,
                  ),
                },
          ),
          !0,
        ),
        x.show(
          "success",
          i ? `"${t.nome}" inativada.` : `"${t.nome}" reativada.`,
        ));
    } catch {
      x.show("error", "Erro ao alterar status");
    }
  }
  async function Rt(t) {
    try {
      const s = await G(
        `/especialidades/${t.id}/profissionais-ativos`,
        T.data.sessionToken,
      );
      if (s.ok) {
        const i = await s.json();
        if (i.temProfissionaisAtivos) {
          (o(
            Ae,
            i.count === 1
              ? `Existe ${i.count} profissional ativo vinculado. Inative-o primeiro.`
              : `Existem ${i.count} profissionais ativos vinculados. Inative-os primeiro.`,
            !0,
          ),
            o(X, t, !0),
            o(re, !0),
            o(ve, !0));
          return;
        }
      }
    } catch {}
    (o(X, t, !0), o(Ae, null), o(re, !1), o(ve, !0));
  }
  async function Ut() {
    if (!e(X)) return;
    const t = await G(`/especialidades/${e(X).id}`, T.data.sessionToken, {
      method: "DELETE",
    });
    if (!t.ok) {
      const s = await t.json();
      (x.show("error", s.error || "Erro ao excluir"), o(ve, !1));
      return;
    }
    (o(
      C,
      e(C).filter((s) => s.id !== e(X).id),
      !0,
    ),
      x.show("success", `"${e(X).nome}" excluída.`),
      o(ve, !1),
      o(X, null));
  }
  async function Bt() {
    if (!e(ae)) return;
    const t = await G(
      `/especialidades/categorias/${encodeURIComponent(e(ae))}`,
      T.data.sessionToken,
      { method: "DELETE" },
    );
    if (!t.ok) {
      const i = await t.json();
      (x.show("error", i.error || "Erro ao excluir categoria"), o(ye, !1));
      return;
    }
    const s = await t.json();
    (o(
      C,
      e(C).filter((i) => i.categoria !== e(ae)),
      !0,
    ),
      x.show(
        "success",
        `Categoria "${e(ae)}" excluída (${s.excluidas} itens).`,
      ),
      o(ye, !1),
      o(ae, null));
  }
  function Jt(t, s) {
    (o(oe, { sub: t, espNome: s }, !0), o(Pe, !0));
  }
  async function Ft() {
    if (!e(oe)) return;
    const { sub: t } = e(oe);
    try {
      const s = await G(`/subespecialidades/${t.id}`, T.data.sessionToken, {
        method: "DELETE",
      });
      s.ok
        ? (o(
            C,
            e(C).map((i) => ({
              ...i,
              subEspecialidades: (i.subEspecialidades || []).filter(
                (d) => d.id !== t.id,
              ),
            })),
            !0,
          ),
          x.show("success", `"${t.nome}" excluída.`))
        : s.status === 409
          ? x.show(
              "error",
              "Subespecialidade possui profissionais vinculados. Desvincule-os primeiro.",
            )
          : x.show("error", "Erro ao excluir subespecialidade.");
    } catch {
      x.show("error", "Erro ao excluir subespecialidade.");
    } finally {
      (o(Pe, !1), o(oe, null));
    }
  }
  function Vt(t) {
    if ((o(Te, t, !0), o(ie, ""), !e(te).has(t))) {
      const s = new Set(e(te));
      (s.add(t), o(te, s, !0));
    }
  }
  function vt() {
    (o(Te, null), o(ie, ""));
  }
  async function pt(t) {
    if (!e(ie).trim()) {
      x.show("error", "Nome da subespecialidade é obrigatório.");
      return;
    }
    o(je, !0);
    try {
      const s = await G("/subespecialidades", T.data.sessionToken, {
        method: "POST",
        body: JSON.stringify({ nome: e(ie).trim(), especialidadeId: t }),
      });
      if (s.status === 409) {
        x.show("error", "Já existe uma subespecialidade com este nome.");
        return;
      }
      if (!s.ok) throw new Error(`Erro ${s.status}`);
      const d = (await s.json()).data;
      (o(
        C,
        e(C).map((n) =>
          n.id === t
            ? {
                ...n,
                subEspecialidades: [
                  ...(n.subEspecialidades || []),
                  {
                    id: d.id,
                    nome: d.nome,
                    especialidadeId: t,
                    deletedAt: null,
                  },
                ],
              }
            : n,
        ),
        !0,
      ),
        x.show("success", "Subespecialidade criada com sucesso."),
        o(Te, null),
        o(ie, ""));
    } catch (s) {
      x.show(
        "error",
        s instanceof Error ? s.message : "Erro ao criar subespecialidade.",
      );
    } finally {
      o(je, !1);
    }
  }
  var ft = Wa();
  ha("ninlt0", (t) => {
    ua(() => {
      va.title = "Especialidades — MediVisitas";
    });
  });
  var Xe = z(ft),
    qe = r(Xe),
    mt = r(qe),
    Ht = r(mt);
  (Be(Ht, { class: "h-4.5 w-4.5 text-white" }), a(mt), D(2), a(qe));
  var xt = l(qe, 2),
    Mt = r(xt);
  (ge(Mt, {
    onclick: We,
    class: "hidden sm:inline-flex gap-2",
    children: (t, s) => {
      var i = wa(),
        d = z(i);
      (Je(d, { class: "h-4 w-4" }), D(), c(t, i));
    },
    $$slots: { default: !0 },
  }),
    a(xt),
    a(Xe));
  var ht = l(Xe, 2);
  {
    var Gt = (t) => {
        var s = ya();
        c(t, s);
      },
      Wt = (t) => {
        var s = Ea(),
          i = r(s),
          d = r(i);
        (Be(d, { class: "h-6 w-6 text-red-400" }), a(i));
        var n = l(i, 2),
          v = l(r(n), 2),
          E = r(v, !0);
        (a(v), a(n));
        var b = l(n, 2);
        (ge(b, {
          variant: "outline",
          size: "sm",
          onclick: () => He(),
          children: (m, _) => {
            D();
            var N = it("Tentar novamente");
            c(m, N);
          },
          $$slots: { default: !0 },
        }),
          a(s),
          A(() => w(E, e(ce))),
          c(t, s));
      },
      Xt = (t) => {
        var s = $a(),
          i = r(s),
          d = r(i);
        (Be(d, { class: "h-7 w-7 text-slate-400" }), a(i));
        var n = l(i, 4);
        (ge(n, {
          size: "sm",
          onclick: We,
          class: "gap-2",
          children: (v, E) => {
            var b = ka(),
              m = z(b);
            (Je(m, { class: "h-4 w-4" }), D(), c(v, b));
          },
          $$slots: { default: !0 },
        }),
          a(s),
          c(t, s));
      },
      qt = (t) => {
        var s = za();
        (Re(
          s,
          21,
          () => e(De),
          At,
          (i, d) => {
            var n = La(),
              v = r(n),
              E = r(v),
              b = r(E),
              m = r(b);
            (Be(m, { class: "h-3.5 w-3.5 text-slate-500" }), a(b));
            var _ = l(b, 2),
              N = r(_, !0);
            a(_);
            var se = l(_, 2),
              le = r(se);
            (a(se), a(E));
            var J = l(E, 2),
              pe = r(J);
            (ct(pe, {
              class:
                "w-3.5 h-3.5 text-slate-400 hover:text-red-500 transition-colors",
            }),
              a(J),
              a(v));
            var Ne = l(v, 2),
              Ie = r(Ne),
              Oe = l(r(Ie));
            (Re(
              Oe,
              21,
              () => e(Me)[e(d)].sort((K, u) => K.nome.localeCompare(u.nome)),
              (K) => K.id,
              (K, u) => {
                const fe = B(() => {
                    var p;
                    return (
                      ((p = e(u).subEspecialidades) == null
                        ? void 0
                        : p.length) ?? 0
                    );
                  }),
                  Ee = B(() => e(te).has(e(u).id));
                var g = Oa(),
                  R = z(g);
                let F;
                var me = r(R),
                  Ke = r(me);
                {
                  var Qe = (p) => {
                    var j = Ca(),
                      he = r(j);
                    {
                      var et = (V) => {
                          Dt(V, { class: "w-4 h-4 text-slate-400" });
                        },
                        tt = (V) => {
                          ga(V, { class: "w-4 h-4 text-slate-400" });
                        };
                      P(he, (V) => {
                        e(Ee) ? V(et) : V(tt, -1);
                      });
                    }
                    (a(j),
                      A(() => Ue(j, "title", e(Ee) ? "Recolher" : "Expandir")),
                      S("click", j, (V) => {
                        (V.stopPropagation(), Nt(e(u).id));
                      }),
                      c(p, j));
                  };
                  P(Ke, (p) => {
                    e(fe) > 0 && p(Qe);
                  });
                }
                a(me);
                var ke = l(me),
                  $e = r(ke);
                let Le;
                var I = r($e, !0);
                (a($e), a(ke));
                var O = l(ke),
                  Q = r(O);
                {
                  var ne = (p) => {
                      var j = Sa(),
                        he = r(j, !0);
                      (a(j), A(() => w(he, e(fe))), c(p, j));
                    },
                    Ce = (p) => {
                      var j = Aa();
                      c(p, j);
                    };
                  P(Q, (p) => {
                    e(fe) > 0 ? p(ne) : p(Ce, -1);
                  });
                }
                a(O);
                var Se = l(O),
                  Ye = r(Se);
                let yt;
                var Qt = r(Ye, !0);
                (a(Ye), a(Se));
                var Et = l(Se),
                  kt = r(Et),
                  xe = r(kt),
                  Yt = r(xe);
                {
                  var Zt = (p) => {
                      Tt(p, { class: "w-4 h-4" });
                    },
                    ea = (p) => {
                      jt(p, { class: "w-4 h-4" });
                    };
                  P(Yt, (p) => {
                    e(u).ativo ? p(Zt) : p(ea, -1);
                  });
                }
                a(xe);
                var Ze = l(xe, 2),
                  ta = r(Ze);
                (ct(ta, { class: "w-3.5 h-3.5 transition-colors" }),
                  a(Ze),
                  a(kt),
                  a(Et),
                  a(R));
                var aa = l(R, 2);
                {
                  var sa = (p) => {
                    var j = Ia(),
                      he = z(j);
                    Re(
                      he,
                      17,
                      () => e(u).subEspecialidades ?? [],
                      (H) => H.id,
                      (H, k) => {
                        var U = ja();
                        let Y;
                        var M = l(r(U)),
                          de = r(M),
                          ze = r(de);
                        (a(de), a(M));
                        var Z = l(M, 2),
                          at = r(Z);
                        {
                          var st = ($) => {
                              var ot = Pa();
                              c($, ot);
                            },
                            L = ($) => {
                              var ot = Ta();
                              c($, ot);
                            };
                          P(at, ($) => {
                            e(k).deletedAt ? $(st) : $(L, -1);
                          });
                        }
                        a(Z);
                        var $t = l(Z),
                          Ct = r($t),
                          _e = r(Ct),
                          ra = r(_e);
                        {
                          var oa = ($) => {
                              jt($, { class: "w-4 h-4" });
                            },
                            ia = ($) => {
                              Tt($, { class: "w-4 h-4" });
                            };
                          P(ra, ($) => {
                            e(k).deletedAt ? $(oa) : $(ia, -1);
                          });
                        }
                        a(_e);
                        var rt = l(_e, 2),
                          la = r(rt);
                        (ct(la, { class: "w-3 h-3 transition-colors" }),
                          a(rt),
                          a(Ct),
                          a($t),
                          a(U),
                          A(() => {
                            ((Y = be(
                              U,
                              1,
                              "border-t border-slate-50 bg-slate-25 transition-all",
                              null,
                              Y,
                              {
                                "opacity-60": !!e(k).deletedAt,
                                italic: !!e(k).deletedAt,
                              },
                            )),
                              w(ze, `↳ ${e(k).nome ?? ""}`),
                              Ue(
                                _e,
                                "title",
                                e(k).deletedAt ? "Ativar" : "Inativar",
                              ),
                              be(
                                _e,
                                1,
                                `p-2 rounded-lg text-slate-500 opacity-40 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer ${e(k).deletedAt ? "hover:text-green-600" : "hover:text-amber-600"}`,
                              ));
                          }),
                          S("click", _e, ($) => {
                            ($.stopPropagation(), zt(e(k), e(u).id));
                          }),
                          S("click", rt, ($) => {
                            ($.stopPropagation(), Jt(e(k), e(u).nome));
                          }),
                          c(H, U));
                      },
                    );
                    var et = l(he, 2);
                    {
                      var tt = (H) => {
                          var k = Da(),
                            U = l(r(k)),
                            Y = r(U),
                            M = l(r(Y), 2);
                          (lt(M), a(Y), a(U));
                          var de = l(U, 2),
                            ze = r(de),
                            Z = r(ze),
                            at = r(Z, !0);
                          a(Z);
                          var st = l(Z, 2);
                          (a(ze),
                            a(de),
                            a(k),
                            A(() => {
                              ((Z.disabled = e(je)),
                                w(at, e(je) ? "Salvando..." : "Salvar"));
                            }),
                            S("click", M, (L) => L.stopPropagation()),
                            S("keydown", M, (L) => {
                              (L.key === "Enter" &&
                                (L.preventDefault(), pt(e(u).id)),
                                L.key === "Escape" && vt());
                            }),
                            nt(
                              M,
                              () => e(ie),
                              (L) => o(ie, L),
                            ),
                            S("click", Z, (L) => {
                              (L.stopPropagation(), pt(e(u).id));
                            }),
                            S("click", st, (L) => {
                              (L.stopPropagation(), vt());
                            }),
                            c(H, k));
                        },
                        V = (H) => {
                          var k = Na(),
                            U = l(r(k)),
                            Y = r(U),
                            M = r(Y);
                          (Je(M, { class: "w-3.5 h-3.5" }),
                            D(),
                            a(Y),
                            a(U),
                            a(k),
                            S("click", Y, (de) => {
                              (de.stopPropagation(), Vt(e(u).id));
                            }),
                            c(H, k));
                        };
                      P(et, (H) => {
                        e(Te) === e(u).id ? H(tt) : H(V, -1);
                      });
                    }
                    c(p, j);
                  };
                  P(aa, (p) => {
                    e(Ee) && p(sa);
                  });
                }
                (A(() => {
                  ((F = be(
                    R,
                    1,
                    "group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60",
                    null,
                    F,
                    { "opacity-50": !e(u).ativo },
                  )),
                    (Le = be(
                      $e,
                      1,
                      "text-sm font-medium text-slate-800",
                      null,
                      Le,
                      { "text-slate-400": !e(u).ativo },
                    )),
                    w(I, e(u).nome),
                    (yt = be(
                      Ye,
                      1,
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                      null,
                      yt,
                      {
                        "bg-emerald-50": e(u).ativo,
                        "text-emerald-700": e(u).ativo,
                        "bg-slate-100": !e(u).ativo,
                        "text-slate-400": !e(u).ativo,
                      },
                    )),
                    w(Qt, e(u).ativo ? "Ativa" : "Inativa"),
                    Ue(xe, "title", e(u).ativo ? "Inativar" : "Ativar"),
                    be(
                      xe,
                      1,
                      `p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer ${e(u).ativo ? "hover:text-amber-600" : "hover:text-green-600"}`,
                    ));
                }),
                  S("click", R, () => It(e(u))),
                  S("click", xe, (p) => {
                    (p.stopPropagation(), Lt(e(u)));
                  }),
                  S("click", Ze, (p) => {
                    (p.stopPropagation(), Rt(e(u)));
                  }),
                  c(K, g));
              },
            ),
              a(Oe),
              a(Ie),
              a(Ne),
              a(n),
              A(
                (K) => {
                  (w(N, K), w(le, `(${e(Me)[e(d)].length ?? ""})`));
                },
                [() => ut(e(d))],
              ),
              S("click", J, () => {
                (o(ae, e(d), !0), o(ye, !0));
              }),
              c(i, n));
          },
        ),
          a(s),
          c(t, s));
      };
    P(ht, (t) => {
      e(we)
        ? t(Gt)
        : e(ce)
          ? t(Wt, 1)
          : e(De).length === 0
            ? t(Xt, 2)
            : t(qt, -1);
    });
  }
  var _t = l(ht, 2);
  ba(_t, {
    onclose: () => o(ee, !1),
    get open() {
      return e(ee);
    },
    set open(s) {
      o(ee, s, !0);
    },
    children: (s) => {
      var i = Fa(),
        d = r(i),
        n = r(d),
        v = r(n, !0);
      a(n);
      var E = l(n, 2),
        b = r(E, !0);
      (a(E), a(d));
      var m = l(d, 2),
        _ = r(m),
        N = l(r(_), 2);
      (lt(N), D(2), a(_));
      var se = l(_, 2),
        le = l(r(se), 2),
        J = r(le);
      lt(J);
      var pe = l(J, 2);
      Ue(pe, "tabindex", -1);
      var Ne = r(pe);
      {
        let g = B(() => (e(q) ? "rotate-180" : ""));
        Dt(Ne, {
          get class() {
            return `w-4 h-4 transition-transform duration-200 ${e(g) ?? ""}`;
          },
        });
      }
      (a(pe), a(le));
      var Ie = l(le, 4);
      {
        var Oe = (g) => {
            var R = Ja(),
              F = r(R);
            Re(
              F,
              17,
              () => e(Ge),
              At,
              (I, O) => {
                var Q = Ra(),
                  ne = r(Q),
                  Ce = r(ne, !0);
                (a(ne),
                  a(Q),
                  A(() => w(Ce, e(O))),
                  S("mousedown", Q, () => {
                    (o(y, e(O), !0), o(q, !1));
                  }),
                  c(I, Q));
              },
            );
            var me = l(F, 2);
            {
              var Ke = (I) => {
                  var O = Ua(),
                    Q = l(r(O), 2),
                    ne = l(r(Q)),
                    Ce = r(ne, !0);
                  (a(ne),
                    D(),
                    a(Q),
                    a(O),
                    A((Se) => w(Ce, Se), [() => e(y).trim()]),
                    S("mousedown", O, () => {
                      (o(
                        y,
                        e(y).trim().charAt(0).toUpperCase() +
                          e(y).trim().slice(1).toLowerCase(),
                      ),
                        o(q, !1));
                    }),
                    c(I, O));
                },
                Qe = B(
                  () =>
                    e(y).trim() &&
                    !e(De).some(
                      (I) => I.toLowerCase() === e(y).trim().toLowerCase(),
                    ),
                );
              P(me, (I) => {
                e(Qe) && I(Ke);
              });
            }
            var ke = l(me, 2);
            {
              var $e = (I) => {
                  var O = Ba();
                  c(I, O);
                },
                Le = B(() => e(Ge).length === 0 && !e(y).trim());
              P(ke, (I) => {
                e(Le) && I($e);
              });
            }
            (a(R), c(g, R));
          },
          K = B(() => e(q) && (e(Ge).length > 0 || e(y).trim()));
        P(Ie, (g) => {
          e(K) && g(Oe);
        });
      }
      (a(se), a(m));
      var u = l(m, 2),
        fe = r(u);
      ge(fe, {
        variant: "outline",
        onclick: () => o(ee, !1),
        children: (g, R) => {
          D();
          var F = it("Cancelar");
          c(g, F);
        },
        $$slots: { default: !0 },
      });
      var Ee = l(fe, 2);
      (ge(Ee, {
        onclick: Ot,
        children: (g, R) => {
          D();
          var F = it();
          (A(() => w(F, e(W) ? "Salvar" : "Criar")), c(g, F));
        },
        $$slots: { default: !0 },
      }),
        a(u),
        a(i),
        A(() => {
          (w(v, e(W) ? "Editar Especialidade" : "Nova Especialidade"),
            w(
              b,
              e(W)
                ? "Atualize os dados abaixo"
                : "Preencha os dados para cadastrar",
            ));
        }),
        nt(
          N,
          () => e(ue),
          (g) => o(ue, g),
        ),
        Pt("focus", J, () => o(q, !0)),
        Pt("blur", J, () => setTimeout(() => o(q, !1), 150)),
        S("input", J, () => o(q, !0)),
        nt(
          J,
          () => e(y),
          (g) => o(y, g),
        ),
        S("mousedown", pe, (g) => {
          (g.preventDefault(), o(q, !e(q)));
        }),
        c(s, i));
    },
    $$slots: { default: !0 },
  });
  var bt = l(_t, 2);
  ge(bt, {
    class:
      "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden",
    onclick: We,
    children: (t, s) => {
      Je(t, { class: "h-6 w-6 text-white" });
    },
    $$slots: { default: !0 },
  });
  var gt = l(bt, 2);
  {
    const t = (d) => {
      var n = Fe(),
        v = z(n);
      {
        var E = (m) => {
            var _ = Va(),
              N = r(_, !0);
            (a(_), A(() => w(N, e(Ae))), c(m, _));
          },
          b = (m) => {
            var _ = Ha(),
              N = z(_),
              se = l(r(N)),
              le = r(se);
            (a(se),
              D(),
              a(N),
              D(2),
              A(() => w(le, `"${e(X).nome ?? ""}"`)),
              c(m, _));
          };
        P(v, (m) => {
          e(re) && e(Ae) ? m(E) : e(X) && m(b, 1);
        });
      }
      c(d, n);
    };
    let s = B(() => (e(re) ? "Especialidade em uso" : "Excluir especialidade")),
      i = B(() => (e(re) ? "warning" : "danger"));
    dt(gt, {
      get open() {
        return e(ve);
      },
      onclose: () => {
        (o(ve, !1), o(re, !1));
      },
      get title() {
        return e(s);
      },
      onconfirm: Ut,
      get variant() {
        return e(i);
      },
      get isBlockingDialog() {
        return e(re);
      },
      description: t,
      $$slots: { description: !0 },
    });
  }
  var wt = l(gt, 2);
  dt(wt, {
    get open() {
      return e(ye);
    },
    onclose: () => o(ye, !1),
    title: "Excluir categoria",
    variant: "danger",
    onconfirm: Bt,
    description: (s) => {
      var i = Fe(),
        d = z(i);
      {
        var n = (v) => {
          var E = Ma(),
            b = z(E),
            m = l(r(b)),
            _ = r(m);
          (a(m), D(), a(b), D(2), A(() => w(_, `"${e(ae) ?? ""}"`)), c(v, E));
        };
        P(d, (v) => {
          e(ae) && v(n);
        });
      }
      c(s, i);
    },
    $$slots: { description: !0 },
  });
  var Kt = l(wt, 2);
  (dt(Kt, {
    get open() {
      return e(Pe);
    },
    onclose: () => o(Pe, !1),
    title: "Excluir subespecialidade",
    variant: "danger",
    onconfirm: Ft,
    description: (s) => {
      var i = Fe(),
        d = z(i);
      {
        var n = (v) => {
          var E = Ga(),
            b = z(E),
            m = l(r(b)),
            _ = r(m);
          a(m);
          var N = l(m);
          (a(b),
            D(2),
            A(() => {
              (w(_, `"${e(oe).sub.nome ?? ""}"`),
                w(N, ` de "${e(oe).espNome ?? ""}"?`));
            }),
            c(v, E));
        };
        P(d, (v) => {
          e(oe) && v(n);
        });
      }
      c(s, i);
    },
    $$slots: { description: !0 },
  }),
    c(Ve, ft),
    ca());
}
_a(["click", "keydown", "input", "mousedown"]);
export { us as component };
