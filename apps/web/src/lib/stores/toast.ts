import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function show(type: ToastType, message: string) {
		const id = crypto.randomUUID();
		update((toasts) => [...toasts, { id, type, message }]);
		setTimeout(() => dismiss(id), 4000);
	}

	function dismiss(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return { subscribe, show, dismiss };
}

export const toasts = createToastStore();
