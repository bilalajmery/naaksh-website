import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { NavLink } from "react-router-dom";
import { Heart } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      // Get slugs from local storage
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

      if (savedWishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch all products
        const response = await fetch('/product/data.json');
        const allProducts = await response.json();

        // Filter products that are in the wishlist
        const filtered = allProducts.filter(p => savedWishlist.includes(p.slug));
        setWishlistProducts(filtered);
      } catch (error) {
        console.error("Failed to load wishlist products", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();

    // Listen for storage events to update real-time if changed in another tab
    const handleStorageChange = () => {
      loadWishlist();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('wishlist-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlist-updated', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">YOUR WISHLIST IS EMPTY</h1>
          <p className="text-gray-600 text-lg mb-10">Save your favorite items here to check them out later</p>
          <NavLink
            to="/shop"
            className="inline-block bg-black text-white px-10 py-4 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase"
          >
            Start Shopping
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Wishlist | NAAKSH</title>
        <meta name="description" content="View your favorite streetwear items in your wishlist." />
        <link rel="canonical" href="https://naakshofficial.com/wishlist" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li><NavLink to="/" className="text-gray-500 hover:text-black">Home</NavLink></li>
            <li className="text-gray-400">/</li>
            <li className="text-black font-medium">Wishlist</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter">
          YOUR <span className="text-yellow-400">WISHLIST</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
