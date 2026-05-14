import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, parent, url }) => {
  const token = locals.sessionToken;
  const parentData = await parent();

  if (parentData.role !== "OWNER" || !parentData.temGestaoEquipe) {
    throw redirect(302, "/dashboard");
  }

  const membroId = url.searchParams.get("membroId") || "";

  try {
    const resumoUrl = membroId
      ? `/gestor/resumo?userId=${membroId}`
      : "/gestor/resumo";

    const [resumoRes, membrosRes] = await Promise.all([
      apiFetch(resumoUrl, token),
      apiFetch("/organizacao/membros", token),
    ]);

    const resumo = resumoRes.ok ? await resumoRes.json() : null;
    const membrosData = membrosRes.ok ? await membrosRes.json() : { data: [] };

    return {
      sessionToken: token,
      resumo,
      membros: membrosData.data || [],
      membroIdSelecionado: membroId,
    };
  } catch (e) {
    console.error("Erro na carga do painel de gestor:", e);
    return {
      sessionToken: token,
      resumo: null,
      membros: [],
      membroIdSelecionado: membroId,
    };
  }
};
