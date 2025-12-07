import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://naakshofficial.com';

const staticRoutes = [
    '/',
    '/about',
    '/shop',
    '/contact',
    '/cart',
    '/wishlist',
    '/terms',
    '/privacy'
];

async function generateSitemap() {
    try {
        // Read Product Data
        const productDataPath = path.join(__dirname, 'public', 'product', 'data.json');
        const productData = JSON.parse(fs.readFileSync(productDataPath, 'utf-8'));

        // Read Category Data
        const categoryDataPath = path.join(__dirname, 'public', 'category', 'data.json');
        const categoryData = JSON.parse(fs.readFileSync(categoryDataPath, 'utf-8'));

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Helper to get priority
        const getPriority = (route) => {
            if (route === '/') return '1.0';
            if (route === '/shop') return '0.9';
            if (['/about', '/contact'].includes(route)) return '0.8';
            return '0.6'; // cart, wishlist
        };

        // Add Static Routes
        staticRoutes.forEach(route => {
            sitemap += `
                <url>
                    <loc>${BASE_URL}${route}</loc>
                    <changefreq>${route === '/' ? 'daily' : 'monthly'}</changefreq>
                    <priority>${getPriority(route)}</priority>
                </url>`;
        });

        // Add Category Routes
        categoryData.forEach(cat => {
            sitemap += `
                <url>
                    <loc>${BASE_URL}/shop?category=${encodeURIComponent(cat.name)}</loc>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>`;
        });

        // Add Product Routes
        productData.forEach(product => {
            sitemap += `
                <url>
                    <loc>${BASE_URL}/product/${product.slug}</loc>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>`;
        });

        sitemap += `</urlset>`;

        // Write to sitemap.xml
        const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemap);

        console.log(`Sitemap generated successfully at ${sitemapPath}`);
        console.log(`Total URLs: ${staticRoutes.length + categoryData.length + productData.length}`);

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();
