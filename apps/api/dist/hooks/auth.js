import { verifyToken } from "@clerk/backend";
function getEnvVars() {
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  const CLERK_JWT_KEY = process.env.CLERK_JWT_KEY;
  if (!CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY environment variable is required");
  }
  if (!CLERK_JWT_KEY) {
    throw new Error("CLERK_JWT_KEY environment variable is required");
  }
  // authorizedParties (azp claim) — CSRF protection
  // Comma-separated list of allowed origins in CLERK_AUTHORIZED_PARTIES env var
  const CLERK_AUTHORIZED_PARTIES = process.env.CLERK_AUTHORIZED_PARTIES;
  const authorizedParties = CLERK_AUTHORIZED_PARTIES
    ? CLERK_AUTHORIZED_PARTIES.split(",").map((s) => s.trim())
    : undefined;
  return { CLERK_SECRET_KEY, CLERK_JWT_KEY, authorizedParties };
}
export async function verifyClerkToken(request, reply) {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      reply.code(401).send({ error: "Unauthorized" });
      return;
    }
    const { CLERK_SECRET_KEY, CLERK_JWT_KEY, authorizedParties } = getEnvVars();
    const payload = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
      jwtKey: CLERK_JWT_KEY,
      authorizedParties,
    });
    request.userId = payload.sub;
    request.orgId = payload.org_id ?? undefined;
    // Extrair dados do usuário dos claims do JWT
    const claims = payload;
    const email = claims.email;
    const firstName = claims.first_name;
    const lastName = claims.last_name;
    const name = claims.name;
    request.userEmail = email ?? undefined;
    request.userName =
      name ||
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      undefined;
  } catch (err) {
    request.log.error({ err }, "Clerk token verification failed");
    reply.code(401).send({ error: "Unauthorized" });
  }
}
