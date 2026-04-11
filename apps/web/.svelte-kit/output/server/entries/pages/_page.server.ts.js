import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.userId) {
    redirect(303, "/dashboard");
  } else {
    redirect(303, "/login");
  }
};
export { load };
