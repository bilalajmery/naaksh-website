import fs from 'fs';
import path from 'path';
import * as api from './api';

/**
 * Catalog Library Data Layer
 * Milestone 1 Foundation (NAAKSH-WEB-M1-FOUNDATION-001)
 * 
 * Provides unified access to catalog datasets.
 * Prepares the architecture to seamlessly transition from local JSON fallbacks
 * to authoritative Laravel Backend APIs in subsequent milestones.
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
    return JSON.parse(fileContents);
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

// Current catalog accessors (Static JSON retained for M1; prepared for API delegation)
export async function getProducts(options = {}) {
  // If remote API is explicitly requested or when cutover flag is enabled
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

export async function getCategories(options = {}) {
  // If remote API is explicitly requested or when cutover flag is enabled
  if (options.remote) {
    try {
      const response = await api.getCategories();
      return response?.data || [];
    } catch (err) {
      console.warn('API getCategories failed, falling back to local static categories:', err.message);
      return getLocalCategories();
    }
  }
  return getLocalCategories();
}

export async function getJournalPosts() {
  return getLocalJournalPosts();
}

// Re-export central API functions for direct consumer access
export { api };
