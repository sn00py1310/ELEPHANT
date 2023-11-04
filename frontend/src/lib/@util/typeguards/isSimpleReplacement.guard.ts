import type { SimpleReplacement } from '$lib/@types/Api';

export function isSimpleReplacement(replacement: unknown): replacement is SimpleReplacement {
	return (
		typeof replacement === 'object' &&
		replacement != null &&
		'mode' in replacement &&
		'pattern' in replacement &&
		'replacement' in replacement &&
		replacement.mode === 'globalRegex' &&
		typeof replacement.pattern === 'string' &&
		typeof replacement.replacement === 'string'
	);
}
