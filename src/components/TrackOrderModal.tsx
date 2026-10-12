import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getDBOrderById,
  getDBOrders,
  updateDBOrderStatus,
  type Order,
  type OrderStatus,
} from '../services/db';

export const TrackOrderModal: React.FC = () => {
  const { isTrackOrderOpen, setIsTrackOrderOpen, showToast } = useApp();

  const [orderQuery, setOrderQuery] = useState('TB-842910');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Load order data
  const loadOrder = (query = orderQuery) => {
    const found = getDBOrderById(query);
    if (found) {
      setActiveOrder(found);
    } else {
      // Fallback: pick latest order from DB
      const all = getDBOrders();
      if (all.length > 0) {
        setActiveOrder(all[0]);
        setOrderQuery(all[0].orderNumber);
      }
    }
  };

  useEffect(() => {
    if (isTrackOrderOpen) {
      loadOrder();
    }
  }, [isTrackOrderOpen]);

  // Periodic polling for status changes (every 4 seconds)
  useEffect(() => {
    if (!isTrackOrderOpen || !activeOrder) return;
    const interval = setInterval(() => {
      const refreshed = getDBOrderById(activeOrder.orderNumber);
      if (refreshed && refreshed.updatedAt !== activeOrder.updatedAt) {
        setActiveOrder(refreshed);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isTrackOrderOpen, activeOrder]);

  if (!isTrackOrderOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    const found = getDBOrderById(orderQuery.trim());
    if (found) {
      setActiveOrder(found);
      showToast(`Found live order #${found.orderNumber}!`, 'success');
    } else {
      showToast(`No order found matching "${orderQuery}". Try "TB-842910"`, 'error');
    }
  };

  // Helper for demo simulation: advance to next fulfillment stage
  const handleSimulateNextStage = () => {
    if (!activeOrder) return;
    const stages: OrderStatus[] = [
      'placed',
      'accepted',
      'preparing',
      'ready_for_pickup',
      'out_for_delivery',
      'delivered',
    ];
    const currentIdx = stages.indexOf(activeOrder.orderStatus);
    if (currentIdx >= 0 && currentIdx < stages.length - 1) {
      const nextStatus = stages[currentIdx + 1];
      const res = updateDBOrderStatus(activeOrder.id, nextStatus, undefined, 'Simulator');
      if (res.success && res.order) {
        setActiveOrder(res.order);
        showToast(`Order #${res.order.orderNumber} advanced to ${nextStatus}!`, 'info');
      }
    } else {
      showToast('Order has already reached final stage (Delivered)!', 'info');
    }
  };

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'accepted':
        return 1;
      case 'preparing':
        return 2;
      case 'ready_for_pickup':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      default:
        return 0;
    }
  };

  const currentStageIdx = activeOrder ? getStageIndex(activeOrder.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsTrackOrderOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#14110f] text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-neutral-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Order Tracking
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                #{activeOrder?.orderNumber || 'TB-842910'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {activeOrder?.orderStatus === 'delivered'
                ? 'Order Delivered! 🎉'
                : `Arriving in approx ${activeOrder?.estimatedDeliveryMinutes || 18} mins ⏱️`}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => activeOrder && loadOrder(activeOrder.orderNumber)}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsTrackOrderOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar for Other Orders */}
        <form onSubmit={handleSearchSubmit} className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Track another order (e.g. TB-842910)..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-[#14110f] hover:bg-neutral-800 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Content */}
        {activeOrder && (
          <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Tracking Stages Timeline */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {/* Step 1: Placed */}
              <div className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-[10px] ${
                    currentStageIdx >= 0
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">1. Order Placed & Payment Verified</h4>
                  <p className="text-[11px] text-neutral-500">
                    Payment verified via {activeOrder.paymentMethod.toUpperCase()} (₹{activeOrder.total})
                  </p>
                </div>
              </div>

              {/* Step 2: Kitchen Accepted */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStageIdx < 1 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-[10px] ${
                    currentStageIdx >= 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  {currentStageIdx >= 1 ? '✓' : '2'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">2. Kitchen Accepted & Workstation Assigned</h4>
                  <p className="text-[11px] text-neutral-500">
                    Restaurant head chef accepted order slip.
                  </p>
                </div>
              </div>

              {/* Step 3: Preparing */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStageIdx < 2 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-[10px] ${
                    currentStageIdx >= 2
                      ? currentStageIdx === 2
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-emerald-500 text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  {currentStageIdx > 2 ? '✓' : '🍳'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">3. Fresh Gourmet Cooking in Progress</h4>
                  <p className="text-[11px] text-neutral-500">
                    Chef is grilling fresh patties, wood-firing crusts, and packing warm.
                  </p>
                </div>
              </div>

              {/* Step 4: Out for Delivery */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStageIdx < 4 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-[10px] ${
                    currentStageIdx >= 4
                      ? currentStageIdx === 4
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-emerald-500 text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  {currentStageIdx > 4 ? '✓' : '🛵'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">4. Rider On The Way to Doorstep</h4>
                  <p className="text-[11px] text-neutral-500">
                    Rahul Verma picked up insulated hot thermal bag.
                  </p>
                </div>
              </div>

              {/* Step 5: Delivered */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStageIdx < 5 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-[10px] ${
                    currentStageIdx === 5
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  {currentStageIdx === 5 ? '✓' : '5'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">5. Delivered Hot & Fresh</h4>
                  <p className="text-[11px] text-neutral-500">Enjoy your TastyBites experience!</p>
                </div>
              </div>
            </div>

            {/* Delivery Rider Contact Card */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
                  👨🏽‍🍳
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-neutral-900">Rahul Verma</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      ★ 4.9
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block">Eco EV Express Rider • Hot Bag</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Calling delivery partner Rahul Verma (+91 98450 11223)...', 'info')}
                  className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition cursor-pointer shadow-xs"
                  title="Call Partner"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showToast('Connecting to rider live message chat...', 'info')}
                  className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 transition cursor-pointer shadow-xs"
                  title="Chat Partner"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items Summary in this Order */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs space-y-2">
              <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                Order Items ({activeOrder.items.length})
              </span>
              <div className="space-y-1.5 pt-1">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-neutral-700">
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-mono font-semibold">₹{it.lineTotal}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900">
                <span>Total Paid:</span>
                <span className="text-amber-600 font-mono text-sm">₹{activeOrder.total}</span>
              </div>
            </div>

            {/* Delivery Address Details */}
            <div className="flex items-start gap-2.5 text-xs text-neutral-600 pt-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900">Delivery Address:</span>
                <p className="text-[11px] text-neutral-600">
                  {activeOrder.address.addressLine}, {activeOrder.address.city} - {activeOrder.address.pincode}
                </p>
                {activeOrder.address.instructions && (
                  <p className="text-[10.5px] text-amber-700 italic">
                    Note: &ldquo;{activeOrder.address.instructions}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Demo Simulation Action Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleSimulateNextStage}
                className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-300 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Simulate Next Stage →</span>
              </button>
              <span className="text-[10px] text-neutral-400">
                Or update via Admin Portal
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Need help with this delivery?</span>
          <button
            onClick={() => showToast('Connecting to 24/7 TastyBites VIP support...', 'info')}
            className="text-amber-600 font-bold hover:underline cursor-pointer"
          >
            Live Support Chat
          </button>
        </div>
      </div>
    </div>
  );
};
