import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;

  try {
    const [meRes, billingRes, orgRes] = await Promise.all([
      apiFetch("/me", token),
      apiFetch("/billing/status", token),
      apiFetch("/organizacao/info", token),
    ]);

    const me = meRes.ok ? await meRes.json() : null;
    const billing = billingRes.ok ? await billingRes.json() : null;
    const org = orgRes.ok ? await orgRes.json() : null;

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

    return { me, billing, diasRestantesTrial, org, sessionToken: token };
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
