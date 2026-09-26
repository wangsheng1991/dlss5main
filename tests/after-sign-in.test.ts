/**
 * `?next=` is read from the URL and handed to the router after a successful sign-in, so it is
 * attacker-controlled input that decides where the browser goes. These cases pin down that only a
 * same-site path survives; everything else lands on the dashboard.
 *
 * The backslash case is the one worth keeping: `/\evil.com` looks like a path, but browsers rewrite
 * `\` to `/` when the URL reaches the address bar or a reload, which turns it into a
 * protocol-relative redirect after the fact.
 */

import assert from 'node:assert/strict';

import { DEFAULT_AFTER_SIGN_IN, afterSignInPath } from '../src/lib/after-sign-in';

import { test } from './harness';

test('a same-site path is honoured, which is how /download gets its reader back', () => {
  assert.equal(afterSignInPath('/download'), '/download');
  assert.equal(afterSignInPath('/download?lng=zh-CN'), '/download?lng=zh-CN');
  assert.equal(afterSignInPath('/dashboard'), '/dashboard');
});

test('a missing or empty next lands on the dashboard', () => {
  assert.equal(afterSignInPath(null), DEFAULT_AFTER_SIGN_IN);
  assert.equal(afterSignInPath(undefined), DEFAULT_AFTER_SIGN_IN);
  assert.equal(afterSignInPath(''), DEFAULT_AFTER_SIGN_IN);
  assert.equal(afterSignInPath('/'), '/');
});

test('an absolute URL is refused', () => {
  for (const value of ['https://evil.com', 'http://evil.com/download', 'javascript:alert(1)', 'evil.com']) {
    assert.equal(afterSignInPath(value), DEFAULT_AFTER_SIGN_IN, value);
  }
});

test('a protocol-relative path is refused', () => {
  assert.equal(afterSignInPath('//evil.com'), DEFAULT_AFTER_SIGN_IN);
  assert.equal(afterSignInPath('//evil.com/download'), DEFAULT_AFTER_SIGN_IN);
});

test('a path that a browser would later rewrite into a redirect is refused', () => {
  assert.equal(afterSignInPath('/\\evil.com'), DEFAULT_AFTER_SIGN_IN);
  assert.equal(afterSignInPath('/download\\..\\..//evil.com'), DEFAULT_AFTER_SIGN_IN);
});

test('whitespace and control characters cannot smuggle the checks above', () => {
  assert.equal(afterSignInPath(' /download'), '/download'); // trimmed, then accepted
  assert.equal(afterSignInPath('\t//evil.com'), DEFAULT_AFTER_SIGN_IN);
  assert.equal(afterSignInPath('/down\u0000load'), DEFAULT_AFTER_SIGN_IN);
  assert.equal(afterSignInPath('/down load'), DEFAULT_AFTER_SIGN_IN);
});

test('the caller can name its own fallback', () => {
  assert.equal(afterSignInPath('//evil.com', '/'), '/');
});
