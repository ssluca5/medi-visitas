import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

let mockFindFirst: any;
let mockCreate: any;
let mockOrgCreate: any;
let mockOrgFindUnique: any;
let app: any;

describe("Onboarding routes", () => {
  beforeAll(async () => {
    process.env.CLERK_SECRET_KEY = "test_secret";
    process.env.CLERK_JWT_KEY = "test_jwt";
    mockFindFirst = jest.fn();
    mockCreate = jest.fn();
    mockOrgCreate = jest.fn();
    mockOrgFindUnique = jest.fn();

    const jestGlobal = jest as any;
    jestGlobal.unstable_mockModule("../../lib/prisma.js", () => ({
      prisma: {
        organizationMembro: { findFirst: mockFindFirst, create: mockCreate },
        organization: { create: mockOrgCreate, findUnique: mockOrgFindUnique },
        user: { upsert: jest.fn<any>().mockResolvedValue({}) },
      },
    }));
    jestGlobal.unstable_mockModule("@clerk/backend", () => ({
      verifyToken: async () => ({ sub: "user_123" }),
    }));
    jestGlobal.unstable_mockModule("../../hooks/auth.js", () => ({
      verifyClerkToken: async (req: any, reply: any) => {
        const token = req.headers.authorization;
        if (!token) {
          reply.code(401).send({ error: "Unauthorized" });
          return;
        }
        req.userId = "user_123";
      },
    }));

    const Fastify = (await import("fastify")).default;
    const { ZodError } = await import("zod");

    app = Fastify();
    app.setErrorHandler((error: any, _request: any, reply: any) => {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: "Dados inválidos",
          details: error.errors.map((e: any) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return reply
        .status(error.statusCode ?? 500)
        .send({ error: error.message });
    });

    const onboardingRoutes = (await import("./index.js")).default;
    app.register(onboardingRoutes);
    await app.ready();
  });

  beforeEach(() => {
    mockFindFirst.mockReset();
    mockCreate.mockReset();
    mockOrgCreate.mockReset();
    mockOrgFindUnique.mockReset();
  });

  describe("GET /status", () => {
    it("returns concluido=false when no membership", async () => {
      mockFindFirst.mockResolvedValue(null);
      const res = await app.inject({
        method: "GET",
        url: "/status",
        headers: { authorization: "Bearer test" },
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({ concluido: false });
    });

    it("returns concluido=true with org details when member exists", async () => {
      mockFindFirst.mockResolvedValue({
        organizationId: "org1",
        role: "OWNER",
        organization: {
          plano: "TRIAL",
          status: "TRIAL_ATIVO",
          trialExpiraEm: new Date(),
        },
      } as any);
      const res = await app.inject({
        method: "GET",
        url: "/status",
        headers: { authorization: "Bearer test" },
      });
      expect(res.json()).toEqual(
        expect.objectContaining({ concluido: true, role: "OWNER" }),
      );
    });
  });

  describe("POST /individual", () => {
    it("creates org with limiteUsuarios=1 and OWNER member", async () => {
      mockFindFirst.mockResolvedValue(null);
      mockOrgCreate.mockResolvedValue({ id: "org_new" } as any);
      mockCreate.mockResolvedValue({} as any);
      const res = await app.inject({
        method: "POST",
        url: "/individual",
        headers: { authorization: "Bearer test" },
      });
      expect(res.statusCode).toBe(201);
      expect(mockOrgCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ limiteUsuarios: 1 }),
        }),
      );
    });
  });

  describe("POST /empresa", () => {
    it("creates org with company name and OWNER member", async () => {
      mockFindFirst.mockResolvedValue(null);
      mockOrgCreate.mockResolvedValue({ id: "org_new" } as any);
      mockCreate.mockResolvedValue({} as any);
      const res = await app.inject({
        method: "POST",
        url: "/empresa",
        headers: { authorization: "Bearer test" },
        payload: { nomeEmpresa: "Farmácia Teste" },
      });
      expect(res.statusCode).toBe(201);
      expect(mockOrgCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ nome: "Farmácia Teste" }),
        }),
      );
    });
  });
});
