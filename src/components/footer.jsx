import { NavLink, Link } from "react-router-dom";
import { Instagram, Facebook, Music2, Send, Youtube } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from 'react-toastify';

function Footer({ categories, loadingCategories }) {
  const randomNumberRef = useRef(Math.random());
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const memoizedCategory = useMemo(() => {
    return [...categories].sort(() => randomNumberRef.current - 0.5).slice(0, 5);
  }, [categories]);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch(import.meta.env.VITE_SERVER_URL + '/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      // Handle validation errors (422) or other error responses
      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          // Extract first error message from errors object
          const firstErrorKey = Object.keys(result.errors)[0];
          const errorMessage = result.errors[firstErrorKey][0];
          toast.error(errorMessage);
        } else if (result.message) {
          // Use the message from API if available
          toast.error(result.message);
        } else {
          toast.error('Failed to subscribe. Please try again.');
        }
        return;
      }

      toast.success('Successfully subscribed to our newsletter!');
      setEmail(''); // Clear input on success
    } catch (error) {
      console.error('Subscribe Error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Logo + Description */}
          <div className="lg:col-span-4">
            <img src="logo/sm.png" alt="NAAKSH" className="h-24 mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium Pakistani streetwear crafted with discipline, luxury, and passion.
            </p>

            <div className="flex gap-5 mt-8">
              <a
                href="https://www.instagram.com/naakshofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/naakshofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@naakshofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
              >
                <Music2 size={20} />
              </a>
              <a
                href="https://www.youtube.com/@NaakshOfficial-f9h"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-yellow-400 text-lg mb-6 tracking-wider">QUICK LINKS</h3>
            <ul className="space-y-4 text-gray-300">
              <li>
                <NavLink to="/" className="hover:text-yellow-400 transition">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-yellow-400 transition">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/shop" className="hover:text-yellow-400 transition">
                  Shop
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-yellow-400 transition">
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className="hover:text-yellow-400 transition">
                  Cart
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Dynamic Categories (Random 5) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-yellow-400 text-lg mb-6 tracking-wider">CATEGORIES</h3>

            {loadingCategories ? (
              <p className="text-gray-400 text-sm"></p>
            ) : categories.length === 0 ? (
              <p className="text-gray-400 text-sm">No categories available</p>
            ) : (
              <ul className="space-y-4 text-gray-300">
                {memoizedCategory.map((cat) => (
                  <li key={cat.slug}>
                    <NavLink to={`/shop?category=${cat.name}`} className="hover:text-yellow-400 transition">
                      {cat.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-yellow-400 text-lg mb-6 tracking-wider">STAY CONNECTED</h3>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
                className="flex-1 px-6 py-4 bg-gray-900 border border-gray-800 rounded-full 
                focus:outline-none focus:border-yellow-500 transition text-white placeholder-gray-500
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-full 
              hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg 
              hover:shadow-yellow-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NAAKSH® – All Rights Reserved</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-yellow-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-yellow-400 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
