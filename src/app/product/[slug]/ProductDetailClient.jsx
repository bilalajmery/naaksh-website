'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, Star, Heart, Minus, Plus, Truck } from 'lucide-react';
import ProductCard from '../../../components/ProductCard';
import { toast } from 'react-toastify';
import { addToCart as addItemToCart } from '../../../lib/cart';
import { isInWishlist, toggleWishlist as toggleWishlistAction } from '../../../lib/wishlist';

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState(0);

  // Advanced Zoom State for Desktop
  const [showZoom, setShowZoom] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomBg, setZoomBg] = useState({ x: 0, y: 0 });
  const imgContainerRef = useRef(null);
  const LENS_SIZE = 150; // px
  const ZOOM_LEVEL = 2.5;

  const canonicalUuid = product?.uuid || product?.id;
  const productSlug = product?.slug || canonicalUuid;
  const isPurchasable = product?.purchasable !== false && product?.stock_status !== 'out_of_stock';

  // Extract garment colors & sizes from M16 Backend response
  const availableColors = product?.garment_colors || product?.colors || [];
  const availableSizes = product?.sizes || [];

  // Determine media list: filter by selected garment color if available
  const currentColorObj = availableColors[selectedColor] || availableColors[0] || null;
  let mediaList = [];

  if (currentColorObj?.images && Array.isArray(currentColorObj.images) && currentColorObj.images.length > 0) {
    mediaList = currentColorObj.images;
  } else if (currentColorObj?.id && product?.media && Array.isArray(product.media)) {
    mediaList = product.media
      .filter((m) => Number(m.color_id) === Number(currentColorObj.id))
      .map((m) => m.url);
  }

  if (mediaList.length === 0) {
    if (product?.media && Array.isArray(product.media) && product.media.length > 0) {
      mediaList = product.media.map((m) => m.url);
    } else if (product?.primary_media?.url) {
      mediaList = [product.primary_media.url];
    } else if (product?.image) {
      mediaList = [product.image];
    } else {
      mediaList = ['/product-assets/placeholder.png'];
    }
  }

  const currentMainImage = mediaList[mainImage] || mediaList[0] || '/product-assets/placeholder.png';

  const isVideo = (url) => {
    return url?.toLowerCase().endsWith('.mp4');
  };

  // Sync wishlist status
  useEffect(() => {
    const updateFav = () => {
      setIsFavorite(isInWishlist(canonicalUuid) || isInWishlist(productSlug));
    };

    updateFav();
    window.addEventListener("wishlist-updated", updateFav);
    window.addEventListener("storage", updateFav);

    return () => {
      window.removeEventListener("wishlist-updated", updateFav);
      window.removeEventListener("storage", updateFav);
    };
  }, [canonicalUuid, productSlug]);

  const handleToggleWishlist = () => {
    const target = canonicalUuid || productSlug;
    const added = toggleWishlistAction(target);
    setIsFavorite(added);
    toast.info(added ? 'Added to wishlist!' : 'Removed from wishlist');
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment') setQuantity((q) => q + 1);
    if (action === 'decrement' && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleMouseMove = useCallback((e) => {
    const container = imgContainerRef.current;
    if (!container) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const halfLens = LENS_SIZE / 2;
    const lensX = Math.max(halfLens, Math.min(mouseX, width - halfLens));
    const lensY = Math.max(halfLens, Math.min(mouseY, height - halfLens));

    setLensPos({ x: lensX - halfLens, y: lensY - halfLens });

    const bgX = (lensX / width) * 100;
    const bgY = (lensY / height) * 100;
    setZoomBg({ x: bgX, y: bgY });
  }, [LENS_SIZE]);

  const handleAddToCart = (isBuyNow = false) => {
    if (!isPurchasable) {
      toast.info('This product is currently out of stock.');
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const selectedColorObj = availableColors[selectedColor] || availableColors[0];
    const colorName = typeof selectedColorObj === 'object' ? selectedColorObj?.name : selectedColorObj || 'Default';
    const colorId = typeof selectedColorObj === 'object' ? selectedColorObj?.id : null;

    const selectedSizeObj = availableSizes.find(
      (s) => (typeof s === 'object' ? s.name : s) === selectedSize
    );
    const sizeId = typeof selectedSizeObj === 'object' ? selectedSizeObj?.id : null;

    addItemToCart({
      product_uuid: canonicalUuid,
      quantity: quantity,
      size_id: sizeId,
      size_name: selectedSize,
      garment_color_id: colorId,
      garment_color_name: colorName,
      name: product.name,
      slug: productSlug,
      price: product.price_display || `PKR ${Number(product.selling_price).toLocaleString()}`,
      priceNum: Number(product.selling_price) || 0,
      image: currentMainImage,
      stock: isPurchasable ? 99 : 0,
    });

    if (isBuyNow) {
      router.push('/checkout');
    } else {
      toast.success(`Added ${product.name} to cart!`);
    }
  };

  const categoryName = typeof product?.category === 'object' ? product?.category?.name : product?.category || 'Collection';
  const categorySlug = product?.category?.slug || categoryName.toLowerCase().replace(/\s+/g, '-');

  const discount = product?.original_selling_price && product?.selling_price
    ? Math.round(((product.original_selling_price - product.selling_price) / product.original_selling_price) * 100)
    : 0;

  const reviewsList = Array.isArray(product?.reviews) && product.reviews.length > 0
    ? product.reviews
    : [
        { name: 'Hamza A.', star: 5, review: 'Exceptional quality fabric and perfect drop shoulder drape.' },
        { name: 'Zainab M.', star: 5, review: 'Color and fit are exactly as shown. Premium feel!' }
      ];

  const featuresList = Array.isArray(product?.features) && product.features.length > 0
    ? product.features
    : [
        '100% Combed Compact Cotton',
        '240 GSM Heavyweight Premium Fabric',
        'Preshrunk & Bio-Washed for Longevity',
        'Signature Tailored Streetwear Cut'
      ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>/</span>
          <Link href={`/category/${categorySlug}`} className="hover:text-black transition">{categoryName}</Link>
          <span>/</span>
          <span className="text-black font-bold truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Media Gallery */}
          <div className="space-y-4 relative">
            <div
              className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square border border-gray-100"
              ref={imgContainerRef}
            >
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-xs font-black uppercase tracking-wider z-10">
                  {discount}% OFF
                </div>
              )}

              {!isPurchasable && (
                <div className="absolute top-4 right-16 bg-red-600 text-white px-3 py-1.5 text-xs font-black uppercase tracking-wider z-10">
                  Out of Stock
                </div>
              )}

              {/* Wishlist Button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleToggleWishlist}
                  className={`w-11 h-11 rounded-full shadow-md backdrop-blur-md flex items-center justify-center transition-all ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-900 hover:bg-white'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {isVideo(currentMainImage) ? (
                <video
                  src={currentMainImage}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div
                  className="relative w-full h-full cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                >
                  <img
                    src={currentMainImage}
                    alt={product.name}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />

                  {/* Magnifying Lens Circle */}
                  {showZoom && (
                    <div
                      className="absolute pointer-events-none z-20 rounded-full border-[3px] border-black/70 shadow-[0_0_0_3px_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.3)] hidden lg:block"
                      style={{
                        width: LENS_SIZE,
                        height: LENS_SIZE,
                        left: lensPos.x,
                        top: lensPos.y,
                        backgroundImage: `url(${currentMainImage})`,
                        backgroundSize: `${ZOOM_LEVEL * 100}%`,
                        backgroundPosition: `${zoomBg.x}% ${zoomBg.y}%`,
                        backgroundRepeat: 'no-repeat',
                        transition: 'left 0.05s ease-out, top 0.05s ease-out',
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-px h-full bg-black/20 absolute" />
                        <div className="h-px w-full bg-black/20 absolute" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {mediaList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {mediaList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(idx)}
                    className={`relative flex-shrink-0 overflow-hidden rounded-xl transition-all ${
                      mainImage === idx
                        ? 'ring-3 ring-black border-transparent'
                        : 'ring-1 ring-gray-200 hover:ring-gray-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isVideo(img) ? (
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                        <video src={img} className="w-full h-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="text-white text-xs font-bold">▶</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Zoom Preview Panel */}
            {showZoom && !isVideo(currentMainImage) && (
              <div
                className="hidden lg:block absolute top-0 left-[calc(100%+24px)] w-[480px] h-[480px] rounded-2xl overflow-hidden border-2 border-gray-200 bg-white z-50 shadow-2xl"
                style={{
                  backgroundImage: `url(${currentMainImage})`,
                  backgroundSize: `${ZOOM_LEVEL * 100}%`,
                  backgroundPosition: `${zoomBg.x}% ${zoomBg.y}%`,
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
                  {ZOOM_LEVEL}x Zoom
                </div>
              </div>
            )}
          </div>

          {/* Product Specifications & Order Actions */}
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-600">
                {categoryName}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1 mb-3">
                {product.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="font-bold text-sm text-black">{product.rating || 5.0}</span>
                <span className="text-xs text-gray-400">({reviewsList.length} verified reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-black">
                  {product.price_display || `PKR ${Number(product.selling_price).toLocaleString()}`}
                </span>
                {product.original_price_display && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.original_price_display}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-yellow-400 text-black px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Garment Color Selector */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">
                  Color: <span className="text-gray-500 font-normal">{availableColors[selectedColor]?.name || 'Standard'}</span>
                </h3>
                <div className="flex gap-2.5">
                  {availableColors.map((color, idx) => (
                    <button
                      key={color.id || idx}
                      onClick={() => {
                        setSelectedColor(idx);
                        setMainImage(0);
                      }}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === idx ? 'border-black scale-110 ring-2 ring-yellow-400' : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.hex || '#000000' }}
                      title={color.name}
                    >
                      {selectedColor === idx && (
                        <Check className="text-white absolute inset-0 m-auto drop-shadow" size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                    Select Size
                  </h3>
                  <span className="text-xs text-gray-400">Regular Fit</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {availableSizes.map((sizeObj) => {
                    const sizeName = typeof sizeObj === 'object' ? sizeObj.name : sizeObj;
                    const isSelected = selectedSize === sizeName;
                    return (
                      <button
                        key={typeof sizeObj === 'object' ? sizeObj.id : sizeObj}
                        onClick={() => setSelectedSize(sizeName)}
                        className={`py-3 border-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-gray-800 hover:border-black'
                        }`}
                      >
                        {sizeName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Quantity</h3>
              <div className="inline-flex border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange('decrement')}
                  className="px-4 py-2.5 hover:bg-gray-100 text-black transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-2.5 font-bold text-sm text-black border-x-2 border-gray-200 flex items-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increment')}
                  className="px-4 py-2.5 hover:bg-gray-100 text-black transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Order Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={!isPurchasable}
                className={`w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition ${
                  isPurchasable
                    ? 'bg-black text-white hover:bg-yellow-500 hover:text-black shadow-lg hover:shadow-yellow-500/20'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={18} />
                {isPurchasable ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {isPurchasable && (
                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-4 bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-widest hover:bg-yellow-500 rounded-xl transition shadow-md"
                >
                  Buy It Now
                </button>
              )}
            </div>

            {/* Shipping Benefit */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <Truck size={18} className="text-black" />
              <span>FREE HOME DELIVERY ALL OVER PAKISTAN</span>
            </div>
          </div>

          {/* Accordion / Tabs Section */}
          <div className="mt-12 lg:col-span-2">
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                {['description', 'features', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-bold uppercase text-xs tracking-widest relative transition ${
                      activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    {tab === 'description' ? 'Description' : tab === 'features' ? 'Features & Fabric' : 'Reviews'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="max-w-3xl">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-black">Product Details</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {product.description || 'Premium minimalist streetwear crafted with discipline, luxury materials, and signature Pakistani craftsmanship. Designed for elevated everyday wear with superior drape and long-lasting comfort.'}
                  </p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="max-w-3xl">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-black">Key Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {featuresList.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <Check className="text-black flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-xs font-medium text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="max-w-3xl space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-black">Verified Customer Reviews</h3>
                  {reviewsList.map((rl, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {rl.name?.[0] || 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-black">{rl.name}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Verified Buyer</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < (rl.star || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">{rl.review}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related Products Showcase */}
          {relatedProducts.length > 0 && (
            <div className="lg:col-span-2 mt-8 border-t border-gray-200 pt-16">
              <span className="block text-center text-xs font-bold tracking-widest text-yellow-600 uppercase mb-1">
                Curated Suggestions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 uppercase tracking-tight text-black">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((related) => (
                  <ProductCard
                    key={related.uuid || related.id}
                    product={related}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
