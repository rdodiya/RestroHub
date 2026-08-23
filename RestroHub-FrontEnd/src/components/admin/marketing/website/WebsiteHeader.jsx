/**
 * WebsiteHeader.jsx
 * Path: src/components/admin/marketing/website/WebsiteHeader.jsx
 *
 * CHANGES FROM ORIGINAL:
 *  1. Save button shows a success toast / green flash after a successful save.
 *  2. Error state shown inline if save fails.
 *  3. onSave prop is now async-aware (Website.jsx passes an async function).
 */

import { useState } from 'react';
import { Save, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const WebsiteHeader = ({ onSave }) => {
  const [status, setStatus] = useState('idle'); // idle | saving | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    try {
      setStatus('saving');
      setErrorMsg('');
      await onSave?.();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setErrorMsg(err?.message || 'Save failed. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const btnStyle = {
    idle:    'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    saving:  'bg-blue-50 text-blue-400 border-blue-100 cursor-not-allowed opacity-60',
    success: 'bg-green-50 text-green-700 border-green-200',
    error:   'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <Globe className="hidden h-6 w-6 text-blue-600 sm:block" />
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Website Customization
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Choose templates and color themes for your restaurant website
        </p>
        {status === 'error' && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMsg}
          </p>
        )}
      </div>

      {/* Right */}
      <button
        onClick={handleSave}
        disabled={status === 'saving'}
        className={`
          inline-flex w-full items-center justify-center gap-2
          rounded-lg px-5 py-2.5
          text-sm font-medium
          border transition-colors
          disabled:opacity-50
          sm:w-auto
          ${btnStyle[status]}
        `}
      >
        {status === 'saving' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Saved!
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="h-4 w-4" />
            Retry Save
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
};

export default WebsiteHeader;
