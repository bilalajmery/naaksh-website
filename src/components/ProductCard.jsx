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

  const images = currentColorObj?.images || (product?.media ? product.media.map(m => m.url) : []);
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

  // Check and sync wishlist status
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
      className="block group"
      onMouseEnter={() => images.length > 1 && setHoverImgIndex(1)}
      onMouseLeave={() => setHoverImgIndex(0)}
    >
      <div className="relative bg-white overflow-hidden transition-all duration-300">
        {product?.badge && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-widest z-10 uppercase bg-black text-white`}
          >
            {product.badge}
          </div>
        )}

        {product?.is_featured && !product?.badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-widest z-10 uppercase bg-yellow-400 text-black"
          >
            ★ Featured
          </div>
        )}

        {!isPurchasable && (
          <div
            className={`absolute ${product?.badge || product?.is_featured ? 'top-10' : 'top-3'} left-3 px-2.5 py-1 text-[9px] font-bold tracking-widest z-10 uppercase bg-red-600 text-white`}
          >
            Out of Stock
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite
            ? "bg-red-500 text-white shadow-md"
            : "bg-white/80 text-gray-900 hover:bg-white hover:shadow-md translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            }`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {isVideo(currentImage) ? (
            <video
              src={currentImage}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={currentImage}
              alt={product?.name || 'Product'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/product-assets/placeholder.png";
              }}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!isPurchasable) {
                  toast.info('This product is currently out of stock.');
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

                toast.success(`Added ${product?.name} to cart!`);
              }}
              disabled={!isPurchasable}
              className={`w-full py-3 text-sm font-medium tracking-wider uppercase transition ${
                isPurchasable
                  ? 'bg-black text-white hover:bg-gray-900'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isPurchasable ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        <div className="pt-4 pb-2">
          {categoryName && (
            <p className="text-[10px] font-medium tracking-widest text-gray-500 mb-2 uppercase">
              {categoryName}
            </p>
          )}
          <h3 className="text-sm font-medium mb-2 text-gray-900 group-hover:text-black">{product?.name}</h3>

          {availableColors.length > 1 && (
            <div className="flex gap-1.5 mb-3">
              {availableColors.map((color, i) => (
                <button
                  key={color.id || i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColorClick(i);
                  }}
                  className={`w-5 h-5 rounded-full border cursor-pointer transition-all ${selectedColor === i
                    ? "border-2 border-black ring-1 ring-gray-300"
                    : "border border-gray-300 hover:border-gray-400"
                    }`}
                  style={{ backgroundColor: color.hex || '#000000' }}
                  title={color.name}
                />
              ))}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-black">{displayPrice}</span>
            {displayOriginal && (
              <span className="text-xs text-gray-400 line-through">{displayOriginal}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
