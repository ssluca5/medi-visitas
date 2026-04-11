import "./Bzak7iHL.js";
import {
  e as H,
  f as X,
  a as A,
  p as j,
  d as e,
  z as w,
  s as n,
  r as o,
  t as q,
  b as J,
  F as L,
  c as R,
} from "./CZsNqhY1.js";
import { s as b } from "./D4SvF6kG.js";
import { l as K, s as Q, i as S } from "./CsBhEEN0.js";
import { c as V } from "./Bj1gaHN5.js";
import { d as W, a as y } from "./BLFvJadL.js";
import { s as N, e as E } from "./DDioZlon.js";
import { I as Y, s as Z, X as $ } from "./D_ntMQAe.js";
import { C as tt, I as at } from "./CkHy_-7l.js";
import { T as et } from "./DYTuZaAl.js";
import "./CUONaVJB.js";
function ot(d, t) {
  const f = K(t, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const m = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      },
    ],
  ];
  Y(
    d,
    Q({ name: "bell" }, () => f, {
      get iconNode() {
        return m;
      },
      children: (u, k) => {
        var s = H(),
          l = X(s);
        (Z(l, t, "default", {}), A(u, s));
      },
      $$slots: { default: !0 },
    }),
  );
}
var rt = R(
    '<span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style="background-color: #2563eb;"></span>',
  ),
  it = R(
    '<div role="button" tabindex="0"><div class="relative flex-shrink-0 mt-0.5"><!> <!></div> <div class="flex-1 min-w-0"><p> </p> <p class="text-xs mt-0.5 truncate text-slate-400"> </p> <p class="text-[10px] mt-1 text-slate-300"> </p></div> <button class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 hover:bg-gray-200 cursor-pointer" aria-label="Remover notificação"><!></button></div>',
  );
function gt(d, t) {
  j(t, !0);
  const f = { INFO: at, NORMAL: ot, ALTA: et, URGENTE: tt },
    m = {
      INFO: "#3b82f6",
      NORMAL: "#f59e0b",
      ALTA: "#ef4444",
      URGENTE: "#dc2626",
    };
  let u = L(() => f[t.notif.prioridade]),
    k = L(() => m[t.notif.prioridade]);
  function s(a) {
    const i = Date.now(),
      F = new Date(a).getTime(),
      _ = i - F,
      x = Math.floor(_ / 6e4),
      M = Math.floor(_ / 36e5),
      G = Math.floor(_ / 864e5);
    return x < 1
      ? "agora"
      : x < 60
        ? `há ${x}min`
        : M < 24
          ? `há ${M}h`
          : `há ${G}d`;
  }
  async function l() {
    t.notif.lida ||
      (await fetch(`${E}/notificacoes/${t.notif.id}/lida`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${t.sessionToken}` },
      }),
      t.onLida());
  }
  async function B(a) {
    (a.stopPropagation(),
      await fetch(`${E}/notificacoes/${t.notif.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${t.sessionToken}` },
      }),
      t.onDeletada());
  }
  var r = it(),
    v = e(r),
    T = e(v);
  V(
    T,
    () => w(u),
    (a, i) => {
      i(a, {
        class: "w-4 h-4",
        get style() {
          return `color: ${w(k) ?? ""};`;
        },
      });
    },
  );
  var C = n(T, 2);
  {
    var D = (a) => {
      var i = rt();
      A(a, i);
    };
    S(C, (a) => {
      t.notif.lida || a(D);
    });
  }
  o(v);
  var h = n(v, 2),
    c = e(h),
    P = e(c, !0);
  o(c);
  var p = n(c, 2),
    z = e(p, !0);
  o(p);
  var I = n(p, 2),
    O = e(I, !0);
  (o(I), o(h));
  var g = n(h, 2),
    U = e(g);
  ($(U, { class: "w-3 h-3 text-slate-400" }),
    o(g),
    o(r),
    q(
      (a) => {
        (N(
          r,
          1,
          `flex items-start gap-3 px-4 py-3 transition-colors duration-200 cursor-default ${t.notif.lida ? "" : "bg-blue-50/40"} hover:bg-gray-50 group`,
        ),
          N(
            c,
            1,
            `text-xs ${t.notif.lida ? "text-slate-500" : "font-semibold text-slate-900"}`,
          ),
          b(P, t.notif.titulo),
          b(z, t.notif.mensagem),
          b(O, a));
      },
      [() => s(t.notif.createdAt)],
    ),
    y("click", r, l),
    y("keydown", r, (a) => a.key === "Enter" && l()),
    y("click", g, B),
    A(d, r),
    J());
}
W(["click", "keydown"]);
export { ot as B, gt as I };
