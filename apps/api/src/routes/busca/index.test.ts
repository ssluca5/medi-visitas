import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";

let mockPrisma: any;
let mockVerifyTokenFn: any;
let app: any;

function mockAuth() {
  mockVerifyTokenFn.mockResolvedValueOnce({ sub: "user_123" });
}

function resetMocks() {
  mockPrisma.profissional.findMany.mockReset();
  mockVerifyTokenFn.mockReset();
}

describe("Busca Routes", () => {
  beforeAll(async () => {
    mockPrisma = {
      profissional: {
        findMany: jest.fn() as jest.Mock,
      },
    };
    mockVerifyTokenFn = jest.fn() as jest.Mock;

    const jestGlobal = jest as any;
    jestGlobal.unstable_mockModule("../../lib/prisma.js", () => ({
      prisma: mockPrisma,
    }));

    jestGlobal.unstable_mockModule("@clerk/backend", () => ({
      verifyToken: mockVerifyTokenFn,
    }));

    jestGlobal.unstable_mockModule("../../hooks/auth.js", () => ({
      verifyClerkToken: async (req: any, reply: any) => {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          reply.code(401).send({ error: "Unauthorized" });
          return;
        }
        req.userId = "user_123";
      },
    }));

    jestGlobal.unstable_mockModule("../../hooks/tenant.js", () => ({
      resolveTenant: async (req: any) => {
        req.organizationId = "org_123";
        req.role = "OWNER";
      },
    }));

    const Fastify = (await import("fastify")).default;
    const { ZodError } = await import("zod");
    app = Fastify();

    app.setErrorHandler((error: any, request: any, reply: any) => {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: "Dados inválidos",
          details: error.errors.map((e: any) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return reply.status(error.statusCode ?? 500).send({
        error: error.message,
      });
    });

    const buscaRoutes = await import("./index.js");
    app.register(buscaRoutes.default, { prefix: "/busca" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe("GET /busca", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/busca?q=João",
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({ error: "Unauthorized" });
    });

    it("retorna 400 com query menor que 2 caracteres", async () => {
      mockAuth();

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=a",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toBe(
        "Query deve ter pelo menos 2 caracteres",
      );
    });

    it("busca por nome com ILIKE", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([
        {
          id: "p1",
          nome: "Dr. João Silva",
          crm: "12345",
          especialidade: {
            id: "e1",
            nome: "Cardiologia",
            categoria: "Médicos",
          },
          endereco: { cidade: "São Paulo", estado: "SP" },
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=João",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.resultados).toHaveLength(1);
      expect(body.resultados[0].nome).toBe("Dr. João Silva");
      expect(body.resultados[0].tipo).toBe("PROFISSIONAL");
      expect(body.resultados[0].especialidade).toBe("Cardiologia");
      expect(body.resultados[0].cidade).toBe("São Paulo");
      expect(body.total).toBe(1);

      // Verify ILIKE search was called
      expect(mockPrisma.profissional.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            OR: expect.arrayContaining([
              expect.objectContaining({ nome: expect.any(Object) }),
              expect.objectContaining({ crm: expect.any(Object) }),
              expect.objectContaining({
                especialidade: expect.objectContaining({
                  nome: expect.any(Object),
                }),
              }),
              expect.objectContaining({
                endereco: expect.objectContaining({
                  cidade: expect.any(Object),
                }),
              }),
            ]),
          }),
        }),
      );
    });

    it("busca por especialidade.nome (join)", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([
        {
          id: "p1",
          nome: "Dra. Ana",
          crm: null,
          especialidade: {
            id: "e1",
            nome: "Dermatologia",
            categoria: "Médicos",
          },
          endereco: null,
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=Dermatologia",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.resultados[0].especialidade).toBe("Dermatologia");
    });

    it("busca por endereco.cidade (join)", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([
        {
          id: "p1",
          nome: "Dr. Carlos",
          crm: "99999",
          especialidade: null,
          endereco: { cidade: "Curitiba", estado: "PR" },
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=Curitiba",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.resultados[0].cidade).toBe("Curitiba");
    });

    it("respeita limite padrão de 10", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=test",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.profissional.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 }),
      );
    });

    it("respeita limite customizado", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=test&limite=5",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.profissional.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 }),
      );
    });

    it("retorna array vazio para sem matches", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=XYZNaoExiste",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.resultados).toHaveLength(0);
      expect(body.total).toBe(0);
    });

    it("retorna campos nulos corretamente", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([
        {
          id: "p1",
          nome: "Dr. SemDados",
          crm: null,
          especialidade: null,
          endereco: null,
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/busca?q=SemDados",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.resultados[0].crm).toBeNull();
      expect(body.resultados[0].especialidade).toBeNull();
      expect(body.resultados[0].cidade).toBeNull();
    });
  });
});
