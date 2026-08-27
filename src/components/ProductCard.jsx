'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from 'react-toastify';
import { addToCart } from "../lib/cart";
import { isInWishlist, toggleWishlist } from "../lib/wishlist";

const ProductCard = ({ product, onRemoveFromWishlist }) => {
  const [hoverImgIndex, setHoverImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const availableColors = product?.colors || product?.garment_colors || [];
  const currentColorObj = availableColors[selectedColor] || availableColors[0] || null;

  let colorImages = [];
  if (currentColorObj?.images && Array.isArray(currentColorObj.images) && currentColorObj.images.length > 0) {
    colorImages = currentColorObj.images;
  } else if (currentColorObj?.id && product?.media && Array.isArray(product.media)) {
    colorImages = product.media.filter(m => Number(m.color_id) === Number(currentColorObj.id)).map(m => m.url);
  }

  const images = colorImages.length > 0 ? colorImages : (product?.media ? product.media.map(m => m.url) : []);
  const currentImage = images[hoverImgIndex] || images[0] || product?.primary_media?.url || product?.image || "/product-assets/placeholder.png";
  const categoryName = typeof product?.category === 'object' ? product?.category?.name : product?.category;
  const displayPrice = product?.price || product?.price_display || (product?.selling_price ? `PKR ${Number(product.selling_price).toLocaleString()}` : '');
  const displayOriginal = product?.original || product?.original_price_display || (product?.original_selling_price ? `PKR ${Number(product.original_selling_price).toLocaleString()}` : '');
  const isPurchasable = product?.purchasable !== false && product?.stock_status !== 'out_of_stock';
  const canonicalUuid = product?.uuid || product?.id;
  const productSlug = product?.slug || canonicalUuid;

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

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = canonicalUuid || productSlug;
    const added = toggleWishlist(targetId);
    setIsFavorite(added);

    if (!added && onRemoveFromWishlist) {
      onRemoveFromWishlist(targetId);
    }
    toast.info(added ? 'Added to wishlist!' : 'Removed from wishlist');
  };

  const handleColorClick = (colorIndex) => {
    setSelectedColor(colorIndex);
  };

  return (
    <Link
      href={`/product/${productSlug}`}
      className="group block relative bg-[#0d0d0f] border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => images.length > 1 && setHoverImgIndex(1)}
      onMouseLeave={() => setHoverImgIndex(0)}
    >
      {/* Visual Product Media Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product?.badge && (
            <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] bg-black text-white border border-white/20 shadow-md">
              {product.badge}
            </span>
          )}

          {product?.is_featured && !product?.badge && (
            <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] bg-yellow-400 text-black shadow-md">
              ★ FEATURED
            </span>
          )}

          {!isPurchasable && (
            <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] bg-red-600 text-white shadow-md">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist Heart Action */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isFavorite
              ? "bg-red-500 text-white shadow-lg"
              : "bg-black/60 backdrop-blur-md text-white border border-white/10 hover:border-yellow-400 hover:text-yellow-400 sm:opacity-0 sm:translate-y-[-4px] sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
          }`}
        >
          <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Media Frame (Video / Image with Hover Transition) */}
        {isVideo(currentImage) ? (
          <video
            src={currentImage}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={currentImage}
            alt={product?.name || 'NAAKSH Apparel'}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/product-assets/placeholder.png";
            }}
          />
        )}

        {/* Slide-Up Quick Add to Cart Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!isPurchasable) {
                toast.info('This item is currently out of stock.');
                return;
              }

              const rawSize = product?.sizes?.[0];
              const sizeId = typeof rawSize === 'object' ? rawSize?.id : null;
              const sizeName = typeof rawSize === 'object' ? rawSize?.name : (rawSize || 'Standard');

              const colorId = currentColorObj?.id || null;
              const colorName = currentColorObj?.name || 'Default';

              addToCart({
                product_uuid: canonicalUuid,
                quantity: 1,
                size_id: sizeId,
                size_name: sizeName,
                garment_color_id: colorId,
                garment_color_name: colorName,
                name: product?.name,
                slug: productSlug,
                price: displayPrice,
                priceNum: product?.selling_price || 0,
                image: currentImage,
                stock: isPurchasable ? 99 : 0,
              });

              toast.success(`Added ${product?.name} to bag!`);
            }}
            disabled={!isPurchasable}
            className={`w-full py-3 text-xs font-black tracking-[0.2em] uppercase transition cursor-pointer shadow-lg ${
              isPurchasable
                ? 'bg-yellow-400 text-black hover:bg-white'
                : 'bg-neutral-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isPurchasable ? 'QUICK ADD +' : 'OUT OF STOCK'}
          </button>
        </div>
      </div>

      {/* Product Details Information */}
      <div className="p-4 bg-[#0d0d0f]">
        {categoryName && (
          <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 mb-1.5 uppercase truncate">
            {categoryName}
          </p>
        )}

        <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-yellow-400 transition-colors line-clamp-1 mb-2">
          {product?.name}
        </h3>

        {/* Color Swatch Dots */}
        {availableColors.length > 1 && (
          <div className="flex items-center gap-1.5 mb-2.5">
            {availableColors.map((color, i) => (
              <button
                key={color.id || i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleColorClick(i);
                }}
                className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform ${
                  selectedColor === i
                    ? "ring-2 ring-yellow-400 ring-offset-1 ring-offset-black scale-110"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: color.hex || '#000000' }}
                title={color.name}
              />
            ))}
          </div>
        )}

        {/* Price Presentation */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-white/5">
          <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
            {displayPrice}
          </span>
          {displayOriginal && (
            <span className="text-[11px] text-zinc-500 line-through tracking-wider">
              {displayOriginal}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
