import Link from 'next/link';
import { getProductBySlugOrUuid, getRelatedProducts } from '../../../lib/catalog';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const product = await getProductBySlugOrUuid(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const primaryImageUrl = product.primary_media?.url || product.image || 'https://naakshofficial.com/logo/dark/sm.png';

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at NAAKSH. Premium Pakistani streetwear, high-grade cotton fabric, and signature drop shoulder cuts.`,
    openGraph: {
      title: `${product.name} | NAAKSH`,
      description: product.description || `Buy ${product.name} at NAAKSH.`,
      url: `https://naakshofficial.com/product/${product.slug || product.uuid}`,
      images: [
        {
          url: primaryImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: `https://naakshofficial.com/product/${product.slug || product.uuid}`,
    },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  const product = await getProductBySlugOrUuid(slug);

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase">Error 404</span>
          <h1 className="text-3xl font-black uppercase text-black mt-2 mb-4">Product Not Found</h1>
          <p className="text-gray-500 text-sm mb-8">
            The product &ldquo;{slug}&rdquo; is currently unavailable or does not exist.
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

  const relatedProducts = await getRelatedProducts(product, 4);

  // Build Schema.org Product JSON-LD
  const primaryImageUrl = product.primary_media?.url || product.image || 'https://naakshofficial.com/logo/dark/sm.png';
  const priceAmount = Number(product.price_raw) || 2500;
  const isInStock = product.stock_status !== 'out_of_stock' && product.purchasable !== false;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: primaryImageUrl,
    description: product.description || `Buy ${product.name} at NAAKSH.`,
    sku: product.uuid,
    brand: {
      '@type': 'Brand',
      name: 'NAAKSH',
    },
    offers: {
      '@type': 'Offer',
      url: `https://naakshofficial.com/product/${product.slug || product.uuid}`,
      priceCurrency: 'PKR',
      price: priceAmount,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'NAAKSH',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
