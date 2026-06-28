// src/layouts/CustomerLayout.jsx
import { Outlet } from 'react-router-dom';
import { CartProvider } from '@context/CartContext';

const CustomerLayout = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </CartProvider>
  );
};

export default CustomerLayout;