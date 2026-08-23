import { useState } from 'react';
import { Copy, EyeOff, RefreshCw, Download, Loader2 } from 'lucide-react';
import api from "@services/common/api";
import toast from 'react-hot-toast';

const BulkActions = ({ onRefresh }) => {
  const [loadingAction, setLoadingAction] = useState(null);

  // ------------------------------------
  // ACTION HANDLERS
  // ------------------------------------
  const handleCopyYesterday = async () => {
    try {
      setLoadingAction('copy');

      // 🔌 UNCOMMENT WHEN API READY
      // await api.post('/api/menu/copy-yesterday');
      // toast.success('Yesterday\'s menu copied!');

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Copy yesterday menu');
      onRefresh?.();
    } catch (err) {
      console.error('Failed to copy menu:', err);
      toast.error('Failed to copy menu');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleHideSoldOut = async () => {
    try {
      setLoadingAction('hide');

      // 🔌 UNCOMMENT WHEN API READY
      // await api.put('/api/menu/hide-sold-out');

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Hide sold out items');
      onRefresh?.();
    } catch (err) {
      console.error('Failed to hide items:', err);
      toast.error('Failed to hide items');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportMenu = async () => {
    try {
      setLoadingAction('export');

      // 🔌 UNCOMMENT WHEN API READY
      // const response = await api.get('/api/menu/export', { responseType: 'blob' });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'menu.pdf';
      // link.click();

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Export menu');
    } catch (err) {
      console.error('Failed to export:', err);
      toast.error('Failed to export');
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------------------------
  // ACTIONS CONFIG
  // ------------------------------------
  const actions = [
    {
      id: 'copy',
      label: "Copy Yesterday's Menu",
      icon: Copy,
      onClick: handleCopyYesterday,
    },
    {
      id: 'hide',
      label: 'Hide Sold Out',
      icon: EyeOff,
      onClick: handleHideSoldOut,
    },
    {
      id: 'export',
      label: 'Export Menu',
      icon: Download,
      onClick: handleExportMenu,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        const isLoading = loadingAction === action.id;

        return (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-sm transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

export default BulkActions;