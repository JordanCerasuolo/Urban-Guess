/**
 * Normalization per README: lowercase, trim, remove diacritics, remove punctuation, collapse spaces.
 * @param {string} input
 * @returns {string}
 */
export function normalizeAnswer(input) {
  const lower = String(input).trim().toLowerCase();
  const noDiacritics = lower.normalize("NFD").replace(/\p{M}/gu, "");
  const noPunct = noDiacritics.replace(/[^\p{L}\p{N}\s]/gu, " ");
  return noPunct.replace(/\s+/g, " ").trim();
}

const TRAILING_SPACE_CITY = " city";

/**
 * After normalizeAnswer: treat a trailing word "city" as optional so
 * "New York" ↔ "New York City", "Kansas" ↔ "Kansas City". Strips once;
 * collisions between distinct cities that differ only by this suffix are
 * accepted for this city-only quiz.
 * @param {string} normalized Output of normalizeAnswer
 * @returns {string}
 */
export function withoutOptionalTrailingCity(normalized) {
  const s = normalized;
  if (s.endsWith(TRAILING_SPACE_CITY)) {
    return s.slice(0, -TRAILING_SPACE_CITY.length);
  }
  return s;
}

/**
 * @param {number} tryNumber 1–3
 * @returns {number}
 */
export function pointsForTry(tryNumber) {
  if (tryNumber === 1) return 5;
  if (tryNumber === 2) return 3;
  if (tryNumber === 3) return 2;
  return 0;
}

/**
 * Raw match, normalized equality, then optional trailing "City" on both sides.
 * @param {string} raw
 * @param {string} normalizedStored
 * @param {string} canonicalName
 * @returns {boolean}
 */
export function isAnswerCorrect(raw, normalizedStored, canonicalName) {
  if (raw === canonicalName) return true;
  const n = normalizeAnswer(raw);
  if (n === normalizedStored) return true;
  return (
    withoutOptionalTrailingCity(n) ===
    withoutOptionalTrailingCity(normalizedStored)
  );
}
