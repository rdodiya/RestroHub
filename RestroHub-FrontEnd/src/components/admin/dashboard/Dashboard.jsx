import StatsSection from './cards/StatsSection';
import QuickActions from './cards/QuickActions';
import LiveOrders from './cards/LiveOrders';
import RevenueChart from './cards/RevenueChart';
import { useAdminTheme } from '@context/AdminThemeContext';

const Dashboard = () => {
  const { isDark } = useAdminTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Dashboard</h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <StatsSection />

      {/* Quick Actions */}
      <QuickActions />

      {/* Revenue Analytics */}
      <RevenueChart />

      {/* Live Orders Feed */}
      <LiveOrders />
    </div>
  );
};

export default Dashboard;