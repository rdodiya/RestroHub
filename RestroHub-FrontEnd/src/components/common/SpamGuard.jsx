import { useEffect, useRef } from 'react';
import { setHoneypot, setTurnstileToken } from '../../utils/spamState';

const MODE = import.meta.env.VITE_SPAM_PROTECTION_MODE || 'honeypot';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function SpamGuard() {
  const box = useRef(null);

  useEffect(() => {
    if (MODE !== 'turnstile' || !SITE_KEY) return undefined;
    let widgetId;
    let cancelled = false;
    const render = () => {
      if (cancelled || !box.current || !window.turnstile) return;
      widgetId = window.turnstile.render(box.current, {
        sitekey: SITE_KEY,
        callback: setTurnstileToken,
        'expired-callback': () => setTurnstileToken(''),
      });
    };
    if (window.turnstile) {
      render();
    } else {
      let s = document.querySelector(`script[src="${SCRIPT}"]`);
      if (!s) {
        s = document.createElement('script');
        s.src = SCRIPT;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener('load', render);
    }
    return () => {
      cancelled = true;
      setTurnstileToken('');
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  if (MODE === 'turnstile') return <div ref={box} className="my-2" />;

  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      onChange={(e) => setHoneypot(e.target.value)}
      className="absolute -left-[9999px] h-0 w-0 opacity-0"
    />
  );
}
