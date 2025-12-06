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

import { Helmet } from "react-helmet-async";

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
      text: "The quality is unmatched. I've washed this hoodie 20 times and it still feels brand new. Naaksh is onto something big.",
      name: "Moiz Ali",
      title: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop",
    },
    {
      text: "Fastest shipping I've experienced in Pakistan. The packaging was so premium I didn't want to open it. 10/10 experience.",
      name: "Fatima Khan",
      title: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      text: "Finally a streetwear brand that gets the fit right. Oversized but not sloppy. The drop shoulder detail is fire.",
      name: "Abdullah R.",
      title: "Fashion Enthusiast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      text: "Customer service was super helpful with sizing. Exchanged my size in 2 days. This is how ecommerce should be done.",
      name: "Zoya Ahmed",
      title: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Discover premium minimalist clothing and streetwear in Pakistan. Shop high-quality oversized t-shirts, hoodies, and more at Naaksh." />
      </Helmet>
      <div>
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
                className="inline-block bg-black text-white px-12 py-4 text-sm font-medium tracking-wider hover:bg-gray-600 cursor-pointer uppercase rounded"
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
                    className="inline-block bg-black text-white px-12 py-4 text-sm font-medium tracking-wider hover:bg-gray-600 cursor-pointer uppercase rounded"
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
        <section className="py-24 bg-white text-black relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-yellow-500 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full blur-[120px] opacity-20"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h4 className="text-yellow-600 font-bold tracking-widest uppercase mb-2">Community Love</h4>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black">
                  WE DON'T JUST SELL <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700">WE BUILD CULTURE</span>
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {/* Tiny avatars stack */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">Trusted by 10,000+ Customers</p>
                </div>
              </div>
            </div>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              className="pb-16 h-[400px]"
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white border border-gray-100 p-8 rounded-2xl h-[350px] flex flex-col hover:border-yellow-400 hover:shadow-xl transition-all duration-300 shadow-sm">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, idx) => (
                        <svg key={idx} className="w-5 h-5 fill-yellow-500" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow">"{t.text}"</p>
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500/20" />
                      <div>
                        <h4 className="font-bold text-black uppercase tracking-wider">{t.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {t.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <style>{`
            .swiper-pagination-bullet {
              background: #eab308;
              opacity: 0.3;
            }
            .swiper-pagination-bullet-active {
              opacity: 1;
              background: #eab308;
            }
          `}</style>
        </section>
      </div>
    </>
  );
}
