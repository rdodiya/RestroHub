// src/layouts/PublicLayout.jsx
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen">
    <Outlet />
  </div>
);

export default PublicLayout;
