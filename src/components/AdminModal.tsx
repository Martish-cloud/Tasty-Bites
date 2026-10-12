import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Lock,
  FileText,
  DollarSign,
  ChevronRight,
  ChefHat,
  Bike,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getDBOrders,
  getDBProducts,
  getAdminMetrics,
  getAuditLogs,
  updateDBOrderStatus,
  saveDBProduct,
  deleteDBProduct,
  createDBOrder,
  type Order,
  type OrderStatus,
  type AuditLogItem,
} from '../services/db';
import type { Product, CategoryId } from '../types';
import { CATEGORIES } from '../data/products';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();

  // Authentication State (Default PIN: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab: 'overview' | 'orders' | 'products' | 'audit'
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'audit'>('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<ReturnType<typeof getAdminMetrics> | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<CategoryId | 'all'>('all');

  // Edit / Add Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    id: '',
    name: '',
    category: 'burgers',
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviews: '500',
    deliveryTime: '25 mins',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Freshly prepared signature delicacy.',
    isVeg: true,
  });

  // Selected Order for detail view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Reload data
  const loadData = () => {
    setOrders(getDBOrders());
    setProducts(getDBProducts());
    setMetrics(getAdminMetrics());
    setAuditLogs(getAuditLogs());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle PIN Unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
      showToast('Admin access authorized. Welcome Back!', 'success');
    } else {
      setPinError(true);
    }
  };

  // Status transition handler
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const res = updateDBOrderStatus(orderId, newStatus, note, 'Staff Admin');
    if (res.success && res.order) {
      showToast(`Order #${res.order.orderNumber} updated to ${newStatus}`, 'success');
      loadData();
      if (selectedOrder && selectedOrder.id === res.order.id) {
        setSelectedOrder(res.order);
      }
    } else {
      showToast(res.error || 'Failed to update order status', 'error');
    }
  };

  // Create demo test order
  const handleCreateMockOrder = () => {
    const res = createDBOrder({
      customer: {
        name: 'Demo Customer',
        phone: '+91 99887 76655',
        email: 'demo@tastybites.com',
      },
      address: {
        addressLine: 'Flat 302, Palm Meadows, Whitefield',
        city: 'Bengaluru',
        pincode: '560066',
        instructions: 'Call on arrival.',
      },
      items: [
        { productId: 'classic-burger', quantity: 2 },
        { productId: 'margherita-pizza', quantity: 1 },
      ],
      promoCode: 'TASTY50',
      paymentMethod: 'razorpay',
    });

    if (res.success && res.order) {
      showToast(`Generated Test Order #${res.order.orderNumber}!`, 'success');
      loadData();
      setSelectedOrder(res.order);
    }
  };

  // Save product edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      saveDBProduct(editingProduct);
      showToast(`Updated product "${editingProduct.name}"`, 'success');
      setEditingProduct(null);
      loadData();
    } else if (isAddingProduct && newProductForm.name) {
      const prodId =
        newProductForm.id?.trim() ||
        newProductForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(100 + Math.random() * 900);
      const productToAdd: Product = {
        id: prodId,
        name: newProductForm.name || 'Unnamed Dish',
        category: (newProductForm.category as CategoryId) || 'burgers',
        price: Number(newProductForm.price) || 149,
        originalPrice: Number(newProductForm.originalPrice) || 199,
        rating: Number(newProductForm.rating) || 4.8,
        reviews: newProductForm.reviews || '100',
        deliveryTime: newProductForm.deliveryTime || '20 mins',
        image:
          newProductForm.image ||
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        description: newProductForm.description || 'Delicious culinary meal freshly cooked.',
        isVeg: Boolean(newProductForm.isVeg),
      };
      saveDBProduct(productToAdd);
      showToast(`Added new product "${productToAdd.name}" to menu!`, 'success');
      setIsAddingProduct(false);
      loadData();
    }
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      deleteDBProduct(id);
      showToast(`Deleted "${name}"`, 'info');
      loadData();
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    const matchQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.includes(q);
    const matchStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchQuery && matchStatus;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    return productCategoryFilter === 'all' || p.category === productCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-[#121110] border border-neutral-800 rounded-3xl shadow-2xl text-neutral-200 z-10 flex flex-col h-[94vh] overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  TastyBites Store Administration
                </h2>
                <span className="text-[10px] bg-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Manage orders, update fulfillment statuses, adjust menu pricing, and monitor sales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-3xl text-center space-y-5 shadow-2xl">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Authorized Staff Access</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Enter master PIN to manage orders and kitchen operations.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter Authorized PIN"
                    className="w-full text-center tracking-widest text-lg font-mono py-3 px-4 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-[11px] text-red-400 mt-1.5 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Invalid security PIN. Access denied.</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm py-3 rounded-xl transition cursor-pointer shadow-md"
                >
                  Verify Access
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="bg-neutral-900/60 px-4 sm:px-6 py-2.5 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Overview & Metrics</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Menu Catalogue ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'audit'
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Audit Logs</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateMockOrder}
                  className="bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-neutral-700 transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Test Order</span>
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-neutral-500 hover:text-neutral-300 text-xs px-2 py-1 transition"
                  title="Lock Portal"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && metrics && (
                <div className="space-y-6">
                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
                      <div className="flex items-center justify-between text-neutral-400 mb-2">
                        <span className="text-xs font-medium">Gross Revenue</span>
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-black text-white">₹{metrics.grossSales}</div>
                      <p className="text-[11px] text-emerald-400 font-medium mt-1">Verified Paid Orders</p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
                      <div className="flex items-center justify-between text-neutral-400 mb-2">
                        <span className="text-xs font-medium">Total Orders</span>
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{metrics.totalOrders}</div>
                      <p className="text-[11px] text-neutral-400 mt-1">{metrics.completed} Completed</p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
                      <div className="flex items-center justify-between text-neutral-400 mb-2">
                        <span className="text-xs font-medium">Kitchen Preparing</span>
                        <ChefHat className="w-4 h-4 text-orange-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{metrics.inPreparation}</div>
                      <p className="text-[11px] text-orange-400 mt-1">Active Chef Workstations</p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
                      <div className="flex items-center justify-between text-neutral-400 mb-2">
                        <span className="text-xs font-medium">Out for Delivery</span>
                        <Bike className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{metrics.outForDelivery}</div>
                      <p className="text-[11px] text-blue-400 mt-1">On the Road with Riders</p>
                    </div>
                  </div>

                  {/* Active Orders Quick Feed */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Recent Active Orders</span>
                        <span className="text-xs bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded-full">
                          Live Feed
                        </span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-amber-400 hover:underline cursor-pointer"
                      >
                        View All Orders →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {orders.slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{order.orderNumber}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  order.orderStatus === 'delivered'
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : order.orderStatus === 'out_for_delivery'
                                    ? 'bg-blue-950 text-blue-400'
                                    : order.orderStatus === 'preparing'
                                    ? 'bg-amber-950 text-amber-400'
                                    : 'bg-neutral-800 text-neutral-300'
                                }`}
                              >
                                {order.orderStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="text-neutral-400 block mt-1">
                              {order.customer.name} ({order.customer.phone}) • {order.items.length} items • ₹{order.total}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {order.orderStatus === 'placed' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'accepted')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                              >
                                Accept Order
                              </button>
                            )}
                            {order.orderStatus === 'accepted' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'preparing')}
                                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                              >
                                Start Cooking
                              </button>
                            )}
                            {order.orderStatus === 'preparing' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                              >
                                Dispatch Rider
                              </button>
                            )}
                            {order.orderStatus === 'out_for_delivery' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                              >
                                Mark Delivered
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setActiveTab('orders');
                              }}
                              className="text-neutral-400 hover:text-white p-1.5 rounded hover:bg-neutral-800"
                              title="Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Filtered Orders List (7 cols) */}
                  <div className="lg:col-span-7 xl:col-span-7 space-y-4">
                    {/* Search & Filter Header */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search by Order #, Name, Phone..."
                          className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value as OrderStatus | 'all')}
                        className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
                      >
                        <option value="all">All Statuses</option>
                        <option value="placed">Placed</option>
                        <option value="accepted">Accepted</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Orders Cards */}
                    <div className="space-y-3 max-h-[62vh] overflow-y-auto pr-1">
                      {filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500 text-xs bg-neutral-900/50 rounded-2xl">
                          No matching orders found.
                        </div>
                      ) : (
                        filteredOrders.map((order) => {
                          const isSelected = selectedOrder?.id === order.id;
                          return (
                            <div
                              key={order.id}
                              onClick={() => setSelectedOrder(order)}
                              className={`p-4 rounded-2xl border transition cursor-pointer text-xs ${
                                isSelected
                                  ? 'bg-neutral-900 border-amber-500 shadow-lg'
                                  : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono font-bold text-white text-sm">
                                  {order.orderNumber}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    order.orderStatus === 'delivered'
                                      ? 'bg-emerald-950 text-emerald-400'
                                      : order.orderStatus === 'out_for_delivery'
                                      ? 'bg-blue-950 text-blue-400'
                                      : order.orderStatus === 'preparing'
                                      ? 'bg-amber-950 text-amber-400'
                                      : order.orderStatus === 'cancelled'
                                      ? 'bg-red-950 text-red-400'
                                      : 'bg-neutral-800 text-neutral-300'
                                  }`}
                                >
                                  {order.orderStatus.replace('_', ' ')}
                                </span>
                              </div>

                              <div className="text-neutral-400 space-y-1">
                                <p className="font-medium text-neutral-200">{order.customer.name} • {order.customer.phone}</p>
                                <p className="truncate">{order.address.addressLine}, {order.address.city}</p>
                                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px]">
                                  <span>{order.items.length} items ({order.paymentMethod.toUpperCase()})</span>
                                  <span className="font-bold text-amber-400 text-xs">₹{order.total}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Order Detail & Action Panel (5 cols) */}
                  <div className="lg:col-span-5 xl:col-span-5 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl text-xs space-y-4">
                    {selectedOrder ? (
                      <>
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-neutral-400">Order Inspection</span>
                            <h3 className="text-base font-bold text-white font-mono">{selectedOrder.orderNumber}</h3>
                          </div>
                          <span className="font-mono text-xs text-neutral-500">
                            {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-1 text-neutral-300">
                          <p className="font-bold text-white">{selectedOrder.customer.name}</p>
                          <p>{selectedOrder.customer.phone}</p>
                          <p className="text-neutral-400">{selectedOrder.address.addressLine}, {selectedOrder.address.city} - {selectedOrder.address.pincode}</p>
                          {selectedOrder.address.instructions && (
                            <p className="text-amber-400/90 italic">Note: &ldquo;{selectedOrder.address.instructions}&rdquo;</p>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 border-t border-b border-neutral-800 py-3">
                          <span className="font-bold text-neutral-400 uppercase text-[10px]">Purchased Items</span>
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-neutral-300">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-mono text-white font-semibold">₹{item.lineTotal}</span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-2 text-white font-bold text-sm">
                            <span>Total Payable:</span>
                            <span className="text-amber-400">₹{selectedOrder.total}</span>
                          </div>
                        </div>

                        {/* Fulfillment Status Actions */}
                        <div className="space-y-2">
                          <span className="font-bold text-neutral-400 uppercase text-[10px]">Update Fulfillment Status</span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder.id, 'accepted')}
                              className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 rounded-lg text-xs"
                            >
                              1. Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder.id, 'preparing')}
                              className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 rounded-lg text-xs"
                            >
                              2. Preparing
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder.id, 'out_for_delivery')}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-xs"
                            >
                              3. Out for Delivery
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-xs"
                            >
                              4. Mark Delivered
                            </button>
                          </div>

                          <button
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled', 'Cancelled by Admin')}
                            className="w-full text-red-400 hover:text-red-300 text-[11px] py-1 transition cursor-pointer"
                          >
                            Cancel Order & Mark Refund
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-16 text-center text-neutral-500">
                        Select an order from the list to inspect details and update status.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCTS & CATALOGUE */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
                      <button
                        onClick={() => setProductCategoryFilter('all')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                          productCategoryFilter === 'all' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        All Categories
                      </button>
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setProductCategoryFilter(c.id)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                            productCategoryFilter === c.id ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsAddingProduct(true)}
                      className="bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Dish</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal */}
                  {(isAddingProduct || editingProduct) && (
                    <div className="bg-neutral-900 border border-neutral-700 p-5 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-sm text-white">
                          {editingProduct ? `Edit Dish "${editingProduct.name}"` : 'Create New Menu Dish'}
                        </h4>
                        <button
                          onClick={() => {
                            setEditingProduct(null);
                            setIsAddingProduct(false);
                          }}
                          className="text-neutral-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-neutral-400 mb-1">Dish Name</label>
                          <input
                            type="text"
                            required
                            value={editingProduct ? editingProduct.name : newProductForm.name}
                            onChange={(e) =>
                              editingProduct
                                ? setEditingProduct({ ...editingProduct, name: e.target.value })
                                : setNewProductForm({ ...newProductForm, name: e.target.value })
                            }
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1">Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={editingProduct ? editingProduct.price : newProductForm.price}
                            onChange={(e) =>
                              editingProduct
                                ? setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                                : setNewProductForm({ ...newProductForm, price: Number(e.target.value) })
                            }
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1">Category</label>
                          <select
                            value={editingProduct ? editingProduct.category : newProductForm.category}
                            onChange={(e) =>
                              editingProduct
                                ? setEditingProduct({ ...editingProduct, category: e.target.value as CategoryId })
                                : setNewProductForm({ ...newProductForm, category: e.target.value as CategoryId })
                            }
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-neutral-400 mb-1">Description</label>
                          <input
                            type="text"
                            value={editingProduct ? editingProduct.description : newProductForm.description}
                            onChange={(e) =>
                              editingProduct
                                ? setEditingProduct({ ...editingProduct, description: e.target.value })
                                : setNewProductForm({ ...newProductForm, description: e.target.value })
                            }
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
                          />
                        </div>

                        <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(null);
                              setIsAddingProduct(false);
                            }}
                            className="bg-neutral-800 text-neutral-300 px-4 py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button type="submit" className="bg-amber-500 text-neutral-950 font-bold px-5 py-2 rounded-lg">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col justify-between text-xs"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-white truncate">{p.name}</h5>
                            <span className="text-[10px] text-amber-400 font-mono font-bold">₹{p.price}</span>
                          </div>
                        </div>

                        <p className="text-neutral-400 line-clamp-1 mb-3 text-[11px]">{p.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-white">System & Administrative Audit Trail</h3>
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-400 font-bold uppercase text-[10px]">
                              {log.action}
                            </span>
                            <span className="text-neutral-300">{log.details}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 mt-0.5 block">
                            By {log.performedBy} • {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
