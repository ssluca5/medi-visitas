import { apiFetch } from "$lib/api";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const { token } = params;

  try {
    // Fetch public invite info (works without auth too if setup, but apiFetch tries to send token if it exists)
    const res = await apiFetch(
      `/organizacao/convites/token/${token}`,
      locals.sessionToken,
    );

    if (!res.ok) {
      return { error: "Convite inválido ou expirado.", token };
    }

    const convite = await res.json();
    return { convite, token, sessionToken: locals.sessionToken };
  } catch (e) {
    return { error: "Erro ao buscar dados do convite.", token };
  }
};
