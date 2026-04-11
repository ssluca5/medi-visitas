import "./Bzak7iHL.js";
import {
  e as k,
  f as B,
  a as r,
  z as c,
  d,
  r as v,
  c as u,
  F as C,
} from "./CZsNqhY1.js";
import { s as h } from "./D-vgaD8G.js";
import { p as o, i as j, r as F } from "./CsBhEEN0.js";
import { a as f } from "./DDioZlon.js";
var N = u("<a><!></a>"),
  q = u("<button><!></button>");
function I(b, t) {
  let m = o(t, "variant", 3, "default"),
    g = o(t, "size", 3, "default"),
    x = o(t, "class", 3, ""),
    i = F(t, [
      "$$slots",
      "$$events",
      "$$legacy",
      "variant",
      "size",
      "href",
      "class",
      "children",
    ]);
  const w = {
      default:
        "bg-[rgb(var(--accent))] text-white shadow-sm hover:bg-[rgb(var(--accent))]/90",
      destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
      outline: "border bg-white shadow-sm hover:bg-slate-50",
      secondary: "bg-slate-100 text-slate-700 shadow-sm hover:bg-slate-200/70",
      ghost: "hover:bg-slate-100",
      link: "text-[rgb(var(--accent))] underline-offset-4 hover:underline",
    },
    p = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-10 rounded-lg px-8",
      icon: "h-9 w-9",
    };
  let n = C(
    () =>
      `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))]/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${w[m()]} ${p[g()]} ${x()}`,
  );
  var l = k(),
    _ = B(l);
  {
    var y = (a) => {
        var e = N();
        f(e, () => ({ href: t.href, class: c(n), ...i }));
        var s = d(e);
        (h(s, () => t.children), v(e), r(a, e));
      },
      z = (a) => {
        var e = q();
        f(e, () => ({ class: c(n), ...i }));
        var s = d(e);
        (h(s, () => t.children), v(e), r(a, e));
      };
    j(_, (a) => {
      t.href ? a(y) : a(z, -1);
    });
  }
  r(b, l);
}
export { I as B };
