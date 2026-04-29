import { t as PUBLIC_API_URL } from "./public.js";
//#region src/lib/api.ts
/**
* Fetch autenticado para a API backend.
* O token JWT é passado pelo layout via data prop.
* Redireciona para /login em caso de 401 (token expirado).
*/
async function apiFetch(path, token, options = {}) {
	const headers = { ...options.headers };
	if (token) headers["Authorization"] = `Bearer ${token}`;
	if (options.body && typeof options.body === "string") headers["Content-Type"] = "application/json";
	const res = await fetch(`${PUBLIC_API_URL}${path}`, {
		...options,
		headers
	});
	if (res.status === 401) {
		if (typeof window !== "undefined") window.location.href = "/login";
	}
	if (res.status === 403) try {
		if ((await res.clone().json()).code === "ORGANIZATION_NOT_FOUND") {
			if (typeof window !== "undefined") window.location.href = "/onboarding";
			return res;
		}
	} catch {}
	return res;
}
//#endregion
export { apiFetch as t };
