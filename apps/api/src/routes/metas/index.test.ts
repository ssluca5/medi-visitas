import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";

let mockQueryRaw: any;
let mockExecuteRaw: any;
let mockVerifyTokenFn: any;
let mockOrganizationMembroFindFirst: any;
let app: any;

// Mutable impl holders — tests swap these to override behavior without
// reassigning ESM read-only exports.
const tenantImpl = {
  resolveTenant: async (req: any) => {
    req.organizationId = "org_123";
    req.role = "OWNER";
    req.plano = "PROFISSIONAL";
  },
};

const metasImpl = {
  calcularProgressoMeta: async (meta: any) => ({
    ...meta,
    progresso: {
      visitas: { realizado: 50, percentual: 50 },
      avancosPipeline: { realizado: 30, percentual: 60 },
      prescritores: { realizado: 5, percentual: 50 },
      geral: 53,
    },
    alertas: { emRisco: false, prazoCritico: false },
  }),
  calcularProgressoMetas: async (metas: any[]) =>
    Promise.all(metas.map((m: any) => metasImpl.calcularProgressoMeta(m))),
};

const mockMetaRow = (overrides: Record<string, unknown> = {}) => ({
  id: "meta_001",
  nome: "Meta de Visitas Q2",
  descricao: "Aumentar visitas em 20%",
  dataInicio: new Date("2026-04-01T00:00:00Z"),
  dataFim: new Date("2026-06-30T23:59:59Z"),
  metaVisitas: 100,
  metaAvancosPipeline: 50,
  metaPrescritores: 10,
  responsavelId: "user_123",
  criadaPorId: "user_123",
  plano: "PROFISSIONAL",
  status: "ATIVA",
  organizationId: "org_123",
  createdAt: new Date("2026-04-01T00:00:00Z"),
  updatedAt: new Date("2026-04-01T00:00:00Z"),
  deletedAt: null,
  ...overrides,
});

function mockAuth() {
  mockVerifyTokenFn.mockResolvedValueOnce({ sub: "user_123" });
}

describe("Metas Routes", () => {
  beforeAll(async () => {
    mockQueryRaw = jest.fn() as jest.Mock;
    mockExecuteRaw = jest.fn() as jest.Mock;
    mockVerifyTokenFn = jest.fn() as jest.Mock;
    mockOrganizationMembroFindFirst = jest.fn() as jest.Mock;

    const jestGlobal = jest as any;

    jestGlobal.unstable_mockModule("../../lib/prisma.js", () => ({
      prisma: {
        $queryRaw: mockQueryRaw,
        $executeRaw: mockExecuteRaw,
        organizationMembro: {
          findFirst: mockOrganizationMembroFindFirst,
        },
      },
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
      resolveTenant: async (req: any) => tenantImpl.resolveTenant(req),
    }));

    jestGlobal.unstable_mockModule("../../services/planos.js", () => ({
      getLimitesPlano: (plano: string) => {
        if (plano === "TRIAL" || plano === "BASICO") {
          return { temMetas: false, temGestaoEquipe: false };
        }
        return {
          temMetas: true,
          temGestaoEquipe: plano === "EQUIPE" || plano === "EMPRESARIAL",
        };
      },
    }));

    jestGlobal.unstable_mockModule("../../services/metas.js", () => ({
      calcularProgressoMeta: async (meta: any) =>
        metasImpl.calcularProgressoMeta(meta),
      calcularProgressoMetas: async (metas: any[]) =>
        metasImpl.calcularProgressoMetas(metas),
    }));

    // Prisma.sql tagged template mock — creates objects $queryRaw can receive
    jestGlobal.unstable_mockModule("@prisma/client", () => {
      function sql(strings: TemplateStringsArray, ...values: unknown[]) {
        return { strings, values };
      }
      function join(items: unknown[], sep: string) {
        return { type: "join", items, sep };
      }
      return {
        Prisma: { sql, join },
      };
    });

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
      return reply
        .status(error.statusCode ?? 500)
        .send({ error: error.message });
    });

    const metasRoutes = await import("./index.js");
    app.register(metasRoutes.default, { prefix: "/metas" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    mockQueryRaw.mockReset();
    mockExecuteRaw.mockReset();
    mockVerifyTokenFn.mockReset();
    mockOrganizationMembroFindFirst.mockReset();
    mockOrganizationMembroFindFirst.mockResolvedValue({ id: "membro_001" });
  });

  // ═══════════════════════════════════════════════════════════
  // GET /metas
  // ═══════════════════════════════════════════════════════════

  describe("GET /metas", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({ method: "GET", url: "/metas" });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({ error: "Unauthorized" });
    });

    it("retorna 200 com lista vazia", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual([]);
    });

    it("retorna 200 com metas e progresso calculado", async () => {
      mockAuth();
      const row = mockMetaRow();
      mockQueryRaw.mockResolvedValueOnce([row]);

      const res = await app.inject({
        method: "GET",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveLength(1);
      expect(body[0].id).toBe("meta_001");
      expect(body[0].progresso).toBeDefined();
      expect(body[0].progresso.geral).toBe(53);
      expect(body[0].alertas).toEqual({ emRisco: false, prazoCritico: false });
    });

    it("filtra por status ATIVA", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]);

      const res = await app.inject({
        method: "GET",
        url: "/metas?status=ATIVA",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toHaveLength(1);
    });

    it("filtra por responsavelId", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]);

      const res = await app.inject({
        method: "GET",
        url: "/metas?responsavelId=user_123",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toHaveLength(1);
    });

    it("rejeita status inválido", async () => {
      mockAuth();

      const res = await app.inject({
        method: "GET",
        url: "/metas?status=INVALIDO",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(400);
    });

    it("filtra por periodo mes_atual", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]);

      const res = await app.inject({
        method: "GET",
        url: "/metas?periodo=mes_atual",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // GET /metas/alertas
  // ═══════════════════════════════════════════════════════════

  describe("GET /metas/alertas", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({ method: "GET", url: "/metas/alertas" });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 200 com metas que têm alertas", async () => {
      mockAuth();

      const emRisco = mockMetaRow({
        id: "meta_002",
        nome: "Meta em risco",
        dataFim: new Date("2026-04-15T23:59:59Z"),
      });

      const normal = mockMetaRow();

      mockQueryRaw.mockResolvedValueOnce([emRisco, normal]);

      // Swap impl so meta_002 gets emRisco=true
      const originalCalc = metasImpl.calcularProgressoMetas;
      metasImpl.calcularProgressoMetas = async (metas: any[]) =>
        Promise.all(
          metas.map((m: any) => ({
            ...m,
            progresso: {
              visitas: { realizado: 10, percentual: 10 },
              avancosPipeline: { realizado: 5, percentual: 10 },
              prescritores: { realizado: 0, percentual: 0 },
              geral: m.id === "meta_002" ? 7 : 80,
            },
            alertas: {
              emRisco: m.id === "meta_002",
              prazoCritico: false,
            },
          })),
        );

      const res = await app.inject({
        method: "GET",
        url: "/metas/alertas",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveLength(1);
      expect(body[0].id).toBe("meta_002");
      expect(body[0].alertas.emRisco).toBe(true);

      // Restore
      metasImpl.calcularProgressoMetas = originalCalc;
    });
  });

  // ═══════════════════════════════════════════════════════════
  // POST /metas
  // ═══════════════════════════════════════════════════════════

  describe("POST /metas", () => {
    const payloadBase = {
      nome: "Meta de Visitas Q2",
      dataInicio: "2026-04-01T00:00:00Z",
      dataFim: "2026-06-30T23:59:59Z",
      metaVisitas: 100,
      metaAvancosPipeline: 50,
      metaPrescritores: 10,
      responsavelId: "user_123",
      plano: "PROFISSIONAL",
    };

    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/metas",
        payload: payloadBase,
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 201 ao criar meta profissional", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]);

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: payloadBase,
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body.id).toBe("meta_001");
      expect(body.progresso).toBeDefined();
    });

    it("retorna 201 ao criar meta de equipe", async () => {
      mockAuth();
      const originalResolve = tenantImpl.resolveTenant;
      tenantImpl.resolveTenant = async (req: any) => {
        req.organizationId = "org_123";
        req.role = "OWNER";
        req.plano = "EQUIPE";
      };

      mockQueryRaw.mockResolvedValueOnce([
        mockMetaRow({ plano: "EQUIPE", responsavelId: "user_456" }),
      ]);

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: { ...payloadBase, plano: "EQUIPE", responsavelId: "user_456" },
      });

      expect(res.statusCode).toBe(201);
      tenantImpl.resolveTenant = originalResolve;
    });

    it("retorna 400 quando nenhum indicador e informado", async () => {
      mockAuth();

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: {
          ...payloadBase,
          metaVisitas: 0,
          metaAvancosPipeline: 0,
          metaPrescritores: 0,
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toContain("indicador");
    });

    it("retorna 402 ao criar meta de equipe no plano profissional", async () => {
      mockAuth();

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: { ...payloadBase, plano: "EQUIPE", responsavelId: "user_456" },
      });

      expect(res.statusCode).toBe(402);
      expect(JSON.parse(res.payload).code).toBe("FEATURE_NOT_AVAILABLE");
    });

    it("retorna 400 quando responsavel de equipe nao pertence a organizacao", async () => {
      mockAuth();
      const originalResolve = tenantImpl.resolveTenant;
      tenantImpl.resolveTenant = async (req: any) => {
        req.organizationId = "org_123";
        req.role = "OWNER";
        req.plano = "EQUIPE";
      };
      mockOrganizationMembroFindFirst.mockResolvedValueOnce(null);

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: { ...payloadBase, plano: "EQUIPE", responsavelId: "user_456" },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toContain("Responsavel");
      tenantImpl.resolveTenant = originalResolve;
    });

    it("retorna 400 quando data fim <= data inicio", async () => {
      mockAuth();

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: {
          ...payloadBase,
          dataInicio: "2026-06-30T00:00:00Z",
          dataFim: "2026-04-01T00:00:00Z",
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toBe(
        "A data final deve ser maior que a data inicial.",
      );
    });

    it("retorna 400 quando plano PROFISSIONAL com responsavelId diferente", async () => {
      mockAuth();

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: { ...payloadBase, responsavelId: "user_999" },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toContain("proprio usuario");
    });

    it("retorna 400 sem nome", async () => {
      mockAuth();

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: { ...payloadBase, nome: "" },
      });

      expect(res.statusCode).toBe(400);
    });

    it("retorna 402 quando plano não tem feature de metas", async () => {
      mockAuth();

      // Swap tenant impl to set TRIAL plan
      const originalResolve = tenantImpl.resolveTenant;
      tenantImpl.resolveTenant = async (req: any) => {
        req.organizationId = "org_123";
        req.role = "OWNER";
        req.plano = "TRIAL";
      };

      const res = await app.inject({
        method: "POST",
        url: "/metas",
        headers: { authorization: "Bearer valid_token" },
        payload: payloadBase,
      });

      expect(res.statusCode).toBe(402);
      expect(JSON.parse(res.payload).code).toBe("FEATURE_NOT_AVAILABLE");

      // Restore
      tenantImpl.resolveTenant = originalResolve;
    });
  });

  // ═══════════════════════════════════════════════════════════
  // GET /metas/:id
  // ═══════════════════════════════════════════════════════════

  describe("GET /metas/:id", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({ method: "GET", url: "/metas/meta_001" });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 404 se meta não existe", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "GET",
        url: "/metas/nonexistent",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res.payload).error).toBe("Meta nao encontrada.");
    });

    it("retorna 200 com meta e progresso", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]);

      const res = await app.inject({
        method: "GET",
        url: "/metas/meta_001",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.id).toBe("meta_001");
      expect(body.progresso.geral).toBe(53);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // PUT /metas/:id
  // ═══════════════════════════════════════════════════════════

  describe("PUT /metas/:id", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "PUT",
        url: "/metas/meta_001",
        payload: { nome: "Novo nome" },
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 404 se meta não existe", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([]); // findMetaByCreator

      const res = await app.inject({
        method: "PUT",
        url: "/metas/nonexistent",
        headers: { authorization: "Bearer valid_token" },
        payload: { nome: "Novo nome" },
      });

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res.payload).error).toBe("Meta nao encontrada.");
    });

    it("retorna 400 se meta já foi ATINGIDA", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow({ status: "ATINGIDA" })]);

      const res = await app.inject({
        method: "PUT",
        url: "/metas/meta_001",
        headers: { authorization: "Bearer valid_token" },
        payload: { nome: "Novo nome" },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toContain("nao podem ser editadas");
    });

    it("retorna 400 se meta já EXPIRADA", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow({ status: "EXPIRADA" })]);

      const res = await app.inject({
        method: "PUT",
        url: "/metas/meta_001",
        headers: { authorization: "Bearer valid_token" },
        payload: { nome: "Novo nome" },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toContain("nao podem ser editadas");
    });

    it("retorna 200 ao atualizar com sucesso", async () => {
      mockAuth();
      mockQueryRaw
        .mockResolvedValueOnce([mockMetaRow()]) // findMetaByCreator
        .mockResolvedValueOnce([
          mockMetaRow({ nome: "Meta Renomeada", updatedAt: new Date() }),
        ]); // UPDATE RETURNING

      const res = await app.inject({
        method: "PUT",
        url: "/metas/meta_001",
        headers: { authorization: "Bearer valid_token" },
        payload: { nome: "Meta Renomeada" },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.nome).toBe("Meta Renomeada");
    });

    it("retorna 400 quando plano PROFISSIONAL com responsavelId diferente", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]); // findMetaByCreator OK

      const res = await app.inject({
        method: "PUT",
        url: "/metas/meta_001",
        headers: { authorization: "Bearer valid_token" },
        payload: { responsavelId: "user_999", plano: "PROFISSIONAL" },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toContain("proprio usuario");
    });

    it("retorna 400 quando data fim <= data inicio", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]);

      const res = await app.inject({
        method: "PUT",
        url: "/metas/meta_001",
        headers: { authorization: "Bearer valid_token" },
        payload: {
          dataInicio: "2026-12-01T00:00:00Z",
          dataFim: "2026-01-01T00:00:00Z",
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload).error).toBe(
        "A data final deve ser maior que a data inicial.",
      );
    });
  });

  // ═══════════════════════════════════════════════════════════
  // DELETE /metas/:id
  // ═══════════════════════════════════════════════════════════

  describe("DELETE /metas/:id", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "DELETE",
        url: "/metas/meta_001",
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 404 se meta não existe", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "DELETE",
        url: "/metas/nonexistent",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(404);
    });

    it("retorna 204 ao fazer soft delete", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([mockMetaRow()]); // findMetaByCreator
      mockExecuteRaw.mockResolvedValueOnce(undefined);

      const res = await app.inject({
        method: "DELETE",
        url: "/metas/meta_001",
        headers: { authorization: "Bearer valid_token" },
      });

      expect(res.statusCode).toBe(204);
      expect(mockExecuteRaw).toHaveBeenCalledTimes(1);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // PATCH /metas/:id/status
  // ═══════════════════════════════════════════════════════════

  describe("PATCH /metas/:id/status", () => {
    it("retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/metas/meta_001/status",
        payload: { status: "ATINGIDA" },
      });
      expect(res.statusCode).toBe(401);
    });

    it("retorna 404 se meta não existe", async () => {
      mockAuth();
      mockQueryRaw.mockResolvedValueOnce([]);

      const res = await app.inject({
        method: "PATCH",
        url: "/metas/nonexistent/status",
        headers: { authorization: "Bearer valid_token" },
        payload: { status: "ATINGIDA" },
      });

      expect(res.statusCode).toBe(404);
    });

    it("retorna 200 ao marcar como ATINGIDA", async () => {
      mockAuth();
      mockQueryRaw
        .mockResolvedValueOnce([mockMetaRow()]) // findMetaByCreator
        .mockResolvedValueOnce([mockMetaRow({ status: "ATINGIDA" })]); // UPDATE

      const res = await app.inject({
        method: "PATCH",
        url: "/metas/meta_001/status",
        headers: { authorization: "Bearer valid_token" },
        payload: { status: "ATINGIDA" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).status).toBe("ATINGIDA");
    });

    it("retorna 200 ao marcar como EXPIRADA", async () => {
      mockAuth();
      mockQueryRaw
        .mockResolvedValueOnce([mockMetaRow()])
        .mockResolvedValueOnce([mockMetaRow({ status: "EXPIRADA" })]);

      const res = await app.inject({
        method: "PATCH",
        url: "/metas/meta_001/status",
        headers: { authorization: "Bearer valid_token" },
        payload: { status: "EXPIRADA" },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).status).toBe("EXPIRADA");
    });

    it("rejeita status inválido", async () => {
      mockAuth();

      const res = await app.inject({
        method: "PATCH",
        url: "/metas/meta_001/status",
        headers: { authorization: "Bearer valid_token" },
        payload: { status: "ATIVA" },
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
