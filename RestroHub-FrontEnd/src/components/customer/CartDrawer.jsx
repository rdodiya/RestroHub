import { useCart } from '@context/CartContext';

const formatPrice = (price) => {
  const num = parseFloat(price);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, clearCart, itemCount, totalAmount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1101,
          width: '100%', maxWidth: '420px',
          background: '#fff', display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
          animation: 'cartSlideIn 0.3s ease-out',
        }}
      >
        <style>{`
          @keyframes cartSlideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#111827' }}>
            Your Cart ({itemCount})
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: 'none', background: '#f3f4f6', cursor: 'pointer',
              fontSize: '18px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#6b7280',
            }}
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 20px', color: '#9ca3af', textAlign: 'center',
          }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</span>
            <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: '#374151' }}>
              Your cart is empty
            </p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Add items from the menu to get started
            </p>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
              {items.map((item) => (
                <div
                  key={item.foodId}
                  style={{
                    display: 'flex', gap: '12px', padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        display: 'inline-block', width: '10px', height: '10px',
                        borderRadius: '50%', flexShrink: 0,
                        background: item.isVeg ? '#22c55e' : '#ef4444',
                      }} />
                      <p style={{
                        margin: 0, fontWeight: 600, fontSize: '14px', color: '#111827',
                      }}>
                        {item.name}
                      </p>
                    </div>
                    <p style={{
                      margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: '#f59e0b',
                    }}>
                      ₹{formatPrice(item.price)}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                        style={{
                          border: 'none', background: '#f9fafb', cursor: 'pointer',
                          padding: '6px 10px', fontSize: '16px', fontWeight: 600,
                          color: '#374151', lineHeight: 1,
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        minWidth: '28px', textAlign: 'center', fontSize: '14px',
                        fontWeight: 600, color: '#111827',
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                        style={{
                          border: 'none', background: '#f9fafb', cursor: 'pointer',
                          padding: '6px 10px', fontSize: '16px', fontWeight: 600,
                          color: '#374151', lineHeight: 1,
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.foodId)}
                      style={{
                        border: 'none', background: 'none', cursor: 'pointer',
                        padding: '4px', fontSize: '16px', color: '#9ca3af', lineHeight: 1,
                      }}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid #e5e7eb', padding: '16px 20px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '12px',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                  Total
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>
                  ₹{formatPrice(totalAmount)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={clearCart}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    border: '1px solid #e5e7eb', background: '#fff',
                    cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    color: '#6b7280',
                  }}
                >
                  Clear
                </button>
                <button
                  style={{
                    flex: 2, padding: '10px', borderRadius: '10px',
                    border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                  }}
                >
                  Place Order
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
