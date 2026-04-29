import { PUBLIC_API_URL } from "$env/static/public";

/**
 * Fetch autenticado para a API backend.
 * O token JWT é passado pelo layout via data prop.
 * Redireciona para /login em caso de 401 (token expirado).
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

  // Token expirado — redirecionar para login
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  // Organização não encontrada — redirecionar para onboarding
  if (res.status === 403) {
    try {
      const cloned = res.clone();
      const body = await cloned.json();
      if (body.code === "ORGANIZATION_NOT_FOUND") {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return res;
      }
    } catch {
      // Não é JSON — seguir normalmente
    }
  }

  return res;
}
