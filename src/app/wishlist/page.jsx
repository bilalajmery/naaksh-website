import WishlistClient from './WishlistClient';

export const metadata = {
  title: 'My Wishlist',
  description: 'View and manage your saved items on NAAKSH.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
