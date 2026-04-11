const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "../nodes/0.C6TnkpoA.js",
      "../chunks/Bzak7iHL.js",
      "../chunks/CZsNqhY1.js",
      "../chunks/D-vgaD8G.js",
      "../chunks/CsBhEEN0.js",
      "../chunks/D4SvF6kG.js",
      "../chunks/BLFvJadL.js",
      "../chunks/C57bVzq3.js",
      "../chunks/BGWMiPqM.js",
      "../chunks/BGJvssSt.js",
      "../chunks/DCnew6Fl.js",
      "../chunks/CUONaVJB.js",
      "../chunks/D_ntMQAe.js",
      "../chunks/DDioZlon.js",
      "../chunks/Cat8nRvO.js",
      "../chunks/BuANLyWW.js",
      "../chunks/BG-wUOgw.js",
      "../chunks/CkHy_-7l.js",
      "../chunks/Bj1gaHN5.js",
      "../chunks/CwQHtGrs.js",
      "../chunks/DYTuZaAl.js",
      "../chunks/D9kr8FOy.js",
      "../chunks/CnGzXvjY.js",
      "../chunks/llUmQ53V.js",
      "../chunks/DoHM5GQu.js",
      "../chunks/0So1ctTy.js",
      "../chunks/DgL0CZso.js",
      "../assets/0.2JV6HWfU.css",
      "../nodes/1.BvwFZ28I.js",
      "../nodes/2.CLFqqILH.js",
      "../nodes/3.C4Q4wIu1.js",
      "../chunks/DFOm60R7.js",
      "../chunks/CjOXa5Yh.js",
      "../chunks/eFcn31mN.js",
      "../chunks/CqukC_q6.js",
      "../chunks/EGrcUm4A.js",
      "../chunks/DROL47i9.js",
      "../nodes/4.e3GytRhg.js",
      "../chunks/qvlMHhdT.js",
      "../chunks/3qHYYpT2.js",
      "../chunks/Bz-yDreG.js",
      "../chunks/D8FNBZgZ.js",
      "../chunks/CSHFKzA8.js",
      "../chunks/DI35S9H6.js",
      "../chunks/aDnaZvbC.js",
      "../nodes/5.DMHr9PaC.js",
      "../chunks/DpW8pZ2L.js",
      "../chunks/YBzjEPSW.js",
      "../nodes/6.ium3WE9l.js",
      "../nodes/7.B1dhsiXB.js",
      "../nodes/8.3OwtWHqw.js",
      "../chunks/CRgIWMUr.js",
      "../nodes/9.FvtvHO5-.js",
      "../chunks/DTLLfViW.js",
      "../nodes/10.BZoK0YGn.js",
      "../nodes/11.D_oQshd0.js",
      "../nodes/12.D0ybK90-.js",
      "../nodes/13.Cjzz6fbd.js",
    ]),
) => i.map((i) => d[i]);
var W = (e) => {
  throw TypeError(e);
};
var z = (e, t, s) => t.has(e) || W("Cannot " + s);
var u = (e, t, s) => (
    z(e, t, "read from private field"),
    s ? s.call(e) : t.get(e)
  ),
  V = (e, t, s) =>
    t.has(e)
      ? W("Cannot add the same private member more than once")
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, s),
  w = (e, t, s, n) => (
    z(e, t, "write to private field"),
    n ? n.call(e, s) : t.set(e, s),
    s
  );
import {
  B as D,
  av as X,
  z as E,
  _ as Z,
  a7 as M,
  A as N,
  p as $,
  G as tt,
  I as et,
  a1 as rt,
  f as T,
  s as st,
  a as O,
  b as at,
  U as k,
  e as x,
  d as ot,
  r as nt,
  c as Y,
  F as S,
  W as it,
  t as ct,
} from "../chunks/CZsNqhY1.js";
import { h as ut, m as lt, u as mt, s as dt } from "../chunks/D4SvF6kG.js";
import "../chunks/Bzak7iHL.js";
import { o as _t } from "../chunks/BGJvssSt.js";
import { p as j, i as C } from "../chunks/CsBhEEN0.js";
import { c as B } from "../chunks/Bj1gaHN5.js";
import { b as U } from "../chunks/CRgIWMUr.js";
function ft(e) {
  return class extends ht {
    constructor(t) {
      super({ component: e, ...t });
    }
  };
}
var b, _;
class ht {
  constructor(t) {
    V(this, b);
    V(this, _);
    var v;
    var s = new Map(),
      n = (a, r) => {
        var i = N(r, !1, !1);
        return (s.set(a, i), i);
      };
    const m = new Proxy(
      { ...(t.props || {}), $$events: {} },
      {
        get(a, r) {
          return E(s.get(r) ?? n(r, Reflect.get(a, r)));
        },
        has(a, r) {
          return r === X
            ? !0
            : (E(s.get(r) ?? n(r, Reflect.get(a, r))), Reflect.has(a, r));
        },
        set(a, r, i) {
          return (D(s.get(r) ?? n(r, i), i), Reflect.set(a, r, i));
        },
      },
    );
    (w(
      this,
      _,
      (t.hydrate ? ut : lt)(t.component, {
        target: t.target,
        anchor: t.anchor,
        props: m,
        context: t.context,
        intro: t.intro ?? !1,
        recover: t.recover,
        transformError: t.transformError,
      }),
    ),
      (!((v = t == null ? void 0 : t.props) != null && v.$$host) ||
        t.sync === !1) &&
        Z(),
      w(this, b, m.$$events));
    for (const a of Object.keys(u(this, _)))
      a === "$set" ||
        a === "$destroy" ||
        a === "$on" ||
        M(this, a, {
          get() {
            return u(this, _)[a];
          },
          set(r) {
            u(this, _)[a] = r;
          },
          enumerable: !0,
        });
    ((u(this, _).$set = (a) => {
      Object.assign(m, a);
    }),
      (u(this, _).$destroy = () => {
        mt(u(this, _));
      }));
  }
  $set(t) {
    u(this, _).$set(t);
  }
  $on(t, s) {
    u(this, b)[t] = u(this, b)[t] || [];
    const n = (...m) => s.call(this, ...m);
    return (
      u(this, b)[t].push(n),
      () => {
        u(this, b)[t] = u(this, b)[t].filter((m) => m !== n);
      }
    );
  }
  $destroy() {
    u(this, _).$destroy();
  }
}
((b = new WeakMap()), (_ = new WeakMap()));
const vt = "modulepreload",
  gt = function (e, t) {
    return new URL(e, t).href;
  },
  F = {},
  l = function (t, s, n) {
    let m = Promise.resolve();
    if (s && s.length > 0) {
      let a = function (c) {
        return Promise.all(
          c.map((g) =>
            Promise.resolve(g).then(
              (p) => ({ status: "fulfilled", value: p }),
              (p) => ({ status: "rejected", reason: p }),
            ),
          ),
        );
      };
      const r = document.getElementsByTagName("link"),
        i = document.querySelector("meta[property=csp-nonce]"),
        L =
          (i == null ? void 0 : i.nonce) ||
          (i == null ? void 0 : i.getAttribute("nonce"));
      m = a(
        s.map((c) => {
          if (((c = gt(c, n)), c in F)) return;
          F[c] = !0;
          const g = c.endsWith(".css"),
            p = g ? '[rel="stylesheet"]' : "";
          if (!!n)
            for (let o = r.length - 1; o >= 0; o--) {
              const d = r[o];
              if (d.href === c && (!g || d.rel === "stylesheet")) return;
            }
          else if (document.querySelector(`link[href="${c}"]${p}`)) return;
          const h = document.createElement("link");
          if (
            ((h.rel = g ? "stylesheet" : vt),
            g || (h.as = "script"),
            (h.crossOrigin = ""),
            (h.href = c),
            L && h.setAttribute("nonce", L),
            document.head.appendChild(h),
            g)
          )
            return new Promise((o, d) => {
              (h.addEventListener("load", o),
                h.addEventListener("error", () =>
                  d(new Error(`Unable to preload CSS for ${c}`)),
                ));
            });
        }),
      );
    }
    function v(a) {
      const r = new Event("vite:preloadError", { cancelable: !0 });
      if (((r.payload = a), window.dispatchEvent(r), !r.defaultPrevented))
        throw a;
    }
    return m.then((a) => {
      for (const r of a || []) r.status === "rejected" && v(r.reason);
      return t().catch(v);
    });
  },
  wt = {};
var Et = Y(
    '<div id="svelte-announcer" aria-live="assertive" aria-atomic="true" style="position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"><!></div>',
  ),
  bt = Y("<!> <!>", 1);
function pt(e, t) {
  $(t, !0);
  let s = j(t, "components", 23, () => []),
    n = j(t, "data_0", 3, null),
    m = j(t, "data_1", 3, null);
  (tt(() => t.stores.page.set(t.page)),
    et(() => {
      (t.stores,
        t.page,
        t.constructors,
        s(),
        t.form,
        n(),
        m(),
        t.stores.page.notify());
    }));
  let v = k(!1),
    a = k(!1),
    r = k(null);
  _t(() => {
    const o = t.stores.page.subscribe(() => {
      E(v) &&
        (D(a, !0),
        rt().then(() => {
          D(r, document.title || "untitled page", !0);
        }));
    });
    return (D(v, !0), o);
  });
  const i = S(() => t.constructors[1]);
  var L = bt(),
    c = T(L);
  {
    var g = (o) => {
        const d = S(() => t.constructors[0]);
        var P = x(),
          A = T(P);
        (B(
          A,
          () => E(d),
          (y, R) => {
            U(
              R(y, {
                get data() {
                  return n();
                },
                get form() {
                  return t.form;
                },
                get params() {
                  return t.page.params;
                },
                children: (f, yt) => {
                  var G = x(),
                    J = T(G);
                  (B(
                    J,
                    () => E(i),
                    (K, Q) => {
                      U(
                        Q(K, {
                          get data() {
                            return m();
                          },
                          get form() {
                            return t.form;
                          },
                          get params() {
                            return t.page.params;
                          },
                        }),
                        (I) => (s()[1] = I),
                        () => {
                          var I;
                          return (I = s()) == null ? void 0 : I[1];
                        },
                      );
                    },
                  ),
                    O(f, G));
                },
                $$slots: { default: !0 },
              }),
              (f) => (s()[0] = f),
              () => {
                var f;
                return (f = s()) == null ? void 0 : f[0];
              },
            );
          },
        ),
          O(o, P));
      },
      p = (o) => {
        const d = S(() => t.constructors[0]);
        var P = x(),
          A = T(P);
        (B(
          A,
          () => E(d),
          (y, R) => {
            U(
              R(y, {
                get data() {
                  return n();
                },
                get form() {
                  return t.form;
                },
                get params() {
                  return t.page.params;
                },
              }),
              (f) => (s()[0] = f),
              () => {
                var f;
                return (f = s()) == null ? void 0 : f[0];
              },
            );
          },
        ),
          O(o, P));
      };
    C(c, (o) => {
      t.constructors[1] ? o(g) : o(p, -1);
    });
  }
  var q = st(c, 2);
  {
    var h = (o) => {
      var d = Et(),
        P = ot(d);
      {
        var A = (y) => {
          var R = it();
          (ct(() => dt(R, E(r))), O(y, R));
        };
        C(P, (y) => {
          E(a) && y(A);
        });
      }
      (nt(d), O(o, d));
    };
    C(q, (o) => {
      E(v) && o(h);
    });
  }
  (O(e, L), at());
}
const kt = ft(pt),
  xt = [
    () =>
      l(
        () => import("../nodes/0.C6TnkpoA.js"),
        __vite__mapDeps([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/1.BvwFZ28I.js"),
        __vite__mapDeps([28, 1, 11, 2, 5, 6, 14, 10, 8, 9]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/2.CLFqqILH.js"),
        __vite__mapDeps([29, 1, 11, 2]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/3.C4Q4wIu1.js"),
        __vite__mapDeps([
          30, 1, 2, 5, 6, 4, 12, 11, 13, 14, 7, 31, 8, 9, 18, 17, 20, 32, 33,
          34, 35, 24, 25, 36, 21,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/4.e3GytRhg.js"),
        __vite__mapDeps([
          37, 1, 9, 2, 5, 6, 4, 7, 13, 31, 12, 11, 14, 32, 38, 39, 34, 40, 41,
          42, 3, 15, 20, 43, 35, 44,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/5.DMHr9PaC.js"),
        __vite__mapDeps([
          45, 1, 2, 5, 6, 4, 12, 11, 13, 14, 7, 31, 16, 43, 3, 42, 15, 20, 25,
          46, 47, 39,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/6.ium3WE9l.js"),
        __vite__mapDeps([
          48, 1, 9, 2, 5, 6, 4, 12, 11, 13, 14, 7, 31, 16, 43, 3, 42, 15, 20,
          26, 35, 46, 47,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/7.B1dhsiXB.js"),
        __vite__mapDeps([49, 1, 2, 5, 6, 4, 12, 11, 13, 14, 19, 18, 17, 20]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/8.3OwtWHqw.js"),
        __vite__mapDeps([
          50, 1, 9, 2, 5, 6, 4, 7, 13, 31, 43, 3, 16, 18, 12, 11, 14, 35, 51,
          23, 24, 36, 34,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/9.FvtvHO5-.js"),
        __vite__mapDeps([
          52, 1, 9, 2, 5, 6, 4, 12, 11, 13, 14, 7, 31, 53, 8, 16, 43, 3, 42, 15,
          20, 33, 24, 35, 46, 21, 47, 38, 39, 32, 26,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/10.BZoK0YGn.js"),
        __vite__mapDeps([
          54, 1, 9, 2, 5, 6, 4, 12, 11, 13, 14, 18, 7, 53, 8, 31, 33, 41, 42, 3,
          15, 20, 43, 35, 21, 34, 32, 40, 22, 26,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/11.D_oQshd0.js"),
        __vite__mapDeps([
          55, 1, 9, 2, 5, 6, 4, 12, 11, 13, 14, 7, 31, 33, 43, 3, 42, 15, 20,
          41, 35, 44, 46, 21, 26, 32, 38, 39,
        ]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/12.D0ybK90-.js"),
        __vite__mapDeps([56, 1, 11, 2, 7, 13, 6]),
        import.meta.url,
      ),
    () =>
      l(
        () => import("../nodes/13.Cjzz6fbd.js"),
        __vite__mapDeps([57, 1, 11, 2, 7, 13, 6]),
        import.meta.url,
      ),
  ],
  St = [0],
  jt = {
    "/": [-3],
    "/dashboard": [-4],
    "/dashboard/agenda": [4],
    "/dashboard/especialidades": [5],
    "/dashboard/materiais": [6],
    "/dashboard/notificacoes": [-8],
    "/dashboard/pipeline": [8],
    "/dashboard/profissionais": [9],
    "/dashboard/profissionais/[id]": [10],
    "/dashboard/visitas": [11],
    "/login": [12],
    "/signup": [13],
  },
  H = {
    handleError: ({ error: e }) => {
      console.error(e);
    },
    reroute: () => {},
    transport: {},
  },
  Pt = Object.fromEntries(
    Object.entries(H.transport).map(([e, t]) => [e, t.decode]),
  ),
  Ct = Object.fromEntries(
    Object.entries(H.transport).map(([e, t]) => [e, t.encode]),
  ),
  Bt = !1,
  Ut = (e, t) => Pt[e](t);
export {
  Ut as decode,
  Pt as decoders,
  jt as dictionary,
  Ct as encoders,
  Bt as hash,
  H as hooks,
  wt as matchers,
  xt as nodes,
  kt as root,
  St as server_loads,
};
