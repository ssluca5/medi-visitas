var re = Object.defineProperty;
var K = (r) => {
  throw TypeError(r);
};
var se = (r, e, s) =>
  e in r
    ? re(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s })
    : (r[e] = s);
var U = (r, e, s) => se(r, typeof e != "symbol" ? e + "" : e, s),
  F = (r, e, s) => e.has(r) || K("Cannot " + s);
var t = (r, e, s) => (
    F(r, e, "read from private field"),
    s ? s.call(r) : e.get(r)
  ),
  v = (r, e, s) =>
    e.has(r)
      ? K("Cannot add the same private member more than once")
      : e instanceof WeakSet
        ? e.add(r)
        : e.set(r, s),
  Y = (r, e, s, n) => (
    F(r, e, "write to private field"),
    n ? n.call(r, s) : e.set(r, s),
    s
  );
import {
  a4 as ne,
  a7 as te,
  ac as q,
  A as ie,
  z as g,
  B as V,
  ad as ae,
  ae as R,
  af as ue,
  M as C,
  ag as $,
  a3 as fe,
  l as D,
  w as H,
  ah as oe,
  ai as ce,
  k as le,
  m as de,
  E as pe,
  n as he,
  o as _e,
  q as ve,
  v as z,
  j as B,
  aj as be,
  ak as T,
  al as me,
  am as J,
  V as we,
  an as Pe,
  ao as Se,
  ap as Z,
  a9 as G,
  aq as ge,
  u as xe,
  Z as ye,
  ar as Oe,
  as as Ee,
  L as Ae,
  at as Ie,
  au as S,
  S as Q,
  av as W,
  aw as Re,
} from "./CZsNqhY1.js";
import { a as De, g as Te } from "./D4SvF6kG.js";
let E = !1,
  M = Symbol();
function qe(r, e, s) {
  const n =
    s[e] ?? (s[e] = { store: null, source: ie(void 0), unsubscribe: q });
  if (n.store !== r && !(M in s))
    if ((n.unsubscribe(), (n.store = r ?? null), r == null))
      ((n.source.v = void 0), (n.unsubscribe = q));
    else {
      var i = !0;
      ((n.unsubscribe = De(r, (a) => {
        i ? (n.source.v = a) : V(n.source, a);
      })),
        (i = !1));
    }
  return r && M in s ? Te(r) : g(n.source);
}
function Ce() {
  const r = {};
  function e() {
    ne(() => {
      for (var s in r) r[s].unsubscribe();
      te(r, M, { enumerable: !1, value: !0 });
    });
  }
  return [r, e];
}
function Me(r) {
  var e = E;
  try {
    return ((E = !1), [r(), E]);
  } finally {
    E = e;
  }
}
var d, h, l, b, x, y, A;
class Be {
  constructor(e, s = !0) {
    U(this, "anchor");
    v(this, d, new Map());
    v(this, h, new Map());
    v(this, l, new Map());
    v(this, b, new Set());
    v(this, x, !0);
    v(this, y, (e) => {
      if (t(this, d).has(e)) {
        var s = t(this, d).get(e),
          n = t(this, h).get(s);
        if (n) (ae(n), t(this, b).delete(s));
        else {
          var i = t(this, l).get(s);
          i &&
            (t(this, h).set(s, i.effect),
            t(this, l).delete(s),
            i.fragment.lastChild.remove(),
            this.anchor.before(i.fragment),
            (n = i.effect));
        }
        for (const [a, f] of t(this, d)) {
          if ((t(this, d).delete(a), a === e)) break;
          const u = t(this, l).get(f);
          u && (R(u.effect), t(this, l).delete(f));
        }
        for (const [a, f] of t(this, h)) {
          if (a === s || t(this, b).has(a)) continue;
          const u = () => {
            if (Array.from(t(this, d).values()).includes(a)) {
              var p = document.createDocumentFragment();
              (oe(f, p),
                p.append(C()),
                t(this, l).set(a, { effect: f, fragment: p }));
            } else R(f);
            (t(this, b).delete(a), t(this, h).delete(a));
          };
          t(this, x) || !n ? (t(this, b).add(a), ue(f, u, !1)) : u();
        }
      }
    });
    v(this, A, (e) => {
      t(this, d).delete(e);
      const s = Array.from(t(this, d).values());
      for (const [n, i] of t(this, l))
        s.includes(n) || (R(i.effect), t(this, l).delete(n));
    });
    ((this.anchor = e), Y(this, x, s));
  }
  ensure(e, s) {
    var n = fe,
      i = ce();
    if (s && !t(this, h).has(e) && !t(this, l).has(e))
      if (i) {
        var a = document.createDocumentFragment(),
          f = C();
        (a.append(f),
          t(this, l).set(e, { effect: $(() => s(f)), fragment: a }));
      } else
        t(this, h).set(
          e,
          $(() => s(this.anchor)),
        );
    if ((t(this, d).set(n, e), i)) {
      for (const [u, o] of t(this, h))
        u === e ? n.unskip_effect(o) : n.skip_effect(o);
      for (const [u, o] of t(this, l))
        u === e ? n.unskip_effect(o.effect) : n.skip_effect(o.effect);
      (n.oncommit(t(this, y)), n.ondiscard(t(this, A)));
    } else (D && (this.anchor = H), t(this, y).call(this, n));
  }
}
((d = new WeakMap()),
  (h = new WeakMap()),
  (l = new WeakMap()),
  (b = new WeakMap()),
  (x = new WeakMap()),
  (y = new WeakMap()),
  (A = new WeakMap()));
function $e(r, e, s = !1) {
  var n;
  D && ((n = H), de());
  var i = new Be(r),
    a = s ? pe : 0;
  function f(u, o) {
    if (D) {
      var p = he(n);
      if (u !== parseInt(p.substring(1))) {
        var _ = _e();
        (ve(_), (i.anchor = _), z(!1), i.ensure(u, o), z(!0));
        return;
      }
    }
    i.ensure(u, o);
  }
  le(() => {
    var u = !1;
    (e((o, p = 0) => {
      ((u = !0), f(p, o));
    }),
      u || f(-1, null));
  }, a);
}
const Le = {
  get(r, e) {
    if (!r.exclude.includes(e)) return r.props[e];
  },
  set(r, e) {
    return !1;
  },
  getOwnPropertyDescriptor(r, e) {
    if (!r.exclude.includes(e) && e in r.props)
      return { enumerable: !0, configurable: !0, value: r.props[e] };
  },
  has(r, e) {
    return r.exclude.includes(e) ? !1 : e in r.props;
  },
  ownKeys(r) {
    return Reflect.ownKeys(r.props).filter((e) => !r.exclude.includes(e));
  },
};
function ze(r, e, s) {
  return new Proxy({ props: r, exclude: e }, Le);
}
const Ne = {
  get(r, e) {
    if (!r.exclude.includes(e))
      return (g(r.version), e in r.special ? r.special[e]() : r.props[e]);
  },
  set(r, e, s) {
    if (!(e in r.special)) {
      var n = B;
      try {
        (G(r.parent_effect),
          (r.special[e] = Ke(
            {
              get [e]() {
                return r.props[e];
              },
            },
            e,
            J,
          )));
      } finally {
        G(n);
      }
    }
    return (r.special[e](s), Z(r.version), !0);
  },
  getOwnPropertyDescriptor(r, e) {
    if (!r.exclude.includes(e) && e in r.props)
      return { enumerable: !0, configurable: !0, value: r.props[e] };
  },
  deleteProperty(r, e) {
    return (r.exclude.includes(e) || (r.exclude.push(e), Z(r.version)), !0);
  },
  has(r, e) {
    return r.exclude.includes(e) ? !1 : e in r.props;
  },
  ownKeys(r) {
    return Reflect.ownKeys(r.props).filter((e) => !r.exclude.includes(e));
  },
};
function Ze(r, e) {
  return new Proxy(
    { props: r, exclude: e, special: {}, version: be(0), parent_effect: B },
    Ne,
  );
}
const je = {
  get(r, e) {
    let s = r.props.length;
    for (; s--; ) {
      let n = r.props[s];
      if ((S(n) && (n = n()), typeof n == "object" && n !== null && e in n))
        return n[e];
    }
  },
  set(r, e, s) {
    let n = r.props.length;
    for (; n--; ) {
      let i = r.props[n];
      S(i) && (i = i());
      const a = T(i, e);
      if (a && a.set) return (a.set(s), !0);
    }
    return !1;
  },
  getOwnPropertyDescriptor(r, e) {
    let s = r.props.length;
    for (; s--; ) {
      let n = r.props[s];
      if ((S(n) && (n = n()), typeof n == "object" && n !== null && e in n)) {
        const i = T(n, e);
        return (i && !i.configurable && (i.configurable = !0), i);
      }
    }
  },
  has(r, e) {
    if (e === Q || e === W) return !1;
    for (let s of r.props)
      if ((S(s) && (s = s()), s != null && e in s)) return !0;
    return !1;
  },
  ownKeys(r) {
    const e = [];
    for (let s of r.props)
      if ((S(s) && (s = s()), !!s)) {
        for (const n in s) e.includes(n) || e.push(n);
        for (const n of Object.getOwnPropertySymbols(s))
          e.includes(n) || e.push(n);
      }
    return e;
  },
};
function Ge(...r) {
  return new Proxy({ props: r }, je);
}
function Ke(r, e, s, n) {
  var N;
  var i = !ye || (s & Oe) !== 0,
    a = (s & ge) !== 0,
    f = (s & Re) !== 0,
    u = n,
    o = !0,
    p = () => (o && ((o = !1), (u = f ? xe(n) : n)), u);
  let _;
  if (a) {
    var X = Q in r || W in r;
    _ =
      ((N = T(r, e)) == null ? void 0 : N.set) ??
      (X && e in r ? (c) => (r[e] = c) : void 0);
  }
  var w,
    L = !1;
  (a ? ([w, L] = Me(() => r[e])) : (w = r[e]),
    w === void 0 && n !== void 0 && ((w = p()), _ && (i && me(), _(w))));
  var m;
  if (
    (i
      ? (m = () => {
          var c = r[e];
          return c === void 0 ? p() : ((o = !0), c);
        })
      : (m = () => {
          var c = r[e];
          return (c !== void 0 && (u = void 0), c === void 0 ? u : c);
        }),
    i && (s & J) === 0)
  )
    return m;
  if (_) {
    var k = r.$$legacy;
    return function (c, O) {
      return arguments.length > 0
        ? ((!i || !O || k || L) && _(O ? m() : c), c)
        : m();
    };
  }
  var I = !1,
    P = ((s & Ee) !== 0 ? Ae : Ie)(() => ((I = !1), m()));
  a && g(P);
  var ee = B;
  return function (c, O) {
    if (arguments.length > 0) {
      const j = O ? g(P) : i && a ? we(c) : c;
      return (V(P, j), (I = !0), u !== void 0 && (u = j), c);
    }
    return (Pe && I) || (ee.f & Se) !== 0 ? P.v : g(P);
  };
}
export {
  Be as B,
  Ce as a,
  qe as b,
  $e as i,
  Ze as l,
  Ke as p,
  ze as r,
  Ge as s,
};
