import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 border-2 border-yellow-400 border-b-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
        Loading NAAKSH...
      </p>
    </div>
  );
}
