import test from 'node:test';
import assert from 'node:assert/strict';
import {
  setHoneypot,
  setTurnstileToken,
  spamHeaders,
  isGuardedRequest,
  consumeTurnstileToken,
} from './spamState.js';

test('honeypot mode sends X-Hp with the current field value', () => {
  setHoneypot('');
  assert.deepEqual(spamHeaders('honeypot'), { 'X-Hp': '' });
  setHoneypot('bot');
  assert.deepEqual(spamHeaders('honeypot'), { 'X-Hp': 'bot' });
});

test('turnstile mode sends the token instead', () => {
  setTurnstileToken('tok');
  assert.deepEqual(spamHeaders('turnstile'), { 'X-Turnstile-Token': 'tok' });
});

test('isGuardedRequest matches only POSTs to public auth', () => {
  assert.equal(isGuardedRequest({ method: 'post', url: '/public/api/v1/auth/login' }), true);
  assert.equal(isGuardedRequest({ method: 'get', url: '/public/api/v1/auth/login' }), false);
  assert.equal(isGuardedRequest({ method: 'post', url: '/secure/api/x' }), false);
  assert.equal(isGuardedRequest({}), false);
});

test('consumeTurnstileToken clears token and resets widget in turnstile mode only', () => {
  let resets = 0;
  setTurnstileToken('tok');
  consumeTurnstileToken('honeypot', { turnstile: { reset: () => resets++ } });
  assert.deepEqual(spamHeaders('turnstile'), { 'X-Turnstile-Token': 'tok' });
  assert.equal(resets, 0);
  consumeTurnstileToken('turnstile', { turnstile: { reset: () => resets++ } });
  assert.deepEqual(spamHeaders('turnstile'), { 'X-Turnstile-Token': '' });
  assert.equal(resets, 1);
  assert.doesNotThrow(() => consumeTurnstileToken('turnstile', {}));
  assert.doesNotThrow(() => consumeTurnstileToken('turnstile', undefined));
});
