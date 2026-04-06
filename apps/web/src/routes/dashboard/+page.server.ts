import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;

  try {
    const [resumoRes, alertasRes] = await Promise.all([
      apiFetch("/dashboard/resumo", token),
      apiFetch("/dashboard/alertas", token),
    ]);

    const resumo = resumoRes.ok ? await resumoRes.json() : null;
    const alertas = alertasRes.ok ? await alertasRes.json() : [];

    return { resumo, alertas };
  } catch {
    return { resumo: null, alertas: [] };
  }
};
