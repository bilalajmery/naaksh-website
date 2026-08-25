import { getCategories, getCatalogProducts } from '../lib/catalog';

export default async function sitemap() {
  const baseUrl = 'https://naakshofficial.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const urlMap = new Map();

  // 1. Static Storefront Routes
  const staticRoutes = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  for (const route of staticRoutes) {
    urlMap.set(route.url, {
      url: route.url,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  // 2. Dynamic Categories
  try {
    const categories = await getCategories();
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        if (!cat) continue;
        const slug = cat.slug || cat.id;
        if (!slug) continue;
        const catUrl = `${baseUrl}/category/${encodeURIComponent(slug)}`;
        if (!urlMap.has(catUrl)) {
          urlMap.set(catUrl, {
            url: catUrl,
            lastModified: cat.updated_at ? new Date(cat.updated_at).toISOString().split('T')[0] : currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }
  } catch (err) {
    console.error('Sitemap Categories Error:', err);
  }

  // 3. Dynamic Products Across All Pages (per_page <= 48)
  try {
    let currentPage = 1;
    let lastPage = 1;
    const MAX_PAGES = 50;

    while (currentPage <= lastPage && currentPage <= MAX_PAGES) {
      const catalogResult = await getCatalogProducts({ page: currentPage, per_page: 48 });
      const products = catalogResult?.products || [];

      if (catalogResult?.meta?.last_page) {
        lastPage = Number(catalogResult.meta.last_page);
      } else {
        lastPage = products.length === 48 ? currentPage + 1 : currentPage;
      }

      for (const prod of products) {
        if (!prod) continue;
        const targetIdentifier = prod.slug || prod.uuid || prod.id;
        if (!targetIdentifier) continue;

        const prodUrl = `${baseUrl}/product/${encodeURIComponent(targetIdentifier)}`;
        if (!urlMap.has(prodUrl)) {
          urlMap.set(prodUrl, {
            url: prodUrl,
            lastModified: prod.updated_at ? new Date(prod.updated_at).toISOString().split('T')[0] : currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }

      currentPage++;
    }
  } catch (err) {
    console.error('Sitemap Products Error:', err);
  }

  return Array.from(urlMap.values());
}
