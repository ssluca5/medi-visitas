import { redirect } from "@sveltejs/kit";
import { PUBLIC_LANDING_URL } from "$env/static/public";
import type { LayoutServerLoad } from "./$types";

/**
 * Dashboard layout — reutiliza dados do root layout para evitar requests duplicadas.
 * O root +layout.server.ts já faz fetch de /onboarding/status e /me.
 */
export const load: LayoutServerLoad = async ({ locals, parent }) => {
  if (!locals.userId || !locals.sessionToken) {
    const landing = PUBLIC_LANDING_URL ?? "http://localhost:4321";
    const url = new URL(landing);
    url.searchParams.set("sign-in", "true");
    throw redirect(302, url.toString());
  }

  // Reutilizar dados do root layout (já tem role, plano, etc.)
  const parentData = await parent();

  return {
    userId: locals.userId,
    sessionToken: locals.sessionToken,
    userName: locals.userName,
    userEmail: locals.userEmail,
    role: (parentData as Record<string, unknown>).role ?? null,
    plano: (parentData as Record<string, unknown>).plano ?? null,
    statusOrg: (parentData as Record<string, unknown>).status ?? null,
    limites: (parentData as Record<string, unknown>).limites ?? null,
    temRelatorios:
      ((parentData as Record<string, unknown>).limites as
        | { temRelatorios?: boolean }
        | null)?.temRelatorios ?? false,
    temGestaoEquipe:
      ((parentData as Record<string, unknown>).limites as
        | { temGestaoEquipe?: boolean }
        | null)?.temGestaoEquipe ?? false,
    temIa:
      ((parentData as Record<string, unknown>).limites as
        | { temIa?: boolean }
        | null)?.temIa ?? false,
    pacotesIaDisponiveis:
      ((parentData as Record<string, unknown>).limites as
        | { pacotesIaDisponiveis?: boolean }
        | null)?.pacotesIaDisponiveis ?? false,
    tourConcluidoEm:
      ((parentData as Record<string, unknown>).tourConcluidoEm as
        | string
        | null) ?? null,
  };
};
