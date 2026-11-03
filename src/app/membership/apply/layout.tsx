import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for Membership',
  description: 'Apply to The Inner Circle, the year-round Atinuda membership for founders, executives and creative leaders.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
