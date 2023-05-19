import { derived, writable, get } from "svelte/store";
import type { SimpleReplacement } from "./ApiRequest/Api";
import { escapeHtml } from "./util";

export const icsData = writable("");
export const regex = writable("");
let lastValidRegex: RegExp = null;
const _regex = derived(regex, (regexString) => {
  try {
    lastValidRegex = new RegExp(regexString, "g");
  } catch (e) {
    console.warn("The regex contains an error. Ignore...");
  }
  return lastValidRegex;
});
export const replace = writable("");

export const newIcsData = derived(
  [icsData, _regex, replace],
  ([ics, regex, replacement]) => (regex ? ics.replace(regex, replacement) : ics)
);

const createApiRequestStore = () => {
  let last: SimpleReplacement[] = [];
  const { subscribe } = derived(
    [_regex, replace],
    ([{ source }, replacement]) => {
      last[0] = {
        mode: "globalRegex",
        replacement,
        pattern: source,
      };
      return last;
    }
  );

  return {
    addReg: () => {
      last = [null, ...last];
      icsData.set(get(newIcsData));
      const currentReplace = get(replace);
      replace.set("x"); // This is very ugly but it will update this current store by updating the origin stores.
      replace.set(currentReplace); // Need to set "x" and then remove to ignore sveltes default destinctUntilChange I guess
    },
    remove: (index: number) => {
      last = last.slice(0, index).concat(last.slice(index + 1));
      const currentReplace = get(replace);
      replace.set("x");
      replace.set(currentReplace);
    },
    subscribe,
  };
};
export const apiRequest = createApiRequestStore();

/**
 * Checks if the regex would find more then maxMatches. If it does not replace the ics with span elements
 *  -> aka highlight matches and replacement
 * @param classString the class that the highlighted string should have
 * @param maxMatches the max amount of matches that should be displayed
 * @param doReplace if you should replace the wound regex with anything or just keep it.
 * @returns
 */
export const createHighLight = (
  classString: string,
  maxMatches = 1000,
  doReplace = false
) => {
  return derived(
    [icsData, _regex, replace],
    ([ics, regex, replacement], set) => {
      if (ics.match(regex)?.length > maxMatches) {
        set(escapeHtml(ics));
        return;
      }

      let highlightSecurityId = crypto.randomUUID();
      let beginHighlightSecure = `__BEGIN_HIGHLIGHT_${highlightSecurityId}__`;
      let beginHighlightElement = `<span class="${classString} highlight">`
      let endHighlightSecure = `__END_HIGHLIGHT_${highlightSecurityId}__`;
      let endHighlightElement = "</span>";
      
      let secureIcs;
      // the match callback overload does not support matching groups
      if (doReplace) secureIcs = ics.replace(regex, `${beginHighlightSecure}${replacement}${endHighlightSecure}`)
      else secureIcs = ics.replace(regex, (match) => `${beginHighlightSecure}${match}${endHighlightSecure}`);

      let nextIcs = escapeHtml(secureIcs)
        .replaceAll(beginHighlightSecure, beginHighlightElement)
        .replaceAll(endHighlightSecure, endHighlightElement)
      set(nextIcs);
    }
  );
};
