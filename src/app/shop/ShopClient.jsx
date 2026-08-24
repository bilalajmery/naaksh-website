'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { X, ChevronDown, Search, Filter, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

export default function ShopClient({
  initialProducts = [],
  categories = [],
  meta = {},
  currentFilters = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(currentFilters.search || '');

  // Helper to build URL with updated search params
  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 whenever filters or search change (unless page itself is being changed)
    if (!('page' in updates)) {
      params.delete('page');
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery({ search: searchInput.trim() });
  };

  const handleCategoryToggle = (categoryId) => {
    const currentId = currentFilters.category_id;
    if (String(currentId) === String(categoryId)) {
      updateQuery({ category_id: null });
    } else {
      updateQuery({ category_id: categoryId });
    }
  };

  const handleSortChange = (e) => {
    updateQuery({ sort: e.target.value });
  };

  const handleStockToggle = (status) => {
    if (currentFilters.stock_status === status) {
      updateQuery({ stock_status: null });
    } else {
      updateQuery({ stock_status: status });
    }
  };

  const handleClearFilters = () => {
    setSearchInput('');
    router.push(pathname, { scroll: false });
  };

  const currentPage = Number(meta?.current_page) || 1;
  const lastPage = Number(meta?.last_page) || 1;
  const total = Number(meta?.total) || initialProducts.length;
  const perPage = Number(meta?.per_page) || 12;

  const startItem = total > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endItem = Math.min(currentPage * perPage, total);

  // Active category name
  const activeCategory = categories.find(
    (c) => String(c.id) === String(currentFilters.category_id)
  );

  const hasActiveFilters = Boolean(
    currentFilters.category_id ||
    currentFilters.search ||
    currentFilters.sort ||
    currentFilters.stock_status
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
            <li>
              <Link href="/" className="hover:text-black transition">Home</Link>
            </li>
            <li>/</li>
            <li className="text-black font-semibold">Shop</li>
            {activeCategory && (
              <>
                <li>/</li>
                <li className="text-yellow-600 font-bold">{activeCategory.name}</li>
              </>
            )}
          </ol>
        </nav>

        {/* Page Title & Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">Catalog</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black mt-1 uppercase">
                {activeCategory ? activeCategory.name : 'All Products'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none"
              >
                <Filter size={14} />
                Filters {hasActiveFilters && '(Active)'}
              </button>

              <div className="flex items-center gap-2">
                <label htmlFor="shop-sort" className="text-xs font-bold tracking-wider text-gray-500 uppercase hidden sm:inline">
                  Sort:
                </label>
                <select
                  id="shop-sort"
                  value={currentFilters.sort || 'newest'}
                  onChange={handleSortChange}
                  className="border border-gray-300 bg-white px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-900 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count & Active Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-gray-500">
            <div>
              Showing <span className="font-bold text-black">{startItem}–{endItem}</span> of <span className="font-bold text-black">{total}</span> products
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {activeCategory && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-900 px-2.5 py-1 text-[11px] font-semibold">
                    Category: {activeCategory.name}
                    <button onClick={() => updateQuery({ category_id: null })} className="hover:text-black">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {currentFilters.search && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 px-2.5 py-1 text-[11px] font-semibold">
                    Search: &ldquo;{currentFilters.search}&rdquo;
                    <button onClick={() => { setSearchInput(''); updateQuery({ search: null }); }} className="hover:text-black">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {currentFilters.stock_status && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 px-2.5 py-1 text-[11px] font-semibold">
                    Stock: {currentFilters.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    <button onClick={() => updateQuery({ stock_status: null })} className="hover:text-black">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-red-600 font-bold hover:underline ml-1 inline-flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Reset All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`md:block ${showMobileFilters ? 'block mb-6' : 'hidden'} md:col-span-1 space-y-6 border-r border-gray-100 pr-6`}>
            {/* Search Box */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Search</h3>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black pr-8"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  aria-label="Submit search"
                >
                  <Search size={14} />
                </button>
              </form>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Categories</h3>
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                <button
                  onClick={() => updateQuery({ category_id: null })}
                  className={`w-full text-left px-2 py-1.5 text-xs transition flex items-center justify-between ${
                    !currentFilters.category_id
                      ? 'bg-black text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((cat) => {
                  const isSelected = String(currentFilters.category_id) === String(cat.id);
                  return (
                    <button
                      key={cat.id || cat.slug}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`w-full text-left px-2 py-1.5 text-xs transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-yellow-400 text-black font-bold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat.products_count !== undefined && (
                        <span className="text-[10px] opacity-75 ml-1">({cat.products_count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Availability Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Availability</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleStockToggle('in_stock')}
                  className={`w-full text-left px-2 py-1.5 text-xs transition ${
                    currentFilters.stock_status === 'in_stock'
                      ? 'bg-black text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  In Stock Only
                </button>
                <button
                  onClick={() => handleStockToggle('out_of_stock')}
                  className={`w-full text-left px-2 py-1.5 text-xs transition ${
                    currentFilters.stock_status === 'out_of_stock'
                      ? 'bg-black text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Out of Stock Only
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="md:col-span-3 lg:col-span-4">
            {initialProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {initialProducts.map((product) => (
                    <ProductCard
                      key={product.uuid || product.id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
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
                      {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNumber) => {
                        // Display concise pagination around current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === lastPage ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          const isCurrent = pageNumber === currentPage;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => updateQuery({ page: pageNumber })}
                              className={`w-8 h-8 text-xs font-bold transition ${
                                isCurrent
                                  ? 'bg-black text-white'
                                  : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return <span key={pageNumber} className="px-1 text-gray-400">...</span>;
                        }
                        return null;
                      })}
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
              /* Clean Empty State */
              <div className="text-center py-16 px-4 bg-gray-50 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  No Products Found
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  {hasActiveFilters
                    ? 'No products matched your active filters. Try resetting your search or filter parameters.'
                    : 'Our catalog is currently being updated. Please check back shortly.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition"
                  >
                    <RotateCcw size={14} /> Clear All Filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
