import type { Metadata } from 'next';
import PaymentsClient from './PaymentsClient';

export const metadata: Metadata = {
  title: 'Payments | Atinuda staff',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

// `?sample=1` previews the page with invented data, on a local dev server only.
export default async function StaffPaymentsPage({ searchParams }: { searchParams: Promise<{ sample?: string }> }) {
  const { sample } = await searchParams;
  if (process.env.NODE_ENV === 'development' && sample === '1') {
    const { sampleComparison, sampleLedger } = await import('./sampleData');
    return <PaymentsClient sample={{ ledger: sampleLedger(), comparison: sampleComparison() }} />;
  }
  return <PaymentsClient />;
}
