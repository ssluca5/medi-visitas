<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		Plus,
		ChevronLeft,
		ChevronRight,
		ArrowRight,
		ArrowLeft,
		Power,
		Play,
		Trash2,
		Users,
		Search,
		MapPin,
		Phone,
		X,
		Loader2,
		Eye,
		Calendar,
		Clock,
		Package
	} from 'lucide-svelte';
	import { apiFetch } from '$lib/api';
	import { toasts } from '$lib/stores/toast.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Sheet from '$lib/components/ui/Sheet.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
	import type {
		Profissional,
		ProfissionalFormData,
		PaginationInfo,
		EstagioPipeline,
		PotencialPrescricao,
		ClassificacaoRelacionamento,
		SubEspecialidade,
		ContatoTipo,
		Visita
	} from '$lib/types';

	interface Props {
		data: { sessionToken: string | null; profissionais?: any; especialidades?: any[] };
	}

	let { data }: Props = $props();

	function normalizeList<T>(value: unknown): T[] {
		if (Array.isArray(value)) return value;
		if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
			return (value as { data: T[] }).data;
		}
		return [];
	}

	// ── Estado ──
	let profissionais = $state<Profissional[]>(untrack(() => data.profissionais?.data ?? []));
	let pagination = $state<PaginationInfo>(
		untrack(() =>
			data.profissionais
				? { page: data.profissionais.page ?? 1, pageSize: data.profissionais.pageSize ?? 20, total: data.profissionais.total ?? 0, totalPages: data.profissionais.totalPages ?? 0 }
				: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
		),
	);
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Filtros
	let filtroBusca = $state('');
	let filtroPotencial = $state('');
	let filtroEstagio = $state('');
	let filtroClassificacao = $state('');

	let temFiltrosAtivos = $derived(
		!!filtroBusca || !!filtroPotencial || !!filtroEstagio || !!filtroClassificacao
	);

	// Total real de profissionais cadastrados (sem filtros)
	let totalCadastrados = $state(untrack(() => data.profissionais?.total ?? 0));

	function limparFiltros() {
		filtroBusca = '';
		filtroPotencial = '';
		filtroEstagio = '';
		filtroClassificacao = '';
		fetchProfissionais(1);
	}

	// Sheet
	let sheetOpen = $state(false);
	let profissionalEmEdicao = $state<ProfissionalFormData | null>(null);
	let profissionalAtual = $state<Profissional | null>(null);
	let especialidades = $state<Array<{ id: string; nome: string; categoria: string }>>(
		untrack(() => normalizeList(data.especialidades))
	);
	let subEspecialidades = $state<SubEspecialidade[]>([]);

	// Delete dialog
	let deleteConfirmOpen = $state(false);
	let profToDelete = $state<Profissional | null>(null);

	// Form fields
	let formNome = $state('');
	let formNomeError = $state(false);
	let formCrm = $state('');
	let formEmail = $state('');
	let formTelefone = $state('');
	let formPotencial = $state<PotencialPrescricao | ''>('');
	let formEstagio = $state<EstagioPipeline>('PROSPECTADO');
	let formEspecialidadeId = $state('');
	let formSubEspecialidadeId = $state('');
	let formClassificacao = $state('');

	// Endereço
	let formCep = $state('');
	let formLogradouro = $state('');
	let formNumero = $state('');
	let formComplemento = $state('');
	let formBairro = $state('');
	let formCidade = $state('');
	let formEstado = $state('');
	let buscandoCep = $state(false);

	// Contatos adicionais
	let formContatos = $state<Array<{ tipo: ContatoTipo; valor: string; observacao: string }>>([]);

	// Novos campos (legado FórmulaCerta)
	let formCpfCnpj = $state('');
	let formSexo = $state('NAO_INFORMADO');
	let formDataNascimento = $state('');
	let formTratamento = $state('');
	let formObservacoes = $state('');
	let formNomeConjuge = $state('');
	let formDataNascConjuge = $state('');
	let formProfissionalValido = $derived(!!formNome.trim());

	// Modal de consulta rápida
	let profissionalConsulta = $state<Profissional | null>(null);
	let consultaOpen = $state(false);
	let consultaTab = $state<'dados' | 'visitas'>('dados');
	let visitasDoProfissional = $state<Visita[]>([]);
	let loadingVisitas = $state(false);

	async function loadVisitasProfissional(profissionalId: string) {
		loadingVisitas = true;
		try {
			const res = await apiFetch(`/visitas?profissionalId=${profissionalId}&pageSize=20`, data.sessionToken);
			if (res.ok) {
				const json = await res.json();
				visitasDoProfissional = json.data || json;
			}
		} catch (e) {
			console.error('Erro ao carregar visitas:', e);
			visitasDoProfissional = [];
		} finally {
			loadingVisitas = false;
		}
	}

	// ── ViaCEP ──
	async function buscarCep() {
		const cepLimpo = formCep.replace(/\D/g, '');
		if (cepLimpo.length !== 8) return;

		buscandoCep = true;
		try {
			const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
			if (!res.ok) return;
			const data = await res.json();
			if (data.erro) {
				toasts.show('error', 'CEP não encontrado');
				return;
			}
			formLogradouro = data.logradouro || '';
			formBairro = data.bairro || '';
			formCidade = data.localidade || '';
			formEstado = data.uf || '';
		} catch {
			toasts.show('error', 'Erro ao buscar CEP');
		} finally {
			buscandoCep = false;
		}
	}

	function adicionarContato() {
		formContatos = [...formContatos, { tipo: 'TELEFONE', valor: '', observacao: '' }];
	}

	function removerContato(idx: number) {
		formContatos = formContatos.filter((_, i) => i !== idx);
	}

	// ── Badge helpers ──
	const potencialConfig: Record<PotencialPrescricao, { label: string; class: string }> = {
		ALTO: { label: 'Alto', class: 'bg-emerald-50 text-emerald-700' },
		MEDIO: { label: 'Médio', class: 'bg-amber-50 text-amber-700' },
		BAIXO: { label: 'Baixo', class: 'bg-red-50 text-red-600' },
		ESTRATEGICO: { label: 'Estratégico', class: 'bg-violet-50 text-violet-700' }
	};

	const estagioConfig: Record<EstagioPipeline, { label: string; class: string }> = {
		PROSPECTADO: { label: 'Prospectado', class: 'bg-[rgb(var(--slate-100))] text-ui-secondary' },
		VISITADO: { label: 'Visitado', class: 'bg-blue-50 text-blue-700' },
		INTERESSADO: { label: 'Interessado', class: 'bg-purple-50 text-purple-700' },
		PRESCRITOR: { label: 'Prescritor', class: 'bg-emerald-50 text-emerald-700' },
		FIDELIZADO: { label: 'Fidelizado', class: 'bg-amber-50 text-amber-700' }
	};

	const classificacaoConfig: Record<ClassificacaoRelacionamento, { label: string; class: string }> = {
		FORTE: { label: 'Forte', class: 'bg-emerald-50 text-emerald-700' },
		INTERMEDIARIO: { label: 'Intermediário', class: 'bg-amber-50 text-amber-700' },
		FRACO: { label: 'Fraco', class: 'bg-red-50 text-red-600' }
	};

	const estagios: EstagioPipeline[] = ['PROSPECTADO', 'VISITADO', 'INTERESSADO', 'PRESCRITOR', 'FIDELIZADO'];

	// ── Especialidades agrupadas por categoria ──
	let especialidadesAgrupadas = $derived(
		normalizeList<{ id: string; nome: string; categoria: string }>(especialidades).reduce(
			(acc, esp) => {
				const cat = esp.categoria;
				if (!acc[cat]) acc[cat] = [];
				acc[cat].push(esp);
				return acc;
			},
			{} as Record<string, typeof especialidades>
		)
	);

	let categoriasOrdenadas = $derived(
		Object.keys(especialidadesAgrupadas).sort((a, b) =>
			a.toLowerCase().localeCompare(b.toLowerCase())
		)
	);

	// ── Fetch subespecialidades quando muda especialidade no form ──
	$effect(() => {
		const espId = formEspecialidadeId;
		if (!espId) {
			subEspecialidades = [];
			formSubEspecialidadeId = '';
			return;
		}
		fetchSubEspecialidades(espId);
	});

	async function fetchSubEspecialidades(especialidadeId: string) {
		// Proteção contra perdas de estado pelo bind:value no Svelte 5 devido ao DOM delay de option render
		const oldSubId = formSubEspecialidadeId;
		try {
			const response = await apiFetch(`/especialidades/${especialidadeId}/subespecialidades`, data.sessionToken);
			if (response.ok) {
				const json = await response.json();
				subEspecialidades = json.data || [];
			} else {
				subEspecialidades = [];
			}
		} catch {
			subEspecialidades = [];
		}

		// Assim que os dados voltam, repomos o valor se ele existir na nova lista.
		// Isso trata o problema do select apagar o formSubEspecialidadeId na abertura de edição ou clear num usuário manual
		if (!subEspecialidades.some(s => s.id === oldSubId)) {
			formSubEspecialidadeId = '';
		} else {
			// Seta dinamicamente pro ciclo de atualização de bind do Svelte preencher certinho a UI logo atrás.
			setTimeout(() => { formSubEspecialidadeId = oldSubId; }, 0);
		}
	}

	// ── Fetch ──
	let isFetchingData = false;
	async function fetchProfissionais(page: number = 1) {
		if (isFetchingData) return;
		isFetchingData = true;
		loading = true;
		error = null;

		try {
			const params = new URLSearchParams({ page: page.toString(), pageSize: pagination.pageSize.toString() });
			if (filtroBusca) params.append('busca', filtroBusca);
			if (filtroPotencial) params.append('potencial', filtroPotencial);
			if (filtroEstagio) params.append('estagioPipeline', filtroEstagio);
			if (filtroClassificacao) params.append('classificacao', filtroClassificacao);

			const response = await apiFetch(`/profissionais?${params}`, data.sessionToken);
			if (!response.ok) throw new Error('Erro ao carregar profissionais');

			const json = await response.json();
			profissionais = json.data ?? json;
			
			if (json.pagination) {
				pagination = json.pagination;
				// Atualiza total cadastrados apenas quando não há filtros
				if (!temFiltrosAtivos) {
					totalCadastrados = json.pagination.total;
				}
			}

		} catch (err) {
			error = err instanceof Error ? err.message : 'Erro desconhecido';
		} finally {
			loading = false;
			isFetchingData = false;
		}
	}

	async function fetchEspecialidades() {
		try {
			const response = await apiFetch('/especialidades', data.sessionToken);
			if (response.ok) {
				const json = await response.json();
				especialidades = normalizeList(json);
			}
		} catch {
			especialidades = [];
		}
	}

	onMount(() => {
		if (especialidades.length === 0) void fetchEspecialidades();
	});

	// ── Auto-open edit Sheet when navigated from profile "Editar Cadastro" ──
	let editIdFromUrl = $derived($page.url.searchParams.get('editId'));
	let editAutoOpened = $state(false);

	$effect(() => {
		const eid = editIdFromUrl;
		if (!eid || editAutoOpened || profissionais.length === 0) return;
		editAutoOpened = true;
		const prof = profissionais.find(p => p.id === eid);
		if (prof) {
			handleEditarProfissional(prof);
			// Clean the URL param so refreshing doesn't re-open
			goto('/dashboard/profissionais', { replaceState: true, keepFocus: true });
		}
	});

	// ── Ações ──
	function handleNovoProfissional() {
		profissionalEmEdicao = null;
		profissionalAtual = null;
		formNome = '';
		formCrm = '';
		formEmail = '';
		formTelefone = '';
		formPotencial = '';
		formEstagio = 'PROSPECTADO';
		formEspecialidadeId = '';
		formSubEspecialidadeId = '';
		formClassificacao = '';
		formCep = '';
		formLogradouro = '';
		formNumero = '';
		formComplemento = '';
		formBairro = '';
		formCidade = '';
		formEstado = '';
		formContatos = [];
		formCpfCnpj = '';
		formSexo = 'NAO_INFORMADO';
		formDataNascimento = '';
		formTratamento = '';
		formObservacoes = '';
		formNomeConjuge = '';
		formDataNascConjuge = '';
		sheetOpen = true;
	}

	function handleEditarProfissional(prof: Profissional) {
		profissionalAtual = prof;
		profissionalEmEdicao = {
			id: prof.id,
			nome: prof.nome,
			crm: prof.crm || '',
			email: prof.email || '',
			telefone: prof.telefone || '',
			potencial: prof.potencial,
			estagioPipeline: prof.estagioPipeline,
			especialidadeId: prof.especialidadeId || '',
			subEspecialidadeId: prof.subEspecialidade?.id || '',
			classificacao: prof.classificacao || '',
			endereco: {
				logradouro: prof.endereco?.logradouro || '',
				numero: prof.endereco?.numero || '',
				complemento: prof.endereco?.complemento || '',
				bairro: prof.endereco?.bairro || '',
				cidade: prof.endereco?.cidade || '',
				estado: prof.endereco?.estado || '',
				cep: prof.endereco?.cep || ''
			},
			contatos: prof.contatos.map((c) => ({ tipo: c.tipo, valor: c.valor, observacao: c.observacao || '' }))
		};
		formNome = prof.nome;
		formCrm = prof.crm || '';
		formEmail = prof.email || '';
		formTelefone = prof.telefone || '';
		formPotencial = prof.potencial;
		formEstagio = prof.estagioPipeline;
		formEspecialidadeId = prof.especialidadeId || '';
		formSubEspecialidadeId = prof.subEspecialidade?.id || '';
		formClassificacao = prof.classificacao || '';
		formCep = prof.endereco?.cep || '';
		formLogradouro = prof.endereco?.logradouro || '';
		formNumero = prof.endereco?.numero || '';
		formComplemento = prof.endereco?.complemento || '';
		formBairro = prof.endereco?.bairro || '';
		formCidade = prof.endereco?.cidade || '';
		formEstado = prof.endereco?.estado || '';
		formContatos = prof.contatos?.map(c => ({
			tipo: c.tipo,
			valor: c.valor,
			observacao: c.observacao || ''
		})) ?? [];
		formCpfCnpj = prof.cpfCnpj ?? '';
		formSexo = prof.sexo ?? 'NAO_INFORMADO';
		formDataNascimento = prof.dataNascimento
			? prof.dataNascimento.split('T')[0] : '';
		formTratamento = prof.tratamento ?? '';
		formObservacoes = prof.observacoes ?? '';
		formNomeConjuge = prof.nomeConjuge ?? '';
		formDataNascConjuge = prof.dataNascConjuge
			? prof.dataNascConjuge.split('T')[0] : '';
		sheetOpen = true;
	}

	async function handleSalvarProfissional() {
		formNomeError = false;
		if (!formNome.trim()) {
			formNomeError = true;
			toasts.show('error', 'O nome do profissional é obrigatório.');
			document.getElementById('prof-nome')?.focus();
			return;
		}

		// Montar endereço (só envia se pelo menos um campo tiver valor)
		const endObj = {
			cep: formCep.trim() || undefined,
			logradouro: formLogradouro.trim() || undefined,
			numero: formNumero.trim() || undefined,
			complemento: formComplemento.trim() || undefined,
			bairro: formBairro.trim() || undefined,
			cidade: formCidade.trim() || undefined,
			estado: formEstado.trim() || undefined
		};
		const temEndereco = Object.values(endObj).some(v => v !== undefined);

		// Montar contatos (filtrar vazios)
		const contatosLimpos = formContatos
			.filter(c => c.valor.trim())
			.map(c => ({
				tipo: c.tipo,
				valor: c.valor.trim(),
				observacao: c.observacao.trim() || undefined
			}));

		const apiData: Record<string, unknown> = {
			nome: formNome.trim(),
			crm: formCrm.trim() || undefined,
			email: formEmail.trim() || undefined,
			telefone: formTelefone.trim() || undefined,
			potencial: formPotencial || undefined,
			estagioPipeline: formEstagio,
			especialidadeId: formEspecialidadeId || undefined,
			subEspecialidadeId: formSubEspecialidadeId || undefined,
			classificacao: formClassificacao || undefined,
			cpfCnpj: formCpfCnpj.trim() || undefined,
			sexo: formSexo || undefined,
			dataNascimento: formDataNascimento
				? new Date(formDataNascimento).toISOString() : undefined,
			tratamento: formTratamento || undefined,
			observacoes: formObservacoes.trim() || undefined,
			nomeConjuge: formNomeConjuge.trim() || undefined,
			dataNascConjuge: formDataNascConjuge
				? new Date(formDataNascConjuge).toISOString() : undefined,
			endereco: temEndereco ? endObj : undefined,
			contatos: contatosLimpos.length > 0 ? contatosLimpos : undefined
		};

		Object.keys(apiData).forEach((key) => {
			if (apiData[key] === undefined) delete apiData[key];
		});

		// Especial tratamento para envio de um subEspecialidade e similares vazios
		if (!formSubEspecialidadeId) {
			apiData.subEspecialidadeId = null;
		}
		if (!formEspecialidadeId) {
			apiData.especialidadeId = null;
		}
		if (!formClassificacao) {
			apiData.classificacao = null;
		}

		const url = profissionalEmEdicao?.id
			? `/profissionais/${profissionalEmEdicao.id}`
			: '/profissionais';
		const method = profissionalEmEdicao?.id ? 'PUT' : 'POST';

		try {
			const response = await apiFetch(url, data.sessionToken, {
				method,
				body: JSON.stringify(apiData)
			});
			if (!response.ok) {
				const errBody = await response.json().catch(() => null);
				const msg = errBody?.error || errBody?.message || `Erro ${response.status}`;
				throw new Error(msg);
			}

			const updated: Profissional = await response.json();

			if (profissionalEmEdicao?.id) {
				profissionais = profissionais.map((p) => (p.id === updated.id ? updated : p));
			} else {
				fetchProfissionais(pagination.page);
			}

			sheetOpen = false;
			toasts.show('success', profissionalEmEdicao?.id ? 'Profissional atualizado!' : 'Profissional criado!');
		} catch (err) {
			toasts.show('error', err instanceof Error ? err.message : 'Erro ao salvar');
		}
	}

	async function handleAvancarEstagio(prof: Profissional) {
		const idx = estagios.indexOf(prof.estagioPipeline);
		const proximo = estagios[idx + 1];
		if (!proximo) return;

		try {
			const response = await apiFetch(`/profissionais/${prof.id}/estagio`, data.sessionToken, {
				method: 'PATCH',
				body: JSON.stringify({ estagioNovo: proximo })
			});
			if (response.ok) {
				const updated: Profissional = await response.json();
				profissionais = profissionais.map((p) => (p.id === updated.id ? updated : p));
				toasts.show('success', `${prof.nome}: ${estagioConfig[proximo].label}`);
			}
		} catch {
			toasts.show('error', 'Erro ao avançar estágio');
		}
	}

	async function handleRetrocederEstagio(prof: Profissional) {
		const idx = estagios.indexOf(prof.estagioPipeline);
		const anterior = estagios[idx - 1];
		if (!anterior) return;

		try {
			const response = await apiFetch(`/profissionais/${prof.id}/estagio`, data.sessionToken, {
				method: 'PATCH',
				body: JSON.stringify({ estagioNovo: anterior })
			});
			if (response.ok) {
				const updated: Profissional = await response.json();
				profissionais = profissionais.map((p) => (p.id === updated.id ? updated : p));
				toasts.show('success', `${prof.nome}: ${estagioConfig[anterior].label}`);
			}
		} catch {
			toasts.show('error', 'Erro ao retroceder estágio');
		}
	}

	async function handleToggleAtivo(prof: Profissional) {
		const isAtivo = !prof.deletedAt;

		try {
			const response = await apiFetch(`/profissionais/${prof.id}/ativo`, data.sessionToken, {
				method: 'PATCH',
				body: JSON.stringify({ ativo: !isAtivo })
			});
			if (response.ok) {
				const updated: Profissional = await response.json();
				profissionais = profissionais.map((p) => (p.id === updated.id ? updated : p));
				toasts.show('success', isAtivo ? `"${prof.nome}" inativado.` : `"${prof.nome}" reativado.`);
			}
		} catch {
			toasts.show('error', 'Erro ao alterar status');
		}
	}

	function handleExcluirProfissional(prof: Profissional) {
		profToDelete = prof;
		deleteConfirmOpen = true;
	}

	function handleExcluirProfissionalEditando() {
		if (!profissionalAtual) return;
		handleExcluirProfissional(profissionalAtual);
	}

	async function confirmDeleteProfissional() {
		if (!profToDelete) return;

		const response = await apiFetch(`/profissionais/${profToDelete.id}`, data.sessionToken, {
			method: 'DELETE'
		});
		if (!response.ok) {
			const d = await response.json();
			toasts.show('error', d.error || 'Erro ao excluir');
			deleteConfirmOpen = false;
			return;
		}
		profissionais = profissionais.filter((p) => p.id !== profToDelete!.id);
		pagination.total = pagination.total - 1;
		toasts.show('error', `"${profToDelete.nome}" excluído.`);
		if (profissionalEmEdicao?.id === profToDelete.id) {
			sheetOpen = false;
			profissionalEmEdicao = null;
			profissionalAtual = null;
		}
		deleteConfirmOpen = false;
		profToDelete = null;
	}
</script>

<svelte:head>
	<title>Profissionais — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<div class="page-header">
	<div class="page-header-main">
		<div class="page-header-icon">
			<Users class="h-4.5 w-4.5 text-white" />
		</div>
		<div>
			<h1 class="page-title">Profissionais</h1>
			<p class="page-description">Gerencie o cadastro e a classificação dos médicos.</p>
		</div>
	</div>
	<div class="flex items-center gap-2">
		{#if totalCadastrados > 0 || profissionais.length > 0}
			<Button onclick={handleNovoProfissional} class="inline-flex gap-2">
				<Plus class="h-4 w-4" />
				<span class="hidden sm:inline">Novo Profissional</span>
				<span class="sm:hidden">Novo</span>
			</Button>
		{/if}
	</div>
</div>

<!-- Filters -->
<div class="card-surface p-4 mb-6" role="search" aria-label="Filtros de profissionais">
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class="relative">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ui-muted pointer-events-none" />
			<input
				type="text"
				placeholder="Buscar por nome ou CRM..."
				bind:value={filtroBusca}
				oninput={() => fetchProfissionais(1)}
				aria-label="Buscar profissionais"
				class="input-base !pl-9"
			/>
		</div>
		<select
			bind:value={filtroPotencial}
			onchange={() => fetchProfissionais(1)}
			aria-label="Filtrar por potencial"
			class="input-base"
		>
			<option value="">Todos os potenciais</option>
			<option value="ALTO">Alto</option>
			<option value="MEDIO">Médio</option>
			<option value="BAIXO">Baixo</option>
			<option value="ESTRATEGICO">Estratégico</option>
		</select>
		<select
			bind:value={filtroEstagio}
			onchange={() => fetchProfissionais(1)}
			aria-label="Filtrar por estágio"
			class="input-base"
		>
			<option value="">Todos os estágios</option>
			{#each estagios as est}
				<option value={est}>{estagioConfig[est].label}</option>
			{/each}
		</select>
		<select
			bind:value={filtroClassificacao}
			onchange={() => fetchProfissionais(1)}
			aria-label="Filtrar por classificação"
			class="input-base"
		>
			<option value="">Todas as classificações</option>
			<option value="FORTE">Forte</option>
			<option value="INTERMEDIARIO">Intermediário</option>
			<option value="FRACO">Fraco</option>
		</select>
	</div>
</div>

<!-- Table -->
{#if loading}
	<div class="card-surface flex items-center justify-center py-20" role="status" aria-live="polite">
		<div class="flex flex-col items-center gap-3">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-[rgb(var(--slate-200))] border-t-blue-600" aria-hidden="true"></div>
			<span class="text-muted-standard">Carregando profissionais...</span>
		</div>
	</div>
{:else if error}
	<div class="card-surface flex flex-col items-center justify-center py-20 gap-4">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
			<Users class="h-6 w-6 text-red-400" />
		</div>
		<div class="text-center">
			<p class="table-cell-primary">Erro ao carregar</p>
			<p class="table-cell-secondary mt-1">{error}</p>
		</div>
		<Button variant="outline" size="sm" onclick={() => fetchProfissionais(1)}>
			Tentar novamente
		</Button>
	</div>
{:else if profissionais.length === 0 && temFiltrosAtivos}
	<div class="card-surface py-12 flex flex-col items-center justify-center text-center">
		<p class="text-muted-standard">Nenhum profissional encontrado com esses filtros.</p>
		<Button class="mt-4" variant="outline" onclick={limparFiltros}>Limpar Filtros</Button>
	</div>
{:else if profissionais.length === 0}
	<EmptyState
		icon={Users}
		titulo="Nenhum profissional cadastrado"
		descricao="Cadastre seu primeiro profissional para começar."
	>
		<Button onclick={handleNovoProfissional} class="inline-flex gap-2">
			<Plus class="h-4 w-4" />
			<span class="hidden sm:inline">Novo Profissional</span>
			<span class="sm:hidden">Novo</span>
		</Button>
	</EmptyState>
{:else}
	<div class="space-y-3 md:hidden">
		{#each profissionais as prof (prof.id)}
			{@const isAtivo = !prof.deletedAt}
			<article
				class="rounded-xl border border-[rgb(var(--slate-200))] bg-white p-4 shadow-sm transition-colors active:bg-[rgb(var(--slate-50))]"
				class:opacity-60={!isAtivo}
			>
				<button
					type="button"
					class="w-full text-left"
					onclick={() => handleEditarProfissional(prof)}
				>
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm"
							class:bg-blue-600={isAtivo}
							class:text-white={isAtivo}
							class:bg-[rgb(var(--slate-200))]={!isAtivo}
							class:text-ui-muted={!isAtivo}
						>
							{prof.nome.charAt(0).toUpperCase()}
						</div>
						<div class="min-w-0 flex-1">
							<p class="table-cell-primary truncate">{prof.nome}</p>
							<p class="table-cell-secondary truncate">{prof.crm || 'Sem CRM'}</p>
							<p class="mt-1 text-xs text-ui-secondary truncate">
								{prof.especialidade?.nome || 'Sem especialidade'}
								{#if prof.subEspecialidade?.nome}
									<span> · {prof.subEspecialidade.nome}</span>
								{/if}
							</p>
						</div>
					</div>

					<div class="mt-3 flex flex-wrap gap-2">
						<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium {potencialConfig[prof.potencial]?.class ?? 'bg-[rgb(var(--slate-100))] text-ui-secondary'}">
							{potencialConfig[prof.potencial]?.label ?? prof.potencial}
						</span>
						<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium {estagioConfig[prof.estagioPipeline].class}">
							{estagioConfig[prof.estagioPipeline].label}
						</span>
					</div>
				</button>

				<div class="mt-3 flex items-center justify-end gap-1 border-t border-[rgb(var(--slate-100))] pt-3">
					<button
						onclick={() => { profissionalConsulta = prof; consultaTab = 'dados'; consultaOpen = true; }}
						aria-label="Ver detalhes de {prof.nome}"
						title="Ver detalhes"
						class="row-action hover:text-blue-600"
					>
						<Eye class="w-3.5 h-3.5" />
					</button>
					<a
						href={`/dashboard/profissionais/${prof.id}`}
						aria-label="Agenda e visitas de {prof.nome}"
						title="Agenda / Visitas"
						class="row-action hover:text-emerald-600"
					>
						<Calendar class="w-3.5 h-3.5" />
					</a>
					<button
						onclick={() => handleAvancarEstagio(prof)}
						disabled={prof.estagioPipeline === 'FIDELIZADO' || !isAtivo}
						aria-label="Avançar estágio de {prof.nome}"
						title="Avançar estágio"
						class="row-action disabled:opacity-20 disabled:cursor-not-allowed"
					>
						<ArrowRight class="w-3.5 h-3.5" />
					</button>
					<button
						onclick={() => handleToggleAtivo(prof)}
						aria-label={isAtivo ? `Inativar ${prof.nome}` : `Ativar ${prof.nome}`}
						title={isAtivo ? 'Inativar' : 'Ativar'}
						class="row-action {isAtivo ? 'hover:text-amber-600' : 'hover:text-green-600'}"
					>
						{#if isAtivo}
							<Power class="w-3.5 h-3.5" />
						{:else}
							<Play class="w-3.5 h-3.5" />
						{/if}
					</button>
					<button
						onclick={() => handleExcluirProfissional(prof)}
						aria-label="Excluir {prof.nome}"
						title="Excluir"
						class="row-action hover:text-red-600"
					>
						<Trash2 class="w-3.5 h-3.5" />
					</button>
				</div>
			</article>
		{/each}
	</div>

	<div class="table-shell hidden md:block">
		<table class="data-table" aria-label="Lista de profissionais">
			<thead>
				<tr>
					<th class="table-head-cell text-left w-[24%]">Nome</th>
					<th class="table-head-cell text-center w-[18%]">Especialidade</th>
					<th class="table-head-cell text-center w-[16%]">Subespecialidade</th>
					<th class="table-head-cell text-center w-[12%]">Potencial</th>
					<th class="table-head-cell text-center w-[12%]">Estágio</th>
					<th class="table-head-cell text-center w-[18%]">Ações</th>
				</tr>
			</thead>
			<tbody>
				{#each profissionais as prof (prof.id)}
					{@const isAtivo = !prof.deletedAt}
					<tr
						class="group border-t border-[rgb(var(--slate-50))] transition-all duration-200 cursor-pointer hover:bg-[rgb(var(--slate-50))]/60"
						class:opacity-50={!isAtivo}
						onclick={() => handleEditarProfissional(prof)}
					>
						<td class="table-cell">
							<div class="flex items-center gap-3">
								<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm"
									class:bg-blue-600={isAtivo}
									class:from-blue-500={isAtivo}
									class:to-indigo-600={isAtivo}
									class:text-white={isAtivo}
									class:bg-[rgb(var(--slate-200))]={!isAtivo}
									class:text-ui-muted={!isAtivo}
								>
									{prof.nome.charAt(0).toUpperCase()}
								</div>
								<div class="min-w-0">
									<p class="table-cell-primary truncate" class:text-ui-primary={isAtivo} class:text-ui-muted={!isAtivo}>
										{prof.nome}
									</p>
									<p class="table-cell-secondary truncate" class:text-ui-muted={isAtivo} class:text-ui-disabled={!isAtivo}>
										{prof.crm || 'Sem CRM'}
									</p>
								</div>
							</div>
						</td>
						<td class="table-cell text-center">
							<span class="table-cell-primary truncate block">{prof.especialidade?.nome || '—'}</span>
						</td>
						<td class="table-cell text-center">
							<span class="text-muted-standard truncate block">
								{prof.subEspecialidade?.nome || '-'}
							</span>
						</td>
						<td class="table-cell text-center">
							<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium {potencialConfig[prof.potencial]?.class ?? 'bg-[rgb(var(--slate-100))] text-ui-secondary'}">
								{potencialConfig[prof.potencial]?.label ?? prof.potencial}
							</span>
						</td>
						<td class="table-cell text-center">
							<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium {estagioConfig[prof.estagioPipeline].class}">
								{estagioConfig[prof.estagioPipeline].label}
							</span>
						</td>
						<td class="table-cell">
							<div class="flex justify-center items-center gap-0.5">
								<button
									onclick={(e) => { e.stopPropagation(); profissionalConsulta = prof; consultaTab = 'dados'; consultaOpen = true; }}
									aria-label="Ver detalhes de {prof.nome}"
									title="Ver detalhes"
									class="row-action hover:text-blue-600"
								>
									<Eye class="w-3.5 h-3.5" />
								</button>
								<a
									href={`/dashboard/profissionais/${prof.id}`}
									onclick={(e) => e.stopPropagation()}
									aria-label="Agenda e visitas de {prof.nome}"
									title="Agenda / Visitas"
									class="row-action hover:text-emerald-600"
								>
									<Calendar class="w-3.5 h-3.5" />
								</a>
								<button
									onclick={(e) => { e.stopPropagation(); handleRetrocederEstagio(prof); }}
									disabled={prof.estagioPipeline === 'PROSPECTADO' || !isAtivo}
									aria-label="Retroceder estágio de {prof.nome}"
									title="Retroceder estágio"
									class="row-action disabled:opacity-20 disabled:cursor-not-allowed"
								>
									<ArrowLeft class="w-3.5 h-3.5" />
								</button>
								<button
									onclick={(e) => { e.stopPropagation(); handleAvancarEstagio(prof); }}
									disabled={prof.estagioPipeline === 'FIDELIZADO' || !isAtivo}
									aria-label="Avançar estágio de {prof.nome}"
									title="Avançar estágio"
									class="row-action disabled:opacity-20 disabled:cursor-not-allowed"
								>
									<ArrowRight class="w-3.5 h-3.5" />
								</button>
								<button
									onclick={(e) => { e.stopPropagation(); handleToggleAtivo(prof); }}
									aria-label={isAtivo ? `Inativar ${prof.nome}` : `Ativar ${prof.nome}`}
									title={isAtivo ? 'Inativar' : 'Ativar'}
									class="row-action {isAtivo ? 'hover:text-amber-600' : 'hover:text-green-600'}"
								>
									{#if isAtivo}
										<Power class="w-3.5 h-3.5" />
									{:else}
										<Play class="w-3.5 h-3.5" />
									{/if}
								</button>
								<button
									onclick={(e) => { e.stopPropagation(); handleExcluirProfissional(prof); }}
									aria-label="Excluir {prof.nome}"
									title="Excluir"
									class="row-action hover:text-red-600"
								>
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if pagination.totalPages > 1}
		<nav aria-label="Paginação de profissionais" class="mt-4 flex items-center justify-between">
			<p class="table-cell-secondary" aria-live="polite">
				Página {pagination.page} de {pagination.totalPages} · {pagination.total} total
			</p>
			<div class="flex gap-1.5">
				<Button variant="outline" size="sm" onclick={() => fetchProfissionais(pagination.page - 1)} disabled={pagination.page <= 1} aria-label="Página anterior">
					<ChevronLeft class="h-4 w-4" />
				</Button>
				<Button variant="outline" size="sm" onclick={() => fetchProfissionais(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} aria-label="Próxima página">
					<ChevronRight class="h-4 w-4" />
				</Button>
			</div>
		</nav>
	{/if}
{/if}

<!-- Sheet de Criação/Edição -->
<Sheet bind:open={sheetOpen} onclose={() => (sheetOpen = false)}>
	{#snippet children()}
		<div class="space-y-5">
			<!-- Header -->
			<div>
				<h3 class="text-lg font-semibold text-ui-primary">
					{profissionalEmEdicao ? 'Editar Profissional' : 'Novo Profissional'}
				</h3>
				<p class="text-sm text-ui-muted mt-1">
					{profissionalEmEdicao ? 'Atualize os dados abaixo' : 'Preencha os dados para cadastrar'}
				</p>
			</div>

			<!-- ═══ SEÇÃO 1: Dados Básicos ═══ -->
			<section>
				<h4 class="section-header">
					<Users class="h-3.5 w-3.5" />
					Dados Básicos
				</h4>

				<div class="space-y-3">
					<!-- Tratamento + Nome (30/70) -->
					<div class="grid gap-3" style="grid-template-columns: 30% 1fr">
						<div>
							<label for="prof-tratamento" class="input-label">Tratamento</label>
							<select id="prof-tratamento" bind:value={formTratamento} class="input-base">
								<option value="">Nenhum</option>
								<option value="DR">Dr.</option>
								<option value="DRA">Dra.</option>
								<option value="PROF">Prof.</option>
								<option value="PROFA">Profa.</option>
								<option value="SR">Sr.</option>
								<option value="SRA">Sra.</option>
							</select>
						</div>
						<div>
							<label for="prof-nome" class="input-label">Nome completo *</label>
							<input id="prof-nome" type="text" bind:value={formNome} class="input-base {formNomeError ? 'input-error' : ''}" placeholder="João Silva" oninput={() => formNomeError = false} />
							{#if formNomeError}<p class="input-error-msg">Nome é obrigatório</p>{/if}
						</div>
					</div>

					<!-- CPF/CNPJ -->
					<div>
						<label for="prof-cpfcnpj" class="input-label">CPF/CNPJ</label>
						<input id="prof-cpfcnpj" type="text" bind:value={formCpfCnpj} class="input-base" placeholder="000.000.000-00" />
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="prof-crm" class="input-label">CRM</label>
							<input id="prof-crm" type="text" bind:value={formCrm} class="input-base" placeholder="123456" />
							<p class="text-xs text-ui-muted mt-1">Registro profissional</p>
						</div>
						<div>
							<label for="prof-crm-uf" class="input-label">UF do CRM</label>
							<input id="prof-crm-uf" type="text" bind:value={formEstado} class="input-base" placeholder="SP" maxlength={2} />
							<p class="text-xs text-ui-muted mt-1">Estado do registro</p>
						</div>
					</div>

					<!-- Sexo + Data de Nascimento -->
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="prof-sexo" class="input-label">Sexo</label>
							<select id="prof-sexo" bind:value={formSexo} class="input-base">
								<option value="NAO_INFORMADO">Não informado</option>
								<option value="MASCULINO">Masculino</option>
								<option value="FEMININO">Feminino</option>
							</select>
						</div>
						<div>
							<label for="prof-nascimento" class="input-label">Data de Nascimento</label>
							<input id="prof-nascimento" type="date" bind:value={formDataNascimento} class="input-base" />
						</div>
					</div>

					<!-- Data de Cadastro (read-only) -->
					<div>
						<label for="prof-cadastro" class="input-label">Data de Cadastro</label>
						<input
							id="prof-cadastro"
							type="date"
							value={profissionalEmEdicao?.id
								? (profissionais.find(p => p.id === profissionalEmEdicao?.id)?.createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0])
								: new Date().toISOString().split('T')[0]}
							disabled
							class="input-base opacity-60 cursor-not-allowed"
						/>
						<p class="text-xs text-ui-muted mt-1">Preenchido automaticamente</p>
					</div>
				</div>
			</section>

			<!-- ═══ SEÇÃO 2: Contato ═══ -->
			<section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6">
				<h4 class="section-header">
					<Phone class="h-3.5 w-3.5" />
					Contato
				</h4>

				<div class="space-y-3">
					<div>
						<label for="prof-tel" class="input-label">Telefone</label>
						<input id="prof-tel" type="text" bind:value={formTelefone} class="input-base" placeholder="(11) 99999-0000" />
					</div>
					<div>
						<label for="prof-email" class="input-label">E-mail</label>
						<input id="prof-email" type="email" bind:value={formEmail} class="input-base" placeholder="email@exemplo.com" />
					</div>

					<!-- Contatos Adicionais -->
					<div class="mt-2">
						<div class="flex items-center justify-between mb-2">
							<span class="text-xs font-medium text-ui-secondary">Contatos adicionais</span>
							<button
								onclick={adicionarContato}
								type="button"
								class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 will-change-transform transition-all duration-200 cursor-pointer hover:-translate-y-[1px] active:scale-[0.98]"
							>
								<Plus class="h-3.5 w-3.5" />
								Adicionar
							</button>
						</div>

						{#if formContatos.length === 0}
							<p class="text-xs text-ui-muted italic py-2">Nenhum contato adicional cadastrado</p>
						{:else}
							<div class="space-y-2.5">
								{#each formContatos as contato, idx}
									<div class="relative rounded-lg border border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))]/50 p-3 transition-all duration-200 hover:border-[rgb(var(--slate-300))]">
										<button
											onclick={() => removerContato(idx)}
											type="button"
											title="Remover contato"
											class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
										>
											<X class="h-3 w-3" />
										</button>

										<div class="space-y-2">
											<div class="w-full">
												<label for="contato-tipo-{idx}" class="input-label text-[10px]">Tipo</label>
												<select id="contato-tipo-{idx}" bind:value={contato.tipo} class="input-base text-xs w-full">
													<option value="TELEFONE">Telefone</option>
													<option value="EMAIL">Email</option>
													<option value="WHATSAPP">WhatsApp</option>
													<option value="OUTRO">Outro</option>
												</select>
											</div>
											<div class="w-full">
												<label for="contato-valor-{idx}" class="input-label text-[10px]">Valor</label>
												<input
													id="contato-valor-{idx}"
													type={contato.tipo === 'EMAIL' ? 'email' : 'text'}
													bind:value={contato.valor}
													class="input-base text-xs w-full"
													placeholder={contato.tipo === 'EMAIL' ? 'email@exemplo.com' : contato.tipo === 'WHATSAPP' ? '(11) 99999-0000' : contato.tipo === 'TELEFONE' ? '(11) 99999-0000' : 'Valor do contato'}
												/>
											</div>
											<div class="w-full">
												<label for="contato-obs-{idx}" class="input-label text-[10px]">Observação</label>
												<textarea id="contato-obs-{idx}" rows={2} bind:value={contato.observacao} class="input-base text-xs resize-none w-full" placeholder="Secretária, horário..."></textarea>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</section>

			<!-- ═══ SEÇÃO 3: Atuação ═══ -->
			<section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6">
				<h4 class="section-header">
					<MapPin class="h-3.5 w-3.5" />
					Atuação
				</h4>

				<div class="space-y-3">
					<!-- Especialidade com optgroup -->
					<div>
						<label for="prof-esp" class="input-label">Especialidade</label>
						<select id="prof-esp" bind:value={formEspecialidadeId} class="input-base">
							<option value="">Selecione a especialidade...</option>
							{#each categoriasOrdenadas as cat}
								<optgroup label={cat}>
									{#each especialidadesAgrupadas[cat] as esp}
										<option value={esp.id}>{esp.nome}</option>
									{/each}
								</optgroup>
							{/each}
						</select>
					</div>

					<!-- Subespecialidade condicional -->
					{#if formEspecialidadeId && subEspecialidades.length > 0}
						<div>
							<label for="prof-sub" class="input-label">Subespecialidade</label>
							<select id="prof-sub" bind:value={formSubEspecialidadeId} class="input-base">
								<option value="">Nenhuma</option>
								{#each subEspecialidades as sub}
									<option value={sub.id}>{sub.nome}</option>
								{/each}
							</select>
						</div>
					{/if}

					<!-- Linha 1: CEP (largura limitada) -->
					<div>
						<label for="prof-cep" class="input-label">CEP</label>
						<div class="relative max-w-xs">
							<input
								id="prof-cep"
								type="text"
								bind:value={formCep}
								onblur={buscarCep}
								class="input-base !pr-8"
								placeholder="01001-000"
								maxlength={9}
							/>
							{#if buscandoCep}
								<div class="absolute right-2 top-1/2 -translate-y-1/2">
									<Loader2 class="h-4 w-4 animate-spin text-ui-muted" />
								</div>
							{/if}
						</div>
						<p class="text-xs text-ui-muted mt-1">Preenche endereço, bairro, cidade e UF</p>
					</div>

					<!-- Linha 2: Endereço (textarea largura total) -->
					<div>
						<label for="prof-logradouro" class="input-label">Endereço</label>
						<textarea
							id="prof-logradouro"
							rows={2}
							bind:value={formLogradouro}
							class="input-base resize-none leading-relaxed"
							placeholder="Rua, Av., Alameda..."
						></textarea>
					</div>

					<!-- Linha 3: Número / Complemento (50/50) -->
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="prof-numero" class="input-label">Número</label>
							<input id="prof-numero" type="text" bind:value={formNumero} class="input-base" placeholder="123" />
						</div>
						<div>
							<label for="prof-complemento" class="input-label">Complemento</label>
							<input id="prof-complemento" type="text" bind:value={formComplemento} class="input-base" placeholder="Sala 10, Bloco B" />
						</div>
					</div>

					<!-- Linha 4: Bairro (largura total) -->
					<div>
						<label for="prof-bairro" class="input-label">Bairro</label>
						<input id="prof-bairro" type="text" bind:value={formBairro} class="input-base" placeholder="Centro" />
					</div>

					<!-- Linha 5: Cidade (3/4) + UF (1/4) -->
					<div class="grid grid-cols-4 gap-3">
						<div class="col-span-3">
							<label for="prof-cidade" class="input-label">Cidade</label>
							<input id="prof-cidade" type="text" bind:value={formCidade} class="input-base" placeholder="São Paulo" />
						</div>
						<div class="col-span-1">
							<label for="prof-estado" class="input-label">UF</label>
							<input id="prof-estado" type="text" bind:value={formEstado} class="input-base text-center" placeholder="SP" maxlength={2} />
						</div>
					</div>
				</div>
			</section>

			<!-- ═══ SEÇÃO 4: Classificação ═══ -->
			<section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6">
				<h4 class="section-header">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
					Classificação
				</h4>

				<div class="space-y-5">
					<!-- Potencial — Segmented Control (cores semânticas) -->
					<div>
						<span class="input-label">Potencial de prescrição</span>
						<div class="segmented-control" role="group" aria-label="Potencial de prescrição">
							{#each [
								{ value: 'ALTO', label: 'Alto', active: 'seg-active-emerald' },
								{ value: 'MEDIO', label: 'Médio', active: 'seg-active-amber' },
								{ value: 'BAIXO', label: 'Baixo', active: 'seg-active-orange' },
								{ value: 'ESTRATEGICO', label: 'Estratégico', active: 'seg-active-indigo' }
							] as opt}
								<button
									type="button"
									onclick={() => { formPotencial = opt.value as PotencialPrescricao; }}
									class="segmented-btn {formPotencial === opt.value ? opt.active : ''}"
								>
									{opt.label}
								</button>
							{/each}
						</div>
						<p class="text-xs text-ui-muted mt-1.5">Volume estimado de prescrições</p>
					</div>

					<!-- Estágio — Segmented Control (cores semânticas) -->
					<div class="mt-5">
						<span class="input-label">Estágio no pipeline</span>
						<div class="segmented-control" role="group" aria-label="Estágio no pipeline">
							{#each [
								{ value: 'PROSPECTADO', label: 'Prospectado', active: 'seg-active-blue' },
								{ value: 'VISITADO', label: 'Visitado', active: 'seg-active-sky' },
								{ value: 'INTERESSADO', label: 'Interessado', active: 'seg-active-amber' },
								{ value: 'PRESCRITOR', label: 'Prescritor', active: 'seg-active-emerald' },
								{ value: 'FIDELIZADO', label: 'Fidelizado', active: 'seg-active-indigo' }
							] as opt}
								<button
									type="button"
									onclick={() => { formEstagio = opt.value as EstagioPipeline; }}
									class="segmented-btn {formEstagio === opt.value ? opt.active : ''}"
								>
									{opt.label}
								</button>
							{/each}
						</div>
						<p class="text-xs text-ui-muted mt-1.5">Acompanhamento do relacionamento</p>
					</div>

					<!-- Classificação do Relacionamento — Grid 3 colunas -->
					<div class="mt-5">
						<span class="input-label">Classificação do relacionamento</span>
						<div class="rounded-lg border border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))] p-1">
							<div class="grid grid-cols-3 gap-1" role="group" aria-label="Classificação do relacionamento">
								<button
									type="button"
									onclick={() => { formClassificacao = 'FORTE'; }}
									class="segmented-btn col-span-1 {formClassificacao === 'FORTE' ? 'seg-active-emerald' : ''}"
								>
									Forte
								</button>
								<button
									type="button"
									onclick={() => { formClassificacao = 'INTERMEDIARIO'; }}
									class="segmented-btn col-span-1 {formClassificacao === 'INTERMEDIARIO' ? 'seg-active-amber' : ''}"
								>
									Intermediário
								</button>
								<button
									type="button"
									onclick={() => { formClassificacao = 'FRACO'; }}
									class="segmented-btn col-span-1 {formClassificacao === 'FRACO' ? 'seg-active-rose' : ''}"
								>
									Fraco
								</button>
								<button
									type="button"
									onclick={() => { formClassificacao = ''; }}
									class="segmented-btn col-span-3 {formClassificacao === '' ? 'seg-active-slate' : ''}"
								>
									Não definida
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- ═══ SEÇÃO 5: Informações Complementares ═══ -->
			<section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6">
				<h4 class="section-header">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
					Informações Complementares
				</h4>

				<div class="space-y-3">
					<!-- Observações -->
					<div>
						<label for="prof-observacoes" class="input-label">Observações</label>
						<textarea
							id="prof-observacoes"
							rows={3}
							bind:value={formObservacoes}
							class="input-base resize-none"
							placeholder="Anotações gerais..."
						></textarea>
					</div>

					<!-- Cônjuge -->
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="prof-conjuge" class="input-label">Nome do Cônjuge</label>
							<input id="prof-conjuge" type="text" bind:value={formNomeConjuge} class="input-base" placeholder="Nome do cônjuge" />
						</div>
						<div>
							<label for="prof-nasc-conjuge" class="input-label">Data Nasc. Cônjuge</label>
							<input id="prof-nasc-conjuge" type="date" bind:value={formDataNascConjuge} class="input-base" />
						</div>
					</div>
				</div>
			</section>

			<!-- Ações -->
			<div class="pt-4 border-t border-[rgb(var(--slate-100))]">
				<div class="flex flex-col gap-3">
					<Button type="submit" form="profissionalForm" onclick={handleSalvarProfissional} class="w-full" disabled={!formProfissionalValido}>
						{profissionalEmEdicao ? 'Salvar Alterações' : 'Cadastrar Profissional'}
					</Button>
					{#if profissionalAtual}
						<Button variant="destructive" type="button" onclick={handleExcluirProfissionalEditando} class="w-full">
							Excluir
						</Button>
					{/if}
					<Button variant="outline" onclick={() => (sheetOpen = false)} class="w-full">Cancelar</Button>
				</div>
			</div>
		</div>
	{/snippet}
</Sheet>

<!-- Modal de Consulta Rápida -->
{#if consultaOpen && profissionalConsulta}
	{@const tratamentoLabels = { DR: 'Dr.', DRA: 'Dra.', PROF: 'Prof.', PROFA: 'Profa.', SR: 'Sr.', SRA: 'Sra.' } as Record<string, string>}
	{@const sexoLabels = { MASCULINO: 'Masculino', FEMININO: 'Feminino', NAO_INFORMADO: 'Não informado' } as Record<string, string>}
	<!-- Overlay -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
		onclick={() => consultaOpen = false}
		onkeydown={(e) => { if (e.key === 'Escape') consultaOpen = false; }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Modal -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
			onclick={(e) => e.stopPropagation()}
			onkeydown={() => {}}
			role="document"
		>
			<!-- Header -->
			<div class="flex items-start justify-between p-6 border-b border-[rgb(var(--slate-100))]">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">
						{profissionalConsulta.nome.split(' ').slice(0, 2).map((n: string) => n.charAt(0)).join('').toUpperCase()}
					</div>
					<div>
						<h2 class="text-xl font-bold text-ui-primary">
							{profissionalConsulta.tratamento
								? (tratamentoLabels[profissionalConsulta.tratamento] ?? profissionalConsulta.tratamento) + ' '
								: ''}{profissionalConsulta.nome}
						</h2>
						<p class="text-sm font-medium text-ui-secondary mt-0.5">
							{profissionalConsulta.especialidade?.nome ?? 'Sem especialidade'}{profissionalConsulta.subEspecialidade?.nome ? ` - ${profissionalConsulta.subEspecialidade.nome}` : ''}
						</p>
					</div>
				</div>
				<button
					onclick={() => consultaOpen = false}
					class="p-2 rounded-lg hover:bg-[rgb(var(--slate-100))] transition-colors cursor-pointer shrink-0 ml-4"
				>
					<X class="w-4 h-4 text-ui-muted" />
				</button>
			</div>

			<!-- Abas -->
			<div class="flex border-b border-[rgb(var(--slate-100))]">
				<button
					type="button"
					onclick={() => { consultaTab = 'dados'; }}
					class="flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer
						{consultaTab === 'dados' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-ui-secondary hover-text-ui-body hover:bg-[rgb(var(--slate-50))]'}"
				>
					Dados
				</button>
				<button
					type="button"
					onclick={() => { consultaTab = 'visitas'; if (profissionalConsulta) loadVisitasProfissional(profissionalConsulta.id); }}
					class="flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer
						{consultaTab === 'visitas' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-ui-secondary hover-text-ui-body hover:bg-[rgb(var(--slate-50))]'}"
				>
					Últimas Visitas
				</button>
			</div>

			<!-- Conteúdo -->
			<div class="p-6">
				{#if consultaTab === 'dados'}
					<!-- Bloco: Dados Pessoais -->
					<div>
						<p class="text-xs font-bold text-ui-secondary uppercase tracking-wider mb-3">Dados Pessoais</p>
						<div class="grid grid-cols-2 gap-x-8 gap-y-4">
							<!-- CRM -->
							<div>
								<p class="text-xs text-ui-secondary mb-1">CRM</p>
								<p class="text-sm font-semibold {profissionalConsulta.crm ? 'text-ui-strong' : 'text-ui-disabled'}">{profissionalConsulta.crm || '—'}</p>
							</div>
							<!-- CPF/CNPJ -->
							<div>
								<p class="text-xs text-ui-secondary mb-1">CPF/CNPJ</p>
								<p class="text-sm font-semibold {profissionalConsulta.cpfCnpj ? 'text-ui-strong' : 'text-ui-disabled'}">{profissionalConsulta.cpfCnpj || '—'}</p>
							</div>
							<!-- Sexo -->
							<div>
								<p class="text-xs text-ui-secondary mb-1">Sexo</p>
								<p class="text-sm font-semibold {profissionalConsulta.sexo ? 'text-ui-strong' : 'text-ui-disabled'}">{profissionalConsulta.sexo ? (sexoLabels[profissionalConsulta.sexo] ?? profissionalConsulta.sexo) : '—'}</p>
							</div>
							<!-- Nascimento -->
							<div>
								<p class="text-xs text-ui-secondary mb-1">Nascimento</p>
								<p class="text-sm font-semibold {profissionalConsulta.dataNascimento ? 'text-ui-strong' : 'text-ui-disabled'}">{profissionalConsulta.dataNascimento ? new Date(profissionalConsulta.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—'}</p>
							</div>
						</div>
					</div>

					<!-- Bloco: Contato -->
					<div class="mt-8">
						<p class="text-xs font-bold text-ui-secondary uppercase tracking-wider mb-3">Contato</p>
						<div class="grid grid-cols-2 gap-x-8 gap-y-4">
							<div>
								<p class="text-xs text-ui-secondary mb-1">Telefone</p>
								<p class="text-sm font-semibold {profissionalConsulta.telefone ? 'text-ui-strong' : 'text-ui-disabled'}">{profissionalConsulta.telefone || '—'}</p>
							</div>
							<div>
								<p class="text-xs text-ui-secondary mb-1">Email</p>
								<p class="text-sm font-semibold {profissionalConsulta.email ? 'text-ui-strong' : 'text-ui-disabled'}">{profissionalConsulta.email || '—'}</p>
							</div>
						</div>
					</div>

					<!-- Bloco: Endereço -->
					{#if profissionalConsulta.endereco}
						{@const end = profissionalConsulta.endereco}
						{@const logradouroFull = [end.logradouro, end.numero, end.complemento].filter(Boolean).join(', ')}
						{@const cidadeUf = [end.cidade, end.estado].filter(Boolean).join('/')}
						<div class="mt-8">
							<p class="text-xs font-bold text-ui-secondary uppercase tracking-wider mb-3">Endereço</p>
							<div class="grid grid-cols-2 gap-x-8 gap-y-4">
								<div>
									<p class="text-xs text-ui-secondary mb-1">CEP</p>
									<p class="text-sm font-semibold {end.cep ? 'text-ui-strong' : 'text-ui-disabled'}">{end.cep || '—'}</p>
								</div>
								<div>
									<p class="text-xs text-ui-secondary mb-1">Logradouro</p>
									<p class="text-sm font-semibold {logradouroFull ? 'text-ui-strong' : 'text-ui-disabled'}">{logradouroFull || '—'}</p>
								</div>
								<div>
									<p class="text-xs text-ui-secondary mb-1">Bairro</p>
									<p class="text-sm font-semibold {end.bairro ? 'text-ui-strong' : 'text-ui-disabled'}">{end.bairro || '—'}</p>
								</div>
								<div>
									<p class="text-xs text-ui-secondary mb-1">Cidade/UF</p>
									<p class="text-sm font-semibold {cidadeUf ? 'text-ui-strong' : 'text-ui-disabled'}">{cidadeUf || '—'}</p>
								</div>
							</div>
						</div>
					{/if}

					<!-- Bloco: Classificação -->
					<div class="mt-8">
						<p class="text-xs font-bold text-ui-secondary uppercase tracking-wider mb-3">Classificação</p>
						<div class="grid grid-cols-3 gap-x-8 gap-y-4">
							<div>
								<p class="text-xs text-ui-secondary mb-1">Potencial</p>
								{#if profissionalConsulta.potencial && potencialConfig[profissionalConsulta.potencial]}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium {potencialConfig[profissionalConsulta.potencial].class}">
										{potencialConfig[profissionalConsulta.potencial].label}
									</span>
								{:else}
									<p class="text-sm font-semibold text-ui-disabled">—</p>
								{/if}
							</div>
							<div>
								<p class="text-xs text-ui-secondary mb-1">Estágio</p>
								{#if profissionalConsulta.estagioPipeline && estagioConfig[profissionalConsulta.estagioPipeline]}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium {estagioConfig[profissionalConsulta.estagioPipeline].class}">
										{estagioConfig[profissionalConsulta.estagioPipeline].label}
									</span>
								{:else}
									<p class="text-sm font-semibold text-ui-disabled">—</p>
								{/if}
							</div>
							<div>
								<p class="text-xs text-ui-secondary mb-1">Relacionamento</p>
								{#if profissionalConsulta.classificacao && classificacaoConfig[profissionalConsulta.classificacao]}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium {classificacaoConfig[profissionalConsulta.classificacao].class}">
										{classificacaoConfig[profissionalConsulta.classificacao].label}
									</span>
								{:else}
									<p class="text-sm font-semibold text-ui-disabled">—</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Observações -->
					{#if profissionalConsulta.observacoes}
						<div class="mt-8">
							<p class="text-xs font-bold text-ui-muted uppercase tracking-wider mb-2">Observações</p>
							<p class="text-sm font-semibold text-ui-strong">{profissionalConsulta.observacoes}</p>
						</div>
					{/if}

				{:else}
					<!-- Aba: Últimas Visitas -->
					{#if loadingVisitas}
						<div class="flex justify-center py-12">
							<div class="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
						</div>
					{:else if visitasDoProfissional.length === 0}
						<div class="text-center py-16">
							<div class="flex justify-center mb-3">
								<div class="bg-[rgb(var(--slate-100))] p-3 rounded-full">
									<Calendar class="w-6 h-6 text-ui-muted" />
								</div>
							</div>
							<p class="text-sm font-medium text-ui-secondary">Nenhuma visita registrada</p>
							<p class="text-xs text-ui-muted mt-1">Este profissional ainda não possui visitas cadastradas.</p>
						</div>
					{:else}
						<div class="space-y-3">
							{#each visitasDoProfissional as visita}
								<div class="bg-[rgb(var(--slate-50))] rounded-xl p-4 border border-[rgb(var(--slate-100))] hover:border-[rgb(var(--slate-200))] transition-colors">
									<div class="flex items-center justify-between mb-2">
										<div class="flex items-center gap-2 text-sm">
											<Calendar class="w-3.5 h-3.5 text-ui-muted" />
											<span class="font-semibold text-ui-body">
												{new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(visita.dataVisita))}
												às {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
											</span>
										</div>
										<StatusVisitaBadge status={visita.status} />
									</div>
									<div class="flex items-center gap-4 text-xs text-ui-secondary">
										{#if visita.duracaoMinutos}
											<div class="flex items-center gap-1">
												<Clock class="w-3 h-3 text-ui-muted" />
												<span>{visita.duracaoMinutos} min</span>
											</div>
										{/if}
										{#if visita.materiais && visita.materiais.length > 0}
											<div class="flex items-center gap-1">
												<Package class="w-3 h-3 text-ui-muted" />
												<span>{visita.materiais.length} materiais</span>
											</div>
										{/if}
									</div>
									{#if visita.objetivoVisita}
										<p class="text-xs text-ui-secondary mt-2 line-clamp-2"><span class="font-medium">Objetivo:</span> {visita.objetivoVisita}</p>
									{/if}
									{#if visita.resumo}
										<p class="text-xs text-ui-secondary mt-1 line-clamp-2"><span class="font-medium">Resumo:</span> {visita.resumo}</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Footer -->
			<div class="flex justify-end gap-3 px-6 py-4 border-t border-[rgb(var(--slate-100))]">
				<button
					onclick={() => consultaOpen = false}
					class="px-4 py-2 text-sm font-medium text-ui-secondary border border-transparent hover:bg-[rgb(var(--slate-50))] rounded-lg transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer"
				>
					Fechar
				</button>
				<button
					onclick={() => {
						consultaOpen = false;
						handleEditarProfissional(profissionalConsulta!);
					}}
					class="px-4 py-2 text-sm font-medium text-white shadow-sm rounded-lg transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer"
					style="background-color: rgb(var(--accent))"
				>
					Editar cadastro
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- FAB (mobile) -->
<Button
	class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden"
	onclick={handleNovoProfissional}
>
	<Plus class="h-6 w-6 text-white" />
</Button>

<!-- Confirm Delete -->
<ConfirmDialog
	open={deleteConfirmOpen}
	onclose={() => { deleteConfirmOpen = false; profToDelete = null; }}
	title="Excluir profissional"
	onconfirm={confirmDeleteProfissional}
	variant="danger"
>
{#snippet description()}
	{#if profToDelete}
		<p>Você está prestes a excluir <strong>"{profToDelete.nome}"</strong>.</p>
		<p>Esta ação não pode ser desfeita.</p>
	{/if}
{/snippet}
</ConfirmDialog>
