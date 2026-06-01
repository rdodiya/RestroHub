import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { AlertCircle, FileText, Loader2, Tag, Type, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@services/common/api";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.response?.data?.error || fallback;

const initialFormData = {
  name: "",
  description: ""
};

const CategoryFormModal = ({ isOpen, onClose, editingCategory }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(editingCategory?.categoryId);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: editingCategory?.name || "",
      description: editingCategory?.description || ""
    });
    setErrors({});
    setSubmitError("");
  }, [editingCategory, isOpen]);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) nextErrors.name = "Category name is required.";
    if (name && name.length < 2) nextErrors.name = "Category name must be at least 2 characters.";
    if (name.length > 50) nextErrors.name = "Category name must be 50 characters or less.";
    if (description.length > 255) nextErrors.description = "Description must be 255 characters or less.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isDelete: false
      };

      if (isEditing) {
        await api.put(`/secure/api/v1/categories/update/${editingCategory.categoryId}`, payload);
        toast.success("Category updated successfully");
      } else {
        await api.post("/secure/api/v1/categories/addCategory", payload);
        toast.success("Category created successfully");
      }

      setFormData(initialFormData);
      onClose();
    } catch (err) {
      console.error("Category save failed:", err.response?.data || err);
      const message = getErrorMessage(err, "Failed to save category");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm"
           aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border
                                 border-gray-100 overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5
                          flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-white">
                  {isEditing ? "Edit Category" : "Add Category"}
                </Dialog.Title>
                <p className="text-blue-200 text-sm mt-0.5">
                  {isEditing ? "Update category details" : "Create a category for food items"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
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
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

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
                aria-invalid={Boolean(errors.description)}
              />
              <div className="flex justify-between gap-3">
                {errors.description ? (
                  <p className="text-xs text-red-500">{errors.description}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">{formData.description.length}/255</p>
              </div>
            </div>

            {submitError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{submitError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl
                           hover:bg-gray-50 transition-colors font-medium text-gray-600
                           disabled:opacity-50"
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
                {isEditing ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CategoryFormModal;
