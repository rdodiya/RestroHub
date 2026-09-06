import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle, CreditCard } from 'lucide-react';
import UPICard from './UPICard';
import AdminSkeleton from '../AdminSkeleton';
import api from '@services/common/api';

// Helper to safely extract list from response
const extractList = (resData) => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.content)) return resData.content;
  return [];
};

// ============================================
// MAIN COMPONENT
// ============================================
const UPIGrid = ({ branchId, refreshKey, onTest, onCountChange }) => {
  const [upiLinks, setUpiLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchLinks = useCallback(async () => {
    if (!branchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/secure/api/v1/upi-links/branch/${branchId}`);
      const list = extractList(response.data);
      setUpiLinks(list);
      onCountChange?.(list.length);
    } catch (err) {
      console.error('Failed to fetch UPI links:', err.response?.data || err);
      setError('Failed to load UPI links from server');
      setUpiLinks([]);
      onCountChange?.(0);
    } finally {
      setLoading(false);
    }
  }, [branchId, onCountChange]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks, refreshKey]);

  // ------------------------------------
  // HANDLERS
  // ------------------------------------
  const handleCopy = (upiId, id) => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await api.put(`/secure/api/v1/upi-links/${id}/default`, null, {
        params: { branchId }
      });
      const updated = res.data?.data || res.data;
      setUpiLinks((prev) =>
        prev.map((link) => ({
          ...link,
          isDefault: link.id === id
        }))
      );
      return updated;
    } catch (err) {
      console.error('Failed to set default UPI link:', err.response?.data || err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/secure/api/v1/upi-links/${id}`);
      setUpiLinks((prev) => {
        const next = prev.filter((link) => link.id !== id);
        onCountChange?.(next.length);
        return next;
      });
    } catch (err) {
      console.error('Failed to delete UPI link:', err.response?.data || err);
      throw err;
    }
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <AdminSkeleton key={i} variant="upi" />
        ))}
      </div>
    );
  }

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

  if (upiLinks.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center sm:py-16">
        <CreditCard className="mx-auto mb-4 h-12 w-12 text-blue-200 sm:h-16 sm:w-16" />
        <p className="font-medium text-gray-700">No UPI links yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Add your primary UPI handle (GPay, PhonePe, Paytm, BHIM) to receive direct customer payments.
        </p>
      </div>
    );
  }

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