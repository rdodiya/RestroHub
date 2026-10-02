import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '@services/common/api';
import AdminSkeleton from '../../AdminSkeleton';
import { useAdminTheme } from '@context/AdminThemeContext';
import toast from 'react-hot-toast';
import { useBranch } from '@context/BranchContext';

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState('30'); // '7' | '30' | 'today'
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hidden, setHidden] = useState(false);
  const { isDark } = useAdminTheme();
  const { effectiveBranchId } = useBranch();

  useEffect(() => {
    fetchRevenue();
    const handleOrderUpdated = () => fetchRevenue();
    window.addEventListener('restrohub:order-updated', handleOrderUpdated);
    const interval = setInterval(fetchRevenue, 30000);
    return () => {
      window.removeEventListener('restrohub:order-updated', handleOrderUpdated);
      clearInterval(interval);
    };
  }, [timeRange, effectiveBranchId]);

  // GET /secure/api/v1/dashboard/trends?branchId&range -> [{ label, value }] (gross order value)
  const fetchRevenue = async () => {
    if (!effectiveBranchId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/secure/api/v1/dashboard/trends', {
        params: {
          branchId: effectiveBranchId,
          days: timeRange === 'today' ? 1 : Number(timeRange),
        },
      });
      const points = (Array.isArray(response.data) ? response.data : []).map((p) => ({
        day: p.label ?? p.date,
        revenue: Math.round(Number(p.value ?? p.grossOrderValue) || 0),
      }));
      setData(points);
      setTotalRevenue(points.reduce((sum, p) => sum + p.revenue, 0));
    } catch (err) {
      // 403 = role has no financial view: hide the card
      if (err.response?.status === 403) setHidden(true);
      else {
        console.error('Failed to fetch trends:', err);
        toast.error('Failed to fetch trends');
        setError('Failed to load order value trend');
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (hidden) return null;

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2
              className={`text-lg font-semibold truncate ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
            >
              Gross Order Value Trend
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Total:{' '}
            <span className="font-bold text-orange-600">₹{totalRevenue.toLocaleString()}</span>
          </p>
        </div>

        {/* Time range selector & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`flex rounded-xl p-0.5 border text-xs font-semibold ${isDark ? 'bg-gray-700/60 border-gray-600' : 'bg-gray-100 border-gray-200'}`}
          >
            {[
              { id: 'today', label: 'Today' },
              { id: '7', label: '7D' },
              { id: '30', label: '30D' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeRange(tab.id)}
                className={`px-2.5 py-1 rounded-lg transition-all text-xs ${
                  timeRange === tab.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchRevenue}
            disabled={loading}
            title="Refresh revenue data"
            className={`p-1.5 rounded-xl border transition-colors shrink-0 flex items-center justify-center ${
              isDark
                ? 'border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {loading ? (
          <AdminSkeleton variant="chart" />
        ) : error && data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-300 mb-2" />
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchRevenue} className="text-xs text-red-400 underline mt-1">
              Retry
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No orders for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
              <XAxis
                dataKey="day"
                stroke={isDark ? '#6b7280' : '#9ca3af'}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke={isDark ? '#6b7280' : '#9ca3af'}
                fontSize={12}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
              />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Gross Order Value']}
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
                strokeWidth={2.5}
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
