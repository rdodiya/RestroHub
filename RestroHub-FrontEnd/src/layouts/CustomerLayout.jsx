// src/layouts/CustomerLayout.jsx
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '@components/common/ErrorBoundary';

const CustomerLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen overflow-x-hidden bg-gray-50">
        <Outlet />
      </div>
    </ErrorBoundary>
  );
};

export default CustomerLayout;
