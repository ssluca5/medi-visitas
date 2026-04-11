import { k as p, E as t } from "./CZsNqhY1.js";
import { B as c } from "./CsBhEEN0.js";
function E(r, s, ...a) {
  var e = new c(r);
  p(() => {
    const n = s() ?? null;
    e.ensure(n, n && ((o) => n(o, ...a)));
  }, t);
}
export { E as s };
