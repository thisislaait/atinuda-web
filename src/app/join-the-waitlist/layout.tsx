import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description: 'Join the Atinuda waitlist for news of the seventh edition, Atinuda 7.0, on 5–7 October 2027 in Lagos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
