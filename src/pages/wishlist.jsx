import { useState } from 'react';
import { X, Heart, ShoppingBag, Move } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([
        {
            id: 1,
            name: "DISCIPLINE OVERSIZED HOODIE",
            slug: "discipline-oversized-hoodie",
            price: "PKR 4,999",
            original: "PKR 6,499",
            badge: "SALE",
            image: "/product/discipline-hoodie/1.jpg",
            inStock: true
        },
        {
            id: 2,
            name: "SIGNATURE LOGO TEE",
            slug: "signature-logo-tee",
            price: "PKR 2,799",
            image: "/product/signature-tee.jpg",
            inStock: true
        },
        {
            id: 3,
            name: "PREMIUM CARGO JOGGERS",
            slug: "premium-cargo-joggers",
            price: "PKR 5,999",
            original: "PKR 7,999",
            badge: "SALE",
            image: "/product/cargo-joggers.jpg",
            inStock: false
        },
        {
            id: 4,
            name: "CLASSIC POLO SHIRT",
            slug: "classic-polo-shirt",
            price: "PKR 3,499",
            image: "/product/polo-black.jpg",
            inStock: true
        }
    ]);

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    };

    const addToCart = (item) => {
        alert(`"${item.name}" added to cart!`);
        // Remove from wishlist after adding to cart (optional)
        removeFromWishlist(item.id);
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-24">
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Heart size={48} className="text-gray-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                        YOUR WISHLIST IS EMPTY
                    </h1>
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
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Breadcrumbs */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-sm">
                        <li><NavLink to="/" className="text-gray-500 hover:text-black">Home</NavLink></li>
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
                        <span className="text-lg font-medium">{wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}</span>
                    </div>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map(item => (
                        <div
                            key={item.id}
                            className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            {/* Badge */}
                            {item.badge && (
                                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-black text-white text-xs font-bold tracking-widest uppercase">
                                    {item.badge}
                                </div>
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            >
                                <X size={18} className="text-gray-700" />
                            </button>

                            {/* Image */}
                            <NavLink to={`/product/${item.slug}`} className="block">
                                <div className="relative w-full h-80 bg-gray-50 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => e.target.src = "/placeholder.jpg"}
                                    />
                                    {!item.inStock && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-bold tracking-wider">OUT OF STOCK</span>
                                        </div>
                                    )}
                                </div>
                            </NavLink>

                            {/* Content */}
                            <div className="p-5">
                                <NavLink to={`/product/${item.slug}`}>
                                    <h3 className="text-lg font-medium text-gray-900 hover:text-black transition-colors line-clamp-2">
                                        {item.name}
                                    </h3>
                                </NavLink>

                                <div className="mt-3 flex items-center justify-between">
                                    <div>
                                        <span className="text-xl font-bold text-black">
                                            {item.price}
                                        </span>
                                        {item.original && (
                                            <span className="ml-2 text-sm text-gray-400 line-through">
                                                {item.original}
                                            </span>
                                        )}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => addToCart(item)}
                                        disabled={!item.inStock}
                                        className={`px-5 py-2.5 text-sm font-medium tracking-wider uppercase transition-all flex items-center gap-2 ${
                                            item.inStock
                                                ? 'bg-black text-white hover:bg-gray-900'
                                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        }`}
                                    >
                                        <ShoppingBag size={16} />
                                        {item.inStock ? 'Add to Cart' : 'Sold Out'}
                                    </button>
                                </div>

                                {/* Move to Cart Icon (Optional) */}
                                {item.inStock && (
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-3 w-full border border-gray-300 py-2.5 text-sm font-medium tracking-wider uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Move size={16} />
                                        Move to Cart
                                    </button>
                                )}
                            </div>
                        </div>
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