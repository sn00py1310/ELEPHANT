<script lang="ts">
	import { browser } from '$app/environment';

	let value = '';
	if (browser) {
		value = localStorage.getItem('id') ?? '';
	}
</script>

<main>
	<div id="wrapper">
		<h1>Load from id token</h1>
		<input type="text" bind:value placeholder="Enter your id token here" />
		<a href="/calendar?id={value}"><button>Load</button></a>
		<div>
			<h1>No Account / Token</h1>
			<a href="/calendar"><button>Create</button></a>
		</div>
	</div>
</main>

<style>
	main {
		height: 100%;
		display: flex;
	}
	#wrapper {
		width: 40rem;
		margin: auto;
		display: flex;
		gap: 1rem;
		flex-direction: column;
	}
	#wrapper * {
		width: 100%;
	}
</style>
