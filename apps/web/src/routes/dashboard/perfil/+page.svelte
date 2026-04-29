<script lang="ts">
	import { User, Shield, Bell, Settings, ChevronRight, CreditCard, Building2, RotateCcw } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { apiFetch } from '$lib/api';
	import { toast } from '$lib/stores/toast.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		data: {
			me: {
				id: string;
				email: string;
				name: string | null;
				organizationId: string | null;
				role: string | null;
				tourConcluidoEm: string | null;
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
	let activeTab = $state('conta');
	let resetingTour = $state(false);

	const tabs = [
		{ id: 'conta', label: 'Conta', icon: User },
		{ id: 'plano', label: 'Plano', icon: CreditCard },
		{ id: 'organizacao', label: 'Organização', icon: Building2 },
		{ id: 'seguranca', label: 'Segurança', icon: Shield },
		{ id: 'notificacoes', label: 'Notificações', icon: Bell },
		{ id: 'preferencias', label: 'Preferências', icon: Settings },
	];

	function getPlanoLabel(plano: string | undefined) {
		switch (plano) {
			case 'INDIVIDUAL': return 'Individual';
			case 'EMPRESA': return 'Empresa';
			case 'ENTERPRISE': return 'Enterprise';
			case 'TRIAL': return 'Trial gratuito';
			default: return plano || '—';
		}
	}

	function getStatusLabel(status: string | undefined) {
		switch (status) {
			case 'TRIAL_ATIVO': return 'Trial Ativo';
			case 'ATIVO': return 'Ativo';
			case 'SUSPENSO': return 'Suspenso';
			case 'TRIAL_EXPIRADO': return 'Trial Expirado';
			case 'CANCELADO': return 'Cancelado';
			default: return status || '—';
		}
	}

	function getStatusBadge(status: string | undefined) {
		switch (status) {
			case 'TRIAL_ATIVO': return 'bg-amber-50 text-amber-700';
			case 'ATIVO': return 'bg-emerald-50 text-emerald-700';
			case 'TRIAL_EXPIRADO': return 'bg-red-50 text-red-700';
			case 'CANCELADO': return 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-500))]';
			default: return 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-500))]';
		}
	}

	async function reverTour() {
		resetingTour = true;
		try {
			const res = await apiFetch('/onboarding/tour-reset', data.sessionToken, { method: 'PATCH' });
			if (res.ok) {
				toast.sucesso('Tour reativado! Acesse o Dashboard para revê-lo.');
				goto('/dashboard');
			} else {
				toast.erro('Erro ao reativar o tour');
			}
		} catch {
			toast.erro('Erro de conexão. Tente novamente.');
		} finally {
			resetingTour = false;
		}
	}

	function solicitarRedefinicaoSenha() {
		toast.info('Um link de redefinição será enviado para ' + (data.me?.email || 'seu e-mail') + '.');
	}

	function configurar2FA() {
		toast.info('A configuração de 2FA estará disponível em breve.');
	}
</script>

<svelte:head>
	<title>Meu Perfil — MediVisitas</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-3 mb-6">
		<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
			<User class="h-4.5 w-4.5 text-white" />
		</div>
		<div>
			<h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Meu Perfil</h1>
			<p class="text-xs text-[rgb(var(--slate-400))]">Gerencie suas informações e preferências</p>
		</div>
	</div>

	<div class="flex flex-col lg:flex-row gap-6">
		<!-- Sidebar de tabs -->
		<div class="w-full lg:w-56 shrink-0">
			<nav class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] overflow-hidden">
				{#each tabs as tab}
					{@const Icon = tab.icon}
					<button
						onclick={() => activeTab = tab.id}
						class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer
							{activeTab === tab.id
								? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
								: 'text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-50))] border-l-2 border-transparent'}"
					>
						<Icon class="w-4 h-4 shrink-0" />
						{tab.label}
						{#if activeTab === tab.id}
							<ChevronRight class="w-3.5 h-3.5 ml-auto" />
						{/if}
					</button>
				{/each}
			</nav>
		</div>

		<!-- Conteúdo da tab ativa -->
		<div class="flex-1 min-w-0">
			{#if activeTab === 'conta'}
				<div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-6 space-y-6">
					<h2 class="text-base font-semibold text-[rgb(var(--slate-800))]">Informações da Conta</h2>

					<div class="grid gap-5">
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">Nome</span>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">
								{data.me?.name || 'Não configurado'}
							</p>
							<p class="text-xs mt-0.5 text-[rgb(var(--slate-400))]">
								O nome é gerenciado pela sua conta de autenticação.
							</p>
						</div>
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">E-mail</span>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">{data.me?.email || 'E-mail não encontrado'}</p>
						</div>
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">Função na organização</span>
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
								{data.me?.role === 'OWNER' ? 'bg-blue-50 text-blue-700' : 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]'}">
								{data.me?.role === 'OWNER' ? 'Gestor' : 'Propagandista'}
							</span>
						</div>
					</div>

					<div class="pt-4 border-t border-[rgb(var(--slate-100))]">
						<p class="text-xs text-[rgb(var(--slate-400))]">
							Para alterar seu nome ou e-mail, entre em contato com o suporte ou
							acesse as configurações da sua conta de login.
						</p>
					</div>
				</div>

			{:else if activeTab === 'plano'}
				<div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-6 space-y-6">
					<h2 class="text-base font-semibold text-[rgb(var(--slate-800))]">Plano & Assinatura</h2>

					<div class="grid gap-4">
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">Plano Atual</span>
							<p class="text-lg font-bold text-[rgb(var(--slate-800))]">
								{#if data.billing?.plano === 'INDIVIDUAL'}Individual
								{:else if data.billing?.plano === 'EMPRESA'}Empresa
								{:else if data.billing?.status === 'TRIAL_ATIVO'}Trial gratuito
								{:else}{getPlanoLabel(data.billing?.plano)}{/if}
							</p>
						</div>
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">Status</span>
							{#if data.billing?.status === 'TRIAL_ATIVO'}
								<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
									style="background-color: #fef3c7; color: #92400e;">
									Trial ativo — {data.diasRestantesTrial ?? 0}d restantes
								</span>
							{:else if data.billing?.status === 'ATIVO'}
								<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
									style="background-color: #d1fae5; color: #065f46;">
									Assinatura ativa
								</span>
							{:else}
								<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold {getStatusBadge(data.billing?.status)}">
									{getStatusLabel(data.billing?.status)}
								</span>
							{/if}
						</div>
						{#if data.diasRestantesTrial !== null && data.diasRestantesTrial <= 3}
							<div class="p-3 rounded-lg bg-amber-50 border border-amber-200">
								<p class="text-xs font-medium text-amber-800">
									{#if data.diasRestantesTrial === 0}Seu trial expira hoje!
									{:else if data.diasRestantesTrial === 1}Seu trial expira amanhã.
									{:else}Faltam {data.diasRestantesTrial} dias para o trial expirar.{/if}
								</p>
							</div>
						{/if}
					</div>

					<div class="pt-4 border-t border-[rgb(var(--slate-100))]">
						<a
							href="/planos"
							class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
						>
							<CreditCard class="w-3.5 h-3.5" />
							Gerenciar plano
							<ChevronRight class="w-3 h-3" />
						</a>
					</div>
				</div>

			{:else if activeTab === 'organizacao'}
				<div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-6 space-y-6">
					<h2 class="text-base font-semibold text-[rgb(var(--slate-800))]">Organização</h2>

					<div class="grid gap-5">
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">Nome</span>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">
								{data.org?.nome || 'Organização individual'}
							</p>
						</div>
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">ID da Organização</span>
							<p class="text-xs font-mono text-[rgb(var(--slate-500))]">{data.org?.id || data.me?.organizationId || 'Não disponível'}</p>
						</div>
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">Tipo</span>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">
								{data.org?.limiteUsuarios === 1 ? 'Individual' : 'Empresa'}
							</p>
						</div>
						<div>
							<span class="block text-xs font-medium uppercase tracking-wider text-[rgb(var(--slate-400))] mb-1.5">Membro desde</span>
							<p class="text-sm text-[rgb(var(--slate-800))]">
								{data.org?.createdAt
									? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(data.org.createdAt))
									: '—'}
							</p>
						</div>
					</div>
				</div>

			{:else if activeTab === 'seguranca'}
				<div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-6 space-y-5">
					<h2 class="text-base font-semibold text-[rgb(var(--slate-800))]">Segurança da Conta</h2>

					<!-- Alterar senha -->
					<div class="flex items-start justify-between py-4 border-b border-[rgb(var(--slate-100))]">
						<div>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">Senha</p>
							<p class="text-xs mt-0.5 text-[rgb(var(--slate-400))]">
								Altere sua senha de acesso ao MediVisitas
							</p>
						</div>
						<button
							onclick={solicitarRedefinicaoSenha}
							class="h-8 px-3 rounded-lg border text-xs font-medium transition-colors hover:bg-[rgb(var(--slate-50))] cursor-pointer"
							style="border-color: rgb(var(--slate-200)); color: rgb(var(--slate-600));"
						>
							Alterar senha
						</button>
					</div>

					<!-- 2FA -->
					<div class="flex items-start justify-between py-4 border-b border-[rgb(var(--slate-100))]">
						<div>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">
								Autenticação em dois fatores
							</p>
							<p class="text-xs mt-0.5 text-[rgb(var(--slate-400))]">
								Adicione uma camada extra de segurança à sua conta
							</p>
						</div>
						<button
							onclick={configurar2FA}
							class="h-8 px-3 rounded-lg border text-xs font-medium transition-colors hover:bg-[rgb(var(--slate-50))] cursor-pointer"
							style="border-color: rgb(var(--slate-200)); color: rgb(var(--slate-600));"
						>
							Configurar
						</button>
					</div>

					<!-- Sessão atual -->
					<div class="py-4">
						<p class="text-sm font-medium mb-1 text-[rgb(var(--slate-800))]">Sessão atual</p>
						<p class="text-xs text-[rgb(var(--slate-400))]">
							Navegador atual · {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())}
						</p>
					</div>
				</div>

			{:else if activeTab === 'notificacoes'}
				<div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-6 space-y-5">
					<h2 class="text-base font-semibold text-[rgb(var(--slate-800))]">Notificações</h2>

					<!-- Toggle: Visitas do dia -->
					<div class="flex items-center justify-between py-3 border-b border-[rgb(var(--slate-100))]">
						<div>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">Visitas do dia</p>
							<p class="text-xs mt-0.5 text-[rgb(var(--slate-400))]">
								Lembrete diário das visitas agendadas para hoje
							</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" checked class="sr-only peer" />
							<div class="w-9 h-5 rounded-full peer peer-checked:bg-blue-600 bg-gray-200
								after:content-[''] after:absolute after:top-0.5 after:left-0.5
								after:bg-white after:rounded-full after:h-4 after:w-4
								after:transition-all peer-checked:after:translate-x-4"></div>
						</label>
					</div>

					<!-- Toggle: Profissionais sem visita -->
					<div class="flex items-center justify-between py-3 border-b border-[rgb(var(--slate-100))]">
						<div>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">Profissionais sem visita recente</p>
							<p class="text-xs mt-0.5 text-[rgb(var(--slate-400))]">
								Alertas de profissionais sem visita há mais de 30 dias
							</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" checked class="sr-only peer" />
							<div class="w-9 h-5 rounded-full peer peer-checked:bg-blue-600 bg-gray-200
								after:content-[''] after:absolute after:top-0.5 after:left-0.5
								after:bg-white after:rounded-full after:h-4 after:w-4
								after:transition-all peer-checked:after:translate-x-4"></div>
						</label>
					</div>

					<!-- Toggle: Agendamentos não realizados -->
					<div class="flex items-center justify-between py-3 border-b border-[rgb(var(--slate-100))]">
						<div>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">Agendamentos não realizados</p>
							<p class="text-xs mt-0.5 text-[rgb(var(--slate-400))]">
								Alertas de agendamentos vencidos sem registro de visita
							</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" checked class="sr-only peer" />
							<div class="w-9 h-5 rounded-full peer peer-checked:bg-blue-600 bg-gray-200
								after:content-[''] after:absolute after:top-0.5 after:left-0.5
								after:bg-white after:rounded-full after:h-4 after:w-4
								after:transition-all peer-checked:after:translate-x-4"></div>
						</label>
					</div>

					<!-- Link para histórico -->
					<div class="pt-2">
						<a href="/dashboard/notificacoes"
							class="text-xs font-medium flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
							Ver histórico de notificações →
						</a>
					</div>
				</div>

			{:else if activeTab === 'preferencias'}
				<div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-6 space-y-6">
					<h2 class="text-base font-semibold text-[rgb(var(--slate-800))]">Preferências</h2>

					<!-- Tour -->
					<div class="flex items-center justify-between py-3 border-b border-[rgb(var(--slate-100))]">
						<div>
							<p class="text-sm font-medium text-[rgb(var(--slate-700))]">Tutorial de boas-vindas</p>
							<p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">Rever o guia passo a passo do primeiro acesso</p>
						</div>
						<Button variant="outline" size="sm" onclick={reverTour} disabled={resetingTour}>
							<RotateCcw class="w-3.5 h-3.5 mr-1.5" />
							{resetingTour ? 'Resetando...' : 'Rever Tour'}
						</Button>
					</div>

					<!-- Lembretes automáticos -->
					<div class="flex items-start justify-between py-3">
						<div>
							<p class="text-sm font-medium text-[rgb(var(--slate-700))]">Lembretes automáticos</p>
							<p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">Gerados diariamente às 06h com base na sua agenda</p>
						</div>
						<span class="text-xs px-2 py-0.5 rounded-full mt-0.5"
							style="background-color: #d1fae5; color: #065f46;">
							Ativos
						</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
