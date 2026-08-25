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
    { img: "/hero-section/5.png" },
    { img: "/hero-section/6.png" },
    { img: "/hero-section/7.png" },
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
    <section style={{ position: "relative", width: "100%" }}>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        effect="fade"
        loop={bannerSlides.length > 1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1400}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        onSlideChange={(s) => setActiveSlide(s.realIndex)}
        className="w-full"
      >
        {bannerSlides.map((slide, i) => (
          <SwiperSlide key={slide.id || i}>
            <div className="home-hero-slide">
              <img src={slide.img} alt={slide.title || `Hero banner ${i + 1}`} />
              {(slide.title || slide.subtitle) && (
                <div className="home-hero-gradient">
                  <div className="home-hero-content">
                    {slide.subtitle && (
                      <span className="home-hero-label">{slide.subtitle}</span>
                    )}
                    {slide.title && (
                      <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight my-2">
                        {slide.title}
                      </h1>
                    )}
                    {slide.button_text && (
                      <div className="mt-4">
                        <Link
                          href={slide.button_link || "/shop"}
                          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-105"
                        >
                          <span>{slide.button_text}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Nav */}
      <div className="hero-prev">
        <div className="hero-nav-btn"><ChevronLeft size={20} /></div>
      </div>
      <div className="hero-next">
        <div className="hero-nav-btn"><ChevronRight size={20} /></div>
      </div>

      {/* Slide Counter */}
      <div className="hero-counter">
        <span className="hero-counter-active">0{activeSlide + 1}</span>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>/</span>
        <span>0{bannerSlides.length}</span>
      </div>
    </section>
  );
}
