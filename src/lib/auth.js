/**
 * Customer Authentication Client Layer
 * Milestone 12 (NAAKSH-WEB-M12-CUSTOMER-ACCOUNT-CART-WISHLIST-001)
 *
 * Invariant: Customer auth is strictly optional.
 * Handles Sanctum personal access tokens, user session storage,
 * and event-driven reactive synchronization across tabs and components.
 */

import * as api from './api';
import { syncCartOnLogin } from './cart';
import { syncWishlistOnLogin } from './wishlist';

export const AUTH_TOKEN_KEY = 'naaksh_auth_token';
export const AUTH_USER_KEY = 'naaksh_auth_user';

function isClient() {
  return typeof window !== 'undefined';
}

/**
 * Get stored Bearer token string.
 */
export function getAuthToken() {
  if (!isClient()) return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Set stored Bearer token string.
 */
export function setAuthToken(token) {
  if (!isClient()) return;
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (err) {
    console.error('Failed to set auth token in localStorage:', err);
  }
}

/**
 * Remove stored Bearer token string.
 */
export function removeAuthToken() {
  if (!isClient()) return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (err) {
    console.error('Failed to remove auth token from localStorage:', err);
  }
}

/**
 * Get stored customer user profile object.
 */
export function getAuthUser() {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Set stored customer user profile object.
 */
export function setAuthUser(user) {
  if (!isClient()) return;
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to set auth user in localStorage:', err);
  }
}

/**
 * Remove stored customer user profile object.
 */
export function removeAuthUser() {
  if (!isClient()) return;
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (err) {
    console.error('Failed to remove auth user from localStorage:', err);
  }
}

/**
 * Check if a customer is currently authenticated.
 */
export function isAuthenticated() {
  return Boolean(getAuthToken());
}

/**
 * Dispatch reactive auth state update event across window.
 */
export function dispatchAuthChanged(user = null) {
  if (!isClient()) return;
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
  window.dispatchEvent(new Event('storage'));
}

/**
 * Customer login with post-login cart and wishlist merge.
 */
export async function loginCustomer(credentials) {
  const response = await api.loginCustomer(credentials);
  const token = response?.token;
  const user = response?.user;

  if (token) {
    setAuthToken(token);
    setAuthUser(user);

    // Synchronize and merge guest cart & wishlist with database
    try {
      await Promise.allSettled([
        syncCartOnLogin(),
        syncWishlistOnLogin(),
      ]);
    } catch (e) {
      console.warn('Post-login sync error:', e);
    }

    dispatchAuthChanged(user);
  }

  return response;
}

/**
 * Customer registration with post-registration cart and wishlist merge.
 */
export async function registerCustomer(userData) {
  const response = await api.registerCustomer(userData);
  const token = response?.token;
  const user = response?.user;

  if (token) {
    setAuthToken(token);
    setAuthUser(user);

    // Synchronize and merge guest cart & wishlist with database
    try {
      await Promise.allSettled([
        syncCartOnLogin(),
        syncWishlistOnLogin(),
      ]);
    } catch (e) {
      console.warn('Post-registration sync error:', e);
    }

    dispatchAuthChanged(user);
  }

  return response;
}

/**
 * Customer logout.
 */
export async function logoutCustomer() {
  try {
    if (getAuthToken()) {
      await api.logoutCustomer().catch(() => {});
    }
  } catch {
    // Ignore network errors on logout
  } finally {
    removeAuthToken();
    removeAuthUser();
    dispatchAuthChanged(null);
    if (isClient()) {
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  }
}

/**
 * Refresh current customer user profile from backend.
 */
export async function refreshCurrentUser() {
  if (!isAuthenticated()) return null;
  try {
    const user = await api.getCurrentUser();
    if (user?.id) {
      setAuthUser(user);
      dispatchAuthChanged(user);
      return user;
    }
  } catch (err) {
    if (err.status === 401) {
      removeAuthToken();
      removeAuthUser();
      dispatchAuthChanged(null);
    }
  }
  return null;
}
