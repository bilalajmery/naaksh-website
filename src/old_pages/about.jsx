import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <meta name="description" content="Learn about the story behind Naaksh, Pakistan's most fearless streetwear brand. Born in Lahore, built for the bold and ambitious." />
        <link rel="canonical" href="https://naakshofficial.com/about" />
      </Helmet>
      {/* 1. HERO - DARK BG */}
      <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1920&h=1080&fit=crop&auto=format"
            alt="NAAKSH"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8">
            WE ARE <span className="text-yellow-400">NAAKSH</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
            Pakistan's most fearless streetwear brand. Born in the streets, built for the bold.
          </p>
          <div className="mt-12">
            <NavLink
              to="/shop"
              className="inline-flex items-center gap-3 bg-yellow-400 text-black px-10 py-5 text-lg font-bold uppercase tracking-wider hover:bg-yellow-300 transition-all rounded-full"
            >
              Explore Collection <ChevronRight size={24} />
            </NavLink>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-3 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY - DARK BG */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
              OUR <span className="text-yellow-400">STORY</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              NAAKSH was never meant to be just another clothing brand. It started in 2023 on the streets of Lahore —
              a group of friends tired of boring, overpriced fashion that didn't represent who we really are.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We said no to fast fashion. Yes to quality, attitude, and unapologetic style.
              Every hoodie, every jacket, every stitch carries the energy of Pakistani youth —
              raw, ambitious, and unafraid to stand out.
            </p>
          </div>
          <div className="relative">
            <img
              src="/logo/lg.png"
              alt="NAAKSH Story"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. BUILT ON DISCIPLINE - LIGHT BG */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              BUILT ON <span className="text-yellow-400">DISCIPLINE</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every piece we create embodies our commitment to excellence, authenticity, and uncompromising standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "QUALITY OVER EVERYTHING",
                desc: "Premium materials. Precision craftsmanship. Engineered to endure — delivering excellence that stands the test of time."
              },
              {
                title: "PAKISTANI & PROUD",
                desc: "Rooted in Pakistan. Designed for the world. Every creation honors our heritage while pushing boundaries."
              },
              {
                title: "NO COMPROMISE",
                desc: "We don't chase trends — we define them. Exclusive releases. Deliberately limited. Always exceptional."
              }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 h-full">
                  <h3 className="text-2xl font-bold mb-6 tracking-tight leading-tight">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HAPPY CUSTOMERS / STATS - DARK BG */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-20">
            HAPPY <span className="text-yellow-400">CUSTOMERS</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "200+", label: "Limited Drops" },
              { number: "4.9", label: "Average Rating" },
              { number: "2023", label: "Founded In" }
            ].map((stat, i) => (
              <div key={i}>
                <h3 className="text-6xl md:text-7xl font-black text-yellow-400 mb-4">
                  {stat.number}
                </h3>
                <p className="text-lg font-medium text-gray-300 tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. JOIN THE MOVEMENT - LIGHT BG */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10">
            JOIN THE <span className="text-yellow-400">MOVEMENT</span>
          </h2>
          <p className="text-2xl mb-12 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This isn't just clothing. This is identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <NavLink
              to="/shop"
              className="bg-black text-white px-12 py-6 text-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition-all rounded-full"
            >
              Shop Now
            </NavLink>
            <NavLink
              to="/contact"
              className="border-2 border-black text-black px-12 py-6 text-xl font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all rounded-full"
            >
              Get in Touch
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}