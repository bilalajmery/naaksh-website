'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      text: "The quality is unmatched. I've washed this drop shoulder hoodie over 20 times and it still feels brand new. Naaksh is redefining Pakistani streetwear.",
      name: "Moiz Ali",
      title: "Verified Customer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop",
    },
    {
      text: "Fastest shipping I've experienced in Pakistan. The packaging was so premium I didn't want to open it. Heavyweight cotton feels incredible.",
      name: "Fatima Khan",
      title: "Verified Customer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      text: "Finally a streetwear brand that gets the fit right. Oversized but structured. The drop shoulder detail and collar ribbing are fire.",
      name: "Abdullah R.",
      title: "Streetwear Enthusiast",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      text: "Customer service was super helpful with sizing. Exchanged my size in 2 days without any hassle. This is how premium ecommerce should feel.",
      name: "Zoya Ahmed",
      title: "Verified Customer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#09090b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
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
              {[31, 32, 33, 34].map((n) => (
                <img
                  key={n}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#09090b] object-cover"
                  src={`https://i.pravatar.cc/100?img=${n}`}
                  alt="Community avatar"
                />
              ))}
            </div>
            <div className="border-l border-white/10 pl-4">
              <div className="flex items-center gap-1 text-yellow-400 text-xs">
                {"★★★★★"}
                <span className="text-white font-bold text-xs ml-1">4.9 / 5</span>
              </div>
              <p className="text-[10px] font-medium text-zinc-400 tracking-wide uppercase mt-0.5">
                10,000+ Satisfied Drops
              </p>
            </div>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="testimonials-swiper pb-14"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i} className="h-auto">
              <div className="h-full flex flex-col justify-between p-8 bg-[#0d0d0f] border border-white/5 hover:border-yellow-400/30 transition-all duration-300 rounded-none relative">
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-yellow-400 text-sm mb-6">
                    {[...Array(t.rating)].map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed italic mb-8">
                    "{t.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-yellow-400/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      {t.name}
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
