import { useState } from "react";
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Receipt,
  CreditCard,
  Phone,
  MoreVertical,
  Loader2,
  XCircle,
  UserCheck,
  UtensilsCrossed,
} from 'lucide-react';
import api from "@services/common/api";
import toast from 'react-hot-toast';

const OrderCard = ({ order, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  // ------------------------------------
  // STATUS CONFIG
  // Keys match backend OrderStatus enum values (uppercase)
  // ------------------------------------
  const statusConfig = {
    PENDING: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: Clock,
      label: "Pending",
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
      label: "Ready",
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
      label: "Billed",
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: X,
      label: "Cancelled",
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
  // Defines the order lifecycle transition for each status.
  // Flow: PENDING → PREPARING → READY → BILLED → COMPLETED
  // CONFIRMED also transitions to PREPARING.
  // No action button for SERVED, COMPLETED, or CANCELLED.
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
      bg: "bg-blue-50",
      text: "text-blue-700",
      hoverBg: "hover:bg-blue-100",
      border: "border border-blue-200",
    },
    PREPARING: {
      label: 'Mark Ready',
      next: 'READY',
      icon: CheckCircle2,
      bg: "bg-green-50",
      text: "text-green-700",
      hoverBg: "hover:bg-green-100",
      border: "border border-green-200",
    },
    READY: {
      label: 'Generate Bill',
      next: 'BILLED',
      icon: Receipt,
      bg: "bg-purple-50",
      text: "text-purple-700",
      hoverBg: "hover:bg-purple-100",
      border: "border border-purple-200",
    },
    BILLED: {
      label: 'Complete Order',
      next: 'COMPLETED',
      icon: CreditCard,
      bg: "bg-gray-50",
      text: "text-gray-700",
      hoverBg: "hover:bg-gray-100",
      border: "border border-gray-200",
    },
    cancelled: {
      label: "Cancelled",
      next: null,
      icon: X,
      bg: "bg-red-50",
      text: "text-red-700",
      hoverBg: "hover:bg-red-100",
      border: "border border-red-200",
    },
  };

  // Fallback for any unrecognised status to prevent crashes
  const defaultStatus = {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: Clock,
    label: order.status || 'Unknown',
  };

  const status = statusConfig[order.status] || defaultStatus;
  const action = actionConfig[order.status];
  const StatusIcon = status.icon;

  // ------------------------------------
  // HANDLER
  // ------------------------------------
  // Map frontend status to backend enum
  const statusMap = {
    cooking: 'PREPARING',
    ready: 'READY',
    billed: 'COMPLETED',
    complete: 'COMPLETED',
    pending: 'PENDING',
  };

  const handleAction = async () => {
    if (!action) return;

    try {
      setUpdating(true);

      const backendStatus = statusMap[action.next] || action.next.toUpperCase();

      await api.patch(`/secure/api/v1/orders/${order.id}/status`, {
        status: backendStatus,
      });

      onStatusUpdate(order.id, action.next);
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!isConfirmed) return;

    try {
      setUpdating(true);

      // 🔌 UNCOMMENT WHEN API READY
      // await api.put(`/api/orders/${order.id}/status`, { status: 'cancelled' });
      // toast.success(`Order #${order.id} cancelled`);

      await new Promise((resolve) => setTimeout(resolve, 400));
      onStatusUpdate(order.id, "cancelled");
    } catch (err) {
      console.error("Failed to cancel order:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Order ID Badge */}
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
            <span className="font-bold text-blue-700 text-sm">#{order.id}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                Table {order.table}
              </span>
              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}
              >
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{order.time}</p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
          <span className="text-sm font-semibold text-blue-700">
            {order.customer.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{order.customer}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Phone className="w-3 h-3" />
            <span>{order.phone}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.qty}x {item.name}
            </span>
            <span className="text-gray-800 font-medium">
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-lg text-gray-900">
            ₹{order.amount}
          </span>
        </div>
      </div>

      {/* Action Button - NO WHITE TEXT */}
      {action && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleAction}
            disabled={updating}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold disabled:opacity-50 ${action.bg} ${action.text} ${action.hoverBg} ${action.border}`}
          >
            {updating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <action.icon className="w-4 h-4" />
            )}
            {action.label}
          </button>
          {order.status === "pending" && (
            <button
              onClick={handleCancel}
              disabled={updating}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
