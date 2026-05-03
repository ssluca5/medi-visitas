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
			case 'BASICO': return 'Básico';
			case 'PROFISSIONAL': return 'Profissional';
			case 'EQUIPE': return 'Equipe';
			case 'EMPRESARIAL': return 'Empresarial';
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
			case 'TRIAL_ATIVO': return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
			case 'ATIVO': return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
			case 'TRIAL_EXPIRADO': return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20';
			case 'CANCELADO': return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20';
			default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20';
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

	<!-- Page Header -->
	<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
		<div class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
				<User class="h-4.5 w-4.5 text-white" />
			</div>
			<div>
				<h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Meu Perfil</h1>
				<p class="text-[11px] text-[rgb(var(--slate-400))]">Gerencie suas informações pessoais e de segurança</p>
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
						onclick={() => activeTab = tab.id}
						class="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
							{activeTab === tab.id
								? 'bg-slate-100 text-slate-900'
								: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}"
					>
						<Icon class="w-4 h-4 shrink-0 transition-colors {activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}" />
						{tab.label}
					</button>
				{/each}
			</nav>
		</aside>

		<!-- Conteúdo da tab ativa -->
		<div class="flex-1 w-full">
			{#if activeTab === 'conta'}
				<div class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100">
					<!-- Seção Nome -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Nome</p>
							<p class="text-sm text-slate-500 mt-1">Como você quer ser chamado.</p>
						</div>
						<div class="sm:text-right">
							<p class="text-sm font-medium text-slate-900">{data.me?.name || 'Não configurado'}</p>
							<p class="text-xs text-slate-500 mt-1">Gerenciado pela sua conta de login</p>
						</div>
					</div>

					<!-- Seção Email -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Endereço de e-mail</p>
							<p class="text-sm text-slate-500 mt-1">E-mail vinculado à sua conta.</p>
						</div>
						<div class="sm:text-right">
							<p class="text-sm font-medium text-slate-900">{data.me?.email || 'E-mail não encontrado'}</p>
						</div>
					</div>

					<!-- Seção Função -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Função</p>
							<p class="text-sm text-slate-500 mt-1">Seu nível de acesso na organização.</p>
						</div>
						<div class="sm:text-right">
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
								{data.me?.role === 'OWNER' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' : 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20'}">
								{data.me?.role === 'OWNER' ? 'Gestor' : 'Propagandista'}
							</span>
						</div>
					</div>
				</div>

			{:else if activeTab === 'plano'}
				<div class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100">
					<!-- Plano Atual -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Plano Atual</p>
							<p class="text-sm text-slate-500 mt-1">Plano vigente da sua assinatura.</p>
						</div>
						<div class="sm:text-right">
							<p class="text-base font-semibold text-slate-900">
								{#if data.billing?.status === 'TRIAL_ATIVO'}Trial gratuito
								{:else}{getPlanoLabel(data.billing?.plano)}{/if}
							</p>
						</div>
					</div>
					<!-- Status -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Status</p>
							<p class="text-sm text-slate-500 mt-1">Situação atual da sua conta.</p>
						</div>
						<div class="sm:text-right flex flex-col items-start sm:items-end gap-2">
							{#if data.billing?.status === 'TRIAL_ATIVO'}
								<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
									Trial ativo — {data.diasRestantesTrial ?? 0}d restantes
								</span>
							{:else if data.billing?.status === 'ATIVO'}
								<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
									Assinatura ativa
								</span>
							{:else}
								<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusBadge(data.billing?.status)}">
									{getStatusLabel(data.billing?.status)}
								</span>
							{/if}

							{#if data.diasRestantesTrial !== null && data.diasRestantesTrial <= 3}
								<p class="text-xs font-medium text-amber-600 mt-1">
									{#if data.diasRestantesTrial === 0}Seu trial expira hoje!
									{:else if data.diasRestantesTrial === 1}Seu trial expira amanhã.
									{:else}Faltam {data.diasRestantesTrial} dias para expirar.{/if}
								</p>
							{/if}
						</div>
					</div>
					<!-- Ação -->
					<div class="p-6 bg-slate-50/50 rounded-b-xl flex justify-end">
						<a href="/planos" class="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-900 shadow-sm">
							Gerenciar plano
						</a>
					</div>
				</div>

			{:else if activeTab === 'organizacao'}
				<div class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100">
					<!-- Nome -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Nome</p>
							<p class="text-sm text-slate-500 mt-1">Nome da sua organização.</p>
						</div>
						<div class="sm:text-right">
							<p class="text-sm font-medium text-slate-900">{data.org?.nome || 'Organização individual'}</p>
						</div>
					</div>
					<!-- ID -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">ID da Organização</p>
							<p class="text-sm text-slate-500 mt-1">Identificador único interno.</p>
						</div>
						<div class="sm:text-right">
							<p class="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{data.org?.id || data.me?.organizationId || 'Não disponível'}</p>
						</div>
					</div>
					<!-- Tipo -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Tipo</p>
							<p class="text-sm text-slate-500 mt-1">Modelo de organização.</p>
						</div>
						<div class="sm:text-right">
							<p class="text-sm font-medium text-slate-900">{data.org?.limiteUsuarios === 1 ? 'Individual' : 'Equipe'}</p>
						</div>
					</div>
					<!-- Membro desde -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Membro desde</p>
							<p class="text-sm text-slate-500 mt-1">Data de ingresso na organização.</p>
						</div>
						<div class="sm:text-right">
							<p class="text-sm text-slate-900">
								{data.org?.createdAt
									? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(data.org.createdAt))
									: '—'}
							</p>
						</div>
					</div>
				</div>

			{:else if activeTab === 'seguranca'}
				<div class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100">
					<!-- Senha -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Senha</p>
							<p class="text-sm text-slate-500 mt-1">Altere sua senha de acesso ao MediVisitas.</p>
						</div>
						<div>
							<button
								onclick={solicitarRedefinicaoSenha}
								class="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-900 shadow-sm w-full sm:w-auto cursor-pointer"
							>
								Alterar senha
							</button>
						</div>
					</div>

					<!-- 2FA -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Autenticação em dois fatores</p>
							<p class="text-sm text-slate-500 mt-1">Adicione uma camada extra de segurança à sua conta.</p>
						</div>
						<div>
							<button
								onclick={configurar2FA}
								class="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-900 shadow-sm w-full sm:w-auto cursor-pointer"
							>
								Configurar
							</button>
						</div>
					</div>

					<!-- Sessão -->
					<div class="p-6 bg-slate-50/50 rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Sessões ativas</p>
							<p class="text-sm text-slate-500 mt-1">
								Navegador atual · {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())}
							</p>
						</div>
					</div>
				</div>

			{:else if activeTab === 'notificacoes'}
				<div class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100">
					<!-- Toggle: Visitas do dia -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Visitas do dia</p>
							<p class="text-sm text-slate-500 mt-1">Lembrete diário das visitas agendadas para hoje.</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer shrink-0">
							<input type="checkbox" checked class="sr-only peer" />
							<div class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
								after:content-[''] after:absolute after:top-0.5 after:left-[2px]
								after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
								after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"></div>
						</label>
					</div>

					<!-- Toggle: Profissionais sem visita -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Profissionais sem visita recente</p>
							<p class="text-sm text-slate-500 mt-1">Alertas de profissionais sem visita há mais de 30 dias.</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer shrink-0">
							<input type="checkbox" checked class="sr-only peer" />
							<div class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
								after:content-[''] after:absolute after:top-0.5 after:left-[2px]
								after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
								after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"></div>
						</label>
					</div>

					<!-- Toggle: Agendamentos não realizados -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Agendamentos não realizados</p>
							<p class="text-sm text-slate-500 mt-1">Alertas de agendamentos vencidos sem registro de visita.</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer shrink-0">
							<input type="checkbox" checked class="sr-only peer" />
							<div class="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-slate-200
								after:content-[''] after:absolute after:top-0.5 after:left-[2px]
								after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
								after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shadow-sm border border-slate-200 peer-checked:border-blue-600"></div>
						</label>
					</div>

					<!-- Link para histórico -->
					<div class="p-6 bg-slate-50/50 rounded-b-xl flex justify-end">
						<a href="/dashboard/notificacoes" class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
							Ver histórico completo &rarr;
						</a>
					</div>
				</div>

			{:else if activeTab === 'preferencias'}
				<div class="w-full bg-white rounded-xl shadow-sm ring-1 ring-slate-200 divide-y divide-slate-100">
					<!-- Tour -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Tutorial de boas-vindas</p>
							<p class="text-sm text-slate-500 mt-1">Rever o guia passo a passo do primeiro acesso ao dashboard.</p>
						</div>
						<div>
							<Button variant="outline" size="sm" onclick={reverTour} disabled={resetingTour}>
								<RotateCcw class="w-3.5 h-3.5 mr-1.5" />
								{resetingTour ? 'Resetando...' : 'Rever Tour'}
							</Button>
						</div>
					</div>

					<!-- Lembretes automáticos -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
						<div>
							<p class="text-sm font-medium text-slate-900">Lembretes automáticos</p>
							<p class="text-sm text-slate-500 mt-1">Gerados diariamente às 06h com base na sua agenda.</p>
						</div>
						<div class="sm:text-right">
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
								Ativos
							</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
