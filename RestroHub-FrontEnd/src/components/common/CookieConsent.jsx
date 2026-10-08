import { useState } from 'react';
import { Link } from 'react-router-dom';
import { readConsent, writeConsent } from '../../utils/consent';
import { initAnalytics } from '../../utils/analytics';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => (GA_ID ? readConsent(window.localStorage) : 'denied'));

  if (choice === 'granted') initAnalytics(window, document, GA_ID);
  if (choice) return null;

  const decide = (value) => {
    writeConsent(window.localStorage, value);
    setChoice(value);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700 dark:text-slate-200">
          We use cookies for anonymous analytics to improve Restroly. See our{' '}
          <Link to="/privacy-policy" className="font-medium underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
