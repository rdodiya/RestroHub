import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ClipboardList } from 'lucide-react';
import OrderCard from './OrderCard';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import toast from 'react-hot-toast';

const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-xl" />
        <div>
          <div className="w-28 h-5 bg-gray-100 rounded mb-1" />
          <div className="w-20 h-3 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="w-8 h-8 bg-gray-100 rounded-lg" />
    </div>
    <div className="p-3 bg-gray-50 rounded-xl mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full" />
        <div>
          <div className="w-24 h-4 bg-gray-100 rounded mb-1" />
          <div className="w-20 h-3 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <div className="w-32 h-4 bg-gray-100 rounded" />
        <div className="w-12 h-4 bg-gray-100 rounded" />
      </div>
      <div className="flex justify-between">
        <div className="w-24 h-4 bg-gray-100 rounded" />
        <div className="w-12 h-4 bg-gray-100 rounded" />
      </div>
      <div className="flex justify-between pt-2 border-t">
        <div className="w-16 h-5 bg-gray-100 rounded" />
        <div className="w-16 h-6 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="w-full h-10 bg-gray-100 rounded-xl" />
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const OrdersGrid = ({ activeFilter, searchQuery, onOrdersChange, refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [branchId, setBranchId] = useState(null);

  // Sync orders up to parent so OrderFilters gets real counts
  const syncOrders = (updated) => {
    setOrders(updated);
    onOrdersChange?.(updated);
  };

  // ------------------------------------
  // FETCH ORDERS WITH BRANCH ID FROM AUTH
  // ------------------------------------
  useEffect(() => {
    fetchBranchIdAndOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchBranchIdAndOrders, 30000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const fetchBranchIdAndOrders = async () => {
    try {
      if (loading) setRefreshing(true);
      else setError(null);

      // Get the current branch from the authenticated user's restaurant context
      const branchRes = await api.get('/secure/api/v1/users/fetchRestaurantId');
      const branchData = branchRes.data || {};
      setBranchId(branchData.branchId || null);

      if (!branchData.branchId) {
        setError('No branch found for the current user');
        syncOrders([]);
        return;
      }

      const response = await api.get(`/secure/api/v1/orders/branch/${branchData.branchId}/active`);
      const data = Array.isArray(response.data) ? response.data : [];
      syncOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to fetch orders');
      setError('Failed to load orders');
      syncOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ------------------------------------
  // HANDLER
  // ------------------------------------
  const handleStatusUpdate = (orderId, newStatus) => {
    if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
      syncOrders(orders.filter((o) => o.orderId !== orderId));
    } else {
      syncOrders(orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)));
    }
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredOrders = orders
    .filter((o) => activeFilter === 'all' || o.status === activeFilter)
    .filter((o) => {
      if (!query) return true;
      return (
        String(o.orderId).includes(query) ||
        (o.customerName || '').toLowerCase().includes(query) ||
        String(o.tableNumber).includes(query) ||
        (o.status || '').toLowerCase().includes(query) ||
        (o.customerPhone || '').includes(query) ||
        (o.items || []).some((item) => (item.foodName || '').toLowerCase().includes(query))
      );
    });

  // ------------------------------------
  // RENDER
  // ------------------------------------
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <AdminSkeleton key={i} variant="order-card" />
        ))}
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <p className="text-red-600 font-medium mb-2">{error}</p>
        <button
          onClick={fetchBranchIdAndOrders}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
        <ClipboardList className="w-16 h-16 text-blue-200 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-1">No orders found</p>
        <p className="text-gray-500 text-sm">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : activeFilter !== 'all'
              ? `No ${activeFilter} orders right now`
              : 'No orders yet. They will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Refresh indicator */}
      {refreshing && (
        <div className="flex items-center gap-2 mb-4 text-sm text-blue-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Refreshing orders...</span>
        </div>
      )}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>

      {/* Results Count */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>
    </div>
  );
};

export default OrdersGrid;