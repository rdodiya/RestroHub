import { useState, useEffect } from 'react';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Receipt,
  XCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';

// ============================================
// STATUS BADGE (Private to this file)
// ============================================
const StatusBadge = ({ status }) => {
  const { isDark } = useAdminTheme();
  // Keys match backend OrderStatus enum values (uppercase)
  const config = {
    PENDING:   { bg: isDark ? 'bg-yellow-900/40' : 'bg-yellow-100', text: isDark ? 'text-yellow-400' : 'text-yellow-700', icon: Clock, label: 'Pending' },
    CONFIRMED: { bg: isDark ? 'bg-indigo-900/40' : 'bg-indigo-100', text: isDark ? 'text-indigo-400' : 'text-indigo-700', icon: CheckCircle2, label: 'Confirmed' },
    PREPARING: { bg: isDark ? 'bg-blue-900/40'   : 'bg-blue-100',   text: isDark ? 'text-blue-400'   : 'text-blue-700',   icon: ChefHat, label: 'Preparing' },
    READY:     { bg: isDark ? 'bg-green-900/40'  : 'bg-green-100',  text: isDark ? 'text-green-400'  : 'text-green-700',  icon: CheckCircle2, label: 'Ready' },
    BILLED:    { bg: isDark ? 'bg-purple-900/40' : 'bg-purple-100', text: isDark ? 'text-purple-400' : 'text-purple-700', icon: Receipt, label: 'Billed' },
    CANCELLED: { bg: isDark ? 'bg-red-900/40'    : 'bg-red-100',    text: isDark ? 'text-red-400'    : 'text-red-700',    icon: XCircle, label: 'Cancelled' },
  };

  const { bg, text, icon: Icon, label } = config[status] || config.PENDING;

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
const OrderCard = ({ order }) => {
  const { isDark } = useAdminTheme();
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-900/40' : 'bg-orange-100'}`}>
          <span className={`font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>#{order.id}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Table {order.table}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{order.items}</p>
        </div>
      </div>
      <p className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>₹{order.amount}</p>
    </div>
  );
};

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useAdminTheme();

  // ------------------------------------
  // FALLBACK DATA
  // ------------------------------------
  const fallbackOrders = [
    { id: 123, table: 4, amount: 450, status: 'PREPARING', items: '2x Paneer, 1x Lassi' },
    { id: 124, table: 7, amount: 320, status: 'READY', items: '1x Biryani, 2x Roti' },
    { id: 125, table: 2, amount: 780, status: 'PREPARING', items: '3x Thali' },
    { id: 126, table: 9, amount: 190, status: 'PENDING', items: '2x Lassi' },
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

      // 🔌 UNCOMMENT WHEN API READY (replace {branchId} with actual branch ID)
      // const response = await api.get('/secure/api/v1/orders/branch/{branchId}/active');
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
    <div className={`lg:col-span-2 rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Live Orders Feed</h2>
          {refreshing && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className={`text-sm transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <a
            href="/admin/orders"
            className="text-sm text-orange-500 hover:text-orange-400 font-medium"
          >
            View All →
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
          <AdminSkeleton key={i} variant="order" />))
          ) : error && orders.length === 0 ? (
          // Error State
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-500 mb-2">{error}</p>
            <button onClick={fetchOrders} className="text-sm text-red-400 underline">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No active orders right now</p>
          </div>
        ) : (
          orders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};

export default LiveOrders;