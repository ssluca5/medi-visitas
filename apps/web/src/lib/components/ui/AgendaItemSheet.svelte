<script lang="ts">
	import type { AgendaItem, PrioridadeAgenda, StatusAgenda } from '$lib/types';
	import Sheet from './Sheet.svelte';
	import Button from './Button.svelte';
	import { Calendar, Clock, User, FileText, AlertTriangle, Search } from 'lucide-svelte';
	import type { Profissional } from '$lib/types';
	import { apiFetch } from '$lib/api';

	interface Props {
		open: boolean;
		item?: AgendaItem | null;
		profissionalId?: string;
		profissionalNome?: string;
		defaultDate?: string;
		defaultTime?: string;
		sessionToken: string | null;
		onClose: () => void;
		onSave: (data: {
			profissionalId: string;
			dataHoraInicio: string;
			dataHoraFim: string;
			prioridade: PrioridadeAgenda;
			status?: StatusAgenda;
			observacoes: string | null;
		}) => void;
		onDelete?: (id: string) => void;
		saving?: boolean;
	}

	let {
		open,
		item = null,
		profissionalId = '',
		profissionalNome = '',
		defaultDate = '',
		defaultTime = '',
		sessionToken,
		onClose,
		onSave,
		onDelete,
		saving = false
	}: Props = $props();

	let dataInicio = $state('');
	let horaInicio = $state('09:00');
	let horaFim = $state('09:30');
	let prioridade = $state<PrioridadeAgenda>('MEDIA');
	let status = $state<StatusAgenda>('PLANEJADO');
	let observacoes = $state('');
	let error = $state('');

	let searchQuery = $state('');
	let profissionaisFiltrados = $state<Profissional[]>([]);
	let isComboBoxOpen = $state(false);
	let selectedProfissionalForNew = $state<Profissional | null>(null);

	async function searchProfissionais() {
		if (!searchQuery.trim() || searchQuery.length < 2) {
			profissionaisFiltrados = [];
			return;
		}
		try {
			const res = await apiFetch(`/profissionais?q=${encodeURIComponent(searchQuery)}`, sessionToken);
			if (res.ok) {
				const json = await res.json();
				const todos = json.data || json;
				profissionaisFiltrados = todos.filter((p: Profissional) => !!p.nome.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
			}
		} catch {}
	}

	let isEdit = $derived(!!item);

	$effect(() => {
		if (open) {
			if (item) {
				const inicio = new Date(item.dataHoraInicio);
				const fim = new Date(item.dataHoraFim);
				const y = inicio.getFullYear();
				const m = String(inicio.getMonth() + 1).padStart(2, '0');
				const d = String(inicio.getDate()).padStart(2, '0');
				dataInicio = `${y}-${m}-${d}`;
				horaInicio = inicio.toTimeString().slice(0, 5);
				horaFim = fim.toTimeString().slice(0, 5);
				prioridade = item.prioridade;
				status = item.status;
				observacoes = item.observacoes ?? '';
			} else {
				const hoje = new Date();
				const y = hoje.getFullYear();
				const m = String(hoje.getMonth() + 1).padStart(2, '0');
				const d = String(hoje.getDate()).padStart(2, '0');
				dataInicio = defaultDate || `${y}-${m}-${d}`;
				horaInicio = defaultTime || '09:00';
				
				const [hh, mm] = horaInicio.split(':');
				const fimDate = new Date();
				fimDate.setHours(parseInt(hh, 10), parseInt(mm, 10) + 30);
				horaFim = `${String(fimDate.getHours()).padStart(2, '0')}:${String(fimDate.getMinutes()).padStart(2, '0')}`;
				
				prioridade = 'MEDIA';
				status = 'PLANEJADO';
				observacoes = '';
				
				selectedProfissionalForNew = null;
				searchQuery = '';
			}
			error = '';
		}
	});

	function handleSubmit() {
		if (!dataInicio) {
			error = 'Data é obrigatória';
			return;
		}
		if (!profissionalId && !item?.profissionalId && !selectedProfissionalForNew?.id) {
			error = 'Profissional é obrigatório';
			return;
		}
		if (horaFim <= horaInicio) {
			error = 'Hora fim deve ser maior que hora início';
			return;
		}
		error = '';

		onSave({
			profissionalId: (item?.profissionalId ?? profissionalId) || selectedProfissionalForNew?.id || '',
			dataHoraInicio: new Date(`${dataInicio}T${horaInicio}:00`).toISOString(),
			dataHoraFim: new Date(`${dataInicio}T${horaFim}:00`).toISOString(),
			prioridade,
			...(isEdit ? { status } : {}),
			observacoes: observacoes.trim() || null
		});
	}

	const prioridadeOpcoes: { value: PrioridadeAgenda; label: string }[] = [
		{ value: 'BAIXA', label: 'Baixa' },
		{ value: 'MEDIA', label: 'Média' },
		{ value: 'ALTA', label: 'Alta' },
		{ value: 'URGENTE', label: 'Urgente' }
	];

	const statusOpcoes: { value: StatusAgenda; label: string }[] = [
		{ value: 'PLANEJADO', label: 'Planejado' },
		{ value: 'CONFIRMADO', label: 'Confirmado' },
		{ value: 'REALIZADO', label: 'Realizado' },
		{ value: 'CANCELADO', label: 'Cancelado' }
	];
</script>

<Sheet {open} onclose={onClose}>
	<h2 class="text-lg font-semibold text-[rgb(var(--slate-800))] mb-5">{isEdit ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-5">
		<!-- Profissional -->
		<div>
			<label class="flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--slate-600))] mb-1.5" for="profissionalBusca">
				<User class="h-3.5 w-3.5 text-[rgb(var(--slate-400))]" />
				{isEdit ? 'Profissional' : 'Selecionar o Profissional'}
			</label>
			
			{#if isEdit || profissionalId}
				<p class="text-sm text-[rgb(var(--slate-800))] font-medium bg-[rgb(var(--slate-50))] rounded-lg px-3 py-2 border border-[rgb(var(--slate-200))]">
					{item?.profissional?.nome ?? profissionalNome}
				</p>
			{:else}
				<div class="relative">
					{#if selectedProfissionalForNew}
						<div class="flex items-center justify-between border border-[rgb(var(--slate-200))] rounded-lg py-2 px-3 bg-blue-50">
							<span class="text-sm font-medium text-[rgb(var(--slate-800))]">{selectedProfissionalForNew.nome}</span>
							<button type="button" class="text-xs text-blue-600 hover:underline" onclick={() => selectedProfissionalForNew = null}>Trocar</button>
						</div>
					{:else}
						<div class="relative">
							<span class="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--slate-400))]">
								<Search class="w-4 h-4" />
							</span>
							<input
								id="profissionalBusca"
								type="text"
								bind:value={searchQuery}
								oninput={searchProfissionais}
								onfocus={() => isComboBoxOpen = true}
								onblur={() => setTimeout(() => isComboBoxOpen = false, 200)}
								placeholder="Buscar médico..."
								class="block w-full pl-9 rounded-lg border-[rgb(var(--slate-200))] shadow-sm focus:border-blue-400 focus:ring-blue-200 text-sm py-2 px-3 border outline-none transition-all"
								autocomplete="off"
							/>
						</div>
						{#if isComboBoxOpen && profissionaisFiltrados.length > 0}
							<div class="absolute z-50 mt-1 w-full bg-white border border-[rgb(var(--slate-200))] rounded-lg shadow-lg max-h-48 overflow-y-auto">
								{#each profissionaisFiltrados as prof}
									<button
										type="button"
										onclick={() => { selectedProfissionalForNew = prof; isComboBoxOpen = false; searchQuery = ''; }}
										class="w-full text-left px-4 py-2 text-sm hover:bg-[rgb(var(--slate-50))] transition-colors"
									>
										<div class="font-medium text-[rgb(var(--slate-800))]">{prof.nome}</div>
										{#if prof.especialidade}
											<div class="text-xs text-[rgb(var(--slate-500))]">{prof.especialidade.nome}</div>
										{/if}
									</button>
								{/each}
							</div>
						{/if}
					{/if}
				</div>
			{/if}
		</div>

		<!-- Data -->
		<div>
			<label for="sheet-data" class="flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--slate-600))] mb-1.5">
				<Calendar class="h-3.5 w-3.5 text-[rgb(var(--slate-400))]" />
				Data
			</label>
			<input
				id="sheet-data"
				type="date"
				bind:value={dataInicio}
				class="w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white px-3 py-2 text-sm text-[rgb(var(--slate-800))] outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
			/>
		</div>

		<!-- Horários -->
		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="sheet-hora-inicio" class="flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--slate-600))] mb-1.5">
					<Clock class="h-3.5 w-3.5 text-[rgb(var(--slate-400))]" />
					Início
				</label>
				<input
					id="sheet-hora-inicio"
					type="time"
					bind:value={horaInicio}
					min="06:00"
					max="21:00"
					step="1800"
					class="w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white px-3 py-2 text-sm text-[rgb(var(--slate-800))] outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
				/>
			</div>
			<div>
				<label for="sheet-hora-fim" class="flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--slate-600))] mb-1.5">
					<Clock class="h-3.5 w-3.5 text-[rgb(var(--slate-400))]" />
					Fim
				</label>
				<input
					id="sheet-hora-fim"
					type="time"
					bind:value={horaFim}
					min="06:00"
					max="21:30"
					step="1800"
					class="w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white px-3 py-2 text-sm text-[rgb(var(--slate-800))] outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
				/>
			</div>
		</div>

		<!-- Prioridade -->
		<div>
			<label for="sheet-prioridade" class="text-sm font-semibold text-[rgb(var(--slate-600))] mb-1.5 block">
				Prioridade
			</label>
			<select
				id="sheet-prioridade"
				bind:value={prioridade}
				class="w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white px-3 py-2 text-sm text-[rgb(var(--slate-800))] outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all cursor-pointer"
			>
				{#each prioridadeOpcoes as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<!-- Status (somente edição) -->
		{#if isEdit}
			<div>
				<label for="sheet-status" class="text-sm font-semibold text-[rgb(var(--slate-600))] mb-1.5 block">
					Status
				</label>
				<select
					id="sheet-status"
					bind:value={status}
					class="w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white px-3 py-2 text-sm text-[rgb(var(--slate-800))] outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all cursor-pointer"
				>
					{#each statusOpcoes as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
		{/if}

		<!-- Observações -->
		<div>
			<label for="sheet-obs" class="flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--slate-600))] mb-1.5">
				<FileText class="h-3.5 w-3.5 text-[rgb(var(--slate-400))]" />
				Observações
			</label>
			<textarea
				id="sheet-obs"
				bind:value={observacoes}
				rows={3}
				placeholder="Notas opcionais sobre a visita..."
				class="w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white px-3 py-2 text-sm text-[rgb(var(--slate-800))] outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
			></textarea>
		</div>

		<!-- Error -->
		{#if error}
			<div class="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[12px] text-red-700">
				<AlertTriangle class="h-3.5 w-3.5 text-red-500 shrink-0" />
				{error}
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex items-center gap-2 pt-2">
			<button
				type="submit"
				disabled={saving}
				class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
			>
				{#if saving}
					<span class="flex items-center justify-center gap-2">
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
						Salvando...
					</span>
				{:else}
					{isEdit ? 'Atualizar' : 'Agendar'}
				{/if}
			</button>

			{#if isEdit && onDelete && item}
				<button
					type="button"
					class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 ease-out hover:bg-red-100 active:scale-[0.98] cursor-pointer"
					onclick={() => onDelete?.(item!.id)}
				>
					Excluir
				</button>
			{/if}
		</div>
	</form>
</Sheet>
