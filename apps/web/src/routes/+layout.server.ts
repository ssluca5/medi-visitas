import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { PUBLIC_API_URL } from "$env/static/public";

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
  // Public routes — no redirect
  const publicRoutes = ["/login", "/signup", "/onboarding", "/planos"];
  if (publicRoutes.some((r) => url.pathname.startsWith(r))) {
    return {};
  }

  if (!locals.userId) {
    throw redirect(302, "/login");
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

      return {
        userId: locals.userId,
        sessionToken: locals.sessionToken,
        userName: locals.userName ?? "Usuário",
        role: data.role,
        plano: data.plano,
        organizationId: data.organizationId,
        trialExpiraEm: data.trialExpiraEm,
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
