'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import ProductCard from '../../../components/ProductCard';

export default function CategoryProductsClient({
  category,
  otherCategories = [],
  initialProducts = [],
  meta = {},
  currentSort = 'newest',
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (!('page' in updates)) {
      params.delete('page');
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const currentPage = Number(meta?.current_page) || 1;
  const lastPage = Number(meta?.last_page) || 1;
  const total = Number(meta?.total) || initialProducts.length;
  const perPage = Number(meta?.per_page) || 12;

  const startItem = total > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endItem = Math.min(currentPage * perPage, total);

  return (
    <div className="min-h-screen bg-white">
      {/* Category Hero Banner */}
      <section className="relative bg-black text-white py-16 sm:py-24 border-b border-yellow-900/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{ backgroundImage: `url('${category?.image || '/category-assets/Drop Shoulder T-shirts/img.jpg'}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
              <li>
                <Link href="/" className="hover:text-yellow-400 transition">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/shop" className="hover:text-yellow-400 transition">Shop</Link>
              </li>
              <li>/</li>
              <li className="text-yellow-400 font-semibold">{category?.name}</li>
            </ol>
          </nav>

          <span className="inline-block text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">
            Collection Drop
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-4">
            {category?.name}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl">
            Explore premium {category?.name?.toLowerCase()} streetwear engineered with discipline, luxury materials, and signature Pakistani craftsmanship.
          </p>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
          <p className="text-xs text-gray-600">
            Showing <span className="font-bold text-black">{startItem}–{endItem}</span> of <span className="font-bold text-black">{total}</span> products
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="category-sort" className="text-xs font-bold tracking-wider text-gray-500 uppercase">
              Sort:
            </label>
            <select
              id="category-sort"
              value={currentSort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="border border-gray-300 bg-white px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-900 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {initialProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {initialProducts.map((product) => (
                <ProductCard
                  key={product.uuid || product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 pt-8 border-t border-gray-100">
                <button
                  onClick={() => updateQuery({ page: Math.max(1, currentPage - 1) })}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 border border-gray-300 text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition flex items-center gap-1"
                >
                  <ArrowLeft size={12} /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => updateQuery({ page: pageNumber })}
                      className={`w-8 h-8 text-xs font-bold transition ${
                        pageNumber === currentPage
                          ? 'bg-black text-white'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => updateQuery({ page: Math.min(lastPage, currentPage + 1) })}
                  disabled={currentPage >= lastPage}
                  className="px-3 py-2 border border-gray-300 text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition flex items-center gap-1"
                >
                  Next <ArrowRight size={12} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-4 bg-gray-50 border border-gray-200 mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
              No Products in this Category
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              There are currently no products available in the {category?.name} collection.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Other Categories Showcase */}
        {otherCategories.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-yellow-600 uppercase">Explore More</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
                  Other Categories
                </h2>
              </div>
              <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-black hover:text-yellow-600 transition flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherCategories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden bg-black text-white block"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white group-hover:text-yellow-400 transition">
                      {cat.name}
                    </span>
                    <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
