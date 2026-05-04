import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "@jest/globals";

let mockVerifyTokenFn: any;
let mockUserUpsert: any;
let mockMemberFindFirst: any;
let app: any;

describe("GET /me", () => {
  beforeAll(async () => {
    mockVerifyTokenFn = jest.fn() as jest.Mock;
    mockUserUpsert = jest.fn();
    mockMemberFindFirst = jest.fn();

    const jestGlobal = jest as any;
    jestGlobal.unstable_mockModule("@clerk/backend", () => ({
      verifyToken: mockVerifyTokenFn,
    }));

    jestGlobal.unstable_mockModule("../lib/prisma.js", () => ({
      prisma: {
        user: { upsert: mockUserUpsert },
        organizationMembro: { findFirst: mockMemberFindFirst },
      },
    }));

    jestGlobal.unstable_mockModule("../hooks/auth.js", () => ({
      verifyClerkToken: async (req: any, reply: any) => {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token || token === "invalid_token") {
          reply.code(401).send({ error: "Unauthorized" });
          return;
        }
        req.userId = "user_123";
      },
    }));

    jestGlobal.unstable_mockModule("../hooks/tenant.js", () => ({
      resolveTenant: async (req: any) => {
        req.organizationId = "org_123";
        req.role = "OWNER";
      },
    }));

    const Fastify = (await import("fastify")).default;
    app = Fastify();

    const meRoute = await import("./me.js");
    app.register(meRoute.default);
    await app.ready();
  });

  beforeEach(() => {
    mockVerifyTokenFn.mockReset();
    mockUserUpsert.mockReset();
    mockMemberFindFirst.mockReset();
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
    mockVerifyTokenFn.mockResolvedValueOnce(null as never);

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

    mockVerifyTokenFn.mockResolvedValueOnce(mockUser as never);
    mockUserUpsert.mockResolvedValueOnce({
      id: "db_user_123",
      email: "user_123@placeholder.local",
      name: null,
      tourConcluidoEm: null,
    });
    mockMemberFindFirst.mockResolvedValueOnce(null);

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
      id: expect.any(String),
      email: "user_123@placeholder.local",
      name: null,
      organizationId: null,
      role: null,
      tourConcluidoEm: null,
      organization: null,
    });
  });
});
