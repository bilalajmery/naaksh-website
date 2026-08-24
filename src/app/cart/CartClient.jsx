'use client';
import React, { useSyncExternalStore, useMemo } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, Truck, ChevronRight } from 'lucide-react';
import { updateCartQuantity, removeFromCart, normalizeCartItem } from '../../lib/cart';

function subscribeCart(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('cart-updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('cart-updated', callback);
    window.removeEventListener('storage', callback);
  };
}

function getCartSnapshot() {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem('cart') || '[]';
}

function getServerCartSnapshot() {
  return '[]';
}

export default function CartClient() {
  const cartRaw = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);

  const cartItems = useMemo(() => {
    try {
      const parsed = JSON.parse(cartRaw);
      return Array.isArray(parsed) ? parsed.map(normalizeCartItem) : [];
    } catch {
      return [];
    }
  }, [cartRaw]);

  const handleQuantityChange = (itemKey, newQty) => {
    if (newQty < 1) return;
    updateCartQuantity(itemKey, newQty);
  };

  const handleRemove = (itemKey) => {
    removeFromCart(itemKey);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.priceNum || 0) * (item.quantity || 1),
    0
  );

  const shipping = 0; // Free Home Delivery All Over Pakistan
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-black mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Looks like you haven&apos;t added any streetwear pieces to your bag yet.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition shadow-lg"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Shopping Cart</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600">Your Bag</span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">
              Shopping Cart ({cartItems.length})
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition"
          >
            Continue Shopping &rarr;
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart Line Items (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.key}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between transition hover:border-gray-300"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Thumbnail */}
                  <Link href={`/product/${item.slug || item.product_uuid}`} className="flex-shrink-0">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                      <img
                        src={item.image || '/product-assets/placeholder.png'}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/product-assets/placeholder.png';
                        }}
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug || item.product_uuid}`}
                      className="text-sm sm:text-base font-black uppercase tracking-tight text-black hover:text-yellow-600 transition truncate block"
                    >
                      {item.name}
                    </Link>

                    <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500 font-medium">
                      {item.color && (
                        <span className="bg-gray-100 px-2.5 py-0.5 rounded-md text-gray-700">
                          Color: <strong className="text-black font-bold">{item.color}</strong>
                        </span>
                      )}
                      {item.size && (
                        <span className="bg-gray-100 px-2.5 py-0.5 rounded-md text-gray-700">
                          Size: <strong className="text-black font-bold">{item.size}</strong>
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-black mt-2">
                      PKR {item.priceNum ? item.priceNum.toLocaleString() : item.price}
                    </p>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-xs font-bold text-black min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                      disabled={item.quantity >= 99}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line item total */}
                  <div className="text-right min-w-[5rem]">
                    <span className="text-sm font-black text-black">
                      PKR {((item.priceNum || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.key)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Delivery Banner */}
            <div className="bg-yellow-50 border border-yellow-200/80 rounded-2xl p-4 flex items-center gap-3 text-yellow-900 text-xs">
              <Truck size={20} className="text-yellow-700 flex-shrink-0" />
              <span>
                <strong>Free Express Home Delivery</strong> is active for all orders across Pakistan!
              </span>
            </div>
          </div>

          {/* Summary Column (1 Col) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm sticky top-28 space-y-6">
              <h2 className="text-base font-black uppercase tracking-wider text-black pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-black">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Across Pakistan</span>
                  <span className="font-bold text-green-600 uppercase">Free Delivery</span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-black uppercase">Estimated Total</span>
                  <span className="text-2xl font-black text-black">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  *Taxes and final total evaluated by server at checkout.
                </p>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/20"
              >
                <span>Proceed to Checkout</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
