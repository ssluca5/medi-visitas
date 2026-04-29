import { t as apiFetch } from "../../../../chunks/api.js";
//#region src/routes/dashboard/notificacoes/+page.server.ts
var load = async ({ locals }) => {
	const token = locals.sessionToken;
	try {
		const res = await apiFetch("/notificacoes?page=1&pageSize=20", token);
		if (res.ok) return {
			...await res.json(),
			sessionToken: token
		};
		return {
			data: [],
			total: 0,
			naoLidas: 0,
			page: 1,
			pageSize: 20,
			totalPages: 0,
			sessionToken: token
		};
	} catch {
		return {
			data: [],
			total: 0,
			naoLidas: 0,
			page: 1,
			pageSize: 20,
			totalPages: 0,
			sessionToken: token
		};
	}
};
//#endregion
export { load };
