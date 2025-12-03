// src/pages/Home.js
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade, Pagination } from "swiper/modules";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // CHANGE ONLY THIS ONE LINE → FULL COLLECTION SECTION CHANGES
  const featuredCategory = "Hoodies";

  // Fetch Products + Categories in Parallel
  useEffect(() => {
    Promise.all([
      fetch("/product/data.json").then((r) => (r.ok ? r.json() : [])),
      fetch("/category/data.json").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([productData, categoryData]) => {
        // Sort products newest first
        const sortedProducts = productData.sort((a, b) => (b.id || 0) - (a.id || 0));
        setProducts(sortedProducts);
        setCategories(categoryData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  // Latest 8 products → New Arrivals
  const newArrivals = products.slice(0, 8);

  // Latest 8 from featured category
  const featuredProducts = products.filter((p) => p.category === featuredCategory).slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  const bannerImages = [
    "/hero-section/1.jpg",
    "/hero-section/2.jpg",
    "/hero-section/3.jpg",
    "/hero-section/4.jpg",
  ];

  const testimonials = [
    {
      text: "Working with NAAKSH transformed our business approach...",
      name: "Sarah Mitchell",
      title: "CEO, TechVision Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      text: "The level of professionalism and expertise NAAKSH brings is unmatched...",
      name: "Michael Chen",
      title: "Director of Operations, Innovate Labs",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    {
      text: "NAAKSH's commitment to excellence is evident in every interaction...",
      name: "Emily Rodriguez",
      title: "Founder, Creative Solutions",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      text: "Their strategic insights and execution capabilities have positioned us ahead...",
      name: "David Thompson",
      title: "VP of Strategy, Global Dynamics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
  ];

  return (
    <>
      <div className="pt-18">
        {/* HERO BANNER */}
        <section className="relative h-screen">
          <Swiper
            modules={[Navigation, Autoplay, EffectFade]}
            effect="fade"
            loop
            autoplay={{ delay: 4000 }}
            speed={1200}
            navigation={{ prevEl: ".prev", nextEl: ".next" }}
            pagination={{ clickable: true }}
            className="h-full"
          >
            {bannerImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative h-full">
                  <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black opacity-10" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="prev absolute left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
            <div className="w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ChevronLeft size={32} className="text-white" />
            </div>
          </div>
          <div className="next absolute right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
            <div className="w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ChevronRight size={32} className="text-white" />
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter">
              NEW <span className="text-yellow-400">ARRIVALS</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="text-center mt-16">
              <NavLink
                to="/shop"
                className="inline-block bg-black text-white px-12 py-4 text-sm font-medium tracking-wider hover:bg-gray-900 uppercase rounded"
              >
                <span className="text-yellow-400">See All Products</span>
              </NavLink>
            </div>
          </div>
        </section>

        {/* SHOP BY CATEGORY → FROM /category/data.json */}
        <section className="py-24 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter">
              SHOP BY <span className="text-yellow-400">CATEGORY</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
              {categories.map((cat) => (
                <NavLink
                  key={cat.slug}
                  to={`/shop?category=${cat.name}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-900 border border-gray-800 hover:border-yellow-600 transition-all duration-500"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full">
                    <h3 className="text-white-400 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {cat.name.toUpperCase()}
                    </h3>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </section>

        {/* DYNAMIC COLLECTION SECTION */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter">
              {featuredCategory.toUpperCase()} <span className="text-yellow-400">COLLECTION</span>
            </h2>

            {featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {featuredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <div className="text-center mt-16">
                  <NavLink
                    to={`/shop?category=${featuredCategory}`}
                    className="inline-block bg-black text-white px-12 py-4 text-sm font-medium tracking-wider hover:bg-gray-900 uppercase rounded"
                  >
                    <span className="text-yellow-400">Shop {featuredCategory} Collection</span>
                  </NavLink>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600 text-xl">No products in {featuredCategory} yet.</p>
            )}
          </div>
        </section>

        {/* VIDEO SECTION */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="https://viewnshop.com/assets/sample-DP2YW5i1.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                STYLE MEETS <span className="text-yellow-400">COMFORT</span>
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience premium streetwear designed for the modern lifestyle. Quality fabrics, timeless
                designs, unbeatable comfort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink
                  to="/shop"
                  className="bg-yellow-400 text-black px-10 py-4 text-sm font-bold tracking-wider hover:bg-yellow-500 transition-colors uppercase rounded-[5px]"
                >
                  Shop Now
                </NavLink>
                <NavLink
                  to="/about"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-10 py-4 text-sm font-bold tracking-wider hover:bg-white/20 transition-colors uppercase rounded-[5px]"
                >
                  Our Story
                </NavLink>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-28 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
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
                Discover how organizations worldwide are achieving remarkable results with NAAKSH's innovative
                solutions
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
                pauseOnMouseEnter: true,
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

                      <blockquote className="text-gray-700 text-base leading-relaxed mb-8 grow">
                        {testimonial.text}
                      </blockquote>

                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-yellow-500" viewBox="0 0 24 24">
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
                          <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                          <p className="text-yellow-600 text-sm font-medium">{testimonial.title}</p>
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
