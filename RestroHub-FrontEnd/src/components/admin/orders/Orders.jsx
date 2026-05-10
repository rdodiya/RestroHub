import { useState } from 'react';
import OrdersHeader from './orderComponents/OrdersHeader';
import OrderFilters from './orderComponents/OrderFilters';
import StatusLegend from './orderComponents/StatusLegend';
import OrdersGrid from './orderComponents/OrdersGrid';

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'ready', label: 'Ready' },
    { id: 'billed', label: 'Billed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <OrdersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Filter Tabs */}
      <OrderFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        orders={[]}  // Will be managed inside OrdersGrid
      />

      {/* Status Legend */}
      <StatusLegend />

      {/* Orders Grid */}
      <OrdersGrid
        activeFilter={activeFilter}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default Orders;