<script lang="ts">
  import { Mic } from 'lucide-svelte';

  interface Props {
    onclick: () => void;
  }

  let { onclick }: Props = $props();
</script>

<button
  type="button"
  {onclick}
  class="fixed bottom-6 right-24 w-14 h-14 rounded-full flex items-center justify-center
    shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer z-40
    hover:scale-105 active:scale-95"
  style="background-color: #7c3aed;"
  title="Gravar áudio da visita"
>
  <Mic class="w-6 h-6 text-white" />
</button>
