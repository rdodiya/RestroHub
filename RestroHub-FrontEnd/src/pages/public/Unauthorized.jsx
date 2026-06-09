import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Access denied</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">This page is restricted</h1>
        <p className="mt-3 text-sm text-gray-600">
          Your account does not have permission to view this admin area.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
