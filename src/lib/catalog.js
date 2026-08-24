import fs from 'fs';
import path from 'path';
import * as api from './api';
import { formatCategory } from './categoryMapping';

/**
 * Catalog Library Data Layer
 * Milestone 2 (NAAKSH-WEB-M2-DYNAMIC-CATEGORIES-001)
 * 
 * Provides unified, server-authoritative catalog data access.
 * Backend Category API (GET /api/categories) is the primary authoritative source.
 * Local static JSON is preserved strictly as a non-authoritative fallback during development.
 */

// Local Static JSON Fallback Readers
export async function getLocalProducts() {
  const filePath = path.join(process.cwd(), 'public', 'product-assets', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
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
 * Enriched with deterministic UI presentation slug and image mappings.
 */
export async function getCategories(options = {}) {
  // If explicitly forcing local fallback
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
    
    // If backend returned empty array, use local fallback
    console.warn('Backend categories API returned 0 items; using local fallback.');
    return getLocalCategories();
  } catch (err) {
    console.warn('Backend categories API unavailable; using local fallback:', err.message);
    return getLocalCategories();
  }
}

/**
 * Get products (Milestone 1 baseline; Milestone 3 will make fully dynamic).
 */
export async function getProducts(options = {}) {
  if (options.remote) {
    try {
      const response = await api.getProducts(options.params || {});
      return response?.data || [];
    } catch (err) {
      console.warn('API getProducts failed, falling back to local static catalog:', err.message);
      return getLocalProducts();
    }
  }
  return getLocalProducts();
}

export async function getJournalPosts() {
  return getLocalJournalPosts();
}

// Re-export central API functions and mapping helpers
export { api, formatCategory };
