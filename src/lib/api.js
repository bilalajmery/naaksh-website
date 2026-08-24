/**
 * NAAKSH Central API Client Layer
 * Milestone 1 Foundation (NAAKSH-WEB-M1-FOUNDATION-001)
 * 
 * Provides centralized, server- and client-safe communication with the Laravel Backend.
 * Standardizes endpoints, query parameters, error extraction, and environment base URL resolution.
 */

// Resolves the Backend API Base URL across Server Components and Client Components
export function getApiBaseUrl() {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/+$/, '');
  }
  // Fallback default
  return 'https://backend.naakshofficial.com/api';
}

/**
 * Low-level request handler with standardized error extraction and JSON parsing.
 */
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    let data = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const error = new Error(data?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.errors = data?.errors || null;

      // Extract friendly first validation error if present
      if (data?.errors && typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        if (Array.isArray(data.errors[firstKey]) && data.errors[firstKey].length > 0) {
          error.friendlyMessage = data.errors[firstKey][0];
        }
      }
      if (!error.friendlyMessage) {
        error.friendlyMessage = data?.message || (response.status === 429 ? 'Too many requests. Please try again in a moment.' : 'An unexpected error occurred.');
      }

      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    // Network or parse error
    const networkError = new Error(err.message || 'Network error occurred. Please check your connection.');
    networkError.status = 0;
    networkError.friendlyMessage = 'Unable to connect to server. Please try again.';
    throw networkError;
  }
}

/* ==========================================================================
   PUBLIC CATALOG APIS (M16)
   ========================================================================== */

/**
 * Fetch all active categories with public product counts.
 * GET /api/categories
 */
export async function getCategories() {
  return apiRequest('/categories', {
    method: 'GET',
    next: { revalidate: 300 }, // 5-minute cache in Next.js Server Components
  });
}

/**
 * Fetch paginated product collection with optional merchandising filters.
 * GET /api/products
 * 
 * Supported params:
 * - category_id (integer)
 * - size_id (integer)
 * - garment_color_id (integer)
 * - stock_status ('in_stock' | 'out_of_stock')
 * - is_featured (boolean)
 * - search (string)
 * - sort ('newest' | 'price_asc' | 'price_desc' | 'name_asc')
 * - page (integer)
 * - per_page (integer, max 48)
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean') {
        query.append(key, value ? '1' : '0');
      } else {
        query.append(key, String(value));
      }
    }
  });

  const queryString = query.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';

  return apiRequest(endpoint, {
    method: 'GET',
    next: { revalidate: 60 }, // 1-minute cache in Next.js Server Components
  });
}

/**
 * Fetch detailed product specification by canonical UUID.
 * GET /api/products/{uuid}
 */
export async function getProductByUuid(uuid) {
  if (!uuid) throw new Error('Product UUID is required');
  return apiRequest(`/products/${uuid}`, {
    method: 'GET',
    next: { revalidate: 60 },
  });
}

/* ==========================================================================
   COMMERCE & CHECKOUT APIS (M17)
   ========================================================================== */

/**
 * Submit server-authoritative structured website checkout.
 * POST /api/checkout/structured
 * 
 * Payload contract:
 * {
 *   customer: { name, email, phone, address, city, state, instruction },
 *   items: [{ product_uuid, size_id, garment_color_id, quantity }]
 * }
 */
export async function submitStructuredCheckout(orderData) {
  return apiRequest('/checkout/structured', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/**
 * Legacy checkout fallback endpoint (preserved for backward compatibility).
 * POST /api/checkout
 */
export async function submitLegacyCheckout(orderData) {
  return apiRequest('/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/* ==========================================================================
   CUSTOMER INTERACTION APIS (M18)
   ========================================================================== */

/**
 * Submit public customer contact message.
 * POST /api/contact
 * 
 * Payload contract:
 * { name, email, subject, message }
 */
export async function submitContact(contactData) {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  });
}

/**
 * Subscribe customer email to newsletter.
 * POST /api/subscribe
 * 
 * Payload contract:
 * { email }
 */
export async function subscribeNewsletter(email) {
  return apiRequest('/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
