import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import { redirect } from "@sveltejs/kit";

/**
 * Helper seguro para fetch que retorna null em vez de propagar erros.
 * Evita que falhas na API (429/500) causem loops de re-render.
 */
async function safeFetch(
  path: string,
  token: string | null,
): Promise<Response | null> {
  try {
    const res = await apiFetch(path, token);
    return res;
  } catch {
    return null;
  }
}

export const load: PageServerLoad = async ({ locals, parent }) => {
  const token = locals.sessionToken;

  // Sem token — retornar dados vazios (layout vai redirecionar para login)
  if (!token) {
    return {
      resumo: null,
      alertas: [],
      sessionToken: token,
      tourConcluidoEm: null,
      role: null,
    };
  }

  // Buscar dados do layout (role já vem de lá via /me)
  const parentData = await parent();

  const [resumoRes, alertasRes] = await Promise.all([
    safeFetch("/dashboard/resumo", token),
    safeFetch("/dashboard/alertas", token),
  ]);

  // Se o resumo retornar 403 com ORGANIZATION_NOT_FOUND, redirecionar
  if (resumoRes?.status === 403) {
    try {
      const body = await resumoRes.clone().json();
      if (body.code === "ORGANIZATION_NOT_FOUND") {
        throw redirect(302, "/onboarding");
      }
    } catch (e) {
      if (e && typeof e === "object" && "status" in e) throw e; // redirect
    }
  }

  const resumo = resumoRes?.ok ? await resumoRes.json() : null;
  const alertas = alertasRes?.ok ? await alertasRes.json() : [];

  return {
    resumo,
    alertas,
    sessionToken: token,
    tourConcluidoEm:
      ((parentData as Record<string, unknown>).tourConcluidoEm as
        | string
        | null) ?? null,
    role:
      ((parentData as Record<string, unknown>).role as string | null) ?? null,
    plano:
      ((parentData as Record<string, unknown>).plano as string | null) ?? null,
    pacotesIaDisponiveis:
      (
        (parentData as Record<string, unknown>).limites as {
          pacotesIaDisponiveis?: boolean;
        } | null
      )?.pacotesIaDisponiveis ?? false,
  };
};
