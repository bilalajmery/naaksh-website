import { getCatalogProducts, getCategories } from '../../lib/catalog';
import ShopClient from './ShopClient';

export const metadata = {
  title: 'Shop All Streetwear & Urban Fashion',
  description: 'Explore the full NAAKSH streetwear collection in Pakistan. Shop premium oversized drop shoulder tees, heavyweight hoodies, graphic sweatpants, and luxury basics.',
  keywords: [
    'Shop Streetwear Pakistan',
    'Buy Oversized T-Shirts Online',
    'Graphic Hoodies Pakistan',
    'Drop Shoulder Tees Karachi Lahore',
    'Pakistani Urban Clothing Store',
  ],
  alternates: {
    canonical: 'https://naakshofficial.com/shop',
  },
  openGraph: {
    title: 'Shop All Streetwear & Urban Fashion | NAAKSH',
    description: 'Explore the full NAAKSH streetwear collection in Pakistan. Shop premium oversized drop shoulder tees, heavyweight hoodies, and urban essentials.',
    url: 'https://naakshofficial.com/shop',
    siteName: 'NAAKSH',
    type: 'website',
    images: [
      {
        url: '/logo/dark/sm.png',
        width: 800,
        height: 600,
        alt: 'Shop NAAKSH Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Streetwear & Urban Fashion | NAAKSH',
    description: 'Explore the full NAAKSH streetwear collection. Premium drop shoulder tees, hoodies, and graphic apparel with nationwide delivery.',
    images: ['/logo/dark/sm.png'],
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
