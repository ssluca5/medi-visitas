import {
  g as w,
  h as T,
  i as x,
  u as D,
  j as E,
  D as O,
  S as Y,
} from "./CZsNqhY1.js";
function n(r, f) {
  return r === f || (r == null ? void 0 : r[Y]) === f;
}
function A(r = {}, f, i, j) {
  var p = w.r,
    h = E;
  return (
    T(() => {
      var a, t;
      return (
        x(() => {
          ((a = t),
            (t = []),
            D(() => {
              r !== i(...t) &&
                (f(r, ...t), a && n(i(...a), r) && f(null, ...a));
            }));
        }),
        () => {
          let s = h;
          for (; s !== p && s.parent !== null && s.parent.f & O; ) s = s.parent;
          const S = () => {
              t && n(i(...t), r) && f(null, ...t);
            },
            c = s.teardown;
          s.teardown = () => {
            (S(), c == null || c());
          };
        }
      );
    }),
    r
  );
}
export { A as b };
