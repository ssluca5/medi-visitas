import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, parent }) => {
  const token = locals.sessionToken;
  const parentData = await parent();

  if (!parentData.temRelatorios) {
    throw redirect(302, "/dashboard");
  }

  return {
    sessionToken: token,
  };
};
