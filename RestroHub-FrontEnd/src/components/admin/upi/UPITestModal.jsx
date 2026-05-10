import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import QRCode from 'react-qr-code';

const UPITestModal = ({ isOpen, onClose, link }) => {
  const [testStatus, setTestStatus] = useState('idle'); // idle | loading | success | failed

  if (!link) return null;

  const upiUrl = `upi://pay?pa=${link.upiId}&pn=Restroly&am=1&cu=INR`;

  const handleVerify = async () => {
    try {
      setTestStatus('loading');
      // 🔌 await api.post('/api/upi/verify', { linkId: link.id });
      await new Promise((r) => setTimeout(r, 2000));
      setTestStatus('success');
    } catch (err) {
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
            border border-gray-200 bg-white shadow-xl
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Test Payment — ₹1
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600
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
                bg-gray-50 px-3 py-1.5
              "
            >
              <span className="text-xs font-medium text-gray-500">
                Testing:
              </span>
              <span className="text-xs font-semibold text-gray-800">
                {link.upiId}
              </span>
            </div>

            {/* QR Code */}
            <div
              className="
                mx-auto inline-flex items-center justify-center
                rounded-2xl border border-gray-200 bg-gray-50
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
            <p className="mt-4 text-sm font-medium text-gray-700">
              Scan with any UPI app to test
            </p>

            {/* UPI URL */}
            <div
              className="
                mx-auto mt-3 flex max-w-xs items-center justify-center
                gap-1.5 rounded-lg bg-gray-50 px-3 py-2
              "
            >
              <ExternalLink className="h-3 w-3 shrink-0 text-gray-400" />
              <p className="truncate text-xs text-gray-500">{link.upiId}</p>
            </div>

            {/* Status Messages */}
            {testStatus === 'loading' && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-3">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
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
          <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4">
            <button
              onClick={handleClose}
              className="
                flex-1 rounded-lg border border-gray-200 px-4 py-2.5
                text-sm font-medium text-gray-700
                hover:bg-gray-50 transition-colors
              "
            >
              Close
            </button>

            {testStatus === 'idle' && (
              <button
                onClick={handleVerify}
                className="
                  flex-1 inline-flex items-center justify-center gap-2
                  rounded-lg bg-blue-50 px-4 py-2.5
                  text-sm font-medium text-blue-700
                  border border-blue-200
                  hover:bg-blue-100 transition-colors
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
                  rounded-lg bg-blue-50 px-4 py-2.5
                  text-sm font-medium text-blue-700
                  border border-blue-200
                  hover:bg-blue-100 transition-colors
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