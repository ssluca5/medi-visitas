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
  mockPrisma.profissional.findFirst.mockReset();
  mockPrisma.visita.findMany.mockReset();
  mockPrisma.estagioLog.findMany.mockReset();
  mockPrisma.agendaItem.findMany.mockReset();
  mockVerifyTokenFn.mockReset();
}

describe("Timeline Routes", () => {
  beforeAll(async () => {
    mockPrisma = {
      profissional: {
        findFirst: jest.fn() as jest.Mock,
      },
      visita: {
        findMany: jest.fn() as jest.Mock,
      },
      estagioLog: {
        findMany: jest.fn() as jest.Mock,
      },
      agendaItem: {
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

    const { timelineRoutes } = await import("./timeline.js");
    app.register(timelineRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe("GET /profissionais/:id/timeline", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/profissionais/p1/timeline",
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({ error: "Unauthorized" });
    });

    it("retorna 404 para profissional inexistente", async () => {
      mockAuth();

      mockPrisma.profissional.findFirst.mockResolvedValueOnce(null);

      const res = await app.inject({
        method: "GET",
        url: "/profissionais/p_invalid/timeline",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res.payload)).toEqual({
        error: "Profissional não encontrado",
      });
    });

    it("retorna 200 com itens mesclados ordenados por data", async () => {
      mockAuth();

      mockPrisma.profissional.findFirst.mockResolvedValueOnce({
        id: "p1",
        nome: "Dr. João",
      });

      mockPrisma.visita.findMany.mockResolvedValueOnce([
        {
          id: "v1",
          dataVisita: new Date("2026-04-01T10:00:00Z"),
          status: "REALIZADA",
          objetivoVisita: "Follow-up",
          resumo: "Paciente bem",
          duracaoMinutos: 30,
        },
      ]);

      mockPrisma.estagioLog.findMany.mockResolvedValueOnce([
        {
          id: "e1",
          createdAt: new Date("2026-04-03T08:00:00Z"),
          estagioAnterior: "PROSPECTADO",
          estagioNovo: "VISITADO",
        },
      ]);

      mockPrisma.agendaItem.findMany.mockResolvedValueOnce([
        {
          id: "a1",
          dataHoraInicio: new Date("2026-04-02T09:00:00Z"),
          dataHoraFim: new Date("2026-04-02T10:00:00Z"),
          status: "PLANEJADO",
          prioridade: "ALTA",
          observacoes: "Primeira visita",
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/profissionais/p1/timeline",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.profissional.nome).toBe("Dr. João");
      expect(body.itens).toHaveLength(3);

      // Sorted descending by date: ESTAGIO (Apr 3) > AGENDAMENTO (Apr 2) > VISITA (Apr 1)
      expect(body.itens[0].tipo).toBe("ESTAGIO");
      expect(body.itens[1].tipo).toBe("AGENDAMENTO");
      expect(body.itens[2].tipo).toBe("VISITA");
    });

    it("cada item tem campo tipo correto", async () => {
      mockAuth();

      mockPrisma.profissional.findFirst.mockResolvedValueOnce({
        id: "p1",
        nome: "Dr. Test",
      });

      mockPrisma.visita.findMany.mockResolvedValueOnce([
        {
          id: "v1",
          dataVisita: new Date("2026-04-01"),
          status: "REALIZADA",
          objetivoVisita: null,
          resumo: null,
          duracaoMinutos: null,
        },
      ]);

      mockPrisma.estagioLog.findMany.mockResolvedValueOnce([
        {
          id: "e1",
          createdAt: new Date("2026-04-02"),
          estagioAnterior: null,
          estagioNovo: "PROSPECTADO",
        },
      ]);

      mockPrisma.agendaItem.findMany.mockResolvedValueOnce([
        {
          id: "a1",
          dataHoraInicio: new Date("2026-04-03"),
          dataHoraFim: new Date("2026-04-03"),
          status: "CONFIRMADO",
          prioridade: "MEDIA",
          observacoes: null,
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/profissionais/p1/timeline",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      const tipos = body.itens.map((i: any) => i.tipo);
      expect(tipos).toContain("VISITA");
      expect(tipos).toContain("ESTAGIO");
      expect(tipos).toContain("AGENDAMENTO");
    });

    it("retorna timeline vazia quando não há eventos", async () => {
      mockAuth();

      mockPrisma.profissional.findFirst.mockResolvedValueOnce({
        id: "p1",
        nome: "Dr. Vazio",
      });

      mockPrisma.visita.findMany.mockResolvedValueOnce([]);
      mockPrisma.estagioLog.findMany.mockResolvedValueOnce([]);
      mockPrisma.agendaItem.findMany.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/profissionais/p1/timeline",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.profissional.nome).toBe("Dr. Vazio");
      expect(body.itens).toHaveLength(0);
    });
  });
});
