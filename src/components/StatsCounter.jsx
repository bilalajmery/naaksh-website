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
    { value: "10,000+", label: "Happy Customers" },
    { value: "50+", label: "Unique Designs" },
    { value: "4.9★", label: "Average Rating" },
    { value: "2-4", label: "Days Delivery" },
  ];

  return (
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
  );
}
