import type { PageServerLoad } from "./$types";
import type { DashboardResumoV2 } from "$lib/types";
import { apiFetch } from "$lib/api";
import { redirect } from "@sveltejs/kit";

async function safeFetch(
  path: string,
  token: string | null,
): Promise<Response | null> {
  try {
    return await apiFetch(path, token);
  } catch {
    return null;
  }
}

export const load: PageServerLoad = async ({ locals, parent }) => {
  const token = locals.sessionToken;

  if (!token) {
    return {
      resumo: null as DashboardResumoV2 | null,
      sessionToken: token,
      plano: null as string | null,
      pacotesIaDisponiveis: false,
    };
  }

  const parentData = await parent();

  const [resumoRes, meRes] = await Promise.all([
    safeFetch("/dashboard/resumo", token),
    safeFetch("/me", token),
  ]);

  if (resumoRes?.status === 403) {
    try {
      const body = await resumoRes.clone().json();
      if (body.code === "ORGANIZATION_NOT_FOUND") {
        throw redirect(302, "/onboarding");
      }
    } catch (e) {
      if (e && typeof e === "object" && "status" in e) throw e;
    }
  }

  const resumo: DashboardResumoV2 | null = resumoRes?.ok
    ? await resumoRes.json()
    : null;
  const me = meRes?.ok ? await meRes.json() : null;

  return {
    resumo,
    sessionToken: token,
    tourConcluidoEm:
      ((parentData as Record<string, unknown>).tourConcluidoEm as
        | string
        | null) ??
      me?.tourConcluidoEm ??
      null,
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
