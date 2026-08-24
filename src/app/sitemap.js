import { getCategories, getCatalogProducts } from '../lib/catalog';

export default async function sitemap() {
  const baseUrl = 'https://naakshofficial.com';
  const currentDate = new Date().toISOString();

  // 1. Static Storefront Routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Dynamic Categories
  let categoryRoutes = [];
  try {
    const categories = await getCategories();
    if (Array.isArray(categories)) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug || cat.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Sitemap Categories Error:', err);
  }

  // 3. Dynamic Products
  let productRoutes = [];
  try {
    const { products } = await getCatalogProducts({ per_page: 48 });
    if (Array.isArray(products)) {
      productRoutes = products.map((prod) => ({
        url: `${baseUrl}/product/${prod.slug || prod.uuid}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Sitemap Products Error:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
