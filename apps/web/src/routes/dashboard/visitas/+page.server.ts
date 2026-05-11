import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/api';

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;
  if (!token) return { visitas: null, materiais: [], sessionToken: token };

  const [visitasRes, materiaisRes] = await Promise.all([
    apiFetch('/visitas?page=1&pageSize=20', token),
    apiFetch('/materiais?pageSize=100', token),
  ]);

  const visitas = visitasRes.ok ? await visitasRes.json() : null;
  const materiaisData = materiaisRes.ok ? await materiaisRes.json() : { data: [] };

  return { visitas, materiais: materiaisData.data ?? materiaisData, sessionToken: token };
};
