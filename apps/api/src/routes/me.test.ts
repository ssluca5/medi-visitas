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
let mockUserFindUnique: any;
let mockUserCreate: any;
let mockUserUpdate: any;
let mockMemberFindFirst: any;
let mockQueryRaw: any;
let mockExecuteRaw: any;
let app: any;

describe("GET /me", () => {
  beforeAll(async () => {
    mockVerifyTokenFn = jest.fn() as jest.Mock;
    mockUserUpsert = jest.fn();
    mockUserFindUnique = jest.fn();
    mockUserCreate = jest.fn();
    mockUserUpdate = jest.fn();
    mockMemberFindFirst = jest.fn();
    mockQueryRaw = jest.fn();
    mockExecuteRaw = jest.fn();

    const jestGlobal = jest as any;
    jestGlobal.unstable_mockModule("@clerk/backend", () => ({
      verifyToken: mockVerifyTokenFn,
    }));

    jestGlobal.unstable_mockModule("../lib/prisma.js", () => ({
      prisma: {
        user: {
          upsert: mockUserUpsert,
          findUnique: mockUserFindUnique,
          create: mockUserCreate,
          update: mockUserUpdate,
        },
        organizationMembro: { findFirst: mockMemberFindFirst },
        $queryRaw: mockQueryRaw,
        $executeRaw: mockExecuteRaw,
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
        req.userEmail = "test@example.com";
        req.userName = "João Silva";
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
    mockUserFindUnique.mockReset();
    mockUserCreate.mockReset();
    mockUserUpdate.mockReset();
    mockMemberFindFirst.mockReset();
    mockQueryRaw.mockReset();
    mockExecuteRaw.mockReset();
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
    mockUserFindUnique.mockResolvedValueOnce(null);
    mockUserCreate.mockResolvedValueOnce({
      id: "db_user_123",
      email: "test@example.com",
      name: "João Silva",
      tourConcluidoEm: null,
    });
    mockQueryRaw.mockResolvedValueOnce([
      {
        notifVisitasDia: true,
        notifSemVisitaRecente: true,
        notifAgendaNaoRealizada: true,
        notifLembretesAuto: true,
      },
    ]);
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
      email: "test@example.com",
      name: "João Silva",
      organizationId: null,
      role: null,
      tourConcluidoEm: null,
      organization: null,
      notifVisitasDia: true,
      notifSemVisitaRecente: true,
      notifAgendaNaoRealizada: true,
      notifLembretesAuto: true,
    });
  });

  it("salva preferÃªncia de notificaÃ§Ã£o sem enviar campos notif para o Prisma Client", async () => {
    mockUserFindUnique.mockResolvedValueOnce({
      id: "db_user_123",
      email: "test@example.com",
      name: "JoÃ£o Silva",
      tourConcluidoEm: null,
    });
    mockExecuteRaw.mockResolvedValueOnce(1);
    mockQueryRaw.mockResolvedValueOnce([
      {
        notifVisitasDia: false,
        notifSemVisitaRecente: true,
        notifAgendaNaoRealizada: true,
        notifLembretesAuto: true,
      },
    ]);

    const response = await app.inject({
      method: "PATCH",
      url: "/me",
      headers: {
        authorization: "Bearer valid_token",
      },
      payload: {
        notifVisitasDia: false,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(mockUserUpdate).not.toHaveBeenCalled();
    expect(mockUserUpsert).not.toHaveBeenCalled();
    expect(mockExecuteRaw).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.payload)).toMatchObject({
      id: "db_user_123",
      notifVisitasDia: false,
    });
  });
});
