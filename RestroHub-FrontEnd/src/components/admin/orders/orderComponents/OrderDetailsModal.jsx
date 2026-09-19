import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Clock,
  User,
  Phone,
  Table2,
  ChefHat,
  CheckCircle2,
  Receipt,
  CreditCard,
  XCircle,
  AlertCircle,
  Loader2,
  UtensilsCrossed,
  UserCheck,
  ShoppingBag
} from 'lucide-react';
import api from '@services/common/api';
import toast from 'react-hot-toast';

const formatTime = (iso) => {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '—';
  }
};

const formatAmount = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '₹0.00';
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const statusConfig = {
  PENDING: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    icon: Clock,
    label: 'Pending'
  },
  CONFIRMED: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    icon: UserCheck,
    label: 'Confirmed'
  },
  PREPARING: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    icon: ChefHat,
    label: 'Preparing'
  },
  READY: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    icon: CheckCircle2,
    label: 'Ready'
  },
  SERVED: {
    bg: 'bg-teal-50 text-teal-700 border-teal-200/80',
    icon: UtensilsCrossed,
    label: 'Served'
  },
  BILLED: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
    icon: Receipt,
    label: 'Billed'
  },
  COMPLETED: {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: CreditCard,
    label: 'Completed'
  },
  CANCELLED: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    icon: XCircle,
    label: 'Cancelled'
  }
};

const OrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const currentStatus = order?.status?.toUpperCase() || 'PENDING';
  const statusInfo = statusConfig[currentStatus] || {
    bg: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: Clock,
    label: order?.status || 'Unknown'
  };
  const StatusIcon = statusInfo.icon;

  const handleUpdateStatus = async (nextStatus) => {
    if (!order?.orderId || updating) return;
    try {
      setUpdating(true);
      await api.patch(`/secure/api/v1/orders/${order.orderId}/status`, {
        status: nextStatus.toUpperCase()
      });
      toast.success(`Order status updated to ${nextStatus}`);
      if (onStatusUpdate) {
        onStatusUpdate(order.orderId, nextStatus.toUpperCase());
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order?.orderId || updating) return;
    const isConfirmed = window.confirm(`Are you sure you want to cancel Order #${order.orderId}?`);
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

  const totalItemsCount = (order.items || []).reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-[3px] transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg h-[84vh] max-h-[700px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm shadow-blue-500/20 text-xs">
              #{order.orderId}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Order Details
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.bg}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                Placed: {formatTime(order.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-modal-scroll">
          {/* Customer & Table Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Table Info */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shrink-0">
                <Table2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Table Info
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  Table {order.tableNumber || order.table || '—'}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {order.customerName || 'Walk-in'}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                  <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span className="truncate">{order.customerPhone || 'No phone'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 flex items-start gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                  Special Instructions
                </p>
                <p className="text-xs text-amber-950/90 mt-0.5 leading-normal break-words">
                  {order.specialInstructions}
                </p>
              </div>
            </div>
          )}

          {/* Order Items Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                <span>Items Ordered</span>
              </h4>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-3.5 py-2.5 text-left">Item Name</th>
                    <th scope="col" className="px-2 py-2.5 text-center">Qty</th>
                    <th scope="col" className="px-3.5 py-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(order.items || []).length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-4 text-center text-slate-400 text-xs">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    order.items.map((item, index) => (
                      <tr key={item.foodId || index} className="hover:bg-slate-50/50">
                        <td className="px-3.5 py-2.5">
                          <p className="font-semibold text-slate-800 text-xs">{item.foodName || 'Item'}</p>
                          {item.specialRequest && (
                            <span className="inline-block text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-0.5 mt-0.5 font-medium">
                              Note: {item.specialRequest}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2.5 text-center font-bold text-slate-600 text-xs">
                          x{item.quantity || 1}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-bold text-slate-800 whitespace-nowrap text-xs">
                          {formatAmount(item.subtotal)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Grand Total Row */}
              <div className="bg-slate-50/90 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Grand Total</span>
                <span className="text-sm sm:text-base font-extrabold text-blue-600">
                  {formatAmount(order.totalAmount ?? order.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions in scroll body */}
          <div className="border-t border-slate-100 pt-3">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Order Actions
            </h5>
            <div className="flex flex-wrap items-center gap-2">
              {currentStatus === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus('PREPARING')}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChefHat className="w-3.5 h-3.5" />}
                    Start Preparing
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel Order
                  </button>
                </>
              )}

              {currentStatus === 'CONFIRMED' && (
                <button
                  onClick={() => handleUpdateStatus('PREPARING')}
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChefHat className="w-3.5 h-3.5" />}
                  Start Preparing
                </button>
              )}

              {currentStatus === 'PREPARING' && (
                <button
                  onClick={() => handleUpdateStatus('READY')}
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Mark as Ready
                </button>
              )}

              {currentStatus === 'READY' && (
                <button
                  onClick={() => handleUpdateStatus('BILLED')}
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-sm shadow-purple-600/20 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Receipt className="w-3.5 h-3.5" />}
                  Generate Bill
                </button>
              )}

              {currentStatus === 'BILLED' && (
                <button
                  onClick={() => handleUpdateStatus('COMPLETED')}
                  disabled={updating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                  Complete Order
                </button>
              )}

              {['COMPLETED', 'CANCELLED'].includes(currentStatus) && (
                <span className="text-xs text-slate-400 italic">
                  Order is {statusInfo.label.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default OrderDetailsModal;
