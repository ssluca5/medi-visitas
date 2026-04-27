<script>
  let activeTab = $state(0);

  const tabs = [
    { label: "Dashboard", src: "/screenshots/dashboard.webp", alt: "Dashboard com KPIs e métricas" },
    { label: "Profissionais", src: "/screenshots/profissionais.webp", alt: "Listagem de profissionais com filtros" },
    { label: "Agenda", src: "/screenshots/agenda.webp", alt: "Calendário semanal de visitas" },
    { label: "Pipeline", src: "/screenshots/pipeline.webp", alt: "Funil comercial de estágios" },
    { label: "Gravação IA", src: "/screenshots/gravacao-ia.webp", alt: "Modal de gravação com transcrição IA" },
  ];
</script>

<section class="py-32 px-8 bg-surface">
  <div class="mx-auto w-full max-w-[1280px]">
    <div class="text-center">
      <h2 class="text-[36px] font-semibold leading-[1.3] tracking-[-0.02em] text-on-surface">Veja o MediVisitas em ação</h2>
      <p class="mt-4 text-xl leading-[1.6] text-on-surface-variant">Interface moderna e intuitiva para o seu dia a dia</p>
    </div>
    <div class="mt-10 flex justify-center" role="tablist" aria-label="Screenshots">
      <div class="inline-flex gap-1 rounded-lg bg-surface-container p-1">
        {#each tabs as tab, i}
          <button
            role="tab"
            aria-selected={activeTab === i}
            aria-controls="panel-{i}"
            id="tab-{i}"
            class="rounded-md px-4 py-2 text-sm font-medium transition-colors
              {activeTab === i
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
              }"
            onclick={() => activeTab = i}
          >
            {tab.label}
          </button>
        {/each}
      </div>
    </div>
    <div class="mt-8 overflow-hidden rounded-xl border border-outline-variant shadow-2xl">
      {#each tabs as tab, i}
        <div role="tabpanel" id="panel-{i}" aria-labelledby="tab-{i}" class={activeTab === i ? "block" : "hidden"}>
          <img src={tab.src} alt={tab.alt} width="1440" height="900" loading="lazy" class="w-full" />
        </div>
      {/each}
    </div>
  </div>
</section>
