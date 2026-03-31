import type { Metadata } from 'next';
import LocalToGlobalSummitPage from '@/components/summit/LocalToGlobalSummitPage';

export const metadata: Metadata = {
  title: 'Local To Global Summit 2025 | Atinuda',
  description:
    "Atinuda's annual conference for African founders, executives, and creative leaders. Main-stage keynotes, workshop tracks, Spark the Future pitch finals, and the Executive Dinner Gala. Lagos, Nigeria.",
  openGraph: {
    title: 'Local To Global Summit 2025 | Atinuda',
    description: 'One day a year. The right room. 400+ delegates, 25+ speakers, Lagos Nigeria.',
    images: [{ url: '/assets/images/summit/ATINUDA DAY 2_487.jpg' }],
  },
};

export default function LocalToGlobalSummit2025Page() {
  return <LocalToGlobalSummitPage />;
}
