<script lang="ts">
	import { Users, Stethoscope, CalendarCheck, TrendingUp } from 'lucide-svelte';

	// Mock data for new dense widgets
	const recentProfissionais = [
		{ name: 'Dr. Carlos Silva', spec: 'Cardiologia', status: 'Novo' },
		{ name: 'Dra. Ana Costa', spec: 'Pediatria', status: 'Atualizado' },
		{ name: 'Dr. João Pereira', spec: 'Ortopedia', status: 'Novo' }
	];

	const upcomingVisits = [
		{ name: 'Dra. Maria Clara', time: '14:30', spec: 'Dermatologia' },
		{ name: 'Dr. Roberto Alves', time: '16:00', spec: 'Endocrinologia' }
	];
</script>

<svelte:head>
	<title>Dashboard — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<header class="mb-6">
	<h2 class="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h2>
	<p class="text-sm text-slate-400 mt-1">Visão geral do seu dia</p>
</header>

<!-- Dense Widgets Grid -->
<div class="grid grid-cols-1 gap-4 lg:grid-cols-4 mb-6 items-stretch">
	<!-- Profissionais Widget -->
	<div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm">
		<div class="flex items-center gap-3 mb-4">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
				<Users class="h-5 w-5 text-blue-600" />
			</div>
			<div>
				<p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Profissionais</p>
				<p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p>
			</div>
		</div>
		<div class="mt-auto space-y-2 border-t border-slate-100 pt-3">
			{#each recentProfissionais as p}
				<div class="flex justify-between items-center group cursor-pointer">
					<div class="min-w-0">
						<p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">{p.name}</p>
						<p class="text-[11px] text-slate-400 truncate">{p.spec}</p>
					</div>
					<span class="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">{p.status}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Especialidades Widget -->
	<div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm">
		<div class="flex items-center gap-3 mb-4">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
				<Stethoscope class="h-5 w-5 text-emerald-600" />
			</div>
			<div>
				<p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Especialidades</p>
				<p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p>
			</div>
		</div>
		<div class="mt-auto border-t border-slate-100 pt-3">
			<p class="text-xs text-slate-500 font-medium leading-relaxed">Top ativas:</p>
			<div class="flex flex-wrap gap-1.5 mt-2">
				<span class="text-[11px] font-medium px-2 py-1 bg-slate-50 text-slate-600 outline-1 outline-slate-100 rounded-md">Cardiologia</span>
				<span class="text-[11px] font-medium px-2 py-1 bg-slate-50 text-slate-600 outline-1 outline-slate-100 rounded-md">Pediatria</span>
			</div>
		</div>
	</div>

	<!-- Visitas Hoje Widget -->
	<div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm">
		<div class="flex items-center gap-3 mb-4">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
				<CalendarCheck class="h-5 w-5 text-violet-600" />
			</div>
			<div>
				<p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Visitas Hoje</p>
				<p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p>
			</div>
		</div>
		<div class="mt-auto space-y-2 border-t border-slate-100 pt-3">
			<p class="text-xs text-slate-500 font-medium mb-1">Próximos compromissos:</p>
			{#each upcomingVisits as v}
				<div class="flex items-center gap-2 group cursor-pointer">
					<div class="flex-shrink-0 w-10 text-center">
						<span class="text-[11px] font-bold text-violet-600">{v.time}</span>
					</div>
					<div class="min-w-0 border-l border-slate-100 pl-2">
						<p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-violet-600 transition-colors">{v.name}</p>
						<p class="text-[11px] text-slate-400 truncate">{v.spec}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Pipeline Widget -->
	<div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm">
		<div class="flex items-center gap-3 mb-4">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
				<TrendingUp class="h-5 w-5 text-amber-600" />
			</div>
			<div>
				<p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pipeline</p>
				<p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p>
			</div>
		</div>
		<div class="mt-auto border-t border-slate-100 pt-3">
			<div class="flex justify-between items-center mb-1.5 cursor-pointer group">
				<span class="text-[12px] font-medium text-slate-600 group-hover:text-amber-600 transition-colors">Prospectado</span>
				<span class="text-[12px] font-bold text-slate-900">5</span>
			</div>
			<div class="w-full bg-slate-100 rounded-full h-1.5 mb-3">
				<div class="bg-amber-400 h-1.5 rounded-full outline-hidden" style="width: 45%"></div>
			</div>
			<div class="flex justify-between items-center mb-1.5 cursor-pointer group">
				<span class="text-[12px] font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">Interessado</span>
				<span class="text-[12px] font-bold text-slate-900">2</span>
			</div>
			<div class="w-full bg-slate-100 rounded-full h-1.5">
				<div class="bg-emerald-400 h-1.5 rounded-full outline-hidden" style="width: 20%"></div>
			</div>
		</div>
	</div>
</div>

<!-- Quick Actions -->
<div class="card-surface p-5 transition-all duration-200 hover:shadow-sm">
	<h3 class="text-sm font-semibold text-slate-700 mb-4">Acesso Rápido</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<a
			href="/dashboard/profissionais"
			class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/40 active:scale-[0.98]"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
				<Users class="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
			</div>
			<div>
				<p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Profissionais</p>
				<p class="text-[11px] text-slate-400 font-medium">Gerenciar cadastros</p>
			</div>
		</a>
		<a
			href="/dashboard/especialidades"
			class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40 active:scale-[0.98]"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
				<Stethoscope class="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
			</div>
			<div>
				<p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Especialidades</p>
				<p class="text-[11px] text-slate-400 font-medium">Categorias e subs</p>
			</div>
		</a>
		<a
			href="/dashboard/pipeline"
			class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-violet-200 hover:bg-violet-50/40 active:scale-[0.98]"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
				<TrendingUp class="h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
			</div>
			<div>
				<p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Pipeline</p>
				<p class="text-[11px] text-slate-400 font-medium">Funil de conversão</p>
			</div>
		</a>
	</div>
</div>
