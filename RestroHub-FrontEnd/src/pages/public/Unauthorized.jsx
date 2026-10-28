import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import usePageMeta from '@hooks/usePageMeta';

// 2026-10-28 - Issue: Missing unauthorized route led to 404 - Reason: Provide dedicated 403 Access Denied view
const Unauthorized = () => {
  usePageMeta({
    title: 'Access Denied | Restroly',
    description: 'You do not have permission to access this page.',
    noindex: true,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
          <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You do not have permission to view or manage this section. If you believe this is an error, please contact your restaurant administrator.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
