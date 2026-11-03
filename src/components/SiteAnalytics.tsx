'use client';

import { Analytics } from '@vercel/analytics/react';

// Cookieless visit counts. Staff pages and private order links are never reported, because those
// addresses are internal or carry a buyer's private token.
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const { pathname } = new URL(event.url);
        if (pathname.startsWith('/staff') || pathname.startsWith('/pricing/pay') || pathname.startsWith('/checkin')) return null;
        return event;
      }}
    />
  );
}
