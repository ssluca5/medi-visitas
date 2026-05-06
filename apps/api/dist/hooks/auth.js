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
function getStringClaim(claims, keys) {
  for (const key of keys) {
    const value = claims[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}
function getEmailFromClaims(claims) {
  const directEmail = getStringClaim(claims, [
    "email",
    "emailAddress",
    "email_address",
    "primaryEmailAddress",
    "primary_email_address",
  ]);
  if (directEmail) return directEmail;
  const emailAddresses = claims.email_addresses;
  if (Array.isArray(emailAddresses)) {
    for (const item of emailAddresses) {
      if (item && typeof item === "object") {
        const email = getStringClaim(item, [
          "email_address",
          "emailAddress",
          "email",
        ]);
        if (email) return email;
      }
    }
  }
  return undefined;
}
function getNameFromClaims(claims) {
  const fullName = getStringClaim(claims, ["name", "fullName", "full_name"]);
  if (fullName) return fullName;
  const firstName = getStringClaim(claims, [
    "firstName",
    "first_name",
    "given_name",
  ]);
  const lastName = getStringClaim(claims, [
    "lastName",
    "last_name",
    "family_name",
  ]);
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || undefined;
}
export async function verifyClerkToken(request, reply) {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      request.log.warn("No token in Authorization header");
      reply.code(401).send({ error: "Unauthorized" });
      return;
    }
    const isJwt = token.startsWith("eyJ");
    request.log.info(
      {
        tokenType: isJwt ? "JWT" : "opaque",
        tokenPrefix: token.substring(0, 20) + "...",
      },
      "Verifying Clerk token",
    );
    const { CLERK_SECRET_KEY, CLERK_JWT_KEY, authorizedParties } = getEnvVars();
    request.log.info(
      {
        hasJwtKey: !!CLERK_JWT_KEY,
        hasAuthorizedParties: !!authorizedParties,
        authorizedParties,
      },
      "Auth config",
    );
    const payload = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
      jwtKey: CLERK_JWT_KEY,
      authorizedParties,
    });
    request.userId = payload.sub;
    request.orgId = payload.org_id ?? undefined;
    // Extrair dados do usuário dos claims do JWT
    const claims = payload;
    request.userEmail = getEmailFromClaims(claims);
    request.userName = getNameFromClaims(claims);
    request.log.info(
      { userId: request.userId, email: request.userEmail },
      "Token verified OK",
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    request.log.error(
      { err, errMsg, stack: err instanceof Error ? err.stack : undefined },
      "Clerk token verification failed",
    );
    reply.code(401).send({ error: "Unauthorized" });
  }
}
