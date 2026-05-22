import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RefreshCw, AlertCircle, Building2 } from 'lucide-react';
import api from '@services/common/api';
import BranchCard from './BranchCard';
import AdminSkeleton from '../../AdminSkeleton';

// ============================================
// MAIN
// ============================================
const BranchesGrid = forwardRef(({ onEdit, onCountChange, restaurantId }, ref) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, [restaurantId]);

  // Expose refresh method to parent via ref
  useImperativeHandle(ref, () => ({
    refreshBranches: fetchBranches,
  }));

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (restaurantId) {
        response = await api.get(`/secure/api/v1/branches/restaurant/${restaurantId}`, {
          params: { page: 0, size: 50, sortBy: 'name', sortDirection: 'asc' }
        });
      } else {
        response = await api.get('/secure/api/v1/branches', {
          params: { page: 0, size: 50, sortBy: 'name', sortDirection: 'asc' }
        });
      }

      const branchList = response.data?.content || response.data || [];
      setBranches(branchList);
      onCountChange?.(branchList.length);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Failed to load branches');
      setBranches([]);
      onCountChange?.(0);
    } finally {
      setLoading(false);
    }
  };

  // Soft delete
  const handleDelete = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;

    try {
      await api.delete(`/secure/api/v1/branches/${branchId}`);
      // Remove from local state
      setBranches((prev) => prev.filter((b) => b.branchId !== branchId));
      onCountChange?.((prev) => prev - 1);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete branch');
    }
  };

  // Restore
  const handleRestore = async (branchId) => {
    try {
      await api.patch(`/secure/api/v1/branches/${branchId}/restore`);
      fetchBranches();
    } catch (err) {
      console.error('Restore failed:', err);
      alert('Failed to restore branch');
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => <AdminSkeleton key={i} variant="branch" />)}
      </div>
    );
  }

  // ERROR
  if (error && branches.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center sm:py-16">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-300 sm:h-16 sm:w-16" />
        <p className="text-sm font-medium text-red-600 sm:text-base">{error}</p>
        <button
          onClick={fetchBranches}
          className="mt-4 inline-flex items-center gap-2 rounded-xl
                     bg-gradient-to-r from-blue-600 to-indigo-600
                     px-4 py-2 text-sm font-medium text-white
                     hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  // EMPTY
  if (branches.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center sm:py-16">
        <Building2 className="mx-auto mb-4 h-12 w-12 text-blue-200 sm:h-16 sm:w-16" />
        <p className="font-medium text-gray-700">No branches yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Add your first branch to get started
        </p>
      </div>
    );
  }

  // GRID
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
      {branches.map((branch) => (
        <BranchCard
          key={branch.branchId}
          branch={branch}
          onEdit={onEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      ))}
    </div>
  );
});

BranchesGrid.displayName = 'BranchesGrid';

export default BranchesGrid;