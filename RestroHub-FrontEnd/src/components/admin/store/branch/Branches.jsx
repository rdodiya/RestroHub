import { useState, useRef } from 'react';
import BranchHeader from './BranchHeader';
import BranchesGrid from './BranchesGrid';
import BranchFormModal from './BranchFormModal';

const Branches = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [totalBranches, setTotalBranches] = useState(0);
  const gridRef = useRef(null);

  // TODO: Get this from auth context or restaurant state
  const restaurantId = 1;

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
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <BranchHeader onAddBranch={openAdd} totalBranches={totalBranches} />

      <BranchesGrid
        ref={gridRef}
        onEdit={openEdit}
        onCountChange={setTotalBranches}
        restaurantId={restaurantId}
      />

      <BranchFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingBranch={editingBranch}
        restaurantId={restaurantId}
      />
    </div>
  );
};

export default Branches;