import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { PUBLIC_API_URL, PUBLIC_LANDING_URL } from "$env/static/public";

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {
  // Public routes — no redirect
  const publicRoutes = [
    "/login",
    "/signup",
    "/onboarding",
    "/planos",
    "/logout",
    "/aceitar-convite",
  ];
  if (publicRoutes.some((r) => url.pathname.startsWith(r))) {
    return {
      userId: locals.userId ?? null,
      sessionToken: locals.sessionToken ?? null,
    };
  }

  if (!locals.userId) {
    throw redirect(302, PUBLIC_LANDING_URL ?? "https://medivisitas.com");
  }

  try {
    const headers = { Authorization: `Bearer ${locals.sessionToken}` };

    // Paralelizar onboarding/status e /me — reduz latência em ~50%
    const [statusRes, meRes] = await Promise.allSettled([
      fetch(`${PUBLIC_API_URL}/onboarding/status`, { headers }),
      fetch(`${PUBLIC_API_URL}/me`, { headers, cache: "no-store" }),
    ]);

    // Processar onboarding status
    if (statusRes.status !== "fulfilled" || !statusRes.value.ok) {
      throw new Error("Falha ao verificar status da organização");
    }

    const data = await statusRes.value.json();

    if (!data.concluido) {
      throw redirect(302, "/onboarding");
    }

    if (data.status === "SUSPENSO") {
      throw redirect(302, "/planos?motivo=trial_expirado");
    }

    // Processar /me (já estava paralelo com /onboarding/status)
    let userName = locals.userName ?? "Usuário";
    let avatarUrl: string | null = null;
    let tourConcluidoEm: string | null = null;
    if (meRes.status === "fulfilled" && meRes.value.ok) {
      try {
        const me = await meRes.value.json();
        if (me?.name) userName = me.name;
        avatarUrl = me?.avatarUrl ?? null;
        tourConcluidoEm = me?.tourConcluidoEm ?? null;
      } catch {
        // JSON parse falhou — usar userName do JWT
      }
    }

    return {
      userId: locals.userId,
      sessionToken: locals.sessionToken,
      userName,
      avatarUrl,
      role: data.role,
      plano: data.plano,
      status: data.status,
      organizationId: data.organizationId,
      trialExpiraEm: data.trialExpiraEm,
      limites: data.limites,
      tourConcluidoEm,
    };
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
