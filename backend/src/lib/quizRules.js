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
 * Raw match then normalized match against city.
 * @param {string} raw
 * @param {string} normalizedStored
 * @param {string} canonicalName
 * @returns {boolean}
 */
export function isAnswerCorrect(raw, normalizedStored, canonicalName) {
  if (raw === canonicalName) return true;
  return normalizeAnswer(raw) === normalizedStored;
}
