import { useState, useEffect } from 'react';
import { X, Loader2, Image as ImageIcon, Type, FileText, IndianRupee, Tag, Upload, Leaf, Eye, Link, AlertCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import api from "@services/common/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.response?.data?.error || fallback;

const MenuFormModal = ({ isOpen, onClose, editingItem, allCategories, categoriesLoading = false }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageFile: null,
    imageUrl: '',
    isAvailable: true,
    isVeg: true,
    isDelete: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ------------------------------------
  // Populate form when editing
  // ------------------------------------
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        price: editingItem.price?.toString() || '',
        categoryId: editingItem.categoryId || '',
        imageFile: null,
        imageUrl: editingItem.imageUrl || '',
        isAvailable: editingItem.isAvailable ?? true,
        isVeg: editingItem.isVeg ?? true,
        isDelete: editingItem.isDelete ?? false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageFile: null,
        imageUrl: '',
        isAvailable: true,
        isVeg: true,
        isDelete: false
      });
    }
    setCategories(allCategories || []);
    setErrors({});
    setSubmitError('');
  }, [editingItem, isOpen, allCategories]);

  useEffect(() => {
    if (!formData.imageUrl?.startsWith('blob:')) return undefined;

    return () => URL.revokeObjectURL(formData.imageUrl);
  }, [formData.imageUrl]);

  // ------------------------------------
  // Handle image selection for preview
  // ------------------------------------
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, imageFile: 'Upload a PNG, JPG, WEBP, or GIF image.' }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors(prev => ({ ...prev, imageFile: 'Image size must be 5MB or less.' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imageUrl: URL.createObjectURL(file)
    }));
    setErrors(prev => ({ ...prev, imageFile: undefined, imageUrl: undefined }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const name = formData.name.trim();
    const price = Number(formData.price);
    const description = formData.description.trim();
    const imageUrl = formData.imageFile ? '' : formData.imageUrl.trim();

    if (!name) nextErrors.name = 'Food item name is required.';
    if (name && name.length < 2) nextErrors.name = 'Name must be at least 2 characters.';
    if (name.length > 100) nextErrors.name = 'Name must be 100 characters or less.';
    if (description.length > 500) nextErrors.description = 'Description must be 500 characters or less.';
    if (!formData.price) nextErrors.price = 'Price is required.';
    if (formData.price && (!Number.isFinite(price) || price <= 0)) nextErrors.price = 'Enter a valid price greater than 0.';
    if (price > 9999.99) nextErrors.price = 'Price must be 9999.99 or less.';
    if (!formData.categoryId) nextErrors.categoryId = 'Select a category.';

    if (imageUrl) {
      try {
        const url = new URL(imageUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          nextErrors.imageUrl = 'Image URL must start with http or https.';
        }
      } catch {
        nextErrors.imageUrl = 'Enter a valid image URL.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ------------------------------------
  // Submit form to backend
  // ------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("description", formData.description.trim());
      payload.append("price", Number(formData.price).toFixed(2));
      payload.append("categoryId", formData.categoryId);
      payload.append("isAvailable", formData.isAvailable ? "true" : "false");
      payload.append("isVeg", formData.isVeg ? "true" : "false");

      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      } else if (formData.imageUrl.trim()) {
        payload.append("imageUrl", formData.imageUrl.trim());
      }

      if (editingItem) {
        await api.put(`/secure/api/v1/foods/${editingItem.foodId}`, payload);
        toast.success('Food item updated successfully');
      } else {
        await api.post("/secure/api/v1/foods", payload);
        toast.success('Food item created successfully');
      }

      onClose();
    } catch (err) {
      console.error("Failed to save item:", err.response?.data || err);
      const message = getErrorMessage(err, 'Failed to save food item');
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // ------------------------------------
  // Render JSX
  // ------------------------------------
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm"
           aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border
                                 border-gray-100 max-h-[92vh] overflow-hidden flex flex-col">

          {/* ========== GRADIENT HEADER ========== */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6
                          flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-white">
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </Dialog.Title>
                <p className="text-blue-200 text-sm mt-0.5">
                  {editingItem
                    ? 'Update the food item details below'
                    : 'Fill in the details to add a new food item'}
                </p>
              </div>
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
            <div className="px-8 py-6 space-y-6">

              {/* ---- ROW 1: Name + Price (side by side) ---- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type className="w-4 h-4 text-blue-500" />
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               focus:bg-white outline-none transition-all text-gray-800
                               placeholder:text-gray-400"
                    placeholder="e.g. Paneer Tikka, Chicken Biryani"
                    required
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <IndianRupee className="w-4 h-4 text-green-500" />
                    Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400
                                     font-medium">₹</span>
                    <input
                      type="number"
                      min="0.01"
                      max="9999.99"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200
                                 rounded-xl focus:ring-2 focus:ring-blue-500
                                 focus:border-transparent focus:bg-white outline-none
                                 transition-all text-gray-800 placeholder:text-gray-400"
                      placeholder="250.00"
                      required
                      aria-invalid={Boolean(errors.price)}
                    />
                  </div>
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
              </div>

              {/* ---- ROW 2: Description (full width) ---- */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             focus:bg-white outline-none transition-all text-gray-800
                             placeholder:text-gray-400 resize-none"
                  placeholder="Describe the food item, ingredients, taste..."
                  aria-invalid={Boolean(errors.description)}
                />
                <div className="flex justify-between gap-3">
                  {errors.description ? (
                    <p className="text-xs text-red-500">{errors.description}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-gray-400">{formData.description.length}/500</p>
                </div>
              </div>

              {/* ---- ROW 3: Category + Image (side by side) ---- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Category Select */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Tag className="w-4 h-4 text-indigo-500" />
                    Category
                  </label>
                  <div className="relative">
                    {categoriesLoading ? (
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="text-sm text-gray-500">Loading categories...</span>
                      </div>
                    ) : (
                    <select
                      value={formData.categoryId}
                      onChange={(e) => updateField('categoryId', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200
                                 rounded-xl focus:ring-2 focus:ring-blue-500
                                 focus:border-transparent focus:bg-white outline-none
                                 transition-all text-gray-800 appearance-none cursor-pointer"
                      required
                      aria-invalid={Boolean(errors.categoryId)}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    )}
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5
                                 text-gray-400 pointer-events-none"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
                </div>

                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Upload className="w-4 h-4 text-blue-500" />
                    Image
                  </label>
                  <label className="group border-2 border-dashed border-gray-200 rounded-xl
                                    text-center hover:bg-blue-50 hover:border-blue-300
                                    cursor-pointer transition-all w-full block relative
                                    overflow-hidden h-[120px] flex items-center justify-center">
                    {formData.imageUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={formData.imageUrl}
                          alt="Food"
                          className="w-full h-full object-cover"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0
                                        group-hover:opacity-100 transition-opacity
                                        flex items-center justify-center">
                          <div className="text-center">
                            <Upload className="w-5 h-5 text-white mx-auto mb-1" />
                            <p className="text-xs text-white font-medium">Change Image</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <ImageIcon className="w-8 h-8 text-blue-300 mx-auto mb-2
                                              group-hover:scale-110 transition-transform" />
                        <p className="text-sm text-gray-500">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleImageSelect}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                  {errors.imageFile && <p className="text-xs text-red-500">{errors.imageFile}</p>}
                </div>
              </div>

              {/* ---- ROW 4: Image URL fallback ---- */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Link className="w-4 h-4 text-blue-500" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageFile ? '' : formData.imageUrl}
                  onChange={(e) => updateField('imageUrl', e.target.value)}
                  disabled={Boolean(formData.imageFile)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             focus:bg-white outline-none transition-all text-gray-800
                             placeholder:text-gray-400 disabled:opacity-60"
                  placeholder="https://example.com/food-image.jpg"
                  aria-invalid={Boolean(errors.imageUrl)}
                />
                {errors.imageUrl ? (
                  <p className="text-xs text-red-500">{errors.imageUrl}</p>
                ) : (
                  <p className="text-xs text-gray-400">Use a URL when no image file is uploaded.</p>
                )}
              </div>

              {/* ---- ROW 5: Veg Toggle + Availability Toggle ---- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Vegetarian Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl
                                border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${formData.isVeg ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Leaf className={`w-4 h-4
                        ${formData.isVeg ? 'text-green-600' : 'text-red-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Vegetarian</p>
                      <p className="text-xs text-gray-400">
                        {formData.isVeg ? 'Pure veg item' : 'Non-veg item'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.isVeg}
                      onClick={() => updateField('isVeg', !formData.isVeg)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer
                                  rounded-full border-2 border-transparent
                                  transition-colors duration-300 ease-in-out
                                  focus:outline-none focus-visible:ring-2
                                  focus-visible:ring-offset-2
                                  ${formData.isVeg
                                    ? 'bg-green-500 focus-visible:ring-green-500'
                                    : 'bg-red-400 focus-visible:ring-red-400'
                                  }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6
                                    rounded-full bg-white shadow-lg ring-0
                                    transition-transform duration-300 ease-in-out
                                    ${formData.isVeg ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                    <span className={`inline-flex items-center justify-center w-[52px]
                                      text-xs font-bold py-1 rounded-full transition-colors
                                      duration-300
                                      ${formData.isVeg
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-500'
                                      }`}>
                      {formData.isVeg ? 'Veg' : 'Non'}
                    </span>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl
                                border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${formData.isAvailable ? 'bg-blue-100' : 'bg-gray-200'}`}>
                      <Eye className={`w-4 h-4
                        ${formData.isAvailable ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Available</p>
                      <p className="text-xs text-gray-400">
                        {formData.isAvailable ? 'Visible to customers' : 'Hidden from menu'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.isAvailable}
                      onClick={() => updateField('isAvailable', !formData.isAvailable)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer
                                  rounded-full border-2 border-transparent
                                  transition-colors duration-300 ease-in-out
                                  focus:outline-none focus-visible:ring-2
                                  focus-visible:ring-offset-2
                                  ${formData.isAvailable
                                    ? 'bg-blue-500 focus-visible:ring-blue-500'
                                    : 'bg-gray-300 focus-visible:ring-gray-300'
                                  }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6
                                    rounded-full bg-white shadow-lg ring-0
                                    transition-transform duration-300 ease-in-out
                                    ${formData.isAvailable
                                      ? 'translate-x-5'
                                      : 'translate-x-0'
                                    }`}
                      />
                    </button>
                    <span className={`inline-flex items-center justify-center w-[52px]
                                      text-xs font-bold py-1 rounded-full transition-colors
                                      duration-300
                                      ${formData.isAvailable
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-500'
                                      }`}>
                      {formData.isAvailable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

            </div>

            {/* ========== STICKY FOOTER ========== */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-5
                            flex items-center justify-between">

              {/* Left side info */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {editingItem
                  ? `Editing item #${editingItem.foodId}`
                  : 'Adding new food item'}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-xl
                             hover:bg-gray-50 transition-colors font-medium text-gray-600
                             disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8
                             py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                             rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all
                             font-semibold disabled:opacity-50 shadow-lg shadow-blue-600/25
                             hover:shadow-xl hover:shadow-blue-600/30"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default MenuFormModal;
