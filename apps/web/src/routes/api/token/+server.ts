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
        "medivisitas",
      );
    } catch (tokenError) {
      console.error("Falha ao obter token do template medivisitas:", tokenError);
      return json({ error: "Template token failed" }, { status: 500 });
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
