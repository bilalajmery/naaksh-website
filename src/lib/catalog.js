import fs from 'fs';
import path from 'path';
import * as api from './api';
import { formatCategory } from './categoryMapping';

/**
 * Catalog Library Data Layer
 * Milestone 3 (NAAKSH-WEB-M3-DYNAMIC-PRODUCTS-001)
 * 
 * Provides unified, server-authoritative catalog data access.
 * Primary Authorities:
 * - Categories: GET /api/categories
 * - Products: GET /api/products
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
      stock_status: item.stock > 0 ? 'in_stock' : 'out_of_stock',
      purchasable: item.stock > 0,
      is_featured: Boolean(item.isFeatured),
      badge: item.badge || null,
      rating: item.rating || 4.8,
      category: typeof item.category === 'string' ? { id: null, name: item.category } : item.category,
      primary_media: item.colors?.[0]?.images?.[0] ? { url: item.colors[0].images[0] } : null,
      sizes: (item.sizes || []).map((s, idx) => ({ id: idx + 1, name: s })),
      garment_colors: (item.colors || []).map((c, idx) => ({ id: idx + 1, name: c.name, hex: c.hex })),
      colors: item.colors,
      image: item.colors?.[0]?.images?.[0] || '/product-assets/placeholder.png',
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
 * 
 * Supports query params:
 * - category_id
 * - size_id
 * - garment_color_id / color_id
 * - stock_status ('in_stock' | 'out_of_stock')
 * - is_featured (boolean)
 * - search (string)
 * - sort ('newest' | 'price_asc' | 'price_desc' | 'name_asc')
 * - page (integer)
 * - per_page (integer, max 48)
 * 
 * Returns standard array of products.
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

    // If backend is active and returned 0 products matching specific filter, return empty array
    if (Object.keys(params).length > 0 && response?.meta) {
      return [];
    }

    // If initial query without filters returned empty, use fallback
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
 * 
 * Returns { products, meta, links }
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
 * Helper to filter local fallback products matching params when API is offline.
 */
function filterLocalProducts(products, params = {}) {
  let list = [...products];

  if (params.category_id) {
    // Local fallback matching
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
