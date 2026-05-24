import { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';

// ============================================
// STAT CARD (Private to this file)
// ============================================
const StatCard = ({ title, value, change, positive, subtitle, icon: Icon, color, pulse, progress }) => {
  const { isDark } = useAdminTheme();

  const colorClasses = {
    green:   isDark ? 'bg-green-900/40 text-green-400'   : 'bg-green-100 text-green-600',
    orange:  isDark ? 'bg-orange-900/40 text-orange-400'  : 'bg-orange-100 text-orange-600',
    emerald: isDark ? 'bg-emerald-900/40 text-emerald-400': 'bg-emerald-100 text-emerald-600',
    purple:  isDark ? 'bg-purple-900/40 text-purple-400'  : 'bg-purple-100 text-purple-600',
    blue:    isDark ? 'bg-blue-900/40 text-blue-400'     : 'bg-blue-100 text-blue-600',
    red:     isDark ? 'bg-red-900/40 text-red-400'       : 'bg-red-100 text-red-600',
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>

        {change && (
          <span className={`flex items-center gap-1 text-sm font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </span>
        )}

        {pulse && (
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
        )}
      </div>

      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>

      <p className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        {value}
        {subtitle && (
          <span className={`text-sm font-normal ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</span>
        )}
      </p>

      {progress !== undefined && (
        <div className={`mt-2 h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
    <div className={`rounded-2xl p-6 shadow-sm border animate-pulse ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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
const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------------------------
  // FALLBACK DATA (used when API fails)
  // ------------------------------------
  const fallbackStats = [
    {
      title: "Today's Revenue",
      value: '₹45,230',
      change: '+24%',
      positive: true,
      icon: IndianRupee,
      color: 'green',
    },
    {
      title: 'Live Orders',
      value: '12',
      subtitle: 'active',
      icon: ShoppingCart,
      color: 'orange',
      pulse: true,
    },
    {
      title: 'WhatsApp Messages',
      value: '156/1000',
      progress: 15.6,
      icon: MessageSquare,
      color: 'emerald',
    },
    {
      title: 'UPI Success',
      value: '89%',
      subtitle: '(78/89)',
      icon: CreditCard,
      color: 'purple',
    },
  ];

  // ------------------------------------
  // ICON MAPPING (API returns string, we need component)
  // ------------------------------------
  const iconMap = {
    revenue: IndianRupee,
    orders: ShoppingCart,
    messages: MessageSquare,
    payments: CreditCard,
  };

  // ------------------------------------
  // FETCH DATA
  // ------------------------------------
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await api.get("/secure/api/v1/dashboard/statistics");


    const apiStats = response.data.map(stat => ({
      ...stat,
      icon: iconMap[stat.iconKey] || IndianRupee,
    }));

    setStats(apiStats);

  } catch (err) {
    console.error("Failed to fetch stats:", err);
    setError("Failed to load stats");
    setStats(fallbackStats);
  } finally {
    setLoading(false);
  }
};

  // ------------------------------------
  // REFRESH (can be called from parent)
  // ------------------------------------
  const refresh = () => {
    fetchStats();
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
           <AdminSkeleton key={i} variant="stats" />
        ))}
      </div>
    );
  }

  if (error && stats.length === 0) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={refresh}
          className="text-sm text-red-700 underline hover:no-underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsSection;