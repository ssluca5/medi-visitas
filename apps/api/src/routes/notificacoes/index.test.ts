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
  mockPrisma.notificacao.count.mockReset();
  mockPrisma.notificacao.findMany.mockReset();
  mockPrisma.notificacao.findFirst.mockReset();
  mockPrisma.notificacao.update.mockReset();
  mockPrisma.notificacao.updateMany.mockReset();
  mockVerifyTokenFn.mockReset();
}

describe("Notificações Routes", () => {
  beforeAll(async () => {
    mockPrisma = {
      notificacao: {
        count: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
        findFirst: jest.fn() as jest.Mock,
        update: jest.fn() as jest.Mock,
        updateMany: jest.fn() as jest.Mock,
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

    const notificacoesRoutes = await import("./index.js");
    app.register(notificacoesRoutes.default, { prefix: "/notificacoes" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  // ─── GET /notificacoes/contagem ──────────────────────

  describe("GET /notificacoes/contagem", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/notificacoes/contagem",
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({ error: "Unauthorized" });
    });

    it("retorna contagem de não lidas", async () => {
      mockAuth();
      mockPrisma.notificacao.count.mockResolvedValueOnce(5);

      const res = await app.inject({
        method: "GET",
        url: "/notificacoes/contagem",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ naoLidas: 5 });
    });

    it("retorna 0 quando todas lidas", async () => {
      mockAuth();
      mockPrisma.notificacao.count.mockResolvedValueOnce(0);

      const res = await app.inject({
        method: "GET",
        url: "/notificacoes/contagem",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ naoLidas: 0 });
    });
  });

  // ─── PATCH /notificacoes/marcar-todas-lidas ──────────

  describe("PATCH /notificacoes/marcar-todas-lidas", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/notificacoes/marcar-todas-lidas",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna atualizadas com contagem correta", async () => {
      mockAuth();
      mockPrisma.notificacao.updateMany.mockResolvedValueOnce({ count: 3 });

      const res = await app.inject({
        method: "PATCH",
        url: "/notificacoes/marcar-todas-lidas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ atualizadas: 3 });
    });
  });

  // ─── GET /notificacoes ───────────────────────────────

  describe("GET /notificacoes", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/notificacoes",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna lista paginada", async () => {
      mockAuth();

      const mockNotifs = [
        {
          id: "n1",
          userId: "user_123",
          tipo: "VISITA_HOJE",
          prioridade: "ALTA",
          titulo: "Visita agendada",
          mensagem: "Dr. João — 14h00",
          lida: false,
          lidaEm: null,
          profissionalId: "p1",
          agendaItemId: "a1",
          visitaId: null,
          deletedAt: null,
          createdAt: new Date("2026-04-06T06:00:00.000Z"),
          updatedAt: new Date("2026-04-06T06:00:00.000Z"),
        },
      ];

      mockPrisma.notificacao.findMany.mockResolvedValueOnce(mockNotifs);
      mockPrisma.notificacao.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      const res = await app.inject({
        method: "GET",
        url: "/notificacoes",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.data).toHaveLength(1);
      expect(body.total).toBe(1);
      expect(body.naoLidas).toBe(1);
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(20);
      expect(body.totalPages).toBe(1);
    });

    it("filtra por lida", async () => {
      mockAuth();
      mockPrisma.notificacao.findMany.mockResolvedValueOnce([]);
      mockPrisma.notificacao.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const res = await app.inject({
        method: "GET",
        url: "/notificacoes?lida=false",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.notificacao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ lida: false }),
        }),
      );
    });

    it("filtra por tipo", async () => {
      mockAuth();
      mockPrisma.notificacao.findMany.mockResolvedValueOnce([]);
      mockPrisma.notificacao.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const res = await app.inject({
        method: "GET",
        url: "/notificacoes?tipo=VISITA_ATRASADA",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.notificacao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ tipo: "VISITA_ATRASADA" }),
        }),
      );
    });
  });

  // ─── PATCH /notificacoes/:id/lida ────────────────────

  describe("PATCH /notificacoes/:id/lida", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/notificacoes/n1/lida",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 404 para notificação de outro userId", async () => {
      mockAuth();
      mockPrisma.notificacao.findFirst.mockResolvedValueOnce(null);

      const res = await app.inject({
        method: "PATCH",
        url: "/notificacoes/n1/lida",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(404);
    });

    it("marca como lida com sucesso", async () => {
      mockAuth();
      mockPrisma.notificacao.findFirst.mockResolvedValueOnce({
        id: "n1",
        userId: "user_123",
        lida: false,
      });
      mockPrisma.notificacao.update.mockResolvedValueOnce({
        id: "n1",
        lida: true,
        lidaEm: new Date("2026-04-06T10:00:00.000Z"),
      });

      const res = await app.inject({
        method: "PATCH",
        url: "/notificacoes/n1/lida",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.lida).toBe(true);
      expect(body.lidaEm).toBeDefined();
    });
  });

  // ─── DELETE /notificacoes/:id ────────────────────────

  describe("DELETE /notificacoes/:id", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "DELETE",
        url: "/notificacoes/n1",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 404 para notificação de outro userId", async () => {
      mockAuth();
      mockPrisma.notificacao.findFirst.mockResolvedValueOnce(null);

      const res = await app.inject({
        method: "DELETE",
        url: "/notificacoes/n1",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(404);
    });

    it("soft delete com sucesso — retorna 204", async () => {
      mockAuth();
      mockPrisma.notificacao.findFirst.mockResolvedValueOnce({
        id: "n1",
        userId: "user_123",
      });
      mockPrisma.notificacao.update.mockResolvedValueOnce({});

      const res = await app.inject({
        method: "DELETE",
        url: "/notificacoes/n1",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(204);
      expect(mockPrisma.notificacao.update).toHaveBeenCalledWith({
        where: { id: "n1" },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
