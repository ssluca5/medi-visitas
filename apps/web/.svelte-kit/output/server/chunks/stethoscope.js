import { h as spread_props, m as slot, p as sanitize_props } from "./dev.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/stethoscope.svelte
function Stethoscope($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "stethoscope" },
		sanitize_props($$props),
		{
			/**
			* @component @name Stethoscope
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMnYyIiAvPgogIDxwYXRoIGQ9Ik01IDJ2MiIgLz4KICA8cGF0aCBkPSJNNSAzSDRhMiAyIDAgMCAwLTIgMnY0YTYgNiAwIDAgMCAxMiAwVjVhMiAyIDAgMCAwLTItMmgtMSIgLz4KICA8cGF0aCBkPSJNOCAxNWE2IDYgMCAwIDAgMTIgMHYtMyIgLz4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjEwIiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/stethoscope
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M11 2v2" }],
				["path", { "d": "M5 2v2" }],
				["path", { "d": "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" }],
				["path", { "d": "M8 15a6 6 0 0 0 12 0v-3" }],
				["circle", {
					"cx": "20",
					"cy": "10",
					"r": "2"
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
export { Stethoscope as t };
