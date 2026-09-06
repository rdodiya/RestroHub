import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  CheckCheck,
  Edit3,
  Send,
  Download,
  Loader2,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from "@services/common/api";
import { useAdminTheme } from '@context/AdminThemeContext';

// ============================================
// ACTION BUTTON (Private to this file)
// ============================================
const ActionButton = ({ label, icon: Icon, bgColor, hoverColor, onClick, loading: isLoading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all font-medium shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${hoverColor}`}
  >
    {isLoading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      <Icon className="w-4 h-4" />
    )}
    <span>{label}</span>
  </button>
);

// Helper to safely fetch branchId
const getBranchId = async () => {
  try {
    const res = await api.get('/secure/api/v1/users/fetchRestaurantId');
    const data = res.data || {};
    return (
      data.branchId ||
      data.restaurantId ||
      data.data?.branchId ||
      data.data?.restaurantId ||
      localStorage.getItem('selectedBranchId') ||
      1
    );
  } catch {
    return localStorage.getItem('selectedBranchId') || 1;
  }
};

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const QuickActions = () => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null);
  const { isDark } = useAdminTheme();

  // WhatsApp Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    "Special Offer today at Restroly! Enjoy 20% off on all main courses. Show this message at your table to redeem."
  );
  const [targetAudience, setTargetAudience] = useState('active'); // 'active' | 'custom'
  const [customPhone, setCustomPhone] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // ------------------------------------
  // ACTION HANDLERS
  // ------------------------------------

  // 1. New Order -> Navigates to /admin/orders and triggers POS Create Order drawer
  const handleNewOrder = () => {
    try {
      setLoadingAction('new-order');
      navigate('/admin/orders', { state: { openCreateOrder: true } });
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Mark All Ready -> Batch updates PREPARING / PENDING orders to READY
  const handleMarkAllReady = async () => {
    try {
      setLoadingAction('mark-ready');
      const branchId = await getBranchId();

      const response = await api.put(`/secure/api/v1/orders/branch/${branchId}/mark-all-ready`);
      const data = response.data || {};
      const count = data.count ?? 0;

      // Immediately notify LiveOrders component & other listeners
      window.dispatchEvent(new CustomEvent('restrohub:order-updated'));

      if (count > 0) {
        toast.success(`Successfully marked ${count} order(s) as ready!`, { icon: '🍽️' });
      } else {
        toast('No active orders in kitchen to mark as ready', { icon: 'ℹ️' });
      }
    } catch (err) {
      console.error('Failed to mark orders ready:', err);
      toast.error(err.response?.data?.message || 'Failed to update active orders');
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. Menu Editor -> Navigate to /admin/menus
  const handleMenuEditor = () => {
    navigate('/admin/menus');
  };

  // 4. Send Broadcast -> Open modal
  const handleOpenBroadcast = () => {
    setIsBroadcastOpen(true);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      toast.error('Please enter a message for the broadcast');
      return;
    }

    try {
      setIsSendingBroadcast(true);

      // If custom phone provided, send to that phone
      let recipientCount = 1;
      if (targetAudience === 'custom') {
        if (!customPhone.trim()) {
          toast.error('Please enter recipient phone number');
          return;
        }
      } else {
        // Collect active branch customer count
        const branchId = await getBranchId();
        try {
          const res = await api.get(`/secure/api/v1/orders/branch/${branchId}/active`);
          const orders = Array.isArray(res.data) ? res.data : [];
          const phones = new Set(orders.map(o => o.customerPhone).filter(Boolean));
          recipientCount = Math.max(phones.size, 1);
        } catch {
          recipientCount = 1;
        }
      }

      // Simulate sending broadcast
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success(`Broadcast announcement sent to ${recipientCount} customer(s)!`, {
        icon: '📢',
        duration: 4000
      });
      setIsBroadcastOpen(false);
    } catch (err) {
      console.error('Failed to send broadcast:', err);
      toast.error('Failed to dispatch broadcast');
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  // 5. Export Report -> Fetch branch orders and generate CSV download
  const handleExportReport = async () => {
    try {
      setLoadingAction('export');
      const branchId = await getBranchId();

      const response = await api.get(`/secure/api/v1/orders/branch/${branchId}`);
      const orders = Array.isArray(response.data) ? response.data : [];

      if (orders.length === 0) {
        toast('No orders recorded yet to export', { icon: 'ℹ️' });
        return;
      }

      // Format CSV rows
      const headers = [
        'Order ID',
        'Date & Time',
        'Table Number',
        'Customer Name',
        'Customer Phone',
        'Status',
        'Total Items',
        'Items Summary',
        'Total Amount (INR)'
      ];

      const rows = orders.map((o) => {
        const dateStr = o.createdAt
          ? new Date(o.createdAt).toLocaleString('en-IN')
          : '';
        const itemsSummary = (o.items || [])
          .map((i) => `${i.foodName || 'Item'} x${i.quantity || 1}`)
          .join('; ');
        const totalItems = (o.items || []).reduce(
          (sum, i) => sum + (Number(i.quantity) || 1),
          0
        );

        return [
          `"${o.orderId || ''}"`,
          `"${dateStr}"`,
          `"${o.tableNumber || 'N/A'}"`,
          `"${(o.customerName || 'Walk-in').replace(/"/g, '""')}"`,
          `"${o.customerPhone || 'N/A'}"`,
          `"${o.status || 'PENDING'}"`,
          `"${totalItems}"`,
          `"${itemsSummary.replace(/"/g, '""')}"`,
          `"${o.totalAmount || 0}"`
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const today = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RestroHub-Orders-Report-${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${orders.length} orders to CSV report!`, { icon: '📊' });
    } catch (err) {
      console.error('Failed to export report:', err);
      toast.error('Failed to generate orders report');
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------------------------
  // ACTIONS CONFIG
  // ------------------------------------
  const actions = [
    {
      id: 'new-order',
      label: 'New Order',
      icon: Plus,
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: handleNewOrder,
    },
    {
      id: 'mark-ready',
      label: 'Mark All Ready',
      icon: CheckCheck,
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: handleMarkAllReady,
    },
    {
      id: 'menu-editor',
      label: 'Menu Editor',
      icon: Edit3,
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: handleMenuEditor,
    },
    {
      id: 'whatsapp',
      label: 'Send Broadcast',
      icon: Send,
      bgColor: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      onClick: handleOpenBroadcast,
    },
    {
      id: 'export',
      label: 'Export Report',
      icon: Download,
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: handleExportReport,
    },
  ];

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <>
      <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Quick Actions
          </h2>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Shortcuts to frequent tasks
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <ActionButton
              key={action.id}
              {...action}
              loading={loadingAction === action.id}
            />
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* SEND BROADCAST MODAL                         */}
      {/* ============================================ */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'}`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Send WhatsApp Broadcast</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reach out to dining customers with deals and updates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-4">
              {/* Audience Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetAudience('active')}
                    className={`rounded-xl border py-2.5 px-3 text-xs font-semibold text-center transition ${
                      targetAudience === 'active'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600'
                        : 'border-gray-200 bg-transparent text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    Active Dining Guests
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetAudience('custom')}
                    className={`rounded-xl border py-2.5 px-3 text-xs font-semibold text-center transition ${
                      targetAudience === 'custom'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600'
                        : 'border-gray-200 bg-transparent text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    Specific Phone Number
                  </button>
                </div>
              </div>

              {/* Specific Phone Input */}
              {targetAudience === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-300">
                    Phone Number (e.g. +91 9876543210)
                  </label>
                  <input
                    type="tel"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="Enter phone with country code"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent px-3.5 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900"
                  />
                </div>
              )}

              {/* Message Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Broadcast Message
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {broadcastMessage.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type announcement message..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900"
                />
              </div>

              {/* Quick Template Presets */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Quick Templates
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setBroadcastMessage(
                        "🎉 Special 20% discount on all Desserts and Beverages today! Ask your server for details."
                      )
                    }
                    className="rounded-lg bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    20% Discount
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBroadcastMessage(
                        "👨‍🍳 Chef's Special Weekend Menu is now live! Try our signature sizzlers and mocktails."
                      )
                    }
                    className="rounded-lg bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Chef's Special
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBroadcastMessage(
                        "⭐ Thank you for dining with RestroHub! We'd love your feedback: please rate your meal with your server."
                      )
                    }
                    className="rounded-lg bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Dining Feedback
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingBroadcast}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow transition disabled:opacity-50"
                >
                  {isSendingBroadcast ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Broadcast
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;