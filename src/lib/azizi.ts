export type AziziRecord = {
  ticketNumber?: string | null;
  name?: string | null;
  mobile?: string | null;
  company?: string | null;
  rsvp?: string | null;
  respondedAt?: string | null;
  [key: string]: unknown;
};

/**
 * Placeholder Azizi RSVP data. Replace with a Firestore fetch or a generated JSON dump
 * once the live dataset is available.
 */
const AZIZI_ATTENDEES: Record<string, AziziRecord> = {};

export default AZIZI_ATTENDEES;
