import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // Se já tem sessão ativa, redirecionar para o dashboard
  if (locals.userId) {
    throw redirect(302, "/dashboard");
  }

  return {};
};
