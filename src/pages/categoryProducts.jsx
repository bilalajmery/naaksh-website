import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet-async";

export default function CategoryProducts() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch data
  useEffect(() => {
    Promise.all([
      fetch("/product/data.json").then((r) => (r.ok ? r.json() : [])),
      fetch("/category/data.json").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([productData, categoryData]) => {
        setProducts(productData);
        setCategories(categoryData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  // Find current category by slug
  const currentCategory = useMemo(() => {
    return categories.find((cat) => cat.slug === slug);
  }, [categories, slug]);

  // Redirect to 404 if category not found (after loading)
  useEffect(() => {
    if (!loading && categories.length > 0 && !currentCategory) {
      navigate("/404", { replace: true });
    }
  }, [loading, categories, currentCategory, navigate]);

  // Get other categories for the bottom section
  const otherCategories = useMemo(() => {
    return categories.filter((cat) => cat.slug !== slug);
  }, [categories, slug]);

  // Filter products for this category
  const categoryProducts = useMemo(() => {
    if (!currentCategory) return [];
    return products.filter(
      (p) => p.category.toLowerCase() === currentCategory.name.toLowerCase()
    );
  }, [products, currentCategory]);

  // Sort
  const sortedProducts = useMemo(() => {
    const list = [...categoryProducts];
    if (sortBy === "price-low") return list.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    if (sortBy === "price-high") return list.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    if (sortBy === "oldest") return list.sort((a, b) => (a.id || 0) - (b.id || 0));
    if (sortBy === "rating") return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list.sort((a, b) => (b.id || 0) - (a.id || 0)); // newest
  }, [categoryProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset page on sort/slug change
  useEffect(() => setCurrentPage(1), [sortBy, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!currentCategory) return null;

  const categoryName = currentCategory.name;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{categoryName} | NAAKSH | Premium Streetwear & Urban Fashion in Pakistan</title>
        <meta
          name="description"
          content={`Shop the latest ${categoryName} collection at Naaksh. High-quality streetwear with free delivery across Pakistan.`}
        />
        <link rel="canonical" href={`https://naakshofficial.com/category/${slug}`} />
      </Helmet>

      <style>{`
        /* ─── CATEGORY PAGE HERO ─── */
        .cat-page-hero {
          position: relative;
          height: 340px;
          overflow: hidden;
          background: #0d0d0d;
        }
        @media (max-width: 768px) {
          .cat-page-hero { height: 260px; }
        }
        .cat-page-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
          transition: transform 0.8s ease;
        }
        .cat-page-hero:hover .cat-page-hero-img {
          transform: scale(1.03);
        }
        .cat-page-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.5) 50%,
            rgba(0,0,0,0.3) 100%
          );
        }
        .cat-page-hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
        }
        .cat-page-hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #fdc700;
          text-transform: uppercase;
          background: rgba(253,199,0,0.1);
          border: 1px solid rgba(253,199,0,0.25);
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 16px;
        }
        .cat-page-hero-label::before {
          content: "";
          width: 6px;
          height: 6px;
          background: #fdc700;
          border-radius: 50%;
          animation: cat-pulse 1.5s ease-in-out infinite;
        }
        @keyframes cat-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .cat-page-hero-title {
          font-size: clamp(32px, 6vw, 64px);
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0 0 12px;
        }
        .cat-page-hero-title span {
          color: #fdc700;
        }
        .cat-page-hero-count {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* ─── SORT BAR ─── */
        .cat-sort-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        /* ─── PRODUCTS GRID ─── */
        .cat-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 20px;
        }
        @media (max-width: 1024px) {
          .cat-products-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .cat-products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; }
        }

        /* ─── OTHER CATEGORIES ─── */
        .other-cats-section {
          background: #0d0d0d;
          padding: 64px 24px;
        }
        .other-cats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          max-width: 1280px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .other-cats-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .other-cats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .other-cat-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          aspect-ratio: 3/4;
          background: #1a1a1a;
          text-decoration: none;
          display: block;
          border: 1px solid #222;
          transition: border-color 0.3s, transform 0.3s;
        }
        .other-cat-card:hover {
          border-color: #fdc700;
          transform: translateY(-4px);
        }
        .other-cat-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        .other-cat-card:hover img {
          transform: scale(1.08);
        }
        .other-cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%);
        }
        .other-cat-name {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
        }
        .other-cat-name .arrow {
          display: block;
          color: #fdc700;
          font-size: 16px;
          margin-top: 4px;
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.3s;
        }
        .other-cat-card:hover .other-cat-name .arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* ═══ HERO BANNER ═══ */}
      <section className="cat-page-hero">
        <img
          src={currentCategory.image}
          alt={categoryName}
          className="cat-page-hero-img"
        />
        <div className="cat-page-hero-overlay" />
        <div className="cat-page-hero-content">
          <div className="cat-page-hero-label">Collection</div>
          <h1 className="cat-page-hero-title">
            {categoryName.split(" ").slice(0, -1).join(" ")}{" "}
            <span>{categoryName.split(" ").slice(-1)}</span>
          </h1>
          <p className="cat-page-hero-count">
            {categoryProducts.length} {categoryProducts.length === 1 ? "Product" : "Products"} Available
          </p>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-6 py-10 pb-20">

        {/* Sort Bar */}
        <div className="cat-sort-bar">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-black">
              {currentProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0}–
              {Math.min(currentPage * productsPerPage, sortedProducts.length)}
            </span>{" "}
            of <span className="font-semibold text-black">{sortedProducts.length}</span> products
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="cat-products-grid">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg transition-colors text-sm font-medium ${
                      currentPage === i + 1
                        ? "bg-black text-white"
                        : "border border-gray-200 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-xl font-bold mb-2 text-gray-900">No products found</h3>
            <p className="text-gray-500 text-sm">No products are available in this category yet.</p>
          </div>
        )}
      </div>

      {/* ═══ BROWSE OTHER CATEGORIES ═══ */}
      {otherCategories.length > 0 && (
        <section className="other-cats-section">
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ marginBottom: "36px" }}>
              <span style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#fdc700",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "2px solid #fdc700",
              }}>
                Explore More
              </span>
              <h2 style={{
                fontSize: "clamp(24px, 3.5vw, 40px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#fff",
                margin: 0,
              }}>
                Other <span style={{ color: "#fdc700" }}>Categories</span>
              </h2>
            </div>
            <div className="other-cats-grid">
              {otherCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="other-cat-card"
                >
                  <img src={cat.image} alt={cat.name} />
                  <div className="other-cat-overlay" />
                  <div className="other-cat-name">
                    {cat.name.toUpperCase()}
                    <span className="arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
