<script lang="ts">
  interface Props {
    titulo: string;
    valor: number | string;
    icone: any;
    corIcone: string;
    corFundo: string;
  }

  let { titulo, valor, icone: Icon, corIcone, corFundo }: Props = $props();
</script>

<div class="card-surface flex flex-col items-center justify-center text-center p-6 h-full min-h-[120px]">
  <div class="flex items-center gap-2">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {corFundo}">
      <Icon class="h-4 w-4 {corIcone}" />
    </div>
    <p class="text-sm font-bold text-[rgb(var(--slate-500))] uppercase tracking-wider">{titulo}</p>
  </div>
  <p class="text-3xl font-bold text-[rgb(var(--slate-800))] mt-2">{valor}</p>
</div>
