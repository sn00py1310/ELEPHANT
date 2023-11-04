import { derived, writable, get } from 'svelte/store';
import type { SimpleReplacement } from '../@types/Api';
import { escapeHtml } from '../@util';
const DEFAULT_REQUEST_ENTRY: SimpleReplacement = {
	mode: 'globalRegex',
	replacement: '',
	pattern: ''
};

export const icsData = writable('');
export const regex = writable('');
let lastValidRegex: RegExp | null = null;
const _regex = derived(regex, (regexString) => {
	try {
		lastValidRegex = new RegExp(regexString, 'g');
	} catch (e) {
		console.warn('The regex contains an error. Ignore...');
	}
	return lastValidRegex!;
});
export const replace = writable('');

export const newIcsData = derived([icsData, _regex, replace], ([ics, regex, replacement]) =>
	regex ? ics.replace(regex, replacement) : ics
);

const createApiRequestStore = () => {
	const history: SimpleReplacement[] = [DEFAULT_REQUEST_ENTRY];
	const icsHistory: { old: string[]; new: string[] } = { old: [], new: [] };
	const { subscribe } = derived([_regex, replace], ([{ source }, replacement]) => {
		const newEntry: SimpleReplacement = {
			mode: 'globalRegex',
			replacement,
			pattern: source
		};
		history[history.length - 1] = newEntry;
		return history;
	});

	return {
		addReg: () => {
			icsHistory.old.push(get(icsData));
			icsHistory.new.push(get(newIcsData));
			history.push(DEFAULT_REQUEST_ENTRY);

			icsData.set(get(newIcsData));
			replace.set(crypto.randomUUID()); // Trigger derived
			replace.set('');
		},
		addRegs: (_history: SimpleReplacement[]) => {
			history.splice(0, history.length, ..._history);
			icsHistory.old.splice(0, icsHistory.old.length, get(icsData));
			icsHistory.new.splice(0, icsHistory.new.length);

			for (const { pattern, replacement } of history) {
				const replaced = icsHistory.old[icsHistory.old.length - 1].replace(
					new RegExp(pattern, 'g'),
					replacement
				);
				icsHistory.new.push(replaced);
				icsHistory.old.push(replaced);
			}
			icsData.set(icsHistory.old[icsHistory.old.length - 1]);
			history.push(DEFAULT_REQUEST_ENTRY);

			replace.set(crypto.randomUUID()); // Trigger derived
			replace.set('');
		},
		remove: (index: number) => {
			const replacement = history.splice(index, 1)[0];
			icsHistory.old.splice(index + 1, icsHistory.old.length - 1);
			icsHistory.new.splice(index, icsHistory.new.length - 1);

			for (const { pattern, replacement } of history.slice(index, history.length - 1)) {
				const replaced = icsHistory.old[icsHistory.old.length - 1].replace(
					new RegExp(pattern, 'g'),
					replacement
				);
				icsHistory.new.push(replaced);
				icsHistory.old.push(replaced);
			}

			icsData.set(icsHistory.old[icsHistory.old.length - 1]);

			regex.set(crypto.randomUUID()); // Trigger derived
			regex.set(replacement.pattern);
			replace.set(crypto.randomUUID()); // Trigger derived
			replace.set(replacement.replacement);
		},
		subscribe
	};
};
export const apiRequest = createApiRequestStore();

/**
 * Checks if the regex would find more then maxMatches. If it does not replace the ics with span elements
 *  -> aka highlight matches and replacement
 * @param classString the class that the highlighted string should have
 * @param maxMatches the max amount of matches that should be displayed, default: 1000
 * @param doReplace if you should replace the wound regex with anything or just keep it.
 * @returns
 */
export const createHighLight = (classString: string, maxMatches = 1000, doReplace = false) => {
	return derived([icsData, _regex, replace], ([ics, regex, replacement], set) => {
		if ((ics.match(regex)?.length ?? 0) > maxMatches) {
			return set(escapeHtml(ics));
		}

		const highlightSecurityId = crypto.randomUUID();
		const beginHighlightSecure = `__BEGIN_HIGHLIGHT_${highlightSecurityId}__`;
		const beginHighlightElement = `<span class="${classString} highlight">`;
		const endHighlightSecure = `__END_HIGHLIGHT_${highlightSecurityId}__`;
		const endHighlightElement = '</span>';

		let secureIcs;
		// the match callback overload does not support matching groups
		if (doReplace)
			secureIcs = ics.replace(regex, `${beginHighlightSecure}${replacement}${endHighlightSecure}`);
		else
			secureIcs = ics.replace(
				regex,
				(match) => `${beginHighlightSecure}${match}${endHighlightSecure}`
			);

		const nextIcs = escapeHtml(secureIcs)
			.replaceAll(beginHighlightSecure, beginHighlightElement)
			.replaceAll(endHighlightSecure, endHighlightElement);
		set(nextIcs);
	});
};
