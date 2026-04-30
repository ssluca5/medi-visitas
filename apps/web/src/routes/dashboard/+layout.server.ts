import { redirect } from "@sveltejs/kit";
import { PUBLIC_LANDING_URL } from "$env/static/public";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.userId) {
    throw redirect(302, PUBLIC_LANDING_URL ?? "http://localhost:4321");
  }

  return {
    userId: locals.userId,
    sessionToken: locals.sessionToken,
    userName: locals.userName,
  };
};
