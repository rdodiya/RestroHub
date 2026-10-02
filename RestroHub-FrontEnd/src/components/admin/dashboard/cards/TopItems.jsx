import { useState, useEffect } from 'react';
import api from '@services/common/api';
import { useAdminTheme } from '@context/AdminThemeContext';
import { useBranch } from '@context/BranchContext';

// GET /secure/api/v1/dashboard/top-items?branchId -> [{ name, quantity }]
const TopItems = () => {
  const { isDark } = useAdminTheme();
  const { effectiveBranchId } = useBranch();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!effectiveBranchId) return;
    api
      .get('/secure/api/v1/dashboard/top-items', { params: { branchId: effectiveBranchId } })
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setItems([]));
  }, [effectiveBranchId]);

  if (items.length === 0) return null;

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        Top Items
      </h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={item.name ?? i}
            className={`flex justify-between text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <span className="truncate">{item.name ?? item.foodName}</span>
            <span className="font-semibold">{item.quantity ?? item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopItems;
