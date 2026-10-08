let honeypot = '';
let turnstileToken = '';

export const setHoneypot = (v) => {
  honeypot = v;
};
export const setTurnstileToken = (v) => {
  turnstileToken = v;
};

export function spamHeaders(mode) {
  return mode === 'turnstile' ? { 'X-Turnstile-Token': turnstileToken } : { 'X-Hp': honeypot };
}

export const isGuardedRequest = (config) =>
  config?.method === 'post' && !!config.url?.includes('/public/api/v1/auth/');

// Turnstile tokens are single-use: drop the spent one and ask the widget for a new one.
export function consumeTurnstileToken(mode, win) {
  if (mode !== 'turnstile') return;
  turnstileToken = '';
  win?.turnstile?.reset?.();
}
