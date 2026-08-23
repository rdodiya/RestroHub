import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, Loader2, Tag, Type, FileText, AlertCircle } from "lucide-react";
import api from "@services/common/api";
import toast from "react-hot-toast";

const CategoryFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError("");

      const payload = {
        name: formData.name,
        description: formData.description,
        isDelete: false
      };

      await api.post("/secure/api/v1/categories/addCategory", payload);

      toast.success("Category created successfully");
      onClose();
      setFormData({ name: "", description: "" });

    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to create category";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    {/* Backdrop */}
    <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm"
         aria-hidden="true" />

    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border
                               border-gray-100 overflow-hidden">

        {/* ========== GRADIENT HEADER ========== */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5
                        flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <Dialog.Title className="text-xl font-bold text-white">
              Add Category
            </Dialog.Title>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* ========== FORM BODY ========== */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

          {/* Error Banner */}
          {submitError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertCircle aria-hidden="true" className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Type className="w-4 h-4 text-blue-500" />
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         focus:bg-white outline-none transition-all text-gray-800
                         placeholder:text-gray-400"
              placeholder="e.g. Starters"
              required
              minLength={2}
              maxLength={50}
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
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         focus:bg-white outline-none transition-all text-gray-800
                         placeholder:text-gray-400 resize-none"
              rows={3}
              maxLength={255}
              placeholder="Describe this category..."
            />
          </div>

          {/* ========== FOOTER BUTTONS ========== */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl
                         hover:bg-gray-50 transition-colors font-medium text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                         bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                         rounded-xl hover:from-blue-700 hover:to-indigo-700
                         transition-all font-semibold disabled:opacity-50
                         shadow-lg shadow-blue-600/25 hover:shadow-xl
                         hover:shadow-blue-600/30"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Category
            </button>
          </div>

        </form>
      </Dialog.Panel>
    </div>
  </Dialog>
);
};

export default CategoryFormModal;