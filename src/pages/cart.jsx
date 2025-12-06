import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Cart() {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to load cart from local storage", error);
            return [];
        }
    });

    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        // Load cart from local storage
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCartItems(JSON.parse(savedCart));
        } catch (error) {
            console.error("Failed to load cart", error);
        }

        // Fetch all products to get available sizes/colors for dropdowns
        fetch('/product/data.json')
            .then(res => res.json())
            .then(data => setAllProducts(data))
            .catch(err => console.error("Failed to load products", err));
    }, []);

    useEffect(() => {
        if (cartItems.length > 0 || localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const updateItemVariation = (itemId, field, newValue) => {
        setCartItems(prevItems => {
            const itemIndex = prevItems.findIndex(i => i.id === itemId);
            if (itemIndex === -1) return prevItems;

            const currentItem = { ...prevItems[itemIndex] };
            const product = allProducts.find(p => p.slug === currentItem.slug);

            // Update the field
            currentItem[field] = newValue;

            // If color changed, update image
            if (field === 'color' && product) {
                const colorObj = product.colors.find(c => c.name === newValue);
                if (colorObj && colorObj.images.length > 0) {
                    currentItem.image = colorObj.images[0];
                }
            }

            // Check for potential merge
            // We want to find IF there is another item with the same slug, color, and size
            // (excluding the current item itself, which we identify by its original ID)
            const duplicateIndex = prevItems.findIndex(i =>
                i.id !== itemId &&
                i.slug === currentItem.slug &&
                i.color === currentItem.color &&
                i.size === currentItem.size
            );

            if (duplicateIndex > -1) {
                // Merge logic
                const newItems = [...prevItems];
                // Add quantity to the existing duplicate
                newItems[duplicateIndex] = {
                    ...newItems[duplicateIndex],
                    quantity: newItems[duplicateIndex].quantity + currentItem.quantity
                };
                // Remove the current item (since it's now merged)
                newItems.splice(itemIndex, 1);
                return newItems;
            } else {
                // No duplicate, just update the current item
                const newItems = [...prevItems];
                newItems[itemIndex] = currentItem;
                return newItems;
            }
        });
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // --- SHIPPING CONFIGURATION ---
    const IS_SHIPPING_ENABLED = false;  // Set to false for Free Shipping on all orders
    const SHIPPING_COST = 250;         // Set your shipping amount here
    // ----------------------------

    const subtotal = cartItems.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);

    // Calculate shipping: If enabled, apply cost. Change logic here if you want a threshold (e.g., subtotal > 5000 ? 0 : SHIPPING_COST)
    const shipping = IS_SHIPPING_ENABLED ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Helmet>
                    <title>Cart | NAAKSH</title>
                </Helmet>
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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-6">

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
                                            <div className="flex gap-4 mt-3 text-sm">
                                                {/* Color Selector */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Color:</span>
                                                    {(() => {
                                                        const product = allProducts.find(p => p.slug === item.slug);
                                                        const hasMultipleColors = product && product.colors && product.colors.length > 1;

                                                        if (hasMultipleColors) {
                                                            return (
                                                                <div className="relative">
                                                                    <select
                                                                        value={item.color}
                                                                        onChange={(e) => updateItemVariation(item.id, 'color', e.target.value)}
                                                                        className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all cursor-pointer hover:bg-gray-100"
                                                                    >
                                                                        {product.colors.map(c => (
                                                                            <option key={c.name} value={c.name}>{c.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                                </div>
                                                            );
                                                        }

                                                        return <span className="font-medium text-gray-900">{item.color}</span>;
                                                    })()}
                                                </div>

                                                {/* Size Selector */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Size:</span>
                                                    <div className="relative">
                                                        <select
                                                            value={item.size}
                                                            onChange={(e) => updateItemVariation(item.id, 'size', e.target.value)}
                                                            className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all cursor-pointer hover:bg-gray-100"
                                                        >
                                                            {(() => {
                                                                const product = allProducts.find(p => p.slug === item.slug);
                                                                return product ? product.sizes.map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                )) : <option value={item.size}>{item.size}</option>
                                                            })()}
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                    </div>
                                                </div>
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

                            <NavLink
                                to="/checkout"
                                className="block w-full bg-black text-white py-5 mt-8 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase text-center"
                            >
                                Proceed to Checkout
                            </NavLink>

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