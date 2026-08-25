import CartClient from './CartClient';

export const metadata = {
  title: 'Shopping Cart',
  description: 'View your selected items and proceed to checkout on NAAKSH.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartClient />;
}
