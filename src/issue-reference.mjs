/**
 * Parse a short owner/repo#number reference or an HTTPS GitHub issue URL.
 * Preserve owner and repository casing.
 * Return null for invalid input; do not coerce or trim the input.
 *
 * @param {unknown} input
 * @returns {{ owner: string, repo: string, number: number } | null}
 */
export function parseIssueReference(input) {
  if (typeof input !== 'string' || /\s/u.test(input)) return null;

  // Match raw URL text: URL normalization could hide ports or dot segments.
  const urlMatch = /^https:\/\/github\.com\/([^/\\%?#\s\u0000-\u001f\u007f]+)\/([^/\\%?#\s\u0000-\u001f\u007f]+)\/issues\/([1-9][0-9]*)$/u.exec(input);
  const match = urlMatch ?? /^([^/#\s]+)\/([^/#\s]+)#([1-9][0-9]*)$/u.exec(input);
  if (!match) return null;

  const [, owner, repo, digits] = match;
  if (repo === '.' || repo === '..') return null;
  if (urlMatch && (owner === '.' || owner === '..')) return null;

  const number = Number(digits);
  if (!Number.isSafeInteger(number)) return null;

  return { owner, repo, number };
}
