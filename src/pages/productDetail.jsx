import { useState, useEffect } from 'react';
import { ShoppingBag, Check, Star, Heart, Minus, Plus } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);
    const [mainImage, setMainImage] = useState(0);

    // Load product data
    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        async function loadProduct() {
            try {
                const res = await fetch('/product/data.json');
                if (!res.ok) throw new Error('Failed to fetch');

                const products = await res.json();
                const found = products.find(p => p.slug === slug);

                if (found) {
                    setProduct(found);
                    setSelectedColor(0);
                    setMainImage(0);

                    // Find related products (same category, excluding current)
                    const related = products
                        .filter(p => p.category === found.category && p.slug !== found.slug)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);
                    setRelatedProducts(related);
                } else {
                    navigate('/404', { replace: true });
                    return;
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        loadProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    // Initialize wishlist state
    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setIsFavorite(wishlist.includes(slug));
    }, [slug]);

    // Toggle wishlist
    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        let updatedWishlist;
        if (isFavorite) {
            // Remove from wishlist
            updatedWishlist = wishlist.filter(item => item !== slug);
        } else {
            // Add to wishlist
            updatedWishlist = [...wishlist, slug];
        }

        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsFavorite(!isFavorite);
    };

    const handleQuantityChange = (action) => {
        if (action === 'increment') setQuantity(q => q + 1);
        if (action === 'decrement' && quantity > 1) setQuantity(q => q - 1);
    };

    const addToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }

        const cartItem = {
            id: Date.now(), // Simple unique ID for cart item
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            priceNum: product.priceNum,
            color: product.colors[selectedColor]?.name,
            size: selectedSize,
            quantity: quantity,
            image: product.colors[selectedColor]?.images[0] || '/placeholder.jpg',
            stock: 99 // Assuming ample stock for now or fetch from product if available
        };

        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        // Optional: Check if same item (same slug, size, color) exists and update quantity instead of adding new
        const existingItemIndex = existingCart.findIndex(item =>
            item.slug === cartItem.slug &&
            item.size === cartItem.size &&
            item.color === cartItem.color
        );

        let updatedCart;
        if (existingItemIndex > -1) {
            updatedCart = [...existingCart];
            updatedCart[existingItemIndex].quantity += quantity;
        } else {
            updatedCart = [...existingCart, cartItem];
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Product added to cart!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <div className="text-2xl font-bold">Loading product...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <div className="text-3xl font-bold text-red-600">Product Not Found!</div>
            </div>
        );
    }

    const currentImages = product.colors[selectedColor]?.images || [];
    const discount = Math.round(((product.originalNum - product.priceNum) / product.originalNum) * 100);
    const siteUrl = window.location.origin;
    const ogImage = currentImages[0] ? `${siteUrl}${currentImages[0]}` : '';

    // Helper function to check if file is a video
    const isVideo = (url) => {
        return url?.toLowerCase().endsWith('.mp4');
    };

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{product.name} | Naaksh</title>
                <meta name="description" content={product.description} key="description" />
                <meta property="og:title" content={product.name} key="og:title" />
                <meta property="og:description" content={product.description} key="og:description" />
                <meta property="og:image" content={ogImage} key="og:image" />
                <meta property="og:url" content={window.location.href} key="og:url" />
                <meta property="og:type" content="product" key="og:type" />
                <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
            </Helmet>
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <nav className="flex items-center gap-2 text-sm text-gray-600">
                    <Link to="/" className="hover:text-black">Home</Link>
                    <span>/</span>
                    <Link to={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-black">{product.category}</Link>
                    <span>/</span>
                    <span className="text-black font-medium">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square">
                            {product.badge && (
                                <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 text-sm font-bold z-10">
                                    {discount}% OFF
                                </div>
                            )}

                            {isVideo(currentImages[mainImage]) ? (
                                <video
                                    src={currentImages[mainImage]}
                                    className="w-full h-full object-cover"
                                    controls
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={currentImages[mainImage] || '/placeholder.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            <div className="absolute top-6 right-6 flex gap-3">
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 hover:bg-white'}`}
                                >
                                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {currentImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(idx)}
                                    className={`relative overflow-hidden rounded-xl transition-all ${mainImage === idx ? 'ring-4 ring-black' : 'ring-2 ring-gray-200 hover:ring-gray-400'}`}
                                >
                                    {isVideo(img) ? (
                                        <>
                                            <video src={img} className="w-24 h-24 object-cover" muted />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </>
                                    ) : (
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-24 h-24 object-cover" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3 text-sm">
                                <span className="text-gray-500 uppercase tracking-widest">{product.category}</span>
                            </div>
                            <h1 className="text-2xl font-black mb-4">{product.name}</h1>

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
                                <span className="font-semibold">{product.rating}</span>
                                <span className="text-gray-500">({product.reviews.length} reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 rounded-2xl pt-3 mb-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-black">{product.price}</span>
                                <span className="text-xl text-gray-400 line-through">{product.original}</span>
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    Save {discount}%
                                </span>
                            </div>
                        </div>

                        {/* Color */}
                        <div className="mb-8">
                            <h3 className="font-bold mb-4">Color: {product.colors[selectedColor]?.name}</h3>
                            <div className="flex gap-3">
                                {product.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedColor(idx);
                                            setMainImage(0);
                                        }}
                                        className={`relative w-10 h-10 rounded-full border-4 transition-all ${selectedColor === idx ? 'border-black scale-110' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {selectedColor === idx && <Check className="text-white absolute inset-0 m-auto" size={18} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div className="mb-8">
                            <h3 className="font-bold mb-4">Select Size</h3>
                            <div className="grid grid-cols-5 gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-4 border-2 rounded-xl font-bold text-lg transition-all ${selectedSize === size
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-200 hover:border-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="font-bold mb-4">Quantity</h3>
                            <div className="flex items-center">
                                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                                    <button onClick={() => handleQuantityChange('decrement')} className="px-6 py-4 hover:bg-gray-100">
                                        <Minus size={20} />
                                    </button>
                                    <span className="px-8 py-4 font-bold border-x-2 border-gray-200">{quantity}</span>
                                    <button onClick={() => handleQuantityChange('increment')} className="px-6 py-4 hover:bg-gray-100">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={addToCart}
                            disabled={!selectedSize}
                            className={`w-full bg-black text-white px-12 py-4 text-sm font-medium tracking-wider flex items-center justify-center gap-3 mb-4 rounded-[5px] ${!selectedSize ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
                        >
                            <ShoppingBag size={24} />
                            {selectedSize ? 'Add to Cart' : 'Please Select Size'}
                        </button>

                        <button className="w-full bg-black text-white px-12 py-4 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase rounded-[5px]">
                            Buy Now
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="mt-20 lg:col-span-2">
                        <div className="border-b border-gray-200">
                            <div className="flex gap-8">
                                {['description', 'features', 'reviews'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 font-semibold uppercase text-sm tracking-wider relative ${activeTab === tab ? 'text-black' : 'text-gray-500'}`}
                                    >
                                        {tab === 'description' ? 'Description' : tab === 'features' ? 'Features' : 'Reviews'}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                                    </button>
                                ))}
                            </div>
                        </div>

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
                                    </div>

                                    {product.reviews.map((rl, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 mb-8"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold">
                                                        {rl.name?.[0]}
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{rl.name}</h4>
                                                        <p className="text-xs text-gray-500">Verified Buyer</p>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={18}
                                                            className={
                                                                i < rl.star
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 leading-relaxed text-sm">
                                                {rl.review}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                                                <span>{rl.date || "2 days ago"}</span>
                                                <span className="italic">Purchased Product</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="lg:col-span-2 mt-10 border-t border-gray-200 pt-16">
                            <h2 className="text-3xl font-black text-center mb-12 uppercase">You May Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.map(relatedProduct => (
                                    <ProductCard key={relatedProduct.slug} product={relatedProduct} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
