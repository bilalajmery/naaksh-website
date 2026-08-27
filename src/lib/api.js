/**
 * NAAKSH Central API Client Layer
 * Milestone 1 Foundation & Milestone 12 Customer Commerce
 * 
 * Provides centralized, server- and client-safe communication with the Laravel Backend.
 * Standardizes endpoints, query parameters, error extraction, environment base URL resolution,
 * and Bearer token authentication header injection.
 */

// Resolves the Backend API Base URL across Server Components and Client Components
export function getApiBaseUrl() {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    if (window.location.hostname.startsWith('192.168.')) {
      return `${window.location.protocol}//${window.location.hostname}:1000/api`;
    }
  }
  // Primary local backend server URL
  return 'http://192.168.100.154:1000/api';
}

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('naaksh_auth_token') || null;
  } catch {
    return null;
  }
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

  const token = getStoredToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

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
 * Fetch announcement bar configuration and visibility status.
 * GET /api/announcement
 */
export async function getAnnouncement() {
  return apiRequest(`/announcement?_t=${Date.now()}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}

/**
 * Fetch active hero banners for website storefront homepage carousel.
 * GET /api/hero-banners
 */
export async function getHeroBanners() {
  return apiRequest(`/hero-banners?_t=${Date.now()}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}

/**
 * Fetch paginated product collection with optional merchandising filters.
 * GET /api/products
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
    next: { revalidate: 60 },
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
   COMMERCE & CHECKOUT APIS (M17 & M12)
   ========================================================================== */

/**
 * Submit server-authoritative structured website checkout.
 * POST /api/checkout/structured
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
   CUSTOMER AUTHENTICATION & IDENTITY APIS (M12)
   ========================================================================== */

/**
 * Register a new customer account.
 * POST /api/register
 */
export async function registerCustomer(data) {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Log in an existing customer account.
 * POST /api/login
 */
export async function loginCustomer(credentials) {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Log out authenticated customer.
 * POST /api/logout
 */
export async function logoutCustomer() {
  return apiRequest('/logout', {
    method: 'POST',
  });
}

/**
 * Check if an email already belongs to a registered customer.
 * POST /api/auth/check-email
 */
export async function checkEmailExists(email) {
  if (!email || !String(email).trim()) return { exists: false };
  return apiRequest('/auth/check-email', {
    method: 'POST',
    body: JSON.stringify({ email: String(email).trim() }),
  });
}

/**
 * Request password reset instructions.
 * POST /api/forgot-password
 */
export async function forgotPassword(email) {
  return apiRequest('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Submit new password reset.
 * POST /api/reset-password
 */
export async function resetPassword(data) {
  return apiRequest('/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get authenticated customer user profile.
 * GET /api/user
 */
export async function getCurrentUser() {
  return apiRequest('/user', {
    method: 'GET',
  });
}

/**
 * Update authenticated customer user profile.
 * PUT /api/user
 */
export async function updateUserProfile(data) {
  return apiRequest('/user', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Update authenticated customer password.
 * PUT /api/user/password
 */
export async function updateUserPassword(data) {
  return apiRequest('/user/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/* ==========================================================================
   DATABASE CART APIS (M12)
   ========================================================================== */

/**
 * Fetch authenticated customer's database cart items.
 * GET /api/cart
 */
export async function getDbCart() {
  return apiRequest('/cart', {
    method: 'GET',
  });
}

/**
 * Add or update an item in the database cart.
 * POST /api/cart
 */
export async function saveDbCartItem(item) {
  return apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

/**
 * Merge guest cart array with database cart.
 * POST /api/cart/merge
 */
export async function mergeDbCart(items) {
  return apiRequest('/cart/merge', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

/**
 * Remove an item from database cart.
 * DELETE /api/cart/item
 */
export async function removeDbCartItem(itemIdentifier) {
  return apiRequest('/cart/item', {
    method: 'DELETE',
    body: JSON.stringify(itemIdentifier),
  });
}

/**
 * Clear authenticated customer's database cart.
 * DELETE /api/cart
 */
export async function clearDbCart() {
  return apiRequest('/cart', {
    method: 'DELETE',
  });
}

/* ==========================================================================
   DATABASE WISHLIST APIS (M12)
   ========================================================================== */

/**
 * Fetch authenticated customer's database wishlist items.
 * GET /api/wishlist
 */
export async function getDbWishlist() {
  return apiRequest('/wishlist', {
    method: 'GET',
  });
}

/**
 * Add or toggle an item in the database wishlist.
 * POST /api/wishlist
 */
export async function addDbWishlistItem(productUuid) {
  return apiRequest('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ product_uuid: productUuid }),
  });
}

/**
 * Remove an item from the database wishlist.
 * DELETE /api/wishlist/{uuid}
 */
export async function removeDbWishlistItem(productUuid) {
  return apiRequest(`/wishlist/${productUuid}`, {
    method: 'DELETE',
  });
}

/**
 * Merge guest wishlist UUIDs array with database wishlist.
 * POST /api/wishlist/merge
 */
export async function mergeDbWishlist(uuids) {
  return apiRequest('/wishlist/merge', {
    method: 'POST',
    body: JSON.stringify({ uuids }),
  });
}

/* ==========================================================================
   CUSTOMER ORDERS APIS (M12)
   ========================================================================== */

/**
 * Fetch authenticated customer's order history.
 * GET /api/orders
 */
export async function getCustomerOrders() {
  return apiRequest('/orders', {
    method: 'GET',
  });
}

/**
 * Fetch single order details for authenticated customer.
 * GET /api/orders/{orderNumber}
 */
export async function getCustomerOrderDetails(orderNumber) {
  return apiRequest(`/orders/${orderNumber}`, {
    method: 'GET',
  });
}

/* ==========================================================================
   CUSTOMER INTERACTION APIS (M18)
   ========================================================================== */

/**
 * Submit public customer contact message.
 * POST /api/contact
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
 */
export async function subscribeNewsletter(email) {
  return apiRequest('/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
