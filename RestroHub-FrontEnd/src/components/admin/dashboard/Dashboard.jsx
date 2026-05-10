import StatsSection from './cards/StatsSection';
import QuickActions from './cards/QuickActions';
import LiveOrders from './cards/LiveOrders';
import RevenueChart from './cards/RevenueChart';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <StatsSection />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LiveOrders />
        <RevenueChart />
      </div>
    </div>
  );
};

export default Dashboard;