import type { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

export type OrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'demo_confirmed';

export type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'cod';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
  lineTotal: number;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
}

export interface DeliveryAddress {
  addressLine: string;
  locality?: string;
  city: string;
  pincode: string;
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingToken: string;
  customer: CustomerInfo;
  address: DeliveryAddress;
  items: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  promoCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  orderStatus: OrderStatus;
  estimatedDeliveryMinutes: number;
  statusHistory: StatusHistoryItem[];
  isDemoOrder?: boolean;
  riderInfo?: {
    name: string;
    phone: string;
    rating: string;
    vehicle: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

// Storage keys
const PRODUCTS_KEY = 'tastybites_db_products';
const ORDERS_KEY = 'tastybites_db_orders';
const AUDIT_KEY = 'tastybites_db_audit';

// Pre-seeded sample active order so order tracking works immediately
const INITIAL_ORDERS: Order[] = [
  {
    id: 'tb-order-seed-1',
    orderNumber: 'TB-842910',
    trackingToken: 'tk_981a7b2e4f01',
    customer: {
      name: 'Aditya Sharma',
      phone: '+91 98765 43210',
      email: 'aditya.sharma@example.com',
    },
    address: {
      addressLine: '102, Green Glen Heights, Outer Ring Road',
      locality: 'Bellandur',
      city: 'Bengaluru',
      pincode: '560103',
      instructions: 'Leave at front reception desk or call on arrival.',
    },
    items: [
      {
        productId: 'classic-burger',
        name: 'Classic Gourmet Burger',
        price: 149,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        lineTotal: 298,
      },
      {
        productId: 'margherita-pizza',
        name: 'Woodfired Margherita Pizza',
        price: 299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        lineTotal: 299,
      },
    ],
    subtotal: 597,
    discount: 50,
    deliveryFee: 0,
    tax: 30,
    total: 577,
    promoCode: 'TASTY50',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    paymentId: 'pay_RPZ8492019482',
    orderStatus: 'out_for_delivery',
    estimatedDeliveryMinutes: 18,
    statusHistory: [
      {
        status: 'placed',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        note: 'Order placed & payment verified via Razorpay UPI.',
        updatedBy: 'System Gateway',
      },
      {
        status: 'accepted',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        note: 'Restaurant kitchen accepted order.',
        updatedBy: 'Kitchen Manager',
      },
      {
        status: 'preparing',
        timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
        note: 'Chef is baking fresh sourdough pizza & grilling burger.',
        updatedBy: 'Head Chef',
      },
      {
        status: 'out_for_delivery',
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        note: 'Rider Rahul Verma (+91 98450 11223) picked up order on EV Bike.',
        updatedBy: 'Dispatch System',
      },
    ],
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 'tb-order-seed-2',
    orderNumber: 'TB-731945',
    trackingToken: 'tk_318f6c9d2a84',
    customer: {
      name: 'Pooja Nair',
      phone: '+91 91234 56789',
      email: 'pooja.nair@example.com',
    },
    address: {
      addressLine: '404, Maple Woods Luxury Apts',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
    },
    items: [
      {
        productId: 'pasta-alfredo',
        name: 'Creamy Pasta Alfredo',
        price: 249,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d62817ee?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        lineTotal: 249,
      },
    ],
    subtotal: 249,
    discount: 0,
    deliveryFee: 40,
    tax: 12,
    total: 301,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentId: 'pay_UPI817293041',
    orderStatus: 'delivered',
    estimatedDeliveryMinutes: 0,
    statusHistory: [
      {
        status: 'placed',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        note: 'Order placed & paid via UPI QR.',
        updatedBy: 'System Gateway',
      },
      {
        status: 'delivered',
        timestamp: new Date(Date.now() - 75 * 60000).toISOString(),
        note: 'Order handed over successfully to customer.',
        updatedBy: 'Rider Suresh',
      },
    ],
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 75 * 60000).toISOString(),
  },
];

// Helper: load from localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

// Helper: save to localStorage
function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// ==========================================
// Product Operations
// ==========================================

export function getDBProducts(): Product[] {
  const loaded = loadFromStorage<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
  const existingIds = new Set(loaded.map((p) => p.id));
  const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
  if (missing.length > 0) {
    const merged = [...missing, ...loaded];
    saveToStorage(PRODUCTS_KEY, merged);
    return merged;
  }
  return loaded;
}

export function getDBProductById(id: string): Product | undefined {
  const products = getDBProducts();
  return products.find((p) => p.id === id);
}

export function saveDBProduct(product: Product): Product {
  const products = getDBProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  let updated: Product[];

  if (idx >= 0) {
    updated = [...products];
    updated[idx] = { ...product };
  } else {
    updated = [product, ...products];
  }

  saveToStorage(PRODUCTS_KEY, updated);
  addAuditLog('product_saved', `Product "${product.name}" (ID: ${product.id}) updated/created`, 'Admin');
  return product;
}

export function deleteDBProduct(id: string): boolean {
  const products = getDBProducts();
  const target = products.find((p) => p.id === id);
  if (!target) return false;

  const filtered = products.filter((p) => p.id !== id);
  saveToStorage(PRODUCTS_KEY, filtered);
  addAuditLog('product_deleted', `Product "${target.name}" (ID: ${id}) removed from catalogue`, 'Admin');
  return true;
}

export function resetDBProducts(): void {
  saveToStorage(PRODUCTS_KEY, INITIAL_PRODUCTS);
  addAuditLog('products_reset', 'Menu catalogue reset to default factory data', 'Admin');
}

// ==========================================
// Order Operations
// ==========================================

export function getDBOrders(): Order[] {
  return loadFromStorage<Order[]>(ORDERS_KEY, INITIAL_ORDERS);
}

export function getDBOrderById(orderNumberOrId: string): Order | undefined {
  const clean = orderNumberOrId.trim().toUpperCase();
  const orders = getDBOrders();
  return orders.find(
    (o) => o.orderNumber.toUpperCase() === clean || o.id.toUpperCase() === clean
  );
}

export function getCustomerOrders(phoneOrEmail: string): Order[] {
  const query = phoneOrEmail.trim().toLowerCase();
  if (!query) return [];
  const orders = getDBOrders();
  return orders.filter(
    (o) =>
      o.customer.phone.toLowerCase().includes(query) ||
      (o.customer.email && o.customer.email.toLowerCase().includes(query))
  );
}

export interface CreateOrderParams {
  customer: CustomerInfo;
  address: DeliveryAddress;
  items: Array<{ productId: string; quantity: number }>;
  promoCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  isDemoOrder?: boolean;
}

export function createDBOrder(params: CreateOrderParams): { success: boolean; order?: Order; error?: string } {
  const allProducts = getDBProducts();
  if (!params.items || params.items.length === 0) {
    return { success: false, error: 'Cannot create order with an empty basket.' };
  }

  // Server-side authoritative price and item validation
  const itemSnapshots: OrderItemSnapshot[] = [];
  let subtotal = 0;

  for (const reqItem of params.items) {
    const prod = allProducts.find((p) => p.id === reqItem.productId);
    if (!prod) {
      return { success: false, error: `Product ID "${reqItem.productId}" is not available.` };
    }
    // Enforce 1-10 quantity limits
    const validQty = Math.min(10, Math.max(1, reqItem.quantity));
    const lineTotal = prod.price * validQty;
    subtotal += lineTotal;
    itemSnapshots.push({
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: validQty,
      image: prod.image,
      isVeg: Boolean(prod.isVeg),
      lineTotal,
    });
  }

  // Calculate discounts
  let discount = 0;
  if (params.promoCode) {
    const code = params.promoCode.trim().toUpperCase();
    if (code === 'TASTY50') {
      discount = Math.min(Math.round(subtotal * 0.5), 150);
    } else if (code === 'WELCOME100') {
      discount = subtotal >= 399 ? 100 : 0;
    } else if (code === 'BURGERLOVE') {
      discount = 75;
    }
  }

  // Delivery fee: ₹40, or free if >= 499 or FREEDEL
  const isFreeDelivery = subtotal >= 499 || params.promoCode === 'FREEDEL';
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 40;
  // Centralized tax calculation: 18% GST (Indian tax rate for restaurant supply)
  const tax = Math.round(subtotal * 0.18);
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  // Generate unique order ID and tracking token
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `TB-${randomSuffix}`;
  const orderId = `tb_${Date.now()}_${randomSuffix}`;
  const trackingToken = `tk_${Math.random().toString(36).substring(2, 12)}`;

  const now = new Date().toISOString();
  const isOnlinePayment = params.paymentMethod === 'razorpay' || params.paymentMethod === 'upi' || params.paymentMethod === 'card';
  const paymentStatus: PaymentStatus = params.paymentStatus 
    ? params.paymentStatus 
    : isOnlinePayment 
      ? 'paid' 
      : 'pending';

  const isDemo = params.isDemoOrder ?? true;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    trackingToken,
    customer: params.customer,
    address: params.address,
    items: itemSnapshots,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    promoCode: params.promoCode,
    paymentMethod: params.paymentMethod,
    paymentStatus,
    paymentId: params.paymentId || (isOnlinePayment && paymentStatus === 'paid' ? `pay_DEMO_${randomSuffix}` : undefined),
    orderStatus: 'placed',
    estimatedDeliveryMinutes: 25,
    isDemoOrder: isDemo,
    riderInfo: {
      name: 'Rahul Verma (Demo Partner)',
      phone: '+91 98000 00000',
      rating: '4.9',
      vehicle: 'Eco EV Express • Hot Thermal Bag',
    },
    statusHistory: [
      {
        status: 'placed',
        timestamp: now,
        note: isDemo
          ? `Demo order #${orderNumber} confirmed — no real payment was processed.`
          : `Order #${orderNumber} placed via ${params.paymentMethod.toUpperCase()} (${paymentStatus === 'paid' ? 'Payment Verified' : 'Payment on Delivery'}).`,
        updatedBy: 'Order System',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const orders = getDBOrders();
  saveToStorage(ORDERS_KEY, [newOrder, ...orders]);
  addAuditLog(
    'order_created',
    `New ${isDemo ? 'demo ' : ''}order #${orderNumber} created for ${params.customer.name} (₹${total})`,
    params.customer.name
  );

  return { success: true, order: newOrder };
}

export function getDBOrdersForCustomer(phoneOrEmail: string): Order[] {
  if (!phoneOrEmail) return [];
  const cleanTarget = phoneOrEmail.replace(/\D/g, '').slice(-10);
  const targetLower = phoneOrEmail.trim().toLowerCase();
  const allOrders = getDBOrders();

  return allOrders.filter((o) => {
    const custPhone = o.customer.phone.replace(/\D/g, '').slice(-10);
    const custEmail = (o.customer.email || '').toLowerCase();
    return (cleanTarget && custPhone === cleanTarget) || (targetLower && custEmail === targetLower);
  });
}

export function updateDBOrderStatus(
  orderNumberOrId: string,
  newStatus: OrderStatus,
  note?: string,
  staffName = 'Staff Admin'
): { success: boolean; order?: Order; error?: string } {
  const orders = getDBOrders();
  const idx = orders.findIndex(
    (o) =>
      o.orderNumber.toUpperCase() === orderNumberOrId.trim().toUpperCase() ||
      o.id === orderNumberOrId
  );

  if (idx < 0) {
    return { success: false, error: 'Order not found.' };
  }

  const order = orders[idx];
  const now = new Date().toISOString();

  // Dynamic ETA update
  let eta = order.estimatedDeliveryMinutes;
  if (newStatus === 'accepted') eta = 22;
  else if (newStatus === 'preparing') eta = 18;
  else if (newStatus === 'ready_for_pickup') eta = 14;
  else if (newStatus === 'out_for_delivery') eta = 8;
  else if (newStatus === 'delivered' || newStatus === 'cancelled') eta = 0;

  const defaultNoteMap: Record<OrderStatus, string> = {
    pending_payment: 'Awaiting customer payment verification.',
    placed: 'Order placed by customer.',
    accepted: 'Kitchen confirmed order and assigned workstation.',
    preparing: 'Chef is cooking gourmet food with fresh ingredients.',
    ready_for_pickup: 'Food packed hot with security seal; awaiting rider.',
    out_for_delivery: 'Rider is en route to customer doorstep.',
    delivered: 'Order safely delivered. Bon appétit!',
    cancelled: 'Order has been cancelled.',
  };

  const statusNote = note || defaultNoteMap[newStatus];

  const updatedOrder: Order = {
    ...order,
    orderStatus: newStatus,
    estimatedDeliveryMinutes: eta,
    statusHistory: [
      ...order.statusHistory,
      {
        status: newStatus,
        timestamp: now,
        note: statusNote,
        updatedBy: staffName,
      },
    ],
    updatedAt: now,
  };

  orders[idx] = updatedOrder;
  saveToStorage(ORDERS_KEY, orders);
  addAuditLog(
    'order_status_updated',
    `Order #${order.orderNumber} status changed to "${newStatus}"`,
    staffName
  );

  return { success: true, order: updatedOrder };
}

export function cancelDBOrder(
  orderNumberOrId: string,
  reason: string,
  staffName = 'Admin'
): { success: boolean; order?: Order; error?: string } {
  return updateDBOrderStatus(orderNumberOrId, 'cancelled', `Cancellation reason: ${reason}`, staffName);
}

// ==========================================
// Admin Metrics & Audit
// ==========================================

export function getAdminMetrics() {
  const orders = getDBOrders();
  const products = getDBProducts();

  const totalOrders = orders.length;
  const grossSales = orders
    .filter((o) => o.paymentStatus === 'paid' && o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingAcceptance = orders.filter((o) => o.orderStatus === 'placed').length;
  const inPreparation = orders.filter((o) => o.orderStatus === 'preparing' || o.orderStatus === 'accepted').length;
  const outForDelivery = orders.filter((o) => o.orderStatus === 'out_for_delivery' || o.orderStatus === 'ready_for_pickup').length;
  const completed = orders.filter((o) => o.orderStatus === 'delivered').length;
  const cancelled = orders.filter((o) => o.orderStatus === 'cancelled').length;

  return {
    totalOrders,
    grossSales,
    pendingAcceptance,
    inPreparation,
    outForDelivery,
    completed,
    cancelled,
    totalProducts: products.length,
  };
}

export function getAuditLogs(): AuditLogItem[] {
  return loadFromStorage<AuditLogItem[]>(AUDIT_KEY, [
    {
      id: 'log-seed-1',
      action: 'system_initialized',
      details: 'TastyBites E-commerce platform online with Razorpay Gateway & Live Tracking.',
      performedBy: 'System',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);
}

export function addAuditLog(action: string, details: string, performedBy: string): void {
  const current = getAuditLogs();
  const newLog: AuditLogItem = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    details,
    performedBy,
    timestamp: new Date().toISOString(),
  };
  saveToStorage(AUDIT_KEY, [newLog, ...current.slice(0, 49)]); // keep latest 50
}

// ==========================================
// Customer Reviews & Ratings System
// ==========================================

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  orderNumber?: string;
  isSample?: boolean;
  createdAt: string;
}

export interface CreateReviewParams {
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  orderNumber?: string;
}

const REVIEWS_KEY = 'tastybites_db_reviews';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-sample-1',
    name: 'Pooja Mehra',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'The Taco Chicken Mexican is ridiculously fresh! Crispy shells, perfectly charred chicken, and chipotle crema with just the right kick. Delivered hot in 20 minutes.',
    date: '2 days ago',
    isVerifiedPurchase: true,
    orderNumber: 'TB-842910',
    isSample: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rev-sample-2',
    name: 'Karan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'The Classic Burger & Fries combo is the best value in town. Brioche bun was fluffy, patty was juicy, and thermal packaging kept it warm. The live tracking demo is fantastic.',
    date: '3 days ago',
    isVerifiedPurchase: true,
    orderNumber: 'TB-620194',
    isSample: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'rev-sample-3',
    name: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    comment: 'Authentic Neapolitan Margherita Pizza. Loved the fresh basil and Fior di Latte mozzarella. Crust had lovely wood-fired leopard spots. Will definitely order again!',
    date: '5 days ago',
    isVerifiedPurchase: false,
    isSample: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rev-sample-4',
    name: 'Vikramaditya Roy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'The Dal Makhani reminds me of historic dhabas in Amritsar. Velvety texture, slow-simmered with white butter. Packed in leak-proof sealed containers.',
    date: '1 week ago',
    isVerifiedPurchase: true,
    orderNumber: 'TB-418823',
    isSample: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'rev-sample-5',
    name: 'Sneha Nambiar',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'Belgian Chocolate shake was perfection — pure dark cacao richness without artificial sweetness. Paired delightfully with the Truffle Mushroom Swiss Burger.',
    date: '1 week ago',
    isVerifiedPurchase: false,
    isSample: true,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'rev-sample-6',
    name: 'Rajesh Nair',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    comment: 'Quick express dispatch and clean eco packaging. The Kung Pao Chicken had genuine Sichuan peppers with bold aroma. Excellent restaurant-grade meal at home.',
    date: '2 weeks ago',
    isVerifiedPurchase: false,
    isSample: true,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

export function getDBReviews(): Review[] {
  return loadFromStorage<Review[]>(REVIEWS_KEY, INITIAL_REVIEWS);
}

export function createDBReview(params: CreateReviewParams): { success: boolean; review?: Review; error?: string } {
  const name = params.name.trim();
  if (!name || name.length < 2) {
    return { success: false, error: 'Please enter a valid display name (at least 2 characters).' };
  }

  const rating = Math.round(params.rating);
  if (rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be an integer between 1 and 5 stars.' };
  }

  const comment = params.comment.trim();
  if (!comment || comment.length < 10) {
    return { success: false, error: 'Please share at least 10 characters describing your experience.' };
  }

  // Derive purchase verification authentically from existing orders
  let isVerified = false;
  if (params.orderNumber && params.orderNumber.trim()) {
    const cleanNum = params.orderNumber.trim().toUpperCase();
    const existingOrder = getDBOrderById(cleanNum);
    if (existingOrder) {
      isVerified = true;
    }
  }

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=120&q=80',
  ];
  const chosenAvatar = params.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

  const now = new Date();
  const newReview: Review = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    avatar: chosenAvatar,
    rating,
    comment,
    date: 'Just now',
    isVerifiedPurchase: isVerified,
    orderNumber: params.orderNumber ? params.orderNumber.trim().toUpperCase() : undefined,
    isSample: false,
    createdAt: now.toISOString(),
  };

  const current = getDBReviews();
  const updated = [newReview, ...current];
  saveToStorage(REVIEWS_KEY, updated);

  addAuditLog(
    'review_submitted',
    `New review (${rating}★) posted by ${name}`,
    name
  );

  return { success: true, review: newReview };
}

export function getAverageRating(): { average: number; count: number } {
  const reviews = getDBReviews();
  if (reviews.length === 0) return { average: 5.0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / reviews.length) * 10) / 10;
  return { average: avg, count: reviews.length };
}

export function getRatingDistribution(): Record<number, number> {
  const reviews = getDBReviews();
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const clamped = Math.max(1, Math.min(5, Math.round(r.rating)));
    dist[clamped] = (dist[clamped] || 0) + 1;
  }
  return dist;
}

