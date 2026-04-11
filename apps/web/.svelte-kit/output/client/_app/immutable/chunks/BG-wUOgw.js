import { w as a } from "./D4SvF6kG.js";
function u() {
  const { subscribe: r, update: e } = a([]);
  function n(o, s) {
    const t = crypto.randomUUID();
    (e((c) => [...c, { id: t, type: o, message: s }]),
      setTimeout(() => i(t), 4e3));
  }
  function i(o) {
    e((s) => s.filter((t) => t.id !== o));
  }
  return { subscribe: r, show: n, dismiss: i };
}
const f = u();
export { f as t };
