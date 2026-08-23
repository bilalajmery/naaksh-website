'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      text: "The quality is unmatched. I've washed this hoodie 20 times and it still feels brand new. Naaksh is onto something big.",
      name: "Moiz Ali",
      title: "Verified Buyer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop",
    },
    {
      text: "Fastest shipping I've experienced in Pakistan. The packaging was so premium I didn't want to open it. 10/10 experience.",
      name: "Fatima Khan",
      title: "Verified Buyer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      text: "Finally a streetwear brand that gets the fit right. Oversized but not sloppy. The drop shoulder detail is fire.",
      name: "Abdullah R.",
      title: "Fashion Enthusiast",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      text: "Customer service was super helpful with sizing. Exchanged my size in 2 days. This is how ecommerce should be done.",
      name: "Zoya Ahmed",
      title: "Verified Buyer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-inner">
        <div className="testimonials-header">
          <div>
            <span className="section-tag">Community Love</span>
            <h2 className="section-heading">What Our <em>Customers</em><br />Are Saying</h2>
          </div>
          <div className="testimonials-trust">
            <div className="trust-avatars">
              {[31, 32, 33, 34].map((n) => (
                <div key={n} className="trust-avatar">
                  <img src={`https://i.pravatar.cc/100?img=${n}`} alt="" />
                </div>
              ))}
            </div>
            <div>
              <div className="trust-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="trust-star">★</span>
                ))}
              </div>
              <div className="trust-count">4.9 / 5</div>
              <div className="trust-text">10,000+ satisfied customers</div>
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
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="testimonials-swiper pb-14"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="t-card">
                <div className="t-stars">
                  {[...Array(t.rating)].map((_, idx) => (
                    <svg key={idx} className="t-star" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="t-quote">{t.text}</p>
                <div className="t-divider" />
                <div className="t-author">
                  <img src={t.avatar} alt={t.name} className="t-avatar" />
                  <div>
                    <div className="t-name">{t.name}</div>
                    <span className="t-badge">{t.title}</span>
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
