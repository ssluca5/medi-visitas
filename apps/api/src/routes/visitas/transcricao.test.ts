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

function resetMocks() {
  mockVerifyTokenFn.mockReset();
}

describe("Transcrição Routes", () => {
  beforeAll(async () => {
    mockVerifyTokenFn = jest.fn() as any;

    const mockPrisma = {
      visita: {
        findUnique: jest.fn() as any,
        update: jest.fn() as any,
      },
    };

    const mockMinimax = {
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
      () => mockMinimax,
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
