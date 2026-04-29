import "../../../../chunks/index-server.js";
import { J as attr, X as escape_html, _ as stringify, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, o as bind_props, p as sanitize_props, r as attr_style, u as head } from "../../../../chunks/dev.js";
import { n as toasts } from "../../../../chunks/toast.svelte.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Calendar_days } from "../../../../chunks/calendar-days.js";
import { t as Calendar } from "../../../../chunks/calendar.js";
import { t as Chevron_left } from "../../../../chunks/chevron-left.js";
import { t as Chevron_right } from "../../../../chunks/chevron-right.js";
import { t as Clock } from "../../../../chunks/clock.js";
import { t as Loader_circle } from "../../../../chunks/loader-circle.js";
import { t as Package } from "../../../../chunks/package.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { t as Search } from "../../../../chunks/search.js";
import { n as Trash_2, t as ConfirmDialog } from "../../../../chunks/ConfirmDialog.js";
import { t as X } from "../../../../chunks/x.js";
import { t as apiFetch } from "../../../../chunks/api.js";
import { t as StatusVisitaBadge } from "../../../../chunks/StatusVisitaBadge.js";
import { t as Button } from "../../../../chunks/Button.js";
import { t as EmptyState } from "../../../../chunks/EmptyState.js";
import { t as VisitaSheet } from "../../../../chunks/VisitaSheet.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/copy.svelte
function Copy($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "copy" },
		sanitize_props($$props),
		{
			/**
			* @component @name Copy
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["rect", {
				"width": "14",
				"height": "14",
				"x": "8",
				"y": "8",
				"rx": "2",
				"ry": "2"
			}], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/mic.svelte
function Mic($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "mic" },
		sanitize_props($$props),
		{
			/**
			* @component @name Mic
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMmEzIDMgMCAwIDAtMyAzdjdhMyAzIDAgMCAwIDYgMFY1YTMgMyAwIDAgMC0zLTNaIiAvPgogIDxwYXRoIGQ9Ik0xOSAxMHYyYTcgNyAwIDAgMS0xNCAwdi0yIiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTkiIHkyPSIyMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/mic
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }],
				["path", { "d": "M19 10v2a7 7 0 0 1-14 0v-2" }],
				["line", {
					"x1": "12",
					"x2": "12",
					"y1": "19",
					"y2": "22"
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/square.svelte
function Square($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "square" },
		sanitize_props($$props),
		{
			/**
			* @component @name Square
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/square
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["rect", {
				"width": "18",
				"height": "18",
				"x": "3",
				"y": "3",
				"rx": "2"
			}]],
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
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/volume-2.svelte
function Volume_2($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "volume-2" },
		sanitize_props($$props),
		{
			/**
			* @component @name Volume2
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgNC43MDJhLjcwNS43MDUgMCAwIDAtMS4yMDMtLjQ5OEw2LjQxMyA3LjU4N0ExLjQgMS40IDAgMCAxIDUuNDE2IDhIM2ExIDEgMCAwIDAtMSAxdjZhMSAxIDAgMCAwIDEgMWgyLjQxNmExLjQgMS40IDAgMCAxIC45OTcuNDEzbDMuMzgzIDMuMzg0QS43MDUuNzA1IDAgMCAwIDExIDE5LjI5OHoiIC8+CiAgPHBhdGggZD0iTTE2IDlhNSA1IDAgMCAxIDAgNiIgLz4KICA8cGF0aCBkPSJNMTkuMzY0IDE4LjM2NGE5IDkgMCAwIDAgMC0xMi43MjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/volume-2
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" }],
				["path", { "d": "M16 9a5 5 0 0 1 0 6" }],
				["path", { "d": "M19.364 18.364a9 9 0 0 0 0-12.728" }]
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
//#region src/lib/components/ui/BotaoGravacao.svelte
function BotaoGravacao($$renderer, $$props) {
	let { onclick } = $$props;
	$$renderer.push(`<button type="button" class="fixed bottom-6 right-24 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer z-40 hover:scale-105 active:scale-95" style="background-color: #7c3aed;" title="Gravar áudio da visita">`);
	Mic($$renderer, { class: "w-6 h-6 text-white" });
	$$renderer.push(`<!----></button>`);
}
//#endregion
//#region src/lib/hooks/useGravacaoAudio.svelte.ts
var gravando = false;
var duracaoSegundos = 0;
var audioBlob = null;
var audioUrl = null;
var erroPermissao = null;
var mimeType = "";
var mediaRecorder = null;
var chunks = [];
var timer = null;
function detectarMimeType() {
	if (typeof MediaRecorder === "undefined") return "audio/webm";
	if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
	if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
	if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
	if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
	return "audio/webm";
}
async function iniciar() {
	erroPermissao = null;
	audioBlob = null;
	if (audioUrl) {
		URL.revokeObjectURL(audioUrl);
		audioUrl = null;
	}
	duracaoSegundos = 0;
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mimeType = detectarMimeType();
		mediaRecorder = new MediaRecorder(stream, { mimeType });
		chunks = [];
		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) chunks.push(e.data);
		};
		mediaRecorder.onstop = () => {
			const blob = new Blob(chunks, { type: mimeType });
			audioBlob = blob;
			audioUrl = URL.createObjectURL(blob);
			stream.getTracks().forEach((t) => t.stop());
			gravando = false;
			if (timer) clearInterval(timer);
			timer = null;
		};
		mediaRecorder.start(1e3);
		gravando = true;
		timer = setInterval(() => {
			duracaoSegundos++;
			if (duracaoSegundos >= 180) parar();
		}, 1e3);
	} catch (err) {
		erroPermissao = err.name === "NotAllowedError" ? "Permissão de microfone negada. Habilite nas configurações do navegador." : `Erro ao acessar microfone: ${err.message}`;
	}
}
function parar() {
	if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
}
function descartar() {
	if (audioUrl) URL.revokeObjectURL(audioUrl);
	audioBlob = null;
	audioUrl = null;
	duracaoSegundos = 0;
	erroPermissao = null;
}
function useGravacaoAudio() {
	return {
		get gravando() {
			return gravando;
		},
		get duracaoSegundos() {
			return duracaoSegundos;
		},
		get audioBlob() {
			return audioBlob;
		},
		get audioUrl() {
			return audioUrl;
		},
		get erroPermissao() {
			return erroPermissao;
		},
		get mimeType() {
			return mimeType;
		},
		iniciar,
		parar,
		descartar
	};
}
//#endregion
//#region src/lib/components/ui/ModalGravacao.svelte
function ModalGravacao($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = void 0, visitaId, sessionToken, onclose, onsave } = $$props;
		let etapa = "selecionar";
		let salvarAudio = null;
		let resumo = "";
		let proximaAcao = "";
		let objetivoVisita = "";
		let gravacao = useGravacaoAudio();
		function formatarDuracao(segundos) {
			return `${Math.floor(segundos / 60).toString().padStart(2, "0")}:${(segundos % 60).toString().padStart(2, "0")}`;
		}
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" role="presentation"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" role="dialog" aria-modal="true"><div class="flex items-center justify-between p-5 border-b border-gray-100"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: #f3e8ff;">`);
			Volume_2($$renderer, {
				class: "w-5 h-5",
				style: "color: #7c3aed;"
			});
			$$renderer.push(`<!----></div> <div><h2 class="text-base font-semibold text-gray-900">`);
			if (etapa === "selecionar") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`Gravar visita`);
			} else if (etapa === "gravar") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`Gravando...`);
			} else if (etapa === "processar") {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`Processando`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Revisar campos`);
			}
			$$renderer.push(`<!--]--></h2> <p class="text-xs text-gray-500">`);
			if (etapa === "selecionar") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`Clique para iniciar a gravação`);
			} else if (etapa === "gravar") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`Fale sobre a visita realizada`);
			} else if (etapa === "processar") {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`A IA está transcrevendo e extraindo campos`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Revise os campos extraídos pela IA`);
			}
			$$renderer.push(`<!--]--></p></div></div> <button class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">`);
			X($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button></div> <div class="p-5 space-y-5">`);
			if (etapa === "selecionar") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-center py-8"><button class="w-20 h-20 rounded-full flex items-center justify-center mx-auto hover:scale-105 transition-transform cursor-pointer shadow-lg" style="background-color: #7c3aed;">`);
				Mic($$renderer, { class: "w-8 h-8 text-white" });
				$$renderer.push(`<!----></button> <p class="text-sm text-gray-500 mt-4">Toque para iniciar gravação</p> <p class="text-xs text-gray-400 mt-1">Máximo 3 minutos</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (etapa === "gravar") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-center py-4"><p class="text-3xl font-mono font-bold text-gray-900 mb-4">${escape_html(formatarDuracao(gravacao.duracaoSegundos))}</p> `);
				if (gravacao.gravando) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center justify-center gap-1 mb-6"><!--[-->`);
					const each_array = ensure_array_like(Array(5));
					for (let i = 0, $$length = each_array.length; i < $$length; i++) {
						each_array[i];
						$$renderer.push(`<div class="w-1 rounded-full animate-pulse"${attr_style(`height: ${stringify(20 + Math.random() * 20)}px; background-color: #7c3aed; animation-delay: ${stringify(i * 100)}ms;`)}></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <button class="w-16 h-16 rounded-full flex items-center justify-center mx-auto hover:scale-105 transition-transform cursor-pointer" style="background-color: #dc2626;">`);
				Square($$renderer, { class: "w-6 h-6 text-white fill-white" });
				$$renderer.push(`<!----></button> <p class="text-xs text-gray-400 mt-3">Toque para parar</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (etapa === "processar") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-center py-8">`);
				Loader_circle($$renderer, {
					class: "w-10 h-10 mx-auto animate-spin",
					style: "color: #7c3aed;"
				});
				$$renderer.push(`<!----> <p class="text-sm text-gray-600 mt-4">Transcrevendo áudio...</p> <p class="text-xs text-gray-400 mt-1">Isso pode levar até 30 segundos</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (etapa === "revisar") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="space-y-4"><div class="space-y-1.5"><label class="text-sm font-medium text-gray-700" for="resumo">Resumo</label> <textarea id="resumo" rows="3" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">`);
				const $$body = escape_html(resumo);
				if ($$body) $$renderer.push(`${$$body}`);
				$$renderer.push(`</textarea></div> <div class="space-y-1.5"><label class="text-sm font-medium text-gray-700" for="objetivoVisita">Objetivo da Visita</label> <input id="objetivoVisita" type="text"${attr("value", objetivoVisita)} class="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"/></div> <div class="space-y-1.5"><label class="text-sm font-medium text-gray-700" for="proximaAcao">Próxima Ação</label> <input id="proximaAcao" type="text"${attr("value", proximaAcao)} class="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"/></div> <div class="border-t border-gray-100 pt-4"><p class="text-sm font-medium text-gray-700 mb-2">Salvar gravação de áudio?</p> <div class="flex gap-2"><button class="px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer"${attr_style(salvarAudio === true ? "background-color: #2563eb; color: white; border-color: #2563eb;" : "border-gray-200 text-gray-600 hover:border-gray-300")}>Sim</button> <button class="px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer"${attr_style(salvarAudio === false ? "background-color: #2563eb; color: white; border-color: #2563eb;" : "border-gray-200 text-gray-600 hover:border-gray-300")}>Não</button></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex gap-3 p-5 border-t border-gray-100"><button class="flex-1 h-10 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Cancelar</button> `);
			if (etapa === "gravar" && !gravacao.gravando && gravacao.audioBlob) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button style="background-color: #7c3aed; border-radius: 8px;" class="flex-1 h-10 text-sm font-medium text-white hover:opacity-90 cursor-pointer">Processar com IA</button>`);
			} else if (etapa === "revisar") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<button${attr("disabled", salvarAudio === null, true)} style="background-color: #2563eb; border-radius: 8px;" class="flex-1 h-10 text-sm font-medium text-white hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Confirmar</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/routes/dashboard/visitas/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let modalGravacaoAberto = false;
		let visitaParaGravar = null;
		function abrirGravacao() {
			const visitaGravavel = visitas.find((v) => v.status === "AGENDADA" || v.status === "REALIZADA");
			if (visitaGravavel) {
				visitaParaGravar = visitaGravavel.id;
				modalGravacaoAberto = true;
			}
		}
		function handleGravacaoSalva() {
			loadVisitas(pagination.page);
		}
		let visitas = [];
		let pagination = {
			page: 1,
			pageSize: 20,
			total: 0,
			totalPages: 0
		};
		let loading = true;
		let filtroStatus = "";
		let filtroBusca = "";
		let filtroDataInicio = "";
		let filtroDataFim = "";
		let materiaisOptions = [];
		let sheetOpen = false;
		let selectedVisita = null;
		let duplicateSource = null;
		async function loadVisitas(page = 1) {
			loading = true;
			try {
				let url = `/visitas?page=${page}&pageSize=${pagination.pageSize}`;
				if (filtroBusca.trim());
				const res = await apiFetch(url, data.sessionToken);
				if (res.ok) {
					const json = await res.json();
					visitas = json.data || json;
					if (json.pagination) pagination = json.pagination;
				}
			} catch (err) {
				console.error(err);
			} finally {
				loading = false;
			}
		}
		function handleNovaVisita() {
			selectedVisita = null;
			duplicateSource = null;
			sheetOpen = true;
		}
		let deleteConfirmOpen = false;
		let visitaToDelete = null;
		async function confirmExcluirVisita() {
			if (!visitaToDelete) return;
			try {
				if ((await apiFetch(`/visitas/${visitaToDelete.id}`, data.sessionToken, { method: "DELETE" })).ok) loadVisitas(pagination.page);
				else toasts.show("error", "Erro ao excluir visita");
			} catch {}
			deleteConfirmOpen = false;
			visitaToDelete = null;
		}
		function isVisitaPassada(visita) {
			if (visita.status === "REALIZADA") return true;
			const execTime = new Date(visita.dataVisita);
			if (visita.duracaoMinutos) execTime.setMinutes(execTime.getMinutes() + visita.duracaoMinutos);
			return execTime < /* @__PURE__ */ new Date();
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("wv08mz", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Histórico de Visitas — MediVisitas</title>`);
				});
			});
			$$renderer.push(`<div class="space-y-6"><div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
			Calendar_days($$renderer, { class: "h-4.5 w-4.5 text-white" });
			$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Histórico de Visitas</h1> <p class="text-xs text-[rgb(var(--slate-400))]">Gerencie seu cronograma global de visitas a profissionais</p></div></div> `);
			Button($$renderer, {
				onclick: handleNovaVisita,
				class: "gap-2",
				children: ($$renderer) => {
					Plus($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----> Nova Visita`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-4"><div class="flex flex-wrap items-end gap-3"><div class="flex-1 min-w-[200px]"><label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="buscaVisita">Buscar por profissional</label> <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--slate-400))]">`);
			Search($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></span> <input id="buscaVisita" type="text"${attr("value", filtroBusca)} placeholder="Nome do profissional..." class="block w-full pl-9 rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50"/></div></div> <div class="min-w-[160px]"><label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="dataInicio">Data início</label> <input id="dataInicio" type="date"${attr("value", filtroDataInicio)} class="block w-full rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50 cursor-pointer svelte-wv08mz"/></div> <div class="min-w-[160px]"><label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="dataFim">Data fim</label> <input id="dataFim" type="date"${attr("value", filtroDataFim)} class="block w-full rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50 cursor-pointer svelte-wv08mz"/></div> <div class="min-w-[150px]"><label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="filtroStatusVisita">Status</label> `);
			$$renderer.select({
				id: "filtroStatusVisita",
				value: filtroStatus,
				class: "block w-full bg-[rgb(var(--slate-50))]/50 rounded-lg border border-[rgb(var(--slate-200))] py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm cursor-pointer"
			}, ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`Todos`);
				});
				$$renderer.option({ value: "AGENDADA" }, ($$renderer) => {
					$$renderer.push(`Agendadas`);
				});
				$$renderer.option({ value: "REALIZADA" }, ($$renderer) => {
					$$renderer.push(`Realizadas`);
				});
				$$renderer.option({ value: "CANCELADA" }, ($$renderer) => {
					$$renderer.push(`Canceladas`);
				});
				$$renderer.option({ value: "NAO_REALIZADA" }, ($$renderer) => {
					$$renderer.push(`Não Realizadas`);
				});
			});
			$$renderer.push(`</div> <div class="flex gap-2"><button type="button" class="px-3 py-2 text-xs font-medium text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))] border border-[rgb(var(--slate-200))] rounded-lg hover:bg-[rgb(var(--slate-50))] transition-colors cursor-pointer">Limpar</button></div></div></div> <div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] overflow-hidden">`);
			if (loading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex justify-center p-12"><div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>`);
			} else if (visitas.length === 0) {
				$$renderer.push("<!--[1-->");
				EmptyState($$renderer, {
					icon: Calendar,
					titulo: "Nenhuma visita encontrada",
					descricao: "Cadastre uma nova visita clicando no botão acima.",
					acaoLabel: "Nova Visita",
					acaoOnclick: () => sheetOpen = true
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="overflow-x-auto"><table class="table-fixed w-full"><thead><tr class="border-b border-[rgb(var(--slate-100))]"><th class="text-left p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[24%]">Profissional</th><th class="text-left p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[22%]">Data / Hora</th><th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Duração</th><th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Materiais</th><th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[18%]">Status</th><th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Ações</th></tr></thead><tbody><!--[-->`);
				const each_array = ensure_array_like(visitas);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let visita = each_array[$$index];
					const passada = isVisitaPassada(visita);
					$$renderer.push(`<tr${attr_class(`border-t border-[rgb(var(--slate-50))] transition-all duration-200 cursor-pointer hover:bg-[rgb(var(--slate-50))]/60 group ${stringify(passada ? "opacity-70" : "")}`)}><td class="p-3.5"><div><p class="text-sm font-medium text-[rgb(var(--slate-900))]">${escape_html(visita.profissional?.nome || "Profissional Desconhecido")}</p> `);
					if (visita.profissional?.especialidade) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-xs text-[rgb(var(--slate-400))]">${escape_html(visita.profissional.especialidade.nome)}</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></td><td class="p-3.5"><div class="flex items-center gap-1.5 text-sm text-[rgb(var(--slate-700))]">`);
					Calendar($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))] shrink-0" });
					$$renderer.push(`<!----> <span class="font-medium">${escape_html(new Intl.DateTimeFormat("pt-BR", {
						day: "2-digit",
						month: "short",
						year: "numeric"
					}).format(new Date(visita.dataVisita)))}</span> <span class="font-medium">às</span> <span class="font-medium">${escape_html(new Intl.DateTimeFormat("pt-BR", {
						hour: "2-digit",
						minute: "2-digit"
					}).format(new Date(visita.dataVisita)))}</span></div></td><td class="p-3.5 text-center">`);
					if (visita.duracaoMinutos) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="inline-flex items-center gap-1 text-sm text-[rgb(var(--slate-600))]">`);
						Clock($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))]" });
						$$renderer.push(`<!----> ${escape_html(visita.duracaoMinutos)} min</div>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<span class="text-sm text-[rgb(var(--slate-300))]">—</span>`);
					}
					$$renderer.push(`<!--]--></td><td class="p-3.5 text-center"><div class="inline-flex items-center gap-1 text-sm text-[rgb(var(--slate-600))]"${attr("title", visita.materiais && visita.materiais.length > 0 ? visita.materiais.map((m) => `${m.quantidade}x ${m.materialTecnico?.nome || "Material"}`).join("\n") : "Sem materiais")}>`);
					Package($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))]" });
					$$renderer.push(`<!----> ${escape_html(visita.materiais?.length || 0)}</div></td><td class="p-3.5 text-center">`);
					StatusVisitaBadge($$renderer, { status: visita.status });
					$$renderer.push(`<!----></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button type="button" class="p-2 rounded-lg transition-all duration-200 cursor-pointer text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-indigo-600 hover:bg-[rgb(var(--slate-100))]" title="Duplicar visita">`);
					Copy($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----></button> <button type="button"${attr("disabled", passada, true)}${attr_class(`p-2 rounded-lg transition-all duration-200 cursor-pointer ${stringify(passada ? "text-[rgb(var(--slate-300))] cursor-not-allowed" : "text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-[rgb(var(--slate-100))]")}`)}${attr("title", passada ? "Visita já ocorrida" : "Excluir visita")}>`);
					Trash_2($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----></button></div></td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div> `);
				if (pagination.totalPages > 1) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="bg-[rgb(var(--slate-50))]/80 border-t border-[rgb(var(--slate-100))] px-5 py-3 flex justify-between items-center"><span class="text-sm text-[rgb(var(--slate-500))] font-medium">Página ${escape_html(pagination.page)} de ${escape_html(pagination.totalPages)} (${escape_html(pagination.total)} registros)</span> <div class="flex items-center gap-1"><button type="button"${attr("disabled", pagination.page <= 1, true)} class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">`);
					Chevron_left($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----></button> <button type="button"${attr("disabled", pagination.page >= pagination.totalPages, true)} class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">`);
					Chevron_right($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----></button></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div></div> `);
			BotaoGravacao($$renderer, { onclick: abrirGravacao });
			$$renderer.push(`<!----> `);
			if (visitaParaGravar) {
				$$renderer.push("<!--[0-->");
				ModalGravacao($$renderer, {
					visitaId: visitaParaGravar,
					sessionToken: data.sessionToken,
					onclose: () => {
						modalGravacaoAberto = false;
						visitaParaGravar = null;
					},
					onsave: handleGravacaoSalva,
					get open() {
						return modalGravacaoAberto;
					},
					set open($$value) {
						modalGravacaoAberto = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			VisitaSheet($$renderer, {
				onclose: () => {
					sheetOpen = false;
					duplicateSource = null;
				},
				onsave: () => {
					sheetOpen = false;
					duplicateSource = null;
					loadVisitas(pagination.page);
				},
				ondelete: () => {
					sheetOpen = false;
					loadVisitas(pagination.page);
				},
				visita: selectedVisita,
				duplicateSource,
				sessionToken: data.sessionToken,
				materiaisOptions,
				get open() {
					return sheetOpen;
				},
				set open($$value) {
					sheetOpen = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			{
				function description($$renderer) {
					$$renderer.push(`<p>A exclusão de dados é permanente, deseja prosseguir?</p>`);
				}
				ConfirmDialog($$renderer, {
					open: deleteConfirmOpen,
					title: "Excluir/Cancelar Visita",
					confirmLabel: "Excluir",
					variant: "danger",
					onclose: () => deleteConfirmOpen = false,
					onconfirm: confirmExcluirVisita,
					description,
					$$slots: { description: true }
				});
			}
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
