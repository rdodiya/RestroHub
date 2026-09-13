import React from 'react';
import { Utensils, ShoppingBag } from 'lucide-react';
import { useCustomerOrder } from '@context/CustomerOrderContext.jsx';

const TableBanner = () => {
  const { tableInfo, totalItemsCount, setIsCartOpen } = useCustomerOrder();

  if (!tableInfo?.tableId) return null;

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-full">
          <Utensils className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold opacity-90 block leading-tight">
            Dine-in Service
          </span>
          <span className="font-bold text-sm leading-tight">
            Table #{tableInfo.tableNumber}
          </span>
        </div>
      </div>

      {totalItemsCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-1.5 bg-white text-orange-700 px-3 py-1 rounded-full text-xs font-bold shadow hover:bg-orange-50 transition"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{totalItemsCount} item{totalItemsCount > 1 ? 's' : ''} in cart</span>
        </button>
      )}
    </div>
  );
};

export default TableBanner;
