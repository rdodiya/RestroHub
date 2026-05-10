import { useState, useEffect } from 'react';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import api from "@services/common/api";

// ============================================
// STATUS BADGE (Private to this file)
// ============================================
const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
    cooking: { bg: 'bg-blue-100', text: 'text-blue-700', icon: ChefHat, label: 'Cooking' },
    ready: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Ready' },
  };

  const { bg, text, icon: Icon, label } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// ============================================
// ORDER CARD (Private to this file)
// ============================================
const OrderCard = ({ order }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
        <span className="font-bold text-orange-600">#{order.id}</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Table {order.table}</span>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1">{order.items}</p>
      </div>
    </div>
    <p className="font-bold text-gray-800">₹{order.amount}</p>
  </div>
);

// ============================================
// SKELETON (Private to this file)
// ============================================
const OrderSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      <div>
        <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
        <div className="w-48 h-3 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="w-16 h-5 bg-gray-200 rounded" />
  </div>
);

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // ------------------------------------
  // FALLBACK DATA
  // ------------------------------------
  const fallbackOrders = [
    { id: 123, table: 4, amount: 450, status: 'cooking', items: '2x Paneer, 1x Lassi' },
    { id: 124, table: 7, amount: 320, status: 'ready', items: '1x Biryani, 2x Roti' },
    { id: 125, table: 2, amount: 780, status: 'cooking', items: '3x Thali' },
    { id: 126, table: 9, amount: 190, status: 'pending', items: '2x Lassi' },
  ];

  // ------------------------------------
  // FETCH DATA
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
      // const response = await api.get('/api/orders?status=active&limit=5');
      // setOrders(response.data);

      // 🎭 MOCK
      await new Promise(resolve => setTimeout(resolve, 600));
      setOrders(fallbackOrders);

    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
      setOrders(fallbackOrders);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Live Orders Feed</h2>
          {refreshing && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <a
            href="/admin/orders"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            View All →
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          // Skeleton Loading
          [1, 2, 3, 4].map(i => <OrderSkeleton key={i} />)
        ) : error && orders.length === 0 ? (
          // Error State
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-600 mb-2">{error}</p>
            <button onClick={fetchOrders} className="text-sm text-red-700 underline">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          // Empty State
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
            <p className="text-gray-500">No active orders right now</p>
          </div>
        ) : (
          // Orders List
          orders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};

export default LiveOrders;