import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;

  if (locals.role !== "OWNER") {
    throw redirect(302, "/dashboard");
  }

  return {
    sessionToken: token,
  };
};
