import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-8" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-3xl animate-pulse" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-24 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-24 bg-yellow-100 rounded-full animate-pulse" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((s) => (
                  <div key={s} className="w-12 h-10 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-14 w-full bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
