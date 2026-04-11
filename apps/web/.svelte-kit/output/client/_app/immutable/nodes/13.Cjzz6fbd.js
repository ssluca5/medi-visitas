import "../chunks/Bzak7iHL.js";
import "../chunks/CUONaVJB.js";
import {
  t as n,
  a as l,
  h as m,
  c as v,
  $ as f,
  d as t,
  s as b,
  r,
} from "../chunks/CZsNqhY1.js";
import { h as p } from "../chunks/C57bVzq3.js";
import { b as u, c as s } from "../chunks/DDioZlon.js";
var x = v(
  '<div class="flex min-h-screen items-center justify-center bg-[rgb(var(--color-surface-2))]"><div class="w-full max-w-md p-8 rounded-xl bg-[rgb(var(--color-surface))] shadow-xl border border-[rgb(var(--color-border))]"><div class="text-center mb-8"><h1 class="text-2xl font-bold text-[rgb(var(--color-text))]">MediVisitas</h1> <p class="text-sm text-[rgb(var(--color-text-muted))] mt-1">Crie sua conta</p></div> <div class="text-center space-y-4"><a class="inline-flex items-center justify-center w-full h-11 rounded-[var(--radius)] bg-[rgb(var(--accent))] text-white font-medium text-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:scale-[0.98]">Criar conta com Clerk</a></div></div></div>',
);
function y(i) {
  const d =
    typeof window < "u"
      ? `${s}?redirect_url=${encodeURIComponent(window.location.origin + "/dashboard")}`
      : s;
  var e = x();
  p("kmqcod", (h) => {
    m(() => {
      f.title = "Cadastro — MediVisitas";
    });
  });
  var a = t(e),
    o = b(t(a), 2),
    c = t(o);
  (r(o), r(a), r(e), n(() => u(c, "href", d)), l(i, e));
}
export { y as component };
