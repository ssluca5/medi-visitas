import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import Fastify from "fastify";
import { clerkClient } from "@clerk/backend";

// Mock do Clerk
jest.mock("@clerk/backend", () => ({
  clerkClient: {
    verifyToken: jest.fn(),
  },
}));

const { verifyToken } = clerkClient as jest.Mocked<typeof clerkClient>;

describe("GET /me", () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify();

    // Import do hook de auth
    const { verifyClerkToken } = await import("../hooks/auth");

    // Import da rota
    const meRoute = await import("./me");

    app.register(meRoute.default, { prefix: "/me" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("retorna 401 quando sem token", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/me",
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload)).toEqual({ error: "Unauthorized" });
  });

  it("retorna 401 quando token inválido", async () => {
    (verifyToken as jest.Mock).mockResolvedValueOnce(null as never);

    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: "Bearer invalid_token",
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("retorna 200 com dados do usuário quando token válido", async () => {
    const mockUser = {
      sub: "user_123",
      email_addresses: [{ email_address: "test@example.com" }],
      first_name: "João",
      last_name: "Silva",
    };

    (verifyToken as jest.Mock).mockResolvedValueOnce(mockUser as never);

    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: "Bearer valid_token",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body).toEqual({
      id: "user_123",
      email: "test@example.com",
      name: "João Silva",
    });
  });
});
