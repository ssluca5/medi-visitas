import { json } from "@sveltejs/kit";
import { C as CLERK_SECRET_KEY } from "../../../../chunks/private.js";
import { createClerkClient } from "@clerk/backend";
const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });
const GET = async ({ locals }) => {
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
export { GET };
