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
import { useAdminTheme } from '@context/AdminThemeContext';

const WebsiteHeader = ({ onSave }) => {
  const [status, setStatus] = useState('idle'); // idle | saving | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const { isDark } = useAdminTheme();

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
    idle: isDark
      ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30'
      : 'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-sm',
    saving: isDark
      ? 'bg-blue-900/30 text-blue-400 border-blue-800 cursor-not-allowed opacity-60'
      : 'bg-blue-400 text-white border-transparent cursor-not-allowed opacity-75',
    success: isDark
      ? 'bg-green-900/30 text-green-400 border-green-700/50'
      : 'bg-green-600 text-white border-transparent',
    error: isDark
      ? 'bg-red-900/30 text-red-400 border-red-700/50'
      : 'bg-red-600 text-white border-transparent',
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Globe className="h-5 w-5" />
          </div>
          <h2 className={`text-xl font-bold sm:text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Website Customization
          </h2>
        </div>
        <p className={`mt-1.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Configure colors, typography, brand sections, and view your live restaurant website.
        </p>
        {status === 'error' && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
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
          rounded-xl px-5 py-2.5
          text-sm font-semibold
          border transition-all duration-200
          disabled:opacity-50
          sm:w-auto
          ${btnStyle[status]}
        `}
      >
        {status === 'saving' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving Changes…
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Saved Successfully!
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
