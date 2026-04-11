import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";
import { CLERK_SECRET_KEY } from "$env/static/private";
import { createClerkClient, verifyToken } from "@clerk/backend";

const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });
const COOKIE_NAME = "__med_session";

// Cache por JWT — TTL de 55 minutos (JWT do Clerk deve estar ≥ 1h)
const CACHE_TTL_MS = 55 * 60 * 1000;

const authCache = new Map<
  string,
  {
    userId: string | null;
    sessionId: string | null;
    sessionToken: string;
    userName: string | null;
    expiresAt: number;
  }
>();

// Limpar entradas expiradas periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of authCache.entries()) {
    if (val.expiresAt < now) authCache.delete(key);
  }
}, 5 * 60_000); // A cada 5 minutos

async function getUserFromToken(token: string): Promise<{
  userId: string | null;
  sessionId: string | null;
  sessionToken: string;
  userName: string | null;
} | null> {
  // Verificar cache primeiro
  const cached = authCache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      userId: cached.userId,
      sessionId: cached.sessionId,
      sessionToken: cached.sessionToken,
      userName: cached.userName,
    };
  }

  let result: {
    userId: string | null;
    sessionId: string | null;
    sessionToken: string;
    userName: string | null;
  } | null = null;

  // Fluxo 1: JWT (eyJ...) — verificar com Clerk
  if (token.startsWith("eyJ")) {
    try {
      const payload = await verifyToken(token, {
        secretKey: CLERK_SECRET_KEY,
      });
      // Extrair userName dos claims customizados do template 'medivisitas'
      const firstName = (payload as Record<string, unknown>).firstName as
        | string
        | undefined;
      const lastName = (payload as Record<string, unknown>).lastName as
        | string
        | undefined;
      const email = (payload as Record<string, unknown>).email as
        | string
        | undefined;
      const name =
        [firstName, lastName].filter(Boolean).join(" ") || email || null;
      result = {
        userId: payload.sub ?? null,
        sessionId: (payload.sid as string) ?? null,
        sessionToken: token,
        userName: name,
      };
    } catch {
      // Verificação remota falhou — NÃO retornar null imediatamente
      // Será tratado pelo fallback no handle()
    }
  }

  // Fluxo 2: Token opaco (dvb_...) — converter para JWT via Clerk
  if (!result && !token.startsWith("eyJ")) {
    try {
      const client = await clerk.clients.verifyClient(token);
      const session = client.sessions?.find(
        (s: { status: string }) => s.status === "active",
      );
      if (session) {
        let sessionToken = token;
        try {
          const tokenObj = await clerk.sessions.getToken(
            session.id,
            "medivisitas",
          );
          if (tokenObj && tokenObj.jwt) {
            sessionToken = tokenObj.jwt;
          }
        } catch {
          // Falha ao obter JWT do template — manter token opaco
        }
        result = {
          userId: session.userId,
          sessionId: session.id,
          sessionToken,
          userName: null,
        };
      }
    } catch {
      // verifyClient falhou — retornar null
    }
  }

  // Salvar no cache com TTL de 55 minutos
  if (result) {
    authCache.set(token, {
      ...result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }

  return result;
}

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies, locals } = event;
  const { pathname } = url;

  // Ignorar assets estáticos e API interna
  if (
    pathname.startsWith("/_app/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/token")
  ) {
    return resolve(event);
  }

  // 1. Capturar token do redirect do Clerk
  const clerkToken =
    url.searchParams.get("__clerk_db_jwt") ??
    url.searchParams.get("__session_token");

  if (clerkToken) {
    const user = await getUserFromToken(clerkToken);

    if (user) {
      // Armazenar o JWT real no cookie (não o token opaco)
      // Isso evita chamadas repetidas ao Clerk para converter token opaco → JWT
      const jwtToStore = user.sessionToken.startsWith("eyJ")
        ? user.sessionToken
        : clerkToken;

      cookies.set(COOKIE_NAME, jwtToStore, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8, // 8 horas
      });

      // Cache usa o JWT armazenado como chave
      authCache.set(jwtToStore, {
        userId: user.userId,
        sessionId: user.sessionId,
        sessionToken: user.sessionToken,
        userName: user.userName,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      locals.userId = user.userId;
      locals.sessionId = user.sessionId;
      locals.sessionToken = user.sessionToken;
      locals.userName = user.userName;
    }

    // Redirecionar limpando query params
    const cleanUrl = new URL(url);
    cleanUrl.searchParams.delete("__clerk_db_jwt");
    cleanUrl.searchParams.delete("__session_token");
    throw redirect(302, cleanUrl.pathname || "/dashboard");
  }

  // 2. Ler token do cookie existente
  const token = cookies.get(COOKIE_NAME) ?? cookies.get("__session");

  if (token) {
    const user = await getUserFromToken(token);
    if (user) {
      locals.userId = user.userId;
      locals.sessionId = user.sessionId;
      locals.sessionToken = user.sessionToken;
      locals.userName = user.userName;
    } else {
      // Verificação falhou — deletar cookie e forçar re-login
      cookies.delete(COOKIE_NAME, { path: "/" });
    }
  }

  return resolve(event);
};
