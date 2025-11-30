import { useState, useMemo, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

export default function Shop() {
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    const [selectedColors, setSelectedColors] = useState({});
    const [filters, setFilters] = useState({
        categories: categoryFromUrl ? [categoryFromUrl] : [],
        priceRange: 'all',
        colors: [],
        searchQuery: ''
    });
    const [sortBy, setSortBy] = useState('newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Listen for URL changes and update filters
    useEffect(() => {
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            const category = params.get('category');
            if (category) {
                setFilters(prev => ({
                    ...prev,
                    categories: [category]
                }));
            }
        };

        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    const handleColorClick = (productId, colorIndex) => {
        setSelectedColors(prev => ({ ...prev, [productId]: colorIndex }));
    };

    // All products data
    const products = [
        {
            id: 1,
            slug: "discipline-hoodie",
            name: "Discipline Hoodie",
            category: "Hoodies",
            price: 1199,
            priceText: "PKR 1,199",
            original: "PKR 2,399",
            badge: "SALE",
            colors: [
                { hex: "#ffffff", name: "White", images: ["https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800"] },
                { hex: "#000000", name: "Black", images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800"] }
            ]
        },
        {
            id: 2,
            slug: "luxury-hoodie",
            name: "Luxury Hoodie",
            category: "Hoodies",
            price: 3999,
            priceText: "PKR 3,999",
            original: "PKR 7,999",
            badge: "SALE",
            colors: [{ hex: "#000000", name: "Black", images: ["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800", "https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800"] }]
        },
        {
            id: 3,
            slug: "premium-jacket",
            name: "Premium Jacket",
            category: "Jackets",
            price: 5999,
            priceText: "PKR 5,999",
            badge: "NEW",
            colors: [{ hex: "#2F4F4F", name: "Dark Slate", images: ["https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800"] }]
        },
        {
            id: 4,
            slug: "classic-overshirt",
            name: "Classic Overshirt",
            category: "Shirts",
            price: 3699,
            priceText: "PKR 3,699",
            original: "PKR 5,499",
            badge: "SALE",
            colors: [{ hex: "#000000", name: "Black", images: ["https://images.unsplash.com/photo-1596777684687-81ce907fb5ec?w=800"] }]
        },
        {
            id: 5,
            slug: "minimal-tshirt",
            name: "Minimal T-Shirt",
            category: "T-Shirts",
            price: 1999,
            priceText: "PKR 1,999",
            badge: "NEW",
            colors: [{ hex: "#ffffff", name: "White", images: ["https://images.unsplash.com/photo-1578932750294-708afda11a11?w=800"] }]
        },
        {
            id: 6,
            slug: "urban-hoodie",
            name: "Urban Hoodie",
            category: "Hoodies",
            price: 4299,
            priceText: "PKR 4,299",
            colors: [{ hex: "#1a1a1a", name: "Black", images: ["https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800"] }]
        },
        {
            id: 7,
            slug: "street-jacket",
            name: "Street Jacket",
            category: "Jackets",
            price: 5999,
            priceText: "PKR 5,999",
            badge: "SALE",
            colors: [{ hex: "#696969", name: "Gray", images: ["https://images.unsplash.com/photo-1539533057440-7814baea1002?w=800"] }]
        },
        {
            id: 8,
            slug: "premium-joggers",
            name: "Premium Joggers",
            category: "Bottoms",
            price: 2299,
            priceText: "PKR 2,299",
            badge: "NEW",
            colors: [{ hex: "#000000", name: "Black", images: ["https://images.unsplash.com/photo-1506629082847-11d3e392e175?w=800"] }]
        },
        {
            id: 9,
            slug: "essential-tee",
            name: "Essential Tee",
            category: "T-Shirts",
            price: 1499,
            priceText: "PKR 1,499",
            colors: [{ hex: "#ffffff", name: "White", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"] }]
        },
        {
            id: 10,
            slug: "comfort-joggers",
            name: "Comfort Joggers",
            category: "Bottoms",
            price: 2799,
            priceText: "PKR 2,799",
            colors: [{ hex: "#808080", name: "Gray", images: ["https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=800"] }]
        },
        {
            id: 11,
            slug: "winter-jacket",
            name: "Winter Jacket",
            category: "Jackets",
            price: 7999,
            priceText: "PKR 7,999",
            colors: [{ hex: "#000080", name: "Navy", images: ["https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800"] }]
        },
        {
            id: 12,
            slug: "casual-shirt",
            name: "Casual Shirt",
            category: "Shirts",
            price: 2999,
            priceText: "PKR 2,999",
            colors: [{ hex: "#4169E1", name: "Blue", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"] }]
        },
        {
            id: 13,
            slug: "casual-shirt",
            name: "Casual Shirt",
            category: "Shirts",
            price: 2999,
            priceText: "PKR 2,999",
            colors: [{ hex: "#4169E1", name: "Blue", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"] }]
        },
        {
            id: 14,
            slug: "casual-shirt",
            name: "Casual Shirt",
            category: "Shirts",
            price: 2999,
            priceText: "PKR 2,999",
            colors: [{ hex: "#4169E1", name: "Blue", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"] }]
        },
    ];

    // Get unique categories
    const categories = [...new Set(products.map(p => p.category))];

    // Get unique colors
    const availableColors = [...new Set(products.flatMap(p => p.colors.map(c => c.name)))];

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false;
            }

            // Price filter
            if (filters.priceRange !== 'all') {
                if (filters.priceRange === '0-2000' && product.price > 2000) return false;
                if (filters.priceRange === '2000-4000' && (product.price < 2000 || product.price > 4000)) return false;
                if (filters.priceRange === '4000-6000' && (product.price < 4000 || product.price > 6000)) return false;
                if (filters.priceRange === '6000+' && product.price < 6000) return false;
            }

            // Color filter
            if (filters.colors.length > 0) {
                const hasColor = product.colors.some(c => filters.colors.includes(c.name));
                if (!hasColor) return false;
            }

            // Search filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                return product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query);
            }

            return true;
        });
    }, [filters]);

    // Sort products
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        
        switch(sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'newest':
                return sorted;
            case 'oldest':
                return sorted.reverse();
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortBy]);

    const toggleCategory = (category) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
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
        setFilters({
            categories: [],
            priceRange: 'all',
            colors: [],
            searchQuery: ''
        });
    };

    const ProductCard = ({ product }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const selectedColorIndex = selectedColors[product.id] ?? 0;
        const selectedColor = product.colors[selectedColorIndex];
        const images = selectedColor.images || [selectedColor.image];
        const currentImage = images[currentImageIndex] || selectedColor.image;

        const handleCardClick = () => {
            window.location.href = `/product/${product.slug}`;
        };

        return (
            <div
                onClick={handleCardClick}
                className="block group cursor-pointer"
                onMouseEnter={() => images.length > 1 && setCurrentImageIndex(1)}
                onMouseLeave={() => setCurrentImageIndex(0)}
            >
                <div className="relative bg-white overflow-hidden transition-all duration-300">
                    {product.badge && (
                        <div className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-widest z-10 uppercase ${product.badge === 'SALE'
                            ? 'bg-black text-white'
                            : 'bg-white text-black border border-black'
                            }`}>
                            {product.badge}
                        </div>
                    )}

                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="w-full bg-black text-white py-3 text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors uppercase"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 pb-2">
                        <p className="text-[10px] font-medium tracking-widest text-gray-500 mb-2 uppercase">
                            {product.category}
                        </p>

                        <h3 className="text-sm font-medium mb-2 text-gray-900 group-hover:text-black transition-colors">
                            {product.name}
                        </h3>

                        {product.colors.length > 1 && (
                            <div className="flex gap-1.5 mb-3">
                                {product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleColorClick(product.id, index);
                                        }}
                                        className={`w-5 h-5 rounded-full border transition-all ${selectedColorIndex === index
                                            ? 'border-2 border-black ring-1 ring-gray-300'
                                            : 'border border-gray-300 hover:border-gray-400'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-semibold text-black">
                                {product.priceText}
                            </span>
                            {product.original && (
                                <span className="text-xs text-gray-400 line-through">
                                    {product.original}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Breadcrumbs */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-sm">
                        <li>
                            <a href="/" className="text-gray-500 hover:text-black transition-colors">
                                Home
                            </a>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li className="text-black font-medium">
                            Shop
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                        {filters.categories.length === 1 ? (
                            <>
                                <span className="text-yellow-400">{filters.categories[0].toUpperCase()}</span> COLLECTION
                            </>
                        ) : (
                            <>
                                ALL <span className="text-yellow-400">PRODUCTS</span>
                            </>
                        )}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-gray-600">
                            Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
                        </p>
                        
                        {/* Sort By Dropdown */}
                        <div className="flex items-center gap-3">
                            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                                Sort by:
                            </label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
                            >
                                <option value="newest">Newest to Oldest</option>
                                <option value="oldest">Oldest to Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-12">

                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                    {(filters.categories.length > 0 || filters.colors.length > 0 || filters.priceRange !== 'all' || filters.searchQuery) && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                                        >
                                            <X size={14} />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Search */}
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h3 className="text-xs font-semibold mb-3 uppercase tracking-widest text-gray-900">Search</h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={filters.searchQuery}
                                            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        />
                                        <Search className="absolute right-3 top-3 text-gray-400" size={16} />
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h3 className="text-xs font-semibold mb-4 uppercase tracking-widest text-gray-900">Category</h3>
                                    <div className="space-y-3">
                                        {categories.map(category => {
                                            const count = products.filter(p => p.category === category).length;
                                            return (
                                                <label key={category} className="flex items-center justify-between cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.categories.includes(category)}
                                                            onChange={() => toggleCategory(category)}
                                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
                                                        />
                                                        <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{category}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">({count})</span>
                                                </label>
                                            );
                                        })}
                                    </div>
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
                                                    name="price"
                                                    checked={filters.priceRange === option.value}
                                                    onChange={() => setFilters(prev => ({ ...prev, priceRange: option.value }))}
                                                    className="w-4 h-4 text-black focus:ring-black focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <h3 className="text-xs font-semibold mb-4 uppercase tracking-widest text-gray-900">Color</h3>
                                    <div className="space-y-3">
                                        {availableColors.map(color => {
                                            const colorProduct = products.find(p => p.colors.some(c => c.name === color));
                                            const colorHex = colorProduct?.colors.find(c => c.name === color)?.hex;
                                            return (
                                                <label key={color} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.colors.includes(color)}
                                                        onChange={() => toggleColor(color)}
                                                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: colorHex }}
                                                        />
                                                        <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{color}</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg z-30 flex items-center gap-2"
                    >
                        Filters
                        <ChevronDown size={18} />
                    </button>

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
                                    <div className="mt-16 flex items-center justify-center gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.max(prev - 1, 1));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                
                                                // Show first page, last page, current page, and pages around current
                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === totalPages ||
                                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => {
                                                                setCurrentPage(pageNumber);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                                                currentPage === pageNumber
                                                                    ? 'bg-black text-white'
                                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                } else if (
                                                    pageNumber === currentPage - 2 ||
                                                    pageNumber === currentPage + 2
                                                ) {
                                                    return <span key={pageNumber} className="w-10 h-10 flex items-center justify-center">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg mb-4">No products found</p>
                                <button
                                    onClick={clearFilters}
                                    className="text-black underline hover:no-underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Same filter content as desktop */}
                        <div className="space-y-8">
                            {/* Search */}
                            <div>
                                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Search</h3>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                    className="w-full border border-gray-300 px-4 py-2 text-sm"
                                />
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Price</h3>
                                <div className="space-y-2">
                                    {[
                                        { value: 'all', label: 'All Prices' },
                                        { value: '0-2000', label: 'Under PKR 2,000' },
                                        { value: '2000-4000', label: 'PKR 2,000 - 4,000' },
                                        { value: '4000-6000', label: 'PKR 4,000 - 6,000' },
                                        { value: '6000+', label: 'PKR 6,000+' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="price-mobile"
                                                checked={filters.priceRange === option.value}
                                                onChange={() => setFilters(prev => ({ ...prev, priceRange: option.value }))}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Color</h3>
                                <div className="space-y-2">
                                    {availableColors.map(color => (
                                        <label key={color} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={filters.colors.includes(color)}
                                                onChange={() => toggleColor(color)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="w-full bg-gray-100 text-black py-3 text-sm font-medium"
                            >
                                Clear All Filters
                            </button>

                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full bg-black text-white py-3 text-sm font-medium"
                            >
                                Show {sortedProducts.length} Products
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}