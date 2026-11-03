import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Experience',
  description: 'Atinuda in motion: scenes from the summits and retreats that bring Africa’s experience economy together.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
