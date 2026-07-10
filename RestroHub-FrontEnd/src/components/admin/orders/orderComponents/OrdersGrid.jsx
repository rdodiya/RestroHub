import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ClipboardList, Clock } from 'lucide-react';
import OrderCard from './OrderCard';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';

// ============================================
// MAIN COMPONENT
// ============================================
const OrdersGrid = ({ activeFilter, searchQuery, onOrdersChange }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Sync orders up to parent so OrderFilters gets real counts
  const syncOrders = (updated) => {
    setOrders(updated);
    onOrdersChange?.(updated);
  };

  // ------------------------------------
  // FALLBACK DATA
  // ------------------------------------
  const fallbackOrders = [
    {
      id: 123,
      table: 4,
      amount: 450,
      status: 'PREPARING',
      customer: 'John Doe',
      phone: '9876543210',
      items: [
        { name: 'Paneer Tikka', qty: 2, price: 180 },
        { name: 'Lassi', qty: 1, price: 90 },
      ],
      time: '5 mins ago',
    },
    {
      id: 124,
      table: 7,
      amount: 320,
      status: 'READY',
      customer: 'Priya Sharma',
      phone: '9876543211',
      items: [
        { name: 'Biryani', qty: 1, price: 220 },
        { name: 'Roti', qty: 2, price: 50 },
      ],
      time: '12 mins ago',
    },
    {
      id: 125,
      table: 2,
      amount: 780,
      status: 'PENDING',
      customer: 'Amit Kumar',
      phone: '9876543212',
      items: [{ name: 'Special Thali', qty: 3, price: 260 }],
      time: '2 mins ago',
    },
    {
      id: 126,
      table: 9,
      amount: 190,
      status: 'BILLED',
      customer: 'Sara Khan',
      phone: '9876543213',
      items: [{ name: 'Sweet Lassi', qty: 2, price: 95 }],
      time: '25 mins ago',
    },
  ];

  // ------------------------------------
  // FETCH
  // ------------------------------------
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      if (!loading) setRefreshing(true);
      setError(null);

      // 🔌 UNCOMMENT WHEN API READY (replace {branchId} with actual branch ID)
      // const response = await api.get('/secure/api/v1/orders/branch/{branchId}/active');
      // syncOrders(response.data);

      // 🎭 MOCK
      await new Promise((resolve) => setTimeout(resolve, 700));
      syncOrders(fallbackOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
      syncOrders(fallbackOrders);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastRefreshed(new Date());
    }
  };

  // ------------------------------------
  // HANDLERS
  // ------------------------------------
  const handleStatusUpdate = (orderId, newStatus) => {
    if (newStatus === 'COMPLETED') {
      syncOrders(orders.filter((o) => o.id !== orderId));
    } else {
      syncOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    }
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredOrders = orders
    .filter((o) => activeFilter === 'all' || o.status === activeFilter)
    .filter((o) => {
      if (!query) return true;
      return (
        o.id.toString().includes(query) ||
        o.customer.toLowerCase().includes(query) ||
        o.table.toString().includes(query) ||
        o.status.toLowerCase().includes(query) ||
        o.phone.includes(query) ||
        o.items.some((item) => item.name.toLowerCase().includes(query))
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
          onClick={fetchOrders}
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
      {/* Refresh indicator & last refreshed */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {refreshing && (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-600">Refreshing orders...</span>
            </>
          )}
          {!refreshing && lastRefreshed && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        <button
          onClick={fetchOrders}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
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