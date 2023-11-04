import type { PageLoad } from './$types';
import { PUBLIC_BACKEND, PUBLIC_CALENDAR_ROUTE } from '$env/static/public';
import { isSettingsResponse } from '$lib/@util/typeguards/isSettingsResponse.quard';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	if (!url.searchParams.has('id')) {
		return { settings: null };
	}
	const id = url.searchParams.get('id');
	console.log(id);

	const elephantBackend = new URL(`${PUBLIC_CALENDAR_ROUTE}/${id}/settings`, PUBLIC_BACKEND);
	let res = null;
	res = await fetch(elephantBackend, {
		method: 'GET',
		headers: { 'content-type': 'application/json' }
	});
	if (!res.ok) {
		throw error(res.status, `Could not fetch settings for the id: ${id}`);
	}
	const settings = await res.json();

	if (!isSettingsResponse(settings)) {
		console.error('Invalid response from backend. Got: ', settings);
		throw error(
			400,
			`Invalid response from backend for the id: ${id}. Got ${JSON.stringify(settings)}`
		);
	}
	return {
		settings
	};
};
