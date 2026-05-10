import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, LayoutGrid } from 'lucide-react';
import TableCard from './TableCard';

// Skeleton
const TableSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white animate-pulse">
    <div className="px-4 py-5 text-center">
      <div className="mx-auto mb-2 h-14 w-14 rounded-xl bg-gray-100" />
      <div className="mx-auto mb-1 h-4 w-14 rounded bg-gray-100" />
      <div className="mx-auto mb-2 h-3 w-12 rounded bg-gray-100" />
      <div className="mx-auto h-5 w-16 rounded-full bg-gray-100" />
    </div>
    <div className="flex justify-center gap-2 border-t border-gray-100 px-3 py-3">
      <div className="h-8 w-8 rounded-lg bg-gray-100" />
      <div className="h-8 w-8 rounded-lg bg-gray-100" />
      <div className="h-8 w-8 rounded-lg bg-gray-100" />
    </div>
  </div>
);

const TablesGrid = ({ branchId, onShowQR, onTablesLoaded }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackTables = [
    { id: 1, number: 1, capacity: 4, status: 'available' },
    { id: 2, number: 2, capacity: 2, status: 'occupied' },
    { id: 3, number: 3, capacity: 6, status: 'available' },
    { id: 4, number: 4, capacity: 4, status: 'occupied' },
    { id: 5, number: 5, capacity: 8, status: 'reserved' },
    { id: 6, number: 6, capacity: 4, status: 'available' },
    { id: 7, number: 7, capacity: 2, status: 'available' },
    { id: 8, number: 8, capacity: 4, status: 'occupied' },
  ];

  useEffect(() => {
    fetchTables();
  }, [branchId]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      // 🔌 const response = await api.get(`/api/branches/${branchId}/tables`);
      await new Promise((r) => setTimeout(r, 500));
      setTables(fallbackTables);
      onTablesLoaded?.(fallbackTables);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Failed to load tables');
      setTables(fallbackTables);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <TableSkeleton key={i} />)}
      </div>
    );
  }

  if (error && tables.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-300" />
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button
          onClick={fetchTables}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
        <LayoutGrid className="mx-auto mb-4 h-12 w-12 text-blue-200" />
        <p className="font-medium text-gray-700">No tables yet</p>
        <p className="mt-1 text-sm text-gray-500">Add your first table</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onShowQR={onShowQR}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-gray-500 sm:text-sm">
        {tables.length} tables •{' '}
        {tables.filter((t) => t.status === 'available').length} available
      </p>
    </div>
  );
};

export default TablesGrid;