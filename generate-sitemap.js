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
    '/wishlist'
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

        // Add Static Routes
        staticRoutes.forEach(route => {
            sitemap += `
                <url>
                    <loc>${BASE_URL}${route}</loc>
                    <changefreq>daily</changefreq>
                    <priority>0.8</priority>
                </url>`;
        });

        // Add Category Routes
        categoryData.forEach(cat => {
            const categorySlug = cat.name.toLowerCase(); // Simple slugification, adjust if needed
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
                    <priority>1.0</priority>
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
