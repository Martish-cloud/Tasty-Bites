import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  CreditCard,
  QrCode,
  Truck,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { createDBOrder, type PaymentMethod, type Order } from '../services/db';

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
    location,
    setIsTrackOrderOpen,
    showToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Checkout Form Details
  const [customerName, setCustomerName] = useState('Amit Halder');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState('askfor.amithalder@gmail.com');
  const [addressLine, setAddressLine] = useState('102, Green Glen Heights, Outer Ring Road');
  const [instructions, setInstructions] = useState('Ring the doorbell; leave at reception if not available.');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');

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

  const handleProceedToDetails = () => {
    if (cart.length === 0) return;
    setCheckoutStep('details');
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !addressLine.trim()) {
      showToast('Please fill in all delivery details.', 'error');
      return;
    }

    setIsProcessing(true);

    // Call server-side / persistent DB order creation
    setTimeout(() => {
      const orderItems = cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }));

      const res = createDBOrder({
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim(),
        },
        address: {
          addressLine: addressLine.trim(),
          city: location.city,
          pincode: location.pincode,
          instructions: instructions.trim(),
        },
        items: orderItems,
        promoCode: appliedPromo?.code,
        paymentMethod,
      });

      setIsProcessing(false);

      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        setCheckoutStep('success');

        // Trigger celebratory confetti
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });

        clearCart();
        showToast(`Order #${res.order.orderNumber} confirmed! 🎉`, 'success');
      } else {
        showToast(res.error || 'Failed to create order', 'error');
      }
    }, 1000);
  };

  const handleTrackNow = () => {
    setCheckoutStep('cart');
    setIsCartOpen(false);
    setIsTrackOrderOpen(true);
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div onClick={handleClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                {checkoutStep === 'cart'
                  ? 'Your Order Basket'
                  : checkoutStep === 'details'
                  ? 'Checkout & Delivery'
                  : 'Order Confirmation'}
              </h2>
              {checkoutStep === 'cart' && (
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {cart.length} items
                </span>
              )}
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* STEP 3: SUCCESS */}
            {checkoutStep === 'success' && confirmedOrder ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-900">
                  Payment Verified & Order Placed!
                </h3>
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs space-y-1.5 text-neutral-700">
                  <div className="flex justify-between font-bold text-neutral-900 text-sm pb-1 border-b border-neutral-200">
                    <span>Order Number:</span>
                    <span className="font-mono text-amber-600">{confirmedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Payment Method:</span>
                    <span className="font-bold uppercase text-neutral-900">{confirmedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount Paid:</span>
                    <span className="font-bold text-neutral-900">₹{confirmedOrder.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Arrival:</span>
                    <span className="font-bold text-emerald-600">~22-25 mins</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleTrackNow}
                    className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm py-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Track Live Order 🛵</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold py-2"
                  >
                    Continue Browsing Menu
                  </button>
                </div>
              </div>
            ) : checkoutStep === 'details' ? (
              /* STEP 2: CHECKOUT DETAILS & PAYMENT METHOD */
              <form onSubmit={handleCompleteOrder} className="space-y-4 text-xs">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-amber-900">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Delivering to <strong>{location.city} ({location.pincode})</strong>
                  </span>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                    Customer Contact Details
                  </span>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-500 text-[11px] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 text-[11px] mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                  <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                    Delivery Address
                  </span>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Address / Flat / Street</label>
                    <textarea
                      required
                      rows={2}
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="Flat, House no., Building name, Street"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Leave with security, call on arrival"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                    Select Payment Gateway
                  </span>
                  <div className="space-y-2">
                    <label
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === 'razorpay'
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-bold text-neutral-900">Razorpay (Cards, UPI, NetBanking)</div>
                          <span className="text-[10px] text-neutral-500">Fast, instant & 100% encrypted</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-amber-600"
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === 'upi'
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold text-neutral-900">Instant UPI (GPay / PhonePe / Paytm)</div>
                          <span className="text-[10px] text-neutral-500">Direct instant scan or VPA</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-amber-600"
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === 'cod'
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-bold text-neutral-900">Cash on Delivery (COD)</div>
                          <span className="text-[10px] text-neutral-500">Pay cash or card at doorstep</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-amber-600"
                      />
                    </label>
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Order Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Fee:</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Taxes & GST (5%):</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-900 text-sm pt-1 border-t border-neutral-200">
                    <span>Final Amount:</span>
                    <span className="text-amber-600 font-mono">₹{total}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-1/3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-3 rounded-xl transition cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-2/3 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold py-3 rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Verifying Payment...</span>
                    ) : (
                      <span>Pay ₹{total} & Confirm</span>
                    )}
                  </button>
                </div>
              </form>
            ) : cart.length === 0 ? (
              /* EMPTY CART */
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🍽️
                </div>
                <h3 className="font-bold text-neutral-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Add mouth-watering dishes from our menu to satisfy your cravings!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Explore Dishes
                </button>
              </div>
            ) : (
              /* STEP 1: CART ITEMS LIST */
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-200 transition bg-neutral-50/30"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-xs font-bold text-neutral-800">
                            ₹{item.product.price}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-[10px] text-neutral-400 line-through">
                              ₹{item.product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-neutral-400 hover:text-red-500 transition cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="font-mono text-xs font-extrabold text-neutral-900 shrink-0">
                        ₹{item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. TASTY50)"
                    className="flex-1 p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-4 rounded-xl transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {appliedPromo.code} Applied ({appliedPromo.description})
                    </span>
                    <button
                      onClick={removePromo}
                      className="text-red-500 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Checkout Summary (Only on Cart Step) */}
          {checkoutStep === 'cart' && cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promo Discount:</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charge:</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Taxes (5% GST):</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm sm:text-base text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Grand Total:</span>
                  <span className="text-[#e52e2e] font-mono">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToDetails}
                className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition cursor-pointer group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
