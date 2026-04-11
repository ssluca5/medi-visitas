import {
  j as z,
  E as B,
  ax as L,
  ay as j,
  h as q,
  u as M,
  az as P,
  aA as U,
  aB as G,
  au as K,
  a5 as W,
  ac as $,
  a6 as F,
} from "./CZsNqhY1.js";
import { b as D } from "./D4SvF6kG.js";
const H = () => performance.now(),
  h = {
    tick: (r) => requestAnimationFrame(r),
    now: () => H(),
    tasks: new Set(),
  };
function R() {
  const r = h.now();
  (h.tasks.forEach((t) => {
    t.c(r) || (h.tasks.delete(t), t.f());
  }),
    h.tasks.size !== 0 && h.tick(R));
}
function J(r) {
  let t;
  return (
    h.tasks.size === 0 && h.tick(R),
    {
      promise: new Promise((a) => {
        h.tasks.add((t = { c: r, f: a }));
      }),
      abort() {
        h.tasks.delete(t);
      },
    }
  );
}
function A(r, t) {
  F(() => {
    r.dispatchEvent(new CustomEvent(t));
  });
}
function Q(r) {
  if (r === "float") return "cssFloat";
  if (r === "offset") return "cssOffset";
  if (r.startsWith("--")) return r;
  const t = r.split("-");
  return t.length === 1
    ? t[0]
    : t[0] +
        t
          .slice(1)
          .map((a) => a[0].toUpperCase() + a.slice(1))
          .join("");
}
function I(r) {
  const t = {},
    a = r.split(";");
  for (const s of a) {
    const [n, o] = s.split(":");
    if (!n || o === void 0) break;
    const f = Q(n.trim());
    t[f] = o.trim();
  }
  return t;
}
const V = (r) => r;
function tt(r, t, a, s) {
  var T;
  var n = (r & U) !== 0,
    o = (r & G) !== 0,
    f = n && o,
    v = (r & P) !== 0,
    p = f ? "both" : n ? "in" : "out",
    d,
    c = t.inert,
    w = t.style.overflow,
    i,
    e;
  function m() {
    return F(
      () =>
        d ?? (d = a()(t, (s == null ? void 0 : s()) ?? {}, { direction: p })),
    );
  }
  var u = {
      is_global: v,
      in() {
        var l;
        if (((t.inert = c), !n)) {
          (e == null || e.abort(),
            (l = e == null ? void 0 : e.reset) == null || l.call(e));
          return;
        }
        (o || i == null || i.abort(),
          (i = k(t, m(), e, 1, () => {
            (A(t, "introend"),
              i == null || i.abort(),
              (i = d = void 0),
              (t.style.overflow = w));
          })));
      },
      out(l) {
        if (!o) {
          (l == null || l(), (d = void 0));
          return;
        }
        ((t.inert = !0),
          (e = k(t, m(), i, 0, () => {
            (A(t, "outroend"), l == null || l());
          })));
      },
      stop: () => {
        (i == null || i.abort(), e == null || e.abort());
      },
    },
    y = z;
  if ((((T = y.nodes).t ?? (T.t = [])).push(u), n && D)) {
    var b = v;
    if (!b) {
      for (var _ = y.parent; _ && (_.f & B) !== 0; )
        for (; (_ = _.parent) && (_.f & L) === 0; );
      b = !_ || (_.f & j) !== 0;
    }
    b &&
      q(() => {
        M(() => u.in());
      });
  }
}
function k(r, t, a, s, n) {
  var o = s === 1;
  if (K(t)) {
    var f,
      v = !1;
    return (
      W(() => {
        if (!v) {
          var y = t({ direction: o ? "in" : "out" });
          f = k(r, y, a, s, n);
        }
      }),
      {
        abort: () => {
          ((v = !0), f == null || f.abort());
        },
        deactivate: () => f.deactivate(),
        reset: () => f.reset(),
        t: () => f.t(),
      }
    );
  }
  if (
    (a == null || a.deactivate(),
    !(t != null && t.duration) && !(t != null && t.delay))
  )
    return (
      A(r, o ? "introstart" : "outrostart"),
      n(),
      { abort: $, deactivate: $, reset: $, t: () => s }
    );
  const { delay: p = 0, css: d, tick: c, easing: w = V } = t;
  var i = [];
  if (o && a === void 0 && (c && c(0, 1), d)) {
    var e = I(d(0, 1));
    i.push(e, e);
  }
  var m = () => 1 - s,
    u = r.animate(i, { duration: p, fill: "forwards" });
  return (
    (u.onfinish = () => {
      (u.cancel(), A(r, o ? "introstart" : "outrostart"));
      var y = (a == null ? void 0 : a.t()) ?? 1 - s;
      a == null || a.abort();
      var b = s - y,
        _ = t.duration * Math.abs(b),
        T = [];
      if (_ > 0) {
        var l = !1;
        if (d)
          for (
            var C = Math.ceil(_ / 16.666666666666668), E = 0;
            E <= C;
            E += 1
          ) {
            var O = y + b * w(E / C),
              S = I(d(O, 1 - O));
            (T.push(S), l || (l = S.overflow === "hidden"));
          }
        (l && (r.style.overflow = "hidden"),
          (m = () => {
            var N = u.currentTime;
            return y + b * w(N / _);
          }),
          c &&
            J(() => {
              if (u.playState !== "running") return !1;
              var N = m();
              return (c(N, 1 - N), !0);
            }));
      }
      ((u = r.animate(T, { duration: _, fill: "forwards" })),
        (u.onfinish = () => {
          ((m = () => s), c == null || c(s, 1 - s), n());
        }));
    }),
    {
      abort: () => {
        u && (u.cancel(), (u.effect = null), (u.onfinish = $));
      },
      deactivate: () => {
        n = $;
      },
      reset: () => {
        s === 0 && (c == null || c(1, 0));
      },
      t: () => m(),
    }
  );
}
const X = (r) => r;
function g(r) {
  const t = r - 1;
  return t * t * t + 1;
}
function x(r) {
  const t = typeof r == "string" && r.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return t ? [parseFloat(t[1]), t[2] || "px"] : [r, "px"];
}
function rt(r, { delay: t = 0, duration: a = 400, easing: s = X } = {}) {
  const n = +getComputedStyle(r).opacity;
  return { delay: t, duration: a, easing: s, css: (o) => `opacity: ${o * n}` };
}
function at(
  r,
  {
    delay: t = 0,
    duration: a = 400,
    easing: s = g,
    x: n = 0,
    y: o = 0,
    opacity: f = 0,
  } = {},
) {
  const v = getComputedStyle(r),
    p = +v.opacity,
    d = v.transform === "none" ? "" : v.transform,
    c = p * (1 - f),
    [w, i] = x(n),
    [e, m] = x(o);
  return {
    delay: t,
    duration: a,
    easing: s,
    css: (u, y) => `
			transform: ${d} translate(${(1 - u) * w}${i}, ${(1 - u) * e}${m});
			opacity: ${p - c * y}`,
  };
}
function st(
  r,
  {
    delay: t = 0,
    duration: a = 400,
    easing: s = g,
    start: n = 0,
    opacity: o = 0,
  } = {},
) {
  const f = getComputedStyle(r),
    v = +f.opacity,
    p = f.transform === "none" ? "" : f.transform,
    d = 1 - n,
    c = v * (1 - o);
  return {
    delay: t,
    duration: a,
    easing: s,
    css: (w, i) => `
			transform: ${p} scale(${1 - d * i});
			opacity: ${v - c * i}
		`,
  };
}
function it(r) {
  const t = r - 1;
  return t * t * t + 1;
}
export { at as a, it as c, rt as f, st as s, tt as t };
