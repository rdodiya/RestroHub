import { useState } from 'react';
import { X, Loader2, CreditCard, Info, AlertCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import api from '@services/common/api';

const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

const UPIFormModal = ({ isOpen, branchId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', upiId: '', isDefault: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name?.trim()) {
      setError('Please enter an account name.');
      return;
    }

    const trimmedUpi = formData.upiId?.trim();
    if (!trimmedUpi || !UPI_REGEX.test(trimmedUpi)) {
      setError('Please enter a valid UPI ID (e.g., restaurant@okicici, merchant@paytm).');
      return;
    }

    if (!branchId) {
      setError('Branch information is missing. Please reload the page.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/secure/api/v1/upi-links', {
        branchId: Number(branchId),
        name: formData.name.trim(),
        upiId: trimmedUpi,
        isDefault: Boolean(formData.isDefault)
      });

      setFormData({ name: '', upiId: '', isDefault: false });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to create UPI link:', err.response?.data || err);
      setError(
        err.response?.data?.message ||
        'Failed to add UPI link. Please verify the details and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setError('');
    setFormData({ name: '', upiId: '', isDefault: false });
    onClose();
  };

  const inputClass = `
    w-full rounded-lg border border-gray-200 bg-white
    px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
    outline-none transition-all
    focus:border-blue-300 focus:ring-2 focus:ring-blue-100
  `;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
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
              onClick={handleClose}
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
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g., Main Account, PhonePe Merchant"
                  required
                />
              </div>

              {/* UPI ID */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) =>
                    setFormData({ ...formData, upiId: e.target.value })
                  }
                  className={inputClass}
                  placeholder="yourname@paytm or 9876543210@ybl"
                  required
                />
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-500">
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
                  Enter your VPA / UPI ID from GPay, PhonePe, Paytm, BHIM, etc.
                </p>
              </div>

              {/* Is Default Checkbox */}
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="font-medium">Set as default payment handle</span>
              </label>

              {/* Info Box */}
              <div
                className="
                  rounded-lg border border-blue-100 bg-blue-50 p-3
                "
              >
                <p className="text-xs leading-relaxed text-blue-700">
                  <strong className="font-semibold">Note:</strong> Setting as default will automatically route all table QR code customer payments to this UPI account.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={handleClose}
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
                  rounded-lg bg-blue-600 px-4 py-2.5
                  text-sm font-semibold text-white shadow-sm
                  hover:bg-blue-700 transition-colors
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