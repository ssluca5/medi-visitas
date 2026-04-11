import "../chunks/Bzak7iHL.js";
import {
  t as F,
  a as i,
  c as p,
  d as a,
  r as t,
  s as r,
  p as gt,
  b as _t,
  z as e,
  F as P,
  U as ht,
  V as Mt,
  I as Wt,
  B as w,
  f as jt,
  h as Jt,
  $ as Kt,
  X as lt,
  W as bt,
} from "../chunks/CZsNqhY1.js";
import { s as d } from "../chunks/D4SvF6kG.js";
import { i as D } from "../chunks/CsBhEEN0.js";
import { e as nt, i as vt, X as Ot } from "../chunks/D_ntMQAe.js";
import { h as Qt } from "../chunks/C57bVzq3.js";
import { s as wt, b as St, r as Yt } from "../chunks/DDioZlon.js";
import { d as Zt, e as Tt, a as At } from "../chunks/BLFvJadL.js";
import { a as te, b as ee } from "../chunks/DFOm60R7.js";
import { g as ae } from "../chunks/BGWMiPqM.js";
import { c as Pt } from "../chunks/Bj1gaHN5.js";
import { C as re, I as se } from "../chunks/CkHy_-7l.js";
import { T as oe } from "../chunks/DYTuZaAl.js";
import { C as ie } from "../chunks/CjOXa5Yh.js";
import { S as le } from "../chunks/eFcn31mN.js";
import { T as Dt } from "../chunks/CqukC_q6.js";
import { S as de } from "../chunks/EGrcUm4A.js";
import { U as Ft } from "../chunks/DoHM5GQu.js";
import { S as Bt } from "../chunks/0So1ctTy.js";
import { C as ne } from "../chunks/DROL47i9.js";
import { C as ve } from "../chunks/D9kr8FOy.js";
var ce = p(
  '<div class="card-surface flex flex-col items-center justify-center text-center p-6 h-full min-h-[120px] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"><div class="flex items-center gap-2"><div><!></div> <p class="text-sm font-bold text-slate-500 uppercase tracking-wider"> </p></div> <p class="text-3xl font-bold text-slate-800 mt-2"> </p></div>',
);
function dt(E, l) {
  var n = ce(),
    y = a(n),
    v = a(y),
    u = a(v);
  (Pt(
    u,
    () => l.icone,
    (m, k) => {
      k(m, {
        get class() {
          return `h-4 w-4 ${l.corIcone ?? ""}`;
        },
      });
    },
  ),
    t(v));
  var x = r(v, 2),
    h = a(x, !0);
  (t(x), t(y));
  var g = r(y, 2),
    c = a(g, !0);
  (t(g),
    t(n),
    F(() => {
      (wt(
        v,
        1,
        `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${l.corFundo ?? ""}`,
      ),
        d(h, l.titulo),
        d(c, l.valor));
    }),
    i(E, n));
}
var pe = p(
    '<div class="text-center py-8"><p class="text-sm text-slate-400">Nenhum alerta no momento</p></div>',
  ),
  me = p(
    '<a><!> <div class="min-w-0 flex-1"><p class="text-[13px] font-medium text-slate-700 leading-snug"> </p> <p class="text-[11px] text-slate-400 mt-0.5"> </p></div></a>',
  ),
  ue = p('<div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-2"></div>'),
  xe = p(
    '<div class="card-surface p-5 h-full"><h3 class="text-sm font-semibold text-slate-700 mb-4">Alertas</h3> <!></div>',
  );
function fe(E, l) {
  gt(l, !0);
  const n = {
    info: {
      icon: se,
      borderClass: "border-l-blue-400",
      iconClass: "text-blue-500",
    },
    warning: {
      icon: oe,
      borderClass: "border-l-amber-400",
      iconClass: "text-amber-500",
    },
    danger: {
      icon: re,
      borderClass: "border-l-red-400",
      iconClass: "text-red-500",
    },
  };
  var y = xe(),
    v = r(a(y), 2);
  {
    var u = (h) => {
        var g = pe();
        i(h, g);
      },
      x = (h) => {
        var g = ue();
        (nt(
          g,
          21,
          () => l.alertas,
          vt,
          (c, m) => {
            const k = P(() => n[e(m).severidade] ?? n.info),
              _ = P(() => e(k).icon);
            var C = me(),
              V = a(C);
            Pt(
              V,
              () => e(_),
              ($, L) => {
                L($, {
                  get class() {
                    return `h-4 w-4 ${e(k).iconClass ?? ""} mt-0.5 shrink-0`;
                  },
                });
              },
            );
            var B = r(V, 2),
              S = a(B),
              H = a(S, !0);
            t(S);
            var j = r(S, 2),
              U = a(j, !0);
            (t(j),
              t(B),
              t(C),
              F(() => {
                (St(
                  C,
                  "href",
                  `/dashboard/profissionais/${e(m).profissionalId ?? ""}`,
                ),
                  wt(
                    C,
                    1,
                    `flex items-start gap-3 p-3 rounded-lg border-l-3 ${e(k).borderClass ?? ""} bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm`,
                  ),
                  d(H, e(m).mensagem),
                  d(U, e(m).profissionalNome));
              }),
              i(c, C));
          },
        ),
          t(g),
          i(h, g));
      };
    D(v, (h) => {
      l.alertas.length === 0 ? h(u) : h(x, -1);
    });
  }
  (t(y), i(E, y), _t());
}
var he = p(
    '<div class="text-center py-8"><p class="text-sm text-slate-400">Nenhum agendamento futuro</p></div>',
  ),
  be = p("<span> </span>"),
  ge = p(
    '<div class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"><div class="flex-shrink-0 w-12 text-center"><span class="text-[13px] font-bold text-violet-600"> </span> <span class="block text-[10px] text-slate-400 mt-0.5"> </span></div> <div class="min-w-0 border-l border-slate-100 pl-3 flex-1"><p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors"> </p> <p class="text-[11px] text-slate-400 truncate"> <!></p></div> <!></div>',
  ),
  _e = p('<div class="space-y-2.5"></div>'),
  we = p(
    '<div class="card-surface p-5 h-full"><h3 class="text-sm font-semibold text-slate-700 mb-4">Próximos Agendamentos</h3> <!></div>',
  );
function ye(E, l) {
  gt(l, !0);
  function n(c) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(c));
  }
  function y(c) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(new Date(c));
  }
  const v = {
    URGENTE:
      "bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
    ALTA: "bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
    MEDIA:
      "bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
    BAIXA:
      "bg-slate-50 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold ml-2",
  };
  var u = we(),
    x = r(a(u), 2);
  {
    var h = (c) => {
        var m = he();
        i(c, m);
      },
      g = (c) => {
        var m = _e();
        (nt(
          m,
          21,
          () => l.agendamentos,
          vt,
          (k, _) => {
            var C = ge(),
              V = a(C),
              B = a(V),
              S = a(B, !0);
            t(B);
            var H = r(B, 2),
              j = a(H, !0);
            (t(H), t(V));
            var U = r(V, 2),
              $ = a(U),
              L = a($, !0);
            t($);
            var Y = r($, 2),
              q = a(Y),
              Z = r(q);
            {
              var M = (N) => {
                var T = be(),
                  X = a(T, !0);
                (t(T),
                  F(() => {
                    (wt(T, 1, v[e(_).prioridade] ?? v.BAIXA),
                      d(X, e(_).prioridade));
                  }),
                  i(N, T));
              };
              D(Z, (N) => {
                e(_).prioridade && N(M);
              });
            }
            (t(Y), t(U));
            var tt = r(U, 2);
            (ie(tt, { class: "h-3.5 w-3.5 text-slate-300 shrink-0" }),
              t(C),
              F(
                (N, T) => {
                  var X, et, W;
                  (d(S, N),
                    d(j, T),
                    d(
                      L,
                      ((X = e(_).profissional) == null ? void 0 : X.nome) ??
                        "Sem profissional",
                    ),
                    d(
                      q,
                      `${((W = (et = e(_).profissional) == null ? void 0 : et.especialidade) == null ? void 0 : W.nome) ?? "" ?? ""} `,
                    ));
                },
                [() => n(e(_).dataHoraInicio), () => y(e(_).dataHoraInicio)],
              ),
              i(k, C));
          },
        ),
          t(m),
          i(c, m));
      };
    D(x, (c) => {
      l.agendamentos.length === 0 ? c(h) : c(g, -1);
    });
  }
  (t(u), i(E, u), _t());
}
var Ce = p(
    '<button class="text-slate-400 hover:text-slate-600 cursor-pointer"><!></button>',
  ),
  Ie = p(
    '<button type="button" class="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"><p class="text-sm font-medium text-slate-800"> </p> <p class="text-xs text-slate-400 mt-0.5"><!> <!> <!></p></button>',
  ),
  ke = p(
    '<div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg z-50 max-h-80 overflow-y-auto"></div>',
  ),
  Ve = p('<span class="text-slate-300">·</span> ', 1),
  je = p(
    '<a class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"><div class="flex-shrink-0 w-16 text-center"><span class="text-[13px] font-bold text-slate-700"> </span> <span class="block text-[10px] text-slate-400 mt-0.5"> </span></div> <div class="min-w-0 border-l border-slate-100 pl-3 flex-1"><p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors"> </p> <p class="text-[11px] text-slate-400 truncate"> <!></p></div> <!></a>',
  ),
  Te = p(
    '<div class="card-surface p-5 mb-6"><h3 class="text-sm font-semibold text-slate-700 mb-4">Últimas Visitas</h3> <div class="space-y-2.5"></div></div>',
  ),
  Ae = p(
    '<div class="mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"><!></div> <div><h1 class="text-lg font-bold text-slate-800">Dashboard</h1> <p class="text-[11px] text-slate-400">Visão geral do seu dia</p></div></div></div> <div class="flex justify-between items-center mb-6"><div class="relative w-96"><div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-blue-300 focus-within:shadow-md"><!> <input type="text" placeholder="Buscar profissionais..." class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"/> <!></div> <!></div></div> <div class="card-surface p-5 mb-6 transition-all duration-200 hover:shadow-sm"><h3 class="text-sm font-semibold text-slate-700 mb-4">Acesso Rápido</h3> <div class="grid grid-cols-1 gap-4 sm:grid-cols-3"><a href="/dashboard/profissionais" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors"><!></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Profissionais</p> <p class="text-[11px] text-slate-400 font-medium">Gerenciar cadastros</p></div></a> <a href="/dashboard/especialidades" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors"><!></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Especialidades</p> <p class="text-[11px] text-slate-400 font-medium">Categorias e subs</p></div></a> <a href="/dashboard/pipeline" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-violet-200 hover:bg-violet-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors"><!></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Pipeline</p> <p class="text-[11px] text-slate-400 font-medium">Funil de conversão</p></div></a></div></div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 items-stretch"><div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl"><!></div> <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl"><!></div> <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl"><!></div> <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl"><!></div></div> <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6"><!> <!></div> <!>',
    1,
  );
function Qe(E, l) {
  gt(l, !0);
  const n = P(() => l.data.resumo),
    y = P(() => l.data.alertas);
  let v = ht(""),
    u = ht(Mt([])),
    x = ht(!1),
    h;
  Wt(() => {
    if (e(v).length < 2) {
      (w(u, [], !0), w(x, !1));
      return;
    }
    (clearTimeout(h),
      (h = setTimeout(async () => {
        try {
          const o = await te(
            `/busca?q=${encodeURIComponent(e(v))}`,
            l.data.sessionToken,
          );
          if (o.ok) {
            const s = await o.json();
            (w(u, s.resultados, !0), w(x, e(u).length > 0));
          }
        } catch {}
      }, 300)));
  });
  function g(o) {
    (w(x, !1), w(v, ""), ae(`/dashboard/profissionais/${o.id}`));
  }
  var c = Ae();
  Qt("x1i5gj", (o) => {
    Jt(() => {
      Kt.title = "Dashboard — MediVisitas";
    });
  });
  var m = jt(c),
    k = a(m),
    _ = a(k),
    C = a(_);
  (Dt(C, { class: "h-[18px] w-[18px] text-white" }), t(_), lt(2), t(k), t(m));
  var V = r(m, 2),
    B = a(V),
    S = a(B),
    H = a(S);
  de(H, { class: "h-4 w-4 text-slate-400 shrink-0" });
  var j = r(H, 2);
  Yt(j);
  var U = r(j, 2);
  {
    var $ = (o) => {
      var s = Ce(),
        z = a(s);
      (Ot(z, { class: "h-4 w-4" }),
        t(s),
        At("click", s, () => {
          (w(v, ""), w(u, [], !0), w(x, !1));
        }),
        i(o, s));
    };
    D(U, (o) => {
      e(v) && o($);
    });
  }
  t(S);
  var L = r(S, 2);
  {
    var Y = (o) => {
      var s = ke();
      (nt(
        s,
        21,
        () => e(u),
        vt,
        (z, A) => {
          var b = Ie(),
            R = a(b),
            J = a(R, !0);
          t(R);
          var G = r(R, 2),
            at = a(G);
          {
            var rt = (f) => {
              var I = bt();
              (F(() => d(I, e(A).crm)), i(f, I));
            };
            D(at, (f) => {
              e(A).crm && f(rt);
            });
          }
          var st = r(at, 2);
          {
            var K = (f) => {
              var I = bt();
              (F(() => d(I, `· ${e(A).especialidade ?? ""}`)), i(f, I));
            };
            D(st, (f) => {
              e(A).especialidade && f(K);
            });
          }
          var O = r(st, 2);
          {
            var ft = (f) => {
              var I = bt();
              (F(() => d(I, `· ${e(A).cidade ?? ""}`)), i(f, I));
            };
            D(O, (f) => {
              e(A).cidade && f(ft);
            });
          }
          (t(G),
            t(b),
            F(() => d(J, e(A).nome)),
            At("click", b, () => g(e(A))),
            i(z, b));
        },
      ),
        t(s),
        i(o, s));
    };
    D(L, (o) => {
      e(x) && o(Y);
    });
  }
  (t(B), t(V));
  var q = r(V, 2),
    Z = r(a(q), 2),
    M = a(Z),
    tt = a(M),
    N = a(tt);
  (Ft(N, {
    class: "h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors",
  }),
    t(tt),
    lt(2),
    t(M));
  var T = r(M, 2),
    X = a(T),
    et = a(X);
  (Bt(et, {
    class:
      "h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors",
  }),
    t(X),
    lt(2),
    t(T));
  var W = r(T, 2),
    yt = a(W),
    Rt = a(yt);
  (Dt(Rt, {
    class:
      "h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors",
  }),
    t(yt),
    lt(2),
    t(W),
    t(Z),
    t(q));
  var ct = r(q, 2),
    pt = a(ct),
    Et = a(pt);
  {
    let o = P(() => {
      var s;
      return ((s = e(n)) == null ? void 0 : s.visitasHoje) ?? 0;
    });
    dt(Et, {
      titulo: "Visitas Hoje",
      get valor() {
        return e(o);
      },
      get icone() {
        return ne;
      },
      corIcone: "text-violet-600",
      corFundo: "bg-violet-50",
    });
  }
  t(pt);
  var mt = r(pt, 2),
    Ht = a(mt);
  {
    let o = P(() => {
      var s;
      return ((s = e(n)) == null ? void 0 : s.visitasSemana) ?? 0;
    });
    dt(Ht, {
      titulo: "Visitas Semana",
      get valor() {
        return e(o);
      },
      get icone() {
        return ve;
      },
      corIcone: "text-blue-600",
      corFundo: "bg-blue-50",
    });
  }
  t(mt);
  var ut = r(mt, 2),
    Ut = a(ut);
  {
    let o = P(() => {
      var s;
      return ((s = e(n)) == null ? void 0 : s.totalProfissionais) ?? 0;
    });
    dt(Ut, {
      titulo: "Profissionais",
      get valor() {
        return e(o);
      },
      get icone() {
        return Ft;
      },
      corIcone: "text-emerald-600",
      corFundo: "bg-emerald-50",
    });
  }
  t(ut);
  var Ct = r(ut, 2),
    $t = a(Ct);
  {
    let o = P(() => {
      var s;
      return ((s = e(n)) == null ? void 0 : s.totalEspecialidades) ?? 0;
    });
    dt($t, {
      titulo: "Especialidades",
      get valor() {
        return e(o);
      },
      get icone() {
        return Bt;
      },
      corIcone: "text-amber-600",
      corFundo: "bg-amber-50",
    });
  }
  (t(Ct), t(ct));
  var xt = r(ct, 2),
    It = a(xt);
  fe(It, {
    get alertas() {
      return e(y);
    },
  });
  var Nt = r(It, 2);
  {
    let o = P(() => {
      var s;
      return ((s = e(n)) == null ? void 0 : s.proximosAgendamentos) ?? [];
    });
    ye(Nt, {
      get agendamentos() {
        return e(o);
      },
    });
  }
  t(xt);
  var Xt = r(xt, 2);
  {
    var qt = (o) => {
      var s = Te(),
        z = r(a(s), 2);
      (nt(
        z,
        21,
        () => e(n).ultimasVisitas,
        vt,
        (A, b) => {
          var R = je(),
            J = a(R),
            G = a(J),
            at = a(G, !0);
          t(G);
          var rt = r(G, 2),
            st = a(rt, !0);
          (t(rt), t(J));
          var K = r(J, 2),
            O = a(K),
            ft = a(O, !0);
          t(O);
          var f = r(O, 2),
            I = a(f),
            zt = r(I);
          {
            var Gt = (Q) => {
              var ot = Ve(),
                it = r(jt(ot), 1, !0);
              (F(() => d(it, e(b).objetivoVisita)), i(Q, ot));
            };
            D(zt, (Q) => {
              e(b).objetivoVisita && Q(Gt);
            });
          }
          (t(f), t(K));
          var Lt = r(K, 2);
          (le(Lt, {
            get status() {
              return e(b).status;
            },
          }),
            t(R),
            F(
              (Q, ot) => {
                var it, kt, Vt;
                (St(R, "href", `/dashboard/profissionais/${e(b).id ?? ""}`),
                  d(at, Q),
                  d(st, ot),
                  d(
                    ft,
                    ((it = e(b).profissional) == null ? void 0 : it.nome) ??
                      "Profissional",
                  ),
                  d(
                    I,
                    `${((Vt = (kt = e(b).profissional) == null ? void 0 : kt.especialidade) == null ? void 0 : Vt.nome) ?? "" ?? ""} `,
                  ));
              },
              [
                () =>
                  new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(e(b).dataVisita)),
                () =>
                  new Intl.DateTimeFormat("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(e(b).dataVisita)),
              ],
            ),
            i(A, R));
        },
      ),
        t(z),
        t(s),
        i(o, s));
    };
    D(Xt, (o) => {
      var s;
      (s = e(n)) != null &&
        s.ultimasVisitas &&
        e(n).ultimasVisitas.length > 0 &&
        o(qt);
    });
  }
  (Tt("blur", j, () => {
    setTimeout(() => {
      w(x, !1);
    }, 200);
  }),
    Tt("focus", j, () => {
      e(u).length > 0 && w(x, !0);
    }),
    ee(
      j,
      () => e(v),
      (o) => w(v, o),
    ),
    i(E, c),
    _t());
}
Zt(["click"]);
export { Qe as component };
