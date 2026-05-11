import type { FastifyRequest, FastifyReply } from "fastify";
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

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    orgId?: string;
    userEmail?: string;
    userEmailVerified?: boolean;
    userName?: string;
  }
}

function getStringClaim(
  claims: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = claims[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function getEmailFromClaims(
  claims: Record<string, unknown>,
): string | undefined {
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
        const email = getStringClaim(item as Record<string, unknown>, [
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

function getNameFromClaims(
  claims: Record<string, unknown>,
): string | undefined {
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

function getEmailVerifiedFromClaims(
  claims: Record<string, unknown>,
): boolean {
  const emailAddresses = claims.email_addresses;
  if (Array.isArray(emailAddresses)) {
    for (const item of emailAddresses) {
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const verification = obj.verification as Record<string, unknown> | undefined;
        if (verification && verification.status === "verified") return true;
      }
    }
  }
  // Fallback: some JWT templates expose email_verified directly
  if (claims.email_verified === true) return true;
  return false;
}

export async function verifyClerkToken(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    // Origin check on state-changing methods (CSRF protection)
    const method = request.method;
    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
      const origin = request.headers.origin;
      const allowedOrigins = process.env.CLERK_AUTHORIZED_PARTIES?.split(",").map((s) => s.trim());
      if (origin && allowedOrigins?.length && !allowedOrigins.includes(origin)) {
        reply.code(403).send({ error: "Forbidden" });
        return;
      }
    }

    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      request.log.warn("No token in Authorization header");
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
    const claims = payload as Record<string, unknown>;
    request.userEmail = getEmailFromClaims(claims);
    request.userEmailVerified = getEmailVerifiedFromClaims(claims);
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
