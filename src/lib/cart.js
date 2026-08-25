/**
 * Cart Storage & Business Layer
 * Milestone 5 & Milestone 12 Hybrid Cart Architecture
 * 
 * Invariant: PRODUCT UUID IS CANONICAL COMMERCE IDENTITY.
 * Cart items are identified by unique composite key:
 * `${product_uuid}::${size_id || 'none'}::${garment_color_id || 'none'}`
 *
 * Hybrid Behavior:
 * - Guest User: LocalStorage
 * - Authenticated Customer: Synchronized with Database via Laravel API
 */

import * as api from './api';

export const CART_STORAGE_KEY = 'cart';

function isClient() {
  return typeof window !== 'undefined';
}

function isAuthenticated() {
  if (!isClient()) return false;
  try {
    return Boolean(localStorage.getItem('naaksh_auth_token'));
  } catch {
    return false;
  }
}

function dispatchCartUpdated() {
  if (isClient()) {
    window.dispatchEvent(new Event('cart-updated'));
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Generate a deterministic composite line item key.
 */
export function getCartItemKey(item) {
  const uuid = item.product_uuid || item.uuid || item.productId || item.slug || 'unknown';
  const size = item.size_id !== undefined && item.size_id !== null ? item.size_id : (item.size || 'none');
  const color = item.garment_color_id !== undefined && item.garment_color_id !== null ? item.garment_color_id : (item.color || 'none');
  return `${uuid}::${size}::${color}`;
}

/**
 * Normalize legacy or heterogeneous cart items to canonical UUID schema.
 */
export function normalizeCartItem(raw) {
  const uuid = raw.product_uuid || raw.uuid || raw.productId || raw.slug || '';
  const priceNum = typeof raw.priceNum === 'number' ? raw.priceNum : (typeof raw.price === 'number' ? raw.price : parseFloat(String(raw.price || 0).replace(/[^0-9.]/g, '')) || 0);

  return {
    key: raw.key || getCartItemKey(raw),
    product_uuid: String(uuid),
    productId: raw.productId || raw.uuid || String(uuid),
    name: raw.name || raw.title || 'Product',
    slug: raw.slug || '',
    quantity: Math.max(1, Number(raw.quantity) || 1),
    price: raw.price_display || raw.price || `PKR ${priceNum.toLocaleString()}`,
    priceNum: priceNum,
    size: raw.size || raw.size_name || '',
    size_id: raw.size_id !== undefined && raw.size_id !== null ? Number(raw.size_id) : null,
    size_name: raw.size_name || raw.size || '',
    color: raw.color || raw.garment_color_name || '',
    garment_color_id: raw.garment_color_id !== undefined && raw.garment_color_id !== null ? Number(raw.garment_color_id) : null,
    garment_color_name: raw.garment_color_name || raw.color || '',
    image: raw.image || '/product-assets/placeholder.png',
    stock: raw.stock !== undefined ? raw.stock : 99,
  };
}

/**
 * Get current cart items from local cache / storage.
 */
export function getCart() {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCartItem);
  } catch (err) {
    console.error('Failed to read cart from localStorage:', err);
    return [];
  }
}

/**
 * Save cart items to local cache / storage and notify listeners.
 */
export function saveCart(items) {
  if (!isClient()) return;
  try {
    const normalized = items.map(normalizeCartItem);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
    dispatchCartUpdated();
  } catch (err) {
    console.error('Failed to write cart to localStorage:', err);
  }
}

/**
 * Add or increment item in cart (Local + Backend sync if logged in).
 */
export function addToCart(itemInput) {
  const current = getCart();
  const normalized = normalizeCartItem(itemInput);
  const targetKey = normalized.key || getCartItemKey(normalized);

  const existingIndex = current.findIndex(
    (i) => (i.key && i.key === targetKey) || getCartItemKey(i) === targetKey
  );

  let updated;
  if (existingIndex > -1) {
    updated = [...current];
    updated[existingIndex].quantity += normalized.quantity;
  } else {
    updated = [...current, { ...normalized, key: targetKey }];
  }

  saveCart(updated);

  // Background DB sync if customer is authenticated
  if (isAuthenticated()) {
    api.saveDbCartItem({
      product_uuid: normalized.product_uuid,
      size_id: normalized.size_id,
      garment_color_id: normalized.garment_color_id,
      quantity: normalized.quantity,
      overwrite: false,
    }).catch((err) => console.warn('Database cart sync failed:', err));
  }

  return updated;
}

/**
 * Update quantity for a cart item by key.
 */
export function updateCartQuantity(itemKey, newQuantity) {
  const current = getCart();
  if (newQuantity < 1) {
    return removeFromCart(itemKey);
  }

  let targetItem = null;
  const updated = current.map((item) => {
    if (item.key === itemKey || getCartItemKey(item) === itemKey) {
      targetItem = { ...item, quantity: newQuantity };
      return targetItem;
    }
    return item;
  });

  saveCart(updated);

  // Background DB sync if customer is authenticated
  if (isAuthenticated() && targetItem) {
    api.saveDbCartItem({
      product_uuid: targetItem.product_uuid,
      size_id: targetItem.size_id,
      garment_color_id: targetItem.garment_color_id,
      quantity: newQuantity,
      overwrite: true,
    }).catch((err) => console.warn('Database cart sync failed:', err));
  }

  return updated;
}

/**
 * Update variant (size / garment color) for a cart item.
 */
export function updateCartItemVariant(itemKey, updates) {
  const current = getCart();
  const targetIndex = current.findIndex(
    (i) => i.key === itemKey || getCartItemKey(i) === itemKey
  );
  if (targetIndex === -1) return current;

  const oldItem = current[targetIndex];
  const currentItem = { ...oldItem, ...updates };
  currentItem.key = getCartItemKey(currentItem);

  // Check if updating creates a duplicate with an existing item
  const duplicateIndex = current.findIndex(
    (i, idx) => idx !== targetIndex && (i.key === currentItem.key || getCartItemKey(i) === currentItem.key)
  );

  let updated;
  if (duplicateIndex > -1) {
    // Merge into duplicate item
    updated = [...current];
    updated[duplicateIndex].quantity += currentItem.quantity;
    updated.splice(targetIndex, 1);
  } else {
    updated = [...current];
    updated[targetIndex] = currentItem;
  }

  saveCart(updated);

  // DB Sync if authenticated
  if (isAuthenticated()) {
    // Remove old variant, add updated variant
    api.removeDbCartItem({
      product_uuid: oldItem.product_uuid,
      size_id: oldItem.size_id,
      garment_color_id: oldItem.garment_color_id,
    }).then(() => {
      return api.saveDbCartItem({
        product_uuid: currentItem.product_uuid,
        size_id: currentItem.size_id,
        garment_color_id: currentItem.garment_color_id,
        quantity: currentItem.quantity,
        overwrite: true,
      });
    }).catch((err) => console.warn('Database cart variant update failed:', err));
  }

  return updated;
}

/**
 * Remove an item from cart by key.
 */
export function removeFromCart(itemKey) {
  const current = getCart();
  const targetItem = current.find(
    (item) => item.key === itemKey || getCartItemKey(item) === itemKey
  );

  const updated = current.filter(
    (item) => item.key !== itemKey && getCartItemKey(item) !== itemKey
  );
  saveCart(updated);

  // DB Sync if authenticated
  if (isAuthenticated() && targetItem) {
    api.removeDbCartItem({
      product_uuid: targetItem.product_uuid,
      size_id: targetItem.size_id,
      garment_color_id: targetItem.garment_color_id,
    }).catch((err) => console.warn('Database cart removal sync failed:', err));
  }

  return updated;
}

/**
 * Clear entire cart.
 */
export function clearCart() {
  saveCart([]);
  if (isAuthenticated()) {
    api.clearDbCart().catch((err) => console.warn('Database cart clear sync failed:', err));
  }
}

/**
 * Merge local guest cart with database cart upon login.
 */
export async function syncCartOnLogin() {
  if (!isClient()) return;
  const localItems = getCart();

  try {
    if (localItems.length > 0) {
      // Send local items to merge endpoint
      const mergePayload = localItems.map((item) => ({
        product_uuid: item.product_uuid,
        size_id: item.size_id,
        garment_color_id: item.garment_color_id,
        quantity: item.quantity,
      }));
      const response = await api.mergeDbCart(mergePayload);
      const mergedList = response?.data || [];
      saveCart(mergedList);
    } else {
      // Fetch user's existing DB cart
      const response = await api.getDbCart();
      const dbList = response?.data || [];
      saveCart(dbList);
    }
  } catch (err) {
    console.error('Failed to synchronize cart on login:', err);
  }
}
