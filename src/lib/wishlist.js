/**
 * Wishlist Storage & Business Layer
 * Milestone 5 & Milestone 12 Hybrid Wishlist Architecture
 * 
 * Invariant: PRODUCT UUID IS CANONICAL PRODUCT IDENTITY.
 * Wishlist stores canonical UUID strings: ["uuid-1", "uuid-2"]
 *
 * Hybrid Behavior:
 * - Guest User: LocalStorage
 * - Authenticated Customer: Synchronized with Database via Laravel API
 */

import * as api from './api';

export const WISHLIST_STORAGE_KEY = 'wishlist';

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

function dispatchWishlistUpdated() {
  if (isClient()) {
    window.dispatchEvent(new Event('wishlist-updated'));
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Get current wishlist UUIDs from local cache / storage.
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
 * Save wishlist UUIDs to local storage and notify listeners.
 */
export function saveWishlist(items) {
  if (!isClient()) return;
  try {
    const normalized = items.map((item) => String(item).trim()).filter(Boolean);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(normalized));
    dispatchWishlistUpdated();
  } catch (err) {
    console.error('Failed to write wishlist to localStorage:', err);
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
 * Toggle product in wishlist (Local + DB sync if authenticated).
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

  saveWishlist(updated);

  // Background DB sync if customer is authenticated
  if (isAuthenticated()) {
    api.addDbWishlistItem(target).catch((err) => {
      console.warn('Database wishlist toggle sync failed:', err);
    });
  }

  return added;
}

/**
 * Remove an item from wishlist.
 */
export function removeFromWishlist(productIdentifier) {
  if (!productIdentifier) return [];
  const current = getWishlist();
  const target = String(productIdentifier).trim();
  const targetLower = target.toLowerCase();
  const updated = current.filter((id) => id.toLowerCase() !== targetLower);

  saveWishlist(updated);

  // Background DB sync if authenticated
  if (isAuthenticated()) {
    api.removeDbWishlistItem(target).catch((err) => {
      console.warn('Database wishlist remove sync failed:', err);
    });
  }

  return updated;
}

/**
 * Merge local guest wishlist with database wishlist upon login.
 */
export async function syncWishlistOnLogin() {
  if (!isClient()) return;
  const localUuids = getWishlist();

  try {
    if (localUuids.length > 0) {
      const response = await api.mergeDbWishlist(localUuids);
      const mergedUuids = response?.uuids || [];
      saveWishlist(mergedUuids);
    } else {
      const response = await api.getDbWishlist();
      const dbUuids = response?.uuids || [];
      saveWishlist(dbUuids);
    }
  } catch (err) {
    console.error('Failed to synchronize wishlist on login:', err);
  }
}
