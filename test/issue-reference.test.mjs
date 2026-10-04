import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseIssueReference } from '../src/issue-reference.mjs';

function assertRejected(inputs) {
  for (const input of inputs) {
    assert.equal(parseIssueReference(input), null, `Expected rejection: ${String(input)}`);
  }
}

test('parses short references and preserves owner and repo casing', () => {
  assert.deepEqual(parseIssueReference('owner/repo#123'), {
    owner: 'owner', repo: 'repo', number: 123,
  });
  assert.deepEqual(parseIssueReference('Some-Owner/My_Repo.js#42'), {
    owner: 'Some-Owner', repo: 'My_Repo.js', number: 42,
  });
});

test('accepts the positive safe integer boundaries', () => {
  assert.deepEqual(parseIssueReference('a/b#1'), { owner: 'a', repo: 'b', number: 1 });
  assert.deepEqual(parseIssueReference('a/b#9007199254740991'), {
    owner: 'a', repo: 'b', number: Number.MAX_SAFE_INTEGER,
  });
});

test('rejects non-string inputs without coercion', () => {
  assertRejected([
    undefined, null, true, false, 123, 1n, NaN, Infinity,
    {}, [], ['owner/repo#1'], new String('owner/repo#1'), Symbol('reference'),
  ]);
  assert.equal(parseIssueReference({
    toString() { throw new Error('Input must not be coerced'); },
  }), null);
});

test('rejects whitespace anywhere, including trailing line terminators', () => {
  for (const whitespace of [' ', '\t', '\n', '\r', '\r\n', '\v', '\f', '\u00a0', '\u2003', '\u2028', '\u2029', '\ufeff']) {
    assertRejected([
      `${whitespace}owner/repo#1`, `owner/repo#1${whitespace}`,
      `ow${whitespace}ner/repo#1`, `owner/re${whitespace}po#1`,
      `owner/${whitespace}repo#1`, `owner/repo${whitespace}#1`,
      `owner/repo#${whitespace}1`, `owner/repo#1${whitespace}2`,
    ]);
  }
});

test('rejects empty or missing fields and repeated separators', () => {
  assertRejected([
    '', 'owner', 'owner/repo', '#1', '/repo#1', 'owner/#1', 'owner/repo#',
    '/#1', 'ownerrepo#1', 'owner/repo##1', 'owner#extra/repo#1',
    'owner/repo#1#2', 'owner//repo#1',
  ]);
});

test('rejects zero, leading zeros, non-decimal integers, and unsafe numbers', () => {
  const invalidNumbers = [
    '0', '00', '01', '0123', '-1', '+1', '1.0', '1.5', '.5', '1e3', '0x10',
    '1_000', 'NaN', 'Infinity', '１２３', '١', '123abc',
    '9007199254740992', '9007199254740993', '99999999999999999999', '9'.repeat(400),
  ];
  assertRejected(invalidNumbers.map((number) => `owner/repo#${number}`));
  assertRejected(invalidNumbers.map((number) => `https://github.com/owner/repo/issues/${number}`));
});

test('rejects extra short-reference paths and non-issue URLs', () => {
  assertRejected([
    '/owner/repo#1', 'owner/repo/extra#1', 'extra/owner/repo#1',
    'owner/repo/#1', 'owner/repo#1/extra',
    'https://github.com/owner/repo#1',
    'http://github.com/owner/repo#1', '//github.com/owner/repo#1',
  ]);
});

test('parses HTTPS GitHub issue URLs with preserved casing and safe boundaries', () => {
  for (const number of [1, 123, Number.MAX_SAFE_INTEGER]) {
    assert.deepEqual(parseIssueReference(`https://github.com/Some-Owner/My_Repo.js/issues/${number}`), {
      owner: 'Some-Owner', repo: 'My_Repo.js', number,
    });
  }
  assert.deepEqual(parseIssueReference('https://github.com/owner/.github/issues/1'), {
    owner: 'owner', repo: '.github', number: 1,
  });
});

test('rejects URL schemes, hosts, credentials, and explicit ports outside the contract', () => {
  assertRejected([
    'http://github.com/owner/repo/issues/1',
    'ftp://github.com/owner/repo/issues/1',
    '//github.com/owner/repo/issues/1',
    'https://example.com/owner/repo/issues/1',
    'https://www.github.com/owner/repo/issues/1',
    'https://github.com.example.com/owner/repo/issues/1',
    'https://github.com./owner/repo/issues/1',
    'https://user@github.com/owner/repo/issues/1',
    'https://user:password@github.com/owner/repo/issues/1',
    'https://@github.com/owner/repo/issues/1',
    'https://github.com:443/owner/repo/issues/1',
    'https://github.com:8080/owner/repo/issues/1',
    'https://github.com:/owner/repo/issues/1',
  ]);
});

test('rejects URL queries, fragments, and anything but the exact issue path', () => {
  const base = 'https://github.com';
  assertRejected([
    '/owner/repo/issues/1?foo=bar', '/owner/repo/issues/1?',
    '/owner/repo/issues/1#comment', '/owner/repo/issues/1#',
    '/owner/repo/issues/1/', '/owner/repo/issues/1/extra',
    '/owner/repo/pull/1', '/owner/repo/Issues/1',
    '//repo/issues/1', '/owner//issues/1', '/owner/repo/issues/',
    '/extra/owner/repo/issues/1', '/owner/repo/extra/../issues/1',
    '/./repo/issues/1', '/../repo/issues/1', '/owner/./issues/1', '/owner/../issues/1',
    '/own%65r/repo/issues/1', '/owner/re%70o/issues/1',
    '/owner/repo/%69ssues/1', '/owner/repo/issues/%31',
    '/owner/re%2fpo/issues/1', '/owner/%2e%2e/issues/1', '/owner/re%ZZpo/issues/1',
    '/own?er/repo/issues/1', '/owner/re#po/issues/1',
    '/owner/re\\po/issues/1', '/owner/re\u0000po/issues/1',
  ].map((path) => `${base}${path}`));
});

test('rejects whitespace in and around issue URLs without trimming', () => {
  for (const whitespace of [' ', '\t', '\r', '\n', '\u00a0', '\u2028', '\ufeff']) {
    assertRejected([
      `${whitespace}https://github.com/owner/repo/issues/1`,
      `https://github.com/owner/repo/issues/1${whitespace}`,
      `https://github.com/ow${whitespace}ner/repo/issues/1`,
      `https://github.com/owner/re${whitespace}po/issues/1`,
      `https://github.com/owner/repo/issues/${whitespace}1`,
    ]);
  }
});

test('rejects dot and dot-dot repository names', () => {
  assertRejected(['owner/.#1', 'owner/..#1']);
  assert.deepEqual(parseIssueReference('owner/.github#1'), {
    owner: 'owner', repo: '.github', number: 1,
  });
});
