<script lang="ts">
	import { PUBLIC_BACKEND, PUBLIC_CALENDAR_ROUTE } from '$env/static/public';
	import ApiRequest from '$lib/@components/ApiRequest/ApiRequest.svelte';
	import Calendar from '$lib/@components/Calendar/Calendar.svelte';
	import DashBoard from '$lib/@components/DashBoard.svelte';
	import IcsDisplay from '$lib/@components/IcsDisplay.svelte';
	import { icsData, newIcsData } from '$lib/@stores';

	const corsProxy = new URL('cors-proxy', PUBLIC_BACKEND);

	let url = 'https://campus.kit.edu/sp/webcal/sWi7gc4IYy';
	$: if (url) corsProxy.searchParams.set('url', url);

	let scrollTop = 0;

	let fullCalendar = false;

	let send: () => Promise<Response>;
	let id: string;

	const sendRequest = () => {
		send()
			.then((x) => x.json())
			.then((res: { id: string }) => {
				id = res.id;
				finished = true;
			});
	};

	// Should use a router. Anyways...
	let finished = false;

	const request = () => {
		fetch(corsProxy)
			.then((x) => x.text())
			.then((x) => {
				// Change u+000d u+000a to u+000a -> remove carriage return
				// Also remove "/"", who needs it anyways...
				const d = x.replace(/\r/g, '').replace(/\\/g, '');
				$icsData = d;
			});
	};
</script>

{#if finished}
	<main id="finish">
		<div id="wrapper">
			<h1>Calendar Proxy created</h1>

			<div>
				<h2>Your Id is:</h2>
				<input type="text" readonly value={id} />
			</div>
			<div>
				<h2>And your url is:</h2>
				<input
					type="text"
					readonly
					value={new URL(`${PUBLIC_CALENDAR_ROUTE}/${id}`, PUBLIC_BACKEND).toString()}
				/>
			</div>
		</div>
	</main>
{:else}
	<main class={fullCalendar ? 'fullCal' : ''}>
		<section id="actionBoard">
			<DashBoard on:toggleCalendar={() => (fullCalendar = !fullCalendar)} on:send={sendRequest} />
		</section>

		<section id="originalIcs" class="ics">
			<h1>Orginal Calendar</h1>
			<IcsDisplay classString="red" bind:scrollTop />
		</section>
		<section id="newIcs" class="ics">
			<h1>New Calendar</h1>

			<IcsDisplay classString="green" replace={true} bind:scrollTop />
		</section>
		<section id="oldCalender" class="calender">
			<Calendar calendar={$icsData} full={fullCalendar} />
		</section>
		<section id="newCalender" class="calender">
			<Calendar calendar={$newIcsData} full={fullCalendar} />
		</section>
		<section id="url">
			<input type="text" placeholder="Calender url" bind:value={url} />
			<button on:click={request}>laden</button>
		</section>
		<section id="apiRequest">
			<ApiRequest {url} bind:send />
		</section>
	</main>
{/if}

<style>
	#finish {
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
	#actionBoard {
		grid-area: board;
	}
	.ics {
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		max-height: 50em;
	}
	#originalIcs {
		grid-area: oldIcs;
	}

	#newIcs {
		grid-area: newIcs;
	}
	#oldCalender {
		grid-area: cal1;
	}
	#newCalender {
		grid-area: cal2;
	}
	#url {
		grid-area: url;
		display: flex;
		gap: 1em;
	}
	#url input {
		width: 100%;
	}
	#url button {
		width: 8em;
	}
	#apiRequest {
		display: flex;
		flex-direction: column;
		grid-area: api;
	}
	main {
		padding: 1em;
		display: grid;
		gap: 1rem;
		height: 100vh;
		grid-template:
			'board board cal1 cal2' minmax(10rem, 1fr)
			'oldIcs newIcs url url' 5em
			'oldIcs newIcs api api' minmax(10rem, 1fr) / 1.7fr 1.7fr 1fr 1fr;
	}
	.calender {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.fullCal {
		grid-template:
			'board board cal1 cal2' minmax(10rem, 1fr)
			'oldIcs newIcs cal1 cal2' 5em
			'oldIcs newIcs cal1 cal2' 1fr / 1.7fr 1.7fr 1fr 1fr;
	}
	.fullCal #apiRequest {
		display: none;
	}
	.fullCal #url {
		display: none;
	}

	section {
		border-radius: 7px;
		padding: 1em;
		height: 100%;
		background-color: var(--ctp-macchiato-mantle);
	}
	@media only screen and (max-width: 1800px) {
		main {
			height: 100%;
			grid-template:
				'url url' auto
				'board board' auto
				'cal1 cal2' auto
				'oldIcs newIcs' auto
				'oldIcs newIcs' auto
				'api api' auto / 1fr 1fr !important;
		}
		.fullCal #apiRequest {
			display: flex;
		}
		.fullCal #url {
			display: flex;
		}
	}
	@media only screen and (max-width: 1200px) {
		main {
			height: 100%;
			grid-template:
				'url' auto
				'board' auto
				'cal1' auto
				'cal2' auto
				'oldIcs' auto
				'newIcs' auto
				'api' auto / 1fr !important;
		}
	}
</style>
