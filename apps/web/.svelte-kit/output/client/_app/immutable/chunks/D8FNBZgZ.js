import "./Bzak7iHL.js";
import {
  p as aa,
  V as Pe,
  d as s,
  s as o,
  r as i,
  t as O,
  z as e,
  a as v,
  B as a,
  b as ta,
  U as h,
  c as p,
  I as ya,
  f as ie,
  Y as ge,
  e as ea,
  X as Te,
  W as ne,
  F as Ae,
} from "./CZsNqhY1.js";
import { s as P } from "./D4SvF6kG.js";
import { p as ce, i as R } from "./CsBhEEN0.js";
import { e as qe, i as Ze } from "./D_ntMQAe.js";
import { r as ve, d as ia, s as Da, f as wa } from "./DDioZlon.js";
import { d as sa, a as ue, e as je } from "./BLFvJadL.js";
import { b as B, a as ze } from "./DFOm60R7.js";
import { S as ka, C as Ea } from "./CSHFKzA8.js";
import { B as he } from "./DI35S9H6.js";
import { S as Ia } from "./EGrcUm4A.js";
var Na = p("<option> </option>"),
  Va = p(
    '<li class="flex items-center justify-between text-sm bg-white p-2 rounded shadow-sm border border-gray-200"><div><span class="font-medium text-indigo-700 bg-indigo-50 px-2 rounded-full text-xs py-0.5"> </span> <span class="ml-2 text-gray-800"> </span></div> <div><button type="button" class="text-red-500 hover:text-red-700 p-1" aria-label="Remover"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></li>',
  ),
  Ra = p(
    '<div class="bg-gray-50 rounded-md border p-3"><h4 class="text-sm font-medium text-gray-700 mb-2">Materiais a Entregar:</h4> <ul class="space-y-2"></ul></div>',
  ),
  Oa = p(
    '<div class="space-y-4"><div class="flex gap-2 items-end"><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1" for="materialSelectedId">Material Técnico</label> <select id="materialSelectedId" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"><option>-- Selecione --</option><!></select></div> <div class="w-20"><label class="block text-sm font-medium text-gray-700 mb-1" for="materialQtd">Qtd</label> <input id="materialQtd" type="number" min="1" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"/></div> <div><button type="button" class="flex items-center justify-center w-9 h-9 text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg leading-none cursor-pointer" title="Adicionar material">+</button></div></div> <!></div>',
  );
function Sa(ye, d) {
  aa(d, !0);
  let l = ce(d, "materiaisOptions", 19, () => []),
    b = ce(d, "selections", 31, () => Pe([])),
    w = ce(d, "isReadOnly", 3, !1),
    k = h(""),
    _ = h(1);
  function S() {
    if (!e(k)) return;
    const m = b().find((D) => D.materialTecnicoId === e(k));
    if (m)
      confirm(
        "Material já selecionado. Deseja adicionar mais a quantidade existente?",
      ) && ((m.quantidade += e(_)), b([...b()]));
    else {
      const D = l().find((I) => I.id === e(k));
      b([
        ...b(),
        { materialTecnicoId: e(k), quantidade: e(_), materialTecnico: D },
      ]);
    }
    (a(k, ""), a(_, 1));
  }
  function q(m) {
    (b().splice(m, 1), b([...b()]));
  }
  var L = Oa(),
    T = s(L),
    j = s(T),
    M = o(s(j), 2),
    z = s(M);
  z.value = z.__value = "";
  var G = o(z);
  (qe(G, 17, l, Ze, (m, D) => {
    var I = Na(),
      se = s(I);
    i(I);
    var X = {};
    (O(() => {
      (P(se, `${e(D).nome ?? ""} (${e(D).tipo ?? ""})`),
        X !== (X = e(D).id) && (I.value = (I.__value = e(D).id) ?? ""));
    }),
      v(m, I));
  }),
    i(M),
    i(j));
  var H = o(j, 2),
    g = o(s(H), 2);
  (ve(g), i(H));
  var me = o(H, 2),
    E = s(me);
  (i(me), i(T));
  var K = o(T, 2);
  {
    var $ = (m) => {
      var D = Ra(),
        I = o(s(D), 2);
      (qe(I, 21, b, Ze, (se, X, fe) => {
        var ee = Va(),
          oe = s(ee),
          n = s(oe),
          u = s(n);
        i(n);
        var N = o(n, 2),
          Z = s(N, !0);
        (i(N), i(oe));
        var F = o(oe, 2),
          ae = s(F);
        (i(F),
          i(ee),
          O(() => {
            var J;
            (P(u, `${e(X).quantidade ?? ""}x`),
              P(
                Z,
                ((J = e(X).materialTecnico) == null ? void 0 : J.nome) ||
                  "Material Desconhecido",
              ),
              Da(F, 1, wa(w() ? "hidden" : "block")));
          }),
          ue("click", ae, () => q(fe)),
          v(se, ee));
      }),
        i(I),
        i(D),
        v(m, D));
    };
    R(K, (m) => {
      b().length > 0 && m($);
    });
  }
  (i(L),
    O(() => {
      ((M.disabled = w()), (g.disabled = w()), (E.disabled = !e(k) || w()));
    }),
    ia(
      M,
      () => e(k),
      (m) => a(k, m),
    ),
    B(
      g,
      () => e(_),
      (m) => a(_, m),
    ),
    ue("click", E, S),
    v(ye, L),
    ta());
}
sa(["click"]);
var Ma = p(
    '<div class="mb-4"><label class="block text-sm font-medium text-slate-700 mb-1.5">Profissional</label> <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium"> </div></div>',
  ),
  Ca = p(
    '<div class="mb-4"><label class="block text-sm font-medium text-slate-700 mb-1.5">Profissional</label> <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium"> </div></div>',
  ),
  La = p(
    '<div class="flex items-center justify-between border border-slate-200 rounded-lg py-2 px-3 bg-indigo-50"><span class="text-sm font-medium text-slate-800"> </span> <button type="button" class="text-xs text-indigo-600 hover:underline">Trocar</button></div>',
  ),
  Ta = p('<div class="text-xs text-slate-500"> </div>'),
  ja = p(
    '<button type="button" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"><div class="font-medium text-slate-800"> </div> <!></button>',
  ),
  za = p(
    '<div class="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"></div>',
  ),
  Pa = p(
    '<div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><!></span> <input id="profissionalBusca" type="text" placeholder="Buscar médico..." class="input-base !pl-9" autocomplete="off"/></div> <!>',
    1,
  ),
  qa = p(
    '<div class="relative"><label class="block text-sm font-medium text-slate-700 mb-1.5" for="profissionalBusca">Selecione o Profissional</label> <!></div>',
  ),
  Za = p(
    '<div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="resumo">Resumo da Visita / Feedback</label> <textarea id="resumo" name="resumo" rows="3" class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="O médico gostou da amostra..."></textarea></div> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="proximaAcao">Próxima Ação / Follow-up</label> <input type="text" id="proximaAcao" name="proximaAcao" class="input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Retornar daqui a 30 dias"/></div>',
    1,
  ),
  Fa = p(
    '<div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="motivoCancelamento">Motivo do Cancelamento</label> <textarea id="motivoCancelamento" name="motivoCancelamento" rows="3" class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Descreva o motivo do cancelamento..."></textarea></div>',
  ),
  Ba = p(
    '<div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="motivoNaoRealizacao">Motivo da Não Realização</label> <textarea id="motivoNaoRealizacao" name="motivoNaoRealizacao" rows="3" class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Descreva o motivo da não realização..."></textarea></div>',
  ),
  Ga = p("<div></div>"),
  Ja = p("<!> <!>", 1),
  Qa = p(
    '<div class="flex h-full flex-col"><div class="mb-6"><h2 class="text-lg font-semibold text-slate-900"> </h2> <p class="mt-1 text-sm text-slate-400"> </p></div> <div class="flex-1 overflow-y-auto pr-2 pb-6"><form class="space-y-5" id="visitaForm"><div class="space-y-4"><!> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="dataVisita">Data e Hora</label> <input type="datetime-local" id="dataVisita" name="dataVisita" required="" class="input-base disabled:bg-slate-50 disabled:text-slate-500"/></div> <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="status">Status</label> <select id="status" name="status" class="input-base disabled:bg-slate-50 disabled:text-slate-500"><option>Agendada</option><option>Realizada</option><option>Cancelada</option><option>Não Realizada</option></select></div> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="duracaoMinutos">Duração (min)</label> <input type="number" id="duracaoMinutos" name="duracaoMinutos" class="input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="e.g. 30"/></div></div></div> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="objetivoVisita">Objetivo da Visita</label> <textarea id="objetivoVisita" name="objetivoVisita" rows="3" class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Apresentação do produto X"></textarea></div> <!> <!> <!> <hr class="border-slate-200"/> <div><h3 class="text-sm font-semibold text-slate-800 mb-3">Materiais / Amostras</h3> <!></div></form></div> <div class="mt-auto border-t border-slate-100 pt-4 pb-2"><div class="flex justify-between gap-3"><!> <div class="flex gap-3 ml-auto"><!></div></div></div></div>',
  ),
  Ua = p(
    "<p>A exclusão de dados é permanente. Tem certeza que deseja prosseguir?</p>",
  ),
  Ha = p("<!> <!>", 1);
function rt(ye, d) {
  aa(d, !0);
  let l = ce(d, "visita", 3, null),
    b = ce(d, "duplicateSource", 3, null),
    w = h(!1),
    k = h(!1),
    _ = h("AGENDADA"),
    S = h(""),
    q = h(""),
    L = h(""),
    T = h(""),
    j = h(""),
    M = h(""),
    z = h(""),
    G = h(Pe([])),
    H = Ae(() => {
      var u;
      if (!((u = l()) != null && u.dataVisita)) return !1;
      const n = new Date(l().dataVisita);
      return (
        l().duracaoMinutos &&
          n.setMinutes(n.getMinutes() + Number(l().duracaoMinutos)),
        n < new Date()
      );
    }),
    g = Ae(() => {
      var n;
      return !((n = l()) != null && n.id) || !e(H)
        ? !1
        : !!(
            l().status === "REALIZADA" ||
            ((l().status === "CANCELADA" || l().status === "NAO_REALIZADA") &&
              e(H))
          );
    }),
    me = Ae(() => {
      var n;
      return !((n = l()) != null && n.id) || !d.ondelete ? !1 : !e(H);
    }),
    E = h(""),
    K = h(Pe([])),
    $ = h(!1),
    m = h(null);
  async function D() {
    if (!e(E).trim() || e(E).length < 2) {
      a(K, [], !0);
      return;
    }
    try {
      const n = await ze(
        `/profissionais?q=${encodeURIComponent(e(E))}`,
        d.sessionToken,
      );
      if (n.ok) {
        const u = await n.json(),
          N = u.data || u;
        a(
          K,
          N.filter(
            (Z) => !!Z.nome.toLowerCase().includes(e(E).toLowerCase()),
          ).slice(0, 8),
          !0,
        );
      }
    } catch {}
  }
  ya(() => {
    var n;
    if (d.open)
      if (b()) {
        if ((a(_, "AGENDADA"), b().dataVisita)) {
          const u = new Date(b().dataVisita);
          (u.setMinutes(u.getMinutes() - u.getTimezoneOffset()),
            a(S, u.toISOString().slice(0, 16), !0));
        } else a(S, "");
        (a(q, b().duracaoMinutos || "", !0),
          a(L, b().objetivoVisita || "", !0),
          a(T, ""),
          a(j, ""),
          a(M, ""),
          a(z, ""),
          a(
            G,
            b().materiais ? JSON.parse(JSON.stringify(b().materiais)) : [],
            !0,
          ),
          a(m, null),
          a(E, ""));
      } else if ((n = l()) != null && n.id) {
        if ((a(_, l().status || "AGENDADA", !0), l().dataVisita)) {
          const u = new Date(l().dataVisita);
          (u.setMinutes(u.getMinutes() - u.getTimezoneOffset()),
            a(S, u.toISOString().slice(0, 16), !0));
        } else a(S, "");
        (a(q, l().duracaoMinutos || "", !0),
          a(L, l().objetivoVisita || "", !0),
          a(T, l().resumo || "", !0),
          a(j, l().proximaAcao || "", !0),
          a(M, l().motivoCancelamento || "", !0),
          a(z, l().motivoNaoRealizacao || "", !0),
          a(
            G,
            l().materiais ? JSON.parse(JSON.stringify(l().materiais)) : [],
            !0,
          ));
      } else
        (a(_, "AGENDADA"),
          d.defaultDateTime
            ? a(S, d.defaultDateTime.slice(0, 16), !0)
            : a(S, ""),
          a(q, ""),
          a(L, ""),
          a(T, ""),
          a(j, ""),
          a(M, ""),
          a(z, ""),
          a(G, [], !0),
          a(m, null),
          a(E, ""));
  });
  async function I(n) {
    var ae, J, be, te;
    (n.preventDefault(), a(w, !0));
    const u = d.sessionToken,
      N = {
        profissionalId:
          d.profissionalId ||
          ((ae = l()) == null ? void 0 : ae.profissionalId) ||
          ((J = e(m)) == null ? void 0 : J.id),
        status: e(_),
        dataVisita: new Date(e(S)).toISOString(),
        duracaoMinutos: e(q) ? Number(e(q)) : null,
        objetivoVisita: e(L),
        resumo: e(_) === "REALIZADA" ? e(T) : null,
        proximaAcao: e(_) === "REALIZADA" ? e(j) : null,
        motivoCancelamento: e(_) === "CANCELADA" ? e(M) : null,
        motivoNaoRealizacao: e(_) === "NAO_REALIZADA" ? e(z) : null,
        materiais: e(G).map((C) => ({
          materialTecnicoId: C.materialTecnicoId,
          quantidade: C.quantidade,
        })),
      },
      Z = (be = l()) != null && be.id ? `/visitas/${l().id}` : "/visitas",
      F = (te = l()) != null && te.id ? "PUT" : "POST";
    try {
      const C = await ze(Z, u, { method: F, body: JSON.stringify(N) });
      if (C.ok) (d.onsave && d.onsave(), d.onclose());
      else {
        const Q = await C.json().catch(() => null);
        (console.error("Falha ao salvar visita", Q),
          alert(
            (Q == null ? void 0 : Q.message) || "Erro ao salvar a visita.",
          ));
      }
    } catch (C) {
      (console.error(C), alert("Erro inesperado de conexão."));
    } finally {
      a(w, !1);
    }
  }
  function se() {
    var n;
    !((n = l()) != null && n.id) || !d.ondelete || a(k, !0);
  }
  async function X() {
    var n;
    if (!(!((n = l()) != null && n.id) || !d.ondelete)) {
      a(w, !0);
      try {
        (await ze(`/visitas/${l().id}`, d.sessionToken, { method: "DELETE" }))
          .ok
          ? (d.ondelete(l().id), a(k, !1), d.onclose())
          : alert("Erro ao excluir visita.");
      } catch {
        alert("Erro inesperado de conexão.");
      } finally {
        a(w, !1);
      }
    }
  }
  var fe = Ha(),
    ee = ie(fe);
  ka(ee, {
    get open() {
      return d.open;
    },
    get onclose() {
      return d.onclose;
    },
    side: "right",
    children: (n, u) => {
      var N = Qa(),
        Z = s(N),
        F = s(Z),
        ae = s(F, !0);
      i(F);
      var J = o(F, 2),
        be = s(J, !0);
      (i(J), i(Z));
      var te = o(Z, 2),
        C = s(te),
        Q = s(C),
        Fe = s(Q);
      {
        var oa = (t) => {
            var r = ea(),
              c = ie(r);
            {
              var f = (y) => {
                var x = Ma(),
                  A = o(s(x), 2),
                  V = s(A, !0);
                (i(A), i(x), O(() => P(V, d.profissionalNome)), v(y, x));
              };
              R(c, (y) => {
                typeof d.profissionalId == "string" &&
                  d.profissionalNome &&
                  y(f);
              });
            }
            v(t, r);
          },
          ra = (t) => {
            var r = Ca(),
              c = o(s(r), 2),
              f = s(c, !0);
            (i(c),
              i(r),
              O(() => {
                var y;
                return P(
                  f,
                  ((y = l().profissional) == null ? void 0 : y.nome) ||
                    "Profissional",
                );
              }),
              v(t, r));
          },
          la = (t) => {
            var r = qa(),
              c = o(s(r), 2);
            {
              var f = (x) => {
                  var A = La(),
                    V = s(A),
                    W = s(V, !0);
                  i(V);
                  var re = o(V, 2);
                  (i(A),
                    O(() => P(W, e(m).nome)),
                    ue("click", re, () => a(m, null)),
                    v(x, A));
                },
                y = (x) => {
                  var A = Pa(),
                    V = ie(A),
                    W = s(V),
                    re = s(W);
                  (Ia(re, { class: "w-4 h-4" }), i(W));
                  var Y = o(W, 2);
                  (ve(Y), i(V));
                  var U = o(V, 2);
                  {
                    var le = (de) => {
                      var Se = za();
                      (qe(
                        Se,
                        21,
                        () => e(K),
                        Ze,
                        (pa, pe) => {
                          var _e = ja(),
                            Me = s(_e),
                            _a = s(Me, !0);
                          i(Me);
                          var ga = o(Me, 2);
                          {
                            var Aa = (Ce) => {
                              var Le = Ta(),
                                ha = s(Le, !0);
                              (i(Le),
                                O(() => P(ha, e(pe).especialidade.nome)),
                                v(Ce, Le));
                            };
                            R(ga, (Ce) => {
                              e(pe).especialidade && Ce(Aa);
                            });
                          }
                          (i(_e),
                            O(() => P(_a, e(pe).nome)),
                            ue("click", _e, () => {
                              (a(m, e(pe), !0), a($, !1), a(E, ""));
                            }),
                            v(pa, _e));
                        },
                      ),
                        i(Se),
                        v(de, Se));
                    };
                    R(U, (de) => {
                      e($) && e(K).length > 0 && de(le);
                    });
                  }
                  (ue("input", Y, D),
                    je("focus", Y, () => a($, !0)),
                    je("blur", Y, () => setTimeout(() => a($, !1), 200)),
                    B(
                      Y,
                      () => e(E),
                      (de) => a(E, de),
                    ),
                    v(x, A));
                };
              R(c, (x) => {
                e(m) ? x(f) : x(y, -1);
              });
            }
            (i(r), v(t, r));
          };
        R(Fe, (t) => {
          var r, c, f;
          d.profissionalId && !((r = l()) != null && r.profissionalId)
            ? t(oa)
            : (c = l()) != null && c.profissionalId
              ? t(ra, 1)
              : !d.profissionalId &&
                !((f = l()) != null && f.profissionalId) &&
                t(la, 2);
        });
      }
      var De = o(Fe, 2),
        we = o(s(De), 2);
      (ve(we), i(De));
      var Be = o(De, 2),
        ke = s(Be),
        xe = o(s(ke), 2),
        Ee = s(xe);
      Ee.value = Ee.__value = "AGENDADA";
      var Ie = o(Ee);
      Ie.value = Ie.__value = "REALIZADA";
      var Ne = o(Ie);
      Ne.value = Ne.__value = "CANCELADA";
      var Ge = o(Ne);
      ((Ge.value = Ge.__value = "NAO_REALIZADA"), i(xe), i(ke));
      var Je = o(ke, 2),
        Ve = o(s(Je), 2);
      (ve(Ve), i(Je), i(Be), i(Q));
      var Re = o(Q, 2),
        Oe = o(s(Re), 2);
      (ge(Oe), i(Re));
      var Qe = o(Re, 2);
      {
        var da = (t) => {
          var r = Za(),
            c = ie(r),
            f = o(s(c), 2);
          (ge(f), i(c));
          var y = o(c, 2),
            x = o(s(y), 2);
          (ve(x),
            i(y),
            O(() => {
              ((f.disabled = e(g)), (x.disabled = e(g)));
            }),
            B(
              f,
              () => e(T),
              (A) => a(T, A),
            ),
            B(
              x,
              () => e(j),
              (A) => a(j, A),
            ),
            v(t, r));
        };
        R(Qe, (t) => {
          var r;
          (e(_) === "REALIZADA" ||
            (e(g) &&
              ((r = l()) == null ? void 0 : r.status) === "REALIZADA")) &&
            t(da);
        });
      }
      var Ue = o(Qe, 2);
      {
        var na = (t) => {
          var r = Fa(),
            c = o(s(r), 2);
          (ge(c),
            i(r),
            O(() => (c.disabled = e(g))),
            B(
              c,
              () => e(M),
              (f) => a(M, f),
            ),
            v(t, r));
        };
        R(Ue, (t) => {
          var r;
          (e(_) === "CANCELADA" ||
            (e(g) &&
              ((r = l()) == null ? void 0 : r.status) === "CANCELADA")) &&
            t(na);
        });
      }
      var He = o(Ue, 2);
      {
        var va = (t) => {
          var r = Ba(),
            c = o(s(r), 2);
          (ge(c),
            i(r),
            O(() => (c.disabled = e(g))),
            B(
              c,
              () => e(z),
              (f) => a(z, f),
            ),
            v(t, r));
        };
        R(He, (t) => {
          var r;
          (e(_) === "NAO_REALIZADA" ||
            (e(g) &&
              ((r = l()) == null ? void 0 : r.status) === "NAO_REALIZADA")) &&
            t(va);
        });
      }
      var Xe = o(He, 4),
        ca = o(s(Xe), 2);
      (Sa(ca, {
        get materiaisOptions() {
          return d.materiaisOptions;
        },
        get isReadOnly() {
          return e(g);
        },
        get selections() {
          return e(G);
        },
        set selections(t) {
          a(G, t, !0);
        },
      }),
        i(Xe),
        i(C),
        i(te));
      var We = o(te, 2),
        Ye = s(We),
        Ke = s(Ye);
      {
        var ua = (t) => {
            he(t, {
              variant: "destructive",
              type: "button",
              onclick: se,
              get disabled() {
                return e(w);
              },
              children: (r, c) => {
                Te();
                var f = ne("Excluir");
                v(r, f);
              },
              $$slots: { default: !0 },
            });
          },
          ma = (t) => {
            var r = Ga();
            v(t, r);
          };
        R(Ke, (t) => {
          e(me) ? t(ua) : t(ma, -1);
        });
      }
      var $e = o(Ke, 2),
        fa = s($e);
      {
        var ba = (t) => {
            he(t, {
              variant: "outline",
              type: "button",
              get onclick() {
                return d.onclose;
              },
              children: (r, c) => {
                Te();
                var f = ne("Fechar");
                v(r, f);
              },
              $$slots: { default: !0 },
            });
          },
          xa = (t) => {
            var r = Ja(),
              c = ie(r);
            he(c, {
              variant: "outline",
              type: "button",
              get onclick() {
                return d.onclose;
              },
              get disabled() {
                return e(w);
              },
              children: (y, x) => {
                Te();
                var A = ne("Cancelar");
                v(y, A);
              },
              $$slots: { default: !0 },
            });
            var f = o(c, 2);
            {
              let y = Ae(() => {
                var x, A;
                return (
                  e(w) ||
                  (!d.profissionalId &&
                    !((x = l()) != null && x.profissionalId) &&
                    !((A = e(m)) != null && A.id))
                );
              });
              he(f, {
                type: "submit",
                form: "visitaForm",
                get disabled() {
                  return e(y);
                },
                children: (x, A) => {
                  var V = ea(),
                    W = ie(V);
                  {
                    var re = (U) => {
                        var le = ne("Salvando...");
                        v(U, le);
                      },
                      Y = (U) => {
                        var le = ne("Salvar Visita");
                        v(U, le);
                      };
                    R(W, (U) => {
                      e(w) ? U(re) : U(Y, -1);
                    });
                  }
                  v(x, V);
                },
                $$slots: { default: !0 },
              });
            }
            v(t, r);
          };
        R(fa, (t) => {
          e(g) ? t(ba) : t(xa, -1);
        });
      }
      (i($e),
        i(Ye),
        i(We),
        i(N),
        O(() => {
          var t;
          (P(
            ae,
            e(g)
              ? "Detalhes da Visita"
              : b()
                ? "Duplicar Visita"
                : (t = l()) != null && t.id
                  ? "Editar Visita"
                  : "Registrar Visita",
          ),
            P(
              be,
              e(g)
                ? "Esta visita já foi executada e não pode ser alterada."
                : b()
                  ? "Altere os dados e salve para criar uma nova visita."
                  : "Preencha os detalhes e os materiais entregues.",
            ),
            (we.disabled = e(g)),
            (xe.disabled = e(g)),
            (Ve.disabled = e(g)),
            (Oe.disabled = e(g)));
        }),
        je("submit", C, I),
        B(
          we,
          () => e(S),
          (t) => a(S, t),
        ),
        ia(
          xe,
          () => e(_),
          (t) => a(_, t),
        ),
        B(
          Ve,
          () => e(q),
          (t) => a(q, t),
        ),
        B(
          Oe,
          () => e(L),
          (t) => a(L, t),
        ),
        v(n, N));
    },
    $$slots: { default: !0 },
  });
  var oe = o(ee, 2);
  (Ea(oe, {
    get open() {
      return e(k);
    },
    title: "Excluir Visita",
    confirmLabel: "Excluir",
    variant: "danger",
    onclose: () => a(k, !1),
    onconfirm: X,
    description: (u) => {
      var N = Ua();
      v(u, N);
    },
    $$slots: { description: !0 },
  }),
    v(ye, fe),
    ta());
}
sa(["click", "input"]);
export { rt as V };
