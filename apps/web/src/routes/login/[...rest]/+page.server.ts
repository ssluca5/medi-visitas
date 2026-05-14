import { redirect } from "@sveltejs/kit";
import { getLoginParams } from "$lib/login-params";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals, url }) => {
  const params = getLoginParams(url);
  if (locals.userId) {
    throw redirect(302, params.redirectUrl ?? "/dashboard");
  }

  return params;
};
