import { useState, useEffect } from "react";
import { X, Heart, ShoppingBag, Move, Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const savedSlugs = JSON.parse(localStorage.getItem('wishlist')) || [];

        if (savedSlugs.length === 0) {
          setLoading(false);
          return;
        }

        const res = await fetch('/product/data.json');
        const products = await res.json();

        const wishedProducts = products.filter(p => savedSlugs.includes(p.slug));
        setWishlist(wishedProducts);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">YOUR WISHLIST IS EMPTY</h1>
          <p className="text-gray-600 text-lg mb-10">
            Save your favorite items and come back to them anytime
          </p>
          <NavLink
            to="/shop"
            className="inline-block bg-black text-white px-10 py-4 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase"
          >
            Continue Shopping
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <NavLink to="/" className="text-gray-500 hover:text-black">
                Home
              </NavLink>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-black font-medium">Wishlist</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            YOUR <span className="text-yellow-400">WISHLIST</span>
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <span className="text-lg font-medium">
              {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <ProductCard
              product={item}
              key={item.slug}
              onRemoveFromWishlist={(slug) => setWishlist((prev) => prev.filter((p) => p.slug !== slug))}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <NavLink
            to="/shop"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-black transition-colors"
          >
            ← Continue Shopping
          </NavLink>
        </div>
      </div>
    </div>
  );
}
