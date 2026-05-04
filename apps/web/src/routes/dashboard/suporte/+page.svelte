<script lang="ts">
	import { HelpCircle, Send } from "lucide-svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { toast } from "$lib/stores/toast.svelte";

	let nome = $state("");
	let email = $state("");
	let assunto = $state("");
	let mensagem = $state("");
	let enviando = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		enviando = true;

		// Simulando um envio, já que não temos endpoint específico pedido ainda
		setTimeout(() => {
			toast.sucesso(
				"Mensagem enviada com sucesso! Entraremos em contato em breve.",
			);
			nome = "";
			email = "";
			assunto = "";
			mensagem = "";
			enviando = false;
		}, 1500);
	}
</script>

<svelte:head>
	<title>Ajuda e Suporte — MediVisitas</title>
</svelte:head>

<div class="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-10">
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
		<div class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
				<HelpCircle class="h-4.5 w-4.5 text-white" />
			</div>
			<div>
				<h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Ajuda e Suporte</h1>
				<p class="text-[11px] text-[rgb(var(--slate-400))]">Precisa de ajuda? Envie-nos uma mensagem e retornaremos o mais breve possível.</p>
			</div>
		</div>
	</div>

	<!-- Formulário -->
	<div
		class="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden"
	>
		<div class="p-6">
			<form onsubmit={handleSubmit} class="space-y-5">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<div class="space-y-1.5">
						<label
							for="nome"
							class="text-sm font-medium text-slate-700"
						>
							Nome completo
						</label>
						<input
							type="text"
							id="nome"
							bind:value={nome}
							required
							placeholder="Seu nome"
							class="w-full h-10 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
						/>
					</div>

					<div class="space-y-1.5">
						<label
							for="email"
							class="text-sm font-medium text-slate-700"
						>
							E-mail
						</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							placeholder="seu@email.com"
							class="w-full h-10 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
						/>
					</div>
				</div>

				<div class="space-y-1.5">
					<label
						for="assunto"
						class="text-sm font-medium text-slate-700"
					>
						Assunto
					</label>
					<input
						type="text"
						id="assunto"
						bind:value={assunto}
						required
						placeholder="Ex: Dúvida sobre agendamento, Problema técnico, etc."
						class="w-full h-10 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
					/>
				</div>

				<div class="space-y-1.5">
					<label
						for="mensagem"
						class="text-sm font-medium text-slate-700"
					>
						Mensagem
					</label>
					<textarea
						id="mensagem"
						bind:value={mensagem}
						required
						rows="5"
						placeholder="Como podemos te ajudar hoje?"
						class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y"
					></textarea>
				</div>

				<div class="pt-2 flex justify-end">
					<Button type="submit" disabled={enviando}>
						<Send class="w-4 h-4 mr-2" />
						{enviando ? "Enviando..." : "Enviar Mensagem"}
					</Button>
				</div>
			</form>
		</div>

		<div
			class="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
		>
			<div class="text-sm text-slate-600">
				<p class="font-medium text-slate-900 mb-0.5">
					Outros canais de atendimento
				</p>
				<p>Horário de atendimento: Segunda a Sexta, 09h às 18h (BRT)</p>
			</div>
			<div class="text-sm text-slate-600">
				<a
					href="mailto:suporte@medivisitas.com"
					class="text-blue-600 font-medium hover:underline"
					>suporte@medivisitas.com</a
				>
			</div>
		</div>
	</div>
</div>
