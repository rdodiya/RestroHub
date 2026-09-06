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
import OrderCard from '../../orders/orderComponents/OrderCard';

// Format ISO createdAt into readable time ago string
const formatTimeAgo = (iso) => {
  if (!iso) return '';
  const now = new Date().getTime() / 1000;
  const created = new Date(iso).getTime() / 1000;
  const diff = now - created;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// Status badge config matching backend OrderStatus enum
const StatusBadge = ({ status }) => {
  const { isDark } = useAdminTheme();
  const config = {
    PENDING:   { bg: isDark ? 'bg-yellow-900/40' : 'bg-yellow-100', text: isDark ? 'text-yellow-400' : 'text-yellow-700', icon: Clock, label: 'Pending' },
    CONFIRMED: { bg: isDark ? 'bg-indigo-900/40' : 'bg-indigo-100', text: isDark ? 'text-indigo-400' : 'text-indigo-700', icon: CheckCircle2, label: 'Confirmed' },
    PREPARING: { bg: isDark ? 'bg-blue-900/40'   : 'bg-blue-100',   text: isDark ? 'text-blue-400'   : 'text-blue-700',   icon: ChefHat, label: 'Preparing' },
    READY:     { bg: isDark ? 'bg-green-900/40'  : 'bg-green-100',  text: isDark ? 'text-green-400'  : 'text-green-700',  icon: CheckCircle2, label: 'Ready' },
    BILLED:    { bg: isDark ? 'bg-purple-900/40' : 'bg-purple-100', text: isDark ? 'text-purple-400' : 'text-purple-700', icon: Receipt, label: 'Billed' },
    CANCELLED: { bg: isDark ? 'bg-red-900/40'    : 'bg-red-100',    text: isDark ? 'text-red-400'    : 'text-red-700',    icon: XCircle, label: 'Cancelled' },
  };

  const { bg, text, icon: Icon, label: lbl } = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {lbl}
    </span>
  );
};

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useAdminTheme();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);

    const handleOrdersUpdated = () => {
      fetchOrders();
    };
    window.addEventListener('restrohub:order-updated', handleOrdersUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('restrohub:order-updated', handleOrdersUpdated);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Get branchId from authenticated user's restaurant context
      const branchRes = await api.get('/secure/api/v1/users/fetchRestaurantId');
      const branchData = branchRes.data || {};
      const branchId = branchData.branchId;

      if (!branchId) {
        setError('No branch found for current user');
        setOrders([]);
        return;
      }

      const response = await api.get(`/secure/api/v1/orders/branch/${branchId}/active`);
      const data = Array.isArray(response.data) ? response.data : [];

      // Transform backend OrderResponse to format expected by OrderCard
      const transformed = data.map((order) => ({
        orderId: order.orderId,
        tableNumber: order.tableNumber,
        totalAmount: order.totalAmount,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        createdAt: order.createdAt,
        status: order.status,
        items: order.items?.map((item) => ({
          foodName: item.foodName,
          quantity: item.quantity,
          subtotal: item.subtotal,
          specialRequest: item.specialRequest
        })) || []
      }));

      setOrders(transformed);
    } catch (err) {
      console.error('Failed to fetch live orders:', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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
            <AdminSkeleton key={i} variant="order" />
          ))
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} compact={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrders;