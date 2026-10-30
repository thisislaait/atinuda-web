// next.config.js
/** @type {import('next').NextConfig} */

// Pages removed when buying, tickets and staff tools moved to the Atinuda app
// (see ~/atinuda/docs/platform-split.md). Old links in emails, posts and search results land here.
const removedPages = [
  ...['/checkout', '/checkout2', '/ticket-payment', '/ticket-payment-test', '/pay/Flutterwave', '/pricing/checkout',
    '/summit/tickets', '/success', '/success-test', '/7.0-waitlist', '/7.0-archived'].map((source) => ({ source, destination: '/pricing' })),
  ...['/tickets', '/tickets/:path*', '/ticket/:ticketNumber', '/attendee-ticket', '/login', '/signup', '/invite',
    '/menu-options', '/dinner-walimer', '/azizi-rsvp', '/breakout-selection-form', '/retreat-workshop-sessions',
    '/elevation-feedback', '/elevation-retreat-feedback'].map((source) => ({ source, destination: '/get-the-app' })),
  ...['/admin', '/admin/:path*', '/attendee-sheets', '/tickets-table', '/azizi-attendees', '/offline-registration',
    '/luxury-persona'].map((source) => ({ source, destination: '/' })),
  { source: '/retreat-ticket', destination: '/join-the-waitlist' },
  { source: '/events', destination: '/elevation-2026' },
  { source: '/events/:path*', destination: '/elevation-2026' },
  { source: '/spark-the-future-2025', destination: '/spark-the-future' },
].map((r) => ({ ...r, permanent: false }));

const nextConfig = {
  experimental: {
    serverActions: {
      // raise to whatever you need: '10mb', '20mb', etc.
      bodySizeLimit: '20mb',
    },
  },
  async redirects() {
    return removedPages;
  },
};
module.exports = nextConfig;
