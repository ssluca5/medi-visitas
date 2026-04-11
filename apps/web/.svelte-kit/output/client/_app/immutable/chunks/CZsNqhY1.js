var Nn = Object.defineProperty;
var xt = (e) => {
  throw TypeError(e);
};
var Rn = (e, t, n) =>
  t in e
    ? Nn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var ue = (e, t, n) => Rn(e, typeof t != "symbol" ? t + "" : t, n),
  rt = (e, t, n) => t.has(e) || xt("Cannot " + n);
var u = (e, t, n) => (
    rt(e, t, "read from private field"),
    n ? n.call(e) : t.get(e)
  ),
  I = (e, t, n) =>
    t.has(e)
      ? xt("Cannot add the same private member more than once")
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, n),
  Ne = (e, t, n, r) => (
    rt(e, t, "write to private field"),
    r ? r.call(e, n) : t.set(e, n),
    n
  ),
  D = (e, t, n) => (rt(e, t, "access private method"), n);
var On = Array.isArray,
  xn = Array.prototype.indexOf,
  ke = Array.prototype.includes,
  Or = Array.from,
  xr = Object.defineProperty,
  Fe = Object.getOwnPropertyDescriptor,
  In = Object.getOwnPropertyDescriptors,
  kn = Object.prototype,
  Dn = Array.prototype,
  qt = Object.getPrototypeOf,
  It = Object.isExtensible;
function Ir(e) {
  return typeof e == "function";
}
const Cn = () => {};
function kr(e) {
  return e();
}
function Pn(e) {
  for (var t = 0; t < e.length; t++) e[t]();
}
function Ut() {
  var e,
    t,
    n = new Promise((r, s) => {
      ((e = r), (t = s));
    });
  return { promise: n, resolve: e, reject: t };
}
function Dr(e, t) {
  if (Array.isArray(e)) return e;
  if (!(Symbol.iterator in e)) return Array.from(e);
  const n = [];
  for (const r of e) if ((n.push(r), n.length === t)) break;
  return n;
}
const T = 2,
  we = 4,
  qe = 8,
  pt = 1 << 24,
  Q = 16,
  W = 32,
  ye = 64,
  Mn = 128,
  L = 512,
  E = 1024,
  O = 2048,
  G = 4096,
  V = 8192,
  B = 16384,
  fe = 32768,
  kt = 1 << 25,
  We = 65536,
  lt = 1 << 17,
  Fn = 1 << 18,
  Ue = 1 << 19,
  Vt = 1 << 20,
  Cr = 1 << 25,
  ge = 65536,
  ft = 1 << 21,
  et = 1 << 22,
  se = 1 << 23,
  he = Symbol("$state"),
  Pr = Symbol("legacy props"),
  Mr = Symbol(""),
  X = new (class extends Error {
    constructor() {
      super(...arguments);
      ue(this, "name", "StaleReactionError");
      ue(
        this,
        "message",
        "The reaction that called `getAbortSignal()` was re-run or destroyed",
      );
    }
  })();
var Ht;
const Lr =
    !!((Ht = globalThis.document) != null && Ht.contentType) &&
    globalThis.document.contentType.includes("xml"),
  jr = 1,
  Ve = 3,
  Bt = 8;
function Ln() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Hr(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function jn(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Hn() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Yn(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function qn() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Yr() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function qr(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Un() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Vn() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Bn() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ur() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Vr = 1,
  Br = 2,
  Gr = 4,
  $r = 8,
  zr = 16,
  Kr = 1,
  Wr = 2,
  Xr = 4,
  Zr = 8,
  Jr = 16,
  Qr = 1,
  es = 2,
  ts = 4,
  Gt = 1,
  Gn = 2,
  $n = "[",
  zn = "[!",
  ns = "[?",
  Kn = "]",
  wt = {},
  A = Symbol(),
  Wn = "http://www.w3.org/1999/xhtml",
  rs = "http://www.w3.org/2000/svg",
  ss = "@attach";
function yt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function as() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function is() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let M = !1;
function ls(e) {
  M = e;
}
let g;
function me(e) {
  if (e === null) throw (yt(), wt);
  return (g = e);
}
function Xn() {
  return me(oe(g));
}
function fs(e) {
  if (M) {
    if (oe(g) !== null) throw (yt(), wt);
    g = e;
  }
}
function os(e = 1) {
  if (M) {
    for (var t = e, n = g; t--; ) n = oe(n);
    g = n;
  }
}
function us(e = !0) {
  for (var t = 0, n = g; ; ) {
    if (n.nodeType === Bt) {
      var r = n.data;
      if (r === Kn) {
        if (t === 0) return n;
        t -= 1;
      } else
        (r === $n ||
          r === zn ||
          (r[0] === "[" && !isNaN(Number(r.slice(1))))) &&
          (t += 1);
    }
    var s = oe(n);
    (e && n.remove(), (n = s));
  }
}
function cs(e) {
  if (!e || e.nodeType !== Bt) throw (yt(), wt);
  return e.data;
}
function $t(e) {
  return e === this.v;
}
function Zn(e, t) {
  return e != e
    ? t == t
    : e !== t || (e !== null && typeof e == "object") || typeof e == "function";
}
function zt(e) {
  return !Zn(e, this.v);
}
let tt = !1;
function _s() {
  tt = !0;
}
let N = null;
function Xe(e) {
  N = e;
}
function vs(e, t = !1, n) {
  N = {
    p: N,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: y,
    l: tt && !t ? { s: null, u: null, $: [] } : null,
  };
}
function ds(e) {
  var t = N,
    n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n) _n(r);
  }
  return ((t.i = !0), (N = t.p), {});
}
function Be() {
  return !tt || (N !== null && N.l === null);
}
let ce = [];
function Kt() {
  var e = ce;
  ((ce = []), Pn(e));
}
function ot(e) {
  if (ce.length === 0 && !Le) {
    var t = ce;
    queueMicrotask(() => {
      t === ce && Kt();
    });
  }
  ce.push(e);
}
function Jn() {
  for (; ce.length > 0; ) Kt();
}
function Qn(e) {
  var t = y;
  if (t === null) return ((p.f |= se), e);
  if ((t.f & fe) === 0 && (t.f & we) === 0) throw e;
  Ze(e, t);
}
function Ze(e, t) {
  for (; t !== null; ) {
    if ((t.f & Mn) !== 0) {
      if ((t.f & fe) === 0) throw e;
      try {
        t.b.error(e);
        return;
      } catch (n) {
        e = n;
      }
    }
    t = t.parent;
  }
  throw e;
}
const er = -7169;
function m(e, t) {
  e.f = (e.f & er) | t;
}
function gt(e) {
  (e.f & L) !== 0 || e.deps === null ? m(e, E) : m(e, G);
}
function Wt(e) {
  if (e !== null)
    for (const t of e)
      (t.f & T) === 0 || (t.f & ge) === 0 || ((t.f ^= ge), Wt(t.deps));
}
function tr(e, t, n) {
  ((e.f & O) !== 0 ? t.add(e) : (e.f & G) !== 0 && n.add(e),
    Wt(e.deps),
    m(e, E));
}
const ee = new Set();
let w = null,
  S = null,
  ut = null,
  Le = !1,
  st = !1,
  Re = null,
  Ge = null;
var Dt = 0;
let nr = 1;
var Oe, xe, Z, $, He, P, Ye, re, J, z, Ie, de, b, $e, Xt, ze, ct, _t, Zt;
const Qe = class Qe {
  constructor() {
    I(this, b);
    ue(this, "id", nr++);
    ue(this, "current", new Map());
    ue(this, "previous", new Map());
    I(this, Oe, new Set());
    I(this, xe, new Set());
    I(this, Z, new Map());
    I(this, $, new Map());
    I(this, He, null);
    I(this, P, []);
    I(this, Ye, []);
    I(this, re, new Set());
    I(this, J, new Set());
    I(this, z, new Map());
    ue(this, "is_fork", !1);
    I(this, Ie, !1);
    I(this, de, new Set());
  }
  skip_effect(t) {
    u(this, z).has(t) || u(this, z).set(t, { d: [], m: [] });
  }
  unskip_effect(t) {
    var n = u(this, z).get(t);
    if (n) {
      u(this, z).delete(t);
      for (var r of n.d) (m(r, O), this.schedule(r));
      for (r of n.m) (m(r, G), this.schedule(r));
    }
  }
  capture(t, n, r = !1) {
    (n !== A && !this.previous.has(t) && this.previous.set(t, n),
      (t.f & se) === 0 &&
        (this.current.set(t, [t.v, r]), S == null || S.set(t, t.v)));
  }
  activate() {
    w = this;
  }
  deactivate() {
    ((w = null), (S = null));
  }
  flush() {
    try {
      ((st = !0), (w = this), D(this, b, ze).call(this));
    } finally {
      ((Dt = 0),
        (ut = null),
        (Re = null),
        (Ge = null),
        (st = !1),
        (w = null),
        (S = null),
        ae.clear());
    }
  }
  discard() {
    for (const t of u(this, xe)) t(this);
    (u(this, xe).clear(), ee.delete(this));
  }
  register_created_effect(t) {
    u(this, Ye).push(t);
  }
  increment(t, n) {
    let r = u(this, Z).get(n) ?? 0;
    if ((u(this, Z).set(n, r + 1), t)) {
      let s = u(this, $).get(n) ?? 0;
      u(this, $).set(n, s + 1);
    }
  }
  decrement(t, n, r) {
    let s = u(this, Z).get(n) ?? 0;
    if ((s === 1 ? u(this, Z).delete(n) : u(this, Z).set(n, s - 1), t)) {
      let a = u(this, $).get(n) ?? 0;
      a === 1 ? u(this, $).delete(n) : u(this, $).set(n, a - 1);
    }
    u(this, Ie) ||
      r ||
      (Ne(this, Ie, !0),
      ot(() => {
        (Ne(this, Ie, !1), this.flush());
      }));
  }
  transfer_effects(t, n) {
    for (const r of t) u(this, re).add(r);
    for (const r of n) u(this, J).add(r);
    (t.clear(), n.clear());
  }
  oncommit(t) {
    u(this, Oe).add(t);
  }
  ondiscard(t) {
    u(this, xe).add(t);
  }
  settled() {
    return (u(this, He) ?? Ne(this, He, Ut())).promise;
  }
  static ensure() {
    if (w === null) {
      const t = (w = new Qe());
      st ||
        (ee.add(w),
        Le ||
          ot(() => {
            w === t && t.flush();
          }));
    }
    return w;
  }
  apply() {
    {
      S = null;
      return;
    }
  }
  schedule(t) {
    var s;
    if (
      ((ut = t),
      (s = t.b) != null &&
        s.is_pending &&
        (t.f & (we | qe | pt)) !== 0 &&
        (t.f & fe) === 0)
    ) {
      t.b.defer_effect(t);
      return;
    }
    for (var n = t; n.parent !== null; ) {
      n = n.parent;
      var r = n.f;
      if (Re !== null && n === y && (p === null || (p.f & T) === 0)) return;
      if ((r & (ye | W)) !== 0) {
        if ((r & E) === 0) return;
        n.f ^= E;
      }
    }
    u(this, P).push(n);
  }
};
((Oe = new WeakMap()),
  (xe = new WeakMap()),
  (Z = new WeakMap()),
  ($ = new WeakMap()),
  (He = new WeakMap()),
  (P = new WeakMap()),
  (Ye = new WeakMap()),
  (re = new WeakMap()),
  (J = new WeakMap()),
  (z = new WeakMap()),
  (Ie = new WeakMap()),
  (de = new WeakMap()),
  (b = new WeakSet()),
  ($e = function () {
    return this.is_fork || u(this, $).size > 0;
  }),
  (Xt = function () {
    for (const r of u(this, de))
      for (const s of u(r, $).keys()) {
        for (var t = !1, n = s; n.parent !== null; ) {
          if (u(this, z).has(n)) {
            t = !0;
            break;
          }
          n = n.parent;
        }
        if (!t) return !0;
      }
    return !1;
  }),
  (ze = function () {
    var o, l;
    if ((Dt++ > 1e3 && (ee.delete(this), sr()), !D(this, b, $e).call(this))) {
      for (const i of u(this, re))
        (u(this, J).delete(i), m(i, O), this.schedule(i));
      for (const i of u(this, J)) (m(i, G), this.schedule(i));
    }
    const t = u(this, P);
    (Ne(this, P, []), this.apply());
    var n = (Re = []),
      r = [],
      s = (Ge = []);
    for (const i of t)
      try {
        D(this, b, ct).call(this, i, n, r);
      } catch (c) {
        throw (en(i), c);
      }
    if (((w = null), s.length > 0)) {
      var a = Qe.ensure();
      for (const i of s) a.schedule(i);
    }
    if (
      ((Re = null),
      (Ge = null),
      D(this, b, $e).call(this) || D(this, b, Xt).call(this))
    ) {
      (D(this, b, _t).call(this, r), D(this, b, _t).call(this, n));
      for (const [i, c] of u(this, z)) Qt(i, c);
    } else {
      (u(this, Z).size === 0 && ee.delete(this),
        u(this, re).clear(),
        u(this, J).clear());
      for (const i of u(this, Oe)) i(this);
      (u(this, Oe).clear(),
        Ct(r),
        Ct(n),
        (o = u(this, He)) == null || o.resolve());
    }
    var f = w;
    if (u(this, P).length > 0) {
      const i = f ?? (f = this);
      u(i, P).push(...u(this, P).filter((c) => !u(i, P).includes(c)));
    }
    (f !== null && (ee.add(f), D((l = f), b, ze).call(l)),
      ee.has(this) || D(this, b, Zt).call(this));
  }),
  (ct = function (t, n, r) {
    t.f ^= E;
    for (var s = t.first; s !== null; ) {
      var a = s.f,
        f = (a & (W | ye)) !== 0,
        o = f && (a & E) !== 0,
        l = o || (a & V) !== 0 || u(this, z).has(s);
      if (!l && s.fn !== null) {
        f
          ? (s.f ^= E)
          : (a & we) !== 0
            ? n.push(s)
            : De(s) && ((a & Q) !== 0 && u(this, J).add(s), Se(s));
        var i = s.first;
        if (i !== null) {
          s = i;
          continue;
        }
      }
      for (; s !== null; ) {
        var c = s.next;
        if (c !== null) {
          s = c;
          break;
        }
        s = s.parent;
      }
    }
  }),
  (_t = function (t) {
    for (var n = 0; n < t.length; n += 1) tr(t[n], u(this, re), u(this, J));
  }),
  (Zt = function () {
    var c, d, v;
    for (const h of ee) {
      var t = h.id < this.id,
        n = [];
      for (const [_, [x, R]] of this.current) {
        if (h.current.has(_)) {
          var r = h.current.get(_)[0];
          if (t && x !== r) h.current.set(_, [x, R]);
          else continue;
        }
        n.push(_);
      }
      var s = [...h.current.keys()].filter((_) => !this.current.has(_));
      if (s.length === 0) t && h.discard();
      else if (n.length > 0) {
        h.activate();
        var a = new Set(),
          f = new Map();
        for (var o of n) Jt(o, s, a, f);
        f = new Map();
        var l = [...h.current.keys()].filter((_) =>
          this.current.has(_) ? this.current.get(_)[0] !== _ : !0,
        );
        for (const _ of u(this, Ye))
          (_.f & (B | V | lt)) === 0 &&
            mt(_, l, f) &&
            ((_.f & (et | Q)) !== 0
              ? (m(_, O), h.schedule(_))
              : u(h, re).add(_));
        if (u(h, P).length > 0) {
          h.apply();
          for (var i of u(h, P)) D((c = h), b, ct).call(c, i, [], []);
          Ne(h, P, []);
        }
        h.deactivate();
      }
    }
    for (const h of ee)
      u(h, de).has(this) &&
        (u(h, de).delete(this),
        u(h, de).size === 0 &&
          !D((d = h), b, $e).call(d) &&
          (h.activate(), D((v = h), b, ze).call(v)));
  }));
let Ee = Qe;
function rr(e) {
  var t = Le;
  Le = !0;
  try {
    for (var n; ; ) {
      if ((Jn(), w === null)) return n;
      w.flush();
    }
  } finally {
    Le = t;
  }
}
function sr() {
  try {
    qn();
  } catch (e) {
    Ze(e, ut);
  }
}
let Y = null;
function Ct(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if (
        (r.f & (B | V)) === 0 &&
        De(r) &&
        ((Y = new Set()),
        Se(r),
        r.deps === null &&
          r.first === null &&
          r.nodes === null &&
          r.teardown === null &&
          r.ac === null &&
          hn(r),
        (Y == null ? void 0 : Y.size) > 0)
      ) {
        ae.clear();
        for (const s of Y) {
          if ((s.f & (B | V)) !== 0) continue;
          const a = [s];
          let f = s.parent;
          for (; f !== null; )
            (Y.has(f) && (Y.delete(f), a.push(f)), (f = f.parent));
          for (let o = a.length - 1; o >= 0; o--) {
            const l = a[o];
            (l.f & (B | V)) === 0 && Se(l);
          }
        }
        Y.clear();
      }
    }
    Y = null;
  }
}
function Jt(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const s of e.reactions) {
      const a = s.f;
      (a & T) !== 0
        ? Jt(s, t, n, r)
        : (a & (et | Q)) !== 0 &&
          (a & O) === 0 &&
          mt(s, t, r) &&
          (m(s, O), Et(s));
    }
}
function mt(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const s of e.deps) {
      if (ke.call(t, s)) return !0;
      if ((s.f & T) !== 0 && mt(s, t, n)) return (n.set(s, !0), !0);
    }
  return (n.set(e, !1), !1);
}
function Et(e) {
  w.schedule(e);
}
function Qt(e, t) {
  if (!((e.f & W) !== 0 && (e.f & E) !== 0)) {
    ((e.f & O) !== 0 ? t.d.push(e) : (e.f & G) !== 0 && t.m.push(e), m(e, E));
    for (var n = e.first; n !== null; ) (Qt(n, t), (n = n.next));
  }
}
function en(e) {
  m(e, E);
  for (var t = e.first; t !== null; ) (en(t), (t = t.next));
}
function tn(e, t, n, r) {
  const s = Be() ? Tt : lr;
  var a = e.filter((v) => !v.settled);
  if (n.length === 0 && a.length === 0) {
    r(t.map(s));
    return;
  }
  var f = y,
    o = ar(),
    l =
      a.length === 1
        ? a[0].promise
        : a.length > 1
          ? Promise.all(a.map((v) => v.promise))
          : null;
  function i(v) {
    o();
    try {
      r(v);
    } catch (h) {
      (f.f & B) === 0 && Ze(h, f);
    }
    Je();
  }
  if (n.length === 0) {
    l.then(() => i(t.map(s)));
    return;
  }
  var c = bt();
  function d() {
    Promise.all(n.map((v) => ir(v)))
      .then((v) => i([...t.map(s), ...v]))
      .catch((v) => Ze(v, f))
      .finally(() => c());
  }
  l
    ? l.then(() => {
        (o(), d(), Je());
      })
    : d();
}
function ar() {
  var e = y,
    t = p,
    n = N,
    r = w;
  return function (a = !0) {
    (le(e),
      ie(t),
      Xe(n),
      a &&
        (e.f & B) === 0 &&
        (r == null || r.activate(), r == null || r.apply()));
  };
}
function Je(e = !0) {
  (le(null), ie(null), Xe(null), e && (w == null || w.deactivate()));
}
function bt() {
  var e = y,
    t = e.b,
    n = w,
    r = t.is_rendered();
  return (
    t.update_pending_count(1, n),
    n.increment(r, e),
    (s = !1) => {
      (t.update_pending_count(-1, n), n.decrement(r, e, s));
    }
  );
}
function Tt(e) {
  var t = T | O,
    n = p !== null && (p.f & T) !== 0 ? p : null;
  return (
    y !== null && (y.f |= Ue),
    {
      ctx: N,
      deps: null,
      effects: null,
      equals: $t,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: A,
      wv: 0,
      parent: n ?? y,
      ac: null,
    }
  );
}
function ir(e, t, n) {
  let r = y;
  r === null && Ln();
  var s = void 0,
    a = St(A),
    f = !p,
    o = new Map();
  return (
    yr(() => {
      var h;
      var l = y,
        i = Ut();
      s = i.promise;
      try {
        Promise.resolve(e()).then(i.resolve, i.reject).finally(Je);
      } catch (_) {
        (i.reject(_), Je());
      }
      var c = w;
      if (f) {
        if ((l.f & fe) !== 0) var d = bt();
        if (r.b.is_rendered())
          ((h = o.get(c)) == null || h.reject(X), o.delete(c));
        else {
          for (const _ of o.values()) _.reject(X);
          o.clear();
        }
        o.set(c, i);
      }
      const v = (_, x = void 0) => {
        if (d) {
          var R = x === X;
          d(R);
        }
        if (!(x === X || (l.f & B) !== 0)) {
          if ((c.activate(), x)) ((a.f |= se), dt(a, x));
          else {
            ((a.f & se) !== 0 && (a.f ^= se), dt(a, _));
            for (const [Ce, Pe] of o) {
              if ((o.delete(Ce), Ce === c)) break;
              Pe.reject(X);
            }
          }
          c.deactivate();
        }
      };
      i.promise.then(v, (_) => v(null, _ || "unknown"));
    }),
    wr(() => {
      for (const l of o.values()) l.reject(X);
    }),
    new Promise((l) => {
      function i(c) {
        function d() {
          c === s ? l(a) : i(s);
        }
        c.then(d, d);
      }
      i(s);
    })
  );
}
function hs(e) {
  const t = Tt(e);
  return (yn(t), t);
}
function lr(e) {
  const t = Tt(e);
  return ((t.equals = zt), t);
}
function fr(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1) Te(t[n]);
  }
}
function or(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & T) === 0) return (t.f & B) === 0 ? t : null;
    t = t.parent;
  }
  return null;
}
function At(e) {
  var t,
    n = y;
  le(or(e));
  try {
    ((e.f &= ~ge), fr(e), (t = bn(e)));
  } finally {
    le(n);
  }
  return t;
}
function nn(e) {
  var t = e.v,
    n = At(e);
  if (
    !e.equals(n) &&
    ((e.wv = mn()),
    (!(w != null && w.is_fork) || e.deps === null) &&
      ((e.v = n), w == null || w.capture(e, t, !0), e.deps === null))
  ) {
    m(e, E);
    return;
  }
  Ae ||
    (S !== null ? (cn() || (w != null && w.is_fork)) && S.set(e, n) : gt(e));
}
function ur(e) {
  var t, n;
  if (e.effects !== null)
    for (const r of e.effects)
      (r.teardown || r.ac) &&
        ((t = r.teardown) == null || t.call(r),
        (n = r.ac) == null || n.abort(X),
        (r.teardown = Cn),
        (r.ac = null),
        je(r, 0),
        Rt(r));
}
function rn(e) {
  if (e.effects !== null) for (const t of e.effects) t.teardown && Se(t);
}
let vt = new Set();
const ae = new Map();
let sn = !1;
function St(e, t) {
  var n = { f: 0, v: e, reactions: null, equals: $t, rv: 0, wv: 0 };
  return n;
}
function te(e, t) {
  const n = St(e);
  return (yn(n), n);
}
function ps(e, t = !1, n = !0) {
  var s;
  const r = St(e);
  return (
    t || (r.equals = zt),
    tt &&
      n &&
      N !== null &&
      N.l !== null &&
      ((s = N.l).s ?? (s.s = [])).push(r),
    r
  );
}
function ne(e, t, n = !1) {
  p !== null &&
    (!U || (p.f & lt) !== 0) &&
    Be() &&
    (p.f & (T | Q | et | lt)) !== 0 &&
    (j === null || !ke.call(j, e)) &&
    Bn();
  let r = n ? Me(t) : t;
  return dt(e, r, Ge);
}
function dt(e, t, n = null) {
  if (!e.equals(t)) {
    var r = e.v;
    (Ae ? ae.set(e, t) : ae.set(e, r), (e.v = t));
    var s = Ee.ensure();
    if ((s.capture(e, r), (e.f & T) !== 0)) {
      const a = e;
      ((e.f & O) !== 0 && At(a), S === null && gt(a));
    }
    ((e.wv = mn()),
      an(e, O, n),
      Be() &&
        y !== null &&
        (y.f & E) !== 0 &&
        (y.f & (W | ye)) === 0 &&
        (F === null ? br([e]) : F.push(e)),
      !s.is_fork && vt.size > 0 && !sn && cr());
  }
  return t;
}
function cr() {
  sn = !1;
  for (const e of vt) ((e.f & E) !== 0 && m(e, G), De(e) && Se(e));
  vt.clear();
}
function ws(e, t = 1) {
  var n = ve(e),
    r = t === 1 ? n++ : n--;
  return (ne(e, n), r);
}
function at(e) {
  ne(e, e.v + 1);
}
function an(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var s = Be(), a = r.length, f = 0; f < a; f++) {
      var o = r[f],
        l = o.f;
      if (!(!s && o === y)) {
        var i = (l & O) === 0;
        if ((i && m(o, t), (l & T) !== 0)) {
          var c = o;
          (S == null || S.delete(c),
            (l & ge) === 0 && (l & L && (o.f |= ge), an(c, G, n)));
        } else if (i) {
          var d = o;
          ((l & Q) !== 0 && Y !== null && Y.add(d),
            n !== null ? n.push(d) : Et(d));
        }
      }
    }
}
function Me(e) {
  if (typeof e != "object" || e === null || he in e) return e;
  const t = qt(e);
  if (t !== kn && t !== Dn) return e;
  var n = new Map(),
    r = On(e),
    s = te(0),
    a = pe,
    f = (o) => {
      if (pe === a) return o();
      var l = p,
        i = pe;
      (ie(null), jt(a));
      var c = o();
      return (ie(l), jt(i), c);
    };
  return (
    r && n.set("length", te(e.length)),
    new Proxy(e, {
      defineProperty(o, l, i) {
        (!("value" in i) ||
          i.configurable === !1 ||
          i.enumerable === !1 ||
          i.writable === !1) &&
          Un();
        var c = n.get(l);
        return (
          c === void 0
            ? f(() => {
                var d = te(i.value);
                return (n.set(l, d), d);
              })
            : ne(c, i.value, !0),
          !0
        );
      },
      deleteProperty(o, l) {
        var i = n.get(l);
        if (i === void 0) {
          if (l in o) {
            const c = f(() => te(A));
            (n.set(l, c), at(s));
          }
        } else (ne(i, A), at(s));
        return !0;
      },
      get(o, l, i) {
        var h;
        if (l === he) return e;
        var c = n.get(l),
          d = l in o;
        if (
          (c === void 0 &&
            (!d || ((h = Fe(o, l)) != null && h.writable)) &&
            ((c = f(() => {
              var _ = Me(d ? o[l] : A),
                x = te(_);
              return x;
            })),
            n.set(l, c)),
          c !== void 0)
        ) {
          var v = ve(c);
          return v === A ? void 0 : v;
        }
        return Reflect.get(o, l, i);
      },
      getOwnPropertyDescriptor(o, l) {
        var i = Reflect.getOwnPropertyDescriptor(o, l);
        if (i && "value" in i) {
          var c = n.get(l);
          c && (i.value = ve(c));
        } else if (i === void 0) {
          var d = n.get(l),
            v = d == null ? void 0 : d.v;
          if (d !== void 0 && v !== A)
            return { enumerable: !0, configurable: !0, value: v, writable: !0 };
        }
        return i;
      },
      has(o, l) {
        var v;
        if (l === he) return !0;
        var i = n.get(l),
          c = (i !== void 0 && i.v !== A) || Reflect.has(o, l);
        if (
          i !== void 0 ||
          (y !== null && (!c || ((v = Fe(o, l)) != null && v.writable)))
        ) {
          i === void 0 &&
            ((i = f(() => {
              var h = c ? Me(o[l]) : A,
                _ = te(h);
              return _;
            })),
            n.set(l, i));
          var d = ve(i);
          if (d === A) return !1;
        }
        return c;
      },
      set(o, l, i, c) {
        var Ot;
        var d = n.get(l),
          v = l in o;
        if (r && l === "length")
          for (var h = i; h < d.v; h += 1) {
            var _ = n.get(h + "");
            _ !== void 0
              ? ne(_, A)
              : h in o && ((_ = f(() => te(A))), n.set(h + "", _));
          }
        if (d === void 0)
          (!v || ((Ot = Fe(o, l)) != null && Ot.writable)) &&
            ((d = f(() => te(void 0))), ne(d, Me(i)), n.set(l, d));
        else {
          v = d.v !== A;
          var x = f(() => Me(i));
          ne(d, x);
        }
        var R = Reflect.getOwnPropertyDescriptor(o, l);
        if ((R != null && R.set && R.set.call(c, i), !v)) {
          if (r && typeof l == "string") {
            var Ce = n.get("length"),
              Pe = Number(l);
            Number.isInteger(Pe) && Pe >= Ce.v && ne(Ce, Pe + 1);
          }
          at(s);
        }
        return !0;
      },
      ownKeys(o) {
        ve(s);
        var l = Reflect.ownKeys(o).filter((d) => {
          var v = n.get(d);
          return v === void 0 || v.v !== A;
        });
        for (var [i, c] of n) c.v !== A && !(i in o) && l.push(i);
        return l;
      },
      setPrototypeOf() {
        Vn();
      },
    })
  );
}
function Pt(e) {
  try {
    if (e !== null && typeof e == "object" && he in e) return e[he];
  } catch {}
  return e;
}
function ys(e, t) {
  return Object.is(Pt(e), Pt(t));
}
var Mt, _r, ln, fn, on;
function gs() {
  if (Mt === void 0) {
    ((Mt = window),
      (_r = document),
      (ln = /Firefox/.test(navigator.userAgent)));
    var e = Element.prototype,
      t = Node.prototype,
      n = Text.prototype;
    ((fn = Fe(t, "firstChild").get),
      (on = Fe(t, "nextSibling").get),
      It(e) &&
        ((e.__click = void 0),
        (e.__className = void 0),
        (e.__attributes = null),
        (e.__style = void 0),
        (e.__e = void 0)),
      It(n) && (n.__t = void 0));
  }
}
function be(e = "") {
  return document.createTextNode(e);
}
function q(e) {
  return fn.call(e);
}
function oe(e) {
  return on.call(e);
}
function ms(e, t) {
  if (!M) return q(e);
  var n = q(g);
  if (n === null) n = g.appendChild(be());
  else if (t && n.nodeType !== Ve) {
    var r = be();
    return (n == null || n.before(r), me(r), r);
  }
  return (t && nt(n), me(n), n);
}
function Es(e, t = !1) {
  if (!M) {
    var n = q(e);
    return n instanceof Comment && n.data === "" ? oe(n) : n;
  }
  if (t) {
    if ((g == null ? void 0 : g.nodeType) !== Ve) {
      var r = be();
      return (g == null || g.before(r), me(r), r);
    }
    nt(g);
  }
  return g;
}
function bs(e, t = 1, n = !1) {
  let r = M ? g : e;
  for (var s; t--; ) ((s = r), (r = oe(r)));
  if (!M) return r;
  if (n) {
    if ((r == null ? void 0 : r.nodeType) !== Ve) {
      var a = be();
      return (r === null ? s == null || s.after(a) : r.before(a), me(a), a);
    }
    nt(r);
  }
  return (me(r), r);
}
function vr(e) {
  e.textContent = "";
}
function Ts() {
  return !1;
}
function dr(e, t, n) {
  return document.createElementNS(t ?? Wn, e, void 0);
}
function nt(e) {
  if (e.nodeValue.length < 65536) return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === Ve; )
    (t.remove(), (e.nodeValue += t.nodeValue), (t = e.nextSibling));
}
function As(e, t) {
  if (t) {
    const n = document.body;
    ((e.autofocus = !0),
      ot(() => {
        document.activeElement === n && e.focus();
      }));
  }
}
function Ss(e) {
  M && q(e) !== null && vr(e);
}
let Ft = !1;
function hr() {
  Ft ||
    ((Ft = !0),
    document.addEventListener(
      "reset",
      (e) => {
        Promise.resolve().then(() => {
          var t;
          if (!e.defaultPrevented)
            for (const n of e.target.elements)
              (t = n.__on_r) == null || t.call(n);
        });
      },
      { capture: !0 },
    ));
}
function Nt(e) {
  var t = p,
    n = y;
  (ie(null), le(null));
  try {
    return e();
  } finally {
    (ie(t), le(n));
  }
}
function Ns(e, t, n, r = n) {
  e.addEventListener(t, () => Nt(n));
  const s = e.__on_r;
  (s
    ? (e.__on_r = () => {
        (s(), r(!0));
      })
    : (e.__on_r = () => r(!0)),
    hr());
}
function un(e) {
  (y === null && (p === null && Yn(), Hn()), Ae && jn());
}
function pr(e, t) {
  var n = t.last;
  n === null
    ? (t.last = t.first = e)
    : ((n.next = e), (e.prev = n), (t.last = e));
}
function H(e, t) {
  var n = y;
  n !== null && (n.f & V) !== 0 && (e |= V);
  var r = {
    ctx: N,
    deps: null,
    nodes: null,
    f: e | O | L,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null,
  };
  w == null || w.register_created_effect(r);
  var s = r;
  if ((e & we) !== 0) Re !== null ? Re.push(r) : Ee.ensure().schedule(r);
  else if (t !== null) {
    try {
      Se(r);
    } catch (f) {
      throw (Te(r), f);
    }
    s.deps === null &&
      s.teardown === null &&
      s.nodes === null &&
      s.first === s.last &&
      (s.f & Ue) === 0 &&
      ((s = s.first),
      (e & Q) !== 0 && (e & We) !== 0 && s !== null && (s.f |= We));
  }
  if (
    s !== null &&
    ((s.parent = n),
    n !== null && pr(s, n),
    p !== null && (p.f & T) !== 0 && (e & ye) === 0)
  ) {
    var a = p;
    (a.effects ?? (a.effects = [])).push(s);
  }
  return r;
}
function cn() {
  return p !== null && !U;
}
function wr(e) {
  const t = H(qe, null);
  return (m(t, E), (t.teardown = e), t);
}
function Rs(e) {
  un();
  var t = y.f,
    n = !p && (t & W) !== 0 && (t & fe) === 0;
  if (n) {
    var r = N;
    (r.e ?? (r.e = [])).push(e);
  } else return _n(e);
}
function _n(e) {
  return H(we | Vt, e);
}
function Os(e) {
  return (un(), H(qe | Vt, e));
}
function xs(e) {
  Ee.ensure();
  const t = H(ye | Ue, e);
  return (n = {}) =>
    new Promise((r) => {
      n.outro
        ? Er(t, () => {
            (Te(t), r(void 0));
          })
        : (Te(t), r(void 0));
    });
}
function Is(e) {
  return H(we, e);
}
function ks(e, t) {
  var n = N,
    r = { effect: null, ran: !1, deps: e };
  (n.l.$.push(r),
    (r.effect = vn(() => {
      if ((e(), !r.ran)) {
        r.ran = !0;
        var s = y;
        try {
          (le(s.parent), Ar(t));
        } finally {
          le(s);
        }
      }
    })));
}
function Ds() {
  var e = N;
  vn(() => {
    for (var t of e.l.$) {
      t.deps();
      var n = t.effect;
      ((n.f & E) !== 0 && n.deps !== null && m(n, G),
        De(n) && Se(n),
        (t.ran = !1));
    }
  });
}
function yr(e) {
  return H(et | Ue, e);
}
function vn(e, t = 0) {
  return H(qe | t, e);
}
function Cs(e, t = [], n = [], r = []) {
  tn(r, t, n, (s) => {
    H(qe, () => e(...s.map(ve)));
  });
}
function Ps(e, t = [], n = [], r = []) {
  if (n.length > 0 || r.length > 0) var s = bt();
  tn(r, t, n, (a) => {
    (H(we, () => e(...a.map(ve))), s && s());
  });
}
function Ms(e, t = 0) {
  var n = H(Q | t, e);
  return n;
}
function Fs(e, t = 0) {
  var n = H(pt | t, e);
  return n;
}
function Ls(e) {
  return H(W | Ue, e);
}
function dn(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Ae,
      r = p;
    (Lt(!0), ie(null));
    try {
      t.call(null);
    } finally {
      (Lt(n), ie(r));
    }
  }
}
function Rt(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const s = n.ac;
    s !== null &&
      Nt(() => {
        s.abort(X);
      });
    var r = n.next;
    ((n.f & ye) !== 0 ? (n.parent = null) : Te(n, t), (n = r));
  }
}
function gr(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    ((t.f & W) === 0 && Te(t), (t = n));
  }
}
function Te(e, t = !0) {
  var n = !1;
  ((t || (e.f & Fn) !== 0) &&
    e.nodes !== null &&
    e.nodes.end !== null &&
    (mr(e.nodes.start, e.nodes.end), (n = !0)),
    m(e, kt),
    Rt(e, t && !n),
    je(e, 0));
  var r = e.nodes && e.nodes.t;
  if (r !== null) for (const a of r) a.stop();
  (dn(e), (e.f ^= kt), (e.f |= B));
  var s = e.parent;
  (s !== null && s.first !== null && hn(e),
    (e.next =
      e.prev =
      e.teardown =
      e.ctx =
      e.deps =
      e.fn =
      e.nodes =
      e.ac =
      e.b =
        null));
}
function mr(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : oe(e);
    (e.remove(), (e = n));
  }
}
function hn(e) {
  var t = e.parent,
    n = e.prev,
    r = e.next;
  (n !== null && (n.next = r),
    r !== null && (r.prev = n),
    t !== null &&
      (t.first === e && (t.first = r), t.last === e && (t.last = n)));
}
function Er(e, t, n = !0) {
  var r = [];
  pn(e, r, !0);
  var s = () => {
      (n && Te(e), t && t());
    },
    a = r.length;
  if (a > 0) {
    var f = () => --a || s();
    for (var o of r) o.out(f);
  } else s();
}
function pn(e, t, n) {
  if ((e.f & V) === 0) {
    e.f ^= V;
    var r = e.nodes && e.nodes.t;
    if (r !== null) for (const o of r) (o.is_global || n) && t.push(o);
    for (var s = e.first; s !== null; ) {
      var a = s.next,
        f = (s.f & We) !== 0 || ((s.f & W) !== 0 && (e.f & Q) !== 0);
      (pn(s, t, f ? n : !1), (s = a));
    }
  }
}
function js(e) {
  wn(e, !0);
}
function wn(e, t) {
  if ((e.f & V) !== 0) {
    ((e.f ^= V), (e.f & E) === 0 && (m(e, O), Ee.ensure().schedule(e)));
    for (var n = e.first; n !== null; ) {
      var r = n.next,
        s = (n.f & We) !== 0 || (n.f & W) !== 0;
      (wn(n, s ? t : !1), (n = r));
    }
    var a = e.nodes && e.nodes.t;
    if (a !== null) for (const f of a) (f.is_global || t) && f.in();
  }
}
function Hs(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var s = n === r ? null : oe(n);
      (t.append(n), (n = s));
    }
}
let Ke = !1,
  Ae = !1;
function Lt(e) {
  Ae = e;
}
let p = null,
  U = !1;
function ie(e) {
  p = e;
}
let y = null;
function le(e) {
  y = e;
}
let j = null;
function yn(e) {
  p !== null && (j === null ? (j = [e]) : j.push(e));
}
let k = null,
  C = 0,
  F = null;
function br(e) {
  F = e;
}
let gn = 1,
  _e = 0,
  pe = _e;
function jt(e) {
  pe = e;
}
function mn() {
  return ++gn;
}
function De(e) {
  var t = e.f;
  if ((t & O) !== 0) return !0;
  if ((t & T && (e.f &= ~ge), (t & G) !== 0)) {
    for (var n = e.deps, r = n.length, s = 0; s < r; s++) {
      var a = n[s];
      if ((De(a) && nn(a), a.wv > e.wv)) return !0;
    }
    (t & L) !== 0 && S === null && m(e, E);
  }
  return !1;
}
function En(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(j !== null && ke.call(j, e)))
    for (var s = 0; s < r.length; s++) {
      var a = r[s];
      (a.f & T) !== 0
        ? En(a, t, !1)
        : t === a && (n ? m(a, O) : (a.f & E) !== 0 && m(a, G), Et(a));
    }
}
function bn(e) {
  var x;
  var t = k,
    n = C,
    r = F,
    s = p,
    a = j,
    f = N,
    o = U,
    l = pe,
    i = e.f;
  ((k = null),
    (C = 0),
    (F = null),
    (p = (i & (W | ye)) === 0 ? e : null),
    (j = null),
    Xe(e.ctx),
    (U = !1),
    (pe = ++_e),
    e.ac !== null &&
      (Nt(() => {
        e.ac.abort(X);
      }),
      (e.ac = null)));
  try {
    e.f |= ft;
    var c = e.fn,
      d = c();
    e.f |= fe;
    var v = e.deps,
      h = w == null ? void 0 : w.is_fork;
    if (k !== null) {
      var _;
      if ((h || je(e, C), v !== null && C > 0))
        for (v.length = C + k.length, _ = 0; _ < k.length; _++) v[C + _] = k[_];
      else e.deps = v = k;
      if (cn() && (e.f & L) !== 0)
        for (_ = C; _ < v.length; _++)
          ((x = v[_]).reactions ?? (x.reactions = [])).push(e);
    } else !h && v !== null && C < v.length && (je(e, C), (v.length = C));
    if (Be() && F !== null && !U && v !== null && (e.f & (T | G | O)) === 0)
      for (_ = 0; _ < F.length; _++) En(F[_], e);
    if (s !== null && s !== e) {
      if ((_e++, s.deps !== null))
        for (let R = 0; R < n; R += 1) s.deps[R].rv = _e;
      if (t !== null) for (const R of t) R.rv = _e;
      F !== null && (r === null ? (r = F) : r.push(...F));
    }
    return ((e.f & se) !== 0 && (e.f ^= se), d);
  } catch (R) {
    return Qn(R);
  } finally {
    ((e.f ^= ft),
      (k = t),
      (C = n),
      (F = r),
      (p = s),
      (j = a),
      Xe(f),
      (U = o),
      (pe = l));
  }
}
function Tr(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = xn.call(n, e);
    if (r !== -1) {
      var s = n.length - 1;
      s === 0 ? (n = t.reactions = null) : ((n[r] = n[s]), n.pop());
    }
  }
  if (n === null && (t.f & T) !== 0 && (k === null || !ke.call(k, t))) {
    var a = t;
    ((a.f & L) !== 0 && ((a.f ^= L), (a.f &= ~ge)), gt(a), ur(a), je(a, 0));
  }
}
function je(e, t) {
  var n = e.deps;
  if (n !== null) for (var r = t; r < n.length; r++) Tr(e, n[r]);
}
function Se(e) {
  var t = e.f;
  if ((t & B) === 0) {
    m(e, E);
    var n = y,
      r = Ke;
    ((y = e), (Ke = !0));
    try {
      ((t & (Q | pt)) !== 0 ? gr(e) : Rt(e), dn(e));
      var s = bn(e);
      ((e.teardown = typeof s == "function" ? s : null), (e.wv = gn));
      var a;
    } finally {
      ((Ke = r), (y = n));
    }
  }
}
async function Ys() {
  (await Promise.resolve(), rr());
}
function qs() {
  return Ee.ensure().settled();
}
function ve(e) {
  var t = e.f,
    n = (t & T) !== 0;
  if (p !== null && !U) {
    var r = y !== null && (y.f & B) !== 0;
    if (!r && (j === null || !ke.call(j, e))) {
      var s = p.deps;
      if ((p.f & ft) !== 0)
        e.rv < _e &&
          ((e.rv = _e),
          k === null && s !== null && s[C] === e
            ? C++
            : k === null
              ? (k = [e])
              : k.push(e));
      else {
        (p.deps ?? (p.deps = [])).push(e);
        var a = e.reactions;
        a === null ? (e.reactions = [p]) : ke.call(a, p) || a.push(p);
      }
    }
  }
  if (Ae && ae.has(e)) return ae.get(e);
  if (n) {
    var f = e;
    if (Ae) {
      var o = f.v;
      return (
        (((f.f & E) === 0 && f.reactions !== null) || An(f)) && (o = At(f)),
        ae.set(f, o),
        o
      );
    }
    var l = (f.f & L) === 0 && !U && p !== null && (Ke || (p.f & L) !== 0),
      i = (f.f & fe) === 0;
    (De(f) && (l && (f.f |= L), nn(f)), l && !i && (rn(f), Tn(f)));
  }
  if (S != null && S.has(e)) return S.get(e);
  if ((e.f & se) !== 0) throw e.v;
  return e.v;
}
function Tn(e) {
  if (((e.f |= L), e.deps !== null))
    for (const t of e.deps)
      ((t.reactions ?? (t.reactions = [])).push(e),
        (t.f & T) !== 0 && (t.f & L) === 0 && (rn(t), Tn(t)));
}
function An(e) {
  if (e.v === A) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (ae.has(t) || ((t.f & T) !== 0 && An(t))) return !0;
  return !1;
}
function Ar(e) {
  var t = U;
  try {
    return ((U = !0), e());
  } finally {
    U = t;
  }
}
function Us(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (he in e) ht(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && he in n && ht(n);
      }
  }
}
function ht(e, t = new Set()) {
  if (
    typeof e == "object" &&
    e !== null &&
    !(e instanceof EventTarget) &&
    !t.has(e)
  ) {
    (t.add(e), e instanceof Date && e.getTime());
    for (let r in e)
      try {
        ht(e[r], t);
      } catch {}
    const n = qt(e);
    if (
      n !== Object.prototype &&
      n !== Array.prototype &&
      n !== Map.prototype &&
      n !== Set.prototype &&
      n !== Date.prototype
    ) {
      const r = In(n);
      for (let s in r) {
        const a = r[s].get;
        if (a)
          try {
            a.call(e);
          } catch {}
      }
    }
  }
}
var Yt;
const it =
  ((Yt = globalThis == null ? void 0 : globalThis.window) == null
    ? void 0
    : Yt.trustedTypes) &&
  globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    createHTML: (e) => e,
  });
function Sr(e) {
  return (it == null ? void 0 : it.createHTML(e)) ?? e;
}
function Sn(e) {
  var t = dr("template");
  return ((t.innerHTML = Sr(e.replaceAll("<!>", "<!---->"))), t.content);
}
function K(e, t) {
  var n = y;
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
function Vs(e, t) {
  var n = (t & Gt) !== 0,
    r = (t & Gn) !== 0,
    s,
    a = !e.startsWith("<!>");
  return () => {
    if (M) return (K(g, null), g);
    s === void 0 && ((s = Sn(a ? e : "<!>" + e)), n || (s = q(s)));
    var f = r || ln ? document.importNode(s, !0) : s.cloneNode(!0);
    if (n) {
      var o = q(f),
        l = f.lastChild;
      K(o, l);
    } else K(f, f);
    return f;
  };
}
function Nr(e, t, n = "svg") {
  var r = !e.startsWith("<!>"),
    s = (t & Gt) !== 0,
    a = `<${n}>${r ? e : "<!>" + e}</${n}>`,
    f;
  return () => {
    if (M) return (K(g, null), g);
    if (!f) {
      var o = Sn(a),
        l = q(o);
      if (s)
        for (f = document.createDocumentFragment(); q(l); ) f.appendChild(q(l));
      else f = q(l);
    }
    var i = f.cloneNode(!0);
    if (s) {
      var c = q(i),
        d = i.lastChild;
      K(c, d);
    } else K(i, i);
    return i;
  };
}
function Bs(e, t) {
  return Nr(e, t, "svg");
}
function Gs(e = "") {
  if (!M) {
    var t = be(e + "");
    return (K(t, t), t);
  }
  var n = g;
  return (
    n.nodeType !== Ve ? (n.before((n = be())), me(n)) : nt(n),
    K(n, n),
    n
  );
}
function $s() {
  if (M) return (K(g, null), g);
  var e = document.createDocumentFragment(),
    t = document.createComment(""),
    n = be();
  return (e.append(t, n), K(t, n), e);
}
function zs(e, t) {
  if (M) {
    var n = y;
    (((n.f & fe) === 0 || n.nodes.end === null) && (n.nodes.end = g), Xn());
    return;
  }
  e !== null && e.before(t);
}
export {
  _r as $,
  ps as A,
  ne as B,
  Us as C,
  kt as D,
  We as E,
  hs as F,
  Os as G,
  $n as H,
  Rs as I,
  Pn as J,
  kr as K,
  Tt as L,
  be as M,
  Fn as N,
  Ue as O,
  Bt as P,
  oe as Q,
  q as R,
  he as S,
  _s as T,
  te as U,
  Me as V,
  Gs as W,
  os as X,
  Ss as Y,
  tt as Z,
  rr as _,
  zs as a,
  Hr as a$,
  qs as a0,
  Ys as a1,
  Ns as a2,
  w as a3,
  wr as a4,
  ot as a5,
  Nt as a6,
  xr as a7,
  ie as a8,
  le as a9,
  Qr as aA,
  es as aB,
  Zn as aC,
  cn as aD,
  at as aE,
  Mn as aF,
  zn as aG,
  ns as aH,
  tr as aI,
  Xe as aJ,
  Ee as aK,
  Qn as aL,
  dt as aM,
  Ze as aN,
  Ur as aO,
  is as aP,
  gs as aQ,
  wt as aR,
  Yr as aS,
  vr as aT,
  xs as aU,
  Or as aV,
  K as aW,
  Kn as aX,
  yt as aY,
  Gr as aZ,
  Cr as a_,
  p as aa,
  Mt as ab,
  Cn as ac,
  js as ad,
  Te as ae,
  Er as af,
  Ls as ag,
  Hs as ah,
  Ts as ai,
  St as aj,
  Fe as ak,
  qr as al,
  Xr as am,
  Ae as an,
  B as ao,
  ws as ap,
  Zr as aq,
  Wr as ar,
  Kr as as,
  lr as at,
  Ir as au,
  Pr as av,
  Jr as aw,
  Q as ax,
  fe as ay,
  ts as az,
  ds as b,
  On as b0,
  Vr as b1,
  zr as b2,
  Br as b3,
  V as b4,
  W as b5,
  $r as b6,
  jr as b7,
  dr as b8,
  rs as b9,
  Bs as ba,
  Dr as bb,
  Fs as bc,
  as as bd,
  ys as be,
  tn as bf,
  Mr as bg,
  Wn as bh,
  Lr as bi,
  qt as bj,
  ss as bk,
  In as bl,
  As as bm,
  A as bn,
  hr as bo,
  Ps as bp,
  Vs as c,
  ms as d,
  $s as e,
  Es as f,
  N as g,
  Is as h,
  vn as i,
  y as j,
  Ms as k,
  M as l,
  Xn as m,
  cs as n,
  us as o,
  vs as p,
  me as q,
  fs as r,
  bs as s,
  Cs as t,
  Ar as u,
  ls as v,
  g as w,
  ks as x,
  Ds as y,
  ve as z,
};
