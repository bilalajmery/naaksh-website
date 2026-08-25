'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Package,
  Calendar,
  Truck,
  ArrowRight,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getAuthUser, isAuthenticated, logoutCustomer, setAuthUser } from '../../lib/auth';
import {
  getCurrentUser,
  updateUserProfile,
  updateUserPassword,
  getCustomerOrders,
  getDbWishlist,
  removeDbWishlistItem
} from '../../lib/api';
import { addToCart } from '../../lib/cart';
import AuthModal from '../../components/AuthModal';

const PAKISTAN_STATES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu and Kashmir",
  "Gilgit-Baltistan"
];

export default function AccountClient() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses' | 'wishlist' | 'security'
  const [loading, setLoading] = useState(true);

  // Auth Modal state for unauthenticated visitors
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Punjab',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || 'Punjab',
      });
      setAuthUser(userData);
    } catch (err) {
      console.warn('Failed to load user profile:', err);
      if (err.status === 401) {
        logoutCustomer();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    if (!isAuthenticated()) return;
    setLoadingOrders(true);
    try {
      const res = await getCustomerOrders();
      setOrders(res?.data || []);
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated()) return;
    setLoadingWishlist(true);
    try {
      const res = await getDbWishlist();
      setWishlistItems(res?.data || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const cachedUser = getAuthUser();
    if (cachedUser) {
      setUser(cachedUser);
      setProfileData({
        name: cachedUser.name || '',
        email: cachedUser.email || '',
        phone: cachedUser.phone || '',
        address: cachedUser.address || '',
        city: cachedUser.city || '',
        state: cachedUser.state || 'Punjab',
      });
    }

    loadUserData();
    loadOrders();
    loadWishlist();

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('savedAddresses');
        if (saved) setSavedAddresses(JSON.parse(saved));
      } catch (e) {
        console.error('Error reading saved addresses:', e);
      }
    }

    const handleAuthChange = () => {
      const updated = getAuthUser();
      setUser(updated);
      if (updated) {
        loadUserData();
        loadOrders();
        loadWishlist();
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, [loadUserData, loadOrders, loadWishlist]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await updateUserProfile({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
      });
      setUser(res.user);
      setAuthUser(res.user);
      toast.success(res.message || 'Profile updated successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await updateUserPassword(passwordData);
      toast.success(res.message || 'Password updated successfully!');
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      toast.error(err.friendlyMessage || err.message || 'Failed to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logoutCustomer();
      setUser(null);
      toast.info('Signed out of your account.');
    }
  };

  const handleRemoveWishlist = async (uuid) => {
    try {
      await removeDbWishlistItem(uuid);
      setWishlistItems((prev) => prev.filter((item) => item.uuid !== uuid));
      toast.info('Item removed from wishlist.');
    } catch (err) {
      console.error('Failed to remove wishlist item:', err);
    }
  };

  const handleMoveToCart = (product) => {
    addToCart({
      product_uuid: product.uuid,
      name: product.name,
      slug: product.slug,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      quantity: 1,
    });
    toast.success(`${product.name} added to your cart!`);
  };

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  // ─── Unauthenticated Guest View ──────────────────────────────────────────
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            loadUserData();
            loadOrders();
            loadWishlist();
          }}
        />

        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center shadow-inner">
            <User size={36} />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-yellow-600">
            NAAKSH MEMBER ACCESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1 mb-3">
            Customer Dashboard
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Sign in to track your orders, manage saved shipping addresses, view your synchronized wishlist, and access exclusive member drops.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-500 hover:text-black transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => {
                setAuthModalMode('register');
                setAuthModalOpen(true);
              }}
              className="w-full py-3.5 bg-gray-100 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition"
            >
              Create New Account
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-black" />
              <span>Order Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart size={14} className="text-black" />
              <span>Wishlist Sync</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Authenticated Customer Dashboard ────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">My Account</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-black text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500 text-black font-black text-2xl flex items-center justify-center shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    {user?.name || 'Member'}
                  </h1>
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                    {user?.role === 'admin' ? 'Admin' : 'Verified Member'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                {user?.phone && <p className="text-[11px] text-gray-500 mt-0.5">{user.phone}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="px-5 py-2.5 bg-yellow-500 text-black font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-yellow-400 transition"
              >
                Shop Drops
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-gray-300 font-bold uppercase text-xs tracking-wider rounded-xl transition flex items-center gap-1.5 border border-white/10"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'orders'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={16} />
                  <span>My Orders</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'orders' ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-600'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'profile'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={16} />
                  <span>Profile Information</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-400'} />
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'wishlist'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart size={16} />
                  <span>Saved Wishlist</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'wishlist' ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-600'
                }`}>
                  {wishlistItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'addresses'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>Saved Addresses</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'addresses' ? 'text-yellow-400' : 'text-gray-400'} />
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'security'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock size={16} />
                  <span>Security & Password</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'security' ? 'text-yellow-400' : 'text-gray-400'} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h2 className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2">
                    <ShoppingBag size={20} /> Order History ({orders.length})
                  </h2>
                  <span className="text-xs text-gray-500">Live order status & tracking</span>
                </div>

                {loadingOrders ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-black mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Loading your orders...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center">
                      <Package size={32} />
                    </div>
                    <h3 className="text-lg font-black uppercase text-black">No Orders Found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      You have not placed any orders with this account yet. Explore our latest heavyweight drops!
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition shadow-lg"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id || order.order_number}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 transition hover:border-gray-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black uppercase text-black">
                                Order #{order.order_number}
                              </span>
                              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                order.status === 'completed' || order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status_label || order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                              <Calendar size={12} />
                              <span>Placed on {order.created_at_human || order.created_at}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Amount</span>
                            <span className="text-base font-black text-black">
                              {order.total_formatted || `PKR ${order.total?.toLocaleString()}`}
                            </span>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="py-4 divide-y divide-gray-50">
                          {(order.items_preview || []).map((item, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                  <img
                                    src={item.image || '/product-assets/placeholder.png'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/product-assets/placeholder.png';
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-black">{item.name}</p>
                                  <p className="text-[10px] text-gray-500">
                                    {item.color} • {item.size} • Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-gray-500 text-[11px] flex items-center gap-1.5">
                            <Truck size={14} className="text-black" />
                            <span>Cash on Delivery (COD)</span>
                          </span>

                          <Link
                            href={`/checkout/success?order=${encodeURIComponent(order.order_number)}`}
                            className="font-bold text-yellow-600 hover:text-black transition uppercase text-[11px] flex items-center gap-1"
                          >
                            <span>View Tracking & Receipt</span>
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-black uppercase tracking-tight text-black">
                    Personal Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your contact details and default shipping information.
                  </p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Email Address <span className="text-gray-400 lowercase">(read-only)</span>
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="e.g. 0300 1234567"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Province / Territory
                      </label>
                      <select
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        {PAKISTAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        placeholder="e.g. Lahore"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Default Delivery Address
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="House / Flat #, Street, Area"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-500 hover:text-black transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {profileSaving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Profile</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h2 className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2">
                    <Heart size={20} /> Synchronized Wishlist ({wishlistItems.length})
                  </h2>
                  <Link href="/wishlist" className="text-xs font-bold text-yellow-600 hover:text-black uppercase">
                    Full Wishlist Page &rarr;
                  </Link>
                </div>

                {loadingWishlist ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-black mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Loading wishlist items...
                    </p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center">
                      <Heart size={32} />
                    </div>
                    <h3 className="text-lg font-black uppercase text-black">Wishlist is Empty</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Save pieces from our catalog to view them across all your devices when logged in.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition shadow-lg"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.uuid}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={item.image || '/product-assets/placeholder.png'}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/product-assets/placeholder.png';
                            }}
                          />
                          <button
                            onClick={() => handleRemoveWishlist(item.uuid)}
                            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full shadow transition"
                            aria-label="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-bold text-xs uppercase text-black truncate">{item.name}</h3>
                            <p className="text-xs font-black text-black mt-0.5">{item.price}</p>
                          </div>

                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="w-full py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-500 hover:text-black transition flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag size={14} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-black">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fast 1-click checkout addresses saved across devices.
                    </p>
                  </div>
                </div>

                {savedAddresses.length === 0 && !profileData.address ? (
                  <div className="py-8 text-center text-gray-500 text-xs">
                    No additional saved addresses found. Complete your profile address or save an address during checkout!
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {profileData.address && (
                      <div className="p-4 rounded-2xl border-2 border-black bg-yellow-50/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded-md">
                            Primary Account Address
                          </span>
                        </div>
                        <p className="font-bold text-xs text-black">{profileData.name}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {profileData.address}, {profileData.city}, {profileData.state}
                        </p>
                        <p className="text-[11px] text-gray-500">{profileData.phone}</p>
                      </div>
                    )}

                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2 relative"
                      >
                        <p className="font-bold text-xs text-black">{addr.name}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {addr.address}, {addr.city}, {addr.state}
                        </p>
                        <p className="text-[11px] text-gray-500">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-black uppercase tracking-tight text-black">
                    Security & Password
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ensure your account is protected with a strong, secure password.
                  </p>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      New Password * (Min 8 Characters)
                    </label>
                    <input
                      type="password"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-500 hover:text-black transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {passwordSaving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
