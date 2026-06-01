import { useEffect, useState } from 'react';
import { X, Loader2, LayoutGrid } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import api from '@services/common/api';

const TableFormModal = ({ isOpen, onClose, onSaved, branchId, editingTable }) => {
  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    status: 'available',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingTable) {
      setFormData({
        number: editingTable.number || '',
        capacity: editingTable.capacity || '',
        status: editingTable.status || 'available',
        isActive: editingTable.isActive !== false,
      });
    } else {
      setFormData({ number: '', capacity: '', status: 'available', isActive: true });
    }
    setError(null);
  }, [editingTable, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        tableNumber: Number(formData.number),
        capacity: Number(formData.capacity),
        status: formData.status,
        isActive: formData.isActive,
      };

      if (editingTable) {
        await api.put(`/secure/api/v1/tables/${editingTable.id}`, payload);
      } else {
        await api.post(`/secure/api/v1/branches/${branchId}/tables`, payload);
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error('Failed:', err);
      setError(err.response?.data?.message || 'Failed to save table');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <LayoutGrid className="h-5 w-5 text-blue-600" />
              </div>
              <Dialog.Title className="text-lg font-bold text-gray-900">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 px-5 py-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Table Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.number}
                  onChange={(e) => updateField('number', e.target.value)}
                  className={inputClass}
                  placeholder="9"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => updateField('capacity', e.target.value)}
                  className={inputClass}
                  placeholder="4"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className={inputClass}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
              {editingTable && (
                <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="text-sm font-medium text-gray-800">Active table</span>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => updateField('isActive', e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600" />
                    <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="
                  flex-1 rounded-lg border border-gray-200 px-4 py-2.5
                  text-sm font-medium text-gray-700
                  hover:bg-gray-50 disabled:opacity-50
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
                  hover:bg-blue-100 disabled:opacity-50
                "
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingTable ? 'Update Table' : 'Add Table'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TableFormModal;
