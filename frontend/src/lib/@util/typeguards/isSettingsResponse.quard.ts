import type { Settings } from '$lib/@types/Api';
import { isSimpleReplacement } from './isSimpleReplacement.guard';

export function isSettingsResponse(response: unknown): response is Settings {
	return (
		typeof response === 'object' &&
		response != null &&
		'id' in response &&
		'last_access' in response &&
		'url' in response &&
		'settings' in response &&
		typeof response.id === 'string' &&
		typeof response.last_access === 'string' &&
		typeof response.url === 'string' &&
		typeof response.settings === 'object' &&
		response.settings != null &&
		'replacements' in response.settings &&
		Array.isArray(response.settings.replacements) &&
		response.settings.replacements.every(isSimpleReplacement)
	);
}
