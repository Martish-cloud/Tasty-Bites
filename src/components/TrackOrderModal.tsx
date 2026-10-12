import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getDBOrderById,
  getDBOrders,
  getDBOrdersForCustomer,
  updateDBOrderStatus,
  type Order,
  type OrderStatus,
} from '../services/db';
import {
  computeTrackingState,
  syncOrderStageWithPersistence,
  DEMO_TRACKING_CONFIG,
  DEMO_RIDER_INFO,
  type ComputedTrackingState,
} from '../services/trackingService';

export const TrackOrderModal: React.FC = () => {
  const {
    isTrackOrderOpen,
    setIsTrackOrderOpen,
    trackingOrderNumber,
    setTrackingOrderNumber,
    currentUser,
    showToast,
  } = useApp();

  const [orderQuery, setOrderQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Initialize and select the best matching order
  useEffect(() => {
    if (!isTrackOrderOpen) return;

    setErrorMessage(null);

    // 1. If explicit tracking order number was requested
    if (trackingOrderNumber) {
      const found = getDBOrderById(trackingOrderNumber);
      if (found) {
        setActiveOrder(syncOrderStageWithPersistence(found));
        setOrderQuery(found.orderNumber);
        return;
      }
    }

    // 2. If customer is authenticated, fetch their latest order
    if (currentUser?.phone) {
      const customerOrders = getDBOrdersForCustomer(currentUser.phone);
      if (customerOrders.length > 0) {
        const latest = syncOrderStageWithPersistence(customerOrders[0]);
        setActiveOrder(latest);
        setOrderQuery(latest.orderNumber);
        setTrackingOrderNumber(latest.orderNumber);
        return;
      }
    }

    // 3. Otherwise pick latest order in DB
    const all = getDBOrders();
    if (all.length > 0) {
      const latest = syncOrderStageWithPersistence(all[0]);
      setActiveOrder(latest);
      setOrderQuery(latest.orderNumber);
      setTrackingOrderNumber(latest.orderNumber);
    } else {
      setErrorMessage('No orders currently found in database. Place a demo order to begin tracking!');
    }
  }, [isTrackOrderOpen, trackingOrderNumber, currentUser]);

  // Real-time deterministic auto-progression loop (every 1 second)
  useEffect(() => {
    if (!isTrackOrderOpen || !activeOrder) return;

    const interval = setInterval(() => {
      // Re-read latest persisted order from DB in case admin or other tab updated it
      const currentPersisted = getDBOrderById(activeOrder.orderNumber) || activeOrder;
      const synced = syncOrderStageWithPersistence(currentPersisted);

      if (synced.orderStatus !== activeOrder.orderStatus || synced.updatedAt !== activeOrder.updatedAt) {
        setActiveOrder(synced);
      }
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTrackOrderOpen, activeOrder]);

  // Compute live tracking state based on order creation time
  const trackingState: ComputedTrackingState = useMemo(() => {
    if (!activeOrder) {
      return {
        status: 'placed',
        stageIndex: 0,
        stageName: 'Order Confirmed',
        stageDescription: 'Demo order confirmed — no real payment was processed.',
        elapsedSeconds: 0,
        secondsRemainingInStage: DEMO_TRACKING_CONFIG.stage1DurationSec,
        isDelivered: false,
      };
    }
    return computeTrackingState(activeOrder.createdAt);
  }, [activeOrder, tick]);

  if (!isTrackOrderOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = orderQuery.trim();
    if (!query) return;

    setErrorMessage(null);
    const found = getDBOrderById(query);

    if (found) {
      // Authorization Check: If customer is logged in, ensure order belongs to them or is a public demo
      if (currentUser?.phone) {
        const customerClean = currentUser.phone.replace(/\D/g, '');
        const orderClean = found.customer.phone.replace(/\D/g, '');
        if (customerClean && orderClean && customerClean !== orderClean && !found.isDemoOrder) {
          setErrorMessage(`Access restricted: Order #${found.orderNumber} belongs to another account.`);
          showToast('Cannot track private orders belonging to another user.', 'error');
          return;
        }
      }

      const synced = syncOrderStageWithPersistence(found);
      setActiveOrder(synced);
      setTrackingOrderNumber(synced.orderNumber);
      showToast(`Tracking active order #${synced.orderNumber}`, 'success');
    } else {
      setErrorMessage(`No order found matching "${query}". Please verify the order number.`);
      showToast(`Order "${query}" was not found in system.`, 'error');
    }
  };

  // Helper to manually advance stage for testing / evaluation
  const handleFastForwardStage = () => {
    if (!activeOrder) return;
    const stages: OrderStatus[] = [
      'placed',
      'accepted',
      'preparing',
      'out_for_delivery',
      'delivered',
    ];
    const currentIdx = stages.indexOf(activeOrder.orderStatus);
    if (currentIdx >= 0 && currentIdx < stages.length - 1) {
      const nextStatus = stages[currentIdx + 1];
      const res = updateDBOrderStatus(
        activeOrder.id,
        nextStatus,
        `Fast-forwarded via demo simulator to ${nextStatus}`,
        'Simulator Tester'
      );
      if (res.success && res.order) {
        setActiveOrder(res.order);
        showToast(`Demo order #${res.order.orderNumber} advanced to ${nextStatus}!`, 'info');
      }
    } else {
      showToast('Order has already reached final stage (Delivered)!', 'info');
    }
  };

  const formatTime = (isoString?: string, offsetSeconds = 0) => {
    if (!isoString) return '--:--';
    const d = new Date(new Date(isoString).getTime() + offsetSeconds * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Stage configuration details
  const t1 = DEMO_TRACKING_CONFIG.stage1DurationSec;
  const t2 = t1 + DEMO_TRACKING_CONFIG.stage2DurationSec;
  const t3 = t2 + DEMO_TRACKING_CONFIG.stage3DurationSec;
  const t4 = t3 + DEMO_TRACKING_CONFIG.stage4DurationSec;

  const currentStage = trackingState.stageIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsTrackOrderOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#14110f] text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-neutral-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Live Order Tracking
              </span>
              <span className="text-xs text-neutral-400 font-mono font-semibold">
                #{activeOrder?.orderNumber || 'TB-DEMO'}
              </span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9.5px] px-2 py-0.2 rounded font-bold">
                Safe Demo Mode
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 flex items-center gap-2">
              {trackingState.isDelivered ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Order Delivered Hot & Fresh! 🎉
                </span>
              ) : (
                <span>
                  {trackingState.stageName} •{' '}
                  <span className="text-amber-400 font-medium text-sm">
                    Simulated ETA: ~{Math.max(12, (activeOrder?.estimatedDeliveryMinutes || 25) - Math.floor(trackingState.elapsedSeconds / 5))} mins
                  </span>
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => activeOrder && setActiveOrder(syncOrderStageWithPersistence(activeOrder))}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Refresh Tracking Status"
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
              placeholder="Track by Order / Tracking ID (e.g. TB-842910)..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-[#14110f] hover:bg-neutral-800 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition cursor-pointer"
          >
            Track Order
          </button>
        </form>

        {/* Error Notification */}
        {errorMessage && (
          <div className="m-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Tracking Error</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        {activeOrder && (
          <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
            {/* Live Progress Bar Header */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Current Fulfillment State
                  </span>
                  <span className="text-sm font-extrabold text-neutral-900">
                    Stage {currentStage + 1} of 5: {trackingState.stageName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!trackingState.isDelivered && (
                    <span className="text-[11px] font-mono text-amber-700 bg-amber-100/70 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                      Auto-advancing in {trackingState.secondsRemainingInStage}s
                    </span>
                  )}
                  <button
                    onClick={handleFastForwardStage}
                    disabled={trackingState.isDelivered}
                    className="text-[10px] font-bold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-2 py-1 rounded-lg transition cursor-pointer disabled:opacity-40"
                    title="Jump immediately to next simulated stage"
                  >
                    Skip Ahead ⏩
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-700 rounded-full"
                  style={{ width: `${((currentStage + 1) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* 5-Stage Visual Timeline */}
            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
              {/* STAGE 1: Order Confirmed */}
              <div className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-7 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-xs font-bold ${
                    currentStage >= 0 ? 'bg-emerald-500 text-white' : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  ✓
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Stage 1 — Order Confirmed
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {formatTime(activeOrder.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Demo order confirmed — no real payment was processed. Order reference ID:{' '}
                    <strong className="font-mono text-neutral-800">{activeOrder.orderNumber}</strong>.
                  </p>
                </div>
              </div>

              {/* STAGE 2: Restaurant Accepted */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStage < 1 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-7 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-xs font-bold ${
                    currentStage >= 1 ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStage >= 1 ? '✓' : '2'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Stage 2 — Restaurant Accepted
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {currentStage >= 1 ? formatTime(activeOrder.createdAt, t1) : `~${t1}s`}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Simulated gourmet kitchen accepted order slip and allocated cooking line.
                  </p>
                </div>
              </div>

              {/* STAGE 3: Preparing Your Food */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStage < 2 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-7 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-xs font-bold ${
                    currentStage >= 2
                      ? currentStage === 2
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-emerald-500 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStage > 2 ? '✓' : <ChefHat className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Stage 3 — Preparing Your Food</span>
                      {currentStage === 2 && (
                        <span className="bg-amber-100 text-amber-800 text-[9.5px] px-2 py-0.2 rounded-full font-bold">
                          Cooking in Progress 🔥
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {currentStage >= 2 ? formatTime(activeOrder.createdAt, t2) : `~${t2}s`}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Chef is grilling fresh patties, wood-firing artisanal crusts, and packing with insulated warmth.
                  </p>
                </div>
              </div>

              {/* STAGE 4: Delivery Partner Assigned / Out for Delivery */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStage < 3 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-7 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-xs font-bold ${
                    currentStage >= 3
                      ? currentStage === 3
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-emerald-500 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStage > 3 ? '✓' : <Bike className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Stage 4 — Delivery Partner Assigned • Out for Delivery</span>
                      {currentStage === 3 && (
                        <span className="bg-blue-100 text-blue-800 text-[9.5px] px-2 py-0.2 rounded-full font-bold">
                          En Route 🛵
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {currentStage >= 3 ? formatTime(activeOrder.createdAt, t3) : `~${t3}s`}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Your order has been handed over to the simulated delivery partner Rahul Verma on EV Express.
                  </p>
                </div>
              </div>

              {/* STAGE 5: Delivered Hot & Fresh */}
              <div
                className={`relative flex items-start gap-3 ${
                  currentStage < 4 ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`absolute -left-7 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs text-xs font-bold ${
                    currentStage === 4
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStage === 4 ? '✓' : <PackageCheck className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Stage 5 — Delivered Hot & Fresh</span>
                      {currentStage === 4 && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9.5px] px-2 py-0.2 rounded-full font-bold">
                          Completed 🎉
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {currentStage === 4 ? formatTime(activeOrder.createdAt, t4) : `~${t4}s`}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Simulated delivery complete. We hope you enjoyed this live demo experience!
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Partner Card (Active in Stage 4 & 5) */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
                    🛵
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900">
                        {DEMO_RIDER_INFO.name}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {DEMO_RIDER_INFO.rating}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-neutral-500 block">
                      {DEMO_RIDER_INFO.vehicle}
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">
                      Phone: {DEMO_RIDER_INFO.phone} ({DEMO_RIDER_INFO.phoneLabel})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      showToast(
                        `Simulated Call: Connecting to demo partner Rahul Verma (${DEMO_RIDER_INFO.phone})...`,
                        'info'
                      )
                    }
                    className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition cursor-pointer shadow-xs"
                    title="Simulate Call Partner"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      showToast(
                        `Simulated Chat: "Rahul is arriving at your gate shortly with insulated food."`,
                        'info'
                      )
                    }
                    className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 transition cursor-pointer shadow-xs"
                    title="Simulate Rider Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items & Summary */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
                <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                  Order Breakdown ({activeOrder.items.length} items)
                </span>
                <span className="font-mono text-neutral-500 text-[11px]">
                  Placed: {formatDate(activeOrder.createdAt)} at {formatTime(activeOrder.createdAt)}
                </span>
              </div>

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
                <span>Total Order Value (Demo):</span>
                <span className="text-amber-600 font-mono text-sm">₹{activeOrder.total}</span>
              </div>
            </div>

            {/* Delivery Address Details */}
            <div className="flex items-start gap-2.5 text-xs text-neutral-600 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900">Delivery Address:</span>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  {activeOrder.address.addressLine}, {activeOrder.address.city} - {activeOrder.address.pincode}
                </p>
                {activeOrder.address.instructions && (
                  <p className="text-[10.5px] text-amber-800 italic mt-0.5">
                    Note: &ldquo;{activeOrder.address.instructions}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-neutral-500">
            TastyBites Simulated Demo Tracking • Deterministic Session Persistence
          </span>
          <button
            onClick={() => showToast('TastyBites Demo Support Line: 24/7 Simulator active.', 'info')}
            className="text-amber-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Live Support</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
