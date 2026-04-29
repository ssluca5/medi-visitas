import { J as attr, X as escape_html, _ as stringify, h as spread_props, m as slot, n as attr_class, p as sanitize_props } from "./dev.js";
import { t as Icon } from "./Icon.js";
import { t as Triangle_alert } from "./triangle-alert.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/trash-2.svelte
function Trash_2($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "trash-2" },
		sanitize_props($$props),
		{
			/**
			* @component @name Trash2
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA2aDE4IiAvPgogIDxwYXRoIGQ9Ik0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjYiIC8+CiAgPHBhdGggZD0iTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MiIgLz4KICA8bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjExIiB5Mj0iMTciIC8+CiAgPGxpbmUgeDE9IjE0IiB4Mj0iMTQiIHkxPSIxMSIgeTI9IjE3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/trash-2
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M3 6h18" }],
				["path", { "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
				["path", { "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
				["line", {
					"x1": "10",
					"x2": "10",
					"y1": "11",
					"y2": "17"
				}],
				["line", {
					"x1": "14",
					"x2": "14",
					"y1": "11",
					"y2": "17"
				}]
			],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region src/lib/components/ui/ConfirmDialog.svelte
function ConfirmDialog($$renderer, $$props) {
	let { open, onclose, title, description, confirmLabel = "Excluir", cancelLabel = "Cancelar", variant = "danger", onconfirm, loading = false, isBlockingDialog = false } = $$props;
	const iconBgMap = {
		danger: "bg-red-50",
		warning: "bg-amber-50",
		info: "bg-blue-50"
	};
	const iconColorMap = {
		danger: "text-red-600",
		warning: "text-amber-600",
		info: "text-blue-600"
	};
	const confirmBtnMap = {
		danger: "bg-red-600 hover:bg-red-700",
		warning: "bg-amber-600 hover:bg-amber-700",
		info: "bg-blue-600 hover:bg-blue-700"
	};
	if (open) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center"><div class="absolute inset-0 bg-black/30" role="presentation"></div> <div class="relative z-10 w-full max-w-md mx-4 rounded-2xl shadow-2xl bg-white border border-[rgb(var(--slate-200))]/80" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title"><div class="p-7"><div class="flex items-start gap-4"><div${attr_class(`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${stringify(iconBgMap[variant])}`)}>`);
		if (variant === "warning") {
			$$renderer.push("<!--[0-->");
			Triangle_alert($$renderer, { class: `w-5 h-5 ${stringify(iconColorMap[variant])}` });
		} else {
			$$renderer.push("<!--[-1-->");
			Trash_2($$renderer, { class: `w-5 h-5 ${stringify(iconColorMap[variant])}` });
		}
		$$renderer.push(`<!--]--></div> <div class="flex-1 pt-0.5"><h3 id="confirm-dialog-title" class="text-lg font-semibold text-[rgb(var(--slate-900))]">${escape_html(title)}</h3> `);
		if (description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-sm text-[rgb(var(--slate-600))] mt-2 leading-relaxed [&amp;>strong]:text-[rgb(var(--slate-700))] [&amp;>strong]:font-medium [&amp;>p+p]:mt-3">`);
			description($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="flex justify-end gap-3 mt-8">`);
		if (isBlockingDialog) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button${attr("disabled", loading, true)} class="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-[rgb(var(--slate-300))] text-[rgb(var(--slate-700))] will-change-transform hover:bg-[rgb(var(--slate-50))] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm">${escape_html(loading ? "Aguarde..." : "Entendi")}</button>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attr("disabled", loading, true)}${attr("aria-label", cancelLabel)} class="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-[rgb(var(--slate-300))] text-[rgb(var(--slate-700))] will-change-transform hover:bg-[rgb(var(--slate-50))] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50">${escape_html(cancelLabel)}</button> <button${attr("disabled", loading, true)}${attr("aria-label", confirmLabel)}${attr_class(`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm will-change-transform hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 ${stringify(confirmBtnMap[variant])}`)}>${escape_html(loading ? "Aguarde..." : confirmLabel)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div></div></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
//#endregion
export { Trash_2 as n, ConfirmDialog as t };
