import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';

// Same products data (baad mein context ya API se laa sakte ho)
const products = [
    { id: 1, slug: 'discipline-hoddie', name: 'Premium Oversized Tee', price: 'PKR 2,999', original: 'PKR 4,499', badge: '10% OFF', description: 'Experience ultimate comfort with our signature oversized fit. Made from 100% premium cotton with a heavy GSM for that perfect drape.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [{ name: 'Maroon', hex: '#8B0000', image: 'https://scontent.fkhi12-1.fna.fbcdn.net/v/t39.30808-6/586801820_122180025026590776_4446351793559053746_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=EjfSqHhl3c8Q7kNvwE6CIsR&_nc_oc=Adk395kGQI9tpb4HnVcbDYIT-eBjjM2EH6HhYQkfAh1sXMsagF7bV3EF9_N-nfho8Jo&_nc_zt=23&_nc_ht=scontent.fkhi12-1.fna&_nc_gid=xI9EnpKXx2nOYE4pHV9j8Q&oh=00_AfgahGSPHEF1RaTf7hnG2XUcxBynnFdEHYl2PHosiOhd0Q&oe=692F9904' }, { name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }, { name: 'White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1578932750294-708afda11a11?w=800' }] },


    { id: 2, slug: 'luxury-hoodie', name: 'Luxury Hoodie', price: 'PKR 3,999', original: 'PKR 7,999', badge: '50% OFF', description: 'Ultra-soft fleece lining with premium stitching. Perfect for winter.', sizes: ['M', 'L', 'XL'], colors: [{ name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800' }] },
    // Baqi products add kar sakte ho baad mein
];

export default function ProductDetail() {
    const { slug } = useParams();
    const product = products.find(p => p.slug === slug);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);

    if (!product) {
        return (
            <div className="pt-32 text-center">
                <h1 className="text-4xl font-bold">Product Not Found</h1>
                <Link to="/" className="text-blue-600">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 inline-flex">
                    <ArrowLeft size={20} /> Back to Shop
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Images */}
                    <div>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                            <img src={product.colors[selectedColor].image} alt={product.name} className="w-full h-96 md:h-full object-cover" />
                        </div>
                        <div className="flex gap-4 mt-6">
                            {product.colors.map((color, idx) => (
                                <button key={idx} onClick={() => setSelectedColor(idx)} className={`rounded-lg overflow-hidden border-4 transition-all ${selectedColor === idx ? 'border-black' : 'border-gray-300'}`}>
                                    <img src={color.image} alt={color.name} className="w-24 h-24 object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div>
                        <div className="mb-6">
                            <span className="bg-red-600 text-white px-4 py-2 text-sm font-bold uppercase">{product.badge}</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-bold text-red-600">{product.price}</span>
                            <span className="text-2xl text-gray-500 line-through">{product.original}</span>
                        </div>
                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">{product.description}</p>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Select Size</h3>
                            <div className="flex gap-4">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-16 h-16 border-2 rounded-lg font-medium transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div className="mb-10">
                            <h3 className="text-xl font-semibold mb-4">Color: {product.colors[selectedColor].name}</h3>
                            <div className="flex gap-4">
                                {product.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(idx)}
                                        className={`w-12 h-12 rounded-full border-4 transition-all ${selectedColor === idx ? 'border-black scale-125' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="w-full bg-black text-white py-5 text-xl font-bold rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-3">
                            <ShoppingBag size={28} />
                            Add to Cart
                        </button>

                        <div className="mt-8 flex items-center gap-8 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Check size={20} className="text-green-600" /> Free Shipping Above PKR 3000
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={20} className="text-green-600" /> Easy Returns
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}