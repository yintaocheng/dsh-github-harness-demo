/** Clamp finite primitive numbers to the inclusive interval [min, max]. */
export function clampNumber(value, min, max) {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('value, min, and max must be finite primitive numbers');
  }
  if (min > max) {
    throw new RangeError('min must not exceed max');
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
