import React from 'react';
import { ShieldCheck, Sparkles, Layers, Truck } from 'lucide-react';

export default function NaakshStandard() {
  const pillars = [
    {
      num: "01",
      icon: <Layers className="w-5 h-5 text-yellow-400" />,
      title: "240 GSM PURE COTTON",
      subtitle: "HEAVYWEIGHT FABRIC",
      description: "High-density combed compact knit engineered for a substantial hand-feel and long-lasting structural drape.",
    },
    {
      num: "02",
      icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
      title: "ENGINEERED SILHOUETTES",
      subtitle: "DROP SHOULDER DRAPE",
      description: "Tailored oversized cuts perfected with broad shoulders, clean collar ribbing, and relaxed streetwear fit.",
    },
    {
      num: "03",
      icon: <ShieldCheck className="w-5 h-5 text-yellow-400" />,
      title: "BIO-WASHED & PRE-SHRUNK",
      subtitle: "ZERO DISTORTION",
      description: "Pre-treated to prevent shrinkage, pilling, or fading. Retains rich color and soft texture wash after wash.",
    },
    {
      num: "04",
      icon: <Truck className="w-5 h-5 text-yellow-400" />,
      title: "DESIGNED IN PAKISTAN",
      subtitle: "NATIONWIDE EXPRESS",
      description: "Rooted in authentic Pakistani urban culture, backed by seamless 2-4 day express delivery across Pakistan.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#09090b] border-t border-b border-white/5 relative overflow-hidden">
      {/* Subtle Background Typography Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-black text-white/[0.015] pointer-events-none select-none tracking-tighter whitespace-nowrap">
        NAAKSH STANDARD
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span>THE CRAFTSMANSHIP BENCHMARK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              THE NAAKSH <span className="text-yellow-400">STANDARD</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
            Every garment is constructed from high-grade raw materials and tailored with strict discipline to redefine Pakistani streetwear quality.
          </p>
        </div>

        {/* 4-Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="p-8 bg-[#0d0d0f] border border-white/5 hover:border-yellow-400/30 transition-all duration-300 group relative"
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <span className="font-mono text-xs text-zinc-600 group-hover:text-yellow-400 transition-colors">
                  {pillar.num}
                </span>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:border-yellow-400/20 transition-all">
                  {pillar.icon}
                </div>
              </div>

              {/* Title & Subtitle */}
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400/90 mb-1">
                {pillar.subtitle}
              </p>
              <h3 className="text-base font-black text-white uppercase tracking-tight mb-3">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
