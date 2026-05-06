<script lang="ts">
	import { Send, HelpCircle } from "lucide-svelte";
	import { toast } from "$lib/stores/toast.svelte";
	import { apiFetch } from "$lib/api";

	interface Props {
		data: {
			userName: string | null;
			userEmail: string | null;
			sessionToken: string;
		};
	}

	let { data }: Props = $props();

	let assunto = $state("");
	let mensagem = $state("");
	let enviando = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		enviando = true;

		try {
			await apiFetch("/suporte", data.sessionToken, {
				method: "POST",
				body: JSON.stringify({
					nome: data.userName || "Usuário Não Informado",
					email: data.userEmail || "nao-informado@medivisitas.com",
					assunto,
					mensagem,
				}),
			});

			toast.sucesso(
				"Mensagem enviada com sucesso! Entraremos em contato em breve.",
			);
			assunto = "";
			mensagem = "";
		} catch (error) {
			console.error("[Suporte] Erro ao enviar mensagem:", error);
			toast.erro(
				"Falha ao enviar mensagem. Por favor, tente novamente mais tarde.",
			);
		} finally {
			enviando = false;
		}
	}
</script>

<svelte:head>
	<title>Ajuda e Suporte — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<div class="page-header">
	<div class="page-header-main">
		<div class="page-header-icon">
			<HelpCircle class="h-4.5 w-4.5 text-white" />
		</div>
		<div>
			<h1 class="page-title">Ajuda e Suporte</h1>
			<p class="page-description">Precisa de ajuda? Envie-nos uma mensagem e retornaremos o mais breve possível.</p>
		</div>
	</div>
</div>

<div class="max-w-3xl">
	<div class="card-surface p-6">
		<form onsubmit={handleSubmit} class="space-y-5">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div class="space-y-1.5">
					<label
						for="nome"
						class="input-label"
					>
						Nome completo
					</label>
					<input
						type="text"
						id="nome"
						value={data.userName || ''}
						readonly
						class="input-base cursor-not-allowed opacity-70"
					/>
				</div>

				<div class="space-y-1.5">
					<label
						for="email"
						class="input-label"
					>
						E-mail
					</label>
					<input
						type="email"
						id="email"
						value={data.userEmail || ''}
						readonly
						class="input-base cursor-not-allowed opacity-70"
					/>
				</div>
			</div>

			<div class="space-y-1.5">
				<label
					for="assunto"
					class="input-label"
				>
					Tipo da dúvida
				</label>
				<select
					id="assunto"
					bind:value={assunto}
					required
					class="input-base"
				>
					<option value="" disabled selected>Selecione o tipo de dúvida...</option>
					<option value="Suporte Técnico">Suporte Técnico</option>
					<option value="Dúvida sobre Agendamento">Dúvida sobre Agendamento</option>
					<option value="Faturamento e Planos">Faturamento e Planos</option>
					<option value="Sugestão de Melhoria">Sugestão de Melhoria</option>
					<option value="Outro Assunto">Outro Assunto</option>
				</select>
			</div>

			<div class="space-y-1.5">
				<label
					for="mensagem"
					class="input-label"
				>
					Mensagem
				</label>
				<textarea
					id="mensagem"
					bind:value={mensagem}
					required
					placeholder="Como podemos te ajudar hoje?"
					class="input-base min-h-[160px] resize-y"
				></textarea>
			</div>

			<div class="flex justify-end w-full sm:w-auto">
				<button type="submit" disabled={enviando} class="w-full sm:w-auto mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-medium text-sm rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" style="background-color: var(--brand-primary);">
					<Send class="size-4" />
					{enviando ? "Enviando..." : "Enviar Mensagem"}
				</button>
			</div>
		</form>
	</div>
</div>
