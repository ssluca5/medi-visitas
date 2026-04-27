import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async () => {
  const agora = new Date().toISOString();

  // Find orgs with expired trial
  const { data: expiradas, error: queryError } = await supabase
    .from("Organization")
    .update({ status: "SUSPENSO" })
    .eq("status", "TRIAL_ATIVO")
    .lt("trialExpiraEm", agora)
    .select("id, nome");

  if (queryError) {
    return new Response(JSON.stringify({ error: queryError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Notify OWNER of each expired org
  for (const org of expiradas ?? []) {
    const { data: owner } = await supabase
      .from("OrganizationMembro")
      .select("userId")
      .eq("organizationId", org.id)
      .eq("role", "OWNER")
      .is("deletedAt", null)
      .single();

    if (owner) {
      await supabase.from("Notificacao").insert({
        userId: owner.userId,
        organizationId: org.id,
        tipo: "SISTEMA",
        prioridade: "URGENTE",
        titulo: "Trial expirado",
        mensagem:
          "Seu período gratuito terminou. Assine um plano para continuar usando o MediVisitas.",
      });
    }
  }

  return new Response(JSON.stringify({ expiradas: expiradas?.length ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
