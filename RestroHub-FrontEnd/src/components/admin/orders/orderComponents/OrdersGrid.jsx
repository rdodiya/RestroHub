import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ClipboardList } from 'lucide-react';
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
      status: 'cooking',
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
      status: 'ready',
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
      status: 'pending',
      customer: 'Amit Kumar',
      phone: '9876543212',
      items: [{ name: 'Special Thali', qty: 3, price: 260 }],
      time: '2 mins ago',
    },
    {
      id: 126,
      table: 9,
      amount: 190,
      status: 'billed',
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

    // 🔌 UNCOMMENT: Auto-refresh every 30 seconds
    // const interval = setInterval(fetchOrders, 30000);
    // return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      if (!loading) setRefreshing(true);
      setError(null);

      // 🔌 UNCOMMENT WHEN API READY
      // const response = await api.get('/api/orders');
      // setOrders(response.data);

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
    }
  };

  // ------------------------------------
  // HANDLERS
  // ------------------------------------
  const handleStatusUpdate = (orderId, newStatus) => {
    if (newStatus === 'complete') {
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