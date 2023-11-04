<script lang="ts">
	import { PUBLIC_BACKEND, PUBLIC_CALENDAR_ROUTE } from '$env/static/public';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<div id="wrapper">
		<h1>Calendar Proxy created</h1>

		<div>
			<h2>Your Id is:</h2>
			<input type="text" readonly value={data.id} />
		</div>
		<div>
			<h2>And your url is:</h2>
			<input
				type="text"
				readonly
				value={new URL(`${PUBLIC_CALENDAR_ROUTE}/${data.id}`, PUBLIC_BACKEND).toString()}
			/>
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
