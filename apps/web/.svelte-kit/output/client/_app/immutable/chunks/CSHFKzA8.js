import "./Bzak7iHL.js";
import {
  e as K,
  f as C,
  a as f,
  p as ie,
  I as oe,
  b as se,
  ab as ne,
  s as g,
  d as r,
  X as le,
  r as i,
  t as A,
  c as L,
} from "./CZsNqhY1.js";
import { d as q, e as de, a as _ } from "./BLFvJadL.js";
import { s as G } from "./D-vgaD8G.js";
import { l as ce, s as ve, p, i as B } from "./CsBhEEN0.js";
import { t as N, f as J, c as Q, a as fe, s as ue } from "./BuANLyWW.js";
import { s as H } from "./DDioZlon.js";
import { I as me, s as be, X as ge } from "./D_ntMQAe.js";
import { s as I } from "./D4SvF6kG.js";
import { T as he } from "./DYTuZaAl.js";
import "./CUONaVJB.js";
function xe(y, e) {
  const s = ce(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const w = [
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17" }],
  ];
  me(
    y,
    ve({ name: "trash-2" }, () => s, {
      get iconNode() {
        return w;
      },
      children: (o, d) => {
        var h = K(),
          n = C(h);
        (be(n, e, "default", {}), f(o, h));
      },
      $$slots: { default: !0 },
    }),
  );
}
var pe = L(
  '<div class="fixed inset-0 z-50 bg-black/30" role="presentation"></div> <div role="dialog" aria-modal="true"><button type="button" class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"><!> <span class="sr-only">Fechar</span></button> <div class="flex-1 overflow-y-auto p-6"><!></div></div>',
  1,
);
function Ne(y, e) {
  ie(e, !0);
  let s = p(e, "side", 3, "right");
  function w(n) {
    n.key === "Escape" && e.onclose();
  }
  oe(
    () => (
      e.open
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = ""),
      () => {
        document.body.style.overflow = "";
      }
    ),
  );
  var o = K();
  de("keydown", ne, w);
  var d = C(o);
  {
    var h = (n) => {
      var k = pe(),
        M = C(k),
        u = g(M, 2);
      let T;
      var x = r(u),
        z = r(x);
      (ge(z, { class: "h-4 w-4" }), le(2), i(x));
      var m = g(x, 2),
        D = r(m);
      (G(D, () => e.children),
        i(m),
        i(u),
        A(
          () =>
            (T = H(
              u,
              1,
              "fixed inset-y-0 z-50 flex h-full w-[90%] max-w-md flex-col bg-white shadow-2xl overflow-x-hidden sm:max-w-sm",
              null,
              T,
              {
                "right-0": s() === "right",
                "left-0": s() === "left",
                "border-l": s() === "right",
                "border-r": s() === "left",
              },
            )),
        ),
        _("click", M, function (...b) {
          var c;
          (c = e.onclose) == null || c.apply(this, b);
        }),
        N(
          3,
          M,
          () => J,
          () => ({ duration: 200 }),
        ),
        _("click", x, function (...b) {
          var c;
          (c = e.onclose) == null || c.apply(this, b);
        }),
        N(
          3,
          u,
          () => fe,
          () => ({ x: s() === "right" ? 400 : -400, duration: 300, easing: Q }),
        ),
        f(n, k));
    };
    B(d, (n) => {
      e.open && n(h);
    });
  }
  (f(y, o), se());
}
q(["click"]);
var _e = L(`<div class="text-sm text-slate-600 mt-2 leading-relaxed
									[&amp;>strong]:text-slate-700 [&amp;>strong]:font-medium
									[&amp;>p+p]:mt-3"><!></div>`),
  ye = L(`<button class="px-4 py-2 rounded-lg text-sm font-medium
								bg-white border border-slate-300 text-slate-700
								hover:bg-slate-50 hover:-translate-y-[1px]
								active:scale-[0.98] transition-all duration-200
								cursor-pointer disabled:opacity-50 shadow-sm"> </button>`),
  we = L(
    `<button class="px-4 py-2 rounded-lg text-sm font-medium
								bg-white border border-slate-300 text-slate-700
								hover:bg-slate-50 hover:-translate-y-[1px]
								active:scale-[0.98] transition-all duration-200
								cursor-pointer disabled:opacity-50"> </button> <button> </button>`,
    1,
  ),
  ke = L(
    '<div class="fixed inset-0 z-50 flex items-center justify-center"><div class="absolute inset-0 bg-black/30" role="presentation"></div> <div class="relative z-10 w-full max-w-md mx-4 rounded-2xl shadow-2xl bg-white border border-slate-200/80"><div class="p-7"><div class="flex items-start gap-4"><div><!></div> <div class="flex-1 pt-0.5"><h3 class="text-lg font-semibold text-slate-900"> </h3> <!></div></div> <div class="flex justify-end gap-3 mt-8"><!></div></div></div></div>',
  );
function Se(y, e) {
  let s = p(e, "confirmLabel", 3, "Excluir"),
    w = p(e, "cancelLabel", 3, "Cancelar"),
    o = p(e, "variant", 3, "danger"),
    d = p(e, "loading", 3, !1),
    h = p(e, "isBlockingDialog", 3, !1);
  const n = { danger: "bg-red-50", warning: "bg-amber-50", info: "bg-blue-50" },
    k = {
      danger: "text-red-600",
      warning: "text-amber-600",
      info: "text-blue-600",
    },
    M = {
      danger: "bg-red-600 hover:bg-red-700",
      warning: "bg-amber-600 hover:bg-amber-700",
      info: "bg-blue-600 hover:bg-blue-700",
    };
  var u = K(),
    T = C(u);
  {
    var x = (z) => {
      var m = ke(),
        D = r(m),
        b = g(D, 2),
        c = r(b),
        S = r(c),
        E = r(S),
        R = r(E);
      {
        var U = (t) => {
            he(t, {
              get class() {
                return `w-5 h-5 ${k[o()] ?? ""}`;
              },
            });
          },
          W = (t) => {
            xe(t, {
              get class() {
                return `w-5 h-5 ${k[o()] ?? ""}`;
              },
            });
          };
        B(R, (t) => {
          o() === "warning" ? t(U) : t(W, -1);
        });
      }
      i(E);
      var O = g(E, 2),
        V = r(O),
        Y = r(V, !0);
      i(V);
      var Z = g(V, 2);
      {
        var $ = (t) => {
          var a = _e(),
            l = r(a);
          (G(l, () => e.description), i(a), f(t, a));
        };
        B(Z, (t) => {
          e.description && t($);
        });
      }
      (i(O), i(S));
      var P = g(S, 2),
        ee = r(P);
      {
        var te = (t) => {
            var a = ye(),
              l = r(a, !0);
            (i(a),
              A(() => {
                ((a.disabled = d()), I(l, d() ? "Aguarde..." : "Entendi"));
              }),
              _("click", a, function (...X) {
                var v;
                (v = e.onclose) == null || v.apply(this, X);
              }),
              f(t, a));
          },
          ae = (t) => {
            var a = we(),
              l = C(a),
              X = r(l, !0);
            i(l);
            var v = g(l, 2),
              re = r(v, !0);
            (i(v),
              A(() => {
                ((l.disabled = d()),
                  I(X, w()),
                  (v.disabled = d()),
                  H(
                    v,
                    1,
                    `px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm
								hover:-translate-y-[1px] active:scale-[0.98]
								transition-all duration-200 cursor-pointer
								disabled:opacity-50 ${M[o()] ?? ""}`,
                  ),
                  I(re, d() ? "Aguarde..." : s()));
              }),
              _("click", l, function (...F) {
                var j;
                (j = e.onclose) == null || j.apply(this, F);
              }),
              _("click", v, function (...F) {
                var j;
                (j = e.onconfirm) == null || j.apply(this, F);
              }),
              f(t, a));
          };
        B(ee, (t) => {
          h() ? t(te) : t(ae, -1);
        });
      }
      (i(P),
        i(c),
        i(b),
        i(m),
        A(() => {
          (H(
            E,
            1,
            `shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${n[o()] ?? ""}`,
          ),
            I(Y, e.title));
        }),
        _("click", D, function (...t) {
          var a;
          (a = e.onclose) == null || a.apply(this, t);
        }),
        N(
          3,
          b,
          () => ue,
          () => ({ start: 0.95, duration: 200, easing: Q }),
        ),
        N(
          3,
          m,
          () => J,
          () => ({ duration: 200 }),
        ),
        f(z, m));
    };
    B(T, (z) => {
      e.open && z(x);
    });
  }
  f(y, u);
}
q(["click"]);
export { Se as C, Ne as S, xe as T };
