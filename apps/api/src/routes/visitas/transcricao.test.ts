import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";

let mockVerifyTokenFn: any;
let app: any;
let mockPrisma: any;
let mockMiniMax: any;

function resetMocks() {
  mockVerifyTokenFn.mockReset();
  mockPrisma.organization.findUnique.mockReset();
  mockPrisma.organization.update.mockReset();
  mockPrisma.organizationMembro.findFirst.mockReset();
  mockPrisma.visita.findUnique.mockReset();
  mockPrisma.visita.update.mockReset();
  mockPrisma.agendaItem.create.mockReset();
  mockPrisma.profissional.update.mockReset();
  mockPrisma.estagioLog.create.mockReset();
  mockPrisma.$transaction.mockReset();
  mockMiniMax.transcreverAudio.mockReset();
  mockMiniMax.extrairCamposVisita.mockReset();
}

function mockAuth() {
  process.env.CLERK_SECRET_KEY = "test_secret";
  process.env.CLERK_JWT_KEY = "test_jwt";
  mockVerifyTokenFn.mockResolvedValue({ sub: "user_1" });
  mockPrisma.organizationMembro.findFirst.mockResolvedValue({
    userId: "user_1",
    role: "OWNER",
    organization: {
      id: "org_1",
      plano: "PRO",
      status: "ATIVO",
      trialExpiraEm: new Date("2026-12-31"),
    },
  });
}

describe("Transcrição Routes", () => {
  beforeAll(async () => {
    mockVerifyTokenFn = jest.fn() as any;

    mockPrisma = {
      organization: {
        findUnique: jest.fn() as any,
        update: jest.fn() as any,
      },
      organizationMembro: {
        findFirst: jest.fn() as any,
      },
      visita: {
        findUnique: jest.fn() as any,
        update: jest.fn() as any,
      },
      agendaItem: {
        create: jest.fn() as any,
      },
      profissional: {
        update: jest.fn() as any,
      },
      estagioLog: {
        create: jest.fn() as any,
      },
      $transaction: jest.fn() as any,
    };

    mockMiniMax = {
      transcreverAudio: jest.fn() as any,
      extrairCamposVisita: jest.fn() as any,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jestGlobal = jest as any;
    jestGlobal.unstable_mockModule("../../lib/prisma.js", () => ({
      prisma: mockPrisma,
    }));
    jestGlobal.unstable_mockModule("@clerk/backend", () => ({
      verifyToken: mockVerifyTokenFn,
    }));
    jestGlobal.unstable_mockModule(
      "../../services/minimax.js",
      () => mockMiniMax,
    );

    const Fastify = (await import("fastify")).default;
    const multipart = (await import("@fastify/multipart")).default;
    const { ZodError } = await import("zod");

    app = Fastify();
    await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

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

    const visitasRoutes = await import("./index.js");
    app.register(visitasRoutes.default, { prefix: "/visitas" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  describe("POST /visitas/:id/transcricao", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/visitas/visita_1/transcricao",
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({ error: "Unauthorized" });
    });
  });

  describe("POST /visitas/:id/confirmar-agenda", () => {
    it("cria item de agenda para a proxima visita sugerida", async () => {
      mockAuth();
      mockPrisma.visita.findUnique.mockResolvedValue({
        id: "visita_1",
        profissionalId: "prof_1",
      });
      mockPrisma.agendaItem.create.mockResolvedValue({
        id: "agenda_1",
        profissionalId: "prof_1",
      });

      const res = await app.inject({
        method: "POST",
        url: "/visitas/visita_1/confirmar-agenda",
        headers: { authorization: "Bearer valid_token" },
        payload: {
          dataISO: "2026-06-15T10:00:00.000Z",
          observacao: "Retornar para follow-up",
        },
      });

      expect(res.statusCode).toBe(201);
      expect(mockPrisma.agendaItem.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user_1",
          profissionalId: "prof_1",
          visitaId: null,
          status: "PLANEJADO",
          prioridade: "MEDIA",
          observacoes: "Retornar para follow-up",
          organizationId: "org_1",
        }),
      });
    });
  });

  describe("POST /visitas/:id/confirmar-estagio", () => {
    it("bloqueia regressao de estagio do pipeline", async () => {
      mockAuth();
      mockPrisma.visita.findUnique.mockResolvedValue({
        id: "visita_1",
        profissionalId: "prof_1",
        profissional: { estagioPipeline: "PRESCRITOR" },
      });

      const res = await app.inject({
        method: "POST",
        url: "/visitas/visita_1/confirmar-estagio",
        headers: { authorization: "Bearer valid_token" },
        payload: { novoEstagio: "VISITADO" },
      });

      expect(res.statusCode).toBe(400);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(JSON.parse(res.payload)).toMatchObject({
        estagioAtual: "PRESCRITOR",
        novoEstagio: "VISITADO",
      });
    });

    it("avanca estagio e cria EstagioLog imutavel", async () => {
      mockAuth();
      mockPrisma.visita.findUnique.mockResolvedValue({
        id: "visita_1",
        profissionalId: "prof_1",
        profissional: { estagioPipeline: "VISITADO" },
      });
      mockPrisma.profissional.update.mockReturnValue({ kind: "update" });
      mockPrisma.estagioLog.create.mockReturnValue({ kind: "log" });
      mockPrisma.$transaction.mockResolvedValue([]);

      const res = await app.inject({
        method: "POST",
        url: "/visitas/visita_1/confirmar-estagio",
        headers: { authorization: "Bearer valid_token" },
        payload: { novoEstagio: "INTERESSADO" },
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.profissional.update).toHaveBeenCalledWith({
        where: { id: "prof_1" },
        data: { estagioPipeline: "INTERESSADO" },
      });
      expect(mockPrisma.estagioLog.create).toHaveBeenCalledWith({
        data: {
          profissionalId: "prof_1",
          estagioAnterior: "VISITADO",
          estagioNovo: "INTERESSADO",
          userId: "user_1",
          organizationId: "org_1",
        },
      });
    });
  });

  describe("PATCH /visitas/:id/audio", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/visitas/visita_1/audio",
        payload: { audioUrl: "https://storage.example.com/audio.webm" },
      });
      expect(res.statusCode).toBe(401);
    });
  });
});
