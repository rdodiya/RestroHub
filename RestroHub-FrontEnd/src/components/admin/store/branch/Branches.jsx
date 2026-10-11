import { useState, useRef, useEffect } from 'react';
import BranchHeader from './BranchHeader';
import BranchesGrid from './BranchesGrid';
import BranchFormModal from './BranchFormModal';
import api from '@services/common/api';
import { useBranch } from '@context/BranchContext';

const Branches = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [totalBranches, setTotalBranches] = useState(0);
  const [restaurantId, setRestaurantId] = useState(null);
  const gridRef = useRef(null);
  const { refreshBranches } = useBranch();

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const res = await api.get('/secure/api/v1/users/fetchRestaurantId');
        const data = res.data || {};
        const fetchedRestaurantId = data.restaurantId || data.data?.restaurantId || null;
        setRestaurantId(fetchedRestaurantId);
      } catch (err) {
        console.error('Failed to fetch restaurantId:', err);
        setRestaurantId(null);
      }
    };
    fetchRestaurantId();
  }, []);

  const openAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    // Refresh grid after create/update
    gridRef.current?.refreshBranches();
    // Keep the shared branch list (BranchGate, branch selector) in sync.
    refreshBranches();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <BranchHeader onAddBranch={openAdd} totalBranches={totalBranches} />

      {restaurantId && (
        <BranchesGrid
          ref={gridRef}
          onEdit={openEdit}
          onCountChange={setTotalBranches}
          restaurantId={restaurantId}
        />
      )}

      {restaurantId && (
        <BranchFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          editingBranch={editingBranch}
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
};

export default Branches;
