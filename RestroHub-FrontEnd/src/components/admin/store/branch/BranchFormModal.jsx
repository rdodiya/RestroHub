import { useState, useEffect } from 'react';
import {
  X, Loader2, MapPin, Building2, FileText,
  MapPinned, Globe, Hash, Phone, Clock
} from 'lucide-react';
import { Dialog } from '@headlessui/react';
import api from "@services/common/api";
import toast from 'react-hot-toast';

const BranchFormModal = ({ isOpen, onClose, editingBranch, restaurantId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // Address fields (nested in DTO)
    add1: '',
    add2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    // Optional
    menuId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ========== POPULATE FORM ON EDIT ==========
  useEffect(() => {
    if (editingBranch) {
      setFormData({
        name: editingBranch.name || '',
        description: editingBranch.description || '',
        // Address from nested object
        add1: editingBranch.address?.add1 || '',
        add2: editingBranch.address?.add2 || '',
        city: editingBranch.address?.city || '',
        state: editingBranch.address?.state || '',
        country: editingBranch.address?.country || 'India',
        postalCode: editingBranch.address?.postalCode || '',
        // Menu
        menuId: editingBranch.menu?.menuId || '',
      });
    } else {
      // Reset form for new branch
      setFormData({
        name: '',
        description: '',
        add1: '',
        add2: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        menuId: '',
      });
    }
    setError(null);
  }, [editingBranch, isOpen]);

  // ========== SUBMIT HANDLER ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Build payload matching BranchRequestDTO
      const payload = {
        name: formData.name,
        description: formData.description,
        restaurantId: restaurantId,
        address: {
          add1: formData.add1,
          add2: formData.add2 || null,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        menuId: formData.menuId ? Number(formData.menuId) : null,
        isDelete: false,
      };

      if (editingBranch) {
        // UPDATE
        await api.put(`/secure/api/v1/branches/${editingBranch.branchId}`, payload);
      } else {
        // CREATE
        await api.post('/secure/api/v1/branches', payload);
      }

      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Save failed');
      const message = err.response?.data?.message || 'Failed to save branch';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ========== UPDATE FIELD HELPER ==========
  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ========== RENDER ==========
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm"
           aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border
                                 border-gray-100 max-h-[92vh] overflow-hidden flex flex-col">

          {/* ========== GRADIENT HEADER ========== */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5
                          flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <Dialog.Title className="text-xl font-bold text-white">
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* ========== FORM BODY (scrollable) ========== */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-6">

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* ========== BASIC INFO SECTION ========== */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider
                               flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Basic Information
                </h3>

                {/* Branch Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    Branch Name
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               focus:bg-white outline-none transition-all text-gray-800
                               placeholder:text-gray-400"
                    placeholder="e.g., Main Branch, Downtown Outlet"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               focus:bg-white outline-none transition-all text-gray-800
                               placeholder:text-gray-400 resize-none"
                    placeholder="Brief description of this branch..."
                    rows={2}
                    maxLength={500}
                  />
                </div>
              </div>

              {/* ========== ADDRESS SECTION ========== */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider
                               flex items-center gap-2">
                  <MapPinned className="w-4 h-4" />
                  Address Details
                </h3>

                {/* Address Line 1 */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Address Line 1
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.add1}
                    onChange={(e) => updateField('add1', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               focus:bg-white outline-none transition-all text-gray-800
                               placeholder:text-gray-400"
                    placeholder="Street address, building number"
                    required
                    maxLength={255}
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Address Line 2
                    <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.add2}
                    onChange={(e) => updateField('add2', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               focus:bg-white outline-none transition-all text-gray-800
                               placeholder:text-gray-400"
                    placeholder="Apartment, suite, floor (optional)"
                    maxLength={255}
                  />
                </div>

                {/* City + State (side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Building2 className="w-4 h-4 text-green-500" />
                      City
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 focus:bg-white outline-none transition-all text-gray-800
                                 placeholder:text-gray-400"
                      placeholder="e.g., Mumbai"
                      required
                      maxLength={100}
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPinned className="w-4 h-4 text-teal-500" />
                      State
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 focus:bg-white outline-none transition-all text-gray-800
                                 placeholder:text-gray-400"
                      placeholder="e.g., Maharashtra"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>

                {/* Postal Code + Country (side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Postal Code */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Hash className="w-4 h-4 text-indigo-500" />
                      Postal Code
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 focus:bg-white outline-none transition-all text-gray-800
                                 placeholder:text-gray-400"
                      placeholder="e.g., 400001"
                      required
                      maxLength={20}
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Globe className="w-4 h-4 text-blue-500" />
                      Country
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 focus:bg-white outline-none transition-all text-gray-800
                                 placeholder:text-gray-400"
                      placeholder="e.g., India"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              {/* ========== ADDRESS PREVIEW ========== */}
              {(formData.add1 || formData.city) && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl
                                border border-blue-100">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2
                                flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    Address Preview
                  </p>
                  <p className="text-sm text-gray-700">
                    {[
                      formData.add1,
                      formData.add2,
                      formData.city,
                      formData.state,
                      formData.postalCode,
                      formData.country
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

            </div>

            {/* ========== FOOTER BUTTONS ========== */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4
                            flex items-center justify-between">

              {/* Left side hint */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                {editingBranch
                  ? `Editing branch #${editingBranch.branchId}`
                  : 'Creating new branch'}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 rounded-xl
                             bg-white hover:bg-gray-50 transition-colors font-medium text-gray-600
                             disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2
                             px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600
                             text-white rounded-xl hover:from-blue-700 hover:to-indigo-700
                             transition-all font-semibold disabled:opacity-50
                             shadow-lg shadow-blue-600/25 hover:shadow-xl
                             hover:shadow-blue-600/30"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBranch ? 'Update Branch' : 'Add Branch'}
                </button>
              </div>
            </div>
          </form>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BranchFormModal;