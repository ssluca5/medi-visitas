<script lang="ts">
  import { Mic } from 'lucide-svelte';

  interface Props {
    onclick: () => void;
    inline?: boolean;
  }

  let { onclick, inline = false }: Props = $props();
</script>

<button
  type="button"
  {onclick}
  class={inline
    ? 'w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95'
    : 'fixed bottom-6 right-24 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer z-40 hover:scale-105 active:scale-95'}
  style="background-color: #7c3aed;"
  title="Gravar áudio da visita"
>
  <Mic class={inline ? 'w-4.5 h-4.5 text-white' : 'w-6 h-6 text-white'} />
</button>
