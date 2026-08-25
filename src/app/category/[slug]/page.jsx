import Link from 'next/link';
import { getCategories, getCatalogProducts } from '../../../lib/catalog';
import CategoryProductsClient from './CategoryProductsClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const categories = await getCategories();

  const matched = categories.find(
    (c) => c.slug === slug || c.slug === slug.toLowerCase() || String(c.id) === slug
  );

  if (!matched) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const categoryTitle = matched.name;
  const categoryDescription = `Explore the ${matched.name} collection at NAAKSH. Premium bio-washed fabrics, precision streetwear tailoring, and signature Pakistani cuts.`;
  const canonicalUrl = `https://naakshofficial.com/category/${matched.slug}`;
  const categoryImage = matched.image || '/logo/dark/sm.png';

  return {
    title: categoryTitle,
    description: categoryDescription,
    keywords: [
      `${matched.name} Pakistan`,
      `Buy ${matched.name} Online`,
      `NAAKSH ${matched.name}`,
      'Streetwear Pakistan',
      'Urban Clothing Brand',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoryTitle} | NAAKSH`,
      description: categoryDescription,
      url: canonicalUrl,
      siteName: 'NAAKSH',
      type: 'website',
      images: [
        {
          url: categoryImage,
          width: 800,
          height: 600,
          alt: `${categoryTitle} - NAAKSH`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryTitle} | NAAKSH`,
      description: categoryDescription,
      images: [categoryImage],
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const slug = resolvedParams?.slug || '';

  const categories = await getCategories();

  // Find category by slug, name match, or id match
  const currentCategory = categories.find(
    (c) => c.slug === slug || c.slug === slug.toLowerCase() || String(c.id) === slug
  );

  if (!currentCategory) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">Error 404</span>
          <h1 className="text-3xl font-black uppercase text-black mt-2 mb-4">Category Not Found</h1>
          <p className="text-gray-500 text-sm mb-8">
            The category &ldquo;{slug}&rdquo; does not exist or is currently unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition"
            >
              Browse All Products
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const otherCategories = categories.filter((c) => c.id !== currentCategory.id);

  const queryParams = {
    category_id: currentCategory.id,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1,
    per_page: resolvedSearchParams.per_page ? parseInt(resolvedSearchParams.per_page, 10) : 12,
    sort: resolvedSearchParams.sort || 'newest',
  };

  const catalogResult = await getCatalogProducts(queryParams);

  return (
    <CategoryProductsClient
      category={currentCategory}
      otherCategories={otherCategories}
      initialProducts={catalogResult.products}
      meta={catalogResult.meta}
      currentSort={queryParams.sort}
    />
  );
}
