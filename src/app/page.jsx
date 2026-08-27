import { getProducts, getCategories } from '../lib/catalog';
import { getHomepageSections } from '../lib/api';
import Link from 'next/link';
import { Truck, ShieldCheck, RotateCcw, PackageCheck, ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import TestimonialCarousel from '../components/TestimonialCarousel';
import StatsCounter from '../components/StatsCounter';
import NaakshStandard from '../components/NaakshStandard';

export const metadata = {
  title: {
    absolute: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
  },
  description: 'Discover premium streetwear in Pakistan by NAAKSH. Shop heavyweight 240 GSM oversized t-shirts, drop shoulder tees, hoodies, and signature streetwear essentials.',
  keywords: [
    'Pakistani Streetwear',
    'Oversized T-Shirts Pakistan',
    'Streetwear Brand Pakistan',
    'Drop Shoulder Tees Lahore',
    'Graphic Hoodies Karachi',
    'Heavyweight Cotton Tees Pakistan',
    'NAAKSH Official',
  ],
  alternates: {
    canonical: 'https://naakshofficial.com',
  },
  openGraph: {
    title: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
    description: 'Discover premium streetwear in Pakistan by NAAKSH. Heavyweight 240 GSM oversized tees, drop shoulder hoodies, and urban essentials.',
    url: 'https://naakshofficial.com',
    siteName: 'NAAKSH',
    type: 'website',
    images: [
      {
        url: '/logo/dark/sm.png',
        width: 800,
        height: 600,
        alt: 'NAAKSH Streetwear Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
    description: 'Shop luxury oversized drop shoulder streetwear in Pakistan with nationwide express delivery.',
    images: ['/logo/dark/sm.png'],
  },
};

export default async function Home() {
  // Fetch dynamic catalog data and Admin-configured homepage sections concurrently
  const [categories, featuredProducts, homepageSections] = await Promise.all([
    getCategories(),
    getProducts({ is_featured: true, per_page: 8 }),
    getHomepageSections(),
  ]);

  // Fallback category resolution if no Admin homepage sections exist yet
  const fallbackCategory =
    categories.find((c) => (c.products_count ?? 0) > 0) ||
    categories[0] ||
    { id: 4, name: 'Drop Shoulder Tees', slug: 'drop-shoulder-tees' };

  let fallbackCategoryProducts = [];
  if (!homepageSections || homepageSections.length === 0) {
    fallbackCategoryProducts = fallbackCategory?.id
      ? await getProducts({ category_id: fallbackCategory.id, per_page: 8 })
      : await getProducts({ per_page: 8, sort: 'newest' });
  }

  const serviceBenefits = [
    {
      icon: <Truck className="w-5 h-5 text-yellow-400" />,
      title: "FREE EXPRESS DELIVERY",
      sub: "Across All Pakistan",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-yellow-400" />,
      title: "240 GSM PURE COTTON",
      sub: "Bio-Washed & Pre-Shrunk",
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-yellow-400" />,
      title: "EASY 2-DAY EXCHANGE",
      sub: "Hassle-Free Size Swaps",
    },
    {
      icon: <PackageCheck className="w-5 h-5 text-yellow-400" />,
      title: "SECURE LUXURY PACKAGING",
      sub: "Arrives in Mint Condition",
    },
  ];

  return (
    <div className="bg-[#09090b] text-white min-h-screen">
      
      {/* ══ 1. CINEMATIC HERO SLIDER ══════════════════════════════ */}
      <HeroCarousel />

      {/* ══ 2. LUXURY SERVICE TRUST STRIP ═════════════════════════ */}
      <div className="bg-[#0d0d0f] border-y border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {serviceBenefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 sm:gap-4 p-2"
              >
                <div className="p-2.5 rounded-full bg-white/5 border border-white/10 shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
                    {b.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium tracking-wide mt-0.5">
                    {b.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 3. FEATURED PRODUCTS (LIMITED DROPS) ══════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-[#09090b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                  <Sparkles size={12} />
                  <span>LIMITED DROPS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  FEATURED <span className="text-yellow-400">COLLECTION</span>
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition"
              >
                <span>VIEW ALL DROPS</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featuredProducts.map((p) => (
                <ProductCard key={p.uuid || p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 4. EDITORIAL SHOP BY CATEGORY ═════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0d0d0f] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span>CURATED SILHOUETTES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                SHOP BY <span className="text-yellow-400">CATEGORY</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xs leading-relaxed">
              Explore heavyweight oversized cuts, structured polos, and signature streetwear layers.
            </p>
          </div>

          {/* Editorial Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id || cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-black border border-white/5 hover:border-yellow-400 transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col justify-end">
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-yellow-400 mb-1">
                    0{idx + 1}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-yellow-400 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-zinc-400 mt-1 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <span>EXPLORE</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. THE NAAKSH STANDARD QUALITY SECTION ═════════════════ */}
      <NaakshStandard />

      {/* ══ 6. DYNAMIC ADMIN-CONFIGURED HOMEPAGE PRODUCT SECTIONS (M15) ══ */}
      {homepageSections && homepageSections.length > 0 ? (
        homepageSections.map((sec) => {
          const categorySlug = sec.category?.slug || 'shop';
          const sectionTitle = sec.title || sec.category?.name || 'Collection';
          const sectionSubtitle = sec.subtitle || 'Signature 240 GSM Oversized Streetwear Fits';
          const products = sec.products || [];

          if (products.length === 0) return null;

          return (
            <section key={sec.id} className="py-20 md:py-28 bg-[#09090b] border-b border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      <span>{sectionSubtitle}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                      {sectionTitle.toUpperCase()}
                    </h2>
                  </div>
                  <Link
                    href={`/category/${categorySlug}`}
                    className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition"
                  >
                    <span>EXPLORE ALL ({products.length})</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {products.map((p) => (
                    <ProductCard key={p.uuid || p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          );
        })
      ) : fallbackCategoryProducts.length > 0 ? (
        /* Fallback section if API offline */
        <section className="py-20 md:py-28 bg-[#09090b] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>SIGNATURE SHOWCASE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  {fallbackCategory.name.toUpperCase()}
                </h2>
              </div>
              <Link
                href={`/category/${fallbackCategory.slug}`}
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition"
              >
                <span>EXPLORE ALL ({fallbackCategoryProducts.length})</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {fallbackCategoryProducts.map((p) => (
                <ProductCard key={p.uuid || p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ══ 7. EDITORIAL PROMOTIONAL CAMPAIGN ══════════════════════ */}
      <section className="relative overflow-hidden bg-black border-t border-b border-white/5">
        <Link href="/shop" className="group block relative w-full overflow-hidden">
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <img
              src="/home_banner.png"
              alt="NAAKSH Streetwear Campaign"
              className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Cinematic Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

            {/* Campaign Content */}
            <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 z-10">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.25em] mb-4">
                  SEASONAL CAMPAIGN
                </span>
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-none mb-4">
                  THE DREAMS <span className="text-yellow-400">DROP</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed mb-8 max-w-md">
                  Experience heavyweight oversized graphic drops tailored with unyielding attention to detail.
                </p>
                <span className="inline-flex items-center gap-2 bg-yellow-400 text-black font-extrabold px-8 py-4 text-xs uppercase tracking-[0.2em] group-hover:bg-white transition-colors duration-300 shadow-xl">
                  <span>DISCOVER THE CAMPAIGN</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ══ 8. CUSTOMER COMMUNITY TESTIMONIALS ════════════════════ */}
      <TestimonialCarousel />

      {/* ══ 9. TRUST & PERFORMANCE METRICS ════════════════════════ */}
      <StatsCounter />

      {/* ══ 10. BRAND CULTURE MANIFESTO ═══════════════════════════ */}
      <section className="py-28 md:py-36 bg-black relative overflow-hidden text-center border-t border-white/5">
        {/* Large Decorative Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter whitespace-nowrap">
          NAAKSH
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-yellow-400 mb-6">
            OUR MANIFESTO
          </p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[0.95] mb-8">
            WE DON'T JUST SELL.<br />
            WE BUILD <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">CULTURE.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
            Every stitch. Every drop. Every interaction is designed to leave a lasting impression.
            NAAKSH is more than clothing — it is an unapologetic expression of authentic identity.
          </p>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 bg-yellow-400 hover:bg-white text-black font-black px-10 py-5 text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_35px_rgba(245,197,24,0.3)] hover:-translate-y-0.5"
          >
            <span>EXPLORE THE COMPLETE CATALOG</span>
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </div>
  );
}
