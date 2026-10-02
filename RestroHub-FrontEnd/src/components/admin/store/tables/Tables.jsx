import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@services/common/api';
import { useBranch } from '@context/BranchContext';
import TablesHeader from './TablesHeader';
import TablesStatusLegend from './TablesStatusLegend';
import TablesGrid from './TablesGrid';
import TableFormModal from './TableFormModal';
import TableQRModal from './TableQRModal';

const Tables = () => {
  const { branchId: paramBranchId } = useParams();
  const { selectedBranchId, effectiveBranchId } = useBranch();
  // An explicitly selected branch wins; with "all", honour the URL branch, else the first branch.
  const branchId =
    selectedBranchId !== 'all' ? selectedBranchId : (paramBranchId ?? effectiveBranchId);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [allTables, setAllTables] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [restaurantSlug, setRestaurantSlug] = useState('1');

  useEffect(() => {
    api
      .get('/secure/api/v1/users/fetchRestaurantId')
      .then((res) => {
        const id = res.data?.restaurantId ?? res.data?.data;
        if (id) setRestaurantSlug(String(id));
      })
      .catch((err) => console.warn('Could not fetch restaurant slug:', err));
  }, []);

  const openQR = (table) => {
    setSelectedTable(table);
    setShowQR(true);
  };
  const closeQR = () => {
    setShowQR(false);
    setSelectedTable(null);
  };
  const closeForm = () => {
    setIsAddOpen(false);
    setEditingTable(null);
  };
  const refreshTables = () => setRefreshKey((key) => key + 1);

  return (
    <div className="space-y-5 sm:space-y-6">
      <TablesHeader
        branchId={branchId}
        onAddTable={() => setIsAddOpen(true)}
        onGenerateCounterQR={() => openQR({ id: 0, number: '0' })}
        totalTables={allTables.filter((table) => table.isActive !== false).length}
      />

      <TablesStatusLegend tables={allTables} />

      <TablesGrid
        branchId={branchId}
        onShowQR={openQR}
        onEdit={(table) => {
          setEditingTable(table);
          setIsAddOpen(true);
        }}
        onTablesLoaded={setAllTables}
        refreshKey={refreshKey}
      />

      <TableFormModal
        isOpen={isAddOpen}
        onClose={closeForm}
        onSaved={refreshTables}
        editingTable={editingTable}
        branchId={branchId}
      />

      <TableQRModal
        isOpen={showQR}
        onClose={closeQR}
        table={selectedTable}
        branchId={branchId}
        restaurantSlug={restaurantSlug}
      />
    </div>
  );
};

export default Tables;
