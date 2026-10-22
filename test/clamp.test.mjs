import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampNumber } from '../src/clamp.mjs';

test('clamps to an inclusive interval, including negatives and fractions', () => {
  for (const [value, min, max, expected] of [
    [5, 0, 10, 5],
    [-2, 0, 10, 0],
    [12, 0, 10, 10],
    [0, 0, 10, 0],
    [10, 0, 10, 10],
    [-3, -5, -1, -3],
    [-6, -5, -1, -5],
    [0, -5, -1, -1],
    [0.25, 0, 1, 0.25],
    [-0.75, -0.5, 0.5, -0.5],
    [0.75, -0.5, 0.5, 0.5],
    [Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
  ]) {
    assert.equal(clampNumber(value, min, max), expected);
  }
});

test('accepts equal bounds for values below, at, and above them', () => {
  for (const value of [-1, 2, 9]) {
    assert.equal(clampNumber(value, 2, 2), 2);
  }
});

test('rejects non-finite or non-primitive numbers in every argument', () => {
  const invalid = [
    NaN, Infinity, -Infinity, '2', null, undefined, {}, [],
    new Number(2), true, false, 2n, Symbol('number'), () => 2,
  ];
  for (const bad of invalid) {
    for (let index = 0; index < 3; index++) {
      const args = [1, 0, 2];
      args[index] = bad;
      assert.throws(() => clampNumber(...args), TypeError);
    }
  }
  assert.throws(() => clampNumber(), TypeError);
  assert.throws(() => clampNumber(1), TypeError);
  assert.throws(() => clampNumber(1, 0), TypeError);
});

test('rejects reversed bounds after validating argument types', () => {
  assert.throws(() => clampNumber(1, 3, 2), RangeError);
  assert.throws(() => clampNumber(-3, -1, -5), RangeError);
  assert.throws(() => clampNumber(NaN, 3, 2), TypeError);
});
