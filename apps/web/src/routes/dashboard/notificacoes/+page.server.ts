import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({ locals }) => {
  const token = locals.sessionToken;

  try {
    const res = await apiFetch("/notificacoes?page=1&pageSize=20", token);
    if (res.ok) {
      const body = await res.json();
      return { ...body, sessionToken: token };
    }
    return {
      data: [],
      total: 0,
      naoLidas: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
      sessionToken: token,
    };
  } catch {
    return {
      data: [],
      total: 0,
      naoLidas: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
      sessionToken: token,
    };
  }
};
