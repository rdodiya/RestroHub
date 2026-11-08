// 2026-11-08 - Table status legend - Show status counts and total active booked time ranges
const TablesStatusLegend = ({ tables = [] }) => {
  const activeTables = tables.filter((table) => table.isActive !== false);
  const counts = {
    available: activeTables.filter((t) => t.status === 'available').length,
    occupied: activeTables.filter((t) => t.status === 'occupied').length,
    reserved: activeTables.filter((t) => t.status === 'reserved').length,
  };
  const totalBookedSlots = activeTables.reduce(
    (acc, t) => acc + (t.bookedSlots ? t.bookedSlots.length : 0),
    0
  );

  const statuses = [
    { key: 'available', label: 'Available', dotColor: 'bg-green-500', count: counts.available },
    { key: 'occupied', label: 'Occupied', dotColor: 'bg-red-500', count: counts.occupied },
    { key: 'reserved', label: 'Reserved', dotColor: 'bg-yellow-500', count: counts.reserved },
  ];

  return (
    <div
      className="
        flex flex-wrap items-center gap-3 rounded-xl
        border border-gray-200 bg-white px-4 py-3
        sm:gap-5 sm:px-5
      "
    >
      <span className="text-sm font-medium text-gray-500">Status:</span>
      {statuses.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.dotColor}`} />
          <span className="text-sm text-gray-700">{s.label}</span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
            {s.count}
          </span>
        </div>
      ))}

      {totalBookedSlots > 0 && (
        <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3">
          <span className="text-sm font-medium text-amber-700">Active Bookings:</span>
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
            {totalBookedSlots}
          </span>
        </div>
      )}
    </div>
  );
};

export default TablesStatusLegend;
