import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";
import { CLERK_SECRET_KEY, CLERK_JWT_KEY } from "$env/static/private";
import { createClerkClient, verifyToken } from "@clerk/backend";

const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });
const COOKIE_NAME = "__med_session";

// Cache por JWT — TTL de 60 segundos para detectar sessões revogadas rapidamente
const CACHE_TTL_MS = 60 * 1000;

const MAX_CACHE_SIZE = 1000;

const authCache = new Map<
  string,
  {
    userId: string | null;
    sessionId: string | null;
    sessionToken: string;
    userName: string | null;
    userEmail: string | null;
    expiresAt: number;
  }
>();

// Limpar entradas expiradas e limitar tamanho do cache
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  for (const [key, val] of authCache.entries()) {
    if (val.expiresAt < now) {
      keysToDelete.push(key);
    }
  }
  // Se cache cresceu demais, remover entradas mais antigas
  if (authCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = [...authCache.entries()].sort(
      (a, b) => a[1].expiresAt - b[1].expiresAt,
    );
    const removeCount = authCache.size - MAX_CACHE_SIZE;
    for (let i = 0; i < removeCount; i++) {
      keysToDelete.push(sortedEntries[i][0]);
    }
  }
  keysToDelete.forEach((k) => authCache.delete(k));
}, 60_000); // A cada 60 segundos

async function getUserFromToken(token: string): Promise<{
  userId: string | null;
  sessionId: string | null;
  sessionToken: string;
  userName: string | null;
  userEmail: string | null;
} | null> {
  // Verificar cache primeiro
  const cached = authCache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      userId: cached.userId,
      sessionId: cached.sessionId,
      sessionToken: cached.sessionToken,
      userName: cached.userName,
      userEmail: cached.userEmail,
    };
  }

  let result: {
    userId: string | null;
    sessionId: string | null;
    sessionToken: string;
    userName: string | null;
    userEmail: string | null;
  } | null = null;

  // Fluxo 1: JWT (eyJ...) — verificar com Clerk
  if (token.startsWith("eyJ")) {
    try {
      console.log(
        "[AUTH] Fluxo 1: Verificando JWT...",
        token.substring(0, 30) + "...",
      );
      const payload = await verifyToken(token, {
        secretKey: CLERK_SECRET_KEY,
        jwtKey: CLERK_JWT_KEY || undefined,
      });
      console.log("[AUTH] JWT verificado OK, sub:", payload.sub);
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
        userEmail: email || null,
      };
    } catch (verifyErr) {
      console.log(
        "[AUTH] JWT verificação falhou:",
        verifyErr instanceof Error ? verifyErr.message : verifyErr,
      );
      // Verificação remota falhou (ex: JWT expirado).
      // Tentar extrair o sid e renovar o token.
      try {
        const payloadBase64 = token.split(".")[1];
        if (payloadBase64) {
          const payloadStr = Buffer.from(payloadBase64, "base64").toString();
          const payloadObj = JSON.parse(payloadStr);
          if (payloadObj.sid) {
            const tokenObj = await clerk.sessions.getToken(
              payloadObj.sid,
              "medivisitas",
            );
            if (tokenObj && tokenObj.jwt) {
              console.log(
                "[AUTH] Token renovado via getToken('medivisitas')",
                tokenObj.jwt.substring(0, 30) + "...",
              );
              // Validar o novo token
              const newPayload = await verifyToken(tokenObj.jwt, {
                secretKey: CLERK_SECRET_KEY,
                jwtKey: CLERK_JWT_KEY || undefined,
              });
              console.log(
                "[AUTH] Token renovado verificado OK, sub:",
                newPayload.sub,
              );
              const firstName = (newPayload as Record<string, unknown>)
                .firstName as string | undefined;
              const lastName = (newPayload as Record<string, unknown>)
                .lastName as string | undefined;
              const email = (newPayload as Record<string, unknown>).email as
                | string
                | undefined;
              const name =
                [firstName, lastName].filter(Boolean).join(" ") ||
                email ||
                null;

              result = {
                userId: newPayload.sub ?? null,
                sessionId: payloadObj.sid,
                sessionToken: tokenObj.jwt,
                userName: name,
                userEmail: email || null,
              };
            }
          }
        }
      } catch (refreshErr) {
        console.log(
          "[AUTH] Falha ao renovar token:",
          refreshErr instanceof Error ? refreshErr.message : refreshErr,
        );
      }
    }
  }

  // Fluxo 2: Token opaco (dvb_...) — converter para JWT via Clerk
  if (!result && !token.startsWith("eyJ")) {
    console.log(
      "[AUTH] Fluxo 2: Token opaco, convertendo...",
      token.substring(0, 20) + "...",
    );
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
          userEmail: null,
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
    console.log(
      "[AUTH] Token do redirect Clerk:",
      clerkToken.substring(0, 30) + "...",
      "isJWT:",
      clerkToken.startsWith("eyJ"),
    );
    const user = await getUserFromToken(clerkToken);

    if (user) {
      console.log("[AUTH] Usuário extraído:", {
        userId: user.userId,
        sessionTokenIsJwt: user.sessionToken.startsWith("eyJ"),
        sessionTokenPrefix: user.sessionToken.substring(0, 30) + "...",
      });
      // Armazenar o JWT real no cookie (não o token opaco)
      // Isso evita chamadas repetidas ao Clerk para converter token opaco → JWT
      const jwtToStore = user.sessionToken.startsWith("eyJ")
        ? user.sessionToken
        : clerkToken;
      console.log("[AUTH] Cookie stored:", {
        isJwt: jwtToStore.startsWith("eyJ"),
        prefix: jwtToStore.substring(0, 30) + "...",
      });

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
        userEmail: user.userEmail,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      locals.userId = user.userId;
      locals.sessionId = user.sessionId;
      locals.sessionToken = user.sessionToken;
      locals.userName = user.userName;
      locals.userEmail = user.userEmail;
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
      // Se o token foi renovado (o sessionToken novo é diferente do token original no cookie),
      // precisamos atualizar o cookie.
      if (user.sessionToken !== token) {
        cookies.set(COOKIE_NAME, user.sessionToken, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 8, // 8 horas
        });
      }
      locals.userId = user.userId;
      locals.sessionId = user.sessionId;
      locals.sessionToken = user.sessionToken;
      locals.userName = user.userName;
      locals.userEmail = user.userEmail;
    } else {
      // Verificação falhou — deletar cookie e forçar re-login
      cookies.delete(COOKIE_NAME, { path: "/" });
      locals.userId = null;
      locals.sessionId = null;
      locals.sessionToken = null;
      locals.userName = null;
      locals.userEmail = null;
    }
  }

  const response = await resolve(event);

  // Headers de segurança em todas as respostas
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // HSTS apenas em produção
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
};
