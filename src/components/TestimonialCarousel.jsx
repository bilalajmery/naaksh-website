'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      text: "Bro the 240 GSM drop shoulder fit is insane. Fabric proper heavyweight hai aur 15+ wash ke baad bhi collar shape bilkul crisp hai. Total streetwear aesthetic!",
      name: "Hamza Sheikh",
      city: "Lahore",
      title: "Verified Customer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    },
    {
      text: "Packaging was super aesthetic and delivery was within 2 days in Karachi. Oversized drape is on point, pure Pinterest streetwear vibes. 10/10 cop!",
      name: "Areeba Tariq",
      city: "Karachi",
      title: "Verified Customer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    },
    {
      text: "Finally a Pakistani brand delivering legit heavyweight quality. Graphic prints crack nahi hotay aur drop shoulder cut goes hard with baggy cargos.",
      name: "Daniyal Shah",
      city: "Islamabad",
      title: "Streetwear Enthusiast",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
    },
    {
      text: "No cap, best oversized tees in Pakistan. Combed cotton breathable hai aur fitting loose yet structured lagti hai. Already ordered 2 more tees!",
      name: "Shahmeer Khan",
      city: "Lahore",
      title: "Verified Customer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face",
    },
    {
      text: "Customer support on WhatsApp was super responsive. Size exchange smoothly 2 din mein ho gaya. Quality and fabric feel is truly luxury level.",
      name: "Zainab Malik",
      city: "Rawalpindi",
      title: "Verified Customer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#09090b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span>COMMUNITY VOICES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              WHAT OUR <span className="text-yellow-400">COMMUNITY</span> SAYS
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-[#0d0d0f] border border-white/5 px-5 py-3 rounded-xl">
            <div className="flex -space-x-2 overflow-hidden">
              {testimonials.slice(0, 4).map((t, idx) => (
                <img
                  key={idx}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#09090b] object-cover"
                  src={t.avatar}
                  alt={t.name}
                />
              ))}
            </div>
            <div className="border-l border-white/10 pl-4">
              <div className="flex items-center gap-1 text-yellow-400 text-xs">
                {"★★★★★"}
                <span className="text-white font-bold text-xs ml-1">4.9 / 5</span>
              </div>
              <p className="text-[10px] font-medium text-zinc-400 tracking-wide uppercase mt-0.5">
                10,000+ Satisfied Drops in PK
              </p>
            </div>
          </div>
        </div>

        {/* Swiper Slider without pagination dots and with uniform equal height */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          className="testimonials-swiper !pb-2"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i} className="!h-auto flex">
              <div className="w-full flex flex-col justify-between p-8 bg-[#0d0d0f] border border-white/5 hover:border-yellow-400/30 transition-all duration-300 rounded-none relative">
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-yellow-400 text-sm mb-5">
                    {[...Array(t.rating)].map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>

                  {/* Gen-Z Quote text */}
                  <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed italic mb-8">
                    "{t.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-white/5 mt-auto">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-yellow-400/40 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <span className="text-[10px] text-zinc-500 font-normal">({t.city})</span>
                    </h4>
                    <span className="inline-block text-[9px] font-black uppercase tracking-[0.15em] text-yellow-400 mt-0.5">
                      {t.title}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
