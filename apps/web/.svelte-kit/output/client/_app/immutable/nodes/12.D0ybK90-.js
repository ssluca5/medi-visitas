import "../chunks/Bzak7iHL.js";
import "../chunks/CUONaVJB.js";
import {
  t as l,
  a as m,
  h as v,
  c as p,
  $ as x,
  d as e,
  s as o,
  r,
} from "../chunks/CZsNqhY1.js";
import { h as f } from "../chunks/C57bVzq3.js";
import { b, P as i } from "../chunks/DDioZlon.js";
var u = p(
  '<div class="flex min-h-screen items-center justify-center bg-[rgb(var(--color-surface-2))]"><div class="w-full max-w-md p-8 rounded-xl bg-[rgb(var(--color-surface))] shadow-xl border border-[rgb(var(--color-border))]"><div class="text-center mb-8"><h1 class="text-2xl font-bold text-[rgb(var(--color-text))]">MediVisitas</h1> <p class="text-sm text-[rgb(var(--color-text-muted))] mt-1">CRM para Propagandistas Farmacêuticos</p></div> <div class="text-center space-y-4"><p class="text-sm text-[rgb(var(--color-text-muted))]">Faça login para acessar o sistema.</p> <a class="inline-flex items-center justify-center w-full h-11 rounded-[var(--radius)] bg-[rgb(var(--accent))] text-white font-medium text-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:scale-[0.98]">Entrar com Clerk</a></div></div></div>',
);
function C(c) {
  const d =
    typeof window < "u"
      ? `${i}?redirect_url=${encodeURIComponent(window.location.origin + "/dashboard")}`
      : i;
  var t = u();
  f("1x05zx6", (h) => {
    v(() => {
      x.title = "Login — MediVisitas";
    });
  });
  var a = e(t),
    s = o(e(a), 2),
    n = o(e(s), 2);
  (r(s), r(a), r(t), l(() => b(n, "href", d)), m(c, t));
}
export { C as component };
