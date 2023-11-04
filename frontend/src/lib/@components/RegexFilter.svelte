<script lang="ts">
	import { escapeRegExp } from '$lib/@util';
	import { createEventDispatcher } from 'svelte';

	let escaped = false;
	let regex = '';
	export let value = '';
	const dispatch = createEventDispatcher();

	$: dispatch('regexChange', escaped ? escapeRegExp(regex) : regex);
</script>

<div class="inputSuffix">
	<textarea placeholder="Search" {value} on:input={(e) => (regex = e.currentTarget.value)} />
	<button class={!escaped ? 'active' : ''} on:click={() => (escaped = !escaped)}>(.*)</button>
</div>

<style>
	.inputSuffix {
		height: 100%;
	}
</style>
