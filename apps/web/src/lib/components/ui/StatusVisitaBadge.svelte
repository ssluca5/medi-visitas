<script lang="ts">
	import { StatusVisita } from '$lib/types';

	type StatusVisitaValue = (typeof StatusVisita)[keyof typeof StatusVisita];

	interface Props {
		status: StatusVisitaValue;
	}

	let { status }: Props = $props();

	const config: Record<StatusVisitaValue, { label: string; classes: string }> = {
		[StatusVisita.AGENDADA]: { label: 'Agendada', classes: 'bg-blue-50 text-blue-700' },
		[StatusVisita.REALIZADA]: { label: 'Realizada', classes: 'bg-emerald-50 text-emerald-700' },
		[StatusVisita.CANCELADA]: { label: 'Cancelada', classes: 'bg-red-50 text-red-700' },
		[StatusVisita.NAO_REALIZADA]: { label: 'Não Realizada', classes: 'bg-amber-50 text-amber-700' }
	};

	const badge = $derived(
		config[status] ?? { label: status, classes: 'bg-[rgb(var(--slate-100))] text-ui-secondary' }
	);
</script>

<span class={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.classes}`}>
	{badge.label}
</span>
