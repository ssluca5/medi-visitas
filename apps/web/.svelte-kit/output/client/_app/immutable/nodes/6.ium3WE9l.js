import "../chunks/Bzak7iHL.js";
import { o as ct } from "../chunks/BGJvssSt.js";
import {
  e as vt,
  f as Y,
  a as p,
  p as ut,
  U as _,
  V as pt,
  B as o,
  z as e,
  b as mt,
  h as ft,
  d as r,
  s,
  c as f,
  W as se,
  t as z,
  F as Ae,
  $ as _t,
  r as a,
  X as g,
  Y as xt,
} from "../chunks/CZsNqhY1.js";
import { s as R } from "../chunks/D4SvF6kG.js";
import { l as ht, s as bt, i as H } from "../chunks/CsBhEEN0.js";
import { I as gt, s as wt, e as yt } from "../chunks/D_ntMQAe.js";
import { h as At } from "../chunks/C57bVzq3.js";
import { d as Ue, r as ze, s as W, b as $t } from "../chunks/DDioZlon.js";
import { d as Et, a as $e } from "../chunks/BLFvJadL.js";
import { b as Ee, a as oe } from "../chunks/DFOm60R7.js";
import { t as w } from "../chunks/BG-wUOgw.js";
import { B as j } from "../chunks/DI35S9H6.js";
import { S as Tt, C as kt, T as Ot } from "../chunks/CSHFKzA8.js";
import { P as Te } from "../chunks/DgL0CZso.js";
import { S as Pt } from "../chunks/EGrcUm4A.js";
import { P as ke } from "../chunks/DpW8pZ2L.js";
import "../chunks/CUONaVJB.js";
import { P as Mt, a as St } from "../chunks/YBzjEPSW.js";
function Ct(ie, $) {
  const b = ht($, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const q = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12" }],
  ];
  gt(
    ie,
    bt({ name: "database" }, () => b, {
      get iconNode() {
        return q;
      },
      children: (N, k) => {
        var E = vt(),
          K = Y(E);
        (wt(K, $, "default", {}), p(N, E));
      },
      $$slots: { default: !0 },
    }),
  );
}
var Rt = f("<!> Novo Material", 1),
  jt = f(
    '<div class="card-surface py-20 flex flex-col items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 mb-4"></div> <p class="text-slate-500 text-sm">Carregando...</p></div>',
  ),
  Nt = f(
    '<div class="card-surface py-20 flex flex-col items-center justify-center"><!> <p class="text-slate-700 font-medium">Falha ao conectar no servidor</p> <p class="text-slate-500 text-sm"> </p> <!></div>',
  ),
  Lt = f("<!> Cadastrar Primeiro Material", 1),
  Bt = f(
    '<div class="card-surface py-20 flex flex-col items-center justify-center text-center px-4"><!> <h3 class="text-lg font-medium text-slate-900">Nenhum material encontrado</h3> <p class="text-slate-500 max-w-sm mt-2 mb-6">Cadastre as amostras grátis, folders e apresentações que os RCs distribuem aos médicos.</p> <!></div>',
  ),
  Ft = f(
    '<p class="text-[10px] uppercase font-bold tracking-wider rounded text-red-600 mt-0.5">Inativo</p>',
  ),
  Dt = f('<span class="text-sm text-slate-500 truncate block"> </span>'),
  It = f('<span class="text-sm text-slate-300 truncate block">—</span>'),
  Ut = f(
    '<tr><td class="p-3.5"><div class="flex items-center gap-3"><div><!></div> <div class="min-w-0"><p> </p> <!></div></div></td><td class="p-3.5 text-left"><!></td><td class="p-3.5 text-center"><span> </span></td><td class="p-3.5"><div class="flex justify-center items-center gap-1"><button><!></button> <button title="Excluir" class="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"><!></button></div></td></tr>',
  ),
  zt = f(
    '<div class="py-12 flex flex-col items-center justify-center text-center"><p class="text-slate-500 text-sm">Nenhum material encontrado com esses filtros.</p> <!></div>',
  ),
  qt = f(
    '<div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[35%]">Material</th><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[35%]">Descrição</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Tipo</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Ações</th></tr></thead><tbody></tbody></table> <!></div>',
  ),
  Vt = f(
    '<div class="space-y-5"><div><h3 class="text-lg font-semibold text-slate-900"> </h3> <p class="text-sm text-slate-400 mt-1">Preencha os dados para cadastrar</p></div> <div class="space-y-3"><div><label for="tipo" class="input-label">Tipo de Material</label> <select id="tipo" class="input-base"><option>Amostra Grátis</option><option>Bula</option><option>Apresentação</option><option>Folder / Informativo</option><option>Outro</option></select></div> <div><label for="nome" class="input-label">Nome do Produto *</label> <input id="nome" type="text" class="input-base" placeholder="Ex: Medicamento X 500mg"/></div> <div><label for="desc" class="input-label">Descrição</label> <textarea id="desc" rows="3" class="input-base resize-none" placeholder="Observações adicionais ou notas técnicas..."></textarea></div></div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-100"><!> <!></div></div>',
  ),
  Gt = f(
    "<p>Tem certeza que deseja excluir '<strong> </strong>'?</p> <p>Isso poderá afetar o histórico de visitas que usaram este item.</p>",
    1,
  ),
  Jt = f(
    '<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"><!></div> <div><h1 class="text-lg font-bold text-slate-800">Materiais & Amostras</h1> <p class="text-[11px] text-slate-400">Cadastre as amostras grátis, folders e apresentações</p></div></div> <div class="flex items-center gap-2"><!></div></div> <div class="card-surface p-4 mb-6"><div class="flex flex-col sm:flex-row gap-4"><div class="relative flex-1"><!> <input type="text" placeholder="Buscar por nome ou descrição..." class="input-base !pl-9 w-full"/></div> <div class="w-full sm:w-64 shrink-0"><select class="input-base w-full"><option>Todos os tipos</option><option>Amostra Grátis</option><option>Bula</option><option>Apresentação</option><option>Folder / Informativo</option><option>Outro</option></select></div></div></div> <!> <!> <!> <!>',
    1,
  );
function va(ie, $) {
  ut($, !0);
  let b = _(pt([])),
    q = _(!0),
    N = _(null),
    k = _(""),
    E = _(""),
    K = Ae(() =>
      e(b).filter((t) => {
        const i =
            !e(k) ||
            t.nome.toLowerCase().includes(e(k).toLowerCase()) ||
            (t.descricao &&
              t.descricao.toLowerCase().includes(e(k).toLowerCase())),
          l = !e(E) || t.tipo === e(E);
        return i && l;
      }),
    ),
    O = _(!1),
    L = _(null),
    P = _(""),
    V = _(""),
    G = _("AMOSTRA"),
    Q = _(!1),
    Z = _(!1),
    B = _(null);
  async function le() {
    (o(q, !0), o(N, null));
    try {
      const t = await oe(
        "/materiais?pageSize=500&incluirInativos=true",
        $.data.sessionToken,
      );
      if (!t.ok) throw new Error("Erro ao carregar materiais");
      const i = await t.json();
      o(b, i.data || i, !0);
    } catch (t) {
      o(N, t instanceof Error ? t.message : "Erro", !0);
    } finally {
      o(q, !1);
    }
  }
  ct(() => le());
  function ne() {
    (o(L, null), o(P, ""), o(V, ""), o(G, "AMOSTRA"), o(O, !0));
  }
  function qe(t) {
    (o(L, t, !0),
      o(P, t.nome, !0),
      o(V, t.descricao || "", !0),
      o(G, t.tipo, !0),
      o(O, !0));
  }
  async function Ve() {
    if (!e(P).trim()) {
      w.show("error", "Nome é obrigatório");
      return;
    }
    o(Q, !0);
    try {
      const t = { nome: e(P), descricao: e(V) || null, tipo: e(G) },
        i = e(L) ? `/materiais/${e(L).id}` : "/materiais",
        l = e(L) ? "PUT" : "POST",
        n = await oe(i, $.data.sessionToken, {
          method: l,
          body: JSON.stringify(t),
        });
      if (n.ok)
        (w.show("success", "Material salvo com sucesso"), o(O, !1), le());
      else {
        const m = await n.json().catch(() => null);
        w.show(
          "error",
          (m == null ? void 0 : m.error) || "Erro ao salvar material",
        );
      }
    } catch {
      w.show("error", "Erro ao salvar material");
    } finally {
      o(Q, !1);
    }
  }
  function Ge(t) {
    (o(B, t, !0), o(Z, !0));
  }
  async function Je() {
    if (e(B))
      try {
        (
          await oe(`/materiais/${e(B).id}`, $.data.sessionToken, {
            method: "DELETE",
          })
        ).ok
          ? (w.show("success", "Material excluído"),
            o(
              b,
              e(b).filter((i) => i.id !== e(B).id),
              !0,
            ))
          : w.show("error", "Erro ao excluir material");
      } catch {
        w.show("error", "Erro interno");
      } finally {
        (o(Z, !1), o(B, null));
      }
  }
  async function Xe(t) {
    const i = !t.deletedAt;
    try {
      const l = await oe(`/materiais/${t.id}/ativo`, $.data.sessionToken, {
        method: "PATCH",
        body: JSON.stringify({ ativo: !i }),
      });
      if (l.ok) {
        const n = await l.json();
        (o(
          b,
          e(b).map((m) => (m.id === n.id ? n : m)),
          !0,
        ),
          w.show(
            "success",
            i ? `"${t.nome}" inativado.` : `"${t.nome}" reativado.`,
          ));
      } else w.show("error", "Erro ao mudar status do material");
    } catch {
      w.show("error", "Erro interno");
    }
  }
  function He(t) {
    switch (t) {
      case "AMOSTRA":
        return "Amostra Grátis";
      case "BULA":
        return "Bula";
      case "APRESENTACAO":
        return "Apresentação";
      case "FOLDER":
        return "Folder";
      case "OUTRO":
        return "Outro";
    }
    return t;
  }
  function We(t) {
    switch (t) {
      case "AMOSTRA":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "APRESENTACAO":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
      case "FOLDER":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  }
  var Oe = Jt();
  At("10qjr13", (t) => {
    ft(() => {
      _t.title = "Materiais e Amostras — MediVisitas";
    });
  });
  var de = Y(Oe),
    ce = r(de),
    Pe = r(ce),
    Ye = r(Pe);
  (Te(Ye, { class: "h-4.5 w-4.5 text-white" }), a(Pe), g(2), a(ce));
  var Me = s(ce, 2),
    Ke = r(Me);
  (j(Ke, {
    onclick: ne,
    class: "hidden sm:inline-flex gap-2",
    children: (t, i) => {
      var l = Rt(),
        n = Y(l);
      (ke(n, { class: "h-4 w-4" }), g(), p(t, l));
    },
    $$slots: { default: !0 },
  }),
    a(Me),
    a(de));
  var ve = s(de, 2),
    Se = r(ve),
    ue = r(Se),
    Ce = r(ue);
  Pt(Ce, {
    class:
      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none",
  });
  var Re = s(Ce, 2);
  (ze(Re), a(ue));
  var je = s(ue, 2),
    pe = r(je),
    me = r(pe);
  me.value = me.__value = "";
  var fe = s(me);
  fe.value = fe.__value = "AMOSTRA";
  var _e = s(fe);
  _e.value = _e.__value = "BULA";
  var xe = s(_e);
  xe.value = xe.__value = "APRESENTACAO";
  var he = s(xe);
  he.value = he.__value = "FOLDER";
  var Ne = s(he);
  ((Ne.value = Ne.__value = "OUTRO"), a(pe), a(je), a(Se), a(ve));
  var Le = s(ve, 2);
  {
    var Qe = (t) => {
        var i = jt();
        p(t, i);
      },
      Ze = (t) => {
        var i = Nt(),
          l = r(i);
        Ct(l, { class: "h-8 w-8 text-red-500 mb-2" });
        var n = s(l, 4),
          m = r(n, !0);
        a(n);
        var T = s(n, 2);
        (j(T, {
          class: "mt-4",
          variant: "outline",
          onclick: le,
          children: (u, v) => {
            g();
            var c = se("Tentar novamente");
            p(u, c);
          },
          $$slots: { default: !0 },
        }),
          a(i),
          z(() => R(m, e(N))),
          p(t, i));
      },
      et = (t) => {
        var i = Bt(),
          l = r(i);
        Te(l, { class: "h-10 w-10 text-slate-300 mb-4" });
        var n = s(l, 6);
        (j(n, {
          onclick: ne,
          class: "gap-2",
          children: (m, T) => {
            var u = Lt(),
              v = Y(u);
            (ke(v, { class: "h-4 w-4" }), g(), p(m, u));
          },
          $$slots: { default: !0 },
        }),
          a(i),
          p(t, i));
      },
      tt = (t) => {
        var i = qt(),
          l = r(i),
          n = s(r(l));
        (yt(
          n,
          21,
          () => e(K),
          (u) => u.id,
          (u, v) => {
            const c = Ae(() => !e(v).deletedAt);
            var x = Ut();
            let M;
            var y = r(x),
              F = r(y),
              S = r(F);
            let D;
            var ee = r(S);
            (Te(ee, { class: "h-4 w-4" }), a(S));
            var J = s(S, 2),
              C = r(J);
            let X;
            var te = r(C, !0);
            a(C);
            var be = s(C, 2);
            {
              var h = (d) => {
                var A = Ft();
                p(d, A);
              };
              H(be, (d) => {
                e(c) || d(h);
              });
            }
            (a(J), a(F), a(y));
            var I = s(y),
              ae = r(I);
            {
              var re = (d) => {
                  var A = Dt(),
                    dt = r(A, !0);
                  (a(A), z(() => R(dt, e(v).descricao)), p(d, A));
                },
                rt = (d) => {
                  var A = It();
                  p(d, A);
                };
              H(ae, (d) => {
                e(v).descricao ? d(re) : d(rt, -1);
              });
            }
            a(I);
            var ge = s(I),
              we = r(ge),
              st = r(we, !0);
            (a(we), a(ge));
            var De = s(ge),
              Ie = r(De),
              U = r(Ie),
              ot = r(U);
            {
              var it = (d) => {
                  Mt(d, { class: "w-4 h-4" });
                },
                lt = (d) => {
                  St(d, { class: "w-4 h-4" });
                };
              H(ot, (d) => {
                e(c) ? d(it) : d(lt, -1);
              });
            }
            a(U);
            var ye = s(U, 2),
              nt = r(ye);
            (Ot(nt, { class: "w-4 h-4" }),
              a(ye),
              a(Ie),
              a(De),
              a(x),
              z(
                (d, A) => {
                  ((M = W(
                    x,
                    1,
                    "group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60",
                    null,
                    M,
                    { "opacity-50": !e(c) },
                  )),
                    (D = W(
                      S,
                      1,
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-sm",
                      null,
                      D,
                      {
                        "bg-indigo-50": e(c),
                        "text-indigo-600": e(c),
                        border: e(c),
                        "border-indigo-100": e(c),
                        "bg-slate-100": !e(c),
                        "text-slate-400": !e(c),
                      },
                    )),
                    (X = W(C, 1, "text-sm font-medium truncate", null, X, {
                      "text-slate-900": e(c),
                      "text-slate-400": !e(c),
                    })),
                    R(te, e(v).nome),
                    W(
                      we,
                      1,
                      `inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase border ${d ?? ""}`,
                    ),
                    R(st, A),
                    $t(U, "title", e(c) ? "Inativar" : "Ativar"),
                    W(
                      U,
                      1,
                      `p-1.5 rounded-md text-slate-400 transition-colors cursor-pointer ${e(c) ? "hover:text-amber-600 hover:bg-amber-50" : "hover:text-green-600 hover:bg-green-50"}`,
                    ));
                },
                [() => We(e(v).tipo), () => He(e(v).tipo)],
              ),
              $e("click", x, () => qe(e(v))),
              $e("click", U, (d) => {
                (d.stopPropagation(), Xe(e(v)));
              }),
              $e("click", ye, (d) => {
                (d.stopPropagation(), Ge(e(v)));
              }),
              p(u, x));
          },
        ),
          a(n),
          a(l));
        var m = s(l, 2);
        {
          var T = (u) => {
            var v = zt(),
              c = s(r(v), 2);
            (j(c, {
              class: "mt-4",
              variant: "outline",
              onclick: () => {
                (o(k, ""), o(E, ""));
              },
              children: (x, M) => {
                g();
                var y = se("Limpar Filtros");
                p(x, y);
              },
              $$slots: { default: !0 },
            }),
              a(v),
              p(u, v));
          };
          H(m, (u) => {
            e(K).length === 0 && e(b).length > 0 && u(T);
          });
        }
        (a(i), p(t, i));
      };
    H(Le, (t) => {
      e(q) ? t(Qe) : e(N) ? t(Ze, 1) : e(b).length === 0 ? t(et, 2) : t(tt, -1);
    });
  }
  var Be = s(Le, 2);
  j(Be, {
    class:
      "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden z-10 p-0",
    onclick: ne,
    children: (t, i) => {
      ke(t, { class: "h-6 w-6 text-white" });
    },
    $$slots: { default: !0 },
  });
  var Fe = s(Be, 2);
  Tt(Fe, {
    onclose: () => o(O, !1),
    get open() {
      return e(O);
    },
    set open(i) {
      o(O, i, !0);
    },
    children: (i) => {
      var l = Vt(),
        n = r(l),
        m = r(n),
        T = r(m, !0);
      (a(m), g(2), a(n));
      var u = s(n, 2),
        v = r(u),
        c = s(r(v), 2),
        x = r(c);
      x.value = x.__value = "AMOSTRA";
      var M = s(x);
      M.value = M.__value = "BULA";
      var y = s(M);
      y.value = y.__value = "APRESENTACAO";
      var F = s(y);
      F.value = F.__value = "FOLDER";
      var S = s(F);
      ((S.value = S.__value = "OUTRO"), a(c), a(v));
      var D = s(v, 2),
        ee = s(r(D), 2);
      (ze(ee), a(D));
      var J = s(D, 2),
        C = s(r(J), 2);
      (xt(C), a(J), a(u));
      var X = s(u, 2),
        te = r(X);
      j(te, {
        variant: "outline",
        onclick: () => o(O, !1),
        children: (h, I) => {
          g();
          var ae = se("Cancelar");
          p(h, ae);
        },
        $$slots: { default: !0 },
      });
      var be = s(te, 2);
      {
        let h = Ae(() => e(Q) || !e(P).trim());
        j(be, {
          onclick: Ve,
          get disabled() {
            return e(h);
          },
          children: (I, ae) => {
            g();
            var re = se();
            (z(() => R(re, e(Q) ? "Salvando..." : "Salvar Material")),
              p(I, re));
          },
          $$slots: { default: !0 },
        });
      }
      (a(X),
        a(l),
        z(() => R(T, e(L) ? "Editar Material" : "Novo Material")),
        Ue(
          c,
          () => e(G),
          (h) => o(G, h),
        ),
        Ee(
          ee,
          () => e(P),
          (h) => o(P, h),
        ),
        Ee(
          C,
          () => e(V),
          (h) => o(V, h),
        ),
        p(i, l));
    },
    $$slots: { default: !0 },
  });
  var at = s(Fe, 2);
  (kt(at, {
    get open() {
      return e(Z);
    },
    title: "Excluir Material",
    confirmLabel: "Excluir",
    variant: "danger",
    onclose: () => o(Z, !1),
    onconfirm: Je,
    description: (i) => {
      var l = Gt(),
        n = Y(l),
        m = s(r(n)),
        T = r(m, !0);
      (a(m),
        g(),
        a(n),
        g(2),
        z(() => {
          var u;
          return R(T, (u = e(B)) == null ? void 0 : u.nome);
        }),
        p(i, l));
    },
    $$slots: { description: !0 },
  }),
    Ee(
      Re,
      () => e(k),
      (t) => o(k, t),
    ),
    Ue(
      pe,
      () => e(E),
      (t) => o(E, t),
    ),
    p(ie, Oe),
    mt());
}
Et(["click"]);
export { va as component };
