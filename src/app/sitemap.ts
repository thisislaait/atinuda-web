import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.atinuda.africa';
  const now = new Date();

  const routes: Array<{ url: string; lastModified: Date; changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'always' | 'hourly' | 'daily' | 'never'; priority: number }> = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/our-story`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/membership`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/membership/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/corporate-responsibility`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/spark-the-future`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/press`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/join-the-waitlist`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/theme`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/experience`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/speakers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/elevation-2026`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/local-to-global-summit-2025`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/summit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return routes;
}
