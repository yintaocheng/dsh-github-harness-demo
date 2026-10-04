import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeChecks } from '../src/check-summary.mjs';

test('summarizes all passing checks', () => {
  assert.deepEqual(summarizeChecks([
    { name: 'unit', code: 0 },
    { name: ' lint ', code: -0 },
  ]), { total: 2, passed: 2, failed: 0, ok: true });
});

test('summarizes mixed passing and failing checks', () => {
  assert.deepEqual(summarizeChecks([
    { name: 'unit', code: 0 },
    { name: 'lint', code: 1 },
    { name: 'build', code: -2 },
  ]), { total: 3, passed: 1, failed: 2, ok: false });
});

test('summarizes all failing checks', () => {
  assert.deepEqual(summarizeChecks([
    { name: 'unit', code: 2 },
    { name: 'lint', code: -1 },
  ]), { total: 2, passed: 0, failed: 2, ok: false });
});

test('summarizes an empty array', () => {
  assert.deepEqual(summarizeChecks([]), {
    total: 0, passed: 0, failed: 0, ok: true,
  });
});

test('rejects non-array inputs', () => {
  for (const input of [undefined, null, {}, { length: 0 }, 'checks', 0, true, new Set()]) {
    assert.throws(() => summarizeChecks(input), TypeError);
  }
});

test('rejects invalid members, including holes in sparse arrays', () => {
  for (const member of [undefined, null, [], 'unit', 0, true, () => {}]) {
    assert.throws(() => summarizeChecks([member]), TypeError);
  }
  assert.throws(() => summarizeChecks(new Array(1)), TypeError);
});

test('rejects missing, blank, and non-string names', () => {
  assert.throws(() => summarizeChecks([{ code: 0 }]), TypeError);
  for (const name of [undefined, null, '', ' ', '\t\n\r', '\u00a0', 1, true, {}, [], new String('unit')]) {
    assert.throws(() => summarizeChecks([{ name, code: 0 }]), TypeError);
  }
});

test('rejects missing and non-integer codes', () => {
  assert.throws(() => summarizeChecks([{ name: 'unit' }]), TypeError);
  for (const code of [undefined, null, '0', false, 0.5, -1.5, NaN, Infinity, -Infinity, {}, [], 0n, new Number(0)]) {
    assert.throws(() => summarizeChecks([{ name: 'unit', code }]), TypeError);
  }
});

test('does not modify the input array or its members', () => {
  const first = Object.freeze({ name: ' unit ', code: 0 });
  const second = Object.freeze({ name: 'lint', code: 1 });
  const checks = Object.freeze([first, second]);

  assert.deepEqual(summarizeChecks(checks), {
    total: 2, passed: 1, failed: 1, ok: false,
  });
  assert.deepEqual(checks, [
    { name: ' unit ', code: 0 },
    { name: 'lint', code: 1 },
  ]);
  assert.strictEqual(checks[0], first);
  assert.strictEqual(checks[1], second);
});

test('does not modify input when a later member is invalid', () => {
  const checks = [{ name: ' unit ', code: 0 }, { name: 'lint', code: '1' }];
  const original = structuredClone(checks);
  const members = [...checks];

  assert.throws(() => summarizeChecks(checks), TypeError);
  assert.deepEqual(checks, original);
  assert.strictEqual(checks[0], members[0]);
  assert.strictEqual(checks[1], members[1]);
});
