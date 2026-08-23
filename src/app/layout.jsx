import '../index.css';
import { Providers } from './providers';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { getCategories } from '../lib/catalog';
import Script from 'next/script';

export const metadata = {
  title: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
  description: 'Naaksh offers unique, customizable fashion with high-quality T-shirts, hoodies, and bold or minimalist designs to help you stand out. Fashion, made personal.',
  openGraph: {
    title: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
    description: 'Naaksh offers unique, customizable fashion with high-quality T-shirts, hoodies, and bold or minimalist designs to help you stand out. Fashion, made personal.',
    url: 'https://naakshofficial.com',
    siteName: 'NAAKSH',
    images: [
      {
        url: 'https://naakshofficial.com/logo/dark/sm.png',
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAAKSH | Premium Streetwear & Urban Fashion in Pakistan',
    description: 'Naaksh offers unique, customizable fashion with high-quality T-shirts, hoodies, and bold or minimalist designs to help you stand out. Fashion, made personal.',
    images: ['https://naakshofficial.com/logo/dark/sm.png'],
  },
  icons: {
    icon: '/favicon.svg',
  }
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
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
