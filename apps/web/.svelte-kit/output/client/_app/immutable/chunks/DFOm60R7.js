import {
  a2 as u,
  a3 as o,
  a1 as y,
  u as m,
  i as _,
  l as b,
} from "./CZsNqhY1.js";
import { e as h } from "./DDioZlon.js";
function S(e, a, t = a) {
  var f = new WeakSet();
  (u(e, "input", async (r) => {
    var l = r ? e.defaultValue : e.value;
    if (
      ((l = n(e) ? v(l) : l),
      t(l),
      o !== null && f.add(o),
      await y(),
      l !== (l = a()))
    ) {
      var i = e.selectionStart,
        s = e.selectionEnd,
        d = e.value.length;
      if (((e.value = l ?? ""), s !== null)) {
        var c = e.value.length;
        i === s && s === d && c > d
          ? ((e.selectionStart = c), (e.selectionEnd = c))
          : ((e.selectionStart = i), (e.selectionEnd = Math.min(s, c)));
      }
    }
  }),
    ((b && e.defaultValue !== e.value) || (m(a) == null && e.value)) &&
      (t(n(e) ? v(e.value) : e.value), o !== null && f.add(o)),
    _(() => {
      var r = a();
      if (e === document.activeElement) {
        var l = o;
        if (f.has(l)) return;
      }
      (n(e) && r === v(e.value)) ||
        (e.type === "date" && !r && !e.value) ||
        (r !== e.value && (e.value = r ?? ""));
    }));
}
function n(e) {
  var a = e.type;
  return a === "number" || a === "range";
}
function v(e) {
  return e === "" ? null : +e;
}
async function k(e, a, t = {}) {
  const f = { ...t.headers };
  (a && (f.Authorization = `Bearer ${a}`),
    t.body &&
      typeof t.body == "string" &&
      (f["Content-Type"] = "application/json"));
  const r = await fetch(`${h}${e}`, { ...t, headers: f });
  return (
    r.status === 401 &&
      typeof window < "u" &&
      (window.location.href = "/login"),
    r
  );
}
export { k as a, S as b };
