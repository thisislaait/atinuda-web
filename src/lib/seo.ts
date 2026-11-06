// What search engines read about Atinuda and Atinuda 7.0. Prices come from the catalogue, so
// these can't drift from what the checkout charges.
import { PRODUCTS, unitPrice } from '@/lib/atinuda7Checkout';

export const SITE_URL = 'https://www.atinuda.africa';
export const SHARE_IMAGE = '/assets/images/atinuda-share.jpg';

const ORGANISER = {
  '@type': 'Organization',
  name: 'Atinuda',
  url: SITE_URL,
};

export const organisationJsonLd = {
  '@context': 'https://schema.org',
  ...ORGANISER,
  logo: `${SITE_URL}/assets/images/atinuda-glyph.png`,
  email: 'hello@atinuda.africa',
  sameAs: [
    'https://instagram.com/atinuda_',
    'https://linkedin.com/company/atinuda',
    'https://twitter.com/atinuda_',
  ],
};

export function eventJsonLd(now: Date = new Date()) {
  const prices = PRODUCTS.filter((p) => p.kind !== 'test').map((p) => unitPrice(p, now));
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Atinuda 7.0: Tomorrow, Now',
    description:
      'Sub-Saharan Africa’s definitive summit for the experiential economy, bringing together fashion founders, hospitality executives, creative directors and sector investors for three days in Lagos.',
    startDate: '2027-10-05',
    endDate: '2027-10-07',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    // The venue has not been announced. Add its name and street address when it is.
    location: {
      '@type': 'Place',
      name: 'Lagos, Nigeria',
      address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressRegion: 'Lagos', addressCountry: 'NG' },
    },
    image: [`${SITE_URL}${SHARE_IMAGE}`],
    url: SITE_URL,
    organizer: ORGANISER,
    offers: {
      '@type': 'AggregateOffer',
      url: `${SITE_URL}/pricing`,
      priceCurrency: 'NGN',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: 'https://schema.org/InStock',
    },
  };
}

// Stops text inside the data from ending the script tag early.
export const jsonLdHtml = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
