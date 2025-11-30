import { useState } from 'react';
import { ArrowLeft, ShoppingBag, Check, Star, Truck, Shield, RefreshCw, Heart, Share2, Minus, Plus } from 'lucide-react';

export default function ProductDetail() {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);

    // Sample product data
    const product = {
        id: 1,
        slug: 'discipline-hoodie',
        name: 'Premium Oversized Hoodie',
        price: 'PKR 2,999',
        priceNum: 2999,
        original: 'PKR 4,499',
        originalNum: 4499,
        badge: 'SALE',
        rating: 4.8,
        reviews: 124,
        category: 'Hoodies',
        sku: 'HOD-001-MAR',
        description: 'Experience ultimate comfort with our signature oversized fit. Made from 100% premium cotton with a heavy GSM for that perfect drape. This hoodie features a relaxed silhouette, reinforced stitching, and a soft fleece interior that keeps you warm without the weight.',
        features: [
            '100% Premium Cotton',
            'Heavy 400 GSM Fabric',
            'Oversized Relaxed Fit',
            'Soft Fleece Lining',
            'Reinforced Double Stitching',
            'Adjustable Drawstring Hood',
            'Kangaroo Front Pocket',
            'Pre-shrunk Fabric'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            {
                name: 'Maroon',
                hex: '#8B0000',
                images: [
                    'https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800',
                    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
                    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
                ]
            },
            {
                name: 'Black',
                hex: '#000000',
                images: [
                    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800',
                    'https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800',
                    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'
                ]
            },
            {
                name: 'White',
                hex: '#ffffff',
                images: [
                    'https://images.unsplash.com/photo-1578932750294-708afda11a11?w=800',
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
                    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800'
                ]
            }
        ],
    };

    const [mainImage, setMainImage] = useState(0);
    const currentImages = product.colors[selectedColor].images;
    const discount = Math.round(((product.originalNum - product.priceNum) / product.originalNum) * 100);

    const handleQuantityChange = (action) => {
        if (action === 'increment') {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <nav className="flex items-center gap-2 text-sm text-gray-600">
                    <a href="/" className="hover:text-black transition-colors">Home</a>
                    <span>/</span>
                    <a href="/shop" className="hover:text-black transition-colors">Shop</a>
                    <span>/</span>
                    <a href="/shop" className="hover:text-black transition-colors">{product.category}</a>
                    <span>/</span>
                    <span className="text-black font-medium">{product.name}</span>
                </nav>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Left: Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square">
                            {product.badge && (
                                <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 text-sm font-bold uppercase z-10">
                                    {discount}% OFF
                                </div>
                            )}
                            <img
                                src={currentImages[mainImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Wishlist & Share */}
                            <div className="absolute top-6 right-6 flex gap-3">
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
                                        }`}
                                >
                                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                                </button>
                                <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full hover:bg-white flex items-center justify-center transition-all">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-4">
                            {currentImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(idx)}
                                    className={`overflow-hidden rounded-xl transition-all ${mainImage === idx ? 'ring-4 ring-black' : 'ring-2 ring-gray-200 hover:ring-gray-400'
                                        }`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-24 h-24 object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div>
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{product.category}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold">{product.rating}</span>
                                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black text-black">{product.price}</span>
                                <span className="text-2xl text-gray-400 line-through">{product.original}</span>
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    Save {discount}%
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
                        </div>

                        {/* Color Selector */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Color: {product.colors[selectedColor].name}</h3>
                            </div>
                            <div className="flex gap-3">
                                {product.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedColor(idx);
                                            setMainImage(0);
                                        }}
                                        className={`relative w-8 h-8 rounded-full border-4 transition-all hover:scale-110 ${selectedColor === idx ? 'border-black scale-110' : 'border-gray-200'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {selectedColor === idx && (
                                            <Check className="absolute inset-0 m-auto text-white" size={16} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Select Size</h3>
                                {/* <button className="text-sm text-gray-600 hover:text-black underline">Size Guide</button> */}
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-4 border-2 rounded-xl font-bold text-lg transition-all hover:border-black ${selectedSize === size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange('decrement')}
                                        className="px-6 py-4 hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="px-8 py-4 font-bold text-lg border-x-2 border-gray-200">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('increment')}
                                        className="px-6 py-4 hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                {/* <span className="text-sm text-gray-600">Only 12 items left in stock</span> */}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            disabled={!selectedSize}
                            className="w-full bg-black text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-900 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
                        >
                            <ShoppingBag size={24} />
                            {selectedSize ? 'Add to Cart' : 'Please Select Size'}
                        </button>

                        <button className="w-full border-2 border-black text-black py-5 rounded-xl font-bold text-lg hover:bg-black hover:text-white transition-all">
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-20">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8">
                            {['description', 'features', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 px-2 font-semibold uppercase text-sm tracking-wider transition-colors relative ${activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-black'
                                        }`}
                                >
                                    {tab.replace('-', ' ')}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="py-12">
                        {activeTab === 'description' && (
                            <div className="max-w-3xl">
                                <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="max-w-3xl">
                                <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {product.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="max-w-3xl">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                                    {/* <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors">
                                        Write a Review
                                    </button> */}
                                </div>

                                {/* Sample Review */}
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <span className="font-semibold">Amazing Quality!</span>
                                        </div>
                                        <p className="text-gray-700 mb-3">The fabric is incredibly soft and the fit is perfect. Highly recommend this hoodie!</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="font-medium">Ahmed K.</span>
                                            <span>•</span>
                                            <span>Verified Purchase</span>
                                            <span>•</span>
                                            <span>2 days ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}