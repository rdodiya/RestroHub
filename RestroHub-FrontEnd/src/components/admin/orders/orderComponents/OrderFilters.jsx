const OrderFilters = ({ filters, activeFilter, onFilterChange, orders }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => {
        const count =
          filter.id === 'all'
            ? orders.length
            : orders.filter((o) => o.status === filter.id).length;

        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className={isActive ? 'text-blue-700' : 'text-gray-700'}>
              {filter.label}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OrderFilters;