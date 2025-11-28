import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/shop', label: 'Shop' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="bg-black text-white py-4 fixed top-0 w-full z-50 shadow-2xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <NavLink to="/" className="flex items-center group">
                    <img
                        src="/logo.png"
                        alt="NAAKSH Logo"
                        className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </NavLink>

                <div className="hidden md:flex space-x-10 text-lg">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `relative py-2 transition-all duration-300 ${
                                    isActive
                                        ? 'text-yellow-400 font-semibold'
                                        : 'text-white hover:text-yellow-300'
                                } after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400 after:transition-transform after:duration-300 ${
                                    isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white hover:text-yellow-300 transition-colors duration-300 p-2"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 py-6 space-y-4 bg-gray-900 border-t border-gray-800">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block py-3 px-4 rounded-lg text-lg transition-all duration-300 ${
                                    isActive
                                        ? 'bg-yellow-400 text-black font-semibold'
                                        : 'text-white hover:bg-gray-800 hover:text-yellow-300'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
