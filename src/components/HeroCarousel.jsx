'use client';
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getHeroBanners } from "../lib/api";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [bannerSlides, setBannerSlides] = useState([
    {
      img: "/hero-section/5.png",
      title: "PAKN STREETWEAR",
      subtitle: "Luxury Oversized Heavyweight Collection",
      button_text: "SHOP NOW",
      button_link: "/shop",
    },
    {
      img: "/hero-section/6.png",
      title: "DROP SHOULDER ESSENTIALS",
      subtitle: "240 GSM Pure Cotton Streetwear Tees",
      button_text: "EXPLORE CATALOG",
      button_link: "/shop",
    },
    {
      img: "/hero-section/7.png",
      title: "EID SPECIAL SALE",
      subtitle: "Flat Discounts & Free Delivery All Over Pakistan",
      button_text: "CLAIM OFFER",
      button_link: "/shop",
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchBanners = () => {
      getHeroBanners()
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setBannerSlides(data);
          }
        })
        .catch(() => {
          // preserve default initial slides fallback
        });
    };

    fetchBanners();
    const handleFocus = () => fetchBanners();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black select-none">
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        effect="fade"
        loop={bannerSlides.length > 1}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        speed={1400}
        navigation={{ prevEl: ".hero-prev-btn", nextEl: ".hero-next-btn" }}
        onSlideChange={(s) => setActiveSlide(s.realIndex)}
        className="w-full"
      >
        {bannerSlides.map((slide, i) => (
          <SwiperSlide key={slide.id || i}>
            <div className="relative w-full h-[88vh] md:h-screen min-h-[580px] max-h-[1080px] overflow-hidden">
              {/* Background Image with Cinematic Framing */}
              <img
                src={slide.img}
                alt={slide.title || `Naaksh Hero Slide ${i + 1}`}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[7000ms] ease-out"
                loading={i === 0 ? "eager" : "lazy"}
              />

              {/* Multi-layered Cinematic Vignette Gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(to top, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.4) 30%, transparent 60%),
                    linear-gradient(to right, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.55) 45%, rgba(0,0,0,0.1) 100%),
                    linear-gradient(to bottom, rgba(9,9,11,0.6) 0%, transparent 25%)
                  `,
                }}
              />

              {/* Editorial Hero Content */}
              <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 z-10">
                <div className="max-w-2xl">
                  
                  {/* Eyebrow / Tagline Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4 sm:mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                    <span>{slide.subtitle || "NAAKSH HEAVYWEIGHT APPAREL"}</span>
                  </div>

                  {/* High-Impact Editorial Heading */}
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.92] drop-shadow-2xl mb-4 sm:mb-6">
                    {slide.title ? (
                      slide.title.includes(" ") ? (
                        <>
                          {slide.title.split(" ").slice(0, -1).join(" ")}{" "}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                            {slide.title.split(" ").slice(-1)}
                          </span>
                        </>
                      ) : (
                        slide.title
                      )
                    ) : (
                      <>
                        PAKN <span className="text-yellow-400">STREETWEAR</span>
                      </>
                    )}
                  </h1>

                  {/* Supporting Description */}
                  <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-normal tracking-wide leading-relaxed max-w-lg mb-8 sm:mb-10 line-clamp-2">
                    Engineered in Pakistan with 240 GSM combed compact cotton. Minimalist luxury oversized silhouettes crafted to make a bold cultural statement.
                  </p>

                  {/* Luxury CTA Button */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <Link
                      href={slide.button_link || "/shop"}
                      className="group inline-flex items-center gap-3 bg-yellow-400 hover:bg-white text-black font-extrabold px-8 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_8px_30px_rgba(245,197,24,0.35)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
                    >
                      <span>{slide.button_text || "EXPLORE THE DROP"}</span>
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold text-white/80 hover:text-white border border-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                    >
                      OUR CULTURE
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating Glassmorphic Slide Navigation Controls */}
      <div className="hidden sm:flex absolute right-8 bottom-12 z-20 items-center gap-3">
        <button
          className="hero-prev-btn w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-yellow-400 hover:border-yellow-400 hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="hero-next-btn w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-yellow-400 hover:border-yellow-400 hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Modern Slide Counter Pill */}
      <div className="absolute left-6 sm:left-12 bottom-8 sm:bottom-12 z-20 flex items-center gap-3 text-xs font-mono tracking-widest text-zinc-400 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <span className="text-yellow-400 font-bold text-sm">0{activeSlide + 1}</span>
        <span className="w-8 h-[1px] bg-zinc-700" />
        <span>0{bannerSlides.length}</span>
      </div>
    </section>
  );
}
