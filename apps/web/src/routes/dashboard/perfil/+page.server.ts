import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";

async function safeFetch(
  path: string,
  token: string | null,
): Promise<Response | null> {
  try {
    return await apiFetch(path, token);
  } catch {
    return null;
  }
}

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;

  try {
    const [meRes, billingRes, orgRes] = await Promise.all([
      safeFetch("/me", token),
      safeFetch("/billing/status", token),
      safeFetch("/organizacao/info", token),
    ]);

    const me = meRes?.ok ? await meRes.json() : null;
    const billing = billingRes?.ok ? await billingRes.json() : null;
    const org = orgRes?.ok ? await orgRes.json() : null;
    const meComFallback = me
      ? {
          ...me,
          email:
            me.email && !me.email.endsWith("@placeholder.local")
              ? me.email
              : (locals.userEmail ?? me.email),
          name: me.name ?? locals.userName,
        }
      : locals.userId
        ? {
            id: locals.userId,
            email: locals.userEmail ?? "",
            name: locals.userName ?? null,
            organizationId: null,
            role: null,
            tourConcluidoEm: null,
            notifVisitasDia: true,
            notifSemVisitaRecente: true,
            notifAgendaNaoRealizada: true,
            notifLembretesAuto: true,
          }
        : null;

    // Calcular dias restantes do trial
    let diasRestantesTrial: number | null = null;
    if (billing?.status === "TRIAL_ATIVO" && billing?.trialExpiraEm) {
      const expira = new Date(billing.trialExpiraEm);
      const agora = new Date();
      diasRestantesTrial = Math.max(
        0,
        Math.ceil((expira.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)),
      );
    }

    return {
      me: meComFallback,
      billing,
      diasRestantesTrial,
      org,
      sessionToken: token,
    };
  } catch {
    return {
      me: null,
      billing: null,
      diasRestantesTrial: null,
      org: null,
      sessionToken: token,
    };
  }
};
