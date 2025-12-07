import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Heart } from "lucide-react";
import { toast } from 'react-toastify';

const ProductCard = ({ product, onRemoveFromWishlist }) => {
  const [hoverImgIndex, setHoverImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = product?.colors?.[selectedColor]?.images || [];
  const currentImage = images[hoverImgIndex] || images[0] || "/placeholder.jpg";

  // Check initial wishlist status
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsFavorite(wishlist.includes(product.slug));
  }, [product.slug]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let updatedWishlist;

    if (isFavorite) {
      updatedWishlist = wishlist.filter((item) => item !== product.slug);
      // Trigger callback if we are removing specifically
      if (onRemoveFromWishlist) {
        onRemoveFromWishlist(product.slug);
      }
    } else {
      updatedWishlist = [...wishlist, product.slug];
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsFavorite(!isFavorite);
  };

  const handleColorClick = (colorIndex) => {
    setSelectedColor(colorIndex);
  };

  return (
    <NavLink
      to={`/product/${product.slug}`}
      className="block group"
      onMouseEnter={() => images.length > 1 && setHoverImgIndex(1)}
      onMouseLeave={() => setHoverImgIndex(0)}
    >
      <div className="relative bg-white overflow-hidden transition-all duration-300">
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-widest z-10 uppercase bg-black text-white`}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite
            ? "bg-red-500 text-white shadow-md"
            : "bg-white/80 text-gray-900 hover:bg-white hover:shadow-md translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            }`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = "/product/badman-sweatshirt/1.jpg";
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // Logic adapted from productDetail.jsx
                const sizeToUse = product.sizes?.[0] || '';

                // If the product normally requires a size but none could be selected automatically
                if (product.sizes?.length > 0 && !sizeToUse) {
                  toast.error('Please select a size');
                  return;
                }

                const cartItem = {
                  id: Date.now(),
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  priceNum: product.priceNum,
                  color: product.colors?.[selectedColor]?.name,
                  size: sizeToUse,
                  quantity: 1,
                  image: product.colors?.[selectedColor]?.images?.[0] || '/placeholder.jpg',
                  stock: 99
                };

                const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

                const existingItemIndex = existingCart.findIndex(item =>
                  item.slug === cartItem.slug &&
                  item.size === cartItem.size &&
                  item.color === cartItem.color
                );

                let updatedCart;
                if (existingItemIndex > -1) {
                  updatedCart = [...existingCart];
                  updatedCart[existingItemIndex].quantity += 1;
                } else {
                  updatedCart = [...existingCart, cartItem];
                }

                localStorage.setItem('cart', JSON.stringify(updatedCart));
                toast.success(`Added ${product.name} to cart!`);
              }}
              className="w-full bg-black text-white py-3 text-sm font-medium tracking-wider hover:bg-gray-900 uppercase"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <p className="text-[10px] font-medium tracking-widest text-gray-500 mb-2 uppercase">
            {product.category}
          </p>
          <h3 className="text-sm font-medium mb-2 text-gray-900 group-hover:text-black">{product.name}</h3>

          {product.colors && product.colors.length > 1 && (
            <div className="flex gap-1.5 mb-3">
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColorClick(i);
                  }}
                  className={`w-5 h-5 rounded-full border cursor-pointer transition-all ${selectedColor === i
                    ? "border-2 border-black ring-1 ring-gray-300"
                    : "border border-gray-300 hover:border-gray-400"
                    }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-black">{product.price}</span>
            {product.original && (
              <span className="text-xs text-gray-400 line-through">{product.original}</span>
            )}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ProductCard;
