// @ts-nocheck
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (locals.userId) {
    redirect(303, "/dashboard");
  } else {
    redirect(303, "/login");
  }
};
