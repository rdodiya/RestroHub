import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, CreditCard } from 'lucide-react';
import UPICard from './UPICard';
import AdminSkeleton from '../AdminSkeleton';
import toast from 'react-hot-toast';

// ============================================
// MAIN
// ============================================
const UPIGrid = ({ onTest, onCountChange }) => {
  const [upiLinks, setUpiLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Fallback
  const fallbackLinks = [
    {
      id: 1, name: 'Main Account', upiId: 'restaurant@paytm',
      isDefault: true, transactions: 89, revenue: 45230,
    },
    {
      id: 2, name: 'Backup Account', upiId: 'restaurant@upi',
      isDefault: false, transactions: 12, revenue: 5670,
    },
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      // 🔌 const response = await api.get('/api/upi-links');
      // setUpiLinks(response.data);
      await new Promise((r) => setTimeout(r, 600));
      setUpiLinks(fallbackLinks);
      onCountChange?.(fallbackLinks.length);
    } catch (err) {
      console.error('Fetch failed:', err);
      toast.error('Fetch failed');
      setError('Failed to load UPI links');
      setUpiLinks(fallbackLinks);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // HANDLERS
  // ------------------------------------
  const handleCopy = (upiId, id) => {
    navigator.clipboard.writeText(upiId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSetDefault = (id) => {
    setUpiLinks((prev) =>
      prev.map((link) => ({ ...link, isDefault: link.id === id }))
    );
  };

  const handleDelete = (id) => {
    setUpiLinks((prev) => prev.filter((link) => link.id !== id));
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------

  // Loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <AdminSkeleton key={i} variant="upi" />
        ))}
      </div>
    );
  }

  // Error
  if (error && upiLinks.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center sm:py-16">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-300 sm:h-16 sm:w-16" />
        <p className="text-sm font-medium text-red-600 sm:text-base">{error}</p>
        <button
          onClick={fetchLinks}
          className="
            mt-4 inline-flex items-center gap-2 rounded-lg
            bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700
            hover:bg-blue-100 transition-colors
          "
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  // Empty
  if (upiLinks.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center sm:py-16">
        <CreditCard className="mx-auto mb-4 h-12 w-12 text-blue-200 sm:h-16 sm:w-16" />
        <p className="font-medium text-gray-700">No UPI links yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Add your first UPI link to accept payments
        </p>
      </div>
    );
  }

  // Grid
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      {upiLinks.map((link) => (
        <UPICard
          key={link.id}
          link={link}
          copiedId={copiedId}
          onCopy={handleCopy}
          onSetDefault={handleSetDefault}
          onDelete={handleDelete}
          onTest={onTest}
        />
      ))}
    </div>
  );
};

export default UPIGrid;