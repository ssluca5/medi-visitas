import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PUBLIC_LANDING_URL } from "$env/static/public";

export const POST: RequestHandler = async ({ cookies }) => {
  // Limpar o cookie de sessão
  cookies.delete("__med_session", { path: "/" });
  cookies.delete("__session", { path: "/" });

  throw redirect(302, PUBLIC_LANDING_URL ?? "http://localhost:4321");
};
