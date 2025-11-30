import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, ChevronDown } from 'lucide-react';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        { to: '/category/hoodies', label: 'Hoodies' },
        { to: '/category/jackets', label: 'Jackets' },
        { to: '/category/tshirts', label: 'T-Shirts' },
        { to: '/category/joggers', label: 'Joggers' },
        { to: '/category/shirts', label: 'Shirts' },
        { to: '/category/bottoms', label: 'Bottoms' },
    ];

    const navItems = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/shop', label: 'Shop' },
    ];

    return (
        <>
            {/* ========== 11.11 SALE BAR – HIDDEN ON MOBILE ========== */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 text-black text-center py-1 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                    <span className="text-md md:text-md">
                        11.11 MEGA SALE IS LIVE NOW!
                    </span>
                    <span className="text-md md:text-md opacity-90 hidden sm:inline">
                        (Up to 70% OFF + Free Delivery Pakistan Wide)
                    </span>
                    <span className="text-lg md:text-md">
                        11 Nov → 21 Nov
                    </span>
                    <NavLink
                        to="/shop" className="underline"
                    >
                        SHOP NOW
                    </NavLink>
                </div>


            </div>

            {/* ========== MAIN NAVBAR ========== */}
            <nav
                className={`fixed left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'top-0 md:top-8 bg-black/95 backdrop-blur-xl shadow-2xl border-b border-yellow-900/20'
                    : 'top-0 md:top-8 bg-black/80 backdrop-blur-md'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <NavLink to="/" className="flex-shrink-0 z-10">
                            <img src="/logo.png" alt="NAAKSH" className="h-14 md:h-16 w-auto drop-shadow-2xl hover:scale-105 transition" />
                        </NavLink>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center justify-center flex-1 gap-16">
                            {navItems.map((item, index) => (
                                <>
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `text-sm font-bold tracking-widest uppercase transition-all ${isActive ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-400'
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                    {index === 0 && (
                                        <div className="relative group">
                                            <button
                                                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                                                onMouseEnter={() => setIsShopDropdownOpen(true)}
                                                onMouseLeave={() => setIsShopDropdownOpen(false)}
                                                className="flex items-center gap-1 text-sm font-bold tracking-widest uppercase text-gray-200 hover:text-yellow-400 transition"
                                            >
                                                Categories
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div
                                                onMouseEnter={() => setIsShopDropdownOpen(true)}
                                                onMouseLeave={() => setIsShopDropdownOpen(false)}
                                                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-black/95 backdrop-blur-xl border border-yellow-900/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isShopDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                                                    }`}
                                            >
                                                {categories.map((cat) => (
                                                    <NavLink
                                                        key={cat.to}
                                                        to={cat.to}
                                                        className="block px-8 py-4 text-sm font-medium text-gray-300 hover:bg-yellow-500 hover:text-black transition"
                                                        onClick={() => setIsShopDropdownOpen(false)}
                                                    >
                                                        {cat.label}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ))}

                            {/* Category DROPDOWN */}

                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-4">
                            <NavLink to="/wishlist" className="hidden md:block p-3 border-2 border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition group">
                                <Heart className="w-5 h-5 group-hover:fill-black" strokeWidth={2.5} />
                            </NavLink>
                            <NavLink to="/cart" className="hidden md:block p-3 border-2 border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition group">
                                <ShoppingCart className="w-5 h-5 group-hover:fill-black" strokeWidth={2.5} />
                            </NavLink>

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
                        <div className="lg:hidden bg-black/98 backdrop-blur-2xl border-t border-yellow-900/30">
                            <div className="px-6 py-8 space-y-6">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block py-4 text-xl font-bold text-center rounded-xl text-gray-200 hover:bg-white/10 hover:text-yellow-400 transition"
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}

                                {/* Mobile Shop Dropdown */}
                                <div className="border-t border-yellow-900/30 pt-6">
                                    <h3 className="text-lg font-bold text-yellow-400 text-center mb-4">SHOP BY CATEGORY</h3>
                                    {categories.map((cat) => (
                                        <NavLink
                                            key={cat.to}
                                            to={cat.to}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block py-3 text-center text-gray-300 hover:text-yellow-400 transition"
                                        >
                                            {cat.label}
                                        </NavLink>
                                    ))}
                                </div>

                                <div className="flex justify-center gap-8 pt-6">
                                    <NavLink to="/wishlist" onClick={() => setIsMenuOpen(false)} className="p-4 border-2 border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black">
                                        <Heart className="w-8 h-8" />
                                    </NavLink>
                                    <NavLink to="/cart" onClick={() => setIsMenuOpen(false)} className="p-4 border-2 border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black">
                                        <ShoppingCart className="w-8 h-8" />
                                    </NavLink>
                                </div>
                            </div>
                        </div>

                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    </>
                )}
            </nav>
        </>
    );
}

export default Navbar;