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
let buildAlertas: any;

function mockAuth() {
  mockVerifyTokenFn.mockResolvedValueOnce({ sub: "user_123" });
}

function resetMocks() {
  mockPrisma.profissional.count.mockReset();
  mockPrisma.especialidade.count.mockReset();
  mockPrisma.visita.count.mockReset();
  mockPrisma.visita.findMany.mockReset();
  mockPrisma.agendaItem.findMany.mockReset();
  mockPrisma.profissional.findMany.mockReset();
  mockVerifyTokenFn.mockReset();
}

describe("Dashboard Routes", () => {
  beforeAll(async () => {
    mockPrisma = {
      profissional: {
        count: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
      },
      especialidade: {
        count: jest.fn() as jest.Mock,
      },
      visita: {
        count: jest.fn() as jest.Mock,
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

    const dashboardRoutes = await import("./index.js");
    app.register(dashboardRoutes.default, { prefix: "/dashboard" });
    await app.ready();

    // Extract buildAlertas from the dynamically imported module
    buildAlertas = dashboardRoutes.buildAlertas;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  // ─── GET /dashboard/resumo ───────────────────────────

  describe("GET /dashboard/resumo", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/dashboard/resumo",
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({ error: "Unauthorized" });
    });

    it("retorna 200 com KPIs", async () => {
      mockAuth();

      mockPrisma.profissional.count.mockResolvedValueOnce(25);
      mockPrisma.especialidade.count.mockResolvedValueOnce(8);
      mockPrisma.visita.count
        .mockResolvedValueOnce(3) // visitasHoje
        .mockResolvedValueOnce(12); // visitasSemana
      mockPrisma.visita.findMany.mockResolvedValueOnce([
        {
          id: "v1",
          dataVisita: new Date("2026-04-05"),
          status: "REALIZADA",
          objetivoVisita: "Follow-up",
          resumo: null,
          profissional: {
            nome: "Dr. João",
            especialidade: { nome: "Cardiologia" },
          },
        },
      ]);
      mockPrisma.agendaItem.findMany.mockResolvedValueOnce([
        {
          id: "a1",
          dataHoraInicio: new Date("2026-04-07T09:00:00Z"),
          dataHoraFim: new Date("2026-04-07T10:00:00Z"),
          status: "PLANEJADO",
          prioridade: "ALTA",
          profissional: {
            nome: "Dra. Maria",
            especialidade: { nome: "Pediatria" },
          },
        },
      ]);

      const res = await app.inject({
        method: "GET",
        url: "/dashboard/resumo",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.totalProfissionais).toBe(25);
      expect(body.totalEspecialidades).toBe(8);
      expect(body.visitasHoje).toBe(3);
      expect(body.visitasSemana).toBe(12);
      expect(body.ultimasVisitas).toHaveLength(1);
      expect(body.ultimasVisitas[0].profissional.nome).toBe("Dr. João");
      expect(body.proximosAgendamentos).toHaveLength(1);
      expect(body.proximosAgendamentos[0].profissional.nome).toBe("Dra. Maria");
    });

    it("retorna arrays vazios quando não há visitas/agendamentos", async () => {
      mockAuth();

      mockPrisma.profissional.count.mockResolvedValueOnce(0);
      mockPrisma.especialidade.count.mockResolvedValueOnce(0);
      mockPrisma.visita.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
      mockPrisma.visita.findMany.mockResolvedValueOnce([]);
      mockPrisma.agendaItem.findMany.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/dashboard/resumo",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.totalProfissionais).toBe(0);
      expect(body.ultimasVisitas).toHaveLength(0);
      expect(body.proximosAgendamentos).toHaveLength(0);
    });
  });

  // ─── GET /dashboard/alertas ──────────────────────────

  describe("GET /dashboard/alertas", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/dashboard/alertas",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 200 com alertas estruturados", async () => {
      mockAuth();

      // profissionais com última visita > 30 dias
      const trintaEDoisDiasAtras = new Date();
      trintaEDoisDiasAtras.setDate(trintaEDoisDiasAtras.getDate() - 32);

      mockPrisma.profissional.findMany
        .mockResolvedValueOnce([
          {
            id: "p1",
            nome: "Dr. João",
            estagioPipeline: "VISITADO",
            visitas: [{ dataVisita: trintaEDoisDiasAtras }],
          },
          {
            id: "p2",
            nome: "Dra. Maria",
            estagioPipeline: "INTERESSADO",
            visitas: [],
          },
        ])
        .mockResolvedValueOnce([]); // prospectadosSemVisita

      mockPrisma.agendaItem.findMany
        .mockResolvedValueOnce([]) // agendaAtrasados
        .mockResolvedValueOnce([]); // agendaHoje

      const res = await app.inject({
        method: "GET",
        url: "/dashboard/alertas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toBeInstanceOf(Array);
      // Dr. João should have SEM_VISITA_30_DIAS
      const alertaJoao = body.find((a: any) => a.profissionalId === "p1");
      expect(alertaJoao).toBeDefined();
      expect(alertaJoao.tipo).toBe("SEM_VISITA_30_DIAS");
      expect(alertaJoao.severidade).toBe("warning");
    });

    it("retorna alerta danger para > 60 dias sem visita", async () => {
      mockAuth();

      const sessentaEDoisDiasAtras = new Date();
      sessentaEDoisDiasAtras.setDate(sessentaEDoisDiasAtras.getDate() - 62);

      mockPrisma.profissional.findMany
        .mockResolvedValueOnce([
          {
            id: "p1",
            nome: "Dr. Antigo",
            estagioPipeline: "VISITADO",
            visitas: [{ dataVisita: sessentaEDoisDiasAtras }],
          },
        ])
        .mockResolvedValueOnce([]);

      mockPrisma.agendaItem.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/dashboard/alertas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      const alertaAntigo = body.find((a: any) => a.profissionalId === "p1");
      expect(alertaAntigo.tipo).toBe("SEM_VISITA_60_DIAS");
      expect(alertaAntigo.severidade).toBe("danger");
    });

    it("retorna alerta VISITA_ATRASADA para agenda em atraso", async () => {
      mockAuth();

      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);

      mockPrisma.profissional.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockPrisma.agendaItem.findMany
        .mockResolvedValueOnce([
          {
            id: "a1",
            profissionalId: "p1",
            profissional: { nome: "Dr. Atrasado" },
            dataHoraInicio: ontem,
          },
        ])
        .mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/dashboard/alertas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            tipo: "VISITA_ATRASADA",
            severidade: "danger",
            profissionalNome: "Dr. Atrasado",
          }),
        ]),
      );
    });

    it("retorna alerta AGENDAMENTO_HOJE", async () => {
      mockAuth();

      mockPrisma.profissional.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockPrisma.agendaItem.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: "a1",
            profissionalId: "p1",
            profissional: { nome: "Dr. Hoje" },
            dataHoraInicio: new Date(),
          },
        ]);

      const res = await app.inject({
        method: "GET",
        url: "/dashboard/alertas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            tipo: "AGENDAMENTO_HOJE",
            severidade: "info",
            profissionalNome: "Dr. Hoje",
          }),
        ]),
      );
    });

    it("retorna alerta PROSPECTADO_SEM_VISITA", async () => {
      mockAuth();

      mockPrisma.profissional.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ id: "p1", nome: "Dr. Novo" }]);

      mockPrisma.agendaItem.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/dashboard/alertas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            tipo: "PROSPECTADO_SEM_VISITA",
            severidade: "info",
            profissionalNome: "Dr. Novo",
          }),
        ]),
      );
    });
  });

  // ─── buildAlertas pure function ──────────────────────

  describe("buildAlertas", () => {
    it("retorna array vazio quando não há alertas", () => {
      const agora = new Date();
      const result = buildAlertas({
        profissionaisComVisitas: [],
        agendaAtrasados: [],
        agendaHoje: [],
        prospectadosSemVisita: [],
        agora,
      });
      expect(result).toEqual([]);
    });

    it("gera SEM_VISITA_30_DIAS para visita entre 31-60 dias", () => {
      const agora = new Date("2026-04-06T12:00:00Z");
      const quarentaDiasAtras = new Date("2026-02-25T12:00:00Z");

      const result = buildAlertas({
        profissionaisComVisitas: [
          {
            id: "p1",
            nome: "Dr. Test",
            estagioPipeline: "VISITADO",
            visitas: [{ dataVisita: quarentaDiasAtras }],
          },
        ],
        agendaAtrasados: [],
        agendaHoje: [],
        prospectadosSemVisita: [],
        agora,
      });

      expect(result).toHaveLength(1);
      expect(result[0].tipo).toBe("SEM_VISITA_30_DIAS");
      expect(result[0].severidade).toBe("warning");
    });

    it("gera SEM_VISITA_60_DIAS para visita > 60 dias", () => {
      const agora = new Date("2026-04-06T12:00:00Z");
      const setentaDiasAtras = new Date("2026-01-26T12:00:00Z");

      const result = buildAlertas({
        profissionaisComVisitas: [
          {
            id: "p1",
            nome: "Dr. Test",
            estagioPipeline: "VISITADO",
            visitas: [{ dataVisita: setentaDiasAtras }],
          },
        ],
        agendaAtrasados: [],
        agendaHoje: [],
        prospectadosSemVisita: [],
        agora,
      });

      expect(result).toHaveLength(1);
      expect(result[0].tipo).toBe("SEM_VISITA_60_DIAS");
      expect(result[0].severidade).toBe("danger");
    });

    it("ignora profissional sem visitas realizadas", () => {
      const agora = new Date();
      const result = buildAlertas({
        profissionaisComVisitas: [
          {
            id: "p1",
            nome: "Dr. SemVisita",
            estagioPipeline: "PROSPECTADO",
            visitas: [],
          },
        ],
        agendaAtrasados: [],
        agendaHoje: [],
        prospectadosSemVisita: [],
        agora,
      });

      // Should not generate SEM_VISITA alert (only PROSPECTADO_SEM_VISITA handles that)
      expect(result).toHaveLength(0);
    });
  });
});
