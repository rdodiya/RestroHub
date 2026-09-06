import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus,
  Minus,
  Trash2,
  Search,
  X,
  ShoppingBag,
  Utensils,
  User,
  Phone,
  CheckCircle2,
  Table2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

import OrdersHeader from './orderComponents/OrdersHeader';
import OrderFilters from './orderComponents/OrderFilters';
import StatusLegend from './orderComponents/StatusLegend';
import OrdersGrid from './orderComponents/OrdersGrid';
import api from '@services/common/api';

const initialOrderState = {
  branchId: null,
  tableId: '',
  tableNumber: '',
  customerName: '',
  customerPhone: '',
  specialInstructions: '',
  selectedItems: []
};

// Safe helper to extract arrays from paginated or wrapped responses
const extractList = (resData) => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.content)) return resData.content;
  if (Array.isArray(resData.data?.content)) return resData.data.content;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.categories)) return resData.categories;
  return [];
};

const Orders = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Controls whether the Create Order modal/drawer is open
  const [showCreateOrder, setShowCreateOrder] = useState(() => Boolean(location.state?.openCreateOrder));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [newOrder, setNewOrder] = useState(initialOrderState);

  // Data for creation
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch branch details
  const fetchBranchId = useCallback(async () => {
    try {
      const res = await api.get('/secure/api/v1/users/fetchRestaurantId');
      const data = res.data || {};
      const branchId =
        data.branchId ||
        data.restaurantId ||
        data.data?.branchId ||
        data.data?.restaurantId ||
        null;

      if (branchId) {
        setNewOrder((prev) => ({
          ...prev,
          branchId
        }));
        fetchTables(branchId);
      }
    } catch (err) {
      console.error('Failed to fetch branch ID:', err);
    }
  }, []);

  const fetchTables = async (branchId) => {
    if (!branchId) return;
    try {
      setLoadingTables(true);
      const res = await api.get(`/secure/api/v1/branches/${branchId}/tables`);
      setTables(extractList(res.data));
    } catch (err) {
      console.error('Failed to load tables:', err);
      setTables([]);
    } finally {
      setLoadingTables(false);
    }
  };

  const fetchMenuFoods = useCallback(async () => {
    try {
      setLoadingFoods(true);
      const [foodsRes, catsRes] = await Promise.allSettled([
        api.get('/secure/api/v1/foods', { params: { page: 0, size: 200 } }),
        api.get('/secure/api/v1/categories/getallcategories', { params: { page: 0, size: 100 } })
      ]);

      if (foodsRes.status === 'fulfilled') {
        setFoods(extractList(foodsRes.value.data));
      }

      if (catsRes.status === 'fulfilled') {
        setCategories(extractList(catsRes.value.data));
      }
    } catch (err) {
      console.error('Failed to load menu items for order creation:', err);
    } finally {
      setLoadingFoods(false);
    }
  }, []);

  useEffect(() => {
    fetchBranchId();
    fetchMenuFoods();
  }, [fetchBranchId, fetchMenuFoods]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'PREPARING', label: 'Preparing' },
    { id: 'READY', label: 'Ready' },
    { id: 'BILLED', label: 'Billed' },
    { id: 'CANCELLED', label: 'Cancelled' }
  ];

  // Filtered food list based on category and search
  const filteredFoods = useMemo(() => {
    let result = Array.isArray(foods) ? foods : [];

    if (selectedCategory !== 'all') {
      result = result.filter((item) => {
        const itemCat = String(item.categoryName || item.category || '').toLowerCase();
        return itemCat === String(selectedCategory).toLowerCase();
      });
    }

    if (foodSearch.trim()) {
      const q = foodSearch.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.foodName?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [foods, selectedCategory, foodSearch]);

  // Cart operations
  const handleItemAdd = (food) => {
    const fId = food.foodId || food.id;
    const fName = food.name || food.foodName || 'Item';
    const fPrice = Number(food.price) || 0;

    setNewOrder((prev) => {
      const existingIndex = prev.selectedItems.findIndex(
        (item) => item.foodId === fId
      );

      if (existingIndex > -1) {
        const updated = [...prev.selectedItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return { ...prev, selectedItems: updated };
      }

      return {
        ...prev,
        selectedItems: [
          ...prev.selectedItems,
          {
            foodId: fId,
            foodName: fName,
            price: fPrice,
            quantity: 1,
            specialRequest: ''
          }
        ]
      };
    });
  };

  const handleQuantityChange = (foodId, delta) => {
    setNewOrder((prev) => {
      const updated = prev.selectedItems
        .map((item) => {
          if (item.foodId === foodId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);

      return { ...prev, selectedItems: updated };
    });
  };

  const handleSpecialRequestChange = (foodId, note) => {
    setNewOrder((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.map((item) =>
        item.foodId === foodId ? { ...item, specialRequest: note } : item
      )
    }));
  };

  const handleItemRemove = (foodId) => {
    setNewOrder((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter((item) => item.foodId !== foodId)
    }));
  };

  const handleCancel = () => {
    setNewOrder((prev) => ({
      ...initialOrderState,
      branchId: prev.branchId
    }));
    setShowCreateOrder(false);
    setErrorMessage('');
  };

  const totalItemsCount = newOrder.selectedItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalAmount = newOrder.selectedItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const resolvedTableId =
      newOrder.tableId ||
      (newOrder.tableNumber ? Number(newOrder.tableNumber) : null);

    if (!newOrder.branchId) {
      setErrorMessage('Branch information is missing. Please refresh.');
      return;
    }

    if (!resolvedTableId) {
      setErrorMessage('Please select or specify a Table for this order.');
      return;
    }

    if (!newOrder.customerName?.trim()) {
      setErrorMessage('Please enter Customer Name.');
      return;
    }

    if (newOrder.selectedItems.length === 0) {
      setErrorMessage('Please add at least one menu item to the order.');
      return;
    }

    try {
      setIsSubmitting(true);

      const requestPayload = {
        branchId: Number(newOrder.branchId),
        tableId: Number(resolvedTableId),
        customerName: newOrder.customerName.trim(),
        customerPhone: newOrder.customerPhone?.trim() || null,
        specialInstructions: newOrder.specialInstructions?.trim() || null,
        items: newOrder.selectedItems.map((item) => ({
          foodId: Number(item.foodId),
          quantity: Number(item.quantity) || 1,
          specialRequest: item.specialRequest?.trim() || ''
        }))
      };

      const response = await api.post('/secure/api/v1/orders', requestPayload);
      const createdOrder = response.data?.data || response.data;

      // Update local grid & trigger refresh
      setOrders((prev) => [createdOrder, ...prev]);
      setRefreshKey((k) => k + 1);

      // Reset form
      setNewOrder((prev) => ({
        ...initialOrderState,
        branchId: prev.branchId
      }));

      setShowCreateOrder(false);
      setSuccessMessage('Order created successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to create order:', err.response?.data || err);
      setErrorMessage(
        err.response?.data?.message ||
        'Failed to create order. Please check the values and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title, Search & Create Order Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <OrdersHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        {!showCreateOrder && (
          <button
            onClick={() => {
              setShowCreateOrder(true);
              setErrorMessage('');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create New Order
          </button>
        )}
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* CREATE ORDER SECTION (PANEL / DRAWER)                       */}
      {/* ============================================================ */}
      {showCreateOrder && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Create New POS Order
                </h3>
                <p className="text-xs text-gray-500">
                  Select table, pick items from menu, and send directly to kitchen (KDS)
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              title="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content Grid */}
          <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12">
            {/* ── LEFT COLUMN: Menu Catalog (7 Cols) ────────────────── */}
            <div className="space-y-4 lg:col-span-7">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Utensils className="h-4 w-4 text-blue-600" />
                  Menu Items Catalog
                </h4>
                <span className="text-xs font-medium text-gray-500">
                  {filteredFoods.length} items available
                </span>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  {foodSearch && (
                    <button
                      onClick={() => setFoodSearch('')}
                      className="absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Items
                </button>
                {Array.isArray(categories) && categories.map((cat) => {
                  const catName = cat?.name || cat?.categoryName || (typeof cat === 'string' ? cat : '');
                  if (!catName) return null;
                  const isSelected =
                    String(selectedCategory).toLowerCase() ===
                    String(catName).toLowerCase();
                  return (
                    <button
                      key={cat?.categoryId || cat?.id || catName}
                      type="button"
                      onClick={() => setSelectedCategory(catName)}
                      className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {catName}
                    </button>
                  );
                })}
              </div>

              {/* Food Items Grid */}
              <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
                {loadingFoods ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mb-2" />
                    <p className="text-xs">Loading menu items...</p>
                  </div>
                ) : filteredFoods.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-gray-500">
                    <Utensils className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No items found</p>
                    <p className="text-xs text-gray-400">Try changing search query or category</p>
                  </div>
                ) : (
                  filteredFoods.map((food) => {
                    const fId = food.foodId || food.id;
                    const fName = food.name || food.foodName || 'Food Item';
                    const fPrice = Number(food.price) || 0;
                    const inCart = newOrder.selectedItems.find((i) => i.foodId === fId);

                    return (
                      <div
                        key={fId}
                        className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                          inCart
                            ? 'border-blue-200 bg-blue-50/40'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            {food.isVeg !== undefined && (
                              <span
                                className={`h-2 w-2 rounded-full shrink-0 ${
                                  food.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                                title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                              />
                            )}
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                              {fName}
                            </p>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-bold text-gray-900">
                              ₹{fPrice.toFixed(2)}
                            </span>
                            {food.categoryName && (
                              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                                {food.categoryName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Add / Quantity Control */}
                        {inCart ? (
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-200 p-1 shadow-xs">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(fId, -1)}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-blue-700">
                              {inCart.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(fId, 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleItemAdd(food)}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Customer, Table & Cart (5 Cols) ─────── */}
            <div className="flex flex-col justify-between space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5 lg:col-span-5">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 border-b border-gray-200/80 pb-2">
                  <Table2 className="h-4 w-4 text-blue-600" />
                  Order & Customer Details
                </h4>

                {/* Table Selection */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Table Number <span className="text-red-500">*</span>
                  </label>
                  {Array.isArray(tables) && tables.length > 0 ? (
                    <select
                      value={newOrder.tableId}
                      onChange={(e) => {
                        const val = e.target.value;
                        const selectedT = tables.find((t) => String(t.id || t.tableId) === val);
                        setNewOrder((prev) => ({
                          ...prev,
                          tableId: val,
                          tableNumber: selectedT ? (selectedT.tableNumber || selectedT.name || val) : val
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      required
                    >
                      <option value="">-- Select Table --</option>
                      {tables.map((t) => {
                        const tId = t.id || t.tableId;
                        const tNum = t.tableNumber || t.name || `Table ${tId}`;
                        const cap = t.capacity ? `(${t.capacity} seats)` : '';
                        return (
                          <option key={tId} value={tId}>
                            Table {tNum} {cap}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={newOrder.tableNumber}
                      onChange={(e) =>
                        setNewOrder((prev) => ({
                          ...prev,
                          tableNumber: e.target.value,
                          tableId: e.target.value
                        }))
                      }
                      placeholder="e.g. 1, 2, 3"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  )}
                </div>

                {/* Customer Name & Phone */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={newOrder.customerName}
                        onChange={(e) =>
                          setNewOrder((prev) => ({
                            ...prev,
                            customerName: e.target.value
                          }))
                        }
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-2.5 text-xs sm:text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Customer Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="tel"
                        value={newOrder.customerPhone}
                        onChange={(e) =>
                          setNewOrder((prev) => ({
                            ...prev,
                            customerPhone: e.target.value
                          }))
                        }
                        placeholder="9876543210"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-2.5 text-xs sm:text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Order Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newOrder.specialInstructions}
                    onChange={(e) =>
                      setNewOrder((prev) => ({
                        ...prev,
                        specialInstructions: e.target.value
                      }))
                    }
                    placeholder="e.g. Serve all items together, less spicy"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>

                {/* Selected Items List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span>Order Cart ({totalItemsCount} items)</span>
                    {newOrder.selectedItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setNewOrder((prev) => ({ ...prev, selectedItems: [] }))
                        }
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>

                  <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                    {newOrder.selectedItems.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
                        No items added to order yet.
                        <br />
                        Click "+ Add" on any item from the catalog.
                      </div>
                    ) : (
                      newOrder.selectedItems.map((item) => (
                        <div
                          key={item.foodId}
                          className="rounded-lg border border-gray-200 bg-white p-2.5 text-xs shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              {item.foodName}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                ₹{((item.price || 0) * item.quantity).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleItemRemove(item.foodId)}
                                className="text-gray-400 hover:text-red-500 p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={item.specialRequest}
                              onChange={(e) =>
                                handleSpecialRequestChange(
                                  item.foodId,
                                  e.target.value
                                )
                              }
                              placeholder="Add special request (e.g. extra cheese)"
                              className="flex-1 rounded border border-gray-100 bg-gray-50 px-2 py-1 text-[11px] text-gray-700 outline-none focus:bg-white focus:border-blue-300"
                            />
                            <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 p-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(item.foodId, -1)
                                }
                                className="flex h-5 w-5 items-center justify-center rounded text-gray-600 hover:bg-white"
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </button>
                              <span className="w-4 text-center font-bold text-gray-800 text-xs">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(item.foodId, 1)
                                }
                                className="flex h-5 w-5 items-center justify-center rounded text-gray-600 hover:bg-white"
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-gray-200/80">
                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Grand Total ({totalItemsCount} items)
                  </span>
                  <span className="text-base font-bold text-blue-700">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      newOrder.selectedItems.length === 0 ||
                      !newOrder.customerName ||
                      (!newOrder.tableId && !newOrder.tableNumber)
                    }
                    className="flex-2 rounded-xl bg-blue-600 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        Place Order (₹{totalAmount.toFixed(2)})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Status Legend */}
      <OrderFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        orders={orders}
      />

      <StatusLegend />

      {/* Orders Grid Display */}
      <OrdersGrid
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        onOrdersChange={setOrders}
        refreshTrigger={refreshKey}
      />
    </div>
  );
};

export default Orders;