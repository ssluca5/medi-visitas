import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/api';

function normalizeList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
    return (value as { data: T[] }).data;
  }
  return [];
}

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;
  if (!token) return { profissionais: null, especialidades: [], sessionToken: token };

  const [profRes, espRes] = await Promise.all([
    apiFetch('/profissionais?page=1&pageSize=20', token),
    apiFetch('/especialidades', token),
  ]);

  const profissionais = profRes.ok ? await profRes.json() : null;
  const especialidades = espRes.ok ? normalizeList(await espRes.json()) : [];

  return { profissionais, especialidades, sessionToken: token };
};
