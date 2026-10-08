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
