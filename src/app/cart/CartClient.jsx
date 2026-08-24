'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, Truck, ChevronRight } from 'lucide-react';
import { getCart, updateCartQuantity, removeFromCart } from '../../lib/cart';

export default function CartClient() {
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const syncCart = () => {
      setCartItems(getCart());
    };

    syncCart();
    window.addEventListener('cart-updated', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('cart-updated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

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

  if (!mounted) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            You have not added any streetwear pieces to your cart yet. Explore our latest drops!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition shadow-lg"
          >
            Start Shopping <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition">Shop</Link>
          <span>/</span>
          <span className="text-black font-bold">Shopping Cart</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Shopping Cart <span className="text-gray-400 text-lg font-normal">({cartItems.length} items)</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.key}
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-5 hover:shadow-md transition"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.slug || item.product_uuid}`}
                  className="flex-shrink-0"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={item.image || '/product-assets/placeholder.png'}
                      alt={item.name}
                      className="w-full h-full object-cover object-center hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/product-assets/placeholder.png';
                      }}
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link
                          href={`/product/${item.slug || item.product_uuid}`}
                          className="font-bold text-sm sm:text-base text-black hover:text-yellow-600 transition"
                        >
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1.5">
                          {item.color && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                              Color: {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.key)}
                        aria-label="Remove item"
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 text-black transition disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3.5 py-1 text-xs font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 99)}
                        className="p-2 hover:bg-gray-100 text-black transition disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-black">
                        PKR {((item.priceNum || 0) * item.quantity).toLocaleString()}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400">
                          PKR {(item.priceNum || 0).toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center">
              <Link
                href="/shop"
                className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 sticky top-28">
              <h2 className="text-xl font-black uppercase tracking-tight text-black mb-6">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-200">
                  <Truck size={16} />
                  <span>Free delivery all across Pakistan</span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-black">Total</span>
                    <span className="text-2xl font-black text-black">
                      PKR {total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Tax included. Shipping calculated at checkout.
                  </p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center bg-black text-white py-4 mt-6 text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black rounded-xl transition shadow-lg"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
