import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import QRCode from 'react-qr-code';
import api from '@services/common/api';

const UPITestModal = ({ isOpen, onClose, link }) => {
  const [testStatus, setTestStatus] = useState('idle'); // idle | loading | success | failed

  if (!link) return null;

  const upiUrl = `upi://pay?pa=${encodeURIComponent(link.upiId)}&pn=RestroHub&am=1.00&cu=INR&tn=${encodeURIComponent('Test Payment for ' + (link.name || 'RestroHub'))}`;

  const handleVerify = async () => {
    try {
      setTestStatus('loading');
      const res = await api.post('/secure/api/v1/upi-links/verify', { linkId: link.id });
      if (res.data?.success || res.data?.status === 'VERIFIED') {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    } catch (err) {
      console.error('Test verification failed:', err);
      setTestStatus('failed');
    }
  };

  const handleClose = () => {
    setTestStatus('idle');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-sm overflow-hidden rounded-2xl
            border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5 py-4">
            <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Test Payment — ₹1
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-6 text-center sm:px-6 sm:py-8">
            {/* UPI Link Info */}
            <div
              className="
                mb-5 inline-flex items-center gap-2 rounded-full
                bg-gray-50 dark:bg-gray-800 px-3 py-1.5
              "
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Testing:
              </span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                {link.upiId}
              </span>
            </div>

            {/* QR Code */}
            <div
              className="
                mx-auto inline-flex items-center justify-center
                rounded-2xl border border-gray-200 dark:border-gray-700 bg-white
                p-5 shadow-sm sm:p-6
              "
            >
              <QRCode
                value={upiUrl}
                size={180}
                level="H"
              />
            </div>

            {/* Instructions */}
            <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Scan with any UPI app to test
            </p>

            {/* UPI URL */}
            <a
              href={upiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mx-auto mt-3 flex max-w-xs items-center justify-center
                gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-2 border border-blue-200 dark:border-blue-800 dark:border-blue-800
                text-blue-700 dark:text-blue-300 transition-colors
              "
              title="Click to open in UPI App"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              <p className="truncate text-xs font-medium">{link.upiId}</p>
            </a>

            {/* Status Messages */}
            {testStatus === 'loading' && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-3">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Waiting for payment...
                </span>
              </div>
            )}

            {testStatus === 'success' && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Payment received! UPI link is working.
                </span>
              </div>
            )}

            {testStatus === 'failed' && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Payment not detected. Please try again.
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800 px-5 py-4">
            <button
              onClick={handleClose}
              className="
                flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5
                text-sm font-medium text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
              "
            >
              Close
            </button>

            {testStatus === 'idle' && (
              <button
                onClick={handleVerify}
                className="
                  flex-1 inline-flex items-center justify-center gap-2
                  rounded-lg bg-blue-50 dark:bg-blue-950/40 px-4 py-2.5
                  text-sm font-medium text-blue-700 dark:text-blue-400
                  border border-blue-200 dark:border-blue-800
                  hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors
                "
              >
                <CheckCircle2 className="h-4 w-4" />
                I've Paid — Verify
              </button>
            )}

            {testStatus === 'failed' && (
              <button
                onClick={handleVerify}
                className="
                  flex-1 inline-flex items-center justify-center gap-2
                  rounded-lg bg-blue-50 dark:bg-blue-950/40 px-4 py-2.5
                  text-sm font-medium text-blue-700 dark:text-blue-400
                  border border-blue-200 dark:border-blue-800
                  hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors
                "
              >
                Retry Verification
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default UPITestModal;