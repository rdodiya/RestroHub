import { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, FolderPlus } from 'lucide-react';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';

// ============================================
// SKELETON (Private)
// ============================================
const CategorySkeleton = () => {
  const { isDark } = useAdminTheme();
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`h-12 rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const CategorySidebar = ({ selectedCategory, onCategoryChange, onAddCategory, setAllCategories }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useAdminTheme();

  // ------------------------------------
  // FALLBACK DATA
  // ------------------------------------
  const fallbackCategories = [
    { categoryId: 'all', name: 'All Items', count: 24, emoji: '🍽️', foodIds:[] },
    { categoryId: 'main-course', name: 'Main Course', count: 12, emoji: '🥘', foodIds:[]  },
    { categoryId: 'starters', name: 'Starters', count: 8, emoji: '🍛', foodIds:[]  },
    { categoryId: 'drinks', name: 'Drinks', count: 4, emoji: '🥛', foodIds:[]  },
    { categoryId: 'desserts', name: 'Desserts', count: 0, emoji: '🍰', foodIds:[]  },
  ];

  // ------------------------------------
  // FETCH
  // ------------------------------------
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      var response = null;
      response = await api.get(`/secure/api/v1/categories/getallcategories?page=0&size=10&sortBy=name&sortDirection=asc`);
      const data = [
        { categoryId: 'all', name: 'All Items', foodIds: [] },
        ...response.data.data.content
      ];

      setCategories(data);
      setAllCategories(response.data.data.content);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories(fallbackCategories);
      setAllCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className={`rounded-2xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Categories</h2>
          <button
            onClick={fetchCategories}
            className={`transition-colors ${isDark ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'}`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Categories List */}
        {loading ? (
          <AdminSkeleton variant="category" />
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() => onCategoryChange(cat.categoryId)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedCategory === cat.categoryId
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-blue-50 text-gray-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${selectedCategory === cat.categoryId ? 'text-white/80' : 'text-gray-400'
                      }`}
                  >
                    {cat.foodIds.length}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${selectedCategory === cat.categoryId ? 'text-white/70' : isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Add Category */}
        <button
          onClick={onAddCategory}
          className={`w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl transition-all text-sm ${isDark ? 'border-gray-600 text-gray-500 hover:border-blue-500 hover:text-blue-400' : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500'}`}
        >
          <FolderPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>
    </div>
  );
};

export default CategorySidebar;