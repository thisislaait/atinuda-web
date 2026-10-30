import type { Metadata } from 'next';
import EngageSummitPage from '@/components/summit/EngageSummitPage';

export const metadata: Metadata = {
  title: 'Local To Global Summit',
  description:
    "Atinuda's annual conference for African founders, executives, and creative leaders. Main-stage keynotes, expert workshops, and the Executive Dinner. Lagos.",
  openGraph: {
    title: 'Local To Global Summit | Atinuda',
    description:
      'A one-day conference and evening gala for the people driving African creative enterprise. Keynotes, workshops, and an executive dinner.',
    images: [{ url: '/assets/images/summit/new-images/IMG_0964L.jpg' }],
  },
};

export default function SummitPage() {
  return <EngageSummitPage />;
}
