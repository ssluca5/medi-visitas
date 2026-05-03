import { PUBLIC_API_URL } from "$env/static/public";
import { browser } from "$app/environment";

/**
 * Fetch autenticado para a API backend.
 * O token JWT é passado pelo layout via data prop.
 * Redireciona para /login em caso de 401 (token expirado) — apenas client-side.
 */
export async function apiFetch(
  path: string,
  token: string | null,
  options: RequestInit = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  });

  // Token expirado — redirecionar para login (apenas no browser, nunca SSR)
  if (res.status === 401 && browser) {
    window.location.href = "/login";
  }

  // Organização não encontrada — redirecionar para onboarding (apenas no browser)
  if (res.status === 403 && browser) {
    try {
      const cloned = res.clone();
      const body = await cloned.json();
      if (body.code === "ORGANIZATION_NOT_FOUND") {
        window.location.href = "/onboarding";
        return res;
      }
    } catch {
      // Não é JSON — seguir normalmente
    }
  }

  // Trial expirado ou conta suspensa — redirecionar para planos (apenas no browser)
  if (res.status === 402 && browser) {
    try {
      const cloned = res.clone();
      const body = await cloned.json();
      if (body.code === "TRIAL_EXPIRED" || body.code === "ACCOUNT_SUSPENDED") {
        window.location.href = "/planos";
        return res;
      }
    } catch {
      // Não é JSON — seguir normalmente
    }
  }

  return res;
}
