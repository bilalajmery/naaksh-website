import CheckoutClient from './CheckoutClient';

export const metadata = {
  title: 'Direct Checkout',
  description: 'Complete your order with secure Cash on Delivery and free home delivery across Pakistan.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
