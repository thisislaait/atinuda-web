import type { Metadata } from 'next';
import { Suspense } from 'react';
import PayClient from './PayClient';

// The URL carries the buyer's private token, so keep it out of search and referrer headers.
export const metadata: Metadata = {
  title: 'Your instalment | Atinuda 7.0',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function PayPage() {
  return (
    <Suspense fallback={<div id="nohero" style={{ minHeight: '100vh', background: '#F4F5F3' }} />}>
      <PayClient />
    </Suspense>
  );
}
