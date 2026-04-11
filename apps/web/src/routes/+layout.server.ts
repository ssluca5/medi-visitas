import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Não redirecionar em rotas públicas
  const publicRoutes = ["/login", "/signup"];
  if (publicRoutes.some((r) => url.pathname.startsWith(r))) {
    return {};
  }

  if (!locals.userId) {
    throw redirect(302, "/login");
  }

  return {
    userId: locals.userId,
    sessionToken: locals.sessionToken,
    userName: locals.userName ?? "Usuário",
  };
};
