import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronRight, Edit2, FolderPlus, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';

const getCategoryList = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  return responseData?.data?.content || responseData?.content || [];
};

const getRelationCount = (category) => {
  const foodCount = Array.isArray(category.foodIds)
    ? category.foodIds.length
    : category.foodIds?.size || 0;
  const menuCount = Array.isArray(category.menuIds)
    ? category.menuIds.length
    : category.menuIds?.size || 0;

  return foodCount + menuCount;
};

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.response?.data?.error || fallback;

const CategorySidebar = forwardRef(({
  selectedCategory,
  onCategoryChange,
  onAddCategory,
  onEditCategory,
  setAllCategories
}, ref) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { isDark } = useAdminTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshCategories() {
      fetchCategories();
    }
  }));

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/secure/api/v1/categories/activecategories', {
        params: { page: 0, size: 100, sort: 'name' }
      });

      const categoryList = getCategoryList(response.data);
      const visibleCategories = categoryList.filter((category) => !category.isDelete);
      setCategories(visibleCategories);
      setAllCategories(visibleCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err.response?.data || err);
      const message = getErrorMessage(err, 'Failed to load categories');
      setError(message);
      setCategories([]);
      setAllCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category) => {
    const relationCount = getRelationCount(category);
    const relationText = relationCount > 0
      ? ` It is linked to ${relationCount} item${relationCount === 1 ? '' : 's'}.`
      : '';

    if (!window.confirm(`Delete "${category.name}"?${relationText}`)) return;

    try {
      setDeletingId(category.categoryId);
      await api.delete(`/secure/api/v1/categories/delete/${category.categoryId}`);
      toast.success('Category deleted successfully');

      setCategories((prev) => prev.filter((item) => item.categoryId !== category.categoryId));
      setAllCategories((prev) => prev.filter((item) => item.categoryId !== category.categoryId));

      if (selectedCategory === category.categoryId) {
        onCategoryChange('all');
      }
    } catch (err) {
      console.error('Failed to delete category:', err.response?.data || err);
      toast.error(getErrorMessage(err, 'Failed to delete category'));
    } finally {
      setDeletingId(null);
    }
  };

  const sidebarItems = [
    {
      categoryId: 'all',
      name: 'All Items',
      foodIds: categories.flatMap((category) => category.foodIds || []),
      menuIds: [],
      isSystem: true,
    },
    ...categories,
  ];

  return (
    <div className="lg:w-72 flex-shrink-0">
      <div className={`rounded-2xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Categories</h2>
            {!loading && (
              <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {categories.length} active
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={fetchCategories}
            className={`transition-colors ${isDark ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'}`}
            aria-label="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <AdminSkeleton variant="category" />
        ) : error ? (
          <div className={`rounded-xl border p-4 text-sm ${isDark ? 'border-red-900/40 bg-red-950/20 text-red-300' : 'border-red-100 bg-red-50 text-red-600'}`}>
            <p className="font-medium">{error}</p>
            <button
              type="button"
              onClick={fetchCategories}
              className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {sidebarItems.map((cat) => {
              const isSelected = selectedCategory === cat.categoryId;
              const count = Array.isArray(cat.foodIds) ? cat.foodIds.length : 0;

              return (
                <div
                  key={cat.categoryId}
                  className={`group rounded-xl transition-all ${isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-blue-50 text-gray-600'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => onCategoryChange(cat.categoryId)}
                    className="w-full flex items-center justify-between gap-3 p-3 text-left"
                  >
                    <div className="min-w-0">
                      <span className="block font-medium truncate">{cat.name}</span>
                      {cat.description && (
                        <span className={`block text-xs truncate ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                          {cat.description}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                        {count}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white/70' : isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  </button>

                  {!cat.isSystem && (
                    <div className={`flex items-center justify-end gap-1 px-3 pb-3 ${isSelected ? 'text-white/80' : ''}`}>
                      <button
                        type="button"
                        onClick={() => onEditCategory(cat)}
                        className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'hover:bg-white/15' : 'hover:bg-blue-100 text-blue-600'}`}
                        aria-label={`Edit ${cat.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        disabled={deletingId === cat.categoryId}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${isSelected ? 'hover:bg-white/15' : 'hover:bg-red-100 text-red-600'}`}
                        aria-label={`Delete ${cat.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={onAddCategory}
          className={`w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl transition-all text-sm ${isDark ? 'border-gray-600 text-gray-500 hover:border-blue-500 hover:text-blue-400' : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500'}`}
        >
          <FolderPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>
    </div>
  );
});

export default CategorySidebar;
