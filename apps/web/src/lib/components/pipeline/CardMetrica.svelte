<script lang="ts">
  interface Props {
    titulo: string;
    valor: string | number;
    subtitulo?: string;
    icone: any;
    corIcone: string;
    corFundo: string;
    variacao?: number;
  }

  let { titulo, valor, subtitulo, icone: Icon, corIcone, corFundo, variacao }: Props = $props();
</script>

<div class="card-surface flex flex-col items-center justify-center text-center p-6 h-full min-h-[120px]">
  <div class="flex items-center gap-2">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {corFundo}">
      <Icon class="h-4 w-4 {corIcone}" />
    </div>
    <p class="text-sm font-bold text-[rgb(var(--slate-500))] uppercase tracking-wider">{titulo}</p>
  </div>
  <div class="flex items-center gap-2 mt-2">
    <p class="text-3xl font-bold text-[rgb(var(--slate-800))]">{valor}</p>
    {#if variacao !== undefined}
      <span class="text-[11px] font-semibold px-1.5 py-0.5 rounded-md {variacao >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}">
        {variacao >= 0 ? '+' : ''}{variacao}%
      </span>
    {/if}
  </div>
  {#if subtitulo}
    <p class="text-[11px] text-[rgb(var(--slate-400))] mt-1.5">{subtitulo}</p>
  {/if}
</div>
