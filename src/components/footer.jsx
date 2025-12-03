import { NavLink, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { useEffect } from 'react';

function Footer() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0,0);
  },[location.pathname])

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Logo + Description */}
          <div className="lg:col-span-4">
            <img src="/logo.png" alt="NAAKSH" className="h-16 mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium Pakistani streetwear crafted with discipline, luxury, and passion.
            </p>

            {/* Social Icons Below Logo (Mobile + Desktop) */}
            <div className="flex gap-5 mt-8">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-yellow-400 text-lg mb-6 tracking-wider">QUICK LINKS</h3>
            <ul className="space-y-4 text-gray-300">
              <li><NavLink to="/" className="hover:text-yellow-400 transition">Home</NavLink></li>
              <li><NavLink to="/about" className="hover:text-yellow-400 transition">About</NavLink></li>
              <li><NavLink to="/shop" className="hover:text-yellow-400 transition">Shop</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-yellow-400 transition">Contact</NavLink></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-yellow-400 text-lg mb-6 tracking-wider">CATEGORIES</h3>
            <ul className="space-y-4 text-gray-300">
              <li><NavLink to="/shop?category=Hoodies" className="hover:text-yellow-400 transition">Hoodies</NavLink></li>
              <li><NavLink to="/category/jackets" className="hover:text-yellow-400 transition">Jackets</NavLink></li>
              <li><NavLink to="/category/tshirts" className="hover:text-yellow-400 transition">T-Shirts</NavLink></li>
              <li><NavLink to="/category/joggers" className="hover:text-yellow-400 transition">Joggers</NavLink></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-yellow-400 text-lg mb-6 tracking-wider">STAY CONNECTED</h3>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-gray-900 border border-gray-800 rounded-full focus:outline-none focus:border-yellow-500 transition text-white placeholder-gray-500"
              />
              <button className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/40">
                <Send size={18} />
                Subscribe
              </button>
            </form>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 NAAKSH® – All Rights Reserved</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-yellow-400 transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-yellow-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;