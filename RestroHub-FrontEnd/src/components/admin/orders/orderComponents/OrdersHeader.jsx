import { Search } from 'lucide-react';

const OrdersHeader = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage and track all your orders</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 border border-gray-200 dark:border-gray-700 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/40 transition-all">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by order ID, customer, table, status or item..."
          className="bg-transparent outline-none flex-1 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default OrdersHeader;