export type BreakoutSession = {
  id: string;
  round: 1 | 2 | 3 | 4;
  room?: string;
  track?: string;
  title: string;
  speakers: string[];
  moderator?: string;
  startsAt?: string;
};

/**
 * Minimal breakout catalog so the workshop selector can render.
 * Replace with real data or fetch from Firestore when ready.
 */
const BREAKOUT_SESSIONS: BreakoutSession[] = [
  {
    id: 'round1-roomA',
    round: 1,
    room: 'Room A',
    track: 'Leadership',
    title: 'Scaling Creative Teams',
    speakers: ['Session Host'],
    startsAt: '2025-10-07T10:00:00+01:00',
  },
  {
    id: 'round2-roomB',
    round: 2,
    room: 'Room B',
    track: 'Technology',
    title: 'AI Tooling for Agencies',
    speakers: ['Session Host'],
    startsAt: '2025-10-07T12:00:00+01:00',
  },
  {
    id: 'round3-roomC',
    round: 3,
    room: 'Room C',
    track: 'Design',
    title: 'Design Ops Masterclass',
    speakers: ['Session Host'],
    startsAt: '2025-10-07T14:00:00+01:00',
  },
  {
    id: 'round4-roomD',
    round: 4,
    room: 'Room D',
    track: 'Workshops',
    title: 'Hands-on Workshop',
    speakers: ['Workshop Lead'],
    startsAt: '2025-10-07T16:00:00+01:00',
  },
];

export default BREAKOUT_SESSIONS;
