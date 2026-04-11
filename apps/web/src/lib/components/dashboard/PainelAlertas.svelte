<script lang="ts">
  import { Info, AlertTriangle, AlertCircle } from 'lucide-svelte';
  import type { Alerta, AlertaSeveridade } from '$lib/types';

  interface Props {
    alertas: Alerta[];
  }

  let { alertas }: Props = $props();

  const severidadeConfig: Record<AlertaSeveridade, { icon: typeof Info; borderClass: string; iconClass: string }> = {
    info: { icon: Info, borderClass: 'border-l-blue-400', iconClass: 'text-blue-500' },
    warning: { icon: AlertTriangle, borderClass: 'border-l-amber-400', iconClass: 'text-amber-500' },
    danger: { icon: AlertCircle, borderClass: 'border-l-red-400', iconClass: 'text-red-500' }
  };
</script>

<div class="card-surface p-5 h-full">
  <h3 class="text-sm font-semibold text-slate-700 mb-4">Alertas</h3>

  {#if alertas.length === 0}
    <div class="text-center py-8">
      <p class="text-sm text-slate-400">Nenhum alerta no momento</p>
    </div>
  {:else}
    <div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-2">
      {#each alertas as alerta}
        {@const config = severidadeConfig[alerta.severidade] ?? severidadeConfig.info}
        {@const Icon = config.icon}
        <a
          href="/dashboard/profissionais/{alerta.profissionalId}"
          class="flex items-start gap-3 p-3 rounded-lg border-l-3 {config.borderClass} bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"
        >
          <Icon class="h-4 w-4 {config.iconClass} mt-0.5 shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-[13px] font-medium text-slate-700 leading-snug">{alerta.mensagem}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">{alerta.profissionalNome}</p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
