export default function robots() {
  const baseUrl = 'https://naakshofficial.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/checkout/*',
          '/account',
          '/account/*',
          '/wishlist',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
