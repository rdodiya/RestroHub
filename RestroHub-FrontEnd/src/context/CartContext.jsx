import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'restrohub-cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && item.foodId);
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      const stored = loadCart();
      if (stored.length) setItems(stored);
    }
  }, []);

  useEffect(() => {
    if (hydrated.current) {
      saveCart(items);
    }
  }, [items]);

  const addItem = useCallback((food, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.foodId === food.foodId);
      if (existing) {
        return prev.map(i =>
          i.foodId === food.foodId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        foodId: food.foodId,
        name: food.name,
        price: food.price,
        imageUrl: food.imageUrl || '',
        quantity,
        isVeg: food.isVeg
      }];
    });
  }, []);

  const removeItem = useCallback((foodId) => {
    setItems(prev => prev.filter(i => i.foodId !== foodId));
  }, []);

  const updateQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.foodId !== foodId));
      return;
    }
    setItems(prev => prev.map(i =>
      i.foodId === foodId ? { ...i, quantity } : i
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * i.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalAmount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
