'use client';
import NavLink from "./NavLink";
import Link from "next/link";
import { Instagram, Facebook, Music2, Send, Youtube, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from 'react-toastify';
import { subscribeNewsletter } from '../lib/api';

function Footer({ categories, loadingCategories }) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const memoizedCategory = useMemo(() => {
    return categories ? categories.slice(0, 5) : [];
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
      await subscribeNewsletter(email);
      toast.success('Successfully subscribed to VIP drops!');
      setEmail('');
    } catch (error) {
      console.error('Subscribe Error:', error);
      toast.error(error.friendlyMessage || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#09090b] text-white border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/5">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo/sm.png" alt="NAAKSH" className="h-14 sm:h-16 w-auto object-contain" />
            </Link>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-6">
              Pakistan's premier streetwear label. Engineered with 240 GSM combed compact cotton, drop-shoulder silhouettes, and unapologetic cultural attitude.
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/naakshofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 hover:bg-black transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/naakshofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 hover:bg-black transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@naakshofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 hover:bg-black transition-all"
                aria-label="TikTok"
              >
                <Music2 size={18} />
              </a>
              <a
                href="https://www.youtube.com/@NaakshOfficial-f9h"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 hover:bg-black transition-all"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
              NAVIGATION
            </h3>
            <ul className="space-y-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <li>
                <NavLink to="/" className="hover:text-white transition">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/shop" className="hover:text-white transition">
                  Shop Collection
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className="hover:text-white transition">
                  Journal
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-white transition">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-white transition">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
              COLLECTIONS
            </h3>

            {loadingCategories ? (
              <p className="text-zinc-500 text-xs">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="text-zinc-500 text-xs">No categories</p>
            ) : (
              <ul className="space-y-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {memoizedCategory.map((cat) => (
                  <li key={cat.id || cat.slug}>
                    <NavLink to={`/category/${cat.slug}`} className="hover:text-white transition">
                      {cat.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-4">
            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              JOIN THE INNER CIRCLE
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Receive secret drop announcements, early access invitations, and private sales.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubscribing}
                  className="w-full px-5 py-3.5 bg-[#0d0d0f] border border-white/10 focus:border-yellow-400 rounded-none text-xs text-white placeholder-zinc-500 outline-none transition disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full py-3.5 bg-yellow-400 hover:bg-white text-black font-black uppercase text-xs tracking-[0.2em] transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>{isSubscribing ? 'SUBSCRIBING...' : 'GET EARLY ACCESS'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Rights & Links */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} NAAKSH® OFFICIAL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 uppercase tracking-wider text-[11px]">
            <Link href="/privacy" className="hover:text-zinc-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
