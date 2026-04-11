import "./Bzak7iHL.js";
import "./CUONaVJB.js";
import { e as c, f as i, a as l } from "./CZsNqhY1.js";
import { I as d, s as $ } from "./D_ntMQAe.js";
import { l as p, s as f } from "./CsBhEEN0.js";
function v(o, e) {
  const r = p(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const s = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }],
  ];
  d(
    o,
    f({ name: "circle-alert" }, () => r, {
      get iconNode() {
        return s;
      },
      children: (n, m) => {
        var t = c(),
          a = i(t);
        ($(a, e, "default", {}), l(n, t));
      },
      $$slots: { default: !0 },
    }),
  );
}
function x(o, e) {
  const r = p(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */ const s = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }],
  ];
  d(
    o,
    f({ name: "info" }, () => r, {
      get iconNode() {
        return s;
      },
      children: (n, m) => {
        var t = c(),
          a = i(t);
        ($(a, e, "default", {}), l(n, t));
      },
      $$slots: { default: !0 },
    }),
  );
}
export { v as C, x as I };
