import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, RefreshCw, AlertCircle, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';
import MenuItemCard from './FoodItemCard';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';

const PAGE_SIZE = 9;

const getPageContent = (data) => {
  if (Array.isArray(data)) return data;
  return data?.content || data?.data?.content || [];
};

const MenuItemsGrid = forwardRef(({ selectedCategory, onEditItem, onFoodItemsChanged }, ref) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(0);
      setDebouncedSearch(searchQuery.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [selectedCategory]);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory, debouncedSearch, page]);

  useImperativeHandle(ref, () => ({
    refreshFoods() {
      fetchMenuItems();
    }
  }));

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size: PAGE_SIZE,
        sortBy: 'name',
        sortDirection: 'asc',
      };

      let response;
      if (selectedCategory !== 'all') {
        response = await api.get(`/secure/api/v1/foods/category/${selectedCategory}`, { params });
      } else if (debouncedSearch) {
        response = await api.get('/secure/api/v1/foods/search', {
          params: { ...params, name: debouncedSearch },
        });
      } else {
        response = await api.get('/secure/api/v1/foods', { params });
      }

      const data = response.data || {};
      const content = getPageContent(data);
      const filteredContent = selectedCategory !== 'all' && debouncedSearch
        ? content.filter((item) =>
            item.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        : content;

      setMenuItems(filteredContent);
      setPageInfo({
        totalElements: data.totalElements ?? filteredContent.length,
        totalPages: data.totalPages ?? 1,
        first: data.first ?? page === 0,
        last: data.last ?? true,
      });
    } catch (err) {
      console.error('Failed to fetch menu:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to load menu items');
      setMenuItems([]);
      setPageInfo({ totalElements: 0, totalPages: 0, first: true, last: true });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (updatedItem) => {
    setMenuItems(prev =>
      prev.map(item => (item.foodId === updatedItem.foodId ? updatedItem : item))
    );
  };

  const handleDelete = (id) => {
    setMenuItems(prev => prev.filter(item => item.foodId !== id));
    setPageInfo(prev => ({
      ...prev,
      totalElements: Math.max(prev.totalElements - 1, 0),
    }));
    onFoodItemsChanged?.();
  };

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 0));
  };

  const goToNextPage = () => {
    setPage((currentPage) => currentPage + 1);
  };

  const showPaginationFooter = menuItems.length > 0 || pageInfo.totalPages > 1;

  return (
    <div className="flex-1 min-w-0">
      <div
        className="
          flex items-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm
          focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100
          transition-all mb-4 px-3 py-2.5 sm:px-4 sm:py-3 sm:mb-6
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
            text-gray-800 placeholder-gray-400 text-sm sm:text-base
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

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <AdminSkeleton key={i} variant="food-card" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center p-8 sm:p-12">
          <AlertCircle className="text-red-300 mx-auto mb-3 w-12 h-12 sm:w-16 sm:h-16 sm:mb-4" />
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
      ) : menuItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center p-8 sm:p-12">
          <UtensilsCrossed className="text-blue-200 mx-auto mb-3 w-12 h-12 sm:w-16 sm:h-16 sm:mb-4" />
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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

      {!loading && !error && showPaginationFooter && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {menuItems.length} of {pageInfo.totalElements} items
          </p>
          {pageInfo.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={pageInfo.first}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-gray-500 min-w-[80px] text-center">
                Page {page + 1} of {pageInfo.totalPages}
              </span>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={pageInfo.last}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default MenuItemsGrid;
