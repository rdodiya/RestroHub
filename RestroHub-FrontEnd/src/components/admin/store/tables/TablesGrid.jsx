import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, LayoutGrid } from 'lucide-react';
import api from '@services/common/api';
import TableCard from './TableCard';
import AdminSkeleton from '../../AdminSkeleton';
import { normalizeTable } from './tableMapper';

const TablesGrid = ({ branchId, onShowQR, onEdit, onTablesLoaded, refreshKey }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, [branchId, refreshKey]);

  const fetchTables = async () => {
    if (!branchId) {
      setTables([]);
      onTablesLoaded?.([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/secure/api/v1/branches/${branchId}/tables`);
      const tableList = (response.data || []).map(normalizeTable);
      setTables(tableList);
      onTablesLoaded?.(tableList);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Failed to load tables');
      setTables([]);
      onTablesLoaded?.([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTableState = (updatedTable) => {
    setTables((prev) => {
      const next = prev.map((table) => (
        table.id === updatedTable.id ? updatedTable : table
      ));
      onTablesLoaded?.(next);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <AdminSkeleton key={i} variant="table" />)}
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
            onEdit={onEdit}
            onDelete={updateTableState}
            onRestore={updateTableState}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-gray-500 sm:text-sm">
        {tables.filter((t) => t.isActive).length} active tables -{' '}
        {tables.filter((t) => t.isActive && t.status === 'available').length} available
      </p>
    </div>
  );
};

export default TablesGrid;
