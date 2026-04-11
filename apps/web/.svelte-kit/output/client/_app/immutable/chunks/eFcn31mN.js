import "./Bzak7iHL.js";
import "./CUONaVJB.js";
import {
  p as n,
  x as p,
  y as c,
  d as g,
  r as f,
  t as i,
  z as s,
  u as l,
  a as m,
  b as u,
  A,
  c as x,
  B as _,
  C as y,
} from "./CZsNqhY1.js";
import { s as D } from "./D4SvF6kG.js";
import { s as C } from "./DDioZlon.js";
import { p as E } from "./CsBhEEN0.js";
var N = x("<span> </span>");
function I(o, r) {
  n(r, !1);
  const e = A();
  let t = E(r, "status", 8);
  const d = {
    AGENDADA: {
      label: "Agendada",
      classes: "bg-blue-100 text-blue-800 border-blue-200",
    },
    REALIZADA: {
      label: "Realizada",
      classes: "bg-green-100 text-green-800 border-green-200",
    },
    CANCELADA: {
      label: "Cancelada",
      classes: "bg-red-100 text-red-800 border-red-200",
    },
    NAO_REALIZADA: {
      label: "Não Realizada",
      classes: "bg-orange-100 text-orange-800 border-orange-200",
    },
  };
  (p(
    () => y(t()),
    () => {
      _(
        e,
        d[t()] || {
          label: t(),
          classes: "bg-gray-100 text-gray-800 border-gray-200",
        },
      );
    },
  ),
    c());
  var a = N(),
    b = g(a, !0);
  (f(a),
    i(() => {
      (C(
        a,
        1,
        (s(e),
        l(
          () =>
            `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s(e).classes}`,
        )),
      ),
        D(b, (s(e), l(() => s(e).label))));
    }),
    m(o, a),
    u());
}
export { I as S };
