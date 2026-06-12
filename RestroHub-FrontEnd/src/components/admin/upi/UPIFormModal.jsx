import { useState } from 'react';
import { X, Loader2, CreditCard, Info } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const UPIFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', upiId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // client-side validation
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Account name is required';
    if (!formData.upiId.trim()) errs.upiId = 'UPI ID is required';
    else if (!/^[\w.+-]+@[\w-]+$/.test(formData.upiId.trim())) errs.upiId = 'Enter a valid UPI ID';

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      setFieldErrors({});
      // 🔌 await api.post('/api/upi-links', formData);
      await new Promise((r) => setTimeout(r, 500));
      console.log('Add UPI:', formData);
      onClose();
      setFormData({ name: '', upiId: '' });
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `
    w-full rounded-lg border border-gray-200 bg-white
    px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
    outline-none transition-all
    focus:border-blue-300 focus:ring-2 focus:ring-blue-100
  `;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-md overflow-hidden rounded-2xl
            border border-gray-200 bg-white shadow-xl
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <Dialog.Title className="text-lg font-bold text-gray-900">
                Add UPI Link
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600
                transition-colors
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 px-5 py-5 sm:px-6">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setFieldErrors((p) => ({ ...p, name: undefined }));
                  }}
                  className={`${fieldErrors.name ? 'border-red-500' : 'border-gray-200'} ${inputClass}`}
                  placeholder="e.g., Main Account"
                  aria-required="true"
                  aria-invalid={fieldErrors.name ? 'true' : 'false'}
                  aria-describedby={fieldErrors.name ? 'err-upi-name' : undefined}
                />
                {fieldErrors.name && <p id="err-upi-name" className="mt-1.5 text-xs text-red-500">{fieldErrors.name}</p>}
              </div>

              {/* UPI ID */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => {
                    setFormData({ ...formData, upiId: e.target.value });
                    setFieldErrors((p) => ({ ...p, upiId: undefined }));
                  }}
                  className={`${fieldErrors.upiId ? 'border-red-500' : 'border-gray-200'} ${inputClass}`}
                  placeholder="yourname@paytm"
                  aria-required="true"
                  aria-invalid={fieldErrors.upiId ? 'true' : 'false'}
                  aria-describedby={fieldErrors.upiId ? 'err-upi-id' : undefined}
                />
                {fieldErrors.upiId && <p id="err-upi-id" className="mt-1.5 text-xs text-red-500">{fieldErrors.upiId}</p>}
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-500">
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
                  Enter your UPI ID from Paytm, PhonePe, GPay, etc.
                </p>
              </div>

              {/* Info Box */}
              <div
                className="
                  rounded-lg border border-blue-100 bg-blue-50 p-3
                "
              >
                <p className="text-xs leading-relaxed text-blue-700">
                  <strong className="font-semibold">Note:</strong> After
                  adding, we recommend testing with a ₹1 transaction to verify
                  the UPI link is working correctly.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="
                  flex-1 rounded-lg border border-gray-200 px-4 py-2.5
                  text-sm font-medium text-gray-700
                  hover:bg-gray-50 transition-colors
                  disabled:opacity-50
                "
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="
                  flex-1 inline-flex items-center justify-center gap-2
                  rounded-lg bg-blue-50 px-4 py-2.5
                  text-sm font-medium text-blue-700
                  border border-blue-200
                  hover:bg-blue-100 transition-colors
                  disabled:opacity-50
                "
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Add UPI Link
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default UPIFormModal;