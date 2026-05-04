import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { PUBLIC_API_URL, PUBLIC_LANDING_URL } from "$env/static/public";

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
  // Public routes — no redirect
  const publicRoutes = ["/login", "/signup", "/onboarding", "/planos"];
  if (publicRoutes.some((r) => url.pathname.startsWith(r))) {
    return {
      userId: locals.userId ?? null,
      sessionToken: locals.sessionToken ?? null,
    };
  }

  if (!locals.userId) {
    throw redirect(302, PUBLIC_LANDING_URL ?? "https://medivisitas.com");
  }

  // Check onboarding status
  try {
    const res = await fetch(`${PUBLIC_API_URL}/onboarding/status`, {
      headers: { Authorization: `Bearer ${locals.sessionToken}` },
    });

    if (res.ok) {
      const data = await res.json();

      if (!data.concluido) {
        throw redirect(302, "/onboarding");
      }

      if (data.status === "SUSPENSO") {
        throw redirect(302, "/planos?motivo=trial_expirado");
      }

      // Buscar nome real e tourConcluidoEm do usuário via /me
      let userName = locals.userName ?? "Usuário";
      let tourConcluidoEm: string | null = null;
      try {
        const meRes = await fetch(`${PUBLIC_API_URL}/me`, {
          headers: { Authorization: `Bearer ${locals.sessionToken}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          if (me?.name) userName = me.name;
          tourConcluidoEm = me?.tourConcluidoEm ?? null;
        }
      } catch {
        // Falha ao buscar /me — usar userName do JWT
      }

      return {
        userId: locals.userId,
        sessionToken: locals.sessionToken,
        userName,
        role: data.role,
        plano: data.plano,
        status: data.status,
        organizationId: data.organizationId,
        trialExpiraEm: data.trialExpiraEm,
        limites: data.limites,
        tourConcluidoEm,
      };
    }
  } catch (e) {
    // If redirect, re-throw
    if (e && typeof e === "object" && "status" in e) throw e;
    // API error — let user through but log
    console.error("Failed to check onboarding status:", e);
  }

  return {
    userId: locals.userId,
    sessionToken: locals.sessionToken,
    userName: locals.userName ?? "Usuário",
  };
};
