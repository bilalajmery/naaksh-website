import fs from 'fs';
import path from 'path';
import * as api from './api';
import { formatCategory } from './categoryMapping';

/**
 * Catalog Library Data Layer
 * Milestone 4 (NAAKSH-WEB-M4-PRODUCT-DETAIL-001)
 * 
 * Provides unified, server-authoritative catalog data access.
 * Primary Authorities:
 * - Categories: GET /api/categories
 * - Product Collection: GET /api/products
 * - Product Detail: GET /api/products/{uuid}
 * 
 * Local static JSON files are preserved strictly as non-authoritative fallbacks
 * and development/migration references.
 */

// Local Static JSON Fallback Readers
export async function getLocalProducts() {
  const filePath = path.join(process.cwd(), 'public', 'product-assets', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const raw = JSON.parse(fileContents);
    return raw.map((item) => ({
      uuid: String(item.id),
      id: item.id,
      name: item.name,
      slug: item.slug,
      selling_price: item.priceNum || 0,
      original_selling_price: item.original ? parseFloat(String(item.original).replace(/[^0-9.]/g, '')) : null,
      price_display: item.price,
      original_price_display: item.original,
      stock_status: (item.stock === undefined || item.stock > 0) ? 'in_stock' : 'out_of_stock',
      purchasable: item.stock === undefined || item.stock > 0,
      is_featured: Boolean(item.isFeatured),
      badge: item.badge || null,
      rating: item.rating || 4.8,
      category: typeof item.category === 'string' ? { id: null, name: item.category } : item.category,
      primary_media: item.colors?.[0]?.images?.[0] ? { url: item.colors[0].images[0] } : null,
      sizes: (item.sizes || []).map((s, idx) => ({ id: idx + 1, name: s })),
      garment_colors: (item.colors || []).map((c, idx) => ({ id: idx + 1, name: c.name, hex: c.hex, images: c.images || [] })),
      colors: item.colors,
      image: item.colors?.[0]?.images?.[0] || '/product-assets/placeholder.png',
      description: item.description || '',
      features: item.features || [],
      reviews: item.reviews || [],
      meta_title: item.meta_title || (item.name ? `${item.name} | NAAKSH` : null),
      meta_description: item.meta_description || item.description || null,
      meta_keywords: item.meta_keywords || null,
    }));
  } catch (error) {
    console.error('Failed to load local static products:', error);
    return [];
  }
}

export async function getLocalCategories() {
  const filePath = path.join(process.cwd(), 'public', 'category-assets', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const raw = JSON.parse(fileContents);
    return raw.map((item, index) => formatCategory({ id: index + 1, ...item }));
  } catch (error) {
    console.error('Failed to load local static categories:', error);
    return [];
  }
}

export async function getLocalJournalPosts() {
  const filePath = path.join(process.cwd(), 'public', 'blog-assets', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load local static journal posts:', error);
    return [];
  }
}

/**
 * Get dynamic categories.
 * Primary Authority: Laravel Backend API (GET /api/categories).
 */
export async function getCategories(options = {}) {
  if (options.forceLocal) {
    return getLocalCategories();
  }

  try {
    const response = await api.getCategories();
    const rawCategories = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];

    if (rawCategories.length > 0) {
      return rawCategories.map(formatCategory);
    }
    
    console.warn('Backend categories API returned 0 items; using local fallback.');
    return getLocalCategories();
  } catch (err) {
    console.warn('Backend categories API unavailable; using local fallback:', err.message);
    return getLocalCategories();
  }
}

/**
 * Get dynamic product collection.
 * Primary Authority: Laravel Backend API (GET /api/products).
 */
export async function getProducts(params = {}, options = {}) {
  if (options.forceLocal) {
    return getLocalProducts();
  }

  try {
    const response = await api.getProducts(params);
    const products = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];

    if (products.length > 0) {
      return products;
    }

    if (Object.keys(params).length > 0 && response?.meta) {
      return [];
    }

    console.warn('Backend products API returned 0 items; using local fallback.');
    return getLocalProducts();
  } catch (err) {
    console.warn('Backend products API unavailable; using local fallback:', err.message);
    return filterLocalProducts(await getLocalProducts(), params);
  }
}

/**
 * Get paginated catalog products with full pagination metadata.
 * Primary Authority: Laravel Backend API (GET /api/products).
 */
export async function getCatalogProducts(params = {}) {
  try {
    const response = await api.getProducts(params);
    const products = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];

    const meta = response?.meta || {
      current_page: Number(params.page) || 1,
      last_page: Math.ceil(products.length / (Number(params.per_page) || 12)) || 1,
      per_page: Number(params.per_page) || 12,
      total: products.length,
    };

    return {
      products,
      meta,
      links: response?.links || null,
    };
  } catch (err) {
    console.warn('Backend products API unavailable for catalog; using local fallback:', err.message);
    const local = await getLocalProducts();
    const filtered = filterLocalProducts(local, params);
    const page = Number(params.page) || 1;
    const perPage = Number(params.per_page) || 12;
    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    return {
      products: paginated,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total: total,
      },
      links: null,
    };
  }
}

/**
 * Resolve and fetch a single Product Detail by slug or canonical UUID.
 * Primary Authority: Laravel Backend API (GET /api/products/{uuid}).
 * 
 * Resolution flow:
 * 1. If UUID -> directly query GET /api/products/{uuid}
 * 2. If slug -> resolve UUID via GET /api/products?search={slug} -> query GET /api/products/{uuid}
 * 3. Fallback -> local static JSON reader
 */
export async function getProductBySlugOrUuid(slugOrUuid) {
  if (!slugOrUuid) return null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrUuid);

  // 1. Direct UUID Lookup
  if (isUuid) {
    try {
      const response = await api.getProductByUuid(slugOrUuid);
      const product = response?.data || response;
      if (product?.uuid) return product;
    } catch (err) {
      console.warn('Direct UUID product fetch failed:', err.message);
    }
  }

  // 2. Slug to UUID Resolution via Backend Catalog Search
  try {
    const listResponse = await api.getProducts({ search: slugOrUuid, per_page: 10 });
    const candidates = Array.isArray(listResponse?.data) ? listResponse.data : [];
    const matched = candidates.find(
      (p) => p.slug === slugOrUuid || p.slug?.toLowerCase() === String(slugOrUuid).toLowerCase() || p.uuid === slugOrUuid
    );

    if (matched?.uuid) {
      const detailResponse = await api.getProductByUuid(matched.uuid);
      const product = detailResponse?.data || detailResponse;
      if (product?.uuid) return product;
    }
  } catch (err) {
    console.warn('Backend product search for slug resolution failed:', err.message);
  }

  // 3. Non-authoritative Local Fallback
  try {
    const localProducts = await getLocalProducts();
    const localFound = localProducts.find(
      (p) => p.slug === slugOrUuid || p.slug?.toLowerCase() === String(slugOrUuid).toLowerCase() || p.uuid === slugOrUuid || String(p.id) === slugOrUuid
    );
    if (localFound) {
      const filePath = path.join(process.cwd(), 'public', 'product-assets', 'data.json');
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const rawFound = raw.find((r) => r.slug === localFound.slug || String(r.id) === String(localFound.id));

      return {
        ...localFound,
        description: rawFound?.description || 'Premium minimalist streetwear crafted with discipline, luxury materials, and signature Pakistani craftsmanship.',
        features: rawFound?.features || ['100% Combed Compact Cotton', '240 GSM Heavyweight Fabric', 'Preshrunk & Bio-Washed', 'Signature Tailored Cut'],
        reviews: rawFound?.reviews || [
          { name: 'Hamza A.', star: 5, review: 'Exceptional quality fabric and perfect drop shoulder drape.' },
          { name: 'Zainab M.', star: 5, review: 'Color and fit are exactly as shown. Premium feel!' }
        ],
        media: (rawFound?.colors || []).flatMap((c, cIdx) => (c.images || []).map((img, imgIdx) => ({
          id: cIdx * 10 + imgIdx + 1,
          url: img,
          color_id: cIdx + 1,
          is_primary: imgIdx === 0,
        }))),
      };
    }
  } catch (err) {
    console.error('Local fallback product lookup failed:', err);
  }

  return null;
}

/**
 * Get related products for a product detail page.
 */
export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];

  const categoryId = product.category?.id;
  if (categoryId) {
    try {
      const response = await api.getProducts({ category_id: categoryId, per_page: limit + 2 });
      const products = Array.isArray(response?.data) ? response.data : [];
      const filtered = products.filter((p) => p.uuid !== product.uuid).slice(0, limit);
      if (filtered.length > 0) return filtered;
    } catch (err) {
      console.warn('API getRelatedProducts failed, falling back to local:', err.message);
    }
  }

  const local = await getLocalProducts();
  const catName = typeof product.category === 'object' ? product.category?.name : product.category;
  return local
    .filter((p) => (p.category?.name || p.category) === catName && (p.uuid !== product.uuid && p.slug !== product.slug))
    .slice(0, limit);
}

/**
 * Helper to filter local fallback products matching params when API is offline.
 */
function filterLocalProducts(products, params = {}) {
  let list = [...products];

  if (params.category_id) {
    list = list.filter((p) => p.category?.id === Number(params.category_id) || p.category_id === Number(params.category_id));
  }

  if (params.is_featured !== undefined) {
    const isFeatured = String(params.is_featured) === 'true' || params.is_featured === 1 || params.is_featured === '1';
    list = list.filter((p) => p.is_featured === isFeatured);
  }

  if (params.search) {
    const q = String(params.search).toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }

  if (params.stock_status) {
    list = list.filter((p) => p.stock_status === params.stock_status);
  }

  if (params.sort) {
    matchSort(list, params.sort);
  }

  return list;
}

function matchSort(list, sort) {
  if (sort === 'price_asc') list.sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0));
  else if (sort === 'price_desc') list.sort((a, b) => (b.selling_price || 0) - (a.selling_price || 0));
  else if (sort === 'name_asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  else list.sort((a, b) => (b.id || 0) - (a.id || 0));
}

export async function getJournalPosts() {
  return getLocalJournalPosts();
}

// Re-export central API functions and mapping helpers
export { api, formatCategory };
