<script lang="ts">
	const { linhas = 3 } = $props<{ linhas?: number }>();
	const widths = [100, 85, 70, 60, 90, 75];

	function range(count: number) {
		return Array.from(Array(count).keys());
	}
</script>

<div class="space-y-3 animate-pulse">
	{#each range(linhas) as i}
		<div
			class="h-4 rounded"
			style="width: {widths[i % widths.length]}%; background-color: #e5e7eb;"
		></div>
	{/each}
</div>
