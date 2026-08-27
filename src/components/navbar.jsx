'use client';
import React, { useState, useEffect } from "react";
import NavLink from "./NavLink";
import Link from "next/link";
import { Menu, X, ShoppingCart, Heart, ChevronDown, User, LogOut, Package, ShieldCheck } from "lucide-react";
import { getCart } from "../lib/cart";
import { getWishlist } from "../lib/wishlist";
import { getAuthUser, logoutCustomer } from "../lib/auth";
import { getAnnouncement } from "../lib/api";
import AuthModal from "./AuthModal";

function Navbar({ categories, loadingCategories }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState({
    is_enabled: false,
    text_prefix: "",
    text_middle: "",
    text_suffix: "",
    button_text: "",
    button_link: "/shop",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncement = () => {
      getAnnouncement()
        .then((data) => {
          if (isMounted && data && typeof data.is_enabled === 'boolean') {
            setAnnouncement(data);
          }
        })
        .catch(() => {
          // preserve fallback defaults on network/offline
        });
    };

    fetchAnnouncement();

    // Poll every 4 seconds for instant live updates across tabs
    const intervalId = setInterval(fetchAnnouncement, 4000);

    const handleFocus = () => {
      fetchAnnouncement();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  useEffect(() => {
    const updateCounts = () => {
      const cart = getCart();
      const wishlist = getWishlist();
      setCartItems(cart);
      setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
      setWishlistCount(wishlist.length);
      setCurrentUser(getAuthUser());
    };

    updateCounts();
    window.addEventListener("cart-updated", updateCounts);
    window.addEventListener("wishlist-updated", updateCounts);
    window.addEventListener("auth-changed", updateCounts);
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("cart-updated", updateCounts);
      window.removeEventListener("wishlist-updated", updateCounts);
      window.removeEventListener("auth-changed", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    setIsUserDropdownOpen(false);
    await logoutCustomer();
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/blog", label: "Journal" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Universal Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* DYNAMIC ANNOUNCEMENT SALE BAR */}
      {announcement.is_enabled && (
        <div className="hidden md:block relative z-[60] bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black text-center py-1.5 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-xs font-bold uppercase tracking-widest">
            {announcement.text_prefix && <span>{announcement.text_prefix}</span>}
            {announcement.text_middle && (
              <span className="hidden sm:inline opacity-90">{announcement.text_middle}</span>
            )}
            {announcement.text_suffix && <span>{announcement.text_suffix}</span>}
            {announcement.button_text && (
              <NavLink to={announcement.button_link || "/shop"} className="underline font-black hover:opacity-80 transition">
                {announcement.button_text}
              </NavLink>
            )}
          </div>
        </div>
      )}

      {/* MAIN NAVBAR */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-[#09090b] border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="z-10 flex items-center">
              <img
                src="/logo/sm.png"
                alt="NAAKSH"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-md hover:opacity-90 transition"
              />
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-10 xl:gap-14">
              {navItems.map((item, index) => (
                <React.Fragment key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
                        isActive ? "text-yellow-400" : "text-zinc-300 hover:text-white"
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
                        className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        <span>Categories</span>
                        <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                      </button>

                      {/* Dropdown */}
                      <div
                        onMouseEnter={() => setIsShopDropdownOpen(true)}
                        onMouseLeave={() => setIsShopDropdownOpen(false)}
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#0d0d0f]/98 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                          isShopDropdownOpen && !loadingCategories && categories.length > 0
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2 pointer-events-none"
                        }`}
                      >
                        <div className="py-2">
                          {loadingCategories ? (
                            <div className="px-6 py-4 text-center text-xs text-zinc-400">Loading categories...</div>
                          ) : categories.length === 0 ? (
                            <div className="px-6 py-4 text-center text-xs text-zinc-400">No categories found</div>
                          ) : (
                            categories.map((cat) => (
                              <NavLink
                                key={cat.id || cat.slug}
                                to={`/category/${cat.slug}`}
                                className="block px-6 py-3 text-xs font-semibold tracking-wider text-zinc-300 hover:bg-yellow-500 hover:text-black transition"
                                onClick={() => setIsShopDropdownOpen(false)}
                              >
                                {cat.name}
                              </NavLink>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* User Account / Login Button */}
              <div
                className="relative"
                onMouseEnter={() => currentUser && setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                {currentUser ? (
                  <Link
                    href="/account"
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 flex items-center justify-center relative cursor-pointer"
                    aria-label="My Account"
                  >
                    <User className="w-4 h-4" />
                    <span className="absolute top-1 right-1 bg-emerald-400 w-2 h-2 rounded-full ring-2 ring-black" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:border-yellow-400 text-zinc-300 hover:text-yellow-400 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    aria-label="Sign In"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}

                {/* User Dropdown for Authenticated Customer */}
                {currentUser && (
                  <div
                    className={`hidden md:block absolute top-full right-0 mt-3 w-64 bg-[#0d0d0f]/98 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right ${
                      isUserDropdownOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                        Signed in as
                      </p>
                      <p className="text-white font-bold text-sm truncate mt-0.5">
                        {currentUser.name}
                      </p>
                      <p className="text-zinc-400 text-xs truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-2 text-xs">
                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:bg-yellow-500 hover:text-black transition font-medium"
                      >
                        <ShieldCheck size={16} />
                        <span>Account Dashboard</span>
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:bg-yellow-500 hover:text-black transition font-medium"
                      >
                        <Package size={16} />
                        <span>Order History</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:bg-yellow-500 hover:text-black transition font-medium"
                      >
                        <Heart size={16} />
                        <span>Saved Wishlist</span>
                      </Link>
                    </div>

                    <div className="p-2 bg-white/5 border-t border-white/10">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition uppercase tracking-wider cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <NavLink
                to="/wishlist"
                className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:border-yellow-400 text-zinc-300 hover:text-yellow-400 transition-all duration-300 flex items-center justify-center relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-md">
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
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:border-yellow-400 text-zinc-300 hover:text-yellow-400 transition-all duration-300 flex items-center justify-center relative"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                      {cartCount}
                    </span>
                  )}
                </NavLink>

                {/* Cart Dropdown */}
                <div
                  className={`hidden md:block absolute top-full right-0 mt-3 w-80 bg-[#0d0d0f]/98 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right ${
                    isCartDropdownOpen
                      ? "opacity-100 visible scale-100"
                      : "opacity-0 invisible scale-95 pointer-events-none"
                  }`}
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-yellow-400 font-bold uppercase tracking-wider text-xs">
                      Bag ({cartCount})
                    </h3>
                    <Link href="/cart" className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider">
                      View All
                    </Link>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <div className="p-8 text-center text-zinc-400 text-xs">
                        Your bag is currently empty.
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex gap-3.5 p-4 hover:bg-white/[0.02] transition">
                            <div className="w-14 h-16 rounded overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/10">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-xs truncate">{item.name}</h4>
                              <p className="text-zinc-400 text-[11px] mt-0.5">
                                {item.color} / {item.size}
                              </p>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-zinc-500 text-[11px]">Qty: {item.quantity}</span>
                                <span className="text-yellow-400 text-xs font-bold">{item.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="p-4 bg-white/[0.02] border-t border-white/10">
                      <div className="flex justify-between items-center mb-3 text-xs">
                        <span className="text-zinc-400">Subtotal:</span>
                        <span className="text-white font-bold text-sm">
                          PKR {cartItems.reduce((acc, item) => acc + ((item.priceNum || parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0) * (item.quantity || 1)), 0).toLocaleString()}
                        </span>
                      </div>
                      <NavLink
                        to="/checkout"
                        className="block w-full bg-yellow-400 hover:bg-white text-black text-center py-3 font-extrabold uppercase text-xs tracking-widest transition duration-200"
                      >
                        Proceed to Checkout
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:text-yellow-400 transition"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide Drawer Menu */}
        {isMenuOpen && (
          <>
            <div className="lg:hidden absolute top-full left-0 w-full z-50 bg-[#09090b]/98 backdrop-blur-2xl border-t border-white/10 h-screen overflow-y-auto pb-40 shadow-2xl animate-fade-in">
              <div className="px-6 py-6">
                {/* User Status in Mobile Menu */}
                {currentUser ? (
                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-400">{currentUser.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xs font-bold text-yellow-400 underline uppercase tracking-wider"
                    >
                      Account
                    </Link>
                  </div>
                ) : (
                  <div className="mb-6">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setAuthModalOpen(true);
                      }}
                      className="w-full py-3.5 bg-yellow-400 text-black font-extrabold uppercase text-xs tracking-widest transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <User size={15} />
                      <span>Member Sign In / Register</span>
                    </button>
                  </div>
                )}

                {/* Main Links */}
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <div key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-base font-bold uppercase tracking-widest text-zinc-200 hover:text-yellow-400 transition"
                      >
                        {item.label}
                      </NavLink>

                      {/* Collapsible Categories Section (Only after Home/first link) */}
                      {index === 0 && (
                        <div className="border-y border-white/5 py-2 my-2">
                          <button
                            onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                            className="w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-widest text-yellow-400"
                          >
                            <span>EXPLORE CATEGORIES</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <div className={`space-y-1 transition-all duration-300 ${isMobileCategoriesOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            {loadingCategories ? (
                              <p className="text-center text-xs text-zinc-500 py-2">Loading categories...</p>
                            ) : categories.length === 0 ? (
                              <p className="text-center text-xs text-zinc-500 py-2">No categories</p>
                            ) : (
                              categories.map((cat) => (
                                <NavLink
                                  key={cat.id || cat.slug}
                                  to={`/category/${cat.slug}`}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block py-2 px-3 text-xs font-medium text-zinc-400 hover:text-white transition"
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

                {currentUser && (
                  <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Overlay Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </nav>
    </>
  );
}

export default Navbar;
