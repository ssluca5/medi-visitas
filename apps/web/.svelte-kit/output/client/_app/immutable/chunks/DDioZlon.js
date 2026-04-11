import {
  bc as Y,
  ae as y,
  ag as z,
  h as G,
  l as T,
  a2 as x,
  a3 as w,
  a4 as rr,
  b0 as ir,
  bd as ar,
  be as fr,
  bf as tr,
  bg as er,
  bh as ur,
  bi as C,
  bj as sr,
  z as or,
  bk as lr,
  bl as cr,
  v as K,
  bm as nr,
  bn as vr,
  a5 as dr,
  bo as br,
} from "./CZsNqhY1.js";
import {
  f as _r,
  a as hr,
  d as gr,
  g as Ar,
  n as Sr,
  j as Tr,
} from "./BLFvJadL.js";
function Lr(r, a) {
  var i = void 0,
    f;
  Y(() => {
    i !== (i = a()) &&
      (f && (y(f), (f = null)),
      i &&
        (f = z(() => {
          G(() => i(r));
        })));
  });
}
function F(r) {
  var a,
    i,
    f = "";
  if (typeof r == "string" || typeof r == "number") f += r;
  else if (typeof r == "object")
    if (Array.isArray(r)) {
      var t = r.length;
      for (a = 0; a < t; a++)
        r[a] && (i = F(r[a])) && (f && (f += " "), (f += i));
    } else for (i in r) r[i] && (f && (f += " "), (f += i));
  return f;
}
function Nr() {
  for (var r, a, i = 0, f = "", t = arguments.length; i < t; i++)
    (r = arguments[i]) && (a = F(r)) && (f && (f += " "), (f += a));
  return f;
}
function Ir(r) {
  return typeof r == "object" ? Nr(r) : (r ?? "");
}
const $ = [
  ...` 	
\r\f \v\uFEFF`,
];
function pr(r, a, i) {
  var f = r == null ? "" : "" + r;
  if ((a && (f = f ? f + " " + a : a), i)) {
    for (var t of Object.keys(i))
      if (i[t]) f = f ? f + " " + t : t;
      else if (f.length)
        for (var e = t.length, u = 0; (u = f.indexOf(t, u)) >= 0; ) {
          var o = u + e;
          (u === 0 || $.includes(f[u - 1])) &&
          (o === f.length || $.includes(f[o]))
            ? (f = (u === 0 ? "" : f.substring(0, u)) + f.substring(o + 1))
            : (u = o);
        }
  }
  return f === "" ? null : f;
}
function D(r, a = !1) {
  var i = a ? " !important;" : ";",
    f = "";
  for (var t of Object.keys(r)) {
    var e = r[t];
    e != null && e !== "" && (f += " " + t + ": " + e + i);
  }
  return f;
}
function R(r) {
  return r[0] !== "-" || r[1] !== "-" ? r.toLowerCase() : r;
}
function Er(r, a) {
  if (a) {
    var i = "",
      f,
      t;
    if ((Array.isArray(a) ? ((f = a[0]), (t = a[1])) : (f = a), r)) {
      r = String(r)
        .replaceAll(/\s*\/\*.*?\*\/\s*/g, "")
        .trim();
      var e = !1,
        u = 0,
        o = !1,
        n = [];
      (f && n.push(...Object.keys(f).map(R)),
        t && n.push(...Object.keys(t).map(R)));
      var v = 0,
        h = -1;
      const N = r.length;
      for (var d = 0; d < N; d++) {
        var s = r[d];
        if (
          (o
            ? s === "/" && r[d - 1] === "*" && (o = !1)
            : e
              ? e === s && (e = !1)
              : s === "/" && r[d + 1] === "*"
                ? (o = !0)
                : s === '"' || s === "'"
                  ? (e = s)
                  : s === "("
                    ? u++
                    : s === ")" && u--,
          !o && e === !1 && u === 0)
        ) {
          if (s === ":" && h === -1) h = d;
          else if (s === ";" || d === N - 1) {
            if (h !== -1) {
              var L = R(r.substring(v, h).trim());
              if (!n.includes(L)) {
                s !== ";" && d++;
                var S = r.substring(v, d).trim();
                i += " " + S + ";";
              }
            }
            ((v = d + 1), (h = -1));
          }
        }
      }
    }
    return (
      f && (i += D(f)),
      t && (i += D(t, !0)),
      (i = i.trim()),
      i === "" ? null : i
    );
  }
  return r == null ? null : String(r);
}
function Or(r, a, i, f, t, e) {
  var u = r.__className;
  if (T || u !== i || u === void 0) {
    var o = pr(i, f, e);
    ((!T || o !== r.getAttribute("class")) &&
      (o == null
        ? r.removeAttribute("class")
        : a
          ? (r.className = o)
          : r.setAttribute("class", o)),
      (r.__className = i));
  } else if (e && t !== e)
    for (var n in e) {
      var v = !!e[n];
      (t == null || v !== !!t[n]) && r.classList.toggle(n, v);
    }
  return e;
}
function j(r, a = {}, i, f) {
  for (var t in i) {
    var e = i[t];
    a[t] !== e &&
      (i[t] == null ? r.style.removeProperty(t) : r.style.setProperty(t, e, f));
  }
}
function Pr(r, a, i, f) {
  var t = r.__style;
  if (T || t !== a) {
    var e = Er(a, f);
    ((!T || e !== r.getAttribute("style")) &&
      (e == null ? r.removeAttribute("style") : (r.style.cssText = e)),
      (r.__style = a));
  } else
    f &&
      (Array.isArray(f)
        ? (j(r, i == null ? void 0 : i[0], f[0]),
          j(r, i == null ? void 0 : i[1], f[1], "important"))
        : j(r, i, f));
  return f;
}
function k(r, a, i = !1) {
  if (r.multiple) {
    if (a == null) return;
    if (!ir(a)) return ar();
    for (var f of r.options) f.selected = a.includes(P(f));
    return;
  }
  for (f of r.options) {
    var t = P(f);
    if (fr(t, a)) {
      f.selected = !0;
      return;
    }
  }
  (!i || a !== void 0) && (r.selectedIndex = -1);
}
function W(r) {
  var a = new MutationObserver(() => {
    k(r, r.__value);
  });
  (a.observe(r, {
    childList: !0,
    subtree: !0,
    attributes: !0,
    attributeFilter: ["value"],
  }),
    rr(() => {
      a.disconnect();
    }));
}
function Hr(r, a, i = a) {
  var f = new WeakSet(),
    t = !0;
  (x(r, "change", (e) => {
    var u = e ? "[selected]" : ":checked",
      o;
    if (r.multiple) o = [].map.call(r.querySelectorAll(u), P);
    else {
      var n = r.querySelector(u) ?? r.querySelector("option:not([disabled])");
      o = n && P(n);
    }
    (i(o), (r.__value = o), w !== null && f.add(w));
  }),
    G(() => {
      var e = a();
      if (r === document.activeElement) {
        var u = w;
        if (f.has(u)) return;
      }
      if ((k(r, e, t), t && e === void 0)) {
        var o = r.querySelector(":checked");
        o !== null && ((e = P(o)), i(e));
      }
      ((r.__value = e), (t = !1));
    }),
    W(r));
}
function P(r) {
  return "__value" in r ? r.__value : r.value;
}
const E = Symbol("class"),
  O = Symbol("style"),
  X = Symbol("is custom element"),
  Z = Symbol("is html"),
  Cr = C ? "link" : "LINK",
  kr = C ? "input" : "INPUT",
  Ur = C ? "option" : "OPTION",
  wr = C ? "select" : "SELECT",
  Rr = C ? "progress" : "PROGRESS";
function jr(r) {
  if (T) {
    var a = !1,
      i = () => {
        if (!a) {
          if (((a = !0), r.hasAttribute("value"))) {
            var f = r.value;
            (U(r, "value", null), (r.value = f));
          }
          if (r.hasAttribute("checked")) {
            var t = r.checked;
            (U(r, "checked", null), (r.checked = t));
          }
        }
      };
    ((r.__on_r = i), dr(i), br());
  }
}
function Br(r, a) {
  var i = M(r);
  i.value === (i.value = a ?? void 0) ||
    (r.value === a && (a !== 0 || r.nodeName !== Rr)) ||
    (r.value = a ?? "");
}
function yr(r, a) {
  a
    ? r.hasAttribute("selected") || r.setAttribute("selected", "")
    : r.removeAttribute("selected");
}
function U(r, a, i, f) {
  var t = M(r);
  (T &&
    ((t[a] = r.getAttribute(a)),
    a === "src" || a === "srcset" || (a === "href" && r.nodeName === Cr))) ||
    (t[a] !== (t[a] = i) &&
      (a === "loading" && (r[er] = i),
      i == null
        ? r.removeAttribute(a)
        : typeof i != "string" && J(r).includes(a)
          ? (r[a] = i)
          : r.setAttribute(a, i)));
}
function Gr(r, a, i, f, t = !1, e = !1) {
  if (T && t && r.nodeName === kr) {
    var u = r,
      o = u.type === "checkbox" ? "defaultChecked" : "defaultValue";
    o in i || jr(u);
  }
  var n = M(r),
    v = n[X],
    h = !n[Z];
  let d = T && v;
  d && K(!1);
  var s = a || {},
    L = r.nodeName === Ur;
  for (var S in a) S in i || (i[S] = null);
  (i.class ? (i.class = Ir(i.class)) : i[E] && (i.class = null),
    i[O] && (i.style ?? (i.style = null)));
  var N = J(r);
  for (const l in i) {
    let c = i[l];
    if (L && l === "value" && c == null) {
      ((r.value = r.__value = ""), (s[l] = c));
      continue;
    }
    if (l === "class") {
      var p = r.namespaceURI === "http://www.w3.org/1999/xhtml";
      (Or(r, p, c, f, a == null ? void 0 : a[E], i[E]),
        (s[l] = c),
        (s[E] = i[E]));
      continue;
    }
    if (l === "style") {
      (Pr(r, c, a == null ? void 0 : a[O], i[O]), (s[l] = c), (s[O] = i[O]));
      continue;
    }
    var g = s[l];
    if (!(c === g && !(c === void 0 && r.hasAttribute(l)))) {
      s[l] = c;
      var q = l[0] + l[1];
      if (q !== "$$")
        if (q === "on") {
          const A = {},
            I = "$$" + l;
          let _ = l.slice(2);
          var H = Tr(_);
          if ((_r(_) && ((_ = _.slice(0, -7)), (A.capture = !0)), !H && g)) {
            if (c != null) continue;
            (r.removeEventListener(_, s[I], A), (s[I] = null));
          }
          if (H) (hr(_, r, c), gr([_]));
          else if (c != null) {
            let Q = function (m) {
              s[l].call(this, m);
            };
            s[I] = Ar(_, r, Q, A);
          }
        } else if (l === "style") U(r, l, c);
        else if (l === "autofocus") nr(r, !!c);
        else if (!v && (l === "__value" || (l === "value" && c != null)))
          r.value = r.__value = c;
        else if (l === "selected" && L) yr(r, c);
        else {
          var b = l;
          h || (b = Sr(b));
          var B = b === "defaultValue" || b === "defaultChecked";
          if (c == null && !v && !B)
            if (((n[l] = null), b === "value" || b === "checked")) {
              let A = r;
              const I = a === void 0;
              if (b === "value") {
                let _ = A.defaultValue;
                (A.removeAttribute(b),
                  (A.defaultValue = _),
                  (A.value = A.__value = I ? _ : null));
              } else {
                let _ = A.defaultChecked;
                (A.removeAttribute(b),
                  (A.defaultChecked = _),
                  (A.checked = I ? _ : !1));
              }
            } else r.removeAttribute(l);
          else
            B || (N.includes(b) && (v || typeof c != "string"))
              ? ((r[b] = c), b in n && (n[b] = vr))
              : typeof c != "function" && U(r, b, c);
        }
    }
  }
  return (d && K(!0), s);
}
function Kr(r, a, i = [], f = [], t = [], e, u = !1, o = !1) {
  tr(t, i, f, (n) => {
    var v = void 0,
      h = {},
      d = r.nodeName === wr,
      s = !1;
    if (
      (Y(() => {
        var S = a(...n.map(or)),
          N = Gr(r, v, S, e, u, o);
        s && d && "value" in S && k(r, S.value);
        for (let g of Object.getOwnPropertySymbols(h)) S[g] || y(h[g]);
        for (let g of Object.getOwnPropertySymbols(S)) {
          var p = S[g];
          (g.description === lr &&
            (!v || p !== v[g]) &&
            (h[g] && y(h[g]), (h[g] = z(() => Lr(r, () => p)))),
            (N[g] = p));
        }
        v = N;
      }),
      d)
    ) {
      var L = r;
      G(() => {
        (k(L, v.value, !0), W(L));
      });
    }
    s = !0;
  });
}
function M(r) {
  return (
    r.__attributes ??
    (r.__attributes = {
      [X]: r.nodeName.includes("-"),
      [Z]: r.namespaceURI === ur,
    })
  );
}
var V = new Map();
function J(r) {
  var a = r.getAttribute("is") || r.nodeName,
    i = V.get(a);
  if (i) return i;
  V.set(a, (i = []));
  for (var f, t = r, e = Element.prototype; e !== t; ) {
    f = cr(t);
    for (var u in f) f[u].set && i.push(u);
    t = sr(t);
  }
  return i;
}
const $r = "http://localhost:3002",
  Dr = "https://awaited-mammoth-27.accounts.dev/sign-in",
  Vr = "https://awaited-mammoth-27.accounts.dev/sign-up";
export {
  Dr as P,
  Kr as a,
  U as b,
  Vr as c,
  Hr as d,
  $r as e,
  Ir as f,
  Br as g,
  Pr as h,
  jr as r,
  Or as s,
};
