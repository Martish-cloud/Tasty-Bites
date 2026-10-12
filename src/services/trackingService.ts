import type { Order, OrderStatus } from './db';
import { updateDBOrderStatus } from './db';

export const DEMO_TRACKING_CONFIG = {
  // Stage 1: Order Confirmed (immediate: 0 to 8s)
  stage1DurationSec: 8,
  // Stage 2: Restaurant Accepted (8s to 23s)
  stage2DurationSec: 15,
  // Stage 3: Preparing Your Food (23s to 43s)
  stage3DurationSec: 20,
  // Stage 4: Delivery Partner Assigned & Out for Delivery (43s to 68s)
  stage4DurationSec: 25,
  // Stage 5: Delivered Hot & Fresh (elapsed >= 68s)
};

export const DEMO_RIDER_INFO = {
  name: 'TastyBItes Partner',
  role: 'Partner',
  rating: '★ 4.3',
  deliveries: '1,420+ completed',
  vehicle: 'Eco EV Express • Thermal Insulated Bag',
  phone: '+91 98000 00000',
};

export interface ComputedTrackingState {
  status: OrderStatus;
  stageIndex: number; // 0 to 4
  stageName: string;
  stageDescription: string;
  elapsedSeconds: number;
  secondsRemainingInStage: number;
  isDelivered: boolean;
}

export function computeTrackingState(createdAt: string): ComputedTrackingState {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  );

  const t1 = DEMO_TRACKING_CONFIG.stage1DurationSec; // 8
  const t2 = t1 + DEMO_TRACKING_CONFIG.stage2DurationSec; // 23
  const t3 = t2 + DEMO_TRACKING_CONFIG.stage3DurationSec; // 43
  const t4 = t3 + DEMO_TRACKING_CONFIG.stage4DurationSec; // 68

  if (elapsedSeconds < t1) {
    return {
      status: 'placed',
      stageIndex: 0,
      stageName: 'Order Confirmed',
      stageDescription: 'Demo order confirmed — no real payment was processed.',
      elapsedSeconds,
      secondsRemainingInStage: t1 - elapsedSeconds,
      isDelivered: false,
    };
  } else if (elapsedSeconds < t2) {
    return {
      status: 'accepted',
      stageIndex: 1,
      stageName: 'Restaurant Accepted',
      stageDescription: 'TastyBItes head chef accepted order slip & allocated kitchen workstation.',
      elapsedSeconds,
      secondsRemainingInStage: t2 - elapsedSeconds,
      isDelivered: false,
    };
  } else if (elapsedSeconds < t3) {
    return {
      status: 'preparing',
      stageIndex: 2,
      stageName: 'Preparing Your Food',
      stageDescription: 'Executive chef is grilling fresh patties, wood-firing crusts, and packing warm.',
      elapsedSeconds,
      secondsRemainingInStage: t3 - elapsedSeconds,
      isDelivered: false,
    };
  } else if (elapsedSeconds < t4) {
    return {
      status: 'out_for_delivery',
      stageIndex: 3,
      stageName: 'Delivery Partner Assigned • Out for Delivery',
      stageDescription: 'TastyBItes delivery partner has collected the insulated thermal bag.',
      elapsedSeconds,
      secondsRemainingInStage: t4 - elapsedSeconds,
      isDelivered: false,
    };
  } else {
    return {
      status: 'delivered',
      stageIndex: 4,
      stageName: 'Delivered Hot & Fresh',
      stageDescription: 'Delivered successfully! This was an automated simulated delivery demo.',
      elapsedSeconds,
      secondsRemainingInStage: 0,
      isDelivered: true,
    };
  }
}

/**
 * Synchronizes an order's persisted database status with its elapsed time.
 * If the computed stage is ahead of order.orderStatus, persists the new stage.
 */
export function syncOrderStageWithPersistence(order: Order): Order {
  if (order.orderStatus === 'cancelled') return order;

  const computed = computeTrackingState(order.createdAt);
  const statusRank: Record<OrderStatus, number> = {
    pending_payment: -1,
    placed: 0,
    accepted: 1,
    preparing: 2,
    ready_for_pickup: 3,
    out_for_delivery: 3,
    delivered: 4,
    cancelled: -2,
  };

  const currentRank = statusRank[order.orderStatus] ?? 0;
  const computedRank = computed.stageIndex;

  if (computedRank > currentRank) {
    const res = updateDBOrderStatus(
      order.id,
      computed.status,
      computed.stageDescription,
      'Automated Demo Tracker'
    );
    if (res.success && res.order) {
      return res.order;
    }
  }

  return order;
}
