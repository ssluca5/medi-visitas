<script lang="ts">
	import { navigating } from '$app/stores';

	let progress = $state(0);
	let visible = $state(false);
	let interval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if ($navigating) {
			visible = true;
			progress = 15;
			interval = setInterval(() => {
				if (progress < 90) {
					progress += Math.random() * 10;
				}
			}, 200);
		} else {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			if (visible) {
				progress = 100;
				setTimeout(() => {
					visible = false;
					progress = 0;
				}, 300);
			}
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

{#if visible}
	<div class="fixed top-0 left-0 right-0 z-[9999] h-[3px]" style="background-color: rgba(37, 99, 235, 0.1);">
		<div
			class="h-full transition-all duration-200 ease-out"
			style="width: {Math.min(progress, 100)}%; background-color: #2563eb;"
		></div>
	</div>
{/if}
