const KEY = 'restroly_cookie_consent';

export function readConsent(storage) {
  try {
    const v = storage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(storage, value) {
  try {
    storage.setItem(KEY, value);
  } catch {
    // storage blocked (private mode): choice just won't persist
  }
}
