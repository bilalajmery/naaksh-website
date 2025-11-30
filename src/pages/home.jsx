import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
    const [selectedColors, setSelectedColors] = useState({});

    const handleColorClick = (productId, colorIndex) => {
        setSelectedColors(prev => ({ ...prev, [productId]: colorIndex }));
    };

    const products = [
        {
            id: 1,
            slug: "discipline-hoodie",
            name: "Discipline Hoodie",
            category: "Hoodies",
            price: "PKR 1,199",
            original: "PKR 2,399",
            badge: "SALE",
            colors: [
                { hex: "#ffffff", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800", "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800"] },
                { hex: "#000000", images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800"] }
            ]
        },
        {
            id: 2,
            slug: "luxury-hoodie",
            name: "Luxury Hoodie",
            category: "Hoodies",
            price: "PKR 3,999",
            original: "PKR 7,999",
            badge: "SALE",
            colors: [{ hex: "#000000", images: ["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800", "https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800"] }]
        },
        {
            id: 3,
            slug: "premium-jacket",
            name: "Premium Jacket",
            category: "Jackets",
            price: "PKR 5,999",
            badge: "NEW",
            colors: [{ hex: "#2F4F4F", images: ["https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800"] }]
        },
        {
            id: 4,
            slug: "classic-overshirt",
            name: "Classic Overshirt",
            category: "Shirts",
            price: "PKR 3,699",
            original: "PKR 5,499",
            badge: "SALE",
            colors: [{ hex: "#000000", images: ["https://images.unsplash.com/photo-1596777684687-81ce907fb5ec?w=800"] }]
        },
        {
            id: 5,
            slug: "minimal-tshirt",
            name: "Minimal T-Shirt",
            category: "T-Shirts",
            price: "PKR 1,999",
            badge: "NEW",
            colors: [{ hex: "#ffffff", images: ["https://images.unsplash.com/photo-1578932750294-708afda11a11?w=800"] }]
        },
        {
            id: 6,
            slug: "urban-hoodie",
            name: "Urban Hoodie",
            category: "Hoodies",
            price: "PKR 4,299",
            colors: [{ hex: "#1a1a1a", images: ["https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800"] }]
        },
        {
            id: 7,
            slug: "street-jacket",
            name: "Street Jacket",
            category: "Jackets",
            price: "PKR 5,999",
            badge: "SALE",
            colors: [{ hex: "#696969", images: ["https://images.unsplash.com/photo-1539533057440-7814baea1002?w=800"] }]
        },
        {
            id: 8,
            slug: "premium-joggers",
            name: "Premium Joggers",
            category: "Bottoms",
            price: "PKR 2,299",
            badge: "NEW",
            colors: [{ hex: "#000000", images: ["https://images.unsplash.com/photo-1506629082847-11d3e392e175?w=800"] }]
        },
    ];

    // WINTER COLLECTION - ALAG SE BEAUTIFUL ARRAY
    const winterProducts = [
        {
            id: 101,
            slug: "puffer-jacket-black",
            name: "Premium Puffer Jacket",
            category: "Jackets",
            price: "PKR 8,999",
            original: "PKR 14,999",
            badge: "SALE",
            colors: [
                { hex: "#000000", images: ["https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800", "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800"] },
                { hex: "#2d2d2d", images: ["https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800"] }
            ]
        },
        {
            id: 102,
            slug: "arctic-hoodie",
            name: "Arctic Fleece Hoodie",
            category: "Hoodies",
            price: "PKR 4,999",
            badge: "NEW",
            colors: [
                { hex: "#1e293b", images: ["https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800"] },
                { hex: "#475569", images: ["https://images.unsplash.com/photo-1622445275576-904b19c709b9?w=800"] }
            ]
        },
        {
            id: 103,
            slug: "wool-blend-coat",
            name: "Wool Blend Overcoat",
            category: "Jackets",
            price: "PKR 12,999",
            badge: "LIMITED",
            colors: [{ hex: "#1c1917", images: ["https://images.unsplash.com/photo-1592878844890-9ba3dd8c95a9?w=800"] }]
        },
        {
            id: 104,
            slug: "sherpa-lined-hoodie",
            name: "Sherpa Lined Hoodie",
            category: "Hoodies",
            price: "PKR 5,499",
            original: "PKR 7,999",
            badge: "SALE",
            colors: [
                { hex: "#8b7355", images: ["https://images.unsplash.com/photo-1605346435043-7c2c1d7d37a2?w=800"] },
                { hex: "#292524", images: ["https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800"] }
            ]
        },
        {
            id: 105,
            slug: "cargo-winter-pants",
            name: "Insulated Cargo Pants",
            category: "Bottoms",
            price: "PKR 4,299",
            badge: "NEW",
            colors: [{ hex: "#1a1a1a", images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"] }]
        },
        {
            id: 106,
            slug: "bomber-jacket-premium",
            name: "Leather Touch Bomber",
            category: "Jackets",
            price: "PKR 9,999",
            badge: "BEST SELLER",
            colors: [{ hex: "#0f0f0f", images: ["https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800"] }]
        },
        {
            id: 107,
            slug: "thermal-hoodie-grey",
            name: "Thermal Tech Hoodie",
            category: "Hoodies",
            price: "PKR 4,799",
            badge: "NEW",
            colors: [
                { hex: "#374151", images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"] },
                { hex: "#111111", images: ["https://images.unsplash.com/photo-1622445275576-904b19c709b9?w=800"] }
            ]
        },
        {
            id: 108,
            slug: "parka-jacket-olive",
            name: "Heavy Duty Parka",
            category: "Jackets",
            price: "PKR 11,999",
            original: "PKR 18,999",
            badge: "SALE",
            colors: [{ hex: "#3f4e3a", images: ["https://images.unsplash.com/photo-1517423732874-6d9cb7ab03e8?w=800"] }]
        }
    ];

    const bannerImages = [
        "/hero-section/1.jpg",
        "/hero-section/2.jpg",
        "/hero-section/3.jpg",
        "/hero-section/4.jpg",
    ];

    const testimonials = [
        {
            text: "Working with NAAKSH transformed our business approach. Their innovative solutions and dedicated team exceeded every expectation we had.",
            name: "Sarah Mitchell",
            title: "CEO, TechVision Inc.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
        },
        {
            text: "The level of professionalism and expertise NAAKSH brings is unmatched. They delivered results that significantly impacted our growth trajectory.",
            name: "Michael Chen",
            title: "Director of Operations, Innovate Labs",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
        },
        {
            text: "NAAKSH's commitment to excellence is evident in every interaction. They've become an invaluable partner in our success story.",
            name: "Emily Rodriguez",
            title: "Founder, Creative Solutions",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
        },
        {
            text: "Their strategic insights and execution capabilities have positioned us ahead of the competition. Truly exceptional service.",
            name: "David Thompson",
            title: "VP of Strategy, Global Dynamics",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
        }
    ];

    const ProductCard = ({ product }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const selectedColorIndex = selectedColors[product.id] ?? 0;
        const selectedColor = product.colors[selectedColorIndex];

        // Get all images for the selected color
        const images = selectedColor.images || [selectedColor.image];
        const currentImage = images[currentImageIndex] || selectedColor.image;

        return (
            <NavLink
                to={`/product/${product.slug}`}
                className="block group"
                onMouseEnter={() => images.length > 1 && setCurrentImageIndex(1)}
                onMouseLeave={() => setCurrentImageIndex(0)}
            >
                <div className="relative bg-white overflow-hidden transition-all duration-300">

                    {/* Badge */}
                    {product.badge && (
                        <div className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-widest z-10 uppercase ${product.badge === 'SALE'
                            ? 'bg-black text-white'
                            : 'bg-white text-black border border-black'
                            }`}>
                            {product.badge}
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Quick Add Button - Appears on Hover */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Add to cart logic
                                }}
                                className="w-full bg-black text-white py-3 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="pt-4 pb-2">
                        {/* Category */}
                        <p className="text-[10px] font-medium tracking-widest text-gray-500 mb-2 uppercase">
                            {product.category}
                        </p>

                        {/* Product Name */}
                        <h3 className="text-sm font-medium mb-2 text-gray-900 group-hover:text-black transition-colors">
                            {product.name}
                        </h3>

                        {/* Color Swatches */}
                        {product.colors.length > 1 && (
                            <div className="flex gap-1.5 mb-3">
                                {product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleColorClick(product.id, index);
                                        }}
                                        className={`w-5 h-5 rounded-full border transition-all ${selectedColorIndex === index
                                            ? 'border-2 border-black ring-1 ring-gray-300'
                                            : 'border border-gray-300 hover:border-gray-400'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        aria-label={`Color option ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-semibold text-black">
                                {product.price}
                            </span>
                            {product.original && (
                                <span className="text-xs text-gray-400 line-through">
                                    {product.original}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </NavLink>
        );
    };

    return (
        <>
            <div className="pt-18">

                {/* BANNER SLIDER */}
                <section className="relative h-screen">
                    <Swiper
                        modules={[Navigation, Autoplay, EffectFade]}
                        effect="fade"
                        loop={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        speed={1200}
                        navigation={{
                            prevEl: '.custom-swiper-button-prev',
                            nextEl: '.custom-swiper-button-next',
                        }}
                        pagination={{ clickable: true }}
                        className="h-full"
                    >
                        {bannerImages.map((img, i) => (
                            <SwiperSlide key={i}>
                                <div className="relative h-full w-full">
                                    <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black opacity-10"></div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="custom-swiper-button-prev absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                        <div className="w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300">
                            <ChevronLeft size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="custom-swiper-button-next absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                        <div className="w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300">
                            <ChevronRight size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                        <div className="swiper-pagination !w-auto"></div>
                    </div>
                </section>

                {/* NEW ARRIVALS */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter">
                            NEW <span className="text-yellow-400">ARRIVALS</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>

                        {/* See All Button */}
                        <div className="flex justify-center mt-18">
                            <NavLink
                                to="/products"
                                className="bg-black text-white px-12 py-4 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase rounded-[5px]"
                            >
                                <span className="text-yellow-400"> See All Products</span>
                            </NavLink>
                        </div>
                    </div>
                </section>

                {/* SHOP BY CATEGORY */}
                <section className="py-24 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter">
                            SHOP BY <span className="text-yellow-400">CATEGORY</span>
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {[
                                { name: 'HOODIES', slug: 'shop?category=Hoodies', img: '/product/discipline-hoddie/white.jpg' },
                                { name: 'JACKETS', slug: 'jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800' },
                                { name: 'T-SHIRTS', slug: 'tshirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' },
                                { name: 'JOGGERS', slug: 'joggers', img: 'https://images.unsplash.com/photo-1506629082847-11d3e392e175?w=800' },
                                { name: 'SHIRTS', slug: 'shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800' },
                                { name: 'ACCESSORIES', slug: 'accessories', img: 'https://images.unsplash.com/photo-1523177778857-3e9e8e162dc9?w=800' }
                            ].map((cat) => (
                                <NavLink
                                    key={cat.slug}
                                    to={`/${cat.slug}`}
                                    className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-900 border border-gray-800 hover:border-yellow-600 transition-all duration-500"
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                                        <h3 className="text-2xl font-bold tracking-wider">{cat.name}</h3>
                                        <p className="text-yellow-400 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Shop Now →
                                        </p>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WINTER COLLECTION - CLEAN & SEPARATE */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter">
                            WINTER <span className="text-yellow-400">COLLECTION</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {winterProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="flex justify-center mt-18">
                            <NavLink
                                to="/shop?collection=winter"
                                className="bg-black text-white px-12 py-4 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase rounded-[5px]"
                            >
                                <span className="text-yellow-400">Shop Winter Collection</span>
                            </NavLink>
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <p className="text-yellow-600 font-semibold text-sm uppercase tracking-wider mb-3">
                                Client Testimonials
                            </p>
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                                Trusted by Industry <span className="text-yellow-500">Leaders</span>
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                                Discover how organizations worldwide are achieving remarkable results with NAAKSH's innovative solutions
                            </p>
                        </div>

                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={32}
                            slidesPerView={1}
                            breakpoints={{
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            loop={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            speed={800}
                            className="pb-20"
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={index}>
                                    <div className="h-full px-2">
                                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100 hover:border-yellow-400/40 group">
                                            <div className="mb-6">
                                                <svg
                                                    className="w-12 h-12 text-yellow-500/20 group-hover:text-yellow-500/40 transition-colors duration-300"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                                </svg>
                                            </div>

                                            <blockquote className="text-gray-700 text-base leading-relaxed mb-8 flex-grow">
                                                {testimonial.text}
                                            </blockquote>

                                            <div className="flex gap-1 mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className="w-5 h-5 fill-yellow-500"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-yellow-500/20 group-hover:ring-yellow-500/40 transition-all duration-300"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-lg">
                                                        {testimonial.name}
                                                    </h4>
                                                    <p className="text-yellow-600 text-sm font-medium">
                                                        {testimonial.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="mt-16 text-center">
                            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                    <span className="text-sm font-medium">4.9/5 Average Rating</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                    <span className="text-sm font-medium">500+ Happy Clients</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                    </svg>
                                    <span className="text-sm font-medium">10+ Years Excellence</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
                        .swiper-pagination-bullet {
                            background: #eab308;
                            opacity: 0.3;
                        }
                        .swiper-pagination-bullet-active {
                            opacity: 1;
                        }
                    `}</style>
                </section>

            </div>
        </>
    );
}