const TablesStatusLegend = ({ tables = [] }) => {
  const counts = {
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
  };

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
    </div>
  );
};

export default TablesStatusLegend;