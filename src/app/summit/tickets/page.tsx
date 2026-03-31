import type { Metadata } from 'next';
import TicketsPage from '@/components/summit/TicketsPage';

export const metadata: Metadata = {
  title: 'Tickets — Local To Global Summit',
  description:
    'Secure your place at the Local To Global Summit. Conference Pass and Executive Pass available in Naira and USD. The full day programme, workshop tracks, Spark the Future finals, and the Executive Dinner Gala.',
  openGraph: {
    title: 'Tickets | Local To Global Summit by Atinuda',
    description:
      'Two ways in. One day that matters. Conference and Executive access for the annual Atinuda summit in Lagos.',
    images: [{ url: '/assets/images/summit/GM5_1341.JPG' }],
  },
};

export default function SummitTicketsPage() {
  return <TicketsPage />;
}
