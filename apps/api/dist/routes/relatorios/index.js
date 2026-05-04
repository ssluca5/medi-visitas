import { verifyClerkToken } from "../../hooks/auth.js";
import { resolveTenant } from "../../hooks/tenant.js";
import { prisma } from "../../lib/prisma.js";
import { getLimitesPlano } from "../../services/planos.js";
import { stringify } from "csv-stringify/sync";
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
      error: "Relatorios disponiveis a partir do Plano Profissional.",
      code: "FEATURE_NOT_AVAILABLE",
    });
    return false;
  }
  return true;
}
export default async function relatoriosRoutes(app) {
  app.addHook("preHandler", async (request, reply) => {
    await verifyClerkToken(request, reply);
    if (!reply.sent) await resolveTenant(request, reply);
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
      .send(csv);
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
    // Fetch user details to get the representative's name
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
      .send(csv);
  });
}
