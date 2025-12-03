import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [hoverImgIndex, setHoverImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const images = product?.colors?.[selectedColor]?.images || [];
  const currentImage = images[hoverImgIndex] || images[0] || "/placeholder.jpg";

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

        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert(`Added ${product.name} to cart!`);
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
                  className={`w-5 h-5 rounded-full border cursor-pointer transition-all ${
                    selectedColor === i
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
