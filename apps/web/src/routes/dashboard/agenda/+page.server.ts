import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/api';

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;
  if (!token) return { agendaItems: [], sessionToken: token };

  // Calcular semana atual (seg-dom)
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(now);
  start.setDate(now.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const params = new URLSearchParams({
    dataInicio: start.toISOString(),
    dataFim: end.toISOString(),
    pageSize: '100',
  });

  const res = await apiFetch(`/visitas?${params}`, token);
  const data = res.ok ? await res.json() : { data: [] };

  return { agendaItems: data.data ?? data, sessionToken: token };
};
