<script lang="ts">
  import { Info, AlertTriangle, AlertCircle, Bell } from 'lucide-svelte';
  import type { Alerta, AlertaSeveridade } from '$lib/types';

  interface Props {
    alertas: Alerta[];
  }

  let { alertas }: Props = $props();

  const severidadeConfig: Record<AlertaSeveridade, { icon: typeof Info; borderClass: string; iconClass: string; bgClass: string }> = {
    info: { icon: Info, borderClass: 'border-l-blue-400', iconClass: 'text-blue-500', bgClass: 'bg-blue-50/50' },
    warning: { icon: AlertTriangle, borderClass: 'border-l-amber-400', iconClass: 'text-amber-500', bgClass: 'bg-amber-50/50' },
    danger: { icon: AlertCircle, borderClass: 'border-l-red-400', iconClass: 'text-red-500', bgClass: 'bg-red-50/50' }
  };
</script>

<div class="card-premium h-full">
  <h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Alertas</h3>

  {#if alertas.length === 0}
    <div class="flex flex-col items-center justify-center py-10 flex-1">
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 mb-3">
        <Bell class="h-6 w-6 text-amber-400" />
      </div>
      <p class="text-sm font-medium text-[rgb(var(--slate-600))]">Nenhum alerta no momento</p>
      <p class="text-xs text-[rgb(var(--slate-400))] mt-1 text-center max-w-[220px]">
        Você será notificado sobre pendências ou atualizações importantes.
      </p>
    </div>
  {:else}
    <div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
      {#each alertas as alerta}
        {@const config = severidadeConfig[alerta.severidade] ?? severidadeConfig.info}
        {@const Icon = config.icon}
        <a
          href="/dashboard/profissionais/{alerta.profissionalId}"
          class="flex items-start gap-3 p-3.5 rounded-xl border-l-3 {config.borderClass} {config.bgClass} hover:bg-[rgb(var(--slate-50))] will-change-transform transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"
        >
          <Icon class="h-4 w-4 {config.iconClass} mt-0.5 shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-[13px] font-medium text-[rgb(var(--slate-700))] leading-snug">{alerta.mensagem}</p>
            <p class="text-[11px] text-[rgb(var(--slate-400))] mt-0.5">{alerta.profissionalNome}</p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .card-premium {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(226, 232, 240, 0.7);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
  }
</style>
