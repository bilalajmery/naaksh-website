'use client';
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const bannerSlides = [
    { img: "/hero-section/5.png" },
    { img: "/hero-section/6.png" },
    { img: "/hero-section/7.png" },
  ];

  return (
    <section style={{ position: "relative", width: "100%" }}>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1400}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        onSlideChange={(s) => setActiveSlide(s.realIndex)}
        className="w-full"
      >
        {bannerSlides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="home-hero-slide">
              <img src={slide.img} alt="" />
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
