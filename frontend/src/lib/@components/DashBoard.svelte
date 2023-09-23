<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { apiRequest, replace, regex } from '$lib/@stores';
	import RegexFilter from './RegexFilter.svelte';

	const dispatch = createEventDispatcher();
</script>

<div id="dash">
	<div class="left row">
		<RegexFilter on:regexChange={({ detail }) => ($regex = detail)} />
		<textarea
			placeholder="Replacement (you can also use matching groups -> $1)"
			bind:value={$replace}
		/>
	</div>
	<div class="right row">
		<select name="" id="">
			<option value="">global</option>
		</select>
		<button on:click={() => apiRequest.addReg()}> add regex </button>
		<button on:click={() => dispatch('toggleCalendar')}> toggle full calender</button>
		<button class="primeAction" on:click={() => dispatch('send')}> send api request </button>
	</div>
</div>

<style>
	#dash {
		display: grid;
		gap: 1em;
		grid-template: 1fr /1fr 1fr;
	}

	.row {
		display: flex;
		gap: 1em;
		flex-direction: column;
	}
	.row * {
		height: 100%;
	}

	.primeAction {
		background-color: var(--ctp-macchiato-blue);
	}
</style>
