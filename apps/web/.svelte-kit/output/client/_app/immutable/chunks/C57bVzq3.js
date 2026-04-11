import {
  M as y,
  k as u,
  N as _,
  O as o,
  l as t,
  P as g,
  Q as l,
  v as i,
  q as d,
  w as p,
  R as v,
} from "./CZsNqhY1.js";
function C(n, r) {
  let s = null,
    E = t;
  var a;
  if (t) {
    s = p;
    for (
      var e = v(document.head);
      e !== null && (e.nodeType !== g || e.data !== n);
    )
      e = l(e);
    if (e === null) i(!1);
    else {
      var f = l(e);
      (e.remove(), d(f));
    }
  }
  t || (a = document.head.appendChild(y()));
  try {
    u(() => r(a), _ | o);
  } finally {
    E && (i(!0), d(s));
  }
}
export { C as h };
