import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectInfo } from '../src/project.mjs';

test('demo is an independent target project', () => {
  assert.deepEqual(projectInfo(), { name: 'dsh-github-harness-demo', purpose: 'independent-target', schema: 1 });
});
