import { getCatalogProducts, getCategories } from '../../lib/catalog';
import ShopClient from './ShopClient';

export const metadata = {
  title: 'Shop All Products | NAAKSH — Premium Streetwear Pakistan',
  description: 'Explore the full NAAKSH collection of premium drop shoulder tees, hoodies, denim jackets, and urban fashion in Pakistan.',
  alternates: {
    canonical: 'https://naakshofficial.com/shop',
  },
};

export default async function ShopPage({ searchParams }) {
  // Await searchParams for Next.js 15/16 compatibility
  const resolvedParams = searchParams ? await searchParams : {};

  // Sanitize and construct query params for Backend M16 Product API
  const queryParams = {
    page: resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1,
    per_page: resolvedParams.per_page ? parseInt(resolvedParams.per_page, 10) : 12,
  };

  if (resolvedParams.category_id) {
    queryParams.category_id = parseInt(resolvedParams.category_id, 10);
  }
  if (resolvedParams.search) {
    queryParams.search = String(resolvedParams.search).trim();
  }
  if (resolvedParams.sort) {
    queryParams.sort = String(resolvedParams.sort);
  }
  if (resolvedParams.stock_status) {
    queryParams.stock_status = String(resolvedParams.stock_status);
  }
  if (resolvedParams.is_featured !== undefined) {
    queryParams.is_featured = resolvedParams.is_featured === 'true' || resolvedParams.is_featured === '1';
  }
  if (resolvedParams.size_id) {
    queryParams.size_id = parseInt(resolvedParams.size_id, 10);
  }
  if (resolvedParams.garment_color_id || resolvedParams.color_id) {
    queryParams.garment_color_id = parseInt(resolvedParams.garment_color_id || resolvedParams.color_id, 10);
  }

  // Fetch products and categories concurrently
  const [catalogResult, categories] = await Promise.all([
    getCatalogProducts(queryParams),
    getCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={catalogResult.products}
      categories={categories}
      meta={catalogResult.meta}
      currentFilters={{
        category_id: queryParams.category_id || null,
        search: queryParams.search || '',
        sort: queryParams.sort || 'newest',
        stock_status: queryParams.stock_status || null,
      }}
    />
  );
}
