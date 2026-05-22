import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@services/common/api';

const OrderCard = ({ order, onStatusUpdate }) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const calculateElapsed = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const now = new Date().getTime();
      setElapsedMinutes(Math.floor((now - createdTime) / 60000));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.patch(`/api/v1/secure/orders/${order.orderId}/status`, { status: newStatus });
      onStatusUpdate(order.orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status', error);
      // Let the parent component handle error toasts if needed
    } finally {
      setIsUpdating(false);
    }
  };

  // Urgency logic
  const isUrgent = elapsedMinutes >= 20 && order.status !== 'READY';
  const isWarning = elapsedMinutes >= 15 && elapsedMinutes < 20 && order.status !== 'READY';

  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  if (isUrgent) {
    borderColor = 'border-red-500 animate-pulse';
    bgColor = 'bg-red-50';
  } else if (isWarning) {
    borderColor = 'border-amber-400';
    bgColor = 'bg-amber-50';
  }

  return (
    <div className={`p-4 rounded-xl border-2 shadow-sm mb-4 transition-all duration-300 ${borderColor} ${bgColor}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Table {order.tableNumber || 'N/A'}
          </h3>
          <p className="text-sm text-gray-500 font-medium">#{order.orderId}</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-bold ${isUrgent ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
          {isUrgent ? <AlertCircle size={16} /> : <Clock size={16} />}
          <span>{elapsedMinutes}m</span>
        </div>
      </div>

      <div className="space-y-2 mb-4 min-h-[100px]">
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-700 border-b border-gray-100 pb-2 last:border-0">
            <div>
              <span className="font-bold mr-2">{item.quantity}x</span>
              <span className="text-lg">{item.foodName}</span>
              {item.specialRequest && (
                <p className="text-sm text-red-500 italic ml-6">Note: {item.specialRequest}</p>
              )}
            </div>
          </div>
        ))}
        {order.specialInstructions && (
          <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800 font-medium border border-yellow-200">
            Order Note: {order.specialInstructions}
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-auto">
        {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
          <button
            disabled={isUpdating}
            onClick={() => handleUpdateStatus('PREPARING')}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            <ChefHat size={20} />
            <span>Start Cooking</span>
          </button>
        )}
        {order.status === 'PREPARING' && (
          <button
            disabled={isUpdating}
            onClick={() => handleUpdateStatus('READY')}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            <CheckCircle size={20} />
            <span>Mark Ready</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
