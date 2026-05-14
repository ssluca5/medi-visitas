import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, parent }) => {
  const token = locals.sessionToken;
  const parentData = await parent();

  if (parentData.role !== "OWNER" || !parentData.temGestaoEquipe) {
    throw redirect(302, "/dashboard");
  }

  try {
    const [meRes, membrosRes, convitesRes, infoRes, transcricoesRes] =
      await Promise.all([
        apiFetch("/me", token),
        apiFetch("/organizacao/membros", token),
        apiFetch("/organizacao/convites", token),
        apiFetch("/organizacao/info", token),
        apiFetch("/transcricoes/equipe", token),
      ]);

    const me = meRes.ok ? await meRes.json() : null;
    const membrosData = membrosRes.ok ? await membrosRes.json() : { data: [] };
    const convitesData = convitesRes.ok
      ? await convitesRes.json()
      : { data: [] };
    const info = infoRes.ok ? await infoRes.json() : null;
    const transcricoes = transcricoesRes.ok
      ? await transcricoesRes.json()
      : null;
    const transcricoesError = transcricoesRes.ok
      ? null
      : ((await transcricoesRes.json().catch(() => null))?.error ??
        "Nao foi possivel carregar as cotas de IA.");

    return {
      sessionToken: token,
      me,
      equipe: {
        membros: membrosData.data || [],
        convites: convitesData.data || [],
        info,
        transcricoes,
        transcricoesError,
      },
    };
  } catch {
    return {
      sessionToken: token,
      me: null,
      equipe: {
        membros: [],
        convites: [],
        info: null,
        transcricoes: null,
        transcricoesError: "Nao foi possivel carregar os dados da equipe.",
      },
    };
  }
};
