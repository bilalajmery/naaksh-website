import React, { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export const metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been successfully placed with NAAKSH.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}
