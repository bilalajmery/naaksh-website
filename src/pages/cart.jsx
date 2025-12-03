import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "DISCIPLINE OVERSIZED HOODIE",
            slug: "discipline-oversized-hoodie",
            color: "Black",
            size: "L",
            price: "PKR 4,999",
            priceNum: 4999,
            quantity: 1,
            image: "/product/discipline-hoddie/1.jpg",
            stock: 5
        },
        {
            id: 2,
            name: "MINIMAL LOGO T-SHIRT",
            slug: "minimal-logo-tshirt",
            color: "White",
            size: "M",
            price: "PKR 2,499",
            priceNum: 2499,
            quantity: 2,
            image: "/product/discipline-hoddie/1.jpg",
            stock: 8
        },
        {
            id: 3,
            name: "PREMIUM CARGO PANTS",
            slug: "premium-cargo-pants",
            color: "Olive",
            size: "32",
            price: "PKR 5,999",
            priceNum: 5999,
            quantity: 1,
            image: "/category/Classic Polo Shirts/img.jpg",
            stock: 3
        }
    ]);

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 250;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-24">
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">YOUR CART IS EMPTY</h1>
                    <p className="text-gray-600 text-lg mb-10">Looks like you haven't added anything to your cart yet</p>
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
                        <li><NavLink to="/shop" className="text-gray-500 hover:text-black">Shop</NavLink></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-black font-medium">Cart</li>
                    </ol>
                </nav>

                <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter">
                    YOUR <span className="text-yellow-400">CART</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 flex gap-6 hover:shadow-md transition-shadow">
                                <NavLink to={`/product/${item.slug}`} className="flex-shrink-0">
                                    <div className="w-32 h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.jpg"; // fallback image
                                            }}
                                        />
                                    </div>
                                </NavLink>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <NavLink to={`/product/${item.slug}`} className="font-medium text-gray-900 hover:text-black transition-colors">
                                                <h3 className="text-lg">{item.name}</h3>
                                            </NavLink>
                                            <div className="flex gap-3 mt-2 text-sm text-gray-600">
                                                <span>Color: {item.color}</span>
                                                <span>•</span>
                                                <span>Size: {item.size}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-4 border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-3 hover:bg-gray-50 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-3 hover:bg-gray-50 transition-colors"
                                                disabled={item.quantity >= item.stock}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-semibold text-black">
                                                PKR {(item.priceNum * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-8 sticky top-24">
                            <h2 className="text-2xl font-black mb-6 tracking-tighter">ORDER SUMMARY</h2>

                            <div className="space-y-4 text-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">PKR {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                        {shipping === 0 ? "FREE" : `PKR ${shipping}`}
                                    </span>
                                </div>
                                {shipping === 0 && (
                                    <p className="text-xs text-green-600 font-medium">
                                        Congrats! You've got free shipping
                                    </p>
                                )}
                                <div className="border-t border-gray-300 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-xl font-black">Total</span>
                                        <span className="text-2xl font-black">PKR {total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-black text-white py-5 mt-8 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase">
                                Proceed to Checkout
                            </button>

                            <div className="mt-6 space-y-3">
                                <NavLink to="/shop" className="block text-center text-sm text-gray-600 hover:text-black transition-colors">
                                    ← Continue Shopping
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}