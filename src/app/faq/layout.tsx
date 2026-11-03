import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ: Passes, Payment and Logistics',
  description: 'Answers about Atinuda 7.0, 6–8 October 2027 in Lagos: what each pass includes, how to pay in naira or US dollars, instalments and what to bring.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
