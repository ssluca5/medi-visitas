import "../chunks/Bzak7iHL.js";
import { o as Ft, a as Bt } from "../chunks/BGJvssSt.js";
import {
  e as Dt,
  f as pt,
  a as f,
  p as bt,
  d as a,
  r as e,
  s as m,
  t as H,
  z as t,
  b as ht,
  F as y,
  c as b,
  U as B,
  V as xt,
  B as u,
  X as gt,
  I as Ut,
  h as Yt,
  $ as Gt,
} from "../chunks/CZsNqhY1.js";
import { d as _t, a as at } from "../chunks/BLFvJadL.js";
import { l as Ht, s as Nt, i as rt, p as Xt } from "../chunks/CsBhEEN0.js";
import { h as Zt } from "../chunks/C57bVzq3.js";
import { h as Et, s as dt } from "../chunks/DDioZlon.js";
import { a as Mt } from "../chunks/DFOm60R7.js";
import { s as I } from "../chunks/D4SvF6kG.js";
import { I as Lt, s as Rt, e as mt, i as ft } from "../chunks/D_ntMQAe.js";
import { C as Pt } from "../chunks/CjOXa5Yh.js";
import { C as Vt } from "../chunks/qvlMHhdT.js";
import { C as zt } from "../chunks/3qHYYpT2.js";
import { T as Tt } from "../chunks/CqukC_q6.js";
import { C as Qt } from "../chunks/Bz-yDreG.js";
import { V as Jt } from "../chunks/D8FNBZgZ.js";
import "../chunks/CSHFKzA8.js";
import { C as jt } from "../chunks/aDnaZvbC.js";
import "../chunks/CUONaVJB.js";
function qt(G, r) {
  const S = Ht(r, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const A = [
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M17 14h-6" }],
    ["path", { d: "M13 18H7" }],
    ["path", { d: "M7 14h.01" }],
    ["path", { d: "M17 18h.01" }],
  ];
  Lt(
    G,
    Nt({ name: "calendar-range" }, () => S, {
      get iconNode() {
        return A;
      },
      children: (N, X) => {
        var D = Dt(),
          p = pt(D);
        (Rt(p, r, "default", {}), f(N, D));
      },
      $$slots: { default: !0 },
    }),
  );
}
function Kt(G, r) {
  const S = Ht(r, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const A = [
    [
      "path",
      {
        d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      },
    ],
    ["path", { d: "M20 3v4" }],
    ["path", { d: "M22 5h-4" }],
    ["path", { d: "M4 17v2" }],
    ["path", { d: "M5 18H3" }],
  ];
  Lt(
    G,
    Nt({ name: "sparkles" }, () => S, {
      get iconNode() {
        return A;
      },
      children: (N, X) => {
        var D = Dt(),
          p = pt(D);
        (Rt(p, r, "default", {}), f(N, D));
      },
      $$slots: { default: !0 },
    }),
  );
}
var Wt = b(
    '<p class="text-[10px] uppercase tracking-wider text-slate-400 font-medium mt-0.5"> </p>',
  ),
  $t = b('<p class="mt-1.5 text-[11px] text-slate-400 truncate"> </p>'),
  te = b(
    '<div class="group relative z-10 shrink-0 rounded-lg bg-white border border-slate-200 p-3 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-[1px] shadow-sm hover:shadow-md hover:z-20 active:scale-[0.98] overflow-hidden"><div class="flex items-start justify-between gap-2"><div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-slate-800 truncate"> </p> <!></div> <span> </span></div> <div class="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500"><!> <span class="font-medium"> </span></div> <!></div>',
  );
function ee(G, r) {
  bt(r, !0);
  const S = {
      URGENTE: "#ef4444",
      ALTA: "#f59e0b",
      MEDIA: "#3b82f6",
      BAIXA: "#94a3b8",
    },
    A = {
      PLANEJADO: "Planejado",
      CONFIRMADO: "Confirmado",
      REALIZADO: "Realizado",
      CANCELADO: "Cancelado",
    },
    N = {
      PLANEJADO: "bg-blue-50 text-blue-700",
      CONFIRMADO: "bg-emerald-50 text-emerald-700",
      REALIZADO: "bg-slate-100 text-slate-600",
      CANCELADO: "bg-red-50 text-red-600",
    };
  let X = y(() =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(r.item.dataHoraInicio)),
    ),
    D = y(() =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(r.item.dataHoraFim)),
    ),
    p = y(() => {
      const n =
          new Date(r.item.dataHoraFim).getTime() -
          new Date(r.item.dataHoraInicio).getTime(),
        i = Math.max(1, n / 6e4);
      return Math.max(i * 2, 75);
    });
  var w = te(),
    T = a(w),
    j = a(T),
    U = a(j),
    Z = a(U, !0);
  e(U);
  var F = m(U, 2);
  {
    var g = (n) => {
      var i = Wt(),
        c = a(i, !0);
      (e(i), H(() => I(c, r.item.profissional.especialidade.nome)), f(n, i));
    };
    rt(F, (n) => {
      var i;
      (i = r.item.profissional) != null && i.especialidade && n(g);
    });
  }
  e(j);
  var h = m(j, 2),
    st = a(h, !0);
  (e(h), e(T));
  var _ = m(T, 2),
    P = a(_);
  Pt(P, { class: "h-3 w-3 text-slate-400" });
  var E = m(P, 2),
    Y = a(E);
  (e(E), e(_));
  var L = m(_, 2);
  {
    var ot = (n) => {
      var i = $t(),
        c = a(i, !0);
      (e(i), H(() => I(c, r.item.observacoes)), f(n, i));
    };
    rt(L, (n) => {
      r.item.observacoes && n(ot);
    });
  }
  (e(w),
    H(() => {
      var n;
      (Et(
        w,
        `border-left: 3px solid ${S[r.item.prioridade] ?? ""}; height: ${t(p) ?? ""}px;`,
      ),
        I(
          Z,
          ((n = r.item.profissional) == null ? void 0 : n.nome) ??
            "Profissional",
        ),
        dt(
          h,
          1,
          `inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${N[r.item.status] ?? ""}`,
        ),
        I(st, A[r.item.status]),
        I(Y, `${t(X) ?? ""} – ${t(D) ?? ""}`));
    }),
    at("click", w, function (...n) {
      var i;
      (i = r.onclick) == null || i.apply(this, n);
    }),
    f(G, w),
    ht());
}
_t(["click"]);
var ae = b(
    '<span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm"> </span>',
  ),
  re = b('<span class="text-sm font-bold text-slate-700"> </span>'),
  se = b(
    '<div class="sticky top-0 z-10 bg-white border-b border-slate-100 text-center py-2.5 px-1"><p> </p> <div class="flex items-center justify-center mt-1"><!></div></div>',
  ),
  oe = b(
    '<div class="absolute left-0 right-0 z-20 pointer-events-none"><div class="relative flex items-center"><div class="absolute -left-[5px] w-[10px] h-[10px] rounded-full bg-red-500 shadow-sm"></div> <div class="w-full h-[2px] bg-red-500/80"></div></div></div>',
  ),
  ne = b('<div style="height: 120px;"><!> <!></div>'),
  ie = b(
    '<div class="relative border-r border-slate-100 pr-3 text-right" style="height: 120px;"><span class="absolute top-1 right-3 text-[11px] font-medium text-slate-400 tabular-nums"> </span></div> <!>',
    1,
  ),
  le = b(
    '<div class="flex flex-col h-full"><div class="flex items-center justify-between px-1 mb-4"><button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" aria-label="Semana anterior"><!></button> <h3 class="text-lg font-bold text-slate-800"> </h3> <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" aria-label="Próxima semana"><!></button></div> <div class="flex-1 overflow-auto"><div class="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] min-w-[720px]"><div class="sticky top-0 z-10 bg-white border-b border-slate-100"></div> <!> <!></div></div></div>',
  );
function de(G, r) {
  bt(r, !0);
  function S(d) {
    const o = d.getFullYear(),
      l = String(d.getMonth() + 1).padStart(2, "0"),
      x = String(d.getDate()).padStart(2, "0");
    return `${o}-${l}-${x}`;
  }
  const A = 7,
    X = Array.from({ length: 19 - A }, (d, o) => A + o);
  let D = B(xt(new Date())),
    p;
  (Ft(() => {
    p = setInterval(() => {
      u(D, new Date(), !0);
    }, 6e4);
  }),
    Bt(() => {
      clearInterval(p);
    }));
  function w(d) {
    const o = new Date(d),
      l = o.getDay(),
      x = l === 0 ? -6 : 1 - l;
    return (o.setDate(o.getDate() + x), o.setHours(0, 0, 0, 0), o);
  }
  let T = y(() => w(r.currentDate)),
    j = y(() =>
      Array.from({ length: 7 }, (d, o) => {
        const l = new Date(t(T));
        return (l.setDate(l.getDate() + o), l);
      }),
    ),
    U = y(() => {
      const d = new Map();
      for (const o of t(j)) {
        const l = S(o);
        d.set(l, []);
      }
      for (const o of r.items) {
        const l = S(new Date(o.dataHoraInicio));
        d.has(l) && d.get(l).push(o);
      }
      return d;
    });
  function Z(d) {
    const o = new Date(r.currentDate);
    (o.setDate(o.getDate() + d * 7), r.onNavigate(o));
  }
  function F(d) {
    const o = new Date();
    return d.toISOString().slice(0, 10) === o.toISOString().slice(0, 10);
  }
  const g = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }),
    h = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" });
  function st(d) {
    const l = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(d);
    return l.charAt(0).toUpperCase() + l.slice(1);
  }
  function _(d, o) {
    const l = S(d);
    return (t(U).get(l) ?? []).filter(
      ($) => new Date($.dataHoraInicio).getHours() === o,
    );
  }
  function P(d) {
    const o = t(D).getHours(),
      l = t(D).getMinutes();
    return o !== d ? null : (l / 60) * 100;
  }
  var E = le(),
    Y = a(E),
    L = a(Y),
    ot = a(L);
  (Vt(ot, { class: "h-5 w-5" }), e(L));
  var n = m(L, 2),
    i = a(n, !0);
  e(n);
  var c = m(n, 2),
    Q = a(c);
  (zt(Q, { class: "h-5 w-5" }), e(c), e(Y));
  var nt = m(Y, 2),
    W = a(nt),
    k = m(a(W), 2);
  mt(
    k,
    17,
    () => t(j),
    ft,
    (d, o) => {
      var l = se(),
        x = a(l),
        $ = a(x, !0);
      e(x);
      var M = m(x, 2),
        V = a(M);
      {
        var C = (z) => {
            var q = ae(),
              vt = a(q, !0);
            (e(q), H((ut) => I(vt, ut), [() => h.format(t(o))]), f(z, q));
          },
          J = y(() => F(t(o))),
          tt = (z) => {
            var q = re(),
              vt = a(q, !0);
            (e(q), H((ut) => I(vt, ut), [() => h.format(t(o))]), f(z, q));
          };
        rt(V, (z) => {
          t(J) ? z(C) : z(tt, -1);
        });
      }
      (e(M),
        e(l),
        H(
          (z, q) => {
            (dt(
              x,
              1,
              `text-[10px] uppercase tracking-wider font-semibold
							${z ?? ""}`,
            ),
              I($, q));
          },
          [
            () => (F(t(o)) ? "text-blue-600 font-bold" : "text-slate-400"),
            () => g.format(t(o)),
          ],
        ),
        f(d, l));
    },
  );
  var it = m(k, 2);
  (mt(
    it,
    17,
    () => X,
    ft,
    (d, o) => {
      var l = ie(),
        x = pt(l),
        $ = a(x),
        M = a($);
      (e($), e(x));
      var V = m(x, 2);
      (mt(
        V,
        17,
        () => t(j),
        ft,
        (C, J) => {
          var tt = ne(),
            z = a(tt);
          {
            var q = (K) => {
                const lt = y(() => P(t(o)));
                var wt = Dt(),
                  yt = pt(wt);
                {
                  var s = (v) => {
                    var O = oe();
                    (H(() => Et(O, `top: ${t(lt) ?? ""}%;`)), f(v, O));
                  };
                  rt(yt, (v) => {
                    t(lt) !== null && v(s);
                  });
                }
                f(K, wt);
              },
              vt = y(() => F(t(J)));
            rt(z, (K) => {
              t(vt) && K(q);
            });
          }
          var ut = m(z, 2);
          (mt(
            ut,
            17,
            () => _(t(J), t(o)),
            ft,
            (K, lt) => {
              ee(K, {
                get item() {
                  return t(lt);
                },
                onclick: () => r.onItemClick(t(lt)),
              });
            },
          ),
            e(tt),
            H(
              (K) =>
                dt(
                  tt,
                  1,
                  `relative border-b border-r border-slate-100 p-1 flex flex-col gap-1 transition-colors duration-150 cursor-pointer
							${K ?? ""}
							hover:bg-blue-50/50 hover:z-10`,
                ),
              [() => (F(t(J)) ? "bg-blue-50/30" : "")],
            ),
            at("click", tt, (K) => {
              var lt;
              (K.target === K.currentTarget ||
                K.target.classList.contains("absolute")) &&
                ((lt = r.onSlotClick) == null || lt.call(r, t(J), t(o)));
            }),
            f(C, tt));
        },
      ),
        H((C) => I(M, `${C ?? ""}:00`), [() => String(t(o)).padStart(2, "0")]),
        f(d, l));
    },
  ),
    e(W),
    e(nt),
    e(E),
    H((d) => I(i, d), [() => st(r.currentDate)]),
    at("click", L, () => Z(-1)),
    at("click", c, () => Z(1)),
    f(G, E),
    ht());
}
_t(["click"]);
var ce = b(
    '<div class="text-center text-[10px] uppercase tracking-wider font-semibold text-slate-400 py-1"> </div>',
  ),
  ve = b(
    '<div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5"><span class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-100 px-1 text-[9px] font-bold text-blue-700"> </span></div>',
  ),
  ue = b('<button type="button"><span> </span> <!></button>'),
  me = b('<div class="h-16"></div>'),
  fe = b(
    '<div class="flex flex-col"><div class="flex items-center justify-between mb-4"><button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" aria-label="Mês anterior"><!></button> <h3 class="text-lg font-bold text-slate-800"> </h3> <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" aria-label="Próximo mês"><!></button></div> <div class="grid grid-cols-7 gap-px mb-1"></div> <div class="grid grid-cols-7 gap-px"></div></div>',
  );
function ge(G, r) {
  bt(r, !0);
  function S(n) {
    const i = n.getFullYear(),
      c = String(n.getMonth() + 1).padStart(2, "0"),
      Q = String(n.getDate()).padStart(2, "0");
    return `${i}-${c}-${Q}`;
  }
  let A = y(() => r.currentDate.getFullYear()),
    N = y(() => r.currentDate.getMonth()),
    X = y(() => new Date(t(A), t(N), 1)),
    D = y(() => new Date(t(A), t(N) + 1, 0)),
    p = y(() => () => {
      const n = [];
      let i = t(X).getDay();
      i = i === 0 ? 6 : i - 1;
      for (let c = 0; c < i; c++) n.push(null);
      for (let c = 1; c <= t(D).getDate(); c++) n.push(new Date(t(A), t(N), c));
      for (; n.length % 7 !== 0; ) n.push(null);
      return n;
    }),
    w = y(() => {
      const n = new Map();
      for (const i of r.items) {
        const c = S(new Date(i.dataHoraInicio));
        n.set(c, (n.get(c) ?? 0) + 1);
      }
      return n;
    });
  function T(n) {
    const i = new Date(r.currentDate);
    (i.setMonth(i.getMonth() + n), r.onNavigate(i));
  }
  function j(n) {
    const i = new Date();
    return n.toISOString().slice(0, 10) === i.toISOString().slice(0, 10);
  }
  function U(n) {
    const c = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(n);
    return c.charAt(0).toUpperCase() + c.slice(1);
  }
  const Z = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var F = fe(),
    g = a(F),
    h = a(g),
    st = a(h);
  (Vt(st, { class: "h-5 w-5" }), e(h));
  var _ = m(h, 2),
    P = a(_, !0);
  e(_);
  var E = m(_, 2),
    Y = a(E);
  (zt(Y, { class: "h-5 w-5" }), e(E), e(g));
  var L = m(g, 2);
  (mt(
    L,
    21,
    () => Z,
    ft,
    (n, i) => {
      var c = ce(),
        Q = a(c, !0);
      (e(c), H(() => I(Q, t(i))), f(n, c));
    },
  ),
    e(L));
  var ot = m(L, 2);
  (mt(
    ot,
    21,
    () => t(p)(),
    ft,
    (n, i) => {
      var c = Dt(),
        Q = pt(c);
      {
        var nt = (k) => {
            const it = y(() => S(t(i))),
              d = y(() => t(w).get(t(it)) ?? 0);
            var o = ue(),
              l = a(o),
              x = a(l, !0);
            e(l);
            var $ = m(l, 2);
            {
              var M = (V) => {
                var C = ve(),
                  J = a(C),
                  tt = a(J, !0);
                (e(J), e(C), H(() => I(tt, t(d))), f(V, C));
              };
              rt($, (V) => {
                t(d) > 0 && V(M);
              });
            }
            (e(o),
              H(
                (V, C, J) => {
                  (dt(
                    o,
                    1,
                    `relative h-16 rounded-lg text-center p-1 transition-all duration-150 cursor-pointer
						${V ?? ""}`,
                  ),
                    dt(l, 1, `text-xs font-semibold ${C ?? ""}`),
                    I(x, J));
                },
                [
                  () =>
                    j(t(i))
                      ? "bg-blue-50 border-2 border-blue-300"
                      : "bg-white border border-slate-100 hover:bg-slate-50 hover:border-slate-200",
                  () => (j(t(i)) ? "text-blue-700" : "text-slate-700"),
                  () => t(i).getDate(),
                ],
              ),
              at("click", o, () => r.onDayClick(t(i))),
              f(k, o));
          },
          W = (k) => {
            var it = me();
            f(k, it);
          };
        rt(Q, (k) => {
          t(i) ? k(nt) : k(W, -1);
        });
      }
      f(n, c);
    },
  ),
    e(ot),
    e(F),
    H((n) => I(P, n), [() => U(r.currentDate)]),
    at("click", h, () => T(-1)),
    at("click", E, () => T(1)),
    f(G, F),
    ht());
}
_t(["click"]);
var pe = b(
    '<div class="flex justify-center py-8"><div class="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div></div>',
  ),
  xe = b(
    '<div class="text-center py-8"><p class="text-sm text-slate-400">Nenhuma sugestão disponível</p></div>',
  ),
  be = b('<p class="text-[10px] text-slate-400 mt-0.5 truncate"> </p>'),
  he =
    b(`<div class="group bg-white border border-slate-200 shadow-sm rounded-xl p-4 
						transition-all duration-200 ease-out 
						hover:-translate-y-[2px] hover:shadow-md hover:border-slate-300"><div class="flex items-start justify-between gap-2"><div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors"> </p> <!></div> <div class="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-600" title="Pontuação de prioridade"><!> </div></div> <div class="mt-2 flex items-center gap-3"><span> </span> <span class="flex items-center gap-1 text-[10px] text-slate-400"><!> </span></div> <button type="button" class="flex w-full items-center justify-center gap-1.5 
							text-blue-600 bg-blue-50 hover:bg-blue-100 
							mt-3 py-2 rounded-lg font-medium text-[12px]
							transition-colors duration-200 ease-out 
							active:scale-[0.98] cursor-pointer"><!> Agendar Visita</button></div>`),
  _e = b('<div class="space-y-3 flex-1 overflow-y-auto"></div>'),
  we = b(
    '<div class="flex flex-col h-full"><div class="flex items-center gap-2 mb-4"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50"><!></div> <div><h3 class="text-sm font-semibold text-slate-800">Sugestões</h3> <p class="text-[10px] text-slate-400">Quem você deve visitar</p></div></div> <!></div>',
  );
function De(G, r) {
  bt(r, !0);
  let S = Xt(r, "loading", 3, !1);
  const A = {
      ESTRATEGICO: "Estratégico",
      ALTO: "Alto",
      MEDIO: "Médio",
      BAIXO: "Baixo",
    },
    N = {
      ESTRATEGICO: "bg-violet-50 text-violet-700 ring-1 ring-violet-300",
      ALTO: "bg-amber-50 text-amber-700 ring-1 ring-amber-300",
      MEDIO: "bg-blue-50 text-blue-700 ring-1 ring-blue-300",
      BAIXO: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
    };
  function X(g) {
    return g === null
      ? "Nunca visitado"
      : g === 0
        ? "Hoje"
        : g === 1
          ? "1 dia"
          : `${g} dias`;
  }
  var D = we(),
    p = a(D),
    w = a(p),
    T = a(w);
  (Tt(T, { class: "h-4 w-4 text-blue-600" }), e(w), gt(2), e(p));
  var j = m(p, 2);
  {
    var U = (g) => {
        var h = pe();
        f(g, h);
      },
      Z = (g) => {
        var h = xe();
        f(g, h);
      },
      F = (g) => {
        var h = _e();
        (mt(
          h,
          21,
          () => r.sugestoes.slice(0, 10),
          ft,
          (st, _) => {
            var P = he(),
              E = a(P),
              Y = a(E),
              L = a(Y),
              ot = a(L, !0);
            e(L);
            var n = m(L, 2);
            {
              var i = (M) => {
                var V = be(),
                  C = a(V, !0);
                (e(V),
                  H(() => I(C, t(_).profissional.especialidade.nome)),
                  f(M, V));
              };
              rt(n, (M) => {
                t(_).profissional.especialidade && M(i);
              });
            }
            e(Y);
            var c = m(Y, 2),
              Q = a(c);
            Tt(Q, { class: "h-2.5 w-2.5" });
            var nt = m(Q);
            (e(c), e(E));
            var W = m(E, 2),
              k = a(W),
              it = a(k, !0);
            e(k);
            var d = m(k, 2),
              o = a(d);
            Pt(o, { class: "h-2.5 w-2.5" });
            var l = m(o);
            (e(d), e(W));
            var x = m(W, 2),
              $ = a(x);
            (Qt($, { class: "h-3.5 w-3.5" }),
              gt(),
              e(x),
              e(P),
              H(
                (M) => {
                  (I(ot, t(_).profissional.nome),
                    I(nt, ` ${t(_).pontuacao ?? ""}`),
                    dt(
                      k,
                      1,
                      `inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${N[t(_).profissional.potencial] ?? ""}`,
                    ),
                    I(it, A[t(_).profissional.potencial]),
                    I(l, ` ${M ?? ""}`));
                },
                [() => X(t(_).diasSemVisita)],
              ),
              at("click", x, () => r.onAgendar(t(_).profissional.id)),
              f(st, P));
          },
        ),
          e(h),
          f(g, h));
      };
    rt(j, (g) => {
      S() ? g(U) : r.sugestoes.length === 0 ? g(Z, 1) : g(F, -1);
    });
  }
  (e(D), f(G, D), ht());
}
_t(["click"]);
var ye = b(
    '<meta name="description" content="Agenda inteligente de visitas médicas"/>',
  ),
  Ie = b(
    '<div class="flex items-center justify-center h-64"><div class="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div></div>',
  ),
  Se = b(
    '<div class="w-[300px] border-l border-slate-100 bg-slate-50/50 p-4 overflow-y-auto"><!></div>',
  ),
  Ae = b(
    '<div class="flex flex-col h-full overflow-hidden"><div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"><!></div> <div><h1 class="text-lg font-bold text-slate-800">Agenda</h1> <p class="text-[11px] text-slate-400">Planeje visitas e acompanhe compromissos</p></div></div> <div class="flex items-center gap-2"><div class="flex rounded-lg bg-slate-100 p-0.5"><button type="button"><!> Semana</button> <button type="button"><!> Mês</button></div> <button type="button"><!> Sugestões</button></div></div> <div class="flex flex-1 overflow-hidden"><div class="flex-1 overflow-auto p-4"><!></div> <!></div></div> <!>',
    1,
  );
function Xe(G, r) {
  bt(r, !0);
  let S = B(xt([])),
    A = B(xt([])),
    N = B(!0),
    X = B(!1),
    D = B(xt([])),
    p = B(xt(new Date())),
    w = B("semanal"),
    T = B(!1),
    j = B(null),
    U = B(""),
    Z = B(""),
    F = B(""),
    g = B(""),
    h = B(!0),
    st = y(() => () => {
      if (t(w) === "semanal") {
        const s = new Date(t(p)),
          v = s.getDay(),
          O = v === 0 ? -6 : 1 - v,
          et = new Date(s);
        (et.setDate(s.getDate() + O), et.setHours(0, 0, 0, 0));
        const ct = new Date(et);
        return (
          ct.setDate(et.getDate() + 6),
          ct.setHours(23, 59, 59, 999),
          { start: et, end: ct }
        );
      } else {
        const s = new Date(t(p).getFullYear(), t(p).getMonth(), 1),
          v = new Date(
            t(p).getFullYear(),
            t(p).getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );
        return { start: s, end: v };
      }
    });
  async function _() {
    var s, v;
    u(N, !0);
    try {
      const O = t(st)(),
        et = new URLSearchParams({
          dataInicio: O.start.toISOString(),
          dataFim: O.end.toISOString(),
          pageSize: "100",
        }),
        ct = await Mt(`/visitas?${et}`, r.data.sessionToken);
      let It = [];
      if (ct.ok) {
        const St = (await ct.json()).data || [];
        for (const R of St) {
          const At = new Date(R.dataVisita),
            Ot = new Date(At);
          Ot.setMinutes(At.getMinutes() + (R.duracaoMinutos || 30));
          let kt = "REALIZADO";
          (R.status === "AGENDADA"
            ? (kt = "CONFIRMADO")
            : (R.status === "CANCELADA" || R.status === "NAO_REALIZADA") &&
              (kt = "CANCELADO"),
            It.push({
              id: `v-${R.id}`,
              profissionalId: R.profissionalId,
              visitaId: R.id,
              dataHoraInicio: At.toISOString(),
              dataHoraFim: Ot.toISOString(),
              status: kt,
              prioridade: "MEDIA",
              observacoes: R.resumo || R.objetivoVisita || null,
              profissional: {
                id: R.profissionalId,
                nome:
                  ((s = R.profissional) == null ? void 0 : s.nome) ||
                  "Profissional",
                especialidade:
                  ((v = R.profissional) == null ? void 0 : v.especialidade) ||
                  null,
              },
              createdAt: R.createdAt,
              updatedAt: R.updatedAt,
              rawVisita: R,
            }));
        }
      }
      (It.sort(
        (Ct, St) =>
          new Date(Ct.dataHoraInicio).getTime() -
          new Date(St.dataHoraInicio).getTime(),
      ),
        u(S, It, !0));
    } catch (O) {
      console.error("Erro ao carregar agenda:", O);
    } finally {
      u(N, !1);
    }
  }
  async function P() {
    u(X, !0);
    try {
      const s = t(st)(),
        v = new URLSearchParams({
          dataInicio: s.start.toISOString(),
          dataFim: s.end.toISOString(),
        }),
        O = await Mt(`/agenda/sugestoes?${v}`, r.data.sessionToken);
      if (O.ok) {
        const et = await O.json();
        u(A, et.data || [], !0);
      }
    } catch (s) {
      console.error("Erro ao carregar sugestões:", s);
    } finally {
      u(X, !1);
    }
  }
  async function E() {
    try {
      const s = await Mt("/materiais?pageSize=100", r.data.sessionToken);
      if (s.ok) {
        const v = await s.json();
        u(D, v.data || v, !0);
      }
    } catch (s) {
      console.error(s);
    }
  }
  (Ft(() => {
    (_(), P(), E());
  }),
    Ut(() => {
      (t(p).getTime() + (t(w) === "semanal" ? 0 : 1), _(), P());
    }));
  function Y(s) {
    u(p, s, !0);
  }
  function L(s) {
    (u(j, s.rawVisita || null, !0), u(U, ""), u(Z, ""), u(T, !0));
  }
  function ot(s) {
    (u(w, "semanal"), u(p, s, !0));
  }
  function n(s) {
    const v = t(A).find((O) => O.profissional.id === s);
    (u(j, null),
      u(U, s, !0),
      u(Z, (v == null ? void 0 : v.profissional.nome) ?? "", !0),
      u(F, ""),
      u(g, ""),
      u(T, !0));
  }
  function i(s, v) {
    const O = s.getFullYear(),
      et = String(s.getMonth() + 1).padStart(2, "0"),
      ct = String(s.getDate()).padStart(2, "0");
    (u(F, `${O}-${et}-${ct}`),
      u(g, `${String(v).padStart(2, "0")}:00`),
      u(j, null),
      u(U, ""),
      u(Z, ""),
      u(T, !0));
  }
  function c(s) {
    (_(), P());
  }
  var Q = Ae();
  Zt("1vajkwu", (s) => {
    var v = ye();
    (Yt(() => {
      Gt.title = "Agenda | MediVisitas";
    }),
      f(s, v));
  });
  var nt = pt(Q),
    W = a(nt),
    k = a(W),
    it = a(k),
    d = a(it);
  (jt(d, { class: "h-4.5 w-4.5 text-white" }), e(it), gt(2), e(k));
  var o = m(k, 2),
    l = a(o),
    x = a(l),
    $ = a(x);
  (qt($, { class: "h-3.5 w-3.5" }), gt(), e(x));
  var M = m(x, 2),
    V = a(M);
  (jt(V, { class: "h-3.5 w-3.5" }), gt(), e(M), e(l));
  var C = m(l, 2),
    J = a(C);
  (Kt(J, { class: "h-3.5 w-3.5" }), gt(), e(C), e(o), e(W));
  var tt = m(W, 2),
    z = a(tt),
    q = a(z);
  {
    var vt = (s) => {
        var v = Ie();
        f(s, v);
      },
      ut = (s) => {
        de(s, {
          get items() {
            return t(S);
          },
          get currentDate() {
            return t(p);
          },
          onNavigate: Y,
          onItemClick: L,
          onSlotClick: i,
        });
      },
      K = (s) => {
        ge(s, {
          get items() {
            return t(S);
          },
          get currentDate() {
            return t(p);
          },
          onNavigate: Y,
          onDayClick: ot,
        });
      };
    rt(q, (s) => {
      t(N) ? s(vt) : t(w) === "semanal" ? s(ut, 1) : s(K, -1);
    });
  }
  e(z);
  var lt = m(z, 2);
  {
    var wt = (s) => {
      var v = Se(),
        O = a(v);
      (De(O, {
        get sugestoes() {
          return t(A);
        },
        get loading() {
          return t(X);
        },
        onAgendar: n,
      }),
        e(v),
        f(s, v));
    };
    rt(lt, (s) => {
      t(h) && s(wt);
    });
  }
  (e(tt), e(nt));
  var yt = m(nt, 2);
  {
    let s = y(() => (t(F) && t(g) ? `${t(F)}T${t(g)}` : void 0));
    Jt(yt, {
      get visita() {
        return t(j);
      },
      get profissionalId() {
        return t(U);
      },
      get profissionalNome() {
        return t(Z);
      },
      get defaultDateTime() {
        return t(s);
      },
      get sessionToken() {
        return r.data.sessionToken;
      },
      get materiaisOptions() {
        return t(D);
      },
      onclose: () => u(T, !1),
      onsave: () => {
        (_(), P());
      },
      ondelete: c,
      get open() {
        return t(T);
      },
      set open(v) {
        u(T, v, !0);
      },
    });
  }
  (H(() => {
    (dt(
      x,
      1,
      `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer
						${t(w) === "semanal" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
    ),
      dt(
        M,
        1,
        `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer
						${t(w) === "mensal" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
      ),
      dt(
        C,
        1,
        `flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer
					${t(h) ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:text-slate-700"}`,
      ));
  }),
    at("click", x, () => u(w, "semanal")),
    at("click", M, () => u(w, "mensal")),
    at("click", C, () => u(h, !t(h))),
    f(G, Q),
    ht());
}
_t(["click"]);
export { Xe as component };
