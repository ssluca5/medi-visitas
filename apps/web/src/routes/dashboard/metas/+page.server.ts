import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";

function normalizeList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: T[] }).data;
  }
  return [];
}

export const load: PageServerLoad = async ({ locals, parent }) => {
  const token = locals.sessionToken;
  if (!token) return { metas: [], membros: [], sessionToken: token };

  const parentData = await parent();
  const temGestaoEquipe =
    (parentData as Record<string, unknown>).temGestaoEquipe ?? false;

  const fetches: Promise<Response>[] = [apiFetch("/metas", token)];
  if (temGestaoEquipe) fetches.push(apiFetch("/organizacao/membros", token));

  const results = await Promise.all(fetches);
  const metas = results[0].ok ? normalizeList(await results[0].json()) : [];
  const membros = results[1]?.ok ? normalizeList(await results[1].json()) : [];

  return { metas, membros, sessionToken: token };
};
