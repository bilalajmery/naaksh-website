import React from 'react';

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="bg-black py-16 px-6 text-center">
        <div className="h-4 w-28 bg-gray-800 rounded-full mx-auto mb-3 animate-pulse" />
        <div className="h-10 w-64 bg-gray-800 rounded-xl mx-auto mb-3 animate-pulse" />
        <div className="h-4 w-80 bg-gray-800 rounded-full mx-auto animate-pulse" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-40 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-3 space-y-3">
              <div className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
