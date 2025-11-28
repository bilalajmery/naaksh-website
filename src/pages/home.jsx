import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
        { id: 1, slug: "discipline-hoodie", name: "Discipline Hoodie", price: "PKR 1,199", original: "PKR 2,399", badge: "50% OFF", colors: [{ hex: "#ffffff", image: "https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800" }, { hex: "#000000", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" }] },
        { id: 2, slug: "luxury-hoodie", name: "Luxury Hoodie", price: "PKR 3,999", original: "PKR 7,999", badge: "SALE", colors: [{ hex: "#000000", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800" }] },
        { id: 3, slug: "premium-jacket", name: "Premium Jacket", price: "PKR 5,999", badge: "NEW", colors: [{ hex: "#2F4F4F", image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800" }] },
        { id: 4, slug: "classic-overshirt", name: "Classic Overshirt", price: "PKR 3,699", original: "PKR 5,499", badge: "SALE", colors: [{ hex: "#000000", image: "https://images.unsplash.com/photo-1596777684687-81ce907fb5ec?w=800" }] },
        { id: 5, slug: "minimal-tshirt", name: "Minimal T-Shirt", price: "PKR 1,999", badge: "NEW", colors: [{ hex: "#ffffff", image: "https://images.unsplash.com/photo-1578932750294-708afda11a11?w=800" }] },
        { id: 6, slug: "urban-hoodie", name: "Urban Hoodie", price: "PKR 4,299", badge: "HOT", colors: [{ hex: "#1a1a1a", image: "https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800" }] },
        { id: 7, slug: "street-jacket", name: "Street Jacket", price: "PKR 5,999", badge: "SALE", colors: [{ hex: "#696969", image: "https://images.unsplash.com/photo-1539533057440-7814baea1002?w=800" }] },
        { id: 8, slug: "premium-joggers", name: "Premium Joggers", price: "PKR 2,299", badge: "NEW", colors: [{ hex: "#000000", image: "https://images.unsplash.com/photo-1506629082847-11d3e392e175?w=800" }] },
    ];

    const bannerImages = [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&h=1080&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1920&h=1080&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1441986300917-64672611734d?w=1920&h=1080&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=1920&h=1080&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&h=1080&fit=crop&auto=format",
    ];

    const ProductCard = ({ product }) => {
        const selectedColorIndex = selectedColors[product.id] ?? 0;
        const selectedColor = product.colors[selectedColorIndex];

        return (
            <NavLink to={`/product/${product.slug}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">

                    {/* Image Section */}
                    <div className="relative overflow-hidden aspect-square">
                        <img
                            src={selectedColor.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute top-5 right-5 ${product.badge === 'SALE'
                            ? 'bg-red-600'
                            : product.badge === 'NEW'
                                ? 'bg-emerald-600'
                                : 'bg-amber-600'} 
              text-white px-5 py-2.5 font-bold text-xs uppercase tracking-widest rounded-full shadow-xl`}>
                            {product.badge}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-black transition line-clamp-2">
                            {product.name}
                        </h3>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-2xl font-bold text-black">{product.price}</span>
                            {product.original && (
                                <span className="text-lg text-gray-400 line-through">{product.original}</span>
                            )}
                        </div>

                        {/* Color Selector */}
                        <div className="flex gap-3 mt-auto">
                            {product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleColorClick(product.id, index);
                                    }}
                                    className={`w-9 h-9 rounded-full border-4 transition-all duration-300 ${selectedColorIndex === index
                                            ? 'border-black ring-4 ring-black/20 scale-110 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-600'
                                        }`}
                                    style={{ backgroundColor: color.hex }}
                                    aria-label={`Color ${color.name || index + 1}`}
                                />
                            ))}
                            {product.colors.length > 5 && (
                                <span className="text-sm font-medium text-gray-500 self-center">
                                    +{product.colors.length - 5}
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
            <div className="pt-20">

                {/* BANNER SLIDER – NO TEXT, ARROWS WORKING & CENTERED */}
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

                    {/* Left Arrow – Perfect Center */}
                    <div className="custom-swiper-button-prev absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                        <div className="w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300">
                            <ChevronLeft size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Right Arrow – Perfect Center */}
                    <div className="custom-swiper-button-next absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                        <div className="w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300">
                            <ChevronRight size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Dots at Bottom */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                        <div className="swiper-pagination !w-auto"></div>
                    </div>
                </section>

                {/* NEW ARRIVALS */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter">NEW ARRIVALS</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}