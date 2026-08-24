/**
 * Cart Storage & Business Layer
 * Milestone 5 (NAAKSH-WEB-M5-CART-WISHLIST-UUID-001)
 * 
 * Invariant: PRODUCT UUID IS CANONICAL COMMERCE IDENTITY.
 * Cart items are identified by unique composite key:
 * `${product_uuid}_${size_id || 'none'}_${garment_color_id || 'none'}`
 */

export const CART_STORAGE_KEY = 'cart';

function isClient() {
  return typeof window !== 'undefined';
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
    size_id: raw.size_id !== undefined ? raw.size_id : null,
    size_name: raw.size_name || raw.size || '',
    color: raw.color || raw.garment_color_name || '',
    garment_color_id: raw.garment_color_id !== undefined ? raw.garment_color_id : null,
    garment_color_name: raw.garment_color_name || raw.color || '',
    image: raw.image || '/product-assets/placeholder.png',
    stock: raw.stock !== undefined ? raw.stock : 99,
  };
}

/**
 * Get current cart items from localStorage.
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
 * Save cart items to localStorage and notify listeners.
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
 * Add or increment item in cart.
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

  const updated = current.map((item) => {
    if (item.key === itemKey || getCartItemKey(item) === itemKey) {
      return { ...item, quantity: newQuantity };
    }
    return item;
  });

  saveCart(updated);
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

  const currentItem = { ...current[targetIndex], ...updates };
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
  return updated;
}

/**
 * Remove an item from cart by key.
 */
export function removeFromCart(itemKey) {
  const current = getCart();
  const updated = current.filter(
    (item) => item.key !== itemKey && getCartItemKey(item) !== itemKey
  );
  saveCart(updated);
  return updated;
}

/**
 * Clear entire cart.
 */
export function clearCart() {
  saveCart([]);
}
