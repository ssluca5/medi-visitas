import { PUBLIC_API_URL } from "$env/static/public";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const sessionToken = cookies.get("__session");

  if (!sessionToken) {
    throw redirect(302, "/");
  }

  try {
    const res = await fetch(`${PUBLIC_API_URL}/billing/status`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        plano: data.plano,
        status: data.status,
        diasRestantes: data.diasRestantes,
        temStripe: data.temStripe,
        limites: data.limites,
        transcricoes: data.transcricoes,
        sessionToken,
      };
    }
  } catch (error) {
    console.error("Erro ao buscar status do billing:", error);
  }

  return {
    plano: null,
    status: null,
    diasRestantes: null,
    sessionToken,
  };
};
