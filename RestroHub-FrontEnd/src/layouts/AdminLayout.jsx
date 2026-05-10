import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/admin/Sidebar';
import Header from '@components/admin/Header';

const AdminLayout = () => {
  // Mobile drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Desktop collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - fixed position */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Content Area - takes remaining space */}
      <div
        className="
          relative flex flex-1 flex-col
          overflow-x-hidden overflow-y-hidden
        "
      >
        <Header
          onMobileMenuClick={() => setSidebarOpen(true)}
          collapsed={sidebarCollapsed}
          onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-screen-2xl p-4 sm:p-5 lg:p-6 2xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;