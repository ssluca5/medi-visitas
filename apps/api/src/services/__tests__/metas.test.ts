import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "@jest/globals";
import type { MetaRecord } from "../metas.js";

// ── Mutable holders ──

const countImpl = {
  visitas: (async () => 50) as any,
  estagioLog: (async () => 30) as any,
  profissional: (async () => 5) as any,
};

function setCounts(visitas: number, avancos: number, prescritores: number) {
  const v = jest.fn<any>();
  const e = jest.fn<any>();
  const p = jest.fn<any>();
  v.mockResolvedValue(visitas);
  e.mockResolvedValue(avancos);
  p.mockResolvedValue(prescritores);
  countImpl.visitas = v;
  countImpl.estagioLog = e;
  countImpl.profissional = p;
  return {
    visitaCount: v,
    estagioLogCount: e,
    profissionalCount: p,
  };
}

// ── Helpers ──

function makeMeta(overrides: Partial<MetaRecord> = {}): MetaRecord {
  return {
    id: "meta_001",
    nome: "Meta Q2",
    descricao: null,
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
  };
}

// ── Module-level refs populated in beforeAll ──

let calcularProgressoMeta: (meta: MetaRecord) => Promise<any>;
let calcularProgressoMetas: (metas: MetaRecord[]) => Promise<any>;

describe("calcularProgressoMeta", () => {
  beforeAll(async () => {
    const jestGlobal = jest as any;

    jestGlobal.unstable_mockModule("../../lib/prisma.js", () => ({
      prisma: {
        visita: { count: (...args: any[]) => countImpl.visitas(...args) },
        estagioLog: {
          count: (...args: any[]) => countImpl.estagioLog(...args),
        },
        profissional: {
          count: (...args: any[]) => countImpl.profissional(...args),
        },
      },
    }));

    const mod = await import("../metas.js");
    calcularProgressoMeta = mod.calcularProgressoMeta;
    calcularProgressoMetas = mod.calcularProgressoMetas;
  });

  afterAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    setCounts(50, 30, 5);
  });

  // ── Progress calculation ──

  it("calcula progresso no meio do período (50% cada indicador)", async () => {
    setCounts(50, 25, 5); // 50% de 100, 50% de 50, 50% de 10
    const result = await calcularProgressoMeta(makeMeta());
    expect(result.progresso.visitas).toEqual({ realizado: 50, percentual: 50 });
    expect(result.progresso.avancosPipeline).toEqual({
      realizado: 25,
      percentual: 50,
    });
    expect(result.progresso.prescritores).toEqual({
      realizado: 5,
      percentual: 50,
    });
    expect(result.progresso.geral).toBe(50);
  });

  it("atinge 100% quando todos indicadores batem a meta", async () => {
    setCounts(100, 50, 10);
    const result = await calcularProgressoMeta(makeMeta());
    expect(result.progresso.visitas.percentual).toBe(100);
    expect(result.progresso.avancosPipeline.percentual).toBe(100);
    expect(result.progresso.prescritores.percentual).toBe(100);
    expect(result.progresso.geral).toBe(100);
  });

  it("retorna 0% quando nenhum indicador tem realizado", async () => {
    setCounts(0, 0, 0);
    const result = await calcularProgressoMeta(makeMeta());
    expect(result.progresso.visitas).toEqual({ realizado: 0, percentual: 0 });
    expect(result.progresso.avancosPipeline).toEqual({
      realizado: 0,
      percentual: 0,
    });
    expect(result.progresso.prescritores).toEqual({
      realizado: 0,
      percentual: 0,
    });
    expect(result.progresso.geral).toBe(0);
  });

  it("retorna 0% quando todos os indicadores estao sem meta", async () => {
    setCounts(0, 0, 0);
    const result = await calcularProgressoMeta(
      makeMeta({ metaVisitas: 0, metaAvancosPipeline: 0, metaPrescritores: 0 }),
    );
    expect(result.progresso.visitas.percentual).toBe(0);
    expect(result.progresso.avancosPipeline.percentual).toBe(0);
    expect(result.progresso.prescritores.percentual).toBe(0);
    expect(result.progresso.geral).toBe(0);
  });

  it("ignora indicadores sem meta configurada no progresso geral", async () => {
    setCounts(50, 30, 5);
    const result = await calcularProgressoMeta(
      makeMeta({
        metaVisitas: 100,
        metaAvancosPipeline: 0,
        metaPrescritores: 0,
      }),
    );
    expect(result.progresso.visitas.percentual).toBe(50);
    expect(result.progresso.avancosPipeline.percentual).toBe(0);
    expect(result.progresso.prescritores.percentual).toBe(0);
    expect(result.progresso.geral).toBe(50);
  });

  it("arredonda percentuais para inteiros", async () => {
    // 67 / 100 = 67%, 33 / 50 = 66%, 7 / 10 = 70% → geral = (67+66+70)/3 = 67.67 → 68
    setCounts(67, 33, 7);
    const result = await calcularProgressoMeta(makeMeta());
    expect(result.progresso.visitas.percentual).toBe(67);
    expect(result.progresso.avancosPipeline.percentual).toBe(66);
    expect(result.progresso.prescritores.percentual).toBe(70);
    expect(result.progresso.geral).toBe(68);
  });

  it("passa as datas corretas para os filtros de contagem", async () => {
    const meta = makeMeta();
    const { visitaCount, estagioLogCount, profissionalCount } = setCounts(
      50,
      30,
      5,
    );

    await calcularProgressoMeta(meta);

    expect(visitaCount).toHaveBeenCalledWith({
      where: {
        organizationId: "org_123",
        userId: "user_123",
        status: "REALIZADA",
        dataVisita: { gte: meta.dataInicio, lte: meta.dataFim },
      },
    });

    expect(estagioLogCount).toHaveBeenCalledWith({
      where: {
        organizationId: "org_123",
        userId: "user_123",
        createdAt: { gte: meta.dataInicio, lte: meta.dataFim },
      },
    });

    expect(profissionalCount).toHaveBeenCalledWith({
      where: {
        organizationId: "org_123",
        deletedAt: null,
        estagioPipeline: "PRESCRITOR",
        updatedAt: { gte: meta.dataInicio, lte: meta.dataFim },
        estagioLogs: {
          some: {
            userId: "user_123",
            estagioNovo: "PRESCRITOR",
            createdAt: { gte: meta.dataInicio, lte: meta.dataFim },
          },
        },
      },
    });
  });

  // ── Alertas ──

  it("não gera alertas para meta ATINGIDA", async () => {
    setCounts(100, 50, 10);
    const result = await calcularProgressoMeta(
      makeMeta({ status: "ATINGIDA" }),
    );
    expect(result.alertas).toEqual({ emRisco: false, prazoCritico: false });
  });

  it("não gera alertas para meta EXPIRADA", async () => {
    setCounts(0, 0, 0);
    const result = await calcularProgressoMeta(
      makeMeta({ status: "EXPIRADA" }),
    );
    expect(result.alertas).toEqual({ emRisco: false, prazoCritico: false });
  });

  it("marca emRisco quando decorrido >= 70% e progresso < 50%", async () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getTime() - 90 * 86400000);
    const fim = new Date(hoje.getTime() + 10 * 86400000);

    setCounts(0, 0, 0);
    const result = await calcularProgressoMeta(
      makeMeta({ dataInicio: inicio, dataFim: fim }),
    );
    expect(result.alertas.emRisco).toBe(true);
  });

  it("NÃO marca emRisco quando decorrido < 70% mesmo com progresso baixo", async () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getTime() - 1 * 86400000);
    const fim = new Date(hoje.getTime() + 89 * 86400000);

    setCounts(0, 0, 0);
    const result = await calcularProgressoMeta(
      makeMeta({ dataInicio: inicio, dataFim: fim }),
    );
    expect(result.alertas.emRisco).toBe(false);
  });

  it("marca prazoCritico quando decorrido >= 90% e progresso < 100%", async () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getTime() - 95 * 86400000);
    const fim = new Date(hoje.getTime() + 1 * 86400000);

    setCounts(5, 3, 1);
    const result = await calcularProgressoMeta(
      makeMeta({ dataInicio: inicio, dataFim: fim }),
    );
    expect(result.alertas.prazoCritico).toBe(true);
  });

  it("NÃO marca prazoCritico quando progresso >= 100% mesmo com decorrido >= 90%", async () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getTime() - 95 * 86400000);
    const fim = new Date(hoje.getTime() + 1 * 86400000);

    setCounts(100, 50, 10);
    const result = await calcularProgressoMeta(
      makeMeta({ dataInicio: inicio, dataFim: fim }),
    );
    expect(result.alertas.prazoCritico).toBe(false);
  });

  it("retorna meta original preservada (id, nome, etc.)", async () => {
    const result = await calcularProgressoMeta(
      makeMeta({ nome: "Meta Original" }),
    );
    expect(result.id).toBe("meta_001");
    expect(result.nome).toBe("Meta Original");
    expect(result.plano).toBe("PROFISSIONAL");
    expect(result.status).toBe("ATIVA");
  });
});

describe("calcularProgressoMetas", () => {
  it("calcula progresso para array de metas em paralelo", async () => {
    setCounts(50, 30, 5);
    const metas = [
      makeMeta({ id: "m1" }),
      makeMeta({ id: "m2" }),
      makeMeta({ id: "m3" }),
    ];

    const results = await calcularProgressoMetas(metas);
    expect(results).toHaveLength(3);
    expect(results[0].id).toBe("m1");
    expect(results[1].id).toBe("m2");
    expect(results[2].id).toBe("m3");
    results.forEach((r: any) => {
      expect(r.progresso).toBeDefined();
      expect(r.alertas).toBeDefined();
    });
  });

  it("retorna array vazio quando lista vazia", async () => {
    const results = await calcularProgressoMetas([]);
    expect(results).toEqual([]);
  });
});
