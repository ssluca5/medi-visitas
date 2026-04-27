import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";

// Objects that will be populated in beforeAll
let mockPrisma: any;
let mockVerifyTokenFn: any;
let app: any;

function mockAuth() {
  mockVerifyTokenFn.mockResolvedValueOnce({ sub: "user_123" });
}

function resetMocks() {
  mockPrisma.profissional.findMany.mockReset();
  mockPrisma.profissional.count.mockReset();
  mockPrisma.estagioLog.count.mockReset();
  mockPrisma.estagioLog.findMany.mockReset();
  mockPrisma.visita.count.mockReset();
  mockPrisma.visita.findMany.mockReset();
  mockVerifyTokenFn.mockReset();
}

describe("Pipeline Routes", () => {
  beforeAll(async () => {
    // Create mock objects inside beforeAll where jest is available
    mockPrisma = {
      profissional: {
        findMany: jest.fn() as jest.Mock,
        count: jest.fn() as jest.Mock,
      },
      estagioLog: {
        count: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
      },
      visita: {
        count: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
      },
    };
    mockVerifyTokenFn = jest.fn() as jest.Mock;

    // Mock modules must be registered before importing the module under test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Now import modules that depend on the mocked modules
    const Fastify = (await import("fastify")).default;
    const { ZodError } = await import("zod");
    app = Fastify();

    // Same error handler as app.ts for Zod validation
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

    const pipelineRoutes = await import("./index.js");
    app.register(pipelineRoutes.default, { prefix: "/pipeline" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  // ─── GET /pipeline ──────────────────────────────────

  describe("GET /pipeline", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/pipeline",
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({ error: "Unauthorized" });
    });

    it("retorna 200 com profissionais agrupados por estágio", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([
        {
          id: "1",
          nome: "Dr. João",
          crm: "12345",
          estagioPipeline: "PROSPECTADO",
          potencial: "ALTO",
          especialidade: { id: "e1", nome: "Cardio", categoria: "Medicos" },
          subEspecialidade: null,
          endereco: null,
        },
        {
          id: "2",
          nome: "Dra. Maria",
          crm: "67890",
          estagioPipeline: "VISITADO",
          potencial: "MEDIO",
          especialidade: { id: "e2", nome: "Pedia", categoria: "Medicos" },
          subEspecialidade: null,
          endereco: null,
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/pipeline",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.data.PROSPECTADO).toHaveLength(1);
      expect(body.data.VISITADO).toHaveLength(1);
      expect(body.data.INTERESSADO).toHaveLength(0);
      expect(body.data.PRESCRITOR).toHaveLength(0);
      expect(body.data.FIDELIZADO).toHaveLength(0);
      expect(body.totaisPorEstagio.PROSPECTADO).toBe(1);
      expect(body.totaisPorEstagio.VISITADO).toBe(1);
      expect(body.totalGeral).toBe(2);
    });

    it("filtra por busca", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/pipeline?busca=João",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.profissional.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            OR: expect.arrayContaining([
              expect.objectContaining({ nome: expect.any(Object) }),
              expect.objectContaining({ crm: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });
  });

  // ─── GET /pipeline/metricas ────────────────────────

  describe("GET /pipeline/metricas", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/pipeline/metricas",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 200 com métricas consolidadas", async () => {
      mockAuth();

      mockPrisma.profissional.count.mockResolvedValue(30);

      mockPrisma.visita.count
        .mockResolvedValueOnce(45)
        .mockResolvedValueOnce(12);

      // estagioLog.count is called 8 times via Promise.all (4 pairs × 2 each)
      // Use stable mock since order is non-deterministic with parallel execution
      mockPrisma.estagioLog.count.mockResolvedValue(5);

      mockPrisma.visita.findMany.mockResolvedValueOnce([
        { profissionalId: "1" },
        { profissionalId: "2" },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/pipeline/metricas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.totalProfissionais).toBe(30);
      expect(body.totalAtivos).toBe(30);
      expect(body.visitasRealizadas).toBe(45);
      expect(body.visitasPlanejadas).toBe(12);
      // Both chegaram and sairamOrigem return 5, so rate = 5/5 = 1
      expect(body.taxaConversaoProspectadoVisitado).toBe(1);
      expect(body.taxaConversaoVisitadoInteressado).toBe(1);
      expect(body.taxaConversaoInteressadoPrescritor).toBe(1);
      expect(body.taxaConversaoPrescritorFidelizado).toBe(1);
      expect(body.profissionaisSemVisitaUltimos30Dias).toBe(30);
      expect(body.mediaVisitasPorSemana).toBeDefined();
      expect(body.periodo).toBeDefined();
    });
  });

  // ─── GET /pipeline/evolucao ────────────────────────

  describe("GET /pipeline/evolucao", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/pipeline/evolucao",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 400 sem parâmetros obrigatórios", async () => {
      mockAuth();

      const res = await app.inject({
        method: "GET",
        url: "/pipeline/evolucao",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(400);
    });

    it("retorna 200 com série temporal semanal", async () => {
      mockAuth();

      mockPrisma.estagioLog.findMany.mockResolvedValueOnce([
        {
          estagioAnterior: "PROSPECTADO",
          estagioNovo: "VISITADO",
          createdAt: new Date("2026-03-09"),
        },
        {
          estagioAnterior: "VISITADO",
          estagioNovo: "INTERESSADO",
          createdAt: new Date("2026-03-12"),
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/pipeline/evolucao?dataInicio=2026-03-01&dataFim=2026-03-31&granularidade=semana",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0]).toHaveProperty("periodo");
      expect(body.data[0]).toHaveProperty("label");
      expect(body.data[0]).toHaveProperty("PROSPECTADO");
      expect(body.data[0]).toHaveProperty("VISITADO");
      expect(body.data[0]).toHaveProperty("INTERESSADO");
      expect(body.data[0]).toHaveProperty("PRESCRITOR");
      expect(body.data[0]).toHaveProperty("FIDELIZADO");
    });

    it("retorna 200 com série temporal mensal", async () => {
      mockAuth();

      mockPrisma.estagioLog.findMany.mockResolvedValueOnce([
        {
          estagioAnterior: "PROSPECTADO",
          estagioNovo: "VISITADO",
          createdAt: new Date("2026-03-09"),
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/pipeline/evolucao?dataInicio=2026-01-01&dataFim=2026-06-30&granularidade=mes",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);
    });
  });

  // ─── GET /pipeline/visitas-por-periodo ─────────────

  describe("GET /pipeline/visitas-por-periodo", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/pipeline/visitas-por-periodo",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 400 sem parâmetros obrigatórios", async () => {
      mockAuth();

      const res = await app.inject({
        method: "GET",
        url: "/pipeline/visitas-por-periodo",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(400);
    });

    it("retorna 200 com visitas agrupadas por período", async () => {
      mockAuth();

      mockPrisma.visita.findMany.mockResolvedValueOnce([
        { dataVisita: new Date("2026-03-09"), status: "REALIZADA" },
        { dataVisita: new Date("2026-03-10"), status: "AGENDADA" },
        { dataVisita: new Date("2026-03-15"), status: "CANCELADA" },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/pipeline/visitas-por-periodo?dataInicio=2026-03-01&dataFim=2026-03-31&granularidade=semana",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0]).toHaveProperty("AGENDADA");
      expect(body.data[0]).toHaveProperty("REALIZADA");
      expect(body.data[0]).toHaveProperty("CANCELADA");
      expect(body.data[0]).toHaveProperty("NAO_REALIZADA");
      expect(body.data[0]).toHaveProperty("total");
    });
  });

  // ─── GET /pipeline/exportar ────────────────────────

  describe("GET /pipeline/exportar", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/pipeline/exportar",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 200 com CSV e headers corretos", async () => {
      mockAuth();

      mockPrisma.profissional.findMany.mockResolvedValueOnce([
        {
          id: "1",
          nome: "Dr. João",
          crm: "12345",
          potencial: "ALTO",
          estagioPipeline: "PROSPECTADO",
          especialidade: { nome: "Cardiologia" },
          endereco: { cidade: "São Paulo", estado: "SP" },
          visitas: [{ dataVisita: new Date("2026-03-01") }],
          _count: { visitas: 5 },
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/pipeline/exportar",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toContain("text/csv");
      expect(res.headers["content-disposition"]).toContain("attachment");
      expect(res.headers["content-disposition"]).toContain("pipeline-");
      expect(res.payload).toContain("Nome,CRM/CRF/CRO");
      expect(res.payload).toContain("Dr. João");
      expect(res.payload).toContain("Cardiologia");
      expect(res.payload).toContain("PROSPECTADO");
    });
  });
});
