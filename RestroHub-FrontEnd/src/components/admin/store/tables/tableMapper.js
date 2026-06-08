export const normalizeTable = (table) => ({
  id: table.tableId,
  tableId: table.tableId,
  branchId: table.branchId,
  number: table.tableNumber,
  tableNumber: table.tableNumber,
  capacity: table.capacity || 4,
  status: table.status || 'available',
  qrCodeUrl: table.qrCodeUrl,
  isActive: table.isActive !== false,
});
