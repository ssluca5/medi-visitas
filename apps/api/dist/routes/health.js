import { prisma } from "../lib/prisma.js";
const CLERK_API = "https://api.clerk.com/v1";
async function checkDb() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
async function checkClerk() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey)
    return { ok: false, error: "CLERK_SECRET_KEY not configured" };
  try {
    const res = await fetch(`${CLERK_API}/clients?limit=1`, {
      headers: { Authorization: `Bearer ${secretKey}` },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
async function checkStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey)
    return { ok: false, error: "STRIPE_SECRET_KEY not configured" };
  try {
    const res = await fetch("https://api.stripe.com/v1/customers?limit=1", {
      headers: { Authorization: `Bearer ${secretKey}` },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
const healthRoutes = async (app) => {
  app.get("/health", async (_request, reply) => {
    const [db, clerk, stripe] = await Promise.all([
      checkDb(),
      checkClerk(),
      checkStripe(),
    ]);
    const allOk = db.ok && clerk.ok && stripe.ok;
    const body = {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database: db.ok ? "up" : "down",
        clerk: clerk.ok ? "up" : "down",
        stripe: stripe.ok ? "up" : "down",
      },
    };
    if (!allOk) {
      return reply.status(503).send(body);
    }
    return reply.send(body);
  });
};
export default healthRoutes;
