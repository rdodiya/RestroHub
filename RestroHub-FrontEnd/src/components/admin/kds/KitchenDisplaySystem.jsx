import React, { useState, useEffect } from 'react';
import api from '@services/common/api';
import KanbanBoard from './KanbanBoard';
import toast from 'react-hot-toast';
import { useBranch } from '@context/BranchContext';
import useOrderStream from '@hooks/useOrderStream';

const KitchenDisplaySystem = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { effectiveBranchId: branchId } = useBranch();

  const fetchActiveOrders = async (silent = false) => {
    if (!branchId) return;
    try {
      if (!silent) setLoading(true);
      const response = await api.get(`/secure/api/v1/orders/branch/${branchId}/active`);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load active orders');
    } finally {
      setLoading(false);
    }
  };

  const { connected: isConnected } = useOrderStream(() => fetchActiveOrders(true));

  useEffect(() => {
    fetchActiveOrders();
  }, [branchId]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-gray-900 p-4 pt-20 lg:pt-4">
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kitchen Display System</h1>
          <div className="flex items-center mt-1">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}
            ></div>
            <span className="text-sm text-gray-500 font-medium">
              {isConnected ? 'Live Sync Active' : 'Polling every 15s'}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchActiveOrders()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <KanbanBoard orders={orders} onStatusUpdate={handleStatusUpdate} />
        )}
      </div>
    </div>
  );
};

export default KitchenDisplaySystem;
