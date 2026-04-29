import { t as PUBLIC_API_URL } from "../../chunks/public.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/+layout.server.ts
var load = async ({ locals, url, fetch }) => {
	if ([
		"/login",
		"/onboarding",
		"/planos"
	].some((r) => url.pathname.startsWith(r))) return {
		userId: locals.userId ?? null,
		sessionToken: locals.sessionToken ?? null
	};
	if (!locals.userId) throw redirect(302, "http://localhost:4321");
	try {
		const res = await fetch(`${PUBLIC_API_URL}/onboarding/status`, { headers: { Authorization: `Bearer ${locals.sessionToken}` } });
		if (res.ok) {
			const data = await res.json();
			if (!data.concluido) throw redirect(302, "/onboarding");
			if (data.status === "SUSPENSO") throw redirect(302, "/planos?motivo=trial_expirado");
			let userName = locals.userName ?? "Usuário";
			try {
				const meRes = await fetch(`${PUBLIC_API_URL}/me`, { headers: { Authorization: `Bearer ${locals.sessionToken}` } });
				if (meRes.ok) {
					const me = await meRes.json();
					if (me?.name) userName = me.name;
				}
			} catch {}
			return {
				userId: locals.userId,
				sessionToken: locals.sessionToken,
				userName,
				role: data.role,
				plano: data.plano,
				organizationId: data.organizationId,
				trialExpiraEm: data.trialExpiraEm
			};
		}
	} catch (e) {
		if (e && typeof e === "object" && "status" in e) throw e;
		console.error("Failed to check onboarding status:", e);
	}
	return {
		userId: locals.userId,
		sessionToken: locals.sessionToken,
		userName: locals.userName ?? "Usuário"
	};
};
//#endregion
export { load };
