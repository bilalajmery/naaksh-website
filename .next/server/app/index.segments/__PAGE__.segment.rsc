1:"$Sreact.fragment"
2:T3fca,
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
      9:X
0:{"buildId":"zSqwdaXpT5marAbh1Oe0v","data":[{"rsc":["$","$1","c",{"children":[[["$","style",null,{"children":"$2"}],"$L3"],["$L4","$L5","$L6"],"$L7"]}],"isPartial":"$@8","staleTime":"$9","varyParams":null},{"rsc":"$La","isPartial":"$@b","staleTime":"$9","varyParams":null}],"isUpgradeableISRFallback":false,"a":"$@c","rootVaryParams":null,"needsRuntimeRequest":"$@d"}
e:I[54244,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js","/_next/static/chunks/2u_1h0p-zpfk4.js","/_next/static/chunks/2v7b8nus228ul.js"],"default"]
f:I[22016,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js","/_next/static/chunks/2u_1h0p-zpfk4.js","/_next/static/chunks/2v7b8nus228ul.js"],""]
10:I[86114,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js","/_next/static/chunks/2u_1h0p-zpfk4.js","/_next/static/chunks/2v7b8nus228ul.js"],"default"]
1e:I[97367,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js"],"OutletBoundary"]
1f:"$Sreact.suspense"
21:I[97367,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js"],"ViewportBoundary"]
22:I[97367,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js"],"MetadataBoundary"]
23:I[27201,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js"],"IconMark"]
:HL["/_next/static/chunks/4346ojs8-pfzx.css","style"]
3:["$","div",null,{"children":[["$","$Le",null,{}],["$","div",null,{"className":"feature-strip","children":["$","div",null,{"className":"feature-strip-grid","children":[["$","div","0",{"className":"feature-item","children":[["$","div",null,{"className":"feature-icon","children":["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":22,"height":22,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-truck","aria-hidden":"true","children":[["$","path","wrbu53",{"d":"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"}],["$","path","1lyqi6",{"d":"M15 18H9"}],["$","path","lysw3i",{"d":"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"}],["$","circle","332jqn",{"cx":"17","cy":"18","r":"2"}],["$","circle","19iecd",{"cx":"7","cy":"18","r":"2"}],"$undefined"]}]}],["$","div",null,{"children":[["$","div",null,{"className":"feature-title","children":"Free Delivery"}],["$","div",null,{"className":"feature-sub","children":"All Over Pakistan"}]]}]]}],["$","div","1",{"className":"feature-item","children":[["$","div",null,{"className":"feature-icon","children":["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":22,"height":22,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-shield","aria-hidden":"true","children":[["$","path","oel41y",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],"$undefined"]}]}],["$","div",null,{"children":[["$","div",null,{"className":"feature-title","children":"Premium Quality"}],["$","div",null,{"className":"feature-sub","children":"Guaranteed Guarantee"}]]}]]}],["$","div","2",{"className":"feature-item","children":[["$","div",null,{"className":"feature-icon","children":["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":22,"height":22,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-rotate-ccw","aria-hidden":"true","children":[["$","path","1357e3",{"d":"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["$","path","1xhq8a",{"d":"M3 3v5h5"}],"$undefined"]}]}],["$","div",null,{"children":[["$","div",null,{"className":"feature-title","children":"Easy Returns"}],["$","div",null,{"className":"feature-sub","children":"Hassle-Free Exchange"}]]}]]}],["$","div","3",{"className":"feature-item","children":[["$","div",null,{"className":"feature-icon","children":["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":22,"height":22,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-package","aria-hidden":"true","children":[["$","path","1a0edw",{"d":"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"}],["$","path","d0xqtd",{"d":"M12 22V12"}],["$","polyline","ousv84",{"points":"3.29 7 12 12 20.71 7"}],["$","path","1c824w",{"d":"m7.5 4.27 9 5.15"}],"$undefined"]}]}],["$","div",null,{"children":[["$","div",null,{"className":"feature-title","children":"Secure Packaging"}],["$","div",null,{"className":"feature-sub","children":"Arrives Perfectly"}]]}]]}]]}]}],["$","section",null,{"className":"featured-section","children":["$","div",null,{"className":"featured-inner","children":[["$","div",null,{"className":"featured-header","children":[["$","div",null,{"children":[["$","span",null,{"className":"section-tag","children":"Handpicked for You"}],["$","h2",null,{"className":"section-heading","children":["Featured ",["$","em",null,{"children":"Products"}]]}]]}],["$","$Lf",null,{"href":"/shop","className":"sec-cta","children":["View All Products ",["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-right","aria-hidden":"true","children":[["$","path","1ays0h",{"d":"M5 12h14"}],["$","path","xquz4c",{"d":"m12 5 7 7-7 7"}],"$undefined"]}]]}]]}],["$","div",null,{"className":"products-grid","children":[["$","$L10","01a02f10-bc16-735c-8351-87888a084e70",{"product":{"uuid":"01a02f10-bc16-735c-8351-87888a084e70","name":"Japanese Calligraphy – Black Drop Shoulder T-Shirt","slug":"japanese-calligraphy-drop-shoulder-tee","selling_price":1099,"original_selling_price":1899,"price_display":"PKR 1,099","original_price_display":"PKR 1,899","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"42% OFF","rating":4.8,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":67,"url":"/product-assets/japanese-calligraphy-drop-shoulder-tee/1.png","color_id":2,"is_primary":true,"sort_order":0},"sizes":[{"id":2,"name":"M","sort_order":0},{"id":3,"name":"L","sort_order":1},{"id":4,"name":"XL","sort_order":2}],"garment_colors":[{"id":2,"name":"Black","hex":"#000000","sort_order":0}]}}],"$L11","$L12","$L13","$L14","$L15","$L16","$L17"]}]]}]}],"$L18","$L19","$L1a","$L1b","$L1c","$L1d"]}]
4:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/4346ojs8-pfzx.css","precedence":"next"}]
5:["$","script","script-0",{"src":"/_next/static/chunks/2u_1h0p-zpfk4.js","async":true}]
6:["$","script","script-1",{"src":"/_next/static/chunks/2v7b8nus228ul.js","async":true}]
7:["$","$L1e",null,{"children":["$","$1f",null,{"name":"Next.MetadataOutlet","children":"$@20"}]}]
a:["$","$1","h",{"children":[null,["$","$L21",null,{"children":[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]}],["$","div",null,{"hidden":true,"children":["$","$L22",null,{"children":["$","$1f",null,{"name":"Next.Metadata","children":[["$","title","0",{"children":"NAAKSH | Premium Streetwear & Urban Fashion in Pakistan"}],["$","meta","1",{"name":"description","content":"Discover premium minimalist clothing and streetwear in Pakistan. Shop high-quality oversized t-shirts, hoodies, and more at Naaksh."}],["$","link","2",{"rel":"author","href":"https://naakshofficial.com"}],["$","meta","3",{"name":"author","content":"NAAKSH"}],["$","meta","4",{"name":"keywords","content":"Pakistani Streetwear,Oversized T-Shirts Pakistan,Streetwear Pakistan,Drop Shoulder Tees,Graphic Hoodies Karachi,Urban Clothing Brand Lahore,Heavyweight Cotton Tees,NAAKSH Official"}],["$","meta","5",{"name":"creator","content":"NAAKSH"}],["$","meta","6",{"name":"publisher","content":"NAAKSH"}],["$","meta","7",{"name":"robots","content":"index, follow"}],["$","meta","8",{"name":"googlebot","content":"index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"}],["$","link","9",{"rel":"canonical","href":"https://naakshofficial.com"}],["$","meta","10",{"property":"og:title","content":"NAAKSH | Premium Streetwear & Urban Fashion in Pakistan"}],["$","meta","11",{"property":"og:description","content":"Naaksh offers high-grade 240 GSM bio-washed cotton streetwear, oversized drop-shoulder fits, and bold limited drops across Pakistan."}],["$","meta","12",{"property":"og:url","content":"https://naakshofficial.com"}],["$","meta","13",{"property":"og:site_name","content":"NAAKSH"}],["$","meta","14",{"property":"og:locale","content":"en_PK"}],["$","meta","15",{"property":"og:image","content":"https://naakshofficial.com/logo/dark/sm.png"}],["$","meta","16",{"property":"og:image:width","content":"800"}],["$","meta","17",{"property":"og:image:height","content":"600"}],["$","meta","18",{"property":"og:image:alt","content":"NAAKSH Streetwear Pakistan"}],["$","meta","19",{"property":"og:type","content":"website"}],["$","meta","20",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","21",{"name":"twitter:title","content":"NAAKSH | Premium Streetwear & Urban Fashion in Pakistan"}],["$","meta","22",{"name":"twitter:description","content":"Shop luxury oversized drop shoulder streetwear in Pakistan with free nationwide express delivery."}],["$","meta","23",{"name":"twitter:image","content":"https://naakshofficial.com/logo/dark/sm.png"}],["$","link","24",{"rel":"shortcut icon","href":"/favicon.svg"}],["$","link","25",{"rel":"icon","href":"/favicon.svg"}],["$","link","26",{"rel":"apple-touch-icon","href":"/logo/sm.png"}],["$","$L23","27",{}]]}]}]}],null]}]
d:true
24:I[21871,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js","/_next/static/chunks/2u_1h0p-zpfk4.js","/_next/static/chunks/2v7b8nus228ul.js"],"default"]
25:I[15221,["/_next/static/chunks/29f9cwtjsfmrl.js","/_next/static/chunks/0tvj-bjh2yyk1.js","/_next/static/chunks/2u_1h0p-zpfk4.js","/_next/static/chunks/2v7b8nus228ul.js"],"default"]
:HL["/category-assets/Cargo Trouzer/img.jpg","image"]
:HL["/category-assets/Classic Polo Shirts/img.jpg","image"]
:HL["/category-assets/Denim Jackets/img.jpg","image"]
:HL["/category-assets/Drop Shoulder T-shirts/img.jpg","image"]
:HL["/category-assets/Hoodies/img.jpg","image"]
:HL["/category-assets/Knitted Polo T-Shirts/img.jpg","image"]
:HL["/category-assets/Normal Basic T-shirts/img.jpg","image"]
:HL["/category-assets/Sweat Shirt/img.jpg","image"]
:HL["/category-assets/Textured Shirt/img.png","image"]
:HL["/home_banner.png","image"]
11:["$","$L10","01a02f10-ba6a-72b4-a4d2-e1c14deb7e96",{"product":{"uuid":"01a02f10-ba6a-72b4-a4d2-e1c14deb7e96","name":"NEVER STOP DREAMING – Drop Shoulder T-Shirt","slug":"never-stop-dreaming-drop-shoulder-tee","selling_price":1699,"original_selling_price":1999,"price_display":"PKR 1,699","original_price_display":"PKR 1,999","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"15% OFF","rating":4.9,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":33,"url":"/product-assets/never-stop-dreaming-drop-shoulder-tee/1.png","color_id":2,"is_primary":true,"sort_order":0},"sizes":[{"id":2,"name":"M","sort_order":0},{"id":3,"name":"L","sort_order":1},{"id":4,"name":"XL","sort_order":2}],"garment_colors":[{"id":2,"name":"Black","hex":"#000000","sort_order":0}]}}]
12:["$","$L10","01a02f10-bb3b-709a-826b-89fa9b397338",{"product":{"uuid":"01a02f10-bb3b-709a-826b-89fa9b397338","name":"Seek Drop Shoulder Tee","slug":"seek-drop-shoulder-tee","selling_price":1499,"original_selling_price":1799,"price_display":"PKR 1,499","original_price_display":"PKR 1,799","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"17% OFF","rating":4.8,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":51,"url":"/product-assets/seek-drop-shoulder-tee/1.png","color_id":2,"is_primary":true,"sort_order":0},"sizes":[{"id":1,"name":"S","sort_order":0},{"id":2,"name":"M","sort_order":1},{"id":3,"name":"L","sort_order":2},{"id":4,"name":"XL","sort_order":3}],"garment_colors":[{"id":2,"name":"Black","hex":"#000000","sort_order":0}]}}]
13:["$","$L10","01a02f10-bb4e-701e-a09e-87d00c5a2508",{"product":{"uuid":"01a02f10-bb4e-701e-a09e-87d00c5a2508","name":"Focus Drop Shoulder Tee","slug":"focus-drop-shoulder-tee","selling_price":1199,"original_selling_price":1799,"price_display":"PKR 1,199","original_price_display":"PKR 1,799","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"33% OFF","rating":4.7,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":52,"url":"/product-assets/focus-drop-shoulder-tee/1.png","color_id":2,"is_primary":true,"sort_order":0},"sizes":[{"id":1,"name":"S","sort_order":0},{"id":2,"name":"M","sort_order":1},{"id":3,"name":"L","sort_order":2},{"id":4,"name":"XL","sort_order":3}],"garment_colors":[{"id":2,"name":"Black","hex":"#000000","sort_order":0}]}}]
14:["$","$L10","01a02f10-bb76-730d-b630-16684a9c5cdd",{"product":{"uuid":"01a02f10-bb76-730d-b630-16684a9c5cdd","name":"Vegeta Drop Shoulder Tee","slug":"vegeta-drop-shoulder-tee","selling_price":1199,"original_selling_price":1799,"price_display":"PKR 1,199","original_price_display":"PKR 1,799","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"33% OFF","rating":4.9,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":54,"url":"/product-assets/vegeta-drop-shoulder-tee/3.png","color_id":15,"is_primary":true,"sort_order":0},"sizes":[{"id":1,"name":"S","sort_order":0},{"id":2,"name":"M","sort_order":1},{"id":3,"name":"L","sort_order":2},{"id":4,"name":"XL","sort_order":3}],"garment_colors":[{"id":15,"name":"Mustard Brown","hex":"#976513","sort_order":0},{"id":2,"name":"Black","hex":"#000000","sort_order":1},{"id":3,"name":"Blue","hex":"#0000FF","sort_order":2}]}}]
15:["$","$L10","01a02f10-bb8c-731e-873c-e3b505b6be27",{"product":{"uuid":"01a02f10-bb8c-731e-873c-e3b505b6be27","name":"Break Rules Drop Shoulder Tee","slug":"break-rules-drop-shoulder-tee","selling_price":1499,"original_selling_price":1799,"price_display":"PKR 1,499","original_price_display":"PKR 1,799","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"17% OFF","rating":4.8,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":57,"url":"/product-assets/break-rules-drop-shoulder-tee/2.png","color_id":13,"is_primary":true,"sort_order":0},"sizes":[{"id":1,"name":"S","sort_order":0},{"id":2,"name":"M","sort_order":1},{"id":3,"name":"L","sort_order":2},{"id":4,"name":"XL","sort_order":3}],"garment_colors":[{"id":13,"name":"Mehroon","hex":"#800000","sort_order":0},{"id":2,"name":"Black","hex":"#000000","sort_order":1},{"id":6,"name":"Dark Blue","hex":"#0e101d","sort_order":2}]}}]
16:["$","$L10","01a02f10-bbc1-70d5-870d-2c6b5d8ffed3",{"product":{"uuid":"01a02f10-bbc1-70d5-870d-2c6b5d8ffed3","name":"THE FUTURE Drop Shoulder T-Shirt","slug":"the-future-drop-shoulder-tee","selling_price":1399,"original_selling_price":1899,"price_display":"PKR 1399","original_price_display":"PKR 1,899","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"26% OFF","rating":4.9,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":61,"url":"/product-assets/the-future-drop-shoulder-tee/1.png","color_id":21,"is_primary":true,"sort_order":0},"sizes":[{"id":2,"name":"M","sort_order":0},{"id":3,"name":"L","sort_order":1},{"id":4,"name":"XL","sort_order":2}],"garment_colors":[{"id":21,"name":"Teal","hex":"#207C8C","sort_order":0},{"id":22,"name":"White","hex":"#ffffff","sort_order":1},{"id":2,"name":"Black","hex":"#000000","sort_order":2}]}}]
17:["$","$L10","01a02f10-bbea-7126-8c94-95787f8d1dfc",{"product":{"uuid":"01a02f10-bbea-7126-8c94-95787f8d1dfc","name":"MELTING Drop Shoulder T-Shirt","slug":"melting-drop-shoulder-tee","selling_price":1499,"original_selling_price":1999,"price_display":"PKR 1,499","original_price_display":"PKR 1,999","stock_status":"in_stock","purchasable":false,"is_featured":true,"badge":"25% OFF","rating":4.9,"category":{"id":4,"name":"Drop Shoulder Tees"},"primary_media":{"id":64,"url":"/product-assets/melting-drop-shoulder-tee/1.png","color_id":2,"is_primary":true,"sort_order":0},"sizes":[{"id":1,"name":"S","sort_order":0},{"id":2,"name":"M","sort_order":1},{"id":3,"name":"L","sort_order":2},{"id":4,"name":"XL","sort_order":3}],"garment_colors":[{"id":2,"name":"Black","hex":"#000000","sort_order":0}]}}]
18:["$","section",null,{"className":"category-section","children":["$","div",null,{"className":"category-inner","children":[["$","div",null,{"className":"category-header","children":[["$","span",null,{"className":"section-tag","style":{"color":"#fdc700","borderColor":"#fdc700"},"children":"Browse Categories"}],["$","h2",null,{"className":"section-heading light","children":["Shop by ",["$","em",null,{"children":"Category"}]]}]]}],["$","div",null,{"className":"category-grid","children":[["$","$Lf","1",{"href":"/category/cargo-trouser","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Cargo Trouzer/img.jpg","alt":"Cargo Trouser"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["CARGO TROUSER",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","2",{"href":"/category/classic-polo-shirts","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Classic Polo Shirts/img.jpg","alt":"Classic Polo Shirts"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["CLASSIC POLO SHIRTS",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","3",{"href":"/category/denim-jackets","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Denim Jackets/img.jpg","alt":"Denim Jackets"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["DENIM JACKETS",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","10",{"href":"/category/drop-shoulder","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Drop Shoulder T-shirts/img.jpg","alt":"Drop Shoulder"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["DROP SHOULDER",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","4",{"href":"/category/drop-shoulder-tees","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Drop Shoulder T-shirts/img.jpg","alt":"Drop Shoulder Tees"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["DROP SHOULDER TEES",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","5",{"href":"/category/hoodies","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Hoodies/img.jpg","alt":"Hoodies"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["HOODIES",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","6",{"href":"/category/knitted-polo-tees","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Knitted Polo T-Shirts/img.jpg","alt":"Knitted Polo Tees"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["KNITTED POLO TEES",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","7",{"href":"/category/normal-basic-tees","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Normal Basic T-shirts/img.jpg","alt":"Normal Basic Tees"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["NORMAL BASIC TEES",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","11",{"href":"/category/polo","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Classic Polo Shirts/img.jpg","alt":"Polo"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["POLO",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","8",{"href":"/category/sweat-shirt","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Sweat Shirt/img.jpg","alt":"Sweat Shirt"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["SWEAT SHIRT",["$","span",null,{"className":"arrow","children":"→"}]]}]]}],["$","$Lf","9",{"href":"/category/textured-short-sleeve-shirt","className":"cat-card","children":[["$","img",null,{"src":"/category-assets/Textured Shirt/img.png","alt":"Textured Short Sleeve Shirt"}],["$","div",null,{"className":"cat-card-overlay"}],["$","div",null,{"className":"cat-card-name","children":["TEXTURED SHORT SLEEVE SHIRT",["$","span",null,{"className":"arrow","children":"→"}]]}]]}]]}]]}]}]
19:["$","$L24",null,{}]
1a:["$","section",null,{"className":"collection-section","children":["$","div",null,{"className":"collection-inner","children":[["$","div",null,{"className":"featured-header","children":[["$","div",null,{"children":[["$","span",null,{"className":"section-tag","children":"Full Drop"}],["$","h2",null,{"className":"section-heading","children":["Drop"," ",["$","em",null,{"children":["Shoulder"]}]]}]]}],["$","$Lf",null,{"href":"/category/drop-shoulder","className":"sec-cta","children":["See Full Collection ",["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-right","aria-hidden":"true","children":[["$","path","1ays0h",{"d":"M5 12h14"}],["$","path","xquz4c",{"d":"m12 5 7 7-7 7"}],"$undefined"]}]]}]]}],["$","p",null,{"style":{"textAlign":"center","color":"#999","fontSize":"16px"},"children":["No products in ","Drop Shoulder"," yet."]}]]}]}]
1b:["$","section",null,{"className":"promo-section","children":["$","$Lf",null,{"href":"/product/dreams-drop-shoulder-tee","children":["$","img",null,{"src":"/home_banner.png","alt":"Naaksh Promo Banner"}]}]}]
1c:["$","$L25",null,{}]
1d:["$","section",null,{"className":"brand-section","children":["$","div",null,{"className":"brand-inner","children":[["$","p",null,{"className":"brand-tag","children":"Our Promise"}],["$","h2",null,{"className":"brand-heading","children":["We Don't Just Sell.",["$","br",null,{}],"We Build ",["$","em",null,{"children":"Culture."}]]}],["$","p",null,{"className":"brand-sub","children":"Every stitch. Every drop. Every customer interaction — designed to leave a mark. Naaksh is more than clothing. It's a statement of who you are."}],["$","$Lf",null,{"href":"/shop","className":"brand-cta","children":["Explore the Collection ",["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":15,"height":15,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-right","aria-hidden":"true","children":[["$","path","1ays0h",{"d":"M5 12h14"}],["$","path","xquz4c",{"d":"m12 5 7 7-7 7"}],"$undefined"]}]]}]]}]}]
20:null
9:300
9:C
c:0
b:"$undefined"
8:"$undefined"
