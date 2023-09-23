<script lang="ts">
	import { apiRequest } from '$lib/@stores';
	import { PUBLIC_BACKEND, PUBLIC_CALENDAR_ROUTE } from '$env/static/public';

	export let url = '';
	let blockView = true;
	const elephantBackend = new URL(PUBLIC_CALENDAR_ROUTE, PUBLIC_BACKEND);

	export const send = () => {
		return fetch(elephantBackend, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(generated)
		});
	};

	$: generated = {
		url,
		settings: { replacements: $apiRequest.slice().reverse() }
	};
</script>

<button on:click={() => (blockView = !blockView)}>toggle</button>
<div id="overflow">
	{#if !blockView}
		<pre>{JSON.stringify(generated, undefined, 2)}</pre>
	{:else}
		<div id="boxLayout">
			{#each $apiRequest as replacement, i}
				<div id="boxReplacement">
					<div id="textReplacement">
						<div>
							{replacement.pattern}
						</div>
						<span id="arrow">-></span>
						<div>
							{replacement.replacement}
						</div>
					</div>
					<button id="delete" on:click={() => apiRequest.remove(i)}>X</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	#overflow {
		overflow: auto;
	}
	pre {
		white-space: pre-wrap;
	}
	#boxLayout {
		margin-top: 1em;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	#textReplacement {
		display: flex;
		gap: 1em;
	}

	#textReplacement > div {
		background-color: var(--ctp-macchiato-surface0);
		border-radius: 5px;
		padding: 5px;
	}
	#boxReplacement {
		background-color: var(--ctp-macchiato-crust);
		padding: 0.5em;
		border-radius: 5px;
		display: flex;
		justify-content: space-between;
	}
	#arrow {
		color: var(--ctp-macchiato-green);
		margin: auto;
	}
	#delete {
		padding: 2px 5px;
		background-color: transparent;
		color: var(--ctp-macchiato-red);
	}
</style>
