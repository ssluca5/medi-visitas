import { t as apiFetch } from "../../../chunks/api.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/dashboard/+page.server.ts
var load = async ({ locals }) => {
	const token = locals.sessionToken;
	try {
		const [resumoRes, alertasRes, meRes] = await Promise.all([
			apiFetch("/dashboard/resumo", token),
			apiFetch("/dashboard/alertas", token),
			apiFetch("/me", token)
		]);
		if (resumoRes.status === 403) try {
			if ((await resumoRes.clone().json()).code === "ORGANIZATION_NOT_FOUND") throw redirect(302, "/onboarding");
		} catch (e) {
			if (e && typeof e === "object" && "status" in e) throw e;
		}
		const resumo = resumoRes.ok ? await resumoRes.json() : null;
		const alertas = alertasRes.ok ? await alertasRes.json() : [];
		const me = meRes.ok ? await meRes.json() : null;
		return {
			resumo,
			alertas,
			sessionToken: token,
			tourConcluidoEm: me?.tourConcluidoEm ?? null,
			role: me?.role ?? null
		};
	} catch (e) {
		if (e && typeof e === "object" && "status" in e) throw e;
		return {
			resumo: null,
			alertas: [],
			sessionToken: token,
			tourConcluidoEm: null,
			role: null
		};
	}
};
//#endregion
export { load };
