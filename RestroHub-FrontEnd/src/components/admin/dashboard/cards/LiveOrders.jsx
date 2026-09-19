import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Receipt,
  XCircle,
  RefreshCw,
  AlertCircle,
  Table2,
  User,
  Phone,
  ArrowRight,
  UtensilsCrossed,
  UserCheck,
  CreditCard
} from 'lucide-react';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';
import toast from 'react-hot-toast';

// Format ISO createdAt into readable time ago string
const formatTimeAgo = (iso) => {
  if (!iso) return '';
  try {
    const now = new Date().getTime() / 1000;
    const created = new Date(iso).getTime() / 1000;
    const diff = now - created;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return '';
  }
};

// Format amount in Indian Rupees
const formatAmount = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

// Status badge matching backend OrderStatus enum
const StatusBadge = ({ status }) => {
  const { isDark } = useAdminTheme();
  const config = {
    PENDING:   { bg: isDark ? 'bg-yellow-900/40 border-yellow-800/60' : 'bg-yellow-50 border-yellow-200', text: isDark ? 'text-yellow-400' : 'text-yellow-700', icon: Clock, label: 'Pending' },
    CONFIRMED: { bg: isDark ? 'bg-indigo-900/40 border-indigo-800/60' : 'bg-indigo-50 border-indigo-200', text: isDark ? 'text-indigo-400' : 'text-indigo-700', icon: UserCheck, label: 'Confirmed' },
    PREPARING: { bg: isDark ? 'bg-blue-900/40 border-blue-800/60'   : 'bg-blue-50 border-blue-200',     text: isDark ? 'text-blue-400'   : 'text-blue-700',   icon: ChefHat, label: 'Preparing' },
    READY:     { bg: isDark ? 'bg-green-900/40 border-green-800/60'  : 'bg-green-50 border-green-200',   text: isDark ? 'text-green-400'  : 'text-green-700',  icon: CheckCircle2, label: 'Ready' },
    SERVED:    { bg: isDark ? 'bg-teal-900/40 border-teal-800/60'    : 'bg-teal-50 border-teal-200',     text: isDark ? 'text-teal-400'   : 'text-teal-700',   icon: UtensilsCrossed, label: 'Served' },
    BILLED:    { bg: isDark ? 'bg-purple-900/40 border-purple-800/60' : 'bg-purple-50 border-purple-200', text: isDark ? 'text-purple-400' : 'text-purple-700', icon: Receipt, label: 'Billed' },
    COMPLETED: { bg: isDark ? 'bg-gray-800 border-gray-700'          : 'bg-gray-100 border-gray-200',    text: isDark ? 'text-gray-300'   : 'text-gray-700',   icon: CreditCard, label: 'Completed' },
    CANCELLED: { bg: isDark ? 'bg-red-900/40 border-red-800/60'       : 'bg-red-50 border-red-200',       text: isDark ? 'text-red-400'    : 'text-red-700',    icon: XCircle, label: 'Cancelled' },
  };

  const { bg, text, icon: Icon, label: lbl } = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${text}`}>
      <Icon className="w-3.5 h-3.5" />
      {lbl}
    </span>
  );
};

const LiveOrders = () => {
  const navigate = useNavigate();
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

      // Transform backend OrderResponse to format expected
      const transformed = data.map((order) => ({
        orderId: order.orderId,
        tableNumber: order.tableNumber,
        tableId: order.tableId,
        totalAmount: order.totalAmount ?? order.amount,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        specialInstructions: order.specialInstructions,
        createdAt: order.createdAt,
        status: order.status,
        items: order.items?.map((item) => ({
          foodId: item.foodId,
          foodName: item.foodName,
          quantity: item.quantity,
          subtotal: item.subtotal,
          specialRequest: item.specialRequest
        })) || []
      }));

      setOrders(transformed);
    } catch (err) {
      console.error('Failed to fetch live orders:', err);
      toast.error('Failed to fetch orders');
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Open order in Orders page with modal opened
  const handleOrderClick = (order) => {
    navigate('/admin/orders', {
      state: {
        selectedOrder: order,
        orderId: order.orderId
      }
    });
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate('/admin/orders');
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Live Orders Feed</h2>
          {orders.length > 0 && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isDark ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-100'
            }`}>
              {orders.length} Active
            </span>
          )}
          {refreshing && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            title="Refresh Orders"
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleViewAll}
            className="text-sm text-orange-500 hover:text-orange-400 font-semibold inline-flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <AdminSkeleton key={i} variant="order" />
            ))}
          </div>
        ) : error && orders.length === 0 ? (
          // Error State
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-500 mb-2 font-medium">{error}</p>
            <button
              onClick={fetchOrders}
              className="text-sm text-red-500 hover:text-red-600 underline font-medium cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No active orders right now</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>New incoming live orders will appear here automatically</p>
          </div>
        ) : (
          /* Vertical Live Orders List with Table, Status, User Info, and Total Bill */
          <div className="flex flex-col space-y-3">
            {orders.map((order) => (
              <div
                key={order.orderId}
                onClick={() => handleOrderClick(order)}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-xs'
                }`}
              >
                {/* Left Side: Order ID, Table & Status */}
                <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
                  {/* Order ID Pill */}
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                    isDark ? 'bg-blue-900/60 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    #{order.orderId}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 dark:text-gray-100">
                        <Table2 className="w-4 h-4 text-orange-500" />
                        <span>Table {order.tableNumber || order.table || '—'}</span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimeAgo(order.createdAt)}
                      </span>
                      <span>•</span>
                      <span>
                        {(order.items || []).reduce((acc, item) => acc + (item.quantity || 1), 0)} items
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Customer Info & Total Bill */}
                <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-7 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700">
                  {/* Customer Information */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className={`text-xs font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {order.customerName || 'Walk-in'}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                        {order.customerPhone ? (
                          <>
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{order.customerPhone}</span>
                          </>
                        ) : (
                          'No phone'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Total Bill Amount */}
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-400">Total Bill</p>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {formatAmount(order.totalAmount)}
                    </p>
                  </div>

                  {/* Action Arrow */}
                  <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-gray-700 transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrders;