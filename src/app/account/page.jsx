import AccountClient from './AccountClient';

export const metadata = {
  title: 'My Account & Order Tracking',
  description: 'Manage your NAAKSH member profile, view past streetwear orders, track deliveries, and manage saved shipping addresses.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return <AccountClient />;
}
