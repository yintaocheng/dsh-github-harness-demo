export function summarizeChecks(checks) {
  if (!Array.isArray(checks)) {
    throw new TypeError('checks must be an array');
  }

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    if (check === null || typeof check !== 'object' || Array.isArray(check)) {
      throw new TypeError('each check must be an object');
    }

    const { name, code } = check;
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new TypeError('check name must be a non-blank string');
    }
    if (!Number.isInteger(code)) {
      throw new TypeError('check code must be an integer');
    }

    if (code === 0) {
      passed += 1;
    } else {
      failed += 1;
    }
  }

  return { total: passed + failed, passed, failed, ok: failed === 0 };
}
