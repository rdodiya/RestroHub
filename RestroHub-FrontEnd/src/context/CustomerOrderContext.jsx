import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const CustomerOrderContext = createContext(null);

export const useCustomerOrder = () => {
  const context = useContext(CustomerOrderContext);
  if (!context) {
    throw new Error('useCustomerOrder must be used within CustomerOrderProvider');
  }
  return context;
};

export const CustomerOrderProvider = ({ children }) => {
  const { branchId, restaurantName } = useParams();
  const [searchParams] = useSearchParams();

  // Extract table params
  const rawTableId = searchParams.get('tableId');
  const rawTableNumber = searchParams.get('table') || searchParams.get('tableNumber');
  const rawRestaurantId = searchParams.get('restaurantId');

  const [tableInfo, setTableInfo] = useState(() => {
    // Check URL or fall back to sessionStorage
    const saved = sessionStorage.getItem(`table_order_session_${branchId}`);
    if (rawTableId) {
      const info = {
        tableId: rawTableId,
        tableNumber: rawTableNumber || rawTableId,
        branchId,
        restaurantId: rawRestaurantId || '1',
      };
      sessionStorage.setItem(`table_order_session_${branchId}`, JSON.stringify(info));
      return info;
    }
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (rawTableId) {
      const info = {
        tableId: rawTableId,
        tableNumber: rawTableNumber || rawTableId,
        branchId,
        restaurantId: rawRestaurantId || '1',
      };
      setTableInfo(info);
      sessionStorage.setItem(`table_order_session_${branchId}`, JSON.stringify(info));
    }
  }, [rawTableId, rawTableNumber, rawRestaurantId, branchId]);

  // Cart state: { [foodId]: { item, quantity, specialRequest } }
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const addToCart = (item, quantity = 1) => {
    const foodId = item.foodId || item.id;
    if (!foodId) return;

    setCart((prev) => {
      const existing = prev[foodId];
      const newQty = existing ? existing.quantity + quantity : quantity;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      }
      return {
        ...prev,
        [foodId]: {
          item,
          quantity: newQty,
          specialRequest: existing?.specialRequest || '',
        },
      };
    });
    toast.success(`Added ${item.name} to order`);
  };

  const updateQuantity = (foodId, delta) => {
    setCart((prev) => {
      const existing = prev[foodId];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      }
      return {
        ...prev,
        [foodId]: {
          ...existing,
          quantity: newQty,
        },
      };
    });
  };

  const updateSpecialRequest = (foodId, specialRequest) => {
    setCart((prev) => {
      if (!prev[foodId]) return prev;
      return {
        ...prev,
        [foodId]: {
          ...prev[foodId],
          specialRequest,
        },
      };
    });
  };

  const clearCart = () => setCart({});

  const totalItemsCount = Object.values(cart).reduce((sum, entry) => sum + entry.quantity, 0);

  const totalAmount = Object.values(cart).reduce((sum, entry) => {
    const price = typeof entry.item.price === 'number' ? entry.item.price : parseFloat(entry.item.price) || 0;
    return sum + price * entry.quantity;
  }, 0);

  const placeOrder = async ({ customerName, customerPhone, specialInstructions }) => {
    if (!tableInfo?.tableId) {
      toast.error('Table information is missing. Please re-scan table QR.');
      return null;
    }
    if (totalItemsCount === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        branchId: Number(tableInfo.branchId),
        tableId: Number(tableInfo.tableId),
        customerName: customerName || 'Guest Table Customer',
        customerPhone: customerPhone || null,
        specialInstructions: specialInstructions || '',
        items: Object.entries(cart).map(([foodId, entry]) => ({
          foodId: Number(foodId),
          quantity: entry.quantity,
          specialRequest: entry.specialRequest || null,
        })),
      };

      const backendHost = window.location.hostname || 'localhost';
      const res = await fetch(`http://${backendHost}:8181/restroly/public/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error ${res.status}`);
      }

      const orderData = await res.json();
      setPlacedOrder(orderData);
      clearCart();
      setIsCartOpen(false);
      toast.success(`Order #${orderData.orderId || ''} placed successfully!`);
      return orderData;
    } catch (err) {
      console.error('Order placement failed:', err);
      toast.error(err.message || 'Failed to place order. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomerOrderContext.Provider
      value={{
        tableInfo,
        cart,
        addToCart,
        updateQuantity,
        updateSpecialRequest,
        clearCart,
        totalItemsCount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        isSubmitting,
        placeOrder,
        placedOrder,
        setPlacedOrder,
      }}
    >
      {children}
    </CustomerOrderContext.Provider>
  );
};
