import { useState } from 'react';
import {
  Plus,
  CheckCheck,
  Edit3,
  Send,
  Download,
  Loader2
} from 'lucide-react';
import api from "@services/common/api";
import { useAdminTheme } from '@context/AdminThemeContext';
import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';  // if using react-router

// ============================================
// ACTION BUTTON (Private to this file)
// ============================================
const ActionButton = ({ label, icon: Icon, bgColor, hoverColor, onClick, loading: isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${hoverColor}`}
  >
    {isLoading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      <Icon className="w-4 h-4" />
    )}
    {label}
  </button>
);

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const QuickActions = () => {
  const [loadingAction, setLoadingAction] = useState(null);
  const { isDark } = useAdminTheme();

  // ------------------------------------
  // ACTION HANDLERS
  // ------------------------------------
  const handleNewOrder = async () => {
    try {
      setLoadingAction('new-order');

      // 🔌 UNCOMMENT WHEN READY
      // navigate('/admin/orders/new');
      // OR
      // await api.post('/api/orders', { status: 'draft' });

      console.log('Navigate to new order page');
    } catch (err) {
      console.error('Failed to create order:', err);
      toast.error('Failed to create order');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMarkAllReady = async () => {
    try {
      setLoadingAction('mark-ready');

      // 🔌 UNCOMMENT WHEN READY
      // await api.put('/api/orders/mark-all-ready');
      // toast.success('All orders marked as ready!');

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('All orders marked ready');
    } catch (err) {
      console.error('Failed to mark orders:', err);
      toast.error('Failed to mark orders');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMenuEditor = () => {
    // 🔌 UNCOMMENT WHEN READY
    // navigate('/admin/menu');

    console.log('Navigate to menu editor');
  };

  const handleSendWhatsApp = async () => {
    try {
      setLoadingAction('whatsapp');

      // 🔌 UNCOMMENT WHEN READY
      // await api.post('/api/whatsapp/broadcast');

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('WhatsApp broadcast sent');
    } catch (err) {
      console.error('Failed to send broadcast:', err);
      toast.error('Failed to send broadcast');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportReport = async () => {
    try {
      setLoadingAction('export');

      // 🔌 UNCOMMENT WHEN READY
      // const response = await api.get('/api/reports/daily', { responseType: 'blob' });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `report-${new Date().toISOString().split('T')[0]}.pdf`;
      // link.click();

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Report exported');
    } catch (err) {
      console.error('Failed to export report:', err);
      toast.error('Failed to export report');
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
      onClick: handleSendWhatsApp,
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
    <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Quick Actions</h2>
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
  );
};

export default QuickActions;