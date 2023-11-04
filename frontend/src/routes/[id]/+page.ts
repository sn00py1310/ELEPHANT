import type { PageLoad } from './$types';
import { PUBLIC_BACKEND, PUBLIC_CALENDAR_ROUTE } from '$env/static/public';
import { isSettingsResponse } from '$lib/@util/typeguards/isSettingsResponse.quard';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	if (params.id === 'new') {
		return { settings: null };
	}
	const elephantBackend = new URL(`${PUBLIC_CALENDAR_ROUTE}/${params.id}/settings`, PUBLIC_BACKEND);
	const res = await fetch(elephantBackend, {
		method: 'GET',
		headers: { 'content-type': 'application/json' }
	}).then((res) => res.json());

	if (!isSettingsResponse(res)) {
		console.error('Invalid response from backend. Got: ', res);
		throw error(
			400,
			`Invalid response from backend for the id: ${params.id}. Got ${JSON.stringify(res)}`
		);
	}
	return {
		settings: res
	};
};
