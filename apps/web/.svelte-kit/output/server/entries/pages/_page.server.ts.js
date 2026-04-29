import { redirect } from "@sveltejs/kit";
//#region src/routes/+page.server.ts
var load = async ({ locals }) => {
	if (locals.userId) redirect(303, "/dashboard");
	else redirect(303, "/login");
};
//#endregion
export { load };
