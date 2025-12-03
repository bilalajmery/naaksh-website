import { useState, useMemo, useEffect } from 'react';
import { X, ChevronDown, Search, Loader2 } from 'lucide-react';
import { NavLink, useSearchParams } from 'react-router-dom';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedColors, setSelectedColors] = useState({});
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: 'all',
        colors: [],
        searchQuery: ''
    });
    const [sortBy, setSortBy] = useState('newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    // Fetch products
    useEffect(() => {
        fetch('/product/data.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Extract unique categories & colors
    const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
    const availableColors = useMemo(() => [...new Set(products.flatMap(p => p.colors?.map(c => c.name) || []))], [products]);

    // Sync URL → Filters (when URL changes or page loads)
    useEffect(() => {
        const urlCat = searchParams.get('category');
        if (!urlCat) {
            setFilters(prev => ({ ...prev, categories: [] }));
            return;
        }

        const incoming = urlCat
            .split(',')
            .map(c => c.trim())
            .filter(Boolean)
            .map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase());

        const validCategories = categories.filter(cat =>
            incoming.some(inc => inc.toLowerCase() === cat.toLowerCase())
        );

        setFilters(prev => ({ ...prev, categories: validCategories }));
    }, [searchParams, categories]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Category filter
            if (filters.categories.length > 0) {
                const match = filters.categories.some(cat =>
                    product.category.toLowerCase() === cat.toLowerCase()
                );
                if (!match) return false;
            }

            // Price filter
            if (filters.priceRange !== 'all') {
                const price = product.priceNum || 0;
                if (filters.priceRange === '0-2000' && price > 2000) return false;
                if (filters.priceRange === '2000-4000' && (price < 2000 || price > 4000)) return false;
                if (filters.priceRange === '4000-6000' && (price < 4000 || price > 6000)) return false;
                if (filters.priceRange === '6000+' && price < 6000) return false;
            }

            // Color filter
            if (filters.colors.length > 0) {
                const hasColor = product.colors?.some(c => filters.colors.includes(c.name));
                if (!hasColor) return false;
            }

            // Search
            if (filters.searchQuery) {
                const q = filters.searchQuery.toLowerCase();
                return product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q);
            }

            return true;
        });
    }, [products, filters]);

    // Sort products
    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts];
        if (sortBy === 'price-low') return list.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
        if (sortBy === 'price-high') return list.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
        if (sortBy === 'oldest') return list.sort((a, b) => new Date(a.date) - new Date(b.date));
        return list.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest
    }, [filteredProducts, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const currentProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    // Reset page on filter change
    useEffect(() => setCurrentPage(1), [filters, sortBy]);

    // Toggle category + update URL
    const toggleCategory = (category) => {
        setFilters(prev => {
            const exists = prev.categories.some(c => c.toLowerCase() === category.toLowerCase());
            const newCategories = exists
                ? prev.categories.filter(c => c.toLowerCase() !== category.toLowerCase())
                : [...prev.categories, category];

            // Update URL
            if (newCategories.length > 0) {
                setSearchParams({ category: newCategories.join(',') });
            } else {
                const params = new URLSearchParams(searchParams);
                params.delete('category');
                setSearchParams(params);
            }

            return { ...prev, categories: newCategories };
        });
    };

    const toggleColor = (color) => {
        setFilters(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color]
        }));
    };

    const clearFilters = () => {
        setFilters({ categories: [], priceRange: 'all', colors: [], searchQuery: '' });
        setSearchParams({});
    };

    const handleColorClick = (productId, colorIndex) => {
        setSelectedColors(prev => ({ ...prev, [productId]: colorIndex }));
    };

    // Product Card
    const ProductCard = ({ product }) => {
        const [hoverImgIndex, setHoverImgIndex] = useState(0);
        const selectedColorIndex = selectedColors[product.id] ?? 0;
        const selectedColor = product.colors?.[selectedColorIndex] || { images: [] };
        const images = selectedColor.images || [];
        const currentImage = images[hoverImgIndex] || images[0] || '/placeholder.jpg';

        return (
            <NavLink to={`/product/${product.slug}`} className="block group">
                <div className="relative bg-white overflow-hidden">
                    {product.badge && (
                        <div className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-widest z-10 uppercase bg-black text-white`}>
                            {product.badge}
                        </div>
                    )}

                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onMouseEnter={() => images.length > 1 && setHoverImgIndex(1)}
                            onMouseLeave={() => setHoverImgIndex(0)}
                        />

                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    alert(`Added "${product.name}" to cart!`);
                                }}
                                className="w-full bg-black text-white py-3 text-sm font-medium tracking-wider hover:bg-gray-900 uppercase"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 pb-2">
                        <p className="text-[10px] font-medium tracking-widest text-gray-500 mb-2 uppercase">{product.category}</p>
                        <h3 className="text-sm font-medium mb-2 text-gray-900 group-hover:text-black transition-colors">{product.name}</h3>

                        {product.colors && product.colors.length > 1 && (
                            <div className="flex gap-1.5 mb-3">
                                {product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleColorClick(product.id, index);
                                        }}
                                        className={`w-5 h-5 rounded-full border transition-all ${selectedColorIndex === index ? 'border-2 border-black ring-1 ring-gray-300' : 'border border-gray-300 hover:border-gray-400'}`}
                                        style={{ backgroundColor: color.hex }}
                                        aria-label={color.name}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-semibold text-black">{product.price}</span>
                            {product.original && <span className="text-xs text-gray-400 line-through">{product.original}</span>}
                        </div>
                    </div>
                </div>
            </NavLink>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Breadcrumbs */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-sm">
                        <li><a href="/" className="text-gray-500 hover:text-black">Home</a></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-black font-medium">Shop</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                        {filters.categories.length === 1 ? (
                            <>{filters.categories[0].toUpperCase()} <span className="text-yellow-400">COLLECTION</span></>
                        ) : (
                            <>ALL <span className="text-yellow-400">PRODUCTS</span></>
                        )}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-gray-600">
                            Showing {currentProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0}–{Math.min(currentPage * productsPerPage, sortedProducts.length)} of {sortedProducts.length} products
                        </p>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-12">
                    {/* Desktop Filters */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <h2 className="text-lg font-bold">Filters</h2>
                                {(filters.categories.length || filters.colors.length || filters.priceRange !== 'all' || filters.searchQuery) && (
                                    <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-black flex items-center gap-1">
                                        <X size={14} /> Clear All
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Categories */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest">Category</h3>
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.some(c => c.toLowerCase() === cat.toLowerCase())}
                                                onChange={() => toggleCategory(cat)}
                                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                            />
                                            <span className="text-sm">{cat}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">({products.filter(p => p.category === cat).length})</span>
                                    </label>
                                ))}
                            </div>

                            {/* Price Range */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-xs font-semibold mb-4 uppercase tracking-widest text-gray-900">Price Range</h3>
                                <div className="space-y-3">
                                    {[
                                        { value: 'all', label: 'All Prices' },
                                        { value: '0-2000', label: 'Under PKR 2,000' },
                                        { value: '2000-4000', label: 'PKR 2,000 - 4,000' },
                                        { value: '4000-6000', label: 'PKR 4,000 - 6,000' },
                                        { value: '6000+', label: 'PKR 6,000+' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                value={option.value}
                                                checked={filters.priceRange === option.value}
                                                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                                                className="w-4 h-4 text-black focus:ring-black"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-black">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h3 className="text-xs font-semibold mb-4 uppercase tracking-widest text-gray-900">Color</h3>
                                <div className="space-y-3">
                                    {availableColors.map(color => {
                                        const sampleProduct = products.find(p => p.colors?.some(c => c.name === color));
                                        const hex = sampleProduct?.colors.find(c => c.name === color)?.hex;
                                        return (
                                            <label key={color} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.colors.includes(color)}
                                                    onChange={() => toggleColor(color)}
                                                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: hex }} />
                                                    <span className="text-sm text-gray-700 group-hover:text-black">{color}</span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {currentProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                                    {currentProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center gap-2">
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-lg disabled:opacity-50">Previous</button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg ${currentPage === i + 1 ? 'bg-black text-white' : 'border hover:bg-gray-50'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-50">Next</button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-bold mb-4">No products found</h3>
                                <button onClick={clearFilters} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Filter Button & Modal (same as your original) */}
                <button onClick={() => setShowMobileFilters(true)} className="lg:hidden fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg z-30 flex items-center gap-2">
                    Filters <ChevronDown size={18} />
                </button>

                {/* Mobile Filters Modal */}
                {showMobileFilters && (
                    <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Search */}
                                <div>
                                    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Search</h3>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={filters.searchQuery}
                                        onChange={e => setFilters(p => ({ ...p, searchQuery: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Category</h3>
                                    <div className="space-y-3">
                                        {categories.map(c => {
                                            const count = products.filter(p => p.category === c).length;
                                            return (
                                                <label key={c} className="flex items-center justify-between cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.categories.includes(c)}
                                                            onChange={() => toggleCategory(c)}
                                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                        />
                                                        <span className="text-sm">{c}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">({count})</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Price Range</h3>
                                    <div className="space-y-3">
                                        {[
                                            { v: 'all', l: 'All Prices' },
                                            { v: '0-2000', l: 'Under PKR 2,000' },
                                            { v: '2000-4000', l: 'PKR 2,000 - 4,000' },
                                            { v: '4000-6000', l: 'PKR 4,000 - 6,000' },
                                            { v: '6000+', l: 'PKR 6,000+' }
                                        ].map(o => (
                                            <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="priceRangeMobile"
                                                    value={o.v}
                                                    checked={filters.priceRange === o.v}
                                                    onChange={(e) => setFilters(p => ({ ...p, priceRange: e.target.value }))}
                                                    className="w-4 h-4 text-black focus:ring-black"
                                                />
                                                <span className="text-sm">{o.l}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Color</h3>
                                    <div className="space-y-3">
                                        {availableColors.map(c => {
                                            const sampleProduct = products.find(p => p.colors?.some(col => col.name === c));
                                            const hex = sampleProduct?.colors.find(col => col.name === c)?.hex;
                                            return (
                                                <label key={c} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.colors.includes(c)}
                                                        onChange={() => toggleColor(c)}
                                                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: hex }} />
                                                        <span className="text-sm">{c}</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
                                <button
                                    onClick={clearFilters}
                                    className="w-full bg-gray-100 text-black py-3 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full bg-black text-white py-3 text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                                >
                                    Show {sortedProducts.length} Products
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}