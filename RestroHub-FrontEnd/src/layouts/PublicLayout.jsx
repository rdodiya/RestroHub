// src/layouts/PublicLayout.jsx
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@context/ThemeContext';

const PublicLayout = () => (
  <ThemeProvider>
    <div className="min-h-screen">
      <Outlet />
    </div>
  </ThemeProvider>
);

export default PublicLayout;
