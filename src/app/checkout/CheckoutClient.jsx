'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, Check, MapPin, Loader2, ShoppingBag, ShieldCheck, Truck, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCart, clearCart } from '../../lib/cart';
import { submitStructuredCheckout, checkEmailExists } from '../../lib/api';
import { getAuthUser, isAuthenticated } from '../../lib/auth';
import CheckoutLoginModal from './LoginModal';

const PAKISTAN_STATES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu and Kashmir",
  "Gilgit-Baltistan"
];

const PAKISTAN_CITIES = {
  "Punjab": ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang", "Rahim Yar Khan", "Gujrat", "Kasur", "Sahiwal", "Okara", "Wah Cantonment", "Dera Ghazi Khan", "Mirpur Khas", "Chiniot", "Kamoke", "Mandi Bahauddin", "Toba Tek Singh", "Muzaffargarh", "Hafizabad", "Jhelum", "Khanewal", "Khushab", "Attock", "Layyah", "Bhakkar", "Chakwal", "Lodhran", "Mianwali", "Narowal", "Pakpattan", "Rajanpur", "Vehari"],
  "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Kotri", "Mirpur Khas", "Shikarpur", "Jacobabad", "Khairpur", "Dadu", "Tando Adam", "Tando Allahyar", "Umerkot", "Badin", "Ghotki", "Kashmore", "Matiari", "Naushahro Feroze", "Sanghar", "Sujawal", "Thatta"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Mingora", "Kohat", "Abbottabad", "Dera Ismail Khan", "Nowshera", "Charsadda", "Swabi", "Mansehra", "Swat", "Haripur", "Bannu", "Batkhela", "Chitral", "Dir", "Hangu", "Karak", "Lakki Marwat", "Malakand", "Shangla", "Tank", "Timergara"],
  "Balochistan": ["Quetta", "Turbat", "Khuzdar", "Hub", "Chaman", "Gwadar", "Sibi", "Zhob", "Loralai", "Kalat", "Mastung", "Nushki", "Pishin", "Qila Abdullah", "Qila Saifullah"],
  "Islamabad Capital Territory": ["Islamabad"],
  "Azad Jammu and Kashmir": ["Muzaffarabad", "Mirpur", "Bhimber", "Kotli", "Rawalakot", "Bagh", "Pallandri", "Hattian Bala", "Haveli", "Neelum"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu", "Chilas", "Ghanche", "Ghizer", "Astore", "Hunza", "Nagar", "Shigar", "Kharmang"]
};

// Searchable Dropdown for Cities & Provinces
const SearchableSelect = ({ options = [], value, onChange, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 flex justify-between items-center cursor-pointer transition ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-100 focus-within:border-black'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900 font-medium text-sm" : "text-gray-400 text-sm"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-black"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  className={`px-4 py-2.5 text-xs cursor-pointer hover:bg-yellow-50 hover:text-black transition ${value === opt ? 'bg-yellow-100/60 font-bold text-black' : 'text-gray-700'}`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-xs text-gray-400">
                No matching location found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CheckoutClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  // Inline Checkout Login Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalEmail, setLoginModalEmail] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: 'Punjab',
    city: 'Lahore',
    address: '',
    instruction: ''
  });

  const refreshCart = useCallback(() => {
    const cart = getCart();
    setCartItems(cart);
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshCart();

    const user = getAuthUser();
    if (user) {
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        state: user.state || prev.state,
      }));
    }

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('savedAddresses');
        if (saved) setSavedAddresses(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved addresses:', e);
      }
    }

    const handleAuthChange = () => {
      const updatedUser = getAuthUser();
      setCurrentUser(updatedUser);
      refreshCart();
    };

    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('cart-updated', refreshCart);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('cart-updated', refreshCart);
    };
  }, [refreshCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleStateChange = (state) => {
    const availableCities = PAKISTAN_CITIES[state] || [];
    setFormData(prev => ({
      ...prev,
      state: state,
      city: availableCities[0] || ''
    }));
  };

  const handleCityChange = (city) => {
    setFormData(prev => ({ ...prev, city: city }));
  };

  const handleAutoFill = (address) => {
    setFormData({
      name: address.name || '',
      email: address.email || '',
      phone: address.phone || '',
      state: address.state || 'Punjab',
      city: address.city || 'Lahore',
      address: address.address || '',
      instruction: address.instruction || ''
    });
    setShowSavedAddresses(false);
    toast.info("Auto-filled saved address");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.priceNum || 0) * (item.quantity || 1),
    0
  );
  const shipping = 0; // Free delivery all across Pakistan
  const estimatedTotal = subtotal + shipping;

  /**
   * Final Order Execution Logic
   */
  const executeOrderPlacement = async (targetFormData = formData) => {
    setIsSubmitting(true);
    setFormErrors({});

    const currentCart = getCart();
    if (currentCart.length === 0) {
      toast.error("Your cart is empty.");
      setIsSubmitting(false);
      router.push('/cart');
      return;
    }

    // Map cart items into authoritative M17 Structured Checkout payload
    const structuredItems = currentCart.map((item) => {
      const rawUuid = item.product_uuid || item.productId || item.uuid;
      const sizeId = Number(item.size_id) > 0 ? Number(item.size_id) : 1;
      const colorId = Number(item.garment_color_id) > 0 ? Number(item.garment_color_id) : 1;
      const qty = Math.max(1, Math.min(99, Number(item.quantity) || 1));

      return {
        product_uuid: String(rawUuid),
        size_id: sizeId,
        garment_color_id: colorId,
        quantity: qty
      };
    });

    const payload = {
      customer: {
        name: targetFormData.name.trim(),
        email: targetFormData.email.trim() || null,
        phone: targetFormData.phone.trim(),
        address: targetFormData.address.trim(),
        city: targetFormData.city.trim(),
        state: targetFormData.state?.trim() || null,
        instruction: targetFormData.instruction.trim() || null
      },
      items: structuredItems
    };

    try {
      const response = await submitStructuredCheckout(payload);
      const orderData = response?.data || response;

      // Handle Saved Address
      if (saveAddress && typeof window !== 'undefined') {
        const newAddress = {
          id: Date.now(),
          name: targetFormData.name,
          email: targetFormData.email,
          phone: targetFormData.phone,
          state: targetFormData.state,
          city: targetFormData.city,
          address: targetFormData.address
        };
        const existingAddresses = [...savedAddresses];
        const isDuplicate = existingAddresses.some(
          addr => addr.phone === newAddress.phone && addr.address === newAddress.address
        );
        if (!isDuplicate) {
          const updated = [newAddress, ...existingAddresses];
          setSavedAddresses(updated);
          localStorage.setItem('savedAddresses', JSON.stringify(updated));
        }
      }

      // Clear local cart strictly AFTER backend order creation success
      clearCart();

      const orderNumber = orderData.order_number || orderData.id || 'CONFIRMED';
      toast.success(`Order #${orderNumber} placed successfully!`);

      // Redirect to Order Success page
      router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
    } catch (err) {
      console.error('Structured Checkout Error:', err);

      if (err.status === 422 && err.data?.errors) {
        setFormErrors(err.data.errors);
        const firstKey = Object.keys(err.data.errors)[0];
        const firstMsg = Array.isArray(err.data.errors[firstKey])
          ? err.data.errors[firstKey][0]
          : err.data.errors[firstKey];
        toast.error(firstMsg || "Validation error occurred.");
      } else if (err.status === 429) {
        toast.error("Too many checkout attempts. Please wait a minute and try again.");
      } else {
        toast.error(err.message || "Failed to place order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle checkout form submission with inline account check
   */
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      router.push('/cart');
      return;
    }

    // Client-side quick validation
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Delivery address is required";
    if (!formData.city.trim()) errors.city = "City is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if entered email belongs to a registered customer when not logged in
    const emailToTest = formData.email.trim();
    if (!isAuthenticated() && emailToTest) {
      setIsSubmitting(true);
      try {
        const checkRes = await checkEmailExists(emailToTest);
        if (checkRes?.exists) {
          setIsSubmitting(false);
          setLoginModalEmail(emailToTest);
          setLoginModalOpen(true);
          return;
        }
      } catch (err) {
        console.warn('Email check error, proceeding with standard checkout:', err);
      } finally {
        setIsSubmitting(false);
      }
    }

    // Proceed with checkout placement
    await executeOrderPlacement(formData);
  };

  /**
   * Inline Login Callback from Modal
   */
  const handleInlineLoginSuccess = async (loggedInUser) => {
    setCurrentUser(loggedInUser);
    const updatedForm = {
      ...formData,
      name: formData.name || loggedInUser.name || '',
      email: loggedInUser.email || formData.email,
      phone: formData.phone || loggedInUser.phone || '',
      address: formData.address || loggedInUser.address || '',
      city: formData.city || loggedInUser.city || 'Lahore',
      state: formData.state || loggedInUser.state || 'Punjab',
    };
    setFormData(updatedForm);

    // Refresh cart items that might have merged
    refreshCart();

    // Automatically submit order after successful inline login
    await executeOrderPlacement(updatedForm);
  };

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-black mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 text-sm mb-6">Add some products to your cart before proceeding to checkout.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Inline Checkout Login Modal */}
      <CheckoutLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        email={loginModalEmail}
        onLoginSuccess={handleInlineLoginSuccess}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-black transition">Cart</Link>
          <span>/</span>
          <span className="text-black font-bold">Checkout</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600">Secure Direct Checkout</span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">
              Shipping & Payment
            </h1>
          </div>

          {currentUser ? (
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 px-4 py-2 rounded-xl text-xs font-bold">
              <UserCheck size={16} />
              <span>Ordering as Member: {currentUser.name}</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              Checking out as Guest • Optional account creation available
            </div>
          )}
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer & Shipping Form (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Saved Addresses Pill */}
              {savedAddresses.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                      <MapPin size={16} /> Saved Delivery Addresses
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                      className="text-xs font-bold text-yellow-600 hover:text-black transition uppercase"
                    >
                      {showSavedAddresses ? "Hide" : `Use Saved (${savedAddresses.length})`}
                    </button>
                  </div>

                  {showSavedAddresses && (
                    <div className="grid sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleAutoFill(addr)}
                          className="p-3.5 border border-gray-200 rounded-xl hover:border-black hover:bg-yellow-50/40 cursor-pointer transition text-left"
                        >
                          <p className="font-bold text-xs text-black">{addr.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{addr.address}, {addr.city}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black pb-3 border-b border-gray-100">
                  1. Contact Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Bilal Ahmed"
                      className={`w-full bg-gray-50 border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black ${formErrors.name ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                      required
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 0300 1234567"
                      className={`w-full bg-gray-50 border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black ${formErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                      required
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Email Address <span className="text-gray-400 font-normal lowercase">(for order tracking & receipts)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. yourname@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black pb-3 border-b border-gray-100">
                  2. Shipping Address
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Province / Territory *
                    </label>
                    <SearchableSelect
                      options={PAKISTAN_STATES}
                      value={formData.state}
                      onChange={handleStateChange}
                      placeholder="Select Province"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      City *
                    </label>
                    <SearchableSelect
                      options={PAKISTAN_CITIES[formData.state] || []}
                      value={formData.city}
                      onChange={handleCityChange}
                      placeholder="Select City"
                    />
                    {formErrors.city && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.city}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Street Address & House / Apartment *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="House / Flat #, Street, Sector, Area or Landmark"
                    className={`w-full bg-gray-50 border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black ${formErrors.address ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                    required
                  ></textarea>
                  {formErrors.address && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Delivery Instructions <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="instruction"
                    value={formData.instruction}
                    onChange={handleInputChange}
                    placeholder="e.g. Call upon arrival, leave at gate"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span>Save this address for future purchases</span>
                  </label>
                </div>
              </div>

              {/* Payment Option Notice */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">Payment Method</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Cash on Delivery (COD) across Pakistan</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                  COD Available
                </span>
              </div>
            </div>

            {/* Order Summary Column (1 Col) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm sticky top-28">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black pb-4 border-b border-gray-100">
                  Order Summary ({cartItems.length} items)
                </h2>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 my-4">
                  {cartItems.map((item) => (
                    <div key={item.key} className="py-3 flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
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
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-black truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {item.color} • {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-black text-black">
                        PKR {((item.priceNum || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing summary */}
                <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-black uppercase">Estimated Total</span>
                    <span className="text-2xl font-black text-black">
                      PKR {estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    *Final price & availability verified by backend engine.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 mt-6 text-xs font-bold uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-yellow-500 hover:text-black hover:shadow-yellow-500/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying & Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-black" />
                    <span>Free Home Delivery All Over Pakistan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-black" />
                    <span>Authoritative 256-bit Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
