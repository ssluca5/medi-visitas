<script lang="ts">
	import { onMount } from "svelte";
	import {
		User,
		Shield,
		Bell,
		Settings,
		CreditCard,
		Building2,
		RotateCcw,
		Moon,
		Pencil,
	} from "lucide-svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { apiFetch } from "$lib/api";
	import { toast } from "$lib/stores/toast.svelte";
	import { goto, invalidateAll } from "$app/navigation";

	interface Props {
		data: {
			me: {
				id: string;
				email: string;
				name: string | null;
				organizationId: string | null;
				role: string | null;
				tourConcluidoEm: string | null;
				notifVisitasDia: boolean;
				notifSemVisitaRecente: boolean;
				notifAgendaNaoRealizada: boolean;
				notifLembretesAuto: boolean;
			} | null;
			billing: {
				plano: string;
				status: string;
				trialExpiraEm: string | null;
			} | null;
			diasRestantesTrial: number | null;
			org: {
				id: string;
				nome: string;
				plano: string;
				status: string;
				trialExpiraEm: string;
				createdAt: string;
				limiteUsuarios: number;
			} | null;
			sessionToken: string | null;
		};
	}

	let { data }: Props = $props();
	let activeTab = $state("conta");
	let resetingTour = $state(false);
	let temaEscuro = $state(false);
	let temaCarregado = $state(false);

	let isEditingName = $state(false);
	let editedName = $state("");

	let notifVisitasDia = $state(data.me?.notifVisitasDia ?? true);
	let notifSemVisitaRecente = $state(data.me?.notifSemVisitaRecente ?? true);
	let notifAgendaNaoRealizada = $state(data.me?.notifAgendaNaoRealizada ?? true);
	let notifLembretesAuto = $state(data.me?.notifLembretesAuto ?? true);

	type PreferenceField =
		| "notifVisitasDia"
		| "notifSemVisitaRecente"
		| "notifAgendaNaoRealizada"
		| "notifLembretesAuto";

	const preferenceLabels: Record<PreferenceField, string> = {
		notifVisitasDia: "Visitas do dia",
		notifSemVisitaRecente: "Profissionais sem visita recente",
		notifAgendaNaoRealizada: "Agendamentos não realizados",
		notifLembretesAuto: "Lembretes automáticos",
	};

	const tabs = [
		{ id: "conta", label: "Conta", icon: User },
		{ id: "plano", label: "Plano", icon: CreditCard },
		{ id: "organizacao", label: "Organização", icon: Building2 },
		{ id: "seguranca", label: "Segurança", icon: Shield },
		{ id: "notificacoes", label: "Notificações", icon: Bell },
		{ id: "preferencias", label: "Preferências", icon: Settings },
	];

	function getPlanoLabel(plano: string | undefined) {
		switch (plano) {
			case "BASICO":
				return "Básico";
			case "PROFISSIONAL":
				return "Profissional";
			case "EQUIPE":
				return "Equipe";
			case "EMPRESARIAL":
				return "Empresarial";
			case "TRIAL":
				return "Trial gratuito";
			default:
				return plano || "—";
		}
	}

	function getStatusLabel(status: string | undefined) {
		switch (status) {
			case "TRIAL_ATIVO":
				return "Trial Ativo";
			case "ATIVO":
				return "Ativo";
			case "SUSPENSO":
				return "Suspenso";
			case "TRIAL_EXPIRADO":
				return "Trial Expirado";
			case "CANCELADO":
				return "Cancelado";
			default:
				return status || "—";
		}
	}

	function getStatusBadge(status: string | undefined) {
		switch (status) {
			case "TRIAL_ATIVO":
				return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
			case "ATIVO":
				return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
			case "TRIAL_EXPIRADO":
				return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20";
			case "CANCELADO":
				return "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20";
			default:
				return "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20";
		}
	}

	async function reverTour() {
		resetingTour = true;
		try {
			const res = await apiFetch(
				"/onboarding/tour-reset",
				data.sessionToken,
				{ method: "PATCH" },
			);
			if (res.ok) {
				toast.sucesso("Tour reativado.");
				goto("/dashboard");
			} else {
				toast.erro("Erro ao reativar o tour");
			}
		} catch {
			toast.erro("Erro de conexão. Tente novamente.");
		} finally {
			resetingTour = false;
		}
	}

	async function savePreferences(field: PreferenceField, value: boolean) {
		try {
			const res = await apiFetch("/me", data.sessionToken, {
				method: "PATCH",
				body: JSON.stringify({
					[field]: value,
				}),
			});
			if (res.ok) {
				toast.sucesso(
					`${preferenceLabels[field]} ${value ? "marcada" : "desmarcada"}.`,
				);
			} else {
				toast.erro("Erro ao salvar preferência.");
			}
		} catch {
			toast.erro("Erro de conexão. Tente novamente.");
		}
	}

	async function saveName() {
		if (!editedName.trim()) {
			toast.erro("O nome não pode estar vazio.");
			return;
		}
		try {
			const res = await apiFetch("/me", data.sessionToken, {
				method: "PATCH",
				body: JSON.stringify({ name: editedName.trim() }),
			});
			if (res.ok) {
				const updated = await res.json();
				const nextName = updated.name ?? editedName.trim();
				toast.sucesso("Nome atualizado com sucesso!");
				isEditingName = false;
				editedName = nextName;
				if (data.me) data.me.name = nextName;
				await invalidateAll();
			} else {
				toast.erro("Erro ao atualizar o nome.");
			}
		} catch {
			toast.erro("Erro de conexão.");
		}
	}

	function solicitarRedefinicaoSenha() {
		toast.info(
			"Um link de redefinição será enviado para " +
				(data.me?.email || "seu e-mail") +
				".",
		);
	}

	function configurar2FA() {
		toast.info("A configuração de 2FA estará disponível em breve.");
	}

	onMount(() => {
		const temaSalvo = localStorage.getItem("theme");
		temaEscuro =
			temaSalvo === "dark" ||
			document.documentElement.getAttribute("data-theme") === "dark";
		temaCarregado = true;

		// Verifica se há hash na URL para abrir a tab correta
		const hash = window.location.hash.replace("#", "");
		if (hash && tabs.some(t => t.id === hash)) {
			activeTab = hash;
		}
	});

	$effect(() => {
		if (!temaCarregado) return;
		const tema = temaEscuro ? "dark" : "light";
		document.documentElement.setAttribute("data-theme", tema);
		localStorage.setItem("theme", tema);
	});

	function handleHashChange() {
		const hash = window.location.hash.replace("#", "");
		if (hash && tabs.some(t => t.id === hash)) {
			activeTab = hash;
		}
	}
</script>

<svelte:window onhashchange={handleHashChange} />

<svelte:head>
	<title>Meu Perfil — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<div class="page-header">
	<div class="page-header-main">
		<div
			class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm"
		>
			<User class="h-4.5 w-4.5 text-white" />
		</div>
		<div>
			<h1 class="page-title">
				Meu Perfil
			</h1>
			<p class="page-description">
				Gerencie suas informações pessoais e de segurança.
			</p>
		</div>
	</div>
</div>

<div class="flex flex-col lg:flex-row gap-6 w-full">
	<!-- Sidebar de tabs -->
	<aside class="w-full lg:w-64 shrink-0">
		<nav class="space-y-1">
			{#each tabs as tab}
				{@const Icon = tab.icon}
				<button
					onclick={() => (activeTab = tab.id)}
					class="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
							{activeTab === tab.id
						? 'bg-slate-100 text-slate-900'
						: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}"
				>
					<Icon
						class="w-4 h-4 shrink-0 transition-colors {activeTab ===
						tab.id
							? 'text-blue-600'
							: 'text-slate-400 group-hover:text-slate-600'}"
					/>
					{tab.label}
				</button>
			{/each}
		</nav>
	</aside>

	<!-- Conteúdo da tab ativa -->
	<div class="flex-1 w-full">
		{#if activeTab === "conta"}
			<div
				class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100"
			>
				<!-- Seção Nome -->
				<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
					<div>
						<p class="text-sm font-medium text-slate-900">Nome</p>
						<p class="text-sm text-slate-500 mt-1">
							Como você quer ser chamado.
						</p>
					</div>
					<div class="sm:text-right flex items-center justify-end gap-3">
						{#if isEditingName}
							<input type="text" bind:value={editedName} class="border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-full sm:w-auto" placeholder="Seu nome" onkeydown={(e) => e.key === 'Enter' && saveName()} />
							<div class="flex gap-1">
								<Button variant="outline" size="sm" onclick={() => isEditingName = false}>Cancelar</Button>
								<Button size="sm" onclick={saveName}>Salvar Alterações</Button>
							</div>
						{:else}
							<div class="flex flex-col items-end">
								<p class="text-[14px] text-[rgb(var(--slate-600))]">
									{data.me?.name || "Não configurado"}
								</p>
								{#if !data.me?.name}
									<p class="text-xs text-slate-500 mt-1">
										Gerenciado pela sua conta de login
									</p>
								{/if}
							</div>
							<Button variant="ghost" size="icon" class="h-8 w-8 text-slate-400 hover:text-slate-600" onclick={() => { editedName = data.me?.name || ""; isEditingName = true; }}>
								<Pencil class="h-4 w-4" />
							</Button>
						{/if}
					</div>
				</div>

				<!-- Seção Email -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Endereço de e-mail
						</p>
						<p class="text-sm text-slate-500 mt-1">
							E-mail vinculado à sua conta.
						</p>
					</div>
					<div class="sm:text-right">
						<p class="text-[14px] text-[rgb(var(--slate-600))]">
							{data.me?.email || "E-mail não encontrado"}
						</p>
					</div>
				</div>

				<!-- Seção Função -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">Função</p>
						<p class="text-sm text-slate-500 mt-1">
							Seu nível de acesso na organização.
						</p>
					</div>
					<div class="sm:text-right">
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
								{data.me?.role === 'OWNER'
								? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
								: 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20'}"
						>
							{data.me?.role === "OWNER"
								? "Gestor"
								: "Propagandista"}
						</span>
					</div>
				</div>
			</div>
		{:else if activeTab === "plano"}
			<div
				class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100"
			>
				<!-- Plano Atual -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Plano Atual
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Plano vigente da sua assinatura.
						</p>
					</div>
					<div class="sm:text-right">
						<p class="text-[14px] text-[rgb(var(--slate-600))]">
							{#if data.billing?.status === "TRIAL_ATIVO"}Trial
								gratuito
							{:else}{getPlanoLabel(data.billing?.plano)}{/if}
						</p>
					</div>
				</div>
				<!-- Status -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">Status</p>
						<p class="text-sm text-slate-500 mt-1">
							Situação atual da sua conta.
						</p>
					</div>
					<div
						class="sm:text-right flex flex-col items-start sm:items-end gap-2"
					>
						{#if data.billing?.status === "TRIAL_ATIVO"}
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
							>
								Trial ativo — {data.diasRestantesTrial ?? 0}d
								restantes
							</span>
						{:else if data.billing?.status === "ATIVO"}
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
							>
								Assinatura ativa
							</span>
						{:else}
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusBadge(
									data.billing?.status,
								)}"
							>
								{getStatusLabel(data.billing?.status)}
							</span>
						{/if}

						{#if data.diasRestantesTrial !== null && data.diasRestantesTrial <= 3}
							<p class="text-xs font-medium text-amber-600 mt-1">
								{#if data.diasRestantesTrial === 0}Seu trial
									expira hoje!
								{:else if data.diasRestantesTrial === 1}Seu
									trial expira amanhã.
								{:else}Faltam {data.diasRestantesTrial} dias para
									expirar.{/if}
							</p>
						{/if}
					</div>
				</div>
				<!-- Ação -->
				<div class="p-6 bg-slate-50/50 rounded-b-xl flex justify-end">
					<a
						href="/planos"
						class="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
					>
						{#if data.billing?.status === "TRIAL_ATIVO"}
							Assinar plano
						{:else}
							Gerenciar plano
						{/if}
					</a>
				</div>
			</div>
		{:else if activeTab === "organizacao"}
			<div
				class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100"
			>
				<!-- Nome -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">Nome</p>
						<p class="text-sm text-slate-500 mt-1">
							Nome da sua organização.
						</p>
					</div>
					<div class="sm:text-right">
						<p class="text-[14px] text-[rgb(var(--slate-600))]">
							{data.org?.nome || "Organização individual"}
						</p>
					</div>
				</div>
				<!-- ID -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							ID da Organização
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Identificador único interno.
						</p>
					</div>
					<div class="sm:text-right">
						<p
							class="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded"
						>
							{data.org?.id ||
								data.me?.organizationId ||
								"Não disponível"}
						</p>
					</div>
				</div>
				<!-- Tipo -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">Tipo</p>
						<p class="text-sm text-slate-500 mt-1">
							Modelo de organização.
						</p>
					</div>
					<div class="sm:text-right">
						<p class="text-[14px] text-[rgb(var(--slate-600))]">
							{data.org?.limiteUsuarios === 1
								? "Individual"
								: "Equipe"}
						</p>
					</div>
				</div>
				<!-- Membro desde -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Membro desde
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Data de ingresso na organização.
						</p>
					</div>
					<div class="sm:text-right">
						<p class="text-[14px] text-[rgb(var(--slate-600))]">
							{data.org?.createdAt
								? new Intl.DateTimeFormat("pt-BR", {
										day: "2-digit",
										month: "long",
										year: "numeric",
									}).format(new Date(data.org.createdAt))
								: "—"}
						</p>
					</div>
				</div>
			</div>
		{:else if activeTab === "seguranca"}
			<div
				class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100"
			>
				<!-- Senha -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">Senha</p>
						<p class="text-sm text-slate-500 mt-1">
							Altere sua senha de acesso ao MediVisitas.
						</p>
					</div>
					<div>
						<Button
							variant="outline"
							onclick={solicitarRedefinicaoSenha}
							class="w-full sm:w-auto"
						>
							Alterar senha
						</Button>
					</div>
				</div>

				<!-- 2FA -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Autenticação em dois fatores
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Adicione uma camada extra de segurança à sua conta.
						</p>
					</div>
					<div>
						<Button
							variant="outline"
							onclick={configurar2FA}
							class="w-full sm:w-auto"
						>
							Configurar
						</Button>
					</div>
				</div>

				<!-- Sessão -->
				<div
					class="p-6 bg-slate-50/50 rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Sessões ativas
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Navegador atual · {new Intl.DateTimeFormat(
								"pt-BR",
								{
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								},
							).format(new Date())}
						</p>
					</div>
				</div>
			</div>
		{:else if activeTab === "notificacoes"}
			<div
				class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100"
			>
				<!-- Toggle: Visitas do dia -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Visitas do dia
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Lembrete diário das visitas agendadas para hoje.
						</p>
					</div>
					<label
						class="relative inline-flex items-center cursor-pointer shrink-0"
					>
						<input type="checkbox" bind:checked={notifVisitasDia} onchange={() => savePreferences("notifVisitasDia", notifVisitasDia)} class="sr-only peer" />
						<div
							class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
								after:content-[''] after:absolute after:top-0.5 after:left-[2px]
								after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
								after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"
						></div>
					</label>
				</div>

				<!-- Toggle: Profissionais sem visita -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Profissionais sem visita recente
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Alertas de profissionais sem visita há mais de 30
							dias.
						</p>
					</div>
					<label
						class="relative inline-flex items-center cursor-pointer shrink-0"
					>
						<input type="checkbox" bind:checked={notifSemVisitaRecente} onchange={() => savePreferences("notifSemVisitaRecente", notifSemVisitaRecente)} class="sr-only peer" />
						<div
							class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
								after:content-[''] after:absolute after:top-0.5 after:left-[2px]
								after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
								after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"
						></div>
					</label>
				</div>

				<!-- Toggle: Agendamentos não realizados -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Agendamentos não realizados
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Alertas de agendamentos vencidos sem registro de
							visita.
						</p>
					</div>
					<label
						class="relative inline-flex items-center cursor-pointer shrink-0"
					>
						<input type="checkbox" bind:checked={notifAgendaNaoRealizada} onchange={() => savePreferences("notifAgendaNaoRealizada", notifAgendaNaoRealizada)} class="sr-only peer" />
						<div
							class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
								after:content-[''] after:absolute after:top-0.5 after:left-[2px]
								after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
								after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"
						></div>
					</label>
				</div>

				<!-- Link para histórico -->
				<div class="p-6 bg-slate-50/50 rounded-b-xl flex justify-end">
					<a
						href="/dashboard/notificacoes"
						class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
					>
						Ver histórico completo &rarr;
					</a>
				</div>
			</div>
		{:else if activeTab === "preferencias"}
			<div
				class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100"
			>
				<!-- Aparência -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div class="flex items-start gap-3">
						<div
							class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
						>
							<Moon class="h-4 w-4" />
						</div>
						<div>
							<p class="text-sm font-medium text-slate-900">
								Tema escuro
							</p>
							<p class="text-sm text-slate-500 mt-1">
								Alterna a aparência da ferramenta neste
								navegador.
							</p>
						</div>
					</div>
					<label
						class="relative inline-flex items-center cursor-pointer shrink-0"
					>
						<input
							type="checkbox"
							bind:checked={temaEscuro}
							class="sr-only peer"
							aria-label="Ativar tema escuro"
						/>
						<div
							class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
								after:content-[''] after:absolute after:top-0.5 after:left-[2px]
								after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
								after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"
						></div>
					</label>
				</div>

				<!-- Tour -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Tutorial de boas-vindas
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Rever o guia passo a passo do primeiro acesso ao
							dashboard.
						</p>
					</div>
					<div>
						<Button
							variant="outline"
							size="sm"
							onclick={reverTour}
							disabled={resetingTour}
						>
							<RotateCcw class="w-3.5 h-3.5 mr-1.5" />
							{resetingTour ? "Resetando..." : "Rever Tour"}
						</Button>
					</div>
				</div>

				<!-- Lembretes automáticos -->
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4"
				>
					<div>
						<p class="text-sm font-medium text-slate-900">
							Lembretes automáticos
						</p>
						<p class="text-sm text-slate-500 mt-1">
							Gerados diariamente às 06h com base na sua agenda.
						</p>
					</div>
					<div class="sm:text-right">
						<label
							class="relative inline-flex items-center cursor-pointer shrink-0"
						>
							<input type="checkbox" bind:checked={notifLembretesAuto} onchange={() => savePreferences("notifLembretesAuto", notifLembretesAuto)} class="sr-only peer" />
							<div
								class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
									after:content-[''] after:absolute after:top-0.5 after:left-[2px]
									after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
									after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"
							></div>
						</label>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
