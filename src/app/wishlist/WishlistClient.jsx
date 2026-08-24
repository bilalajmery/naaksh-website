'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { getWishlist } from '../../lib/wishlist';
import * as api from '../../lib/api';

async function fetchWishlistProduct(id) {
  if (!id) return null;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (isUuid) {
    try {
      const res = await api.getProductByUuid(id);
      const data = res?.data || res;
      if (data?.uuid) return data;
    } catch {
      // Fallthrough
    }
  }

  try {
    const listRes = await api.getProducts({ search: id, per_page: 5 });
    const items = Array.isArray(listRes?.data) ? listRes.data : [];
    const found = items.find((p) => p.uuid === id || p.slug === id);
    if (found?.uuid) {
      const res = await api.getProductByUuid(found.uuid);
      const data = res?.data || res;
      if (data?.uuid) return data;
    }
  } catch {
    // Fallthrough
  }

  return null;
}

export default function WishlistClient() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const loadWishlistProducts = async () => {
    const rawIds = getWishlist();
    if (rawIds.length === 0) {
      setWishlistProducts([]);
      setLoading(false);
      return;
    }

    try {
      // Rehydrate products by fetching detail / catalog for each UUID
      const promises = rawIds.map((id) => fetchWishlistProduct(id));
      const results = await Promise.all(promises);
      const validProducts = results.filter(Boolean);
      setWishlistProducts(validProducts);
    } catch (err) {
      console.error('Failed to load wishlist products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadWishlistProducts();

    const handleUpdate = () => {
      loadWishlistProducts();
    };

    window.addEventListener('wishlist-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wishlist-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleItemRemoved = (removedId) => {
    setWishlistProducts((prev) =>
      prev.filter((p) => p.uuid !== removedId && p.slug !== removedId && String(p.id) !== removedId)
    );
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Loading Wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <Heart size={40} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Save your favorite streetwear pieces here to easily track them and purchase later.
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
          <span className="text-black font-bold">Wishlist</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Saved Items <span className="text-gray-400 text-lg font-normal">({wishlistProducts.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.uuid || product.id}
              product={product}
              onRemoveFromWishlist={handleItemRemoved}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
