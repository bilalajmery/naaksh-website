'use client';
import { useState, useEffect, useRef } from "react";

export default function StatsCounter() {
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef(null);

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

  const stats = [
    { value: "10,000+", label: "Happy Customers", sub: "Nationwide Community" },
    { value: "50+", label: "Unique Drops", sub: "Curated Silhouettes" },
    { value: "4.9★", label: "Average Rating", sub: "Verified Reviews" },
    { value: "2-4 Days", label: "Express Delivery", sub: "All Over Pakistan" },
  ];

  return (
    <section className="bg-[#09090b] py-16 sm:py-20 border-t border-b border-white/5 relative" ref={statsRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 divide-white/5">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center ${
                i !== 0 ? "lg:border-l lg:border-white/5 lg:pl-12" : ""
              } pt-6 sm:pt-0`}
            >
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 tracking-tight mb-2">
                {s.value}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-1">
                {s.label}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium tracking-wider uppercase">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
