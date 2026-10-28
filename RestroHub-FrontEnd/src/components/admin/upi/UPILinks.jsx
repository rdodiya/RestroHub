import { useState } from 'react';
import UPIHeader from './UPIHeader';
import UPIGrid from './UPIGrid';
import UPIFormModal from './UPIFormModal';
import UPITestModal from './UPITestModal';
import { useBranch } from '@context/BranchContext';

const UPILinks = () => {
  // 2026-10-28 - Issue: UPI links ignored branch switcher - Reason: Bind to effectiveBranchId from useBranch()
  const { effectiveBranchId: branchId } = useBranch();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [testingLink, setTestingLink] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [totalLinks, setTotalLinks] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLinkAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const openTest = (link) => {
    setTestingLink(link);
    setShowTest(true);
  };

  const closeTest = () => {
    setShowTest(false);
    setTestingLink(null);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <UPIHeader
        onAddLink={() => setIsAddOpen(true)}
        totalLinks={totalLinks}
      />

      <UPIGrid
        branchId={branchId}
        refreshKey={refreshKey}
        onTest={openTest}
        onCountChange={setTotalLinks}
      />

      <UPIFormModal
        isOpen={isAddOpen}
        branchId={branchId}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleLinkAdded}
      />

      <UPITestModal
        isOpen={showTest}
        onClose={closeTest}
        link={testingLink}
      />
    </div>
  );
};

export default UPILinks;