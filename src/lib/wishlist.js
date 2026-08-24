/**
 * Wishlist Storage & Business Layer
 * Milestone 5 (NAAKSH-WEB-M5-CART-WISHLIST-UUID-001)
 * 
 * Invariant: PRODUCT UUID IS CANONICAL PRODUCT IDENTITY.
 * Wishlist stores canonical UUID strings: ["uuid-1", "uuid-2"]
 */

export const WISHLIST_STORAGE_KEY = 'wishlist';

function isClient() {
  return typeof window !== 'undefined';
}

function dispatchWishlistUpdated() {
  if (isClient()) {
    window.dispatchEvent(new Event('wishlist-updated'));
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Get current wishlist UUIDs from localStorage.
 */
export function getWishlist() {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch (err) {
    console.error('Failed to read wishlist from localStorage:', err);
    return [];
  }
}

/**
 * Check if a product UUID or slug is in the wishlist.
 */
export function isInWishlist(productIdentifier) {
  if (!productIdentifier) return false;
  const current = getWishlist();
  const target = String(productIdentifier).trim().toLowerCase();
  return current.some((id) => id.toLowerCase() === target);
}

/**
 * Toggle product in wishlist.
 * Returns true if added, false if removed.
 */
export function toggleWishlist(productIdentifier) {
  if (!productIdentifier) return false;
  const current = getWishlist();
  const target = String(productIdentifier).trim();
  const targetLower = target.toLowerCase();

  const existingIndex = current.findIndex((id) => id.toLowerCase() === targetLower);
  let updated;
  let added = false;

  if (existingIndex > -1) {
    updated = current.filter((_, idx) => idx !== existingIndex);
    added = false;
  } else {
    updated = [...current, target];
    added = true;
  }

  if (isClient()) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      dispatchWishlistUpdated();
    } catch (err) {
      console.error('Failed to write wishlist to localStorage:', err);
    }
  }

  return added;
}

/**
 * Remove an item from wishlist.
 */
export function removeFromWishlist(productIdentifier) {
  if (!productIdentifier) return [];
  const current = getWishlist();
  const targetLower = String(productIdentifier).trim().toLowerCase();
  const updated = current.filter((id) => id.toLowerCase() !== targetLower);

  if (isClient()) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      dispatchWishlistUpdated();
    } catch (err) {
      console.error('Failed to update wishlist in localStorage:', err);
    }
  }
  return updated;
}
