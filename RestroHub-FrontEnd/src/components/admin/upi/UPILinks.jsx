import { useState } from 'react';
import UPIHeader from './UPIHeader';
import UPIGrid from './UPIGrid';
import UPIFormModal from './UPIFormModal';
import UPITestModal from './UPITestModal';

const UPILinks = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [testingLink, setTestingLink] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [totalLinks, setTotalLinks] = useState(0);

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
        onTest={openTest}
        onCountChange={setTotalLinks}
      />

      <UPIFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
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