import { l as head, i as attr } from "../../../chunks/index.js";
import { a as PUBLIC_CLERK_SIGN_IN_HOSTED_URL } from "../../../chunks/public.js";
function _page($$renderer) {
  const redirectUrl =
    typeof window !== "undefined"
      ? `${PUBLIC_CLERK_SIGN_IN_HOSTED_URL}?redirect_url=${encodeURIComponent(window.location.origin + "/dashboard")}`
      : PUBLIC_CLERK_SIGN_IN_HOSTED_URL;
  head("1x05zx6", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Login — MediVisitas</title>`);
    });
  });
  $$renderer.push(
    `<div class="flex min-h-screen items-center justify-center bg-[rgb(var(--color-surface-2))]"><div class="w-full max-w-md p-8 rounded-xl bg-[rgb(var(--color-surface))] shadow-xl border border-[rgb(var(--color-border))]"><div class="text-center mb-8"><h1 class="text-2xl font-bold text-[rgb(var(--color-text))]">MediVisitas</h1> <p class="text-sm text-[rgb(var(--color-text-muted))] mt-1">CRM para Propagandistas Farmacêuticos</p></div> <div class="text-center space-y-4"><p class="text-sm text-[rgb(var(--color-text-muted))]">Faça login para acessar o sistema.</p> <a${attr("href", redirectUrl)} class="inline-flex items-center justify-center w-full h-11 rounded-[var(--radius)] bg-[rgb(var(--accent))] text-white font-medium text-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:scale-[0.98]">Entrar com Clerk</a></div></div></div>`,
  );
}
export { _page as default };
