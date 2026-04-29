import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;

  try {
    const [resumoRes, alertasRes, meRes] = await Promise.all([
      apiFetch("/dashboard/resumo", token),
      apiFetch("/dashboard/alertas", token),
      apiFetch("/me", token),
    ]);

    // Se o resumo retornar 403 com ORGANIZATION_NOT_FOUND, redirecionar
    if (resumoRes.status === 403) {
      try {
        const body = await resumoRes.clone().json();
        if (body.code === "ORGANIZATION_NOT_FOUND") {
          throw redirect(302, "/onboarding");
        }
      } catch (e) {
        if (e && typeof e === "object" && "status" in e) throw e; // redirect
      }
    }

    const resumo = resumoRes.ok ? await resumoRes.json() : null;
    const alertas = alertasRes.ok ? await alertasRes.json() : [];
    const me = meRes.ok ? await meRes.json() : null;

    return {
      resumo,
      alertas,
      sessionToken: token,
      tourConcluidoEm: me?.tourConcluidoEm ?? null,
      role: me?.role ?? null,
    };
  } catch (e) {
    // Deixar redirects passarem
    if (e && typeof e === "object" && "status" in e) throw e;
    return {
      resumo: null,
      alertas: [],
      sessionToken: token,
      tourConcluidoEm: null,
      role: null,
    };
  }
};
