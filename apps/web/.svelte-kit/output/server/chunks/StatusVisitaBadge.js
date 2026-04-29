import { X as escape_html, n as attr_class, o as bind_props } from "./dev.js";
//#region src/lib/components/ui/StatusVisitaBadge.svelte
function StatusVisitaBadge($$renderer, $$props) {
	let badge;
	let status = $$props["status"];
	const config = {
		AGENDADA: {
			label: "Agendada",
			classes: "bg-blue-100 text-blue-800 border-blue-200"
		},
		REALIZADA: {
			label: "Realizada",
			classes: "bg-green-100 text-green-800 border-green-200"
		},
		CANCELADA: {
			label: "Cancelada",
			classes: "bg-red-100 text-red-800 border-red-200"
		},
		NAO_REALIZADA: {
			label: "Não Realizada",
			classes: "bg-orange-100 text-orange-800 border-orange-200"
		}
	};
	$: badge = config[status] || {
		label: status,
		classes: "bg-gray-100 text-gray-800 border-gray-200"
	};
	$$renderer.push(`<span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.classes}`)}>${escape_html(badge.label)}</span>`);
	bind_props($$props, { status });
}
//#endregion
export { StatusVisitaBadge as t };
