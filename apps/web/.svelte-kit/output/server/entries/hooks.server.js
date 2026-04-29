import { t as CLERK_SECRET_KEY } from "../chunks/private.js";
import { redirect } from "@sveltejs/kit";
import { createClerkClient, verifyToken } from "@clerk/backend";
//#region src/hooks.server.ts
var clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });
var COOKIE_NAME = "__med_session";
var CACHE_TTL_MS = 3300 * 1e3;
var MAX_CACHE_SIZE = 1e3;
var authCache = /* @__PURE__ */ new Map();
setInterval(() => {
	const now = Date.now();
	const keysToDelete = [];
	for (const [key, val] of authCache.entries()) if (val.expiresAt < now) keysToDelete.push(key);
	if (authCache.size > MAX_CACHE_SIZE) {
		const sortedEntries = [...authCache.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt);
		const removeCount = authCache.size - MAX_CACHE_SIZE;
		for (let i = 0; i < removeCount; i++) keysToDelete.push(sortedEntries[i][0]);
	}
	keysToDelete.forEach((k) => authCache.delete(k));
}, 5 * 6e4);
async function getUserFromToken(token) {
	const cached = authCache.get(token);
	if (cached && cached.expiresAt > Date.now()) return {
		userId: cached.userId,
		sessionId: cached.sessionId,
		sessionToken: cached.sessionToken,
		userName: cached.userName
	};
	let result = null;
	if (token.startsWith("eyJ")) try {
		const payload = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
		const firstName = payload.firstName;
		const lastName = payload.lastName;
		const email = payload.email;
		const name = [firstName, lastName].filter(Boolean).join(" ") || email || null;
		result = {
			userId: payload.sub ?? null,
			sessionId: payload.sid ?? null,
			sessionToken: token,
			userName: name
		};
	} catch {}
	if (!result && !token.startsWith("eyJ")) try {
		const session = (await clerk.clients.verifyClient(token)).sessions?.find((s) => s.status === "active");
		if (session) {
			let sessionToken = token;
			try {
				const tokenObj = await clerk.sessions.getToken(session.id, "medivisitas");
				if (tokenObj && tokenObj.jwt) sessionToken = tokenObj.jwt;
			} catch {}
			result = {
				userId: session.userId,
				sessionId: session.id,
				sessionToken,
				userName: null
			};
		}
	} catch {}
	if (result) authCache.set(token, {
		...result,
		expiresAt: Date.now() + CACHE_TTL_MS
	});
	return result;
}
var handle = async ({ event, resolve }) => {
	const { url, cookies, locals } = event;
	const { pathname } = url;
	if (pathname.startsWith("/_app/") || pathname.startsWith("/favicon") || pathname.startsWith("/api/token")) return resolve(event);
	const clerkToken = url.searchParams.get("__clerk_db_jwt") ?? url.searchParams.get("__session_token");
	if (clerkToken) {
		const user = await getUserFromToken(clerkToken);
		if (user) {
			const jwtToStore = user.sessionToken.startsWith("eyJ") ? user.sessionToken : clerkToken;
			cookies.set(COOKIE_NAME, jwtToStore, {
				path: "/",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 3600 * 8
			});
			authCache.set(jwtToStore, {
				userId: user.userId,
				sessionId: user.sessionId,
				sessionToken: user.sessionToken,
				userName: user.userName,
				expiresAt: Date.now() + CACHE_TTL_MS
			});
			locals.userId = user.userId;
			locals.sessionId = user.sessionId;
			locals.sessionToken = user.sessionToken;
			locals.userName = user.userName;
		}
		const cleanUrl = new URL(url);
		cleanUrl.searchParams.delete("__clerk_db_jwt");
		cleanUrl.searchParams.delete("__session_token");
		throw redirect(302, cleanUrl.pathname || "/dashboard");
	}
	const token = cookies.get(COOKIE_NAME) ?? cookies.get("__session");
	if (token) {
		const user = await getUserFromToken(token);
		if (user) {
			locals.userId = user.userId;
			locals.sessionId = user.sessionId;
			locals.sessionToken = user.sessionToken;
			locals.userName = user.userName;
		} else cookies.delete(COOKIE_NAME, { path: "/" });
	}
	return resolve(event);
};
//#endregion
export { handle };
