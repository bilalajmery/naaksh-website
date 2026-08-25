#!/usr/bin/env node

/**
 * NAAKSH Production-Grade Dynamic Sitemap Generator
 * Task ID: NAAKSH-WEB-M12-DYNAMIC-SITEMAP-COMMAND-001
 * 
 * Fetches authoritative dynamic catalog data directly from Laravel REST API
 * and generates a standards-compliant XML sitemap at Website/public/sitemap.xml.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CANONICAL_BASE_URL = 'https://naakshofficial.com';
const SITEMAP_PATH = path.join(projectRoot, 'public', 'sitemap.xml');

// Load environment API URL or default
function resolveApiUrl() {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.VITE_SERVER_URL;
  if (!apiUrl) {
    // Attempt reading from .env file if available
    const envPath = path.join(projectRoot, '.env');
    if (fs.existsSync(envPath)) {
      try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/NEXT_PUBLIC_API_URL\s*=\s*["']?([^"'\r\n]+)["']?/);
        if (match) {
          apiUrl = match[1];
        }
      } catch {
        // Fallback below
      }
    }
  }
  return (apiUrl || 'https://backend.naakshofficial.com/api').replace(/\/+$/, '');
}

function xmlEscape(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'NAAKSH-Sitemap-Generator/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} (${response.statusText})`);
  }

  return response.json();
}

async function run() {
  const apiUrl = resolveApiUrl();

  console.log('NAAKSH Sitemap Generator');
  console.log('------------------------');
  console.log(`API: ${apiUrl}`);
  console.log('');

  const urlMap = new Map(); // key: url -> { loc, lastmod, changefreq, priority }
  let staticCount = 0;
  let categoryCount = 0;
  let productCount = 0;

  try {
    // 1. Static Public Routes
    const staticRoutes = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/shop', priority: '0.9', changefreq: 'daily' },
      { path: '/about', priority: '0.6', changefreq: 'monthly' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' },
      { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { path: '/terms', priority: '0.3', changefreq: 'yearly' },
    ];

    for (const route of staticRoutes) {
      const fullUrl = `${CANONICAL_BASE_URL}${route.path}`;
      urlMap.set(fullUrl, {
        loc: fullUrl,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: route.changefreq,
        priority: route.priority,
      });
      staticCount++;
    }

    // 2. Fetch Authoritative Categories from Laravel API
    console.log('Fetching active categories...');
    const catResponse = await fetchJson(`${apiUrl}/categories`);
    const rawCategories = Array.isArray(catResponse?.data)
      ? catResponse.data
      : Array.isArray(catResponse)
      ? catResponse
      : [];

    if (!Array.isArray(rawCategories)) {
      throw new Error('Categories API returned invalid non-array structure.');
    }

    for (const cat of rawCategories) {
      if (!cat) continue;
      const slug = cat.slug || (cat.name ? cat.name.toLowerCase().replace(/\s+/g, '-') : null);
      if (!slug) {
        console.warn(`[Skip] Category record #${cat.id || 'unknown'} missing slug and name.`);
        continue;
      }

      const catUrl = `${CANONICAL_BASE_URL}/category/${encodeURIComponent(slug)}`;
      if (!urlMap.has(catUrl)) {
        urlMap.set(catUrl, {
          loc: catUrl,
          lastmod: cat.updated_at ? new Date(cat.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8',
        });
        categoryCount++;
      }
    }
    console.log(`✓ Retrieved ${categoryCount} categories`);

    // 3. Paginated Product Collection (Respecting per_page <= 48 limit)
    console.log('Fetching active products across pages...');
    let currentPage = 1;
    let lastPage = 1;
    const MAX_PAGES = 50; // Defensive safeguard against infinite pagination loops
    const PER_PAGE = 48;

    while (currentPage <= lastPage && currentPage <= MAX_PAGES) {
      const pageUrl = `${apiUrl}/products?page=${currentPage}&per_page=${PER_PAGE}`;
      const prodResponse = await fetchJson(pageUrl);

      const products = Array.isArray(prodResponse?.data)
        ? prodResponse.data
        : Array.isArray(prodResponse)
        ? prodResponse
        : [];

      // Update pagination metadata from Laravel standard meta
      if (prodResponse?.meta) {
        lastPage = Number(prodResponse.meta.last_page) || currentPage;
      } else if (prodResponse?.last_page) {
        lastPage = Number(prodResponse.last_page) || currentPage;
      } else {
        // If no pagination metadata provided, if products < PER_PAGE we are done
        lastPage = products.length === PER_PAGE ? currentPage + 1 : currentPage;
      }

      for (const prod of products) {
        if (!prod) continue;
        const targetIdentifier = prod.slug || prod.uuid || (prod.id && String(prod.id).includes('-') ? prod.id : null);
        if (!targetIdentifier) {
          console.warn(`[Skip] Product record #${prod.id || 'unknown'} missing slug and UUID.`);
          continue;
        }

        const prodUrl = `${CANONICAL_BASE_URL}/product/${encodeURIComponent(targetIdentifier)}`;
        if (!urlMap.has(prodUrl)) {
          urlMap.set(prodUrl, {
            loc: prodUrl,
            lastmod: prod.updated_at ? new Date(prod.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8',
          });
          productCount++;
        }
      }

      currentPage++;
    }
    console.log(`✓ Retrieved ${productCount} products`);

    // 4. Generate Standards-Compliant XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const item of urlMap.values()) {
      xml += '  <url>\n';
      xml += `    <loc>${xmlEscape(item.loc)}</loc>\n`;
      if (item.lastmod) {
        xml += `    <lastmod>${xmlEscape(item.lastmod)}</lastmod>\n`;
      }
      if (item.changefreq) {
        xml += `    <changefreq>${xmlEscape(item.changefreq)}</changefreq>\n`;
      }
      if (item.priority) {
        xml += `    <priority>${xmlEscape(item.priority)}</priority>\n`;
      }
      xml += '  </url>\n';
    }

    xml += '</urlset>\n';

    // 5. Write to public/sitemap.xml
    fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');

    console.log('');
    console.log(`Static URLs: ${staticCount}`);
    console.log(`Categories: ${categoryCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Total URLs: ${urlMap.size}`);
    console.log('');
    console.log('Sitemap:');
    console.log(path.relative(process.cwd(), SITEMAP_PATH));
    console.log('');
    console.log('Status: SUCCESS');
    process.exit(0);

  } catch (error) {
    console.error('');
    console.error('Status: FAILED');
    console.error('');
    console.error('Reason:');
    console.error(`Laravel API unavailable: ${error.message}`);
    console.error('');
    console.error('Existing sitemap preserved.');
    console.error('');
    console.error('Exit code: 1');
    process.exit(1);
  }
}

run();
