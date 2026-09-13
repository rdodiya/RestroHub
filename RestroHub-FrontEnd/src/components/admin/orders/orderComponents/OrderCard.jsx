import { useState } from "react";
import {
  Clock,
  UserCheck,
  ChefHat,
  CheckCircle2,
  UtensilsCrossed,
  Receipt,
  CreditCard,
  XCircle,
  Phone,
  MoreVertical,
  Loader2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@services/common/api';

// Format ISO createdAt into a human-readable time
const formatTime = (iso) => {
  if (!iso) return '';

  try {
    const date = new Date(iso);

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

// Format amount in Indian Rupees
const formatAmount = (value) => {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return '₹0';
  }

  return `₹${num.toLocaleString('en-IN')}`;
};

// ------------------------------------
// STATUS CONFIG
// ------------------------------------

const statusConfig = {
  PENDING: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    icon: Clock,
    label: 'Pending',
  },

  CONFIRMED: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: UserCheck,
    label: 'Confirmed',
  },

  PREPARING: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: ChefHat,
    label: 'Preparing',
  },

  READY: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: CheckCircle2,
    label: 'Ready',
  },

  SERVED: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    icon: UtensilsCrossed,
    label: 'Served',
  },

  BILLED: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: Receipt,
    label: 'Billed',
  },

  COMPLETED: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: CreditCard,
    label: 'Completed',
  },

  CANCELLED: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
    label: 'Cancelled',
  },
};

// ------------------------------------
// NEXT ACTION CONFIG
// ------------------------------------

const actionConfig = {
  PENDING: {
    label: 'Start Preparing',
    next: 'PREPARING',
    icon: ChefHat,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    hoverBg: 'hover:bg-blue-100',
    border: 'border border-blue-200',
  },

  CONFIRMED: {
    label: 'Start Preparing',
    next: 'PREPARING',
    icon: ChefHat,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    hoverBg: 'hover:bg-blue-100',
    border: 'border border-blue-200',
  },

  PREPARING: {
    label: 'Mark Ready',
    next: 'READY',
    icon: CheckCircle2,
    bg: 'bg-green-50',
    text: 'text-green-700',
    hoverBg: 'hover:bg-green-100',
    border: 'border border-green-200',
  },

  READY: {
    label: 'Generate Bill',
    next: 'BILLED',
    icon: Receipt,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    hoverBg: 'hover:bg-purple-100',
    border: 'border border-purple-200',
  },

  BILLED: {
    label: 'Complete Order',
    next: 'COMPLETED',
    icon: CreditCard,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    hoverBg: 'hover:bg-gray-100',
    border: 'border border-gray-200',
  },
};

// ------------------------------------
// ORDER CARD
// ------------------------------------

const OrderCard = ({ order, onStatusUpdate, compact = false }) => {
  const [updating, setUpdating] = useState(false);

  const currentStatus = order?.status?.toUpperCase() || 'PENDING';

  const status = statusConfig[currentStatus] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: Clock,
    label: order?.status || 'Unknown',
  };

  const action = actionConfig[currentStatus];

  const StatusIcon = status.icon;

  // ------------------------------------
  // UPDATE ORDER STATUS
  // ------------------------------------

  const handleAction = async () => {
    if (!action || !order?.orderId) {
      return;
    }

    try {
      setUpdating(true);

      const backendStatus = action.next.toUpperCase();

      await api.patch(
        `/secure/api/v1/orders/${order.orderId}/status`,
        {
          status: backendStatus,
        }
      );

      if (onStatusUpdate) {
        onStatusUpdate(order.orderId, backendStatus);
      }
    } catch (err) {
      console.error(
        'Failed to update order status:',
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.message ||
          'Failed to update order status'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!order?.orderId) return;
    const isConfirmed = window.confirm(
      `Are you sure you want to cancel Order #${order.orderId}?`,
    );
    if (!isConfirmed) return;

    try {
      setUpdating(true);
      await api.post(`/secure/api/v1/orders/${order.orderId}/cancel`);
      toast.success(`Order #${order.orderId} cancelled`);
      if (onStatusUpdate) {
        onStatusUpdate(order.orderId, 'CANCELLED');
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setUpdating(false);
    }
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all ${compact ? 'p-3.5' : 'p-5'}`}>

      {/* Header */}
      <div className={`flex items-start justify-between ${compact ? 'mb-2.5' : 'mb-4'}`}>

        <div className="flex items-center gap-2.5">

          {/* Order ID */}
          <div className={`${compact ? 'w-9 h-9 text-xs' : 'w-12 h-12 text-sm'} bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0`}>
            <span className="font-bold text-blue-700">
              #{order?.orderId}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">

              {/* Table */}
              <span className={`font-semibold text-gray-900 ${compact ? 'text-sm' : ''}`}>
                Table {order?.tableNumber || order?.table || '—'}
              </span>

              {/* Status */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}
              >
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>

            </div>

            <p className="text-xs text-gray-500 mt-0.5">
              {formatTime(order?.createdAt)}
            </p>
          </div>

        </div>

        {/* More Button */}
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

      </div>

      {/* Customer Information */}
      <div className={`flex items-center gap-2.5 bg-gray-50 rounded-xl border border-gray-100 ${compact ? 'p-2 mb-2.5' : 'p-3 mb-4'}`}>

        <div className={`${compact ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'} bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shrink-0`}>
          <span className="font-semibold text-blue-700">
            {(order?.customerName || 'C')
              .charAt(0)
              .toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">

          <p className="text-xs font-semibold text-gray-900 truncate">
            {order?.customerName || 'Walk-in'}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
            <Phone className="w-3 h-3 shrink-0" />

            <span className="truncate">
              {order?.customerPhone || '—'}
            </span>
          </div>

        </div>

      </div>

      {/* Order Items */}
      <div className={`space-y-1.5 ${compact ? 'mb-3' : 'mb-4'}`}>

        <div className={compact ? 'max-h-24 overflow-y-auto space-y-1 pr-1' : 'space-y-2'}>
          {(order?.items || []).map((item, index) => (
            <div
              key={item?.foodId || index}
              className="flex justify-between items-center text-xs"
            >

              <span className="text-gray-600 truncate pr-2">
                <span className="font-medium text-gray-800">{item?.quantity || 0}x</span>{' '}
                {item?.foodName || 'Unknown Item'}
              </span>

              <span className="text-gray-800 font-medium whitespace-nowrap">
                {formatAmount(item?.subtotal)}
              </span>

            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">

          <span className="font-semibold text-gray-700 text-xs">
            Total
          </span>

          <span className={`font-bold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
            {formatAmount(order?.totalAmount ?? order?.amount)}
          </span>

        </div>

      </div>

      {/* Action Button */}
      {action && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAction}
            disabled={updating}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl transition-all font-semibold disabled:opacity-50 ${compact ? 'px-2.5 py-2 text-xs' : 'px-4 py-2.5 text-sm'} ${action.bg} ${action.text} ${action.hoverBg} ${action.border}`}
          >

            {updating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <action.icon className="w-3.5 h-3.5" />
            )}

            {updating
              ? 'Updating...'
              : action.label}

          </button>
          {currentStatus === 'PENDING' && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={updating}
              className={`flex items-center justify-center gap-1 rounded-xl transition-all font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50 ${compact ? 'px-2 py-2 text-xs' : 'px-3 py-2.5 text-sm'}`}
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default OrderCard;
