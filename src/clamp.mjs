/** Clamp finite primitive numbers to the inclusive interval [min, max]. */
export function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    throw new TypeError('value must be a finite primitive number');
  }
  if (!Number.isFinite(min)) {
    throw new TypeError('min must be a finite primitive number');
  }
  if (!Number.isFinite(max)) {
    throw new TypeError('max must be a finite primitive number');
  }
  if (min > max) {
    throw new RangeError('min must not exceed max');
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
