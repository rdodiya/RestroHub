import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Loader2, CheckCircle2, QrCode } from 'lucide-react';
import { useCustomerOrder } from '@context/CustomerOrderContext.jsx';

const CustomerOrderDrawer = () => {
  const {
    tableInfo,
    cart,
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
  } = useCustomerOrder();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isCartOpen && !placedOrder) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await placeOrder({ customerName, customerPhone, specialInstructions });
    } catch (err) {
      // Error handled in context
    }
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    if (placedOrder) {
      setPlacedOrder(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {placedOrder ? 'Order Confirmed!' : 'Your Order'}
              </h2>
              {tableInfo?.tableNumber && (
                <p className="text-xs text-orange-600 font-semibold">
                  Dine-in • Table #{tableInfo.tableNumber}
                </p>
              )}
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {placedOrder ? (
              // Order Success View
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Order #{placedOrder.orderId} Placed!
                </h3>
                <p className="text-sm text-gray-600">
                  Your order has been sent to the kitchen. It will be served at{' '}
                  <span className="font-semibold text-gray-900">Table #{tableInfo?.tableNumber}</span>.
                </p>

                {placedOrder.paymentLink && (
                  <div className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-xl text-left">
                    <p className="text-xs font-semibold text-orange-800 uppercase tracking-wide">
                      Instant UPI Payment Available
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Total: ₹{Number(placedOrder.totalAmount).toFixed(2)}
                    </p>
                    <a
                      href={placedOrder.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                    >
                      Pay via UPI Now
                    </a>
                  </div>
                )}

                <button
                  onClick={closeDrawer}
                  className="mt-6 w-full border border-gray-300 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Continue Browsing Menu
                </button>
              </div>
            ) : totalItemsCount === 0 ? (
              // Empty Cart View
              <div className="text-center py-12 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-base">Your table cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">
                  Select dishes from the menu to build your table order.
                </p>
              </div>
            ) : (
              // Active Cart Items & Form
              <div className="space-y-6">
                {/* Items List */}
                <div className="space-y-3">
                  {Object.entries(cart).map(([foodId, entry]) => (
                    <div
                      key={foodId}
                      className="p-3 border border-gray-200 rounded-xl bg-white shadow-xs space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <h4 className="font-semibold text-sm text-gray-900 leading-snug">
                            {entry.item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{Number(entry.item.price).toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(foodId, -1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-200"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-900">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(foodId, 1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-200"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Special instructions for dish */}
                      <input
                        type="text"
                        placeholder="Add cooking note (e.g. less spicy)..."
                        value={entry.specialRequest || ''}
                        onChange={(e) => updateSpecialRequest(foodId, e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <form id="customer-order-form" onSubmit={handleSubmit} className="space-y-3 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Contact Details (Optional)
                  </h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number (for WhatsApp Receipt)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      General Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any overall instructions for your table order..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden resize-none"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer with checkout summary */}
          {!placedOrder && totalItemsCount > 0 && (
            <div className="p-4 border-t border-gray-200 bg-white space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-gray-900">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="text-lg text-orange-600 font-bold">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                form="customer-order-form"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Table Order...</span>
                  </>
                ) : (
                  <span>Place Order • ₹{totalAmount.toFixed(2)}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDrawer;
