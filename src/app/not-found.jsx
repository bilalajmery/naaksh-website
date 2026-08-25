import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The streetwear drop or page you were looking for does not exist or has moved.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl sm:text-9xl font-black text-gray-900 tracking-tighter opacity-10 select-none">
          404
        </div>
        <div className="-mt-12 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            Drop Missing
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-3 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-8 leading-relaxed">
            The page, product, or category you requested cannot be found or has been discontinued.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag size={14} />
              <span>Browse Catalog</span>
            </Link>
            <Link
              href="/"
              className="px-6 py-3.5 bg-gray-100 text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
