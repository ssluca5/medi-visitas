import { PUBLIC_API_URL } from "$env/static/public";
import { browser } from "$app/environment";

// Cache em memória para GETs com TTL de 30s
const cache = new Map<string, { data: Response; expiry: number }>();
const CACHE_TTL = 30_000;
const MAX_CACHE_SIZE = 100;

// Paths que NUNCA devem ser cacheados (dados de sessão/tempo-real)
const NO_CACHE_PATHS = ["/me", "/onboarding", "/notificacoes", "/billing"];

function getCacheKey(path: string, token: string | null): string {
  return `${token?.slice(-8) ?? "anon"}:${path}`;
}

function shouldCache(path: string, method: string): boolean {
  if (method !== "GET") return false;
  return !NO_CACHE_PATHS.some((p) => path.startsWith(p));
}

/** Invalida cache de um path específico ou todos de um prefixo */
export function invalidateCache(pathPrefix?: string): void {
  if (!pathPrefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pathPrefix)) cache.delete(key);
  }
}

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
  const method = (options.method ?? "GET").toUpperCase();

  // Invalidar cache em mutações
  if (method !== "GET" && browser) {
    invalidateCache(path.split("/").slice(0, 2).join("/"));
  }

  // Verificar cache para GETs (apenas client-side)
  if (browser && shouldCache(path, method)) {
    const key = getCacheKey(path, token);
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data.clone();
    }
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  });

  // Token expirado — tentar renovar o token via API interna do SvelteKit
  if (res.status === 401 && browser) {
    try {
      const tokenRes = await fetch("/api/token");
      if (tokenRes.ok) {
        const { token: newToken } = await tokenRes.json();
        if (newToken) {
          headers["Authorization"] = `Bearer ${newToken}`;
          // Retentar a requisição com o novo token
          res = await fetch(`${PUBLIC_API_URL}${path}`, {
            ...options,
            headers,
          });
        }
      }
    } catch (e) {
      console.error("Erro ao renovar token client-side:", e);
    }

    if (res.status === 401) {
      window.location.href = "/login";
    }
  }

  // Organização não encontrada — redirecionar para onboarding (apenas no browser)
  if (res.status === 403 && browser) {
    try {
      const cloned = res.clone();
      const body = await cloned.json();
      if (body.code === "ORGANIZATION_NOT_FOUND") {
        window.location.href = window.location.pathname.startsWith("/dashboard")
          ? "/logout?motivo=membro_removido"
          : "/onboarding";
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

  // Cachear resposta bem-sucedida de GETs
  if (browser && res.ok && shouldCache(path, method)) {
    const key = getCacheKey(path, token);
    if (cache.size >= MAX_CACHE_SIZE) {
      // Evict oldest entry
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
    cache.set(key, { data: res.clone(), expiry: Date.now() + CACHE_TTL });
  }

  return res;
}
