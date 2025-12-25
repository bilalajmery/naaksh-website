// src/components/Navbar.js  (ya jahan bhi hai)

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, ChevronDown } from "lucide-react";

function Navbar({ categories, loadingCategories }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setCartItems(cart);
      setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
      setWishlistCount(wishlist.length);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 1000); // Poll for changes
    window.addEventListener("storage", updateCounts);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/blog", label: "Journal" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      {/* 11.11 SALE BAR */}
      <div className="hidden md:block relative z-[60] bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 text-black text-center py-1 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm md:text-base">
          <span>12.12 MEGA SALE IS LIVE NOW!</span>
          <span className="hidden sm:inline opacity-90">(Up to 50% OFF + Free Delivery Pakistan Wide)</span>
          <span>1 - 31 Dec</span>
          <NavLink to="/shop" className="underline font-bold">
            SHOP NOW
          </NavLink>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 bg-[#0d0d0d] ${scrolled
          ? "shadow-2xl border-b border-yellow-900/20"
          : ""
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="z-10">
              <img
                src="/logo/sm.png"
                alt="NAAKSH"
                className="h-14 md:h-16 w-auto drop-shadow-2xl hover:scale-105 transition"
              />
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-16">
              {/* Main Links */}
              {navItems.map((item, index) => (
                <>
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `text-sm font-bold tracking-widest uppercase transition-all ${isActive ? "text-yellow-400" : "text-gray-200 hover:text-yellow-400"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  {index === 0 && (
                    <div className="relative group">
                      <button
                        onMouseEnter={() => setIsShopDropdownOpen(true)}
                        onMouseLeave={() => setIsShopDropdownOpen(false)}
                        className="flex items-center gap-1 text-sm font-bold tracking-widest uppercase text-gray-200 hover:text-yellow-400 transition"
                      >
                        Categories <ChevronDown size={16} className="mt-0.5" />
                      </button>

                      {/* Dropdown */}
                      <div
                        onMouseEnter={() => setIsShopDropdownOpen(true)}
                        onMouseLeave={() => setIsShopDropdownOpen(false)}
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-black/95 backdrop-blur-xl border border-yellow-900/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isShopDropdownOpen && !loadingCategories && categories.length > 0
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-4"
                          }`}
                      >
                        {loadingCategories ? (
                          <div className="px-8 py-6 text-center text-gray-400">Loading...</div>
                        ) : categories.length === 0 ? (
                          <div className="px-8 py-6 text-center text-gray-400">No categories</div>
                        ) : (
                          categories.map((cat) => (
                            <NavLink
                              key={cat.slug}
                              to={`/shop?category=${cat.name}`}
                              className="block px-8 py-4 text-sm font-medium text-gray-300 hover:bg-yellow-500 hover:text-black transition"
                              onClick={() => setIsShopDropdownOpen(false)}
                            >
                              {cat.name}
                            </NavLink>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <NavLink
                to="/wishlist"
                className="p-2 md:p-3 border-2 border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition group relative"
              >
                <Heart className="w-5 h-5 group-hover:fill-current" strokeWidth={2.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>
              {/* Cart Button with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => cartCount > 0 && setIsCartDropdownOpen(true)}
                onMouseLeave={() => setIsCartDropdownOpen(false)}
              >
                <NavLink
                  to="/cart"
                  className="p-2 md:p-3 border-2 border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition group relative flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:fill-current" strokeWidth={2.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                      {cartCount}
                    </span>
                  )}
                </NavLink>

                {/* Cart Dropdown - Hidden on Mobile to prevent UI issues */}
                <div
                  className={`hidden md:block absolute top-full right-0 mt-4 w-80 bg-black/95 backdrop-blur-xl border border-yellow-900/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right ${isCartDropdownOpen
                    ? "opacity-100 visible scale-100"
                    : "opacity-0 invisible scale-95"
                    }`}
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-yellow-400 font-bold uppercase tracking-wider text-sm">Shopping Cart ({cartCount})</h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">
                        Your cart is empty.
                      </div>
                    ) : (
                      <div className="divide-y divide-white/10">
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-4 hover:bg-white/5 transition">
                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                              <p className="text-gray-400 text-xs mt-1">
                                {item.color} / {item.size}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                                <span className="text-yellow-500 text-sm font-bold">{item.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="p-4 bg-white/5 border-t border-white/10">
                      <div className="flex justify-between items-center mb-4 text-sm">
                        <span className="text-gray-300">Subtotal:</span>
                        <span className="text-white font-bold text-lg">
                          PKR {cartItems.reduce((acc, item) => acc + (parseInt(item.price.replace(/[^\d]/g, '')) * (item.quantity || 1)), 0).toLocaleString()}
                        </span>
                      </div>
                      <NavLink
                        to="/checkout"
                        className="block w-full bg-yellow-500 text-black text-center py-3 rounded-lg font-bold uppercase text-sm hover:bg-yellow-400 transition"
                      >
                        Checkout
                      </NavLink>
                      <NavLink
                        to="/cart"
                        className="block w-full text-center py-2 mt-2 text-gray-400 text-xs hover:text-white transition underline"
                      >
                        View Cart
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white">
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div className="lg:hidden absolute top-full left-0 w-full z-50 bg-black/98 backdrop-blur-2xl border-t border-yellow-900/30 h-screen overflow-y-auto pb-40 shadow-2xl">
              <div className="px-6 py-8">
                {/* Main Links */}
                {navItems.map((item, index) => (
                  <div key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-4 text-xl font-bold text-center rounded-xl text-gray-200 hover:bg-white/10 hover:text-yellow-400 transition"
                    >
                      {item.label}
                    </NavLink>

                    {/* Collapsible Categories Section (Only after Home/first link) */}
                    {index === 0 && (
                      <div className="border-t border-yellow-900/30 mt-2">
                        <button
                          onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                          className="w-full flex items-center justify-center gap-2 text-lg font-bold text-yellow-400 mb-6"
                        >
                          CATEGORIES
                          <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`space-y-1 transition-all duration-300 ${isMobileCategoriesOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                          {loadingCategories ? (
                            <p className="text-center text-gray-400">Loading categories...</p>
                          ) : categories.length === 0 ? (
                            <p className="text-center text-gray-400">No categories available</p>
                          ) : (
                            categories.map((cat) => (
                              <NavLink
                                key={cat.slug}
                                to={`/shop?category=${cat.name}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-3 text-center text-gray-300 hover:text-yellow-400 transition font-medium"
                              >
                                {cat.name}
                              </NavLink>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}




              </div>
            </div>

            {/* Mobile Overlay */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </nav >
    </>
  );
}

export default Navbar;
