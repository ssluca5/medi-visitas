import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function formatarHora(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

interface NotificacaoInsert {
  userId: string;
  tipo: string;
  prioridade: string;
  titulo: string;
  mensagem: string;
  profissionalId?: string;
  agendaItemId?: string;
}

Deno.serve(async () => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const notificacoesParaCriar: NotificacaoInsert[] = [];

  // 1. VISITA_HOJE — AgendaItems PLANEJADO com dataHoraInicio hoje
  const { data: agendaHoje } = await supabase
    .from("AgendaItem")
    .select(
      "id, userId, dataHoraInicio, profissionalId, profissional:Profissional(nome)",
    )
    .eq("status", "PLANEJADO")
    .is("deletedAt", null)
    .gte("dataHoraInicio", hoje.toISOString())
    .lt("dataHoraInicio", amanha.toISOString());

  for (const item of agendaHoje ?? []) {
    // Deduplicação: verificar se já existe notificação VISITA_HOJE para este agendaItemId hoje
    const { data: existente } = await supabase
      .from("Notificacao")
      .select("id")
      .eq("userId", item.userId)
      .eq("tipo", "VISITA_HOJE")
      .eq("agendaItemId", item.id)
      .is("deletedAt", null)
      .gte("createdAt", hoje.toISOString())
      .limit(1);

    if (existente && existente.length > 0) continue;

    const profissional = Array.isArray(item.profissional)
      ? item.profissional[0]
      : item.profissional;

    notificacoesParaCriar.push({
      userId: item.userId,
      tipo: "VISITA_HOJE",
      prioridade: "ALTA",
      titulo: "Visita agendada para hoje",
      mensagem: `${profissional?.nome ?? "Profissional"} — ${formatarHora(item.dataHoraInicio)}`,
      profissionalId: item.profissionalId,
      agendaItemId: item.id,
    });
  }

  // 2. VISITA_ATRASADA — AgendaItems PLANEJADO vencidos
  const { data: atrasados } = await supabase
    .from("AgendaItem")
    .select(
      "id, userId, dataHoraInicio, profissionalId, profissional:Profissional(nome)",
    )
    .eq("status", "PLANEJADO")
    .is("deletedAt", null)
    .lt("dataHoraInicio", hoje.toISOString());

  for (const item of atrasados ?? []) {
    // Deduplicação: verificar se já existe notificação VISITA_ATRASADA para este agendaItemId hoje
    const { data: existente } = await supabase
      .from("Notificacao")
      .select("id")
      .eq("userId", item.userId)
      .eq("tipo", "VISITA_ATRASADA")
      .eq("agendaItemId", item.id)
      .is("deletedAt", null)
      .gte("createdAt", hoje.toISOString())
      .limit(1);

    if (existente && existente.length > 0) continue;

    const profissional = Array.isArray(item.profissional)
      ? item.profissional[0]
      : item.profissional;

    notificacoesParaCriar.push({
      userId: item.userId,
      tipo: "VISITA_ATRASADA",
      prioridade: "URGENTE",
      titulo: "Visita não realizada",
      mensagem: `Agendamento com ${profissional?.nome ?? "profissional"} não foi registrado como realizado`,
      profissionalId: item.profissionalId,
      agendaItemId: item.id,
    });
  }

  // Inserir todas as notificações em batch
  if (notificacoesParaCriar.length > 0) {
    await supabase.from("Notificacao").insert(notificacoesParaCriar);
  }

  return new Response(
    JSON.stringify({ geradas: notificacoesParaCriar.length }),
    { headers: { "Content-Type": "application/json" } },
  );
});
