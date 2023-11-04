import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	if (!url.searchParams.has('id')) {
		throw error(400, 'An id search parameter is expected');
	}
	const id = url.searchParams.get('id');

	return {
		id
	};
};
