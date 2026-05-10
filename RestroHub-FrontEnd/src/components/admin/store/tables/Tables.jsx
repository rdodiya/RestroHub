import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TablesHeader from './TablesHeader';
import TablesStatusLegend from './TablesStatusLegend';
import TablesGrid from './TablesGrid';
import TableFormModal from './TableFormModal';
import TableQRModal from './TableQRModal';

const Tables = () => {
  const { branchId } = useParams();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [allTables, setAllTables] = useState([]);

  const openQR = (table) => { setSelectedTable(table); setShowQR(true); };
  const closeQR = () => { setShowQR(false); setSelectedTable(null); };

  return (
    <div className="space-y-5 sm:space-y-6">
      <TablesHeader
        branchId={branchId}
        onAddTable={() => setIsAddOpen(true)}
        totalTables={allTables.length}
      />

      <TablesStatusLegend tables={allTables} />

      <TablesGrid
        branchId={branchId}
        onShowQR={openQR}
        onTablesLoaded={setAllTables}
      />

      <TableFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        branchId={branchId}
      />

      <TableQRModal
        isOpen={showQR}
        onClose={closeQR}
        table={selectedTable}
        branchId={branchId}
      />
    </div>
  );
};

export default Tables;