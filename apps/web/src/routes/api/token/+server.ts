import { json } from "@sveltejs/kit";
import { CLERK_SECRET_KEY } from "$env/static/private";
import { createClerkClient } from "@clerk/backend";
import type { RequestHandler } from "./$types";

const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.sessionId) {
    return json({ error: "No session id found" }, { status: 401 });
  }

  try {
    let tokenInfo;
    try {
      tokenInfo = await clerk.sessions.getToken(
        locals.sessionId,
        "access_token",
      );
    } catch (tokenError) {
      console.error("Falha ao obter access_token:", tokenError);
      // Tentativa de fallback com session_token
      tokenInfo = await clerk.sessions.getToken(
        locals.sessionId,
        "session_token",
      );
    }

    if (tokenInfo && tokenInfo.jwt) {
      return json({ token: tokenInfo.jwt });
    }
    return json({ error: "Token empty" }, { status: 500 });
  } catch (error) {
    console.error("Token refresh error:", error);
    return json({ error: "Error refreshing token" }, { status: 500 });
  }
};
