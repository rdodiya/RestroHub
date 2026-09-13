import { useState, useEffect } from 'react';
import UPIHeader from './UPIHeader';
import UPIGrid from './UPIGrid';
import UPIFormModal from './UPIFormModal';
import UPITestModal from './UPITestModal';
import api from '@services/common/api';

const UPILinks = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [testingLink, setTestingLink] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [totalLinks, setTotalLinks] = useState(0);
  const [branchId, setBranchId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchBranchId();
  }, []);

  const fetchBranchId = async () => {
    try {
      const res = await api.get('/secure/api/v1/users/fetchRestaurantId');
      const data = res.data || {};
      const id = data.branchId || data.restaurantId || data.data?.branchId || null;
      setBranchId(id);
    } catch (err) {
      console.error('Failed to fetch branch ID:', err);
    }
  };

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