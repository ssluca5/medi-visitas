import { test, expect } from "@playwright/test";

const API = "http://localhost:3002";
const METAS_PATH = "/dashboard/metas";

// ── Helpers ──

function mockMeta(overrides: Record<string, unknown> = {}) {
  return {
    id: "meta_e2e_001",
    nome: "Meta de Visitas Q2",
    descricao: "Aumentar em 20%",
    dataInicio: "2026-04-01T00:00:00Z",
    dataFim: "2026-06-30T23:59:59Z",
    metaVisitas: 100,
    metaAvancosPipeline: 50,
    metaPrescritores: 10,
    responsavelId: "test_user_001",
    criadaPorId: "test_user_001",
    plano: "PROFISSIONAL",
    status: "ATIVA",
    organizationId: "org_123",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    progresso: {
      visitas: { realizado: 50, percentual: 50 },
      avancosPipeline: { realizado: 30, percentual: 60 },
      prescritores: { realizado: 5, percentual: 50 },
      geral: 53,
    },
    alertas: { emRisco: false, prazoCritico: false },
    ...overrides,
  };
}

/**
 * Setup all API mocks AND the E2E auth bypass cookie.
 * Call before navigating to any dashboard route.
 */
async function setupE2E(
  page: import("@playwright/test").Page,
  options: { plano?: "PROFISSIONAL" | "EQUIPE"; temGestaoEquipe?: boolean } = {},
) {
  const plano = options.plano ?? "PROFISSIONAL";
  const temGestaoEquipe = options.temGestaoEquipe ?? plano === "EQUIPE";

  // Auth bypass cookie — hooks.server.ts checks for this
  await page.context().addCookies([
    {
      name: "__e2e_test",
      value: "true",
      domain: "localhost",
      path: "/",
    },
  ]);

  // Mock onboarding/status (called by root layout)
  await page.route(`${API}/onboarding/status`, (route) =>
    route.fulfill({
      status: 200,
      json: {
        concluido: true,
        status: "ATIVO",
        role: "OWNER",
        plano,
        organizationId: "org_123",
        trialExpiraEm: null,
        limites: {
          temMetas: true,
          temGestaoEquipe,
          temRelatorios: true,
          temIa: true,
          pacotesIaDisponiveis: false,
        },
      },
    }),
  );

  // Mock /me
  await page.route(`${API}/me`, (route) =>
    route.fulfill({
      status: 200,
      json: { name: "Test User", tourConcluidoEm: null },
    }),
  );

  // Mock GET metas (empty by default)
  await page.route(`${API}/metas`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({ status: 200, json: [] });
    }
    return route.continue();
  });

  // Mock alertas
  await page.route(`${API}/metas/alertas`, (route) =>
    route.fulfill({ status: 200, json: [] }),
  );

  await page.route(`${API}/organizacao/membros`, (route) =>
    route.fulfill({
      status: 200,
      json: {
        data: [
          {
            userId: "test_user_001",
            role: "OWNER",
            user: { name: "Test User", email: "test@example.com" },
          },
          {
            userId: "test_user_002",
            role: "MEMBER",
            user: { name: "Ana Equipe", email: "ana@example.com" },
          },
        ],
      },
    }),
  );
}

// ── Tests ──

test.describe("Tela de Metas", () => {
  test("Empty state: mostra templates quando não há metas", async ({
    page,
  }) => {
    await setupE2E(page);

    await page.goto(METAS_PATH);
    await page.waitForLoadState("networkidle");

    // Page heading
    await expect(
      page.getByRole("heading", { name: "Metas", exact: true }),
    ).toBeVisible();

    // Empty state
    await expect(page.getByText("Nenhuma meta encontrada")).toBeVisible();

    await expect(
      page.getByText("Crie uma meta com pelo menos um indicador"),
    ).toBeVisible();
  });

  test("Filled state: renderiza lista de metas com resumo real", async ({ page }) => {
    await setupE2E(page);

    // Override GET metas with data
    await page.route(`${API}/metas`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({ status: 200, json: [mockMeta()] });
      }
      return route.continue();
    });

    await page.goto(METAS_PATH);
    await page.waitForLoadState("networkidle");

    // Meta row
    await expect(page.locator(".goal")).toHaveCount(1);
    await expect(page.locator(".goal-name")).toContainText(
      "Meta de Visitas Q2",
    );

    await expect(page.getByText("Progresso medio")).toBeVisible();
    await expect(page.getByText("50/100")).toBeVisible();
    await expect(page.getByText("30/50")).toBeVisible();
    await expect(page.getByText("5/10")).toBeVisible();
  });

  test("CRUD: cria meta via Sheet", async ({ page }) => {
    await setupE2E(page);

    let created = false;
    await page.route(`${API}/metas`, (route) => {
      const method = route.request().method();
      if (method === "GET" && !created) {
        return route.fulfill({ status: 200, json: [] });
      }
      if (method === "GET" && created) {
        return route.fulfill({ status: 200, json: [mockMeta()] });
      }
      if (method === "POST") {
        created = true;
        return route.fulfill({ status: 201, json: mockMeta() });
      }
      return route.continue();
    });

    await page.goto(METAS_PATH);
    await page.waitForLoadState("networkidle");

    // Open sheet
    await page.getByRole("button", { name: "Nova Meta" }).first().click();
    await page.waitForTimeout(400);

    await expect(page.getByText("Defina o periodo")).toBeVisible();

    await page.fill("#meta-nome", "Meta de Teste E2E");
    await page.fill("#meta-visitas", "25");
    await page.getByRole("button", { name: "Cadastrar Meta" }).click();
    await page.waitForTimeout(600);

    // Meta should appear
    await expect(page.locator(".goal")).toHaveCount(1);
  });

  test("CRUD: exclui meta com ConfirmDialog", async ({ page }) => {
    await setupE2E(page);

    await page.route(`${API}/metas`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({ status: 200, json: [mockMeta()] });
      }
      return route.continue();
    });

    // Mock DELETE
    await page.route(`${API}/metas/meta_e2e_001`, (route) => {
      if (route.request().method() === "DELETE") {
        return route.fulfill({ status: 204 });
      }
      return route.continue();
    });

    await page.goto(METAS_PATH);
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".goal")).toHaveCount(1);

    // Click trash icon
    await page.locator(".goal-more").first().click();
    await page.waitForTimeout(400);

    // Confirm dialog
    await expect(page.getByText("Voce esta prestes a excluir")).toBeVisible();

    await page.getByLabel("Excluir", { exact: true }).click();
    await page.waitForTimeout(400);

    // Meta removed
    await expect(page.locator(".goal")).toHaveCount(0);
  });

  test("Validação: mantém Cadastrar Meta desabilitado quando nome está vazio", async ({ page }) => {
    await setupE2E(page);

    await page.goto(METAS_PATH);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Nova Meta" }).first().click();
    await page.waitForTimeout(400);

    // O botão só habilita quando todos os obrigatórios estiverem preenchidos.
    await page.fill("#meta-nome", "");
    await page.fill("#meta-visitas", "10");

    await expect(page.getByRole("button", { name: "Cadastrar Meta" })).toBeDisabled();
  });

  test("Validação: mantém Cadastrar Meta desabilitado quando data fim <= data inicio", async ({ page }) => {
    await setupE2E(page);

    await page.goto(METAS_PATH);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Nova Meta" }).first().click();
    await page.waitForTimeout(400);

    await page.fill("#meta-nome", "Meta Inválida");
    await page.fill("#meta-data-inicio", "2026-12-01");
    await page.fill("#meta-data-fim", "2026-01-01");
    await page.fill("#meta-visitas", "10");

    await expect(page.getByRole("button", { name: "Cadastrar Meta" })).toBeDisabled();
  });
});
