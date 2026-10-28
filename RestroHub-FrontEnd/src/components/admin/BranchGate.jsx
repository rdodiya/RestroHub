import { Link, useLocation } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useBranch } from '@context/BranchContext';
import { useAdminTheme } from '@context/AdminThemeContext';
import { hasAnyRole, readStoredRoles } from '../../utils/auth';

// Pages whose data belongs to a branch. A newly approved restaurant has none until the owner adds one.
const BRANCH_PAGES = [
  '/admin/dashboard',
  '/admin/menus',
  '/admin/orders',
  '/admin/kds',
  '/admin/upi-links',
  '/admin/marketing',
];

const BranchGate = ({ children }) => {
  const { branches, loading } = useBranch();
  const { pathname } = useLocation();
  const { isDark } = useAdminTheme();

  // 2026-10-28 - Issue: SUPER_ADMIN blocked - Reason: Platform super admin has no branches, exempt from gate
  const isSuperAdmin = hasAnyRole(readStoredRoles(), ['SUPER_ADMIN']);
  const needsBranch = BRANCH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isSuperAdmin || loading || !needsBranch || branches.length > 0) return children;

  return (
    <div
      className={`mx-auto mt-10 max-w-lg rounded-2xl border p-10 text-center shadow-sm ${
        isDark
          ? 'border-gray-700 bg-gray-800 text-gray-100'
          : 'border-gray-200 bg-white text-gray-900'
      }`}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
        <Store className="h-7 w-7 text-blue-600" />
      </div>
      <h2 className="text-xl font-bold">Create your first branch</h2>
      <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Your restaurant is ready, but it has no branch yet. Menus, orders and the kitchen display
        are set up per branch, so add one to get started.
      </p>
      <Link
        to="/admin/store/branches"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Add a branch
      </Link>
    </div>
  );
};

export default BranchGate;
