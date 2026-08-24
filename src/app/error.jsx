'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('App Router Boundary Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
          <AlertCircle size={32} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Something went wrong
        </span>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-3 mb-2">
          Temporary Glitch
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm mb-8 leading-relaxed">
          {error?.message && !error.message.includes('digest')
            ? error.message
            : 'We encountered an unexpected issue while loading this page. Please try refreshing or return home.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition flex items-center justify-center gap-2 shadow-md"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-6 py-3.5 bg-gray-100 text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
