import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;
  if (!token) return { pipeline: null, sessionToken: token };

  const res = await apiFetch("/pipeline", token);
  const pipeline = res.ok ? await res.json() : null;

  return { pipeline, sessionToken: token };
};
