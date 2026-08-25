import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us — Customer Care & Support',
  description: 'Get in touch with the NAAKSH customer care team in Pakistan. Inquire about orders, custom sizing recommendations, shipping, or business collaborations.',
  keywords: [
    'Contact NAAKSH',
    'NAAKSH Customer Support',
    'Streetwear Pakistan WhatsApp',
    'Order Inquiry Pakistan',
  ],
  alternates: {
    canonical: 'https://naakshofficial.com/contact',
  },
  openGraph: {
    title: 'Contact Us — Customer Care & Support | NAAKSH',
    description: 'Need help with your order, sizing, or exchange? Reach out to NAAKSH via WhatsApp or email for fast customer assistance across Pakistan.',
    url: 'https://naakshofficial.com/contact',
    siteName: 'NAAKSH',
    type: 'website',
    images: [
      {
        url: '/logo/dark/sm.png',
        width: 800,
        height: 600,
        alt: 'Contact NAAKSH',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — Customer Care & Support | NAAKSH',
    description: 'Get in touch with NAAKSH for prompt order support, styling advice, and questions.',
    images: ['/logo/dark/sm.png'],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
