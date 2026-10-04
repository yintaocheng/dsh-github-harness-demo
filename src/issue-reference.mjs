/**
 * Parse a short owner/repo#number reference, preserving name casing.
 * Return null for invalid input; do not coerce or trim the input.
 *
 * @param {unknown} input
 * @returns {{ owner: string, repo: string, number: number } | null}
 */
export function parseIssueReference(input) {
  if (typeof input !== 'string' || /\s/u.test(input)) return null;

  const match = /^([^/#\s]+)\/([^/#\s]+)#([1-9][0-9]*)$/u.exec(input);
  if (!match) return null;

  const [, owner, repo, digits] = match;
  if (repo === '.' || repo === '..') return null;

  const number = Number(digits);
  if (!Number.isSafeInteger(number)) return null;

  return { owner, repo, number };
}
