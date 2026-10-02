import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/admin/Sidebar';
import Header from '@components/admin/Header';
import { useAdminTheme } from '@context/AdminThemeContext';
import { BranchProvider } from '@context/BranchContext';
import ErrorBoundary from '@components/common/ErrorBoundary';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDark } = useAdminTheme();

  return (
    <BranchProvider>
      <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-hidden">
          <Header
            onMobileMenuClick={() => setSidebarOpen(true)}
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main
            className={`admin-content flex-1 overflow-y-auto overflow-x-hidden ${isDark ? 'bg-gray-900' : ''}`}
          >
            <div className="mx-auto max-w-screen-2xl p-4 sm:p-5 lg:p-6 2xl:p-8">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </BranchProvider>
  );
};

export default AdminLayout;
