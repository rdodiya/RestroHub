import test from 'node:test';
import assert from 'node:assert/strict';
import { setHoneypot, setTurnstileToken, spamHeaders } from './spamState.js';

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
