export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

// Estado reativo com Svelte 5 Runes
let _toasts = $state<Toast[]>([]);

export const toasts = {
  get value() {
    return _toasts;
  },
  /** Backward-compatible: toasts.show('success', 'msg') */
  show: (type: ToastType, message: string, duration = 4000) =>
    adicionarToast(type, message, duration),
};

export function adicionarToast(
  type: ToastType,
  message: string,
  duration = 4000,
) {
  const id = crypto.randomUUID();
  _toasts = [..._toasts, { id, type, message, duration }];
  setTimeout(() => removerToast(id), duration);
}

export function removerToast(id: string) {
  _toasts = _toasts.filter((t) => t.id !== id);
}

// Aliases em português para uso interno
export const toast = {
  sucesso: (msg: string) => adicionarToast("success", msg),
  erro: (msg: string) => adicionarToast("error", msg),
  info: (msg: string) => adicionarToast("info", msg),
  aviso: (msg: string) => adicionarToast("warning", msg),
};
