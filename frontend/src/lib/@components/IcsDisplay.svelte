<script lang="ts">
	import { PUBLIC_MATCH_COUNT_HIGHLIGHT } from '$env/static/public';
	import { createHighLight } from '$lib/@stores';

	export let classString = 'red';
	export let replace = false;
	export let scrollTop = 0;

	const display = createHighLight(
		classString,
		Number.parseInt(PUBLIC_MATCH_COUNT_HIGHLIGHT),
		replace
	);

	let self: HTMLElement;

	const scrolling = () => {
		if (!self) return;
		scrollTop = self.scrollTop;
	};

	$: if (self) self.scrollTop = scrollTop;
</script>

<div bind:this={self} on:scroll={scrolling}>
	<pre>{@html $display}</pre>
</div>

<style>
	div {
		height: 100%;
		overflow: auto;
		position: relative;
	}

	pre {
		white-space: pre;
	}
</style>
