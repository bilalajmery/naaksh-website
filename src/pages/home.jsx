// src/pages/Home.js
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade, Pagination } from "swiper/modules";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Shield, Truck, RotateCcw, Star, ArrowRight, Package, Zap } from "lucide-react";

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
  const [activeSlide, setActiveSlide] = useState(0);
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef(null);

  // CHANGE ONLY THIS ONE LINE → FULL COLLECTION SECTION CHANGES
  const featuredCategory = "Drop Shoulder Tees";

  // Fetch Products + Categories in Parallel
  useEffect(() => {
    Promise.all([
      fetch("/product/data.json").then((r) => (r.ok ? r.json() : [])),
      fetch("/category/data.json").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([productData, categoryData]) => {
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

  // Intersection Observer for stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersStarted) {
          setCountersStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [countersStarted]);

  const newArrivalCategories = ["Drop Shoulder Tees"];
  const newArrivals = products
    .filter((p) => newArrivalCategories.includes(p.category))
    .slice(0, 8);

  const featuredProducts = products
    .filter((p) => p.isFeatured === true)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  const categoryFeaturedProducts = products
    .filter((p) => p.category === featuredCategory)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "56px", height: "56px",
            border: "3px solid #2a2a2a",
            borderTop: "3px solid #fdc700",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p style={{ color: "#999", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em", fontSize: "13px", textTransform: "uppercase" }}>
            Loading Collection...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const bannerSlides = [
    { img: "/hero-section/5.png" },
    { img: "/hero-section/6.png" },
    { img: "/hero-section/7.png" },
  ];

  const features = [
    { icon: <Truck size={22} />, title: "Free Delivery", sub: "All Over Pakistan" },
    { icon: <Shield size={22} />, title: "Premium Quality", sub: "Guaranteed Guarantee" },
    { icon: <RotateCcw size={22} />, title: "Easy Returns", sub: "Hassle-Free Exchange" },
    { icon: <Package size={22} />, title: "Secure Packaging", sub: "Arrives Perfectly" },
  ];

  const stats = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "50+", label: "Unique Designs" },
    { value: "4.9★", label: "Average Rating" },
    { value: "2-4", label: "Days Delivery" },
  ];

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
    <>
      <Helmet>
        <title>NAAKSH | Premium Streetwear & Urban Fashion in Pakistan</title>
        <meta name="description" content="Discover premium minimalist clothing and streetwear in Pakistan. Shop high-quality oversized t-shirts, hoodies, and more at Naaksh." />
        <meta property="og:title" content="NAAKSH | Premium Streetwear & Urban Fashion in Pakistan" />
        <meta property="og:description" content="Discover premium minimalist clothing and streetwear in Pakistan. Shop high-quality oversized t-shirts, hoodies, and more at Naaksh." />
        <meta property="og:url" content="https://naakshofficial.com" />
        <link rel="canonical" href="https://naakshofficial.com" />
      </Helmet>

      <style>{`
        /* ─── HOME PAGE STYLES ─────────────────────────────────── */
        .home-hero-slide { position: relative; width: 100%; overflow: hidden; }
        .home-hero-slide img { width: 100%; height: 100vh; object-fit: cover; display: block; }
        @media (max-width: 768px) { .home-hero-slide img { height: 85vh; } }
        .home-hero-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.78) 0%,
            rgba(0,0,0,0.40) 55%,
            rgba(0,0,0,0.05) 100%
          );
        }
        .home-hero-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 6vw;
          max-width: 700px;
        }
        .home-hero-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.2em;
          color: #fdc700; text-transform: uppercase;
          background: rgba(253,199,0,0.12);
          border: 1px solid rgba(253,199,0,0.3);
          padding: 6px 14px; border-radius: 100px;
          margin-bottom: 24px; width: fit-content;
        }
        .home-hero-label::before {
          content: ""; width: 6px; height: 6px;
          background: #fdc700; border-radius: 50%;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .home-hero-heading {
          font-size: clamp(40px, 7vw, 88px);
          font-weight: 900; line-height: 1.0;
          color: #fff; letter-spacing: -0.02em;
          margin: 0 0 20px; white-space: pre-line;
          text-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
        .home-hero-heading span { color: #fdc700; }
        .home-hero-sub {
          font-size: 15px; color: rgba(255,255,255,0.7);
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 36px; font-weight: 500;
        }
        .home-hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: #fdc700; color: #000;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 16px 32px; border-radius: 4px;
          text-decoration: none;
          transition: all 0.3s ease;
          width: fit-content;
          box-shadow: 0 8px 30px rgba(253,199,0,0.35);
        }
        .home-hero-cta:hover {
          background: #fff; color: #000;
          box-shadow: 0 12px 40px rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .home-hero-cta svg { transition: transform 0.3s; }
        .home-hero-cta:hover svg { transform: translateX(4px); }

        /* Swiper nav buttons */
        .hero-prev, .hero-next {
          position: absolute; top: 50%; z-index: 20; cursor: pointer;
          transform: translateY(-50%);
        }
        .hero-prev { left: 24px; }
        .hero-next { right: 24px; }
        @media (max-width: 768px) { .hero-prev { left: 12px; } .hero-next { right: 12px; } }
        .hero-nav-btn {
          width: 48px; height: 48px;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          border-radius: 50%; display: flex;
          align-items: center; justify-content: center;
          color: #fff; transition: all 0.3s;
        }
        .hero-nav-btn:hover { background: rgba(253,199,0,0.2); border-color: #fdc700; color: #fdc700; }

        /* Slide counter */
        .hero-counter {
          position: absolute; bottom: 32px; right: 40px;
          z-index: 20; font-size: 12px; font-weight: 700;
          color: rgba(255,255,255,0.6); letter-spacing: 0.1em;
          display: flex; align-items: center; gap: 8px;
        }
        .hero-counter-active { color: #fdc700; font-size: 20px; }

        /* ─── FEATURE STRIP ─── */
        .feature-strip {
          background: #111; border-top: 1px solid #1e1e1e;
          border-bottom: 1px solid #1e1e1e;
          padding: 20px 24px;
        }
        .feature-strip-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .feature-strip-grid { grid-template-columns: repeat(2,1fr); }
        }
        .feature-item {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 16px;
          border-right: 1px solid #222;
          color: #fff;
        }
        .feature-item:last-child { border-right: none; }
        @media (max-width: 768px) {
          .feature-item:nth-child(2) { border-right: none; }
        }
        .feature-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(253,199,0,0.1); border: 1px solid rgba(253,199,0,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #fdc700; flex-shrink: 0;
        }
        .feature-title { font-size: 13px; font-weight: 700; color: #fff; line-height: 1.2; }
        .feature-sub { font-size: 11px; color: #666; margin-top: 2px; }

        /* ─── SECTION HEADERS ─── */
        .section-tag {
          display: inline-block; font-size: 10px; font-weight: 800;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #fdc700; margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #fdc700;
        }
        .section-heading {
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -0.02em; color: #0d0d0d;
          margin: 0;
        }
        .section-heading.light { color: #fff; }
        .section-heading em { font-style: normal; color: #fdc700; }

        /* ─── SECTION CTA BUTTON ─── */
        .sec-cta {
          display: inline-flex; align-items: center; gap: 10px;
          border: 2px solid #0d0d0d; color: #0d0d0d;
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 14px 28px; text-decoration: none;
          transition: all 0.3s; border-radius: 4px;
          background: transparent;
        }
        .sec-cta:hover { background: #0d0d0d; color: #fdc700; }
        .sec-cta.inverted { border-color: #fdc700; color: #fdc700; background: transparent; }
        .sec-cta.inverted:hover { background: #fdc700; color: #000; }
        .sec-cta svg { transition: transform 0.3s; }
        .sec-cta:hover svg { transform: translateX(4px); }

        /* ─── FEATURED PRODUCTS ─── */
        .featured-section {
          padding: 80px 24px;
          background: #fafafa;
        }
        .featured-inner { max-width: 1280px; margin: 0 auto; }
        .featured-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px; gap: 20px;
          flex-wrap: wrap;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 20px;
        }
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; } }
        @media (max-width: 480px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }

        /* ─── CATEGORY SECTION ─── */
        .category-section { background: #0d0d0d; padding: 80px 24px; }
        .category-inner { max-width: 1280px; margin: 0 auto; }
        .category-header { margin-bottom: 48px; }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) { .category-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .category-grid { grid-template-columns: repeat(2, 1fr); } }
        .cat-card {
          position: relative; overflow: hidden;
          border-radius: 12px;
          aspect-ratio: 3/4;
          background: #1a1a1a;
          text-decoration: none;
          display: block;
          border: 1px solid #222;
          transition: border-color 0.3s, transform 0.3s;
        }
        .cat-card:hover { border-color: #fdc700; transform: translateY(-4px); }
        .cat-card img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.7s ease;
        }
        .cat-card:hover img { transform: scale(1.08); }
        .cat-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%);
        }
        .cat-card-name {
          position: absolute; bottom: 16px; left: 16px; right: 16px;
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #fff;
        }
        .cat-card-name .arrow {
          display: block; color: #fdc700; font-size: 16px;
          margin-top: 4px; opacity: 0;
          transform: translateX(-6px);
          transition: all 0.3s;
        }
        .cat-card:hover .cat-card-name .arrow {
          opacity: 1; transform: translateX(0);
        }

        /* ─── COLLECTION SECTION ─── */
        .collection-section { padding: 80px 24px; background: #fff; }
        .collection-inner { max-width: 1280px; margin: 0 auto; }

        /* ─── PROMO BANNER ─── */
        .promo-section { width: 100%; overflow: hidden; }
        .promo-section a { display: block; }
        .promo-section img { width: 100%; height: auto; display: block; }

        /* ─── STATS SECTION ─── */
        .stats-section {
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a00 50%, #0d0d0d 100%);
          padding: 64px 24px;
          border-top: 1px solid #222;
          border-bottom: 1px solid #222;
        }
        .stats-inner {
          max-width: 900px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 32px; text-align: center;
        }
        @media (max-width: 640px) { .stats-inner { grid-template-columns: repeat(2,1fr); gap: 24px; } }
        .stat-value {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 900; color: #fdc700;
          line-height: 1; letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 12px; font-weight: 600;
          color: #888; letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ─── TESTIMONIALS ─── */
        .testimonials-section {
          padding: 80px 24px; background: #fff;
          position: relative; overflow: hidden;
        }
        .testimonials-inner { max-width: 1280px; margin: 0 auto; }
        .testimonials-header {
          display: flex; justify-content: space-between;
          align-items: flex-end; margin-bottom: 48px; gap: 20px; flex-wrap: wrap;
        }
        .testimonials-trust {
          display: flex; align-items: center; gap: 16px;
        }
        .trust-avatars { display: flex; }
        .trust-avatar {
          width: 40px; height: 40px;
          border-radius: 50%; border: 2px solid #fff;
          overflow: hidden; margin-left: -10px;
          background: #eee;
        }
        .trust-avatar:first-child { margin-left: 0; }
        .trust-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .trust-text { font-size: 11px; color: #888; }
        .trust-stars { display: flex; gap: 2px; margin-bottom: 3px; }
        .trust-star { color: #fdc700; font-size: 13px; }
        .trust-count { font-size: 12px; font-weight: 700; color: #0d0d0d; }

        .t-card {
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          padding: 32px;
          height: 100%;
          display: flex; flex-direction: column;
          transition: all 0.3s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          min-height: 280px;
        }
        .t-card:hover {
          border-color: #fdc700;
          box-shadow: 0 8px 32px rgba(253,199,0,0.12);
          transform: translateY(-2px);
        }
        .t-stars { display: flex; gap: 3px; margin-bottom: 20px; }
        .t-star { width: 16px; height: 16px; fill: #fdc700; color: #fdc700; }
        .t-quote {
          font-size: 15px; color: #444; line-height: 1.7;
          flex-grow: 1; margin-bottom: 24px;
          font-style: italic;
        }
        .t-quote::before { content: '"'; color: #fdc700; font-size: 24px; line-height: 0; vertical-align: -8px; margin-right: 3px; font-style: normal; }
        .t-quote::after { content: '"'; color: #fdc700; font-size: 24px; line-height: 0; vertical-align: -8px; margin-left: 3px; font-style: normal; }
        .t-divider { height: 1px; background: #f5f5f5; margin-bottom: 20px; }
        .t-author { display: flex; align-items: center; gap: 12px; }
        .t-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(253,199,0,0.3); }
        .t-name { font-size: 13px; font-weight: 800; color: #0d0d0d; text-transform: uppercase; letter-spacing: 0.05em; }
        .t-badge {
          display: inline-block; font-size: 9px; font-weight: 700;
          background: #d1fae5; color: #065f46;
          padding: 2px 8px; border-radius: 100px;
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-top: 3px;
        }

        /* Swiper customization */
        .testimonials-swiper .swiper-pagination-bullet { background: #0d0d0d; opacity: 0.15; width: 8px; height: 8px; }
        .testimonials-swiper .swiper-pagination-bullet-active { background: #fdc700; opacity: 1; width: 24px; border-radius: 4px; }

        /* ─── BRAND PROMISE SECTION ──── */
        .brand-section {
          background: #0d0d0d; padding: 80px 24px;
          position: relative; overflow: hidden;
        }
        .brand-section::before {
          content: "NAAKSH";
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(80px, 15vw, 200px);
          font-weight: 900; color: rgba(255,255,255,0.03);
          letter-spacing: -0.04em; white-space: nowrap;
          pointer-events: none; user-select: none;
        }
        .brand-inner {
          max-width: 900px; margin: 0 auto;
          text-align: center; position: relative; z-index: 1;
        }
        .brand-tag {
          font-size: 10px; font-weight: 800; letter-spacing: 0.3em;
          color: #fdc700; text-transform: uppercase; margin-bottom: 20px;
        }
        .brand-heading {
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -0.02em; color: #fff; margin: 0 0 24px;
        }
        .brand-heading em { font-style: normal; color: #fdc700; }
        .brand-sub {
          font-size: 16px; color: #777; line-height: 1.7;
          max-width: 560px; margin: 0 auto 40px;
        }
        .brand-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: #fdc700; color: #000;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 16px 36px; border-radius: 4px;
          text-decoration: none; transition: all 0.3s;
          box-shadow: 0 8px 30px rgba(253,199,0,0.3);
        }
        .brand-cta:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,255,255,0.15); }
        .brand-cta svg { transition: transform 0.3s; }
        .brand-cta:hover svg { transform: translateX(4px); }

        /* ─── GENERAL ─── */
        @media (max-width: 768px) {
          .featured-header { flex-direction: column; align-items: flex-start; }
          .testimonials-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div>

        {/* ══ HERO BANNER ══════════════════════════════════════════ */}
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

        {/* ══ FEATURE STRIP ════════════════════════════════════════ */}
        <div className="feature-strip">
          <div className="feature-strip-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FEATURED PRODUCTS ════════════════════════════════════ */}
        {featuredProducts.length > 0 && (
          <section className="featured-section">
            <div className="featured-inner">
              <div className="featured-header">
                <div>
                  <span className="section-tag">Handpicked for You</span>
                  <h2 className="section-heading">Featured <em>Products</em></h2>
                </div>
                <NavLink to="/shop" className="sec-cta">
                  View All Products <ArrowRight size={14} />
                </NavLink>
              </div>
              <div className="products-grid">
                {featuredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ SHOP BY CATEGORY ═════════════════════════════════════ */}
        <section className="category-section">
          <div className="category-inner">
            <div className="category-header">
              <span className="section-tag" style={{ color: "#fdc700", borderColor: "#fdc700" }}>Browse Categories</span>
              <h2 className="section-heading light">Shop by <em>Category</em></h2>
            </div>
            <div className="category-grid">
              {categories.map((cat) => (
                <NavLink
                  key={cat.slug}
                  to={`/shop?category=${cat.name}`}
                  className="cat-card"
                >
                  <img src={cat.image} alt={cat.name} />
                  <div className="cat-card-overlay" />
                  <div className="cat-card-name">
                    {cat.name.toUpperCase()}
                    <span className="arrow">→</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STATS ════════════════════════════════════════════════ */}
        <section className="stats-section" ref={statsRef}>
          <div className="stats-inner">
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ DYNAMIC COLLECTION ════════════════════════════════════ */}
        <section className="collection-section">
          <div className="collection-inner">
            <div className="featured-header">
              <div>
                <span className="section-tag">Full Drop</span>
                <h2 className="section-heading">
                  {featuredCategory.split(" ").slice(0, -1).join(" ")} <em>{featuredCategory.split(" ").slice(-1)}</em>
                </h2>
              </div>
              <NavLink to={`/shop?category=${featuredCategory}`} className="sec-cta">
                See Full Collection <ArrowRight size={14} />
              </NavLink>
            </div>

            {categoryFeaturedProducts.length > 0 ? (
              <div className="products-grid">
                {categoryFeaturedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#999", fontSize: "16px" }}>
                No products in {featuredCategory} yet.
              </p>
            )}
          </div>
        </section>

        {/* ══ PROMO BANNER ════════════════════════════════════════ */}
        <section className="promo-section">
          <NavLink to="/product/dreams-drop-shoulder-tee">
            <img src="/home_banner.png" alt="Naaksh Promo Banner" />
          </NavLink>
        </section>

        {/* ══ TESTIMONIALS ════════════════════════════════════════ */}
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

        {/* ══ BRAND PROMISE ════════════════════════════════════════ */}
        <section className="brand-section">
          <div className="brand-inner">
            <p className="brand-tag">Our Promise</p>
            <h2 className="brand-heading">
              We Don't Just Sell.<br />
              We Build <em>Culture.</em>
            </h2>
            <p className="brand-sub">
              Every stitch. Every drop. Every customer interaction — designed to leave a mark.
              Naaksh is more than clothing. It's a statement of who you are.
            </p>
            <NavLink to="/shop" className="brand-cta">
              Explore the Collection <ArrowRight size={15} />
            </NavLink>
          </div>
        </section>

      </div>
    </>
  );
}
