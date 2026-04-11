import { verifyToken } from "@clerk/backend";
import { verifyClerkToken } from "../hooks/auth";
export default async function meRoutes(app) {
  app.get("/me", { preHandler: [verifyClerkToken] }, async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) return reply.code(401).send({ error: "Unauthorized" });
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      return reply.code(200).send({
        id: session.sub,
        email: "",
        name: null,
      });
    } catch {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });
}
