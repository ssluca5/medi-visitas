import { w as writable } from "./index2.js";
function createToastStore() {
  const { subscribe, update } = writable([]);
  function show(type, message) {
    const id = crypto.randomUUID();
    update((toasts2) => [...toasts2, { id, type, message }]);
    setTimeout(() => dismiss(id), 4e3);
  }
  function dismiss(id) {
    update((toasts2) => toasts2.filter((t) => t.id !== id));
  }
  return { subscribe, show, dismiss };
}
const toasts = createToastStore();
export {
  toasts as t
};
