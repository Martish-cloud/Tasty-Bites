import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    appliedPromo,
    applyPromo,
    removePromo,
    setIsTrackOrderOpen,
    showToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromo(couponInput);
    if (!res.success) {
      showToast(res.message, 'error');
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      const newOrderId = 'TB-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrderId);
      setOrderComplete(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      clearCart();
    }, 1200);
  };

  const handleTrackNow = () => {
    setOrderComplete(false);
    setIsCartOpen(false);
    setIsTrackOrderOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Your Order Basket
              </h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>

            <button
              onClick={() => {
                setOrderComplete(false);
                setIsCartOpen(false);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {orderComplete ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-900">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Delicious food is being prepared with fresh ingredients. Order ID: <span className="font-bold text-neutral-800">{orderId}</span>
                </p>
                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={handleTrackNow}
                    className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm py-3 rounded-xl shadow-md transition cursor-pointer"
                  >
                    Track Live Order 🛵
                  </button>
                  <button
                    onClick={() => {
                      setOrderComplete(false);
                      setIsCartOpen(false);
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold py-2"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🍽️
                </div>
                <h3 className="font-bold text-neutral-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Add some mouth-watering dishes from our menu to satisfy your cravings!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
                >
                  Explore Dishes
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-200 transition bg-neutral-50/40"
                    >
                      {/* Image */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                          <span className="font-bold text-neutral-900">
                            ₹{item.product.price}
                          </span>
                          <span className="text-[10px] text-neutral-400">each</span>
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-extrabold text-neutral-900">
                          ₹{item.product.price * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-400 hover:text-rose-500 transition p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                    <span className="text-[11px] font-bold text-amber-900 block mb-1.5">
                      Have a Coupon Code?
                    </span>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-300">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{appliedPromo.code} Applied</span>
                        </div>
                        <button
                          onClick={removePromo}
                          className="text-[11px] text-rose-500 font-bold hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="e.g. TASTY50"
                          className="flex-1 bg-white text-xs px-3 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-amber-500 uppercase font-semibold"
                        />
                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-500">
                      <span>Tip: Use <b>TASTY50</b> for 50% off</span>
                      <span>Free delivery over ₹499</span>
                    </div>
                  </div>
                </div>

                {/* Bill Details */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Item Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <div className="flex items-center gap-1">
                      <span>Delivery Fee</span>
                      {deliveryFee === 0 && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
                          FREE
                        </span>
                      )}
                    </div>
                    <span>{deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Taxes & Restaurant Charges (5%)</span>
                    <span>₹{tax}</span>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-extrabold text-neutral-950">
                    <span>To Pay</span>
                    <span className="text-base text-neutral-900">₹{total}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {!orderComplete && cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/50">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-between shadow-lg shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-red-200 font-normal">
                    {cart.length} items
                  </span>
                  <span className="font-extrabold text-base">₹{total}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{isCheckingOut ? 'Placing Order...' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
