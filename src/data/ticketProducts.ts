export type TicketProduct = {
  key: string;
  type: string;
  priceNGN: number;
  priceUSD: number;
  desc: string;
  image: string;
};

export const SUMMIT_TICKETS: ReadonlyArray<TicketProduct> = [
  {
    key: 'conference',
    type: 'Conference Access',
    priceNGN: 295_000,
    priceUSD: 200,
    desc: 'Full access to every main-stage conversation, keynote, and networking lab across the summit.',
    image: '/assets/images/Conference.png',
  },
  {
    key: 'workshop',
    type: 'Workshop Access',
    priceNGN: 250_000,
    priceUSD: 170,
    desc: 'Hands-on, expert-led workshops with curated breakout cohorts and learning materials.',
    image: '/assets/images/Maritius.png',
  },
  {
    key: 'premium',
    type: 'Premium Experience',
    priceNGN: 500_000,
    priceUSD: 340,
    desc: 'Conference + Workshop bundled rate with reserved seating and concierge registration.',
    image: '/assets/images/signaturee.png',
  },
  {
    key: 'executive',
    type: 'Executive Access',
    priceNGN: 650_000,
    priceUSD: 440,
    desc: 'Premium access plus invitation to the Executive Dinner & CEO networking evening.',
    image: '/assets/images/executive.jpeg',
  },
  {
    key: 'dinner',
    type: 'Dinner Gala Only',
    priceNGN: 250_000,
    priceUSD: 170,
    desc: 'Standalone ticket for the Executive Dinner Gala. Includes live performances and tasting menu.',
    image: '/assets/images/Dinner.png',
  },
];
