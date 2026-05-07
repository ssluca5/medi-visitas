import { randomUUID } from "node:crypto";
import { z } from "zod";
import { stringify } from "csv-stringify/sync";
import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { getLimitesPlano } from "../../services/planos.js";
const filtrosSchema = z.object({
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  estagios: z.array(z.string()).optional(),
  potenciais: z.array(z.string()).optional(),
  especialidadeId: z.string().optional(),
});
const configSchema = z.object({
  colunas: z.array(z.string()).min(1),
  filtros: filtrosSchema.optional().default({}),
});
const salvarSchema = z.object({
  nome: z.string().min(1).max(100),
  tipo: z.enum(["visitas", "profissionais", "pipeline"]),
  config: configSchema,
});
const executarSchema = z.object({
  tipo: z.enum(["visitas", "profissionais", "pipeline"]),
  config: configSchema,
});
const exportarQuerySchema = z.object({
  formato: z.enum(["csv", "pdf"]).optional().default("csv"),
  tipo: executarSchema.shape.tipo,
  config: z.string(),
});
const COLUNAS_PERMITIDAS = {
  visitas: [
    "dataVisita",
    "profissional",
    "especialidade",
    "status",
    "objetivoVisita",
    "resumo",
    "proximaAcao",
    "materiais",
    "duracaoMinutos",
  ],
  profissionais: [
    "nome",
    "crm",
    "especialidade",
    "subEspecialidade",
    "potencial",
    "estagioPipeline",
    "classificacao",
    "cidade",
    "ultimaVisita",
  ],
  pipeline: [
    "profissional",
    "especialidade",
    "estagioAtual",
    "estagioAnterior",
    "dataTransicao",
    "diasNoEstagio",
  ],
};
function requireOwner(request, reply) {
  if (request.role !== "OWNER") {
    reply
      .status(403)
      .send({ error: "Apenas gestores têm acesso a relatórios gerenciais" });
    return false;
  }
  return true;
}
function requireRelatorios(request, reply) {
  if (!getLimitesPlano(request.plano).temRelatorios) {
    reply.status(402).send({
      error: "Relatórios disponíveis a partir do Plano Profissional.",
      code: "FEATURE_NOT_AVAILABLE",
    });
    return false;
  }
  return true;
}
function buildWhereDatas(filtros) {
  const gte = filtros.dataInicio ? new Date(filtros.dataInicio) : undefined;
  const lte = filtros.dataFim ? new Date(filtros.dataFim) : undefined;
  if (!gte && !lte) return undefined;
  return { ...(gte && { gte }), ...(lte && { lte }) };
}
async function executarVisitas(orgId, config) {
  const { filtros = {} } = config;
  const datas = buildWhereDatas(filtros);
  const rows = await prisma.visita.findMany({
    where: {
      organizationId: orgId,
      ...(datas && { dataVisita: datas }),
      ...(filtros.estagios?.length && {
        profissional: { estagioPipeline: { in: filtros.estagios } },
      }),
      ...(filtros.potenciais?.length && {
        profissional: { potencial: { in: filtros.potenciais } },
      }),
      ...(filtros.especialidadeId && {
        profissional: { especialidadeId: filtros.especialidadeId },
      }),
    },
    include: {
      profissional: { include: { especialidade: true } },
      materiais: { include: { materialTecnico: true } },
    },
    orderBy: { dataVisita: "desc" },
    take: 500,
  });
  return rows.map((v) => ({
    dataVisita: v.dataVisita.toISOString().slice(0, 10),
    profissional: v.profissional.nome,
    especialidade: v.profissional.especialidade?.nome ?? "—",
    status: v.status,
    objetivoVisita: v.objetivoVisita ?? "—",
    resumo: v.resumo ?? "—",
    proximaAcao: v.proximaAcao ?? "—",
    materiais: v.materiais.map((m) => m.materialTecnico.nome).join(", ") || "—",
    duracaoMinutos: v.duracaoMinutos ?? "—",
  }));
}
async function executarProfissionais(orgId, config) {
  const { filtros = {} } = config;
  const rows = await prisma.profissional.findMany({
    where: {
      organizationId: orgId,
      deletedAt: null,
      ...(filtros.estagios?.length && {
        estagioPipeline: { in: filtros.estagios },
      }),
      ...(filtros.potenciais?.length && {
        potencial: { in: filtros.potenciais },
      }),
      ...(filtros.especialidadeId && {
        especialidadeId: filtros.especialidadeId,
      }),
    },
    include: {
      especialidade: true,
      subEspecialidade: true,
      endereco: true,
      visitas: {
        orderBy: { dataVisita: "desc" },
        take: 1,
        select: { dataVisita: true },
      },
    },
    orderBy: { nome: "asc" },
    take: 500,
  });
  return rows.map((p) => ({
    nome: p.nome,
    crm: p.crm ?? "—",
    especialidade: p.especialidade?.nome ?? "—",
    subEspecialidade: p.subEspecialidade?.nome ?? "—",
    potencial: p.potencial,
    estagioPipeline: p.estagioPipeline,
    classificacao: p.classificacao ?? "—",
    cidade: p.endereco?.cidade ?? "—",
    ultimaVisita: p.visitas[0]?.dataVisita.toISOString().slice(0, 10) ?? "—",
  }));
}
async function executarPipeline(orgId, config) {
  const { filtros = {} } = config;
  const datas = buildWhereDatas(filtros);
  const logs = await prisma.estagioLog.findMany({
    where: {
      organizationId: orgId,
      ...(datas && { createdAt: datas }),
      ...(filtros.estagios?.length && {
        estagioNovo: { in: filtros.estagios },
      }),
      ...(filtros.potenciais?.length && {
        profissional: { potencial: { in: filtros.potenciais } },
      }),
      ...(filtros.especialidadeId && {
        profissional: { especialidadeId: filtros.especialidadeId },
      }),
    },
    include: { profissional: { include: { especialidade: true } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  const agora = new Date();
  const diasMap = {};
  for (const log of logs) {
    if (!diasMap[log.profissionalId]) {
      diasMap[log.profissionalId] = Math.floor(
        (agora.getTime() - log.createdAt.getTime()) / 86400000,
      );
    }
  }
  return logs.map((l) => ({
    profissional: l.profissional.nome,
    especialidade: l.profissional.especialidade?.nome ?? "—",
    estagioAtual: l.estagioNovo,
    estagioAnterior: l.estagioAnterior ?? "—",
    dataTransicao: l.createdAt.toISOString().slice(0, 10),
    diasNoEstagio: diasMap[l.profissionalId] ?? 0,
  }));
}
function escapeCsvValue(value) {
  const raw = String(value ?? "");
  const guarded = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  const escaped = guarded.replace(/"/g, '""');
  return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped;
}
function toCSV(colunas, linhas) {
  const header = colunas.map(escapeCsvValue).join(",");
  const body = linhas
    .map((row) => colunas.map((col) => escapeCsvValue(row[col])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
async function executarRelatorio(tipo, orgId, config) {
  if (tipo === "visitas") {
    return await executarVisitas(orgId, config);
  }
  if (tipo === "profissionais") {
    return await executarProfissionais(orgId, config);
  }
  return await executarPipeline(orgId, config);
}
export default async function relatoriosRoutes(app) {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
  });
  app.get("/configuracoes", async (request, reply) => {
    if (!requireRelatorios(request, reply)) return;
    const rows = await prisma.$queryRaw`
      SELECT "id", "userId", "organizationId", "nome", "tipo", "config", "createdAt", "updatedAt"
      FROM "RelatorioSalvo"
      WHERE "userId" = ${request.userId}
        AND "organizationId" = ${request.organizationId}
      ORDER BY "updatedAt" DESC
    `;
    return reply.send(rows);
  });
  app.post("/configuracoes", async (request, reply) => {
    if (!requireRelatorios(request, reply)) return;
    const body = salvarSchema.parse(request.body);
    const id = randomUUID();
    const rows = await prisma.$queryRaw`
      INSERT INTO "RelatorioSalvo" ("id", "userId", "organizationId", "nome", "tipo", "config", "createdAt", "updatedAt")
      VALUES (${id}, ${request.userId}, ${request.organizationId}, ${body.nome}, ${body.tipo}, ${JSON.stringify(body.config)}::jsonb, now(), now())
      RETURNING "id", "userId", "organizationId", "nome", "tipo", "config", "createdAt", "updatedAt"
    `;
    return reply.status(201).send(rows[0]);
  });
  app.delete("/configuracoes/:id", async (request, reply) => {
    if (!requireRelatorios(request, reply)) return;
    const { id } = request.params;
    const rows = await prisma.$queryRaw`
      DELETE FROM "RelatorioSalvo"
      WHERE "id" = ${id}
        AND "userId" = ${request.userId}
        AND "organizationId" = ${request.organizationId}
      RETURNING "id"
    `;
    if (!rows.length)
      return reply.status(404).send({ error: "Não encontrado" });
    return reply.status(204).send();
  });
  app.post("/executar", async (request, reply) => {
    if (!requireRelatorios(request, reply)) return;
    const body = executarSchema.parse(request.body);
    const permitidas = COLUNAS_PERMITIDAS[body.tipo];
    const colunas = body.config.colunas.filter((c) => permitidas.includes(c));
    if (!colunas.length) {
      return reply
        .status(400)
        .send({ error: "Nenhuma coluna válida selecionada" });
    }
    const linhasBrutas = await executarRelatorio(
      body.tipo,
      request.organizationId,
      body.config,
    );
    const linhas = linhasBrutas.map((row) =>
      Object.fromEntries(colunas.map((c) => [c, row[c]])),
    );
    return reply.send({ colunas, linhas, total: linhas.length });
  });
  app.get("/exportar", async (request, reply) => {
    if (!requireRelatorios(request, reply)) return;
    const query = exportarQuerySchema.parse(request.query);
    let config;
    try {
      config = configSchema.parse(JSON.parse(decodeURIComponent(query.config)));
    } catch {
      return reply.status(400).send({ error: "Configuração inválida" });
    }
    const permitidas = COLUNAS_PERMITIDAS[query.tipo];
    const colunas = config.colunas.filter((c) => permitidas.includes(c));
    if (!colunas.length) {
      return reply
        .status(400)
        .send({ error: "Nenhuma coluna válida selecionada" });
    }
    const linhasBrutas = await executarRelatorio(
      query.tipo,
      request.organizationId,
      config,
    );
    const linhas = linhasBrutas.map((row) =>
      Object.fromEntries(colunas.map((c) => [c, row[c]])),
    );
    const nomeArquivo = `relatorio-${query.tipo}-${new Date().toISOString().slice(0, 10)}`;
    if (query.formato === "csv") {
      reply.header("Content-Type", "text/csv; charset=utf-8");
      reply.header(
        "Content-Disposition",
        `attachment; filename="${nomeArquivo}.csv"`,
      );
      return reply.send("\uFEFF" + toCSV(colunas, linhas));
    }
    const htmlLinhas = linhas
      .map(
        (row) =>
          `<tr>${colunas
            .map((c) => `<td>${escapeHtml(row[c])}</td>`)
            .join("")}</tr>`,
      )
      .join("");
    const titulo = `Relatório — ${query.tipo.charAt(0).toUpperCase() + query.tipo.slice(1)}`;
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(nomeArquivo)}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; padding: 24px; }
    h1 { font-size: 16px; margin-bottom: 4px; }
    p { color: #6b7280; font-size: 11px; margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #f3f4f6; text-align: left; padding: 6px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e5e7eb; }
    td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
    tr:last-child td { border-bottom: none; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(titulo)}</h1>
  <p>Gerado em ${escapeHtml(new Date().toLocaleString("pt-BR"))} · ${linhas.length} registros</p>
  <table>
    <thead><tr>${colunas.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
    <tbody>${htmlLinhas}</tbody>
  </table>
  <script>window.onload = () => window.print()<\/script>
</body>
</html>`;
    reply.header("Content-Type", "text/html; charset=utf-8");
    return reply.send(html);
  });
  app.get("/profissionais", async (request, reply) => {
    if (!requireRelatorios(request, reply)) return;
    if (!requireOwner(request, reply)) return;
    const organizationId = request.organizationId;
    const profissionais = await prisma.profissional.findMany({
      where: { organizationId, deletedAt: null },
      include: { especialidade: true, endereco: true },
      orderBy: { nome: "asc" },
    });
    const records = profissionais.map((p) => ({
      ID: p.id,
      Nome: p.nome,
      Email: p.email || "",
      Telefone: p.telefone || "",
      CRM: p.crm || "",
      UF: p.endereco?.estado || "",
      Cidade: p.endereco?.cidade || "",
      Especialidade: p.especialidade?.nome || "",
      Estagio_Pipeline: p.estagioPipeline,
      Criado_Em: p.createdAt.toISOString(),
    }));
    const csv = stringify(records, { header: true, delimiter: ";" });
    return reply
      .header("Content-Type", "text/csv; charset=utf-8")
      .header("Content-Disposition", 'attachment; filename="profissionais.csv"')
      .send("\uFEFF" + csv);
  });
  app.get("/visitas", async (request, reply) => {
    if (!requireRelatorios(request, reply)) return;
    if (!requireOwner(request, reply)) return;
    const organizationId = request.organizationId;
    const visitas = await prisma.visita.findMany({
      where: { organizationId },
      include: { profissional: true },
      orderBy: { dataVisita: "desc" },
    });
    const userIds = Array.from(new Set(visitas.map((v) => v.userId)));
    const users = await prisma.user.findMany({
      where: { clerkId: { in: userIds } },
      select: { clerkId: true, name: true },
    });
    const userMap = new Map(users.map((u) => [u.clerkId, u.name || "Usuário"]));
    const records = visitas.map((v) => ({
      ID: v.id,
      Data: v.dataVisita.toISOString(),
      Profissional: v.profissional?.nome || "N/A",
      Representante: userMap.get(v.userId) || "N/A",
      Status: v.status,
      Objetivo: v.objetivoVisita || "",
      Resumo: v.resumo || "",
    }));
    const csv = stringify(records, { header: true, delimiter: ";" });
    return reply
      .header("Content-Type", "text/csv; charset=utf-8")
      .header("Content-Disposition", 'attachment; filename="visitas.csv"')
      .send("\uFEFF" + csv);
  });
}
