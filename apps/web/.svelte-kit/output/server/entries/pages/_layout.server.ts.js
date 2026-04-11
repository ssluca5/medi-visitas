import { redirect } from "@sveltejs/kit";
const load = async ({ locals, url }) => {
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
export { load };
