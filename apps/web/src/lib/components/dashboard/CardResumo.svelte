<script lang="ts">
  interface Props {
    titulo: string;
    valor: number | string;
    icone: any;
    corIcone: string;
    corFundo: string;
    subtexto?: string;
    subtextoCor?: string;
  }

  let { titulo, valor, icone: Icon, corIcone, corFundo, subtexto, subtextoCor }: Props = $props();
</script>

<div class="card-premium group">
  <div class="flex items-start justify-between mb-4">
    <p class="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">
      {titulo}
    </p>
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {corFundo} transition-transform duration-200 group-hover:scale-105">
      <Icon class="h-5 w-5 {corIcone}" />
    </div>
  </div>
  <p class="text-3xl font-bold text-[rgb(var(--slate-800))] tracking-tight">{valor}</p>
  {#if subtexto}
    <p class="text-xs mt-1.5 font-medium" style="color: {subtextoCor ?? 'rgb(var(--slate-400))'};">
      {subtexto}
    </p>
  {/if}
</div>

<style>
  .card-premium {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(226, 232, 240, 0.7);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03);
    transition: all 200ms ease-out;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .card-premium:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03);
    transform: translateY(-2px);
  }
</style>
