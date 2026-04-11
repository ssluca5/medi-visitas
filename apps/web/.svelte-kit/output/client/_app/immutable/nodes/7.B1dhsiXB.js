import "../chunks/Bzak7iHL.js";
import {
  e as et,
  f as at,
  a as x,
  p as st,
  U as p,
  V as g,
  I as ot,
  z as t,
  B as o,
  t as D,
  b as rt,
  d as i,
  s as v,
  c as h,
  r,
  X as H,
} from "../chunks/CZsNqhY1.js";
import { s as V } from "../chunks/D4SvF6kG.js";
import { l as it, s as dt, i as z } from "../chunks/CsBhEEN0.js";
import { I as lt, s as nt, e as ct } from "../chunks/D_ntMQAe.js";
import { d as vt, a as A } from "../chunks/BLFvJadL.js";
import { e as X, d as ut } from "../chunks/DDioZlon.js";
import { B as $, I as mt } from "../chunks/CwQHtGrs.js";
import "../chunks/CUONaVJB.js";
function ft(w, d) {
  const l = it(d, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const u = [
    ["path", { d: "M18 6 7 17l-5-5" }],
    ["path", { d: "m22 10-7.5 7.5L13 16" }],
  ];
  lt(
    w,
    dt({ name: "check-check" }, () => l, {
      get iconNode() {
        return u;
      },
      children: (n, _) => {
        var c = et(),
          b = at(c);
        (nt(b, d, "default", {}), x(n, c));
      },
      $$slots: { default: !0 },
    }),
  );
}
var pt = h(
    '<button class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors duration-200" style="background-color: #2563eb; border-radius: 8px;"><!> Marcar todas como lidas</button>',
  ),
  xt = h(
    '<div class="flex items-center justify-center py-12"><p class="text-sm text-slate-400">Carregando...</p></div>',
  ),
  _t = h(
    '<div class="flex flex-col items-center justify-center py-12 gap-2"><!> <p class="text-sm text-slate-400">Nenhuma notificação encontrada</p></div>',
  ),
  bt = h('<div class="divide-y divide-slate-100"></div>'),
  ht = h(
    '<div class="flex items-center justify-center gap-3 mt-6"><button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">← Anterior</button> <span class="text-sm text-slate-500"> </span> <button class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">Próxima →</button></div>',
  ),
  gt = h(
    '<div class="max-w-3xl mx-auto"><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm"><!></div> <div><h1 class="text-2xl font-semibold text-slate-900">Notificações</h1> <p class="text-sm text-slate-500 mt-0.5"> </p></div></div> <div class="flex items-center gap-3"><select class="h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer"><option>Todas</option><option>Não lidas</option><option>Lidas</option></select> <!></div></div> <div class="rounded-xl border border-slate-200 overflow-hidden bg-white"><!></div> <!></div>',
  );
function Nt(w, d) {
  st(d, !0);
  let l = p(g(d.data.page)),
    u = p(""),
    n = p(g(d.data.data)),
    _ = p(g(d.data.total)),
    c = p(g(d.data.naoLidas)),
    b = p(g(d.data.totalPages)),
    k = p(!1);
  ot(() => {
    (t(l), t(u), q());
  });
  async function q() {
    o(k, !0);
    try {
      const e = new URLSearchParams({ page: String(t(l)), pageSize: "20" });
      t(u) && e.set("lida", t(u));
      const a = await fetch(`${X}/notificacoes?${e}`, {
        headers: { Authorization: `Bearer ${d.data.sessionToken}` },
      });
      if (a.ok) {
        const s = await a.json();
        (o(n, s.data, !0),
          o(_, s.total, !0),
          o(c, s.naoLidas, !0),
          o(b, s.totalPages, !0));
      }
    } finally {
      o(k, !1);
    }
  }
  async function E() {
    (await fetch(`${X}/notificacoes/marcar-todas-lidas`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${d.data.sessionToken}` },
    }),
      o(
        n,
        t(n).map((e) => ({ ...e, lida: !0 })),
        !0,
      ),
      o(c, 0));
  }
  var L = gt(),
    P = i(L),
    I = i(P),
    T = i(I),
    F = i(T);
  ($(F, { class: "h-5 w-5 text-white" }), r(T));
  var C = v(T, 2),
    M = v(i(C), 2),
    G = i(M);
  (r(M), r(C), r(I));
  var U = v(I, 2),
    y = i(U),
    j = i(y);
  j.value = j.__value = "";
  var B = v(j);
  B.value = B.__value = "false";
  var S = v(B);
  ((S.value = S.__value = "true"), r(y));
  var J = v(y, 2);
  {
    var K = (e) => {
      var a = pt(),
        s = i(a);
      (ft(s, { class: "h-4 w-4" }), H(), r(a), A("click", a, E), x(e, a));
    };
    z(J, (e) => {
      t(c) > 0 && e(K);
    });
  }
  (r(U), r(P));
  var N = v(P, 2),
    O = i(N);
  {
    var Q = (e) => {
        var a = xt();
        x(e, a);
      },
      W = (e) => {
        var a = _t(),
          s = i(a);
        ($(s, { class: "w-10 h-10 text-slate-200" }), H(2), r(a), x(e, a));
      },
      Y = (e) => {
        var a = bt();
        (ct(
          a,
          21,
          () => t(n),
          (s) => s.id,
          (s, m) => {
            mt(s, {
              get notif() {
                return t(m);
              },
              get sessionToken() {
                return d.data.sessionToken;
              },
              onLida: () => {
                (o(
                  n,
                  t(n).map((f) => (f.id === t(m).id ? { ...f, lida: !0 } : f)),
                  !0,
                ),
                  o(c, Math.max(0, t(c) - 1), !0));
              },
              onDeletada: () => {
                (o(
                  n,
                  t(n).filter((f) => f.id !== t(m).id),
                  !0,
                ),
                  o(_, Math.max(0, t(_) - 1), !0));
              },
            });
          },
        ),
          r(a),
          x(e, a));
      };
    z(O, (e) => {
      t(k) ? e(Q) : t(n).length === 0 ? e(W, 1) : e(Y, -1);
    });
  }
  r(N);
  var Z = v(N, 2);
  {
    var tt = (e) => {
      var a = ht(),
        s = i(a),
        m = v(s, 2),
        f = i(m);
      r(m);
      var R = v(m, 2);
      (r(a),
        D(() => {
          ((s.disabled = t(l) === 1),
            V(f, `${t(l) ?? ""} / ${t(b) ?? ""}`),
            (R.disabled = t(l) === t(b)));
        }),
        A("click", s, () => o(l, t(l) - 1)),
        A("click", R, () => o(l, t(l) + 1)),
        x(e, a));
    };
    z(Z, (e) => {
      t(b) > 1 && e(tt);
    });
  }
  (r(L),
    D(() =>
      V(
        G,
        `${t(_) ?? ""} notificação${t(_) !== 1 ? "ões" : ""} · ${t(c) ?? ""} não lida${t(c) !== 1 ? "s" : ""}`,
      ),
    ),
    ut(
      y,
      () => t(u),
      (e) => o(u, e),
    ),
    x(w, L),
    rt());
}
vt(["click"]);
export { Nt as component };
