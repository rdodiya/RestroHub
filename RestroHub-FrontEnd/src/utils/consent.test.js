import test from 'node:test';
import assert from 'node:assert/strict';
import { readConsent, writeConsent } from './consent.js';

const mem = () => {
  const m = {};
  return {
    getItem: (k) => m[k] ?? null,
    setItem: (k, v) => {
      m[k] = v;
    },
  };
};
const blocked = {
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
};

test('round-trips granted/denied and ignores junk', () => {
  const s = mem();
  assert.equal(readConsent(s), null);
  writeConsent(s, 'granted');
  assert.equal(readConsent(s), 'granted');
  s.setItem('restroly_cookie_consent', 'banana');
  assert.equal(readConsent(s), null);
});

test('never throws when storage is blocked', () => {
  assert.equal(readConsent(blocked), null);
  assert.doesNotThrow(() => writeConsent(blocked, 'denied'));
});
