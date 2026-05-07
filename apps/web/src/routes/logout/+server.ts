import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Rota server-side de logout.
 *
 * Necessária porque o cookie __med_session é httpOnly e não pode ser
 * deletado pelo JavaScript do cliente. O fluxo é:
 *   1. Client chama clerk.signOut() → invalida sessão no Clerk
 *   2. Client redireciona para /logout
 *   3. Esta rota deleta o cookie e redireciona para /login
 */
export const GET: RequestHandler = async ({ cookies }) => {
  // Deletar o cookie de sessão da aplicação
  cookies.delete("__med_session", { path: "/" });
  // Deletar cookie legado caso exista
  cookies.delete("__session", { path: "/" });

  throw redirect(302, "/login");
};
