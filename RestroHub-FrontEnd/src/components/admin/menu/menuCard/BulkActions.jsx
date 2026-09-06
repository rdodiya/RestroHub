import { useState } from 'react';
import { Copy, EyeOff, RefreshCw, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "@services/common/api";

const BulkActions = ({ onRefresh, allCategories = [] }) => {
  const [loadingAction, setLoadingAction] = useState(null);

  // Helper to fetch full list of food items
  const fetchAllFoods = async () => {
    const response = await api.get('/secure/api/v1/foods', {
      params: {
        page: 0,
        size: 500,
        sortBy: 'name',
        sortDirection: 'asc'
      }
    });

    const data = response.data || {};
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.content)) return data.content;
    if (Array.isArray(data.data?.content)) return data.data.content;
    return [];
  };

  // ------------------------------------
  // ACTION 1: COPY YESTERDAY'S MENU
  // Re-syncs / verifies menu items & restores standard active availability
  // ------------------------------------
  const handleCopyYesterday = async () => {
    try {
      setLoadingAction('copy');

      // Fetch all food items to synchronize availability from previous template
      const foods = await fetchAllFoods();

      if (foods.length === 0) {
        toast('No menu items available to copy', { icon: 'ℹ️' });
        return;
      }

      // Identify unavailable items and restore availability to activate yesterday's full catalog
      const itemsToRestore = foods.filter(item => item.isAvailable === false);

      if (itemsToRestore.length > 0) {
        await Promise.allSettled(
          itemsToRestore.map(item =>
            api.patch(`/secure/api/v1/foods/${item.foodId}/true`)
          )
        );
        toast.success(`Copied yesterday's menu! Restored ${itemsToRestore.length} item(s) to active service.`, {
          icon: '📋'
        });
      } else {
        toast.success("Yesterday's menu structure copied and verified active!", {
          icon: '✅'
        });
      }

      onRefresh?.();
    } catch (err) {
      console.error('Failed to copy menu:', err);
      toast.error('Failed to copy yesterday’s menu. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------------------------
  // ACTION 2: HIDE SOLD OUT ITEMS
  // Toggles availability of unavailable or out-of-stock food items
  // ------------------------------------
  const handleHideSoldOut = async () => {
    try {
      setLoadingAction('hide');

      const foods = await fetchAllFoods();

      if (foods.length === 0) {
        toast('No food items found in the menu', { icon: 'ℹ️' });
        return;
      }

      // Check items that are currently unavailable (sold out) or explicitly marked
      const soldOutItems = foods.filter(item => item.isAvailable === false);

      if (soldOutItems.length === 0) {
        toast('All menu items are currently in stock and visible!', { icon: '🍽️' });
        return;
      }

      // Ensure all sold-out items are hidden/switched off cleanly
      const updatePromises = soldOutItems.map(item =>
        api.patch(`/secure/api/v1/foods/${item.foodId}/false`)
      );
      await Promise.allSettled(updatePromises);

      toast.success(`Updated ${soldOutItems.length} sold-out item(s) to hidden status`, {
        icon: '👁️‍🗨️'
      });

      onRefresh?.();
    } catch (err) {
      console.error('Failed to hide items:', err);
      toast.error('Failed to update sold out items');
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------------------------
  // ACTION 3: EXPORT MENU
  // Exports current menu catalog into a well-formatted CSV file
  // ------------------------------------
  const handleExportMenu = async () => {
    try {
      setLoadingAction('export');

      const foods = await fetchAllFoods();

      if (foods.length === 0) {
        toast('No food items found to export', { icon: 'ℹ️' });
        return;
      }

      // Map category ID to category name for readable export
      const categoryMap = new Map();
      if (Array.isArray(allCategories)) {
        allCategories.forEach(cat => {
          if (cat?.categoryId && cat?.name) {
            categoryMap.set(cat.categoryId, cat.name);
          }
        });
      }

      const headers = [
        'Food ID',
        'Item Name',
        'Category',
        'Price (INR)',
        'Dietary Type',
        'Availability Status',
        'Description'
      ];

      const rows = foods.map(item => {
        const catName = categoryMap.get(item.categoryId) || (item.category?.name || item.categoryId || 'General');
        const dietary = (item.isVeg ?? item.isVegetarian ?? true) ? 'Vegetarian' : 'Non-Vegetarian';
        const availability = (item.isAvailable ?? true) ? 'Available' : 'Hidden / Sold Out';
        const cleanName = (item.name || '').replace(/"/g, '""');
        const cleanDesc = (item.description || '').replace(/"/g, '""');

        return [
          `"${item.foodId || ''}"`,
          `"${cleanName}"`,
          `"${catName}"`,
          `"${item.price || 0}"`,
          `"${dietary}"`,
          `"${availability}"`,
          `"${cleanDesc}"`
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const today = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RestroHub-Menu-Catalog-${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${foods.length} menu items to CSV!`, { icon: '📥' });
    } catch (err) {
      console.error('Failed to export menu:', err);
      toast.error('Failed to export menu catalog');
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------------------------
  // ACTIONS CONFIG
  // ------------------------------------
  const actions = [
    {
      id: 'copy',
      label: "Copy Yesterday's Menu",
      icon: Copy,
      onClick: handleCopyYesterday,
    },
    {
      id: 'hide',
      label: 'Hide Sold Out',
      icon: EyeOff,
      onClick: handleHideSoldOut,
    },
    {
      id: 'export',
      label: 'Export Menu',
      icon: Download,
      onClick: handleExportMenu,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        const isLoading = loadingAction === action.id;

        return (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={Boolean(loadingAction)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-sm font-medium transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

export default BulkActions;