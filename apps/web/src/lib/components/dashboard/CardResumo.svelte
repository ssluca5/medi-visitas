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

<div class="card-surface flex items-center gap-4 p-6 h-full">
  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full {corFundo}">
    <Icon class="h-5 w-5 {corIcone}" />
  </div>
  <div class="flex flex-col">
    <span class="text-sm font-medium text-[rgb(var(--slate-500))] mb-1">{titulo}</span>
    <span class="text-3xl font-bold text-[rgb(var(--slate-900))]">{valor}</span>
  </div>
</div>
