import "../chunks/Bzak7iHL.js";
import { o as ge } from "../chunks/BGJvssSt.js";
import {
  e as be,
  f as q,
  a as m,
  p as _e,
  U as u,
  V as ft,
  I as he,
  z as t,
  B as o,
  b as we,
  h as ye,
  d as s,
  s as i,
  c as f,
  $ as ke,
  r as a,
  X as xt,
  t as H,
  F as De,
} from "../chunks/CZsNqhY1.js";
import { s as V } from "../chunks/D4SvF6kG.js";
import { l as Ve, s as $e, i as Z } from "../chunks/CsBhEEN0.js";
import { I as Se, s as Ce, e as Ae, i as Te } from "../chunks/D_ntMQAe.js";
import { h as Pe } from "../chunks/C57bVzq3.js";
import { d as Ee, r as gt, s as Rt, b as Lt } from "../chunks/DDioZlon.js";
import { d as Ie, a as $ } from "../chunks/BLFvJadL.js";
import { b as bt, a as _t } from "../chunks/DFOm60R7.js";
import { S as je } from "../chunks/eFcn31mN.js";
import { B as Me } from "../chunks/DI35S9H6.js";
import { C as Ne, T as ze } from "../chunks/CSHFKzA8.js";
import { V as Fe } from "../chunks/D8FNBZgZ.js";
import { C as Be } from "../chunks/aDnaZvbC.js";
import { S as Re } from "../chunks/EGrcUm4A.js";
import { P as Le } from "../chunks/DpW8pZ2L.js";
import { C as Ot } from "../chunks/D9kr8FOy.js";
import { P as Oe } from "../chunks/DgL0CZso.js";
import "../chunks/CUONaVJB.js";
import { C as He } from "../chunks/CjOXa5Yh.js";
import { C as Ze } from "../chunks/qvlMHhdT.js";
import { C as qe } from "../chunks/3qHYYpT2.js";
function Ge(G, g) {
  const I = Ve(g, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const c = [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
  ];
  Se(
    G,
    $e({ name: "copy" }, () => I, {
      get iconNode() {
        return c;
      },
      children: (j, k) => {
        var x = be(),
          b = q(x);
        (Ce(b, g, "default", {}), m(j, x));
      },
      $$slots: { default: !0 },
    }),
  );
}
var Ue = f("<!> Nova Visita", 1),
  Xe = f(
    '<div class="flex justify-center p-12"><div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>',
  ),
  Je = f(
    '<div class="text-center py-20 bg-slate-50"><div class="flex justify-center mb-4"><div class="bg-indigo-100 p-3 rounded-full text-indigo-500"><!></div></div> <p class="text-sm font-medium text-slate-700">Nenhuma visita encontrada.</p> <p class="text-xs text-slate-400 mt-1">Cadastre uma nova visita clicando no botão acima.</p></div>',
  ),
  Ke = f('<span class="text-xs text-slate-400"> </span>'),
  Qe = f(
    '<div class="inline-flex items-center gap-1 text-sm text-slate-600"><!> </div>',
  ),
  We = f('<span class="text-sm text-slate-300">—</span>'),
  Ye =
    f(`<tr><td class="p-3.5"><div><p class="text-sm font-medium text-slate-900"> </p> <!></div></td><td class="p-3.5"><div class="flex items-center gap-1.5 text-sm text-slate-700"><!> <span class="font-medium"> </span> <span class="font-medium">às</span> <span class="font-medium"> </span></div></td><td class="p-3.5 text-center"><!></td><td class="p-3.5 text-center"><div class="inline-flex items-center gap-1 text-sm text-slate-600"><!> </div></td><td class="p-3.5 text-center"><!></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button type="button" class="p-2 rounded-lg transition-all duration-200 cursor-pointer
                        text-slate-500 opacity-60 hover:opacity-100 hover:text-indigo-600 hover:bg-slate-100" title="Duplicar visita"><!></button> <button type="button"><!></button></div></td></tr>`),
  ta = f(
    '<div class="bg-slate-50/80 border-t border-slate-100 px-5 py-3 flex justify-between items-center"><span class="text-sm text-slate-500 font-medium"> </span> <div class="flex items-center gap-1"><button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><!></button> <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><!></button></div></div>',
  ),
  ea = f(
    '<div class="overflow-x-auto"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="text-left p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[24%]">Profissional</th><th class="text-left p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[22%]">Data / Hora</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Duração</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Materiais</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[18%]">Status</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Ações</th></tr></thead><tbody></tbody></table></div> <!>',
    1,
  ),
  aa = f("<p>A exclusão de dados é permanente, deseja prosseguir?</p>"),
  sa = f(
    '<div class="space-y-6"><div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"><!></div> <div><h1 class="text-lg font-bold text-slate-800">Histórico de Visitas</h1> <p class="text-xs text-slate-400">Gerencie seu cronograma global de visitas a profissionais</p></div></div> <!></div> <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><div class="flex flex-wrap items-end gap-3"><div class="flex-1 min-w-[200px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="buscaVisita">Buscar por profissional</label> <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><!></span> <input id="buscaVisita" type="text" placeholder="Nome do profissional..." class="block w-full pl-9 rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"/></div></div> <div class="min-w-[160px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="dataInicio">Data início</label> <input id="dataInicio" type="date" class="block w-full rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"/></div> <div class="min-w-[160px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="dataFim">Data fim</label> <input id="dataFim" type="date" class="block w-full rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"/></div> <div class="min-w-[150px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="filtroStatusVisita">Status</label> <select id="filtroStatusVisita" class="block w-full bg-slate-50/50 rounded-lg border border-slate-200 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm"><option>Todos</option><option>Agendadas</option><option>Realizadas</option><option>Canceladas</option><option>Não Realizadas</option></select></div> <div class="flex gap-2"><button type="button" class="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">Limpar</button></div></div></div> <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><!></div></div> <!> <!>',
    1,
  );
function Sa(G, g) {
  _e(g, !0);
  let I = u(ft([])),
    c = u(ft({ page: 1, pageSize: 20, total: 0, totalPages: 0 })),
    j = u(!0),
    k = u(""),
    x = u(""),
    b = u(""),
    S = u(""),
    ht = u(ft([])),
    _ = u(!1),
    z = u(null),
    C = u(null);
  async function Ht() {
    try {
      const e = await _t("/materiais?pageSize=100", g.data.sessionToken);
      if (e.ok) {
        const r = await e.json();
        o(ht, r.data || r, !0);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function h(e = 1) {
    o(j, !0);
    try {
      let r = `/visitas?page=${e}&pageSize=${t(c).pageSize}`;
      (t(k) && (r += `&status=${t(k)}`),
        t(x).trim() && (r += `&q=${encodeURIComponent(t(x).trim())}`),
        t(b) && (r += `&dataInicio=${new Date(t(b)).toISOString()}`),
        t(S) &&
          (r += `&dataFim=${new Date(t(S) + "T23:59:59").toISOString()}`));
      const p = await _t(r, g.data.sessionToken);
      if (p.ok) {
        const v = await p.json();
        (o(I, v.data || v, !0), v.pagination && o(c, v.pagination, !0));
      }
    } catch (r) {
      console.error(r);
    } finally {
      o(j, !1);
    }
  }
  function Zt() {
    (o(z, null), o(C, null), o(_, !0));
  }
  function qt(e, r) {
    (e.stopPropagation(), o(z, r, !0), o(C, null), o(_, !0));
  }
  function Gt(e, r) {
    (e.stopPropagation(), o(z, null), o(C, r, !0), o(_, !0));
  }
  let F = u(!1),
    B = u(null);
  function Ut(e, r) {
    (e.stopPropagation(), !wt(r) && (o(B, r, !0), o(F, !0)));
  }
  async function Xt() {
    if (t(B)) {
      try {
        (
          await _t(`/visitas/${t(B).id}`, g.data.sessionToken, {
            method: "DELETE",
          })
        ).ok
          ? h(t(c).page)
          : alert("Erro ao excluir visita");
      } catch {}
      (o(F, !1), o(B, null));
    }
  }
  function wt(e) {
    if (e.status === "REALIZADA") return !0;
    const r = new Date(e.dataVisita);
    return (
      e.duracaoMinutos && r.setMinutes(r.getMinutes() + e.duracaoMinutos),
      r < new Date()
    );
  }
  let yt;
  function Jt() {
    (o(x, ""), o(k, ""), o(b, ""), o(S, ""), h(1));
  }
  (he(() => {
    (t(x),
      t(k),
      t(b),
      t(S),
      clearTimeout(yt),
      (yt = setTimeout(() => h(1), 300)));
  }),
    ge(() => {
      (h(), Ht());
    }));
  var kt = sa();
  Pe("wv08mz", (e) => {
    ye(() => {
      ke.title = "Histórico de Visitas — MediVisitas";
    });
  });
  var U = q(kt),
    X = s(U),
    J = s(X),
    Dt = s(J),
    Kt = s(Dt);
  (Be(Kt, { class: "h-4.5 w-4.5 text-white" }), a(Dt), xt(2), a(J));
  var Qt = i(J, 2);
  (Me(Qt, {
    onclick: Zt,
    class: "gap-2",
    children: (e, r) => {
      var p = Ue(),
        v = q(p);
      (Le(v, { class: "w-4 h-4" }), xt(), m(e, p));
    },
    $$slots: { default: !0 },
  }),
    a(X));
  var K = i(X, 2),
    Vt = s(K),
    Q = s(Vt),
    $t = i(s(Q), 2),
    W = s($t),
    Wt = s(W);
  (Re(Wt, { class: "w-4 h-4" }), a(W));
  var Y = i(W, 2);
  (gt(Y), a($t), a(Q));
  var tt = i(Q, 2),
    St = i(s(tt), 2);
  (gt(St), a(tt));
  var et = i(tt, 2),
    Ct = i(s(et), 2);
  (gt(Ct), a(et));
  var at = i(et, 2),
    st = i(s(at), 2),
    rt = s(st);
  rt.value = rt.__value = "";
  var ot = i(rt);
  ot.value = ot.__value = "AGENDADA";
  var it = i(ot);
  it.value = it.__value = "REALIZADA";
  var lt = i(it);
  lt.value = lt.__value = "CANCELADA";
  var At = i(lt);
  ((At.value = At.__value = "NAO_REALIZADA"), a(st), a(at));
  var Tt = i(at, 2),
    Yt = s(Tt);
  (a(Tt), a(Vt), a(K));
  var Pt = i(K, 2),
    te = s(Pt);
  {
    var ee = (e) => {
        var r = Xe();
        m(e, r);
      },
      ae = (e) => {
        var r = Je(),
          p = s(r),
          v = s(p),
          R = s(v);
        (Ot(R, { class: "mx-auto h-8 w-8" }), a(v), a(p), xt(4), a(r), m(e, r));
      },
      se = (e) => {
        var r = ea(),
          p = q(r),
          v = s(p),
          R = i(s(v));
        (Ae(
          R,
          21,
          () => t(I),
          Te,
          (M, n) => {
            const w = De(() => wt(t(n)));
            var D = Ye(),
              A = s(D),
              y = s(A),
              N = s(y),
              T = s(N, !0);
            a(N);
            var nt = i(N, 2);
            {
              var le = (l) => {
                var d = Ke(),
                  E = s(d, !0);
                (a(d),
                  H(() => V(E, t(n).profissional.especialidade.nome)),
                  m(l, d));
              };
              Z(nt, (l) => {
                var d;
                (d = t(n).profissional) != null && d.especialidade && l(le);
              });
            }
            (a(y), a(A));
            var dt = i(A),
              It = s(dt),
              jt = s(It);
            Ot(jt, { class: "w-3.5 h-3.5 text-slate-400 shrink-0" });
            var ct = i(jt, 2),
              ne = s(ct, !0);
            a(ct);
            var Mt = i(ct, 4),
              de = s(Mt, !0);
            (a(Mt), a(It), a(dt));
            var pt = i(dt),
              ce = s(pt);
            {
              var pe = (l) => {
                  var d = Qe(),
                    E = s(d);
                  He(E, { class: "w-3.5 h-3.5 text-slate-400" });
                  var O = i(E);
                  (a(d),
                    H(() => V(O, ` ${t(n).duracaoMinutos ?? ""} min`)),
                    m(l, d));
                },
                ue = (l) => {
                  var d = We();
                  m(l, d);
                };
              Z(ce, (l) => {
                t(n).duracaoMinutos ? l(pe) : l(ue, -1);
              });
            }
            a(pt);
            var ut = i(pt),
              vt = s(ut),
              Nt = s(vt);
            Oe(Nt, { class: "w-3.5 h-3.5 text-slate-400" });
            var ve = i(Nt);
            (a(vt), a(ut));
            var mt = i(ut),
              me = s(mt);
            (je(me, {
              get status() {
                return t(n).status;
              },
            }),
              a(mt));
            var zt = i(mt),
              Ft = s(zt),
              L = s(Ft),
              fe = s(L);
            (Ge(fe, { class: "w-3.5 h-3.5" }), a(L));
            var P = i(L, 2),
              xe = s(P);
            (ze(xe, { class: "w-3.5 h-3.5" }),
              a(P),
              a(Ft),
              a(zt),
              a(D),
              H(
                (l, d, E) => {
                  var O, Bt;
                  (Rt(
                    D,
                    1,
                    `border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60 group ${t(w) ? "opacity-70" : ""}`,
                  ),
                    V(
                      T,
                      ((O = t(n).profissional) == null ? void 0 : O.nome) ||
                        "Profissional Desconhecido",
                    ),
                    V(ne, l),
                    V(de, d),
                    Lt(vt, "title", E),
                    V(
                      ve,
                      ` ${(((Bt = t(n).materiais) == null ? void 0 : Bt.length) || 0) ?? ""}`,
                    ),
                    (P.disabled = t(w)),
                    Rt(
                      P,
                      1,
                      `p-2 rounded-lg transition-all duration-200 cursor-pointer
                        ${t(w) ? "text-slate-300 cursor-not-allowed" : "text-slate-500 opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-slate-100"}`,
                    ),
                    Lt(
                      P,
                      "title",
                      t(w) ? "Visita já ocorrida" : "Excluir visita",
                    ));
                },
                [
                  () =>
                    new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(t(n).dataVisita)),
                  () =>
                    new Intl.DateTimeFormat("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(t(n).dataVisita)),
                  () =>
                    t(n).materiais && t(n).materiais.length > 0
                      ? t(n).materiais.map((l) => {
                          var d;
                          return `${l.quantidade}x ${((d = l.materialTecnico) == null ? void 0 : d.nome) || "Material"}`;
                        }).join(`
`)
                      : "Sem materiais",
                ],
              ),
              $("click", D, (l) => qt(l, t(n))),
              $("click", L, (l) => Gt(l, t(n))),
              $("click", P, (l) => Ut(l, t(n))),
              m(M, D));
          },
        ),
          a(R),
          a(v),
          a(p));
        var oe = i(p, 2);
        {
          var ie = (M) => {
            var n = ta(),
              w = s(n),
              D = s(w);
            a(w);
            var A = i(w, 2),
              y = s(A),
              N = s(y);
            (Ze(N, { class: "w-4 h-4" }), a(y));
            var T = i(y, 2),
              nt = s(T);
            (qe(nt, { class: "w-4 h-4" }),
              a(T),
              a(A),
              a(n),
              H(() => {
                (V(
                  D,
                  `Página ${t(c).page ?? ""} de ${t(c).totalPages ?? ""} (${t(c).total ?? ""} registros)`,
                ),
                  (y.disabled = t(c).page <= 1),
                  (T.disabled = t(c).page >= t(c).totalPages));
              }),
              $("click", y, () => h(t(c).page - 1)),
              $("click", T, () => h(t(c).page + 1)),
              m(M, n));
          };
          Z(oe, (M) => {
            t(c).totalPages > 1 && M(ie);
          });
        }
        m(e, r);
      };
    Z(te, (e) => {
      t(j) ? e(ee) : t(I).length === 0 ? e(ae, 1) : e(se, -1);
    });
  }
  (a(Pt), a(U));
  var Et = i(U, 2);
  Fe(Et, {
    onclose: () => {
      (o(_, !1), o(C, null));
    },
    onsave: () => {
      (o(_, !1), o(C, null), h(t(c).page));
    },
    ondelete: () => {
      (o(_, !1), h(t(c).page));
    },
    get visita() {
      return t(z);
    },
    get duplicateSource() {
      return t(C);
    },
    get sessionToken() {
      return g.data.sessionToken;
    },
    get materiaisOptions() {
      return t(ht);
    },
    get open() {
      return t(_);
    },
    set open(e) {
      o(_, e, !0);
    },
  });
  var re = i(Et, 2);
  (Ne(re, {
    get open() {
      return t(F);
    },
    title: "Excluir/Cancelar Visita",
    confirmLabel: "Excluir",
    variant: "danger",
    onclose: () => o(F, !1),
    onconfirm: Xt,
    description: (r) => {
      var p = aa();
      m(r, p);
    },
    $$slots: { description: !0 },
  }),
    $("keydown", Y, (e) => {
      e.key === "Enter" && e.preventDefault();
    }),
    bt(
      Y,
      () => t(x),
      (e) => o(x, e),
    ),
    bt(
      St,
      () => t(b),
      (e) => o(b, e),
    ),
    bt(
      Ct,
      () => t(S),
      (e) => o(S, e),
    ),
    Ee(
      st,
      () => t(k),
      (e) => o(k, e),
    ),
    $("click", Yt, Jt),
    m(G, kt),
    we());
}
Ie(["keydown", "click"]);
export { Sa as component };
