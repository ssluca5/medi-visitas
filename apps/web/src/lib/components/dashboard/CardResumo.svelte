<script lang="ts">
  import { SvelteComponent } from 'svelte';

  interface Props {
    titulo: string;
    valor: number | string;
    descricao?: string;
    icone: typeof SvelteComponent;
    corIcone: string;
    corFundo: string;
  }

  let { titulo, valor, descricao, icone: Icon, corIcone, corFundo }: Props = $props();
</script>

<div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {corFundo}">
      <Icon class="h-5 w-5 {corIcone}" />
    </div>
    <div>
      <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{titulo}</p>
      <p class="text-xl font-semibold text-slate-900 leading-none mt-1">{valor}</p>
    </div>
  </div>
  {#if descricao}
    <p class="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">{descricao}</p>
  {/if}
</div>
