// src/layouts/PublicLayout.jsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (e) => document.documentElement.classList.toggle('dark', e.matches);
    apply(mq);
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
