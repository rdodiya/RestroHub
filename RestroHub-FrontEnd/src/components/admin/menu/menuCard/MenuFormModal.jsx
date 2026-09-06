// MenuCreation.jsx
import { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown, Tag, UtensilsCrossed, MapPin, FileText, Type, Calendar, Clock, CalendarRange } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import api from "@services/common/api";
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = [
    { id: 'MONDAY', label: 'Mon' },
    { id: 'TUESDAY', label: 'Tue' },
    { id: 'WEDNESDAY', label: 'Wed' },
    { id: 'THURSDAY', label: 'Thu' },
    { id: 'FRIDAY', label: 'Fri' },
    { id: 'SATURDAY', label: 'Sat' },
    { id: 'SUNDAY', label: 'Sun' },
];

const MenuCreation = ({ isOpen, onClose, editingMenu, allCategories, allBranches }) => {
    const [categories, setCategories] = useState([]);
    const [branches, setBranches] = useState([]);
    const [formData, setFormData] = useState({
        menuName: '',
        menuDesc: '',
        categoryIds: [],
        branchId: '',
        isDeleted: false,
        startDate: '',
        endDate: '',
        selectedDays: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // ------------------------------------
    // Populate form when editing
    // ------------------------------------
    useEffect(() => {
        if (editingMenu) {
            const parsedDays = editingMenu.dayOfWeek
                ? editingMenu.dayOfWeek.split(',').map((d) => d.trim().toUpperCase()).filter(Boolean)
                : [];

            setFormData({
                menuName: editingMenu.menuName || '',
                menuDesc: editingMenu.menuDesc || '',
                categoryIds: editingMenu.categories
                    ? editingMenu.categories.map((cat) => cat.categoryId)
                    : [],
                branchId: editingMenu.branch?.branchId?.toString() || '',
                isDeleted: editingMenu.isDeleted ?? false,
                startDate: editingMenu.startDate ? editingMenu.startDate.toString().split('T')[0] : '',
                endDate: editingMenu.endDate ? editingMenu.endDate.toString().split('T')[0] : '',
                selectedDays: parsedDays
            });
        } else {
            setFormData({
                menuName: '',
                menuDesc: '',
                categoryIds: [],
                branchId: '',
                isDeleted: false,
                startDate: '',
                endDate: '',
                selectedDays: []
            });
        }
        setError(null);
        setCategories(Array.isArray(allCategories) ? allCategories : []);
        setBranches(Array.isArray(allBranches) ? allBranches : []);
    }, [editingMenu, isOpen, allCategories, allBranches]);

    // Close dropdown when modal closes
    useEffect(() => {
        if (!isOpen) setIsCategoryDropdownOpen(false);
    }, [isOpen]);

    // ------------------------------------
    // Category toggle
    // ------------------------------------
    const handleCategoryToggle = (categoryId) => {
        setFormData((prev) => {
            const exists = prev.categoryIds.includes(categoryId);
            return {
                ...prev,
                categoryIds: exists
                    ? prev.categoryIds.filter((id) => id !== categoryId)
                    : [...prev.categoryIds, categoryId]
            };
        });
    };

    const removeCategory = (categoryId) => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.filter((id) => id !== categoryId)
        }));
    };

    const getCategoryName = (id) => {
        return categories.find((c) => c.categoryId === id)?.name || 'Unknown';
    };

    const handleDayToggle = (dayId) => {
        setFormData((prev) => {
            const exists = prev.selectedDays.includes(dayId);
            return {
                ...prev,
                selectedDays: exists
                    ? prev.selectedDays.filter((d) => d !== dayId)
                    : [...prev.selectedDays, dayId]
            };
        });
    };

    // ------------------------------------
    // Submit — matches MenuRequestDTO
    // ------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Build payload matching MenuRequestDTO exactly
            const payload = {
                menuName: formData.menuName,
                menuDesc: formData.menuDesc,
                branchId: formData.branchId ? Number(formData.branchId) : null,
                categoryIds: formData.categoryIds,
                isDeleted: formData.isDeleted,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
                dayOfWeek: formData.selectedDays.length > 0 ? formData.selectedDays.join(',') : null
            };

            if (editingMenu) {
                // PUT /secure/api/v1/menus/{menuId}
                await api.put(`/secure/api/v1/menus/${editingMenu.menuId}`, payload);
            } else {
                // POST /secure/api/v1/menus
                await api.post("/secure/api/v1/menus", payload);
            }

            onClose();
        } catch (err) {
            console.error("Failed to save menu:", err.response?.data || err);
            toast.error("Failed to save menu");
            const message = err.response?.data?.message
                || err.response?.data?.error
                || 'Failed to save menu. Please try again.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // ------------------------------------
    // Render
    // ------------------------------------
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm"
                 aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100
                               max-h-[92vh] overflow-hidden flex flex-col"
                >

                    {/* ========== HEADER ========== */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6
                                    flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <UtensilsCrossed className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <Dialog.Title className="text-xl font-bold text-white">
                                    {editingMenu ? 'Edit Menu' : 'Create New Menu'}
                                </Dialog.Title>
                                <p className="text-blue-200 text-sm mt-0.5">
                                    {editingMenu
                                        ? 'Update your menu details below'
                                        : 'Fill in the details to create a new menu'}
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

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl
                                                text-sm text-red-600 flex items-center gap-2">
                                    <X className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* ---- ROW 1: Name + Branch (side by side) ---- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Menu Name → MenuRequestDTO.menuName */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Type className="w-4 h-4 text-blue-500" />
                                        Menu Name
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.menuName}
                                        onChange={(e) => updateField('menuName', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                   focus:bg-white outline-none transition-all text-gray-800
                                                   placeholder:text-gray-400"
                                        placeholder="e.g. Lunch Special, Weekend Brunch"
                                        required
                                        minLength={2}
                                        maxLength={100}
                                    />
                                </div>

                                {/* Branch → MenuRequestDTO.branchId */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        Branch
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.branchId}
                                            onChange={(e) => updateField('branchId', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                       focus:bg-white outline-none transition-all text-gray-800
                                                       appearance-none cursor-pointer"
                                        >
                                            <option value="">Select a branch (optional)</option>
                                            {branches.map((branch) => (
                                                <option key={branch.branchId} value={branch.branchId}>
                                                    {/* BranchResponseDTO has 'name' and nested 'address.city' */}
                                                    {branch.name}
                                                    {branch.address?.city ? ` — ${branch.address.city}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5
                                                                text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* ---- ROW 2: Description → MenuRequestDTO.menuDesc ---- */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FileText className="w-4 h-4 text-purple-500" />
                                    Description
                                </label>
                                <textarea
                                    value={formData.menuDesc}
                                    onChange={(e) => updateField('menuDesc', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                               focus:bg-white outline-none transition-all text-gray-800
                                               placeholder:text-gray-400 resize-none"
                                    placeholder="Describe what this menu offers..."
                                    maxLength={500}
                                />
                            </div>

                            {/* ---- ROW 3: Categories → MenuRequestDTO.categoryIds ---- */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Tag className="w-4 h-4 text-orange-500" />
                                    Categories
                                    {formData.categoryIds.length > 0 && (
                                        <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs
                                                         font-bold rounded-full">
                                            {formData.categoryIds.length}
                                        </span>
                                    )}
                                </label>

                                {/* Selected Categories Tags */}
                                {formData.categoryIds.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-3 bg-blue-50/50 border border-blue-100
                                                    rounded-xl">
                                        {formData.categoryIds.map((id) => (
                                            <span
                                                key={id}
                                                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5
                                                           bg-white border border-blue-200 text-blue-700 text-sm
                                                           font-medium rounded-full shadow-sm hover:shadow-md
                                                           transition-shadow group"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {getCategoryName(id)}
                                                <button
                                                    type="button"
                                                    onClick={() => removeCategory(id)}
                                                    className="ml-1 p-0.5 hover:bg-red-100 rounded-full transition-colors
                                                               group-hover:text-red-500"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => updateField('categoryIds', [])}
                                            className="text-xs text-gray-400 hover:text-red-500 px-2 py-1
                                                       transition-colors self-center"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}

                                {/* Category Dropdown */}
                                {categories.length === 0 ? (
                                    <div className="p-4 bg-gray-50 border border-dashed border-gray-300
                                                    rounded-xl text-center">
                                        <p className="text-sm text-gray-400 italic">
                                            No categories available. Create one first.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                            className="w-full flex items-center justify-between px-4 py-3
                                                       bg-gray-50 border border-gray-200 rounded-xl
                                                       hover:bg-gray-100 transition-colors text-left"
                                        >
                                            <span className="text-sm text-gray-500">
                                                {formData.categoryIds.length === 0
                                                    ? 'Click to select categories...'
                                                    : `${formData.categoryIds.length} categor${formData.categoryIds.length === 1 ? 'y' : 'ies'} selected`}
                                            </span>
                                            <ChevronDown
                                                className={`w-5 h-5 text-gray-400 transition-transform duration-200
                                                            ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {isCategoryDropdownOpen && (
                                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200
                                                            rounded-xl shadow-xl max-h-56 overflow-y-auto">

                                                {/* Select All / Clear */}
                                                <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-2.5
                                                                flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        All Categories
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateField('categoryIds', categories.map((c) => c.categoryId))
                                                            }
                                                            className="text-xs text-blue-600 hover:text-blue-800
                                                                       font-medium transition-colors"
                                                        >
                                                            Select All
                                                        </button>
                                                        <span className="text-gray-300">|</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateField('categoryIds', [])}
                                                            className="text-xs text-gray-400 hover:text-red-500
                                                                       font-medium transition-colors"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Options */}
                                                {categories.map((cat) => {
                                                    const isSelected = formData.categoryIds.includes(cat.categoryId);
                                                    return (
                                                        <button
                                                            key={cat.categoryId}
                                                            type="button"
                                                            onClick={() => handleCategoryToggle(cat.categoryId)}
                                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left
                                                                        transition-colors border-b border-gray-50 last:border-0
                                                                        ${isSelected
                                                                            ? 'bg-blue-50 hover:bg-blue-100'
                                                                            : 'hover:bg-gray-50'
                                                                        }`}
                                                        >
                                                            <div
                                                                className={`w-5 h-5 rounded-md border-2 flex items-center
                                                                            justify-center shrink-0 transition-all
                                                                            ${isSelected
                                                                                ? 'bg-blue-600 border-blue-600'
                                                                                : 'border-gray-300 bg-white'
                                                                            }`}
                                                            >
                                                                {isSelected && (
                                                                    <svg className="w-3 h-3 text-white" fill="none"
                                                                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                                            d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <Tag className={`w-3.5 h-3.5 shrink-0
                                                                                ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}
                                                                />
                                                                <span className={`text-sm truncate
                                                                                  ${isSelected
                                                                                      ? 'text-blue-700 font-semibold'
                                                                                      : 'text-gray-700'
                                                                                  }`}>
                                                                    {cat.name}
                                                                </span>
                                                            </div>

                                                            {isSelected && (
                                                                <span className="text-xs text-blue-500 font-medium shrink-0">
                                                                    Selected
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ---- ROW 4: Datewise & Day Schedule Assignment ---- */}
                            <div className="p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 rounded-2xl border border-blue-100/80 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                            <CalendarRange className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">Datewise Schedule & Recurrence</h4>
                                            <p className="text-xs text-gray-500">Assign specific dates or days of the week when this menu is active</p>
                                        </div>
                                    </div>
                                    {(formData.startDate || formData.endDate || formData.selectedDays.length > 0) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('startDate', '');
                                                updateField('endDate', '');
                                                setFormData(prev => ({ ...prev, selectedDays: [] }));
                                            }}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200 transition-colors shadow-xs"
                                        >
                                            Reset to Everyday
                                        </button>
                                    )}
                                </div>

                                {/* Start Date & End Date */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                            Active From (Start Date)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => updateField('startDate', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <p className="text-[11px] text-gray-400">Leave blank for no start restriction</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                            Active Until (End Date)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => updateField('endDate', e.target.value)}
                                            min={formData.startDate || undefined}
                                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <p className="text-[11px] text-gray-400">Leave blank for continuous schedule</p>
                                    </div>
                                </div>

                                {/* Days of Week Filter */}
                                <div className="space-y-2 pt-1">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                            <Clock className="w-3.5 h-3.5 text-purple-500" />
                                            Active Days of Week
                                        </label>
                                        <span className="text-[11px] text-gray-400">
                                            {formData.selectedDays.length === 0
                                                ? 'Active all 7 days'
                                                : `Active on ${formData.selectedDays.length} day(s)`}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {DAYS_OF_WEEK.map((day) => {
                                            const isSelected = formData.selectedDays.includes(day.id);
                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => handleDayToggle(day.id)}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                                    }`}
                                                >
                                                    {day.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* ---- ROW 5: Status Toggle → MenuRequestDTO.isDeleted ---- */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl
                                            border border-gray-200">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-700">Menu Status</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Mark as deleted to hide this menu
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 ml-4">
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={formData.isDeleted}
                                        onClick={() => updateField('isDeleted', !formData.isDeleted)}
                                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer
                                                    rounded-full border-2 border-transparent
                                                    transition-colors duration-300 ease-in-out
                                                    focus:outline-none focus-visible:ring-2
                                                    focus-visible:ring-offset-2
                                                    ${formData.isDeleted
                                                        ? 'bg-red-500 focus-visible:ring-red-500'
                                                        : 'bg-green-500 focus-visible:ring-green-500'
                                                    }`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-6 w-6
                                                        rounded-full bg-white shadow-lg ring-0
                                                        transition-transform duration-300 ease-in-out
                                                        ${formData.isDeleted
                                                            ? 'translate-x-5'
                                                            : 'translate-x-0'
                                                        }`}
                                        />
                                    </button>

                                    <span className={`inline-flex items-center justify-center w-[72px]
                                                      text-xs font-bold px-2.5 py-1 rounded-full
                                                      transition-colors duration-300
                                                      ${formData.isDeleted
                                                          ? 'bg-red-100 text-red-600'
                                                          : 'bg-green-100 text-green-600'
                                                      }`}>
                                        {formData.isDeleted ? 'Deleted' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ========== FOOTER BUTTONS ========== */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-5
                                        flex items-center justify-between">
                            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                {editingMenu
                                    ? `Editing menu #${editingMenu.menuId}`
                                    : 'Creating new menu'}
                            </div>

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
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5
                                               bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl
                                               hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold
                                               disabled:opacity-50 shadow-lg shadow-blue-600/25
                                               hover:shadow-xl hover:shadow-blue-600/30"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingMenu ? 'Update Menu' : 'Create Menu'}
                                </button>
                            </div>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default MenuCreation;