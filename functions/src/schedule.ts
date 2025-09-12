// functions/src/data/schedule.ts
export type SessionType = 'keynote' | 'workshop' | 'panel' | 'breakout' | 'networking';

export type Session = {
  id: string;
  title: string;
  speaker: string;
  speakerId?: string;
  date: string;
  day: string;
  time: string;
  duration: string;
  location: string;
  type: SessionType;
  description: string;
  capacity?: number;
  registered?: number; // ignored by seeder
};

export type DaySchedule = {
  date: string;
  day: string;
  sessions: Session[];
};

export const SCHEDULE: DaySchedule[] = [
  {
    date: '2025-10-06',
    day: 'Day 1',
    sessions: [
      {
        id: '1',
        title: 'Opening Keynote: The Future of Technology',
        speaker: 'Governor Babajide Sanwo-Olu',
        speakerId: 'sanwo-olu',
        date: '2025-10-06',
        day: 'Day 1',
        time: '09:00',
        duration: '60 min',
        location: 'Main Hall',
        type: 'keynote',
        description:
          'Emerging technologies and their impact on business transformation in Lagos & beyond.',
      },
      {
        id: '2',
        title: 'AI Workshop: Hands-on Machine Learning',
        speaker: 'Abas Idaresit',
        speakerId: 'abas-idaresit',
        date: '2025-10-06',
        day: 'Day 1',
        time: '10:30',
        duration: '90 min',
        location: 'Workshop Room A',
        type: 'workshop',
        description:
          'Interactive workshop on implementing ML solutions in enterprise environments.',
        capacity: 60,
        registered: 18,
      },
      {
        id: '4',
        title: 'Startup Funding Panel',
        speaker: 'Chioma Dure',
        speakerId: 'chioma-dure',
        date: '2025-10-06',
        day: 'Day 1',
        time: '14:00',
        duration: '75 min',
        location: 'Conference Room B',
        type: 'panel',
        description:
          'Securing funding for early-stage startups: what investors look for in 2025.',
      },
      {
        id: '3',
        title: 'Networking Coffee Break',
        speaker: 'All Attendees',
        date: '2025-10-06',
        day: 'Day 1',
        time: '12:00',
        duration: '30 min',
        location: 'Lobby',
        type: 'networking',
        description: 'Connect with fellow attendees over coffee and light refreshments.',
      },
    ],
  },
  {
    date: '2025-10-07',
    day: 'Day 2',
    sessions: [
      {
        id: '6',
        title: 'Fintech Revolution in Africa',
        speaker: 'Dr. Amara Okafor',
        date: '2025-10-07',
        day: 'Day 2',
        time: '09:00',
        duration: '60 min',
        location: 'Main Hall',
        type: 'keynote',
        description:
          'How fintech is transforming financial services across the African continent.',
      },
      {
        id: '7',
        title: 'Blockchain Workshop',
        speaker: 'Tech Experts',
        date: '2025-10-07',
        day: 'Day 2',
        time: '10:30',
        duration: '120 min',
        location: 'Workshop Room B',
        type: 'workshop',
        description: 'Deep dive into blockchain technology and cryptocurrency applications.',
        capacity: 25,
        registered: 20,
      },
    ],
  },
  {
    date: '2025-10-08',
    day: 'Day 3',
    sessions: [
      {
        id: '9',
        title: 'Closing Networking Reception',
        speaker: 'All Attendees',
        date: '2025-10-08',
        day: 'Day 3',
        time: '16:00',
        duration: '120 min',
        location: 'Rooftop Terrace',
        type: 'networking',
        description: 'Final networking opportunity with drinks and entertainment.',
      },
    ],
  },
];

export const DAYS = SCHEDULE.map((d) => ({ key: d.date, label: d.day }));
