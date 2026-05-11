import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/api';

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;
  if (!token) return { materiais: [], sessionToken: token };

  const res = await apiFetch('/materiais?pageSize=500&incluirInativos=true', token);
  const materiais = res.ok ? await res.json() : [];

  return { materiais: materiais.data ?? materiais, sessionToken: token };
};
