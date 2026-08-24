/**
 * NAAKSH Category Presentation & Asset Mapping Layer
 * Milestone 2 (NAAKSH-WEB-M2-DYNAMIC-CATEGORIES-001)
 * 
 * Provides deterministic UI-only slug generation and visual image asset resolution
 * for Backend category masters.
 * 
 * Identity authority resides strictly in Backend category.id and category.name.
 * Image mapping is purely for frontend presentation.
 */

// Mapping of category identifiers / slugs to existing local high-resolution assets
const CATEGORY_IMAGE_MAP = {
  'drop-shoulder-tees': '/category-assets/Drop Shoulder T-shirts/img.jpg',
  'drop-shoulder': '/category-assets/Drop Shoulder T-shirts/img.jpg',
  'hoodies': '/category-assets/Hoodies/img.jpg',
  'denim-jackets': '/category-assets/Denim Jackets/img.jpg',
  'classic-polo-shirts': '/category-assets/Classic Polo Shirts/img.jpg',
  'polo': '/category-assets/Classic Polo Shirts/img.jpg',
  'knitted-polo-tees': '/category-assets/Knitted Polo T-Shirts/img.jpg',
  'normal-basic-tees': '/category-assets/Normal Basic T-shirts/img.jpg',
  'cargo-trouser': '/category-assets/Cargo Trouzer/img.jpg',
  'cargo-trouzer': '/category-assets/Cargo Trouzer/img.jpg',
  'sweat-shirt': '/category-assets/Sweat Shirt/img.jpg',
  'textured-short-sleeve-shirt': '/category-assets/Textured Shirt/img.png',
  'textured-shirt': '/category-assets/Textured Shirt/img.png',
};

const DEFAULT_CATEGORY_IMAGE = '/category-assets/Drop Shoulder T-shirts/img.jpg';

/**
 * Generate a consistent, URL-safe slug from category name.
 */
export function generateCategorySlug(name) {
  if (!name) return '';
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolve local presentation image path for a category.
 */
export function getCategoryImage(category) {
  if (!category) return DEFAULT_CATEGORY_IMAGE;

  // If category already has an explicit image URL
  if (category.image) return category.image;

  const slug = category.slug || generateCategorySlug(category.name);
  if (slug && CATEGORY_IMAGE_MAP[slug]) {
    return CATEGORY_IMAGE_MAP[slug];
  }

  // Check normalized name
  const normalizedName = String(category.name || '').trim().toLowerCase();
  for (const [key, imagePath] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (key === normalizedName || key.replace(/-/g, ' ') === normalizedName) {
      return imagePath;
    }
  }

  return DEFAULT_CATEGORY_IMAGE;
}

/**
 * Format a raw Backend Category model into a standardized frontend category object.
 * 
 * @param {Object} raw - Backend category payload ({ id, name, products_count? }) or fallback JSON
 * @returns {Object} Standardized category object ({ id, name, slug, image, products_count })
 */
export function formatCategory(raw) {
  if (!raw) return null;

  const id = raw.id ?? null;
  const name = raw.name || '';
  const slug = raw.slug || generateCategorySlug(name);
  const image = raw.image || getCategoryImage({ name, slug });
  const productsCount = raw.products_count ?? 0;

  return {
    id,
    name,
    slug,
    image,
    products_count: productsCount,
  };
}
