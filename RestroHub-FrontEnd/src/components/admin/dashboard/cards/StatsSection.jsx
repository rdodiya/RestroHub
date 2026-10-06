import { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingCart,
  Clock,
  Armchair,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import api from '@services/common/api';
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';
import toast from 'react-hot-toast';
import { useBranch } from '@context/BranchContext';

// ============================================
// STAT CARD (Private to this file)
// ============================================
const StatCard = ({
  title,
  value,
  change,
  positive,
  subtitle,
  icon: Icon,
  color,
  pulse,
  progress,
}) => {
  const { isDark } = useAdminTheme();

  const colorClasses = {
    green: isDark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600',
    orange: isDark ? 'bg-orange-900/40 text-orange-400' : 'bg-orange-100 text-orange-600',
    emerald: isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
    purple: isDark ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-100 text-purple-600',
    blue: isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600',
    red: isDark ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600',
  };

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>

        {change && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}
          >
            {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </span>
        )}

        {pulse && <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />}
      </div>

      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>

      <p className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        {value}
        {subtitle && (
          <span
            className={`text-sm font-normal ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {subtitle}
          </span>
        )}
      </p>

      {progress !== undefined && (
        <div
          className={`mt-2 h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// ============================================
// SKELETON LOADER (Private to this file)
// ============================================
const StatCardSkeleton = () => {
  const { isDark } = useAdminTheme();
  return (
    <div
      className={`rounded-2xl p-6 shadow-sm border animate-pulse ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`w-16 h-5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
      <div className={`w-24 h-4 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      <div className={`w-32 h-7 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
    </div>
  );
};

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const money = (v) => `₹${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

// key = field in GET /secure/api/v1/dashboard/stats; fields the API omits (financials for
// Manager/Staff) are not rendered.
const CARDS = [
  { key: 'todaysOrders', title: "Today's Orders", icon: ShoppingCart, color: 'orange' },
  {
    key: 'grossOrderValue',
    title: 'Gross Order Value',
    icon: IndianRupee,
    color: 'green',
    fmt: money,
  },
  {
    key: 'averageOrderValue',
    title: 'Average Order Value',
    icon: IndianRupee,
    color: 'blue',
    fmt: money,
  },
  { key: 'pendingOrders', title: 'Pending', icon: Clock, color: 'red', pulse: true },
  { key: 'activeTables', title: 'Active Tables', icon: Armchair, color: 'purple' },
  { key: 'unpaidCount', title: 'Unpaid Orders', icon: CreditCard, color: 'orange' },
  {
    key: 'verifiedCollectedAmount',
    title: 'Verified Collected',
    icon: Wallet,
    color: 'emerald',
    fmt: money,
  },
];

const StatsSection = () => {
  const { effectiveBranchId } = useBranch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    const handle = () => fetchStats();
    window.addEventListener('restrohub:order-updated', handle);
    const interval = setInterval(handle, 30000);
    return () => {
      window.removeEventListener('restrohub:order-updated', handle);
      clearInterval(interval);
    };
  }, [effectiveBranchId]);

  const fetchStats = async () => {
    if (!effectiveBranchId) return;
    try {
      setError(null);
      const response = await api.get('/secure/api/v1/dashboard/stats', {
        params: { branchId: effectiveBranchId },
      });
      setStats(response.data || {});
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      toast.error('Failed to fetch stats');
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <AdminSkeleton key={i} variant="stats" />
        ))}
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <button onClick={fetchStats} className="text-sm text-red-700 underline hover:no-underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.filter((c) => stats?.[c.key] != null).map(({ key, fmt, ...card }) => (
        <StatCard key={key} {...card} value={fmt ? fmt(stats[key]) : stats[key]} />
      ))}
    </div>
  );
};

export default StatsSection;
