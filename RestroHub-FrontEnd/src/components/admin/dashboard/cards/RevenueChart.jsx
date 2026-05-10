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

// ============================================
// MAIN COMPONENT (Exported)
// ============================================
const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Revenue (30 Days)</h2>
        <button
          onClick={fetchRevenue}
          disabled={loading}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        {loading ? (
          // Skeleton
          <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-gray-300 animate-spin" />
          </div>
        ) : error && data.length === 0 ? (
          // Error
          <div className="w-full h-full flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-300 mb-2" />
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchRevenue} className="text-xs text-red-600 underline mt-1">
              Retry
            </button>
          </div>
        ) : (
          // Chart
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
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