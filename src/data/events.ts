export type EventSlug =
  | 'local-to-global-2025'
  | 'ceo-dinner-2025-10-08'
  | 'azizi-mixer-2025-10-06'
  | 'martitus-retreat-2026';

export type EventMeta = {
  slug: EventSlug;
  name: string;
  dateText: string;
  city: string;
  country: string;
  ticketHost?: EventSlug;
};

export const EVENTS: ReadonlyArray<EventMeta> = [
  {
    slug: 'local-to-global-2025',
    name: 'Local to Global Summit',
    dateText: 'Oct 7–8, 2025',
    city: 'Lagos',
    country: 'Nigeria',
  },
  {
    slug: 'ceo-dinner-2025-10-08',
    name: 'CEO Gala Dinner',
    dateText: 'Oct 8, 2025',
    city: 'Lagos',
    country: 'Nigeria',
    ticketHost: 'local-to-global-2025',
  },
  {
    slug: 'azizi-mixer-2025-10-06',
    name: 'Azizi Cocktail Mixer',
    dateText: 'Oct 6, 2025',
    city: 'Lagos',
    country: 'Nigeria',
    ticketHost: 'local-to-global-2025',
  },
  {
    slug: 'martitus-retreat-2026',
    name: 'Sustainable Luxury Retreat',
    dateText: 'May 15–22, 2026',
    city: 'Mauritius',
    country: 'Mauritius',
  },
];

export function getTicketHostSlug(slug: string): string {
  const meta = EVENTS.find((event) => event.slug === slug);
  return meta?.ticketHost ?? meta?.slug ?? slug;
}
