import React from 'react';
import OrderCard from './OrderCard';

const KanbanBoard = ({ orders, onStatusUpdate }) => {
  // Group orders by status
  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
      {/* Pending Column */}
      <div className="flex flex-col h-full bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-300">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-wider">Pending</h2>
          <span className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full font-bold text-sm">
            {pendingOrders.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20 custom-scrollbar">
          {pendingOrders.map(order => (
            <OrderCard key={order.orderId} order={order} onStatusUpdate={onStatusUpdate} />
          ))}
          {pendingOrders.length === 0 && (
            <div className="h-32 flex items-center justify-center text-gray-400 font-medium">
              No pending orders
            </div>
          )}
        </div>
      </div>

      {/* Preparing Column */}
      <div className="flex flex-col h-full bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-blue-300">
          <h2 className="text-xl font-black text-blue-800 uppercase tracking-wider">Preparing</h2>
          <span className="bg-blue-200 text-blue-900 py-1 px-3 rounded-full font-bold text-sm">
            {preparingOrders.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20 custom-scrollbar">
          {preparingOrders.map(order => (
            <OrderCard key={order.orderId} order={order} onStatusUpdate={onStatusUpdate} />
          ))}
          {preparingOrders.length === 0 && (
            <div className="h-32 flex items-center justify-center text-blue-300 font-medium">
              No orders preparing
            </div>
          )}
        </div>
      </div>

      {/* Ready Column */}
      <div className="flex flex-col h-full bg-green-50 rounded-xl p-4 border border-green-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-green-300">
          <h2 className="text-xl font-black text-green-800 uppercase tracking-wider">Ready</h2>
          <span className="bg-green-200 text-green-900 py-1 px-3 rounded-full font-bold text-sm">
            {readyOrders.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20 custom-scrollbar">
          {readyOrders.map(order => (
            <OrderCard key={order.orderId} order={order} onStatusUpdate={onStatusUpdate} />
          ))}
          {readyOrders.length === 0 && (
            <div className="h-32 flex items-center justify-center text-green-300 font-medium">
              No orders ready
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;
