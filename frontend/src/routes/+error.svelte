<script>
	import { page } from '$app/stores';
</script>

<div>
	<h2>
		{$page.status}
	</h2>
	<h1>An error occurred</h1>
	<p>
		{$page.error?.message}
	</p>
</div>

<style>
	div {
		display: flex;
		gap: 0.75rem;
		color: var(--ctp-macchiato-red);
		align-items: center;
		flex-direction: column;
		height: 100%;
		width: 100%;
		justify-content: center;
		text-align: center;
		padding: 1.25rem;
	}

	h2 {
		font-size: 6rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: bold;
	}
</style>
