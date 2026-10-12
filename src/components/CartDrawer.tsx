import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { createDBOrder, type PaymentMethod, type Order } from '../services/db';

export const DEMO_MODE = true;

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
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
    openOrderTracking,
    showToast,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Checkout Form Details
  const [customerName, setCustomerName] = useState('Aditya Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState('aditya.sharma@example.com');
  const [addressLine, setAddressLine] = useState('102, Green Glen Heights, Outer Ring Road');
  const [instructions, setInstructions] = useState('Ring the doorbell; leave at security desk if unavailable.');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Sync user details if authenticated
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

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
    // Mandate OTP authentication before checkout (Section 5 & 6)
    if (!currentUser || !currentUser.isVerified) {
      showToast('Please verify your mobile number with OTP before checkout.', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setPaymentError(null);
    setCheckoutStep('details');
  };

  const finalizeOrder = (verifiedPaymentId?: string) => {
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
      paymentStatus: 'demo_confirmed',
      paymentId: verifiedPaymentId || `demo_pay_${Date.now()}`,
      isDemoOrder: true,
    });

    setIsProcessing(false);

    if (res.success && res.order) {
      setConfirmedOrder(res.order);
      setCheckoutStep('success');

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      clearCart();
      showToast(
        `Demo Order #${res.order.orderNumber} confirmed! No real payment processed. 🎉`,
        'success'
      );
    } else {
      setPaymentError(res.error || 'Failed to record demo order.');
      showToast(res.error || 'Failed to record demo order in database', 'error');
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !addressLine.trim()) {
      showToast('Please fill in all mandatory delivery details.', 'error');
      return;
    }

    if (!currentUser || !currentUser.isVerified) {
      showToast('Authentication required before order placement.', 'error');
      setIsAuthModalOpen(true);
      return;
    }

    setPaymentError(null);
    setIsProcessing(true);

    // DEMO MODE: Zero real payments. Absolutely no Razorpay popup or card charge.
    setTimeout(() => {
      const simulatedPaymentId = `demo_pay_${Date.now()}`;
      finalizeOrder(simulatedPaymentId);
    }, 700);
  };

  const handleTrackNow = () => {
    const orderNum = confirmedOrder?.orderNumber;
    setCheckoutStep('cart');
    setIsCartOpen(false);
    openOrderTracking(orderNum);
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
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
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
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <div className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                    Safe Demo Mode • Zero Real Charge
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-900">
                    Demo Order Placed Successfully!
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    “Demo Order Placed Successfully — No Real Payment Was Processed.”
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs space-y-2 text-neutral-700 text-left">
                  <div className="flex justify-between font-bold text-neutral-900 text-sm pb-1.5 border-b border-neutral-200">
                    <span>Order Number:</span>
                    <span className="font-mono text-amber-600">{confirmedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Name:</span>
                    <span className="font-semibold text-neutral-900">{confirmedOrder.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-mono text-neutral-800">{confirmedOrder.customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Mode:</span>
                    <span className="font-bold text-amber-700">Simulated Demo Order</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-bold px-2 py-0.5 rounded text-[10.5px] uppercase bg-emerald-100 text-emerald-800">
                      Demo Confirmed (₹0 Charged)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Status:</span>
                    <span className="font-bold text-emerald-700 capitalize">{confirmedOrder.orderStatus}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-neutral-200">
                    <span>Order Value (Demo):</span>
                    <span className="font-extrabold text-neutral-900 text-sm">₹{confirmedOrder.total}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleTrackNow}
                    className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm py-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Track Live Delivery Status 🛵</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold py-2"
                  >
                    Back to Restaurant Menu
                  </button>
                </div>
              </div>
            ) : checkoutStep === 'details' ? (
              /* STEP 2: CHECKOUT DETAILS & PAYMENT METHOD */
              <form onSubmit={handleCompleteOrder} className="space-y-4 text-xs">
                {/* Verified Customer Status Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-emerald-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-[11px] block">Verified Customer Session</span>
                      <span className="text-[10px] text-emerald-700">
                        OTP verified for {customerPhone}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Authenticated
                  </span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-amber-900">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Delivering to <strong>{location.city} ({location.pincode})</strong>
                  </span>
                </div>

                {paymentError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

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
                      <label className="block text-neutral-500 text-[11px] mb-1">Phone Number (Verified)</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 text-[11px] mb-1">Email Address</label>
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
                      placeholder="e.g. Ring the bell; leave at security desk"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                    Demo Mode Checkout Method
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
                          <div className="font-bold text-neutral-900">Simulated Instant Checkout (Demo)</div>
                          <span className="text-[10px] text-emerald-700 font-medium">Safe Demo Mode • Zero real payment processed</span>
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
                          <div className="font-bold text-neutral-900">Simulated UPI Payment (Demo)</div>
                          <span className="text-[10px] text-emerald-700 font-medium">Virtual UPI intent • No bank transfer</span>
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
                          <div className="font-bold text-neutral-900">Cash on Delivery (Simulated COD)</div>
                          <span className="text-[10px] text-neutral-500">Demo payment collection upon arrival</span>
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

                {/* Amount Summary with 18% GST */}
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Order Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Charge:</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>GST (18%):</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-900 text-sm pt-1 border-t border-neutral-200">
                    <span>Demo Order Total:</span>
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
                      <span>Recording Demo Order...</span>
                    ) : (
                      <span>Confirm Demo Order (₹{total})</span>
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
                  Add delicious dishes from our collection to satisfy your cravings!
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
                {/* OTP Auth Notice / Status Banner */}
                {currentUser && currentUser.isVerified ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Signed in as <strong>{currentUser.name}</strong> ({currentUser.phone})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900">
                    <div>
                      <span className="font-bold block text-[11px]">Guest Shopper Mode</span>
                      <span className="text-[10px] text-amber-800">
                        Phone OTP verification required before order placement
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

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

                        {/* Quantity Controls (Max 10 enforcement) */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              aria-label="Decrease quantity"
                              className="p-1 hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-800 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity >= 10) {
                                  showToast(`Maximum limit of 10 reached for "${item.product.name}"`, 'info');
                                } else {
                                  updateQuantity(item.product.id, 1);
                                }
                              }}
                              aria-label="Increase quantity"
                              disabled={item.quantity >= 10}
                              className={`p-1 transition cursor-pointer ${
                                item.quantity >= 10
                                  ? 'text-neutral-300 cursor-not-allowed'
                                  : 'hover:bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-neutral-400 hover:text-red-500 transition cursor-pointer"
                            title="Remove from basket"
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
                  <span>GST (18%):</span>
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
