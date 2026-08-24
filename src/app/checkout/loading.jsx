import React from 'react';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-gray-200 rounded-xl mb-8 animate-pulse" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 h-56 animate-pulse" />
            <div className="bg-white p-6 rounded-2xl border border-gray-200 h-72 animate-pulse" />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 h-96 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
