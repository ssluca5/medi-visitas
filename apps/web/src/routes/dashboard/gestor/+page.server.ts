import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;

  if (locals.role !== "OWNER") {
    throw redirect(302, "/dashboard");
  }

  try {
    const res = await apiFetch("/gestor/resumo", token);

    if (!res.ok) {
      throw new Error(
        "Falha ao buscar resumo do gestor. Tente novamente mais tarde.",
      );
    }

    const resumo = await res.json();

    return {
      sessionToken: token,
      resumo,
    };
  } catch (e) {
    console.error("Erro na carga do painel de gestor:", e);
    return {
      sessionToken: token,
      resumo: null,
    };
  }
};
