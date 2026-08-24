import '../index.css';
import { Providers } from './providers';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { getCategories } from '../lib/catalog';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://naakshofficial.com'),
  title: {
    default: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
    template: '%s | NAAKSH',
  },
  description: 'Naaksh is Pakistan’s premier streetwear label offering heavyweight oversized graphic tees, drop-shoulder hoodies, and luxury essentials crafted with bold Pakistani attitude.',
  keywords: [
    'Pakistani Streetwear',
    'Oversized T-Shirts Pakistan',
    'Streetwear Pakistan',
    'Drop Shoulder Tees',
    'Graphic Hoodies Karachi',
    'Urban Clothing Brand Lahore',
    'Heavyweight Cotton Tees',
    'NAAKSH Official'
  ],
  authors: [{ name: 'NAAKSH', url: 'https://naakshofficial.com' }],
  creator: 'NAAKSH',
  publisher: 'NAAKSH',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
    description: 'Naaksh offers high-grade 240 GSM bio-washed cotton streetwear, oversized drop-shoulder fits, and bold limited drops across Pakistan.',
    url: 'https://naakshofficial.com',
    siteName: 'NAAKSH',
    locale: 'en_PK',
    images: [
      {
        url: '/logo/dark/sm.png',
        width: 800,
        height: 600,
        alt: 'NAAKSH Streetwear Pakistan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
    description: 'Shop luxury oversized drop shoulder streetwear in Pakistan with free nationwide express delivery.',
    images: ['/logo/dark/sm.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo/sm.png',
  },
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NAAKSH',
    url: 'https://naakshofficial.com',
    logo: 'https://naakshofficial.com/logo/dark/sm.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-340-3577155',
      contactType: 'customer service',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    },
    sameAs: [
      'https://www.instagram.com/naakshofficial/',
      'https://www.facebook.com/naakshofficial',
      'https://www.tiktok.com/@naakshofficial',
      'https://www.youtube.com/@NaakshOfficial-f9h',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NAAKSH',
    url: 'https://naakshofficial.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://naakshofficial.com/shop?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function (w, d, s, l, i) {
              w[l] = w[l] || []; w[l].push({
                'gtm.start':
                  new Date().getTime(), event: 'gtm.js'
              }); var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                  'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-KBVMK4RW');
          `}
        </Script>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0YP46PKCRZ" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-0YP46PKCRZ');
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KBVMK4RW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        
        <Providers>
          <Navbar categories={categories} loadingCategories={false} />
          {children}
          <WhatsAppButton />
          <Footer categories={categories} loadingCategories={false} />
        </Providers>
      </body>
    </html>
  );
}
