'use client';
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'CONFIRMED';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-200">
          <CheckCircle2 size={44} className="animate-bounce" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100/70 px-3 py-1 rounded-full">
          Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-3 mb-2">
          Thank You For Your Order!
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm mb-6">
          Your order has been placed directly with the NAAKSH warehouse. We are packing your streetwear pieces with care.
        </p>

        {/* Order Reference Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 uppercase tracking-wider font-semibold">Order Number:</span>
            <span className="font-mono font-black text-black text-sm bg-white px-2.5 py-1 rounded-lg border border-gray-200">
              #{orderNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 uppercase tracking-wider font-semibold">Payment Method:</span>
            <span className="font-bold text-gray-800">Cash on Delivery (COD)</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 uppercase tracking-wider font-semibold">Estimated Delivery:</span>
            <span className="font-bold text-gray-800">2 - 4 Business Days</span>
          </div>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
            <Truck size={18} className="text-black flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-black uppercase">Free Delivery</p>
              <p className="text-[10px] text-gray-500">TCS / Trax Express</p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
            <PackageCheck size={18} className="text-black flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-black uppercase">Direct Dispatch</p>
              <p className="text-[10px] text-gray-500">Quality Checked</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/shop"
            className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/"
            className="block text-xs font-bold text-gray-500 hover:text-black transition uppercase tracking-wider py-2"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
