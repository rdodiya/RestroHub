import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, RefreshCw, AlertCircle, UtensilsCrossed } from 'lucide-react';
import MenuItemCard from './FoodItemCard';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';

// ============================================
// MAIN COMPONENT
// ============================================
const MenuItemsGrid = forwardRef(({ selectedCategory, onEditItem, onFoodItemsChanged }, ref) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------------------------
  // FALLBACK DATA
  // ------------------------------------
  const fallbackItems = [
    { id: 1, name: 'Paneer Tikka', price: 250, categoryId: 'starters', stock: 25, available: true },
    { id: 2, name: 'Butter Naan', price: 45, categoryId: 'main-course', stock: 100, available: true },
    { id: 3, name: 'Biryani', price: 320, categoryId: 'main-course', stock: 15, available: true },
    { id: 4, name: 'Mango Lassi', price: 90, categoryId: 'drinks', stock: 50, available: true },
    { id: 5, name: 'Undhiyu', price: 280, categoryId: 'main-course', stock: 0, available: false },
    { id: 6, name: 'Gujarati Thali', price: 350, categoryId: 'main-course', stock: 20, available: true },
  ];

  // ------------------------------------
  // FETCH DATA
  // ------------------------------------
  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  useImperativeHandle(ref, () => ({
    refreshFoods() {
      fetchMenuItems();
    }
  }));

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      var response = null;
      if (selectedCategory === 'all') {
        response = await api.get(`/secure/api/v1/foods?page=0&size=10&sortBy=name&sortDirection=asc`);
        setMenuItems(response.data.content);
      } else {
        response = await api.get(`/secure/api/v1/foods/category/${selectedCategory}?page=0&size=10`);
        setMenuItems(response.data.content);
      }

      // MOCK
      await new Promise(resolve => setTimeout(resolve, 600));

    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError('Failed to load menu items');
      // setMenuItems(fallbackItems);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // HANDLERS
  // ------------------------------------
  const handleToggle = (id) => {
    setMenuItems(prev =>
      prev.map(item => (item.foodId === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const handleDelete = (id) => {
    setMenuItems(prev => prev.filter(item => item.foodId !== id));
    onFoodItemsChanged?.();
  };

  // ------------------------------------
  // FILTER LOGIC
  // ------------------------------------
  const filteredItems = menuItems
    .filter(item => selectedCategory === 'all' || item.categoryId === selectedCategory)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className="flex-1 min-w-0">

      {/* ================================= */}
      {/* SEARCH BAR - Responsive           */}
      {/* ================================= */}
      <div
        className="
          flex items-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm
          focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100
          transition-all mb-4

          /* MOBILE */
          px-3 py-2.5

          /* TABLET+ */
          sm:px-4 sm:py-3 sm:mb-6
        "
      >
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu items..."
          className="
            bg-transparent outline-none flex-1 min-w-0
            text-gray-800 placeholder-gray-400

            /* MOBILE */
            text-sm

            /* TABLET+ */
            sm:text-base
          "
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium flex-shrink-0 ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* ================================= */}
      {/* CONTENT STATES                    */}
      {/* ================================= */}

      {loading ? (
        // ------------------------------------
        // SKELETON GRID - Responsive
        // ------------------------------------
        <div
          className="
            grid gap-4

            /* MOBILE: 1 column */
            grid-cols-1

            /* TABLET: 1 column (horizontal cards) */
            sm:grid-cols-1

            /* MEDIUM DESKTOP: 2 columns */
            lg:grid-cols-2

            /* LARGE DESKTOP: 3 columns */
            xl:grid-cols-3
          "
        >
          {[1, 2, 3, 4, 5, 6].map(i => (
           <AdminSkeleton key={i} variant="food-card" />
          ))}
        </div>

      ) : error && menuItems.length === 0 ? (
        // ------------------------------------
        // ERROR STATE - Responsive
        // ------------------------------------
        <div
          className="
            bg-white rounded-2xl border border-gray-100 text-center

            /* MOBILE */
            p-8

            /* TABLET+ */
            sm:p-12
          "
        >
          <AlertCircle
            className="
              text-red-300 mx-auto mb-3

              /* MOBILE */
              w-12 h-12

              /* TABLET+ */
              sm:w-16 sm:h-16 sm:mb-4
            "
          />
          <p className="text-red-600 font-medium mb-2 text-sm sm:text-base">
            {error}
          </p>
          <button
            onClick={fetchMenuItems}
            className="
              flex items-center gap-2 mx-auto px-4 py-2 text-sm
              text-blue-700 bg-blue-50 hover:bg-blue-100
              rounded-xl transition-colors font-medium
            "
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>

      ) : filteredItems.length === 0 ? (
        // ------------------------------------
        // EMPTY STATE - Responsive
        // ------------------------------------
        <div
          className="
            bg-white rounded-2xl border border-gray-100 text-center

            /* MOBILE */
            p-8

            /* TABLET+ */
            sm:p-12
          "
        >
          <UtensilsCrossed
            className="
              text-blue-200 mx-auto mb-3

              /* MOBILE */
              w-12 h-12

              /* TABLET+ */
              sm:w-16 sm:h-16 sm:mb-4
            "
          />
          <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
            No items found
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : 'Add your first menu item to get started'}
          </p>
        </div>

      ) : (
        // ------------------------------------
        // ITEMS GRID - Responsive
        // ------------------------------------
        <div
          className="
            grid gap-4

            /* MOBILE: 1 column vertical cards */
            grid-cols-1

            /* TABLET: 1 column horizontal cards */
            sm:grid-cols-1

            /* MEDIUM DESKTOP: 2 columns */
            lg:grid-cols-2

            /* LARGE DESKTOP: 3 columns */
            xl:grid-cols-3
          "
        >
          {menuItems.map(item => (
            <MenuItemCard
              key={item.foodId}
              item={item}
              onEdit={onEditItem}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ================================= */}
      {/* RESULTS COUNT - Responsive        */}
      {/* ================================= */}
      {!loading && filteredItems.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {filteredItems.length} of {menuItems.length} items
          </p>
        </div>
      )}
    </div>
  );
});

export default MenuItemsGrid;
