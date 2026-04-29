<script lang="ts">
	const { linhas = 3 } = $props<{ linhas?: number }>();
	const widths = [100, 85, 70, 60, 90, 75];
</script>

<div class="space-y-3 animate-pulse">
	{#each Array(linhas) as _, i}
		<div
			class="h-4 rounded"
			style="width: {widths[i % widths.length]}%; background-color: #e5e7eb;"
		></div>
	{/each}
</div>
