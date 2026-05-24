import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useAdminTheme();

  // ------------------------------------
  // FALLBACK DATA
  // ------------------------------------
  const fallbackData = [
    { day: '1', revenue: 24000 },
    { day: '5', revenue: 32000 },
    { day: '10', revenue: 28000 },
    { day: '15', revenue: 45000 },
    { day: '20', revenue: 38000 },
    { day: '25', revenue: 52000 },
    { day: '30', revenue: 45230 },
  ];

  // ------------------------------------
  // FETCH DATA
  // ------------------------------------
  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔌 UNCOMMENT WHEN API READY
      // const response = await api.get('/api/dashboard/revenue?days=30');
      // setData(response.data);

      // 🎭 MOCK
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(fallbackData);

    } catch (err) {
      console.error('Failed to fetch revenue:', err);
      setError('Failed to load chart');
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Revenue (30 Days)</h2>
        <button
          onClick={fetchRevenue}
          disabled={loading}
          className={`transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        {loading ? (
          // Skeleton
          <AdminSkeleton variant="chart" />
        ) : error && data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-300 mb-2" />
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchRevenue} className="text-xs text-red-400 underline mt-1">
              Retry
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="day" stroke={isDark ? '#6b7280' : '#9ca3af'} fontSize={12} />
              <YAxis stroke={isDark ? '#6b7280' : '#9ca3af'} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  color: isDark ? '#f9fafb' : '#111827',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;