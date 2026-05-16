import { useState } from 'react';
import OrdersHeader from './orderComponents/OrdersHeader';
import OrderFilters from './orderComponents/OrderFilters';
import StatusLegend from './orderComponents/StatusLegend';
import OrdersGrid from './orderComponents/OrdersGrid';

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'ready', label: 'Ready' },
    { id: 'billed', label: 'Billed' },
  ];

  return (
    <div className="space-y-6">
      <OrdersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <OrderFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        orders={orders}
      />
      <StatusLegend />
      <OrdersGrid
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        onOrdersChange={setOrders}
      />
    </div>
  );
};

export default Orders;