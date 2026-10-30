import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | Atinuda 7.0',
  description: 'Reserve passes for Atinuda 7.0, 6–8 October 2027 in Lagos. Groups of five or more receive 10% off; groups of ten or more receive 15% off.',
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div id="nohero" style={{ minHeight: '100vh', background: '#F4F5F3' }} />}>
      <CheckoutClient />
    </Suspense>
  );
}
