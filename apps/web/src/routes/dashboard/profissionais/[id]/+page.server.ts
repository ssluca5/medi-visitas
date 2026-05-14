import type { PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({ locals, params }) => {
  const token = locals.sessionToken;
  const id = params.id;
  if (!token)
    return {
      profissional: null,
      visitas: [],
      materiais: [],
      visaoGeral: null,
      sessionToken: token,
    };

  const [profRes, visitasRes, materiaisRes, visaoRes] = await Promise.all([
    apiFetch(`/profissionais/${id}`, token),
    apiFetch(`/visitas?profissionalId=${id}&pageSize=50`, token),
    apiFetch("/materiais?pageSize=100", token),
    apiFetch(`/profissionais/${id}/visao-geral`, token),
  ]);

  const profissional = profRes.ok ? await profRes.json() : null;
  const visitasData = visitasRes.ok ? await visitasRes.json() : { data: [] };
  const materiaisData = materiaisRes.ok
    ? await materiaisRes.json()
    : { data: [] };
  const visaoGeral = visaoRes.ok ? await visaoRes.json() : null;

  return {
    profissional,
    visitas: visitasData.data ?? visitasData,
    materiais: materiaisData.data ?? materiaisData,
    visaoGeral,
    sessionToken: token,
  };
};
