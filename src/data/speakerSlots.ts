export type SpeakerSlotOption = {
  id: string;
  track: string;
  topic: string;
  speaker: string;
};

export type SpeakerSlotSession = {
  id: string;
  label: string;
  heading: string;
  options: SpeakerSlotOption[];
};

export const speakerSlotSessions: SpeakerSlotSession[] = [
  {
    id: 'd2-wellness',
    label: 'Day 2 - Experience',
    heading: 'Day 2 | Wellness & Restoration Experience',
    options: [
      {
        id: 'd2-watersport-experience',
        track: 'Experience',
        topic: 'Water Sport',
        speaker: 'Atinuda Experience Team',
      },
      {
        id: 'd2-spa-day-experience',
        track: 'Experience',
        topic: 'Spa Treatment & Relaxation',
        speaker: 'Atinuda Wellness Team',
      },
    ],
  },
  {
    id: 'day4-round1',
    label: 'Day 4 - Session One',
    heading: 'Day 4 | Parallel Workshops - Round One',
    options: [
      {
        id: 'd4s1-1',
        track: 'Design',
        topic: 'The Business & Currency of Creativity',
        speaker: 'David Stark',
      },
      {
        id: 'd4s1-2',
        track: 'AI & Tech',
        topic: 'Digital Transformation in Practice',
        speaker: 'Justin Irabor',
      },
      {
        id: 'd4s1-3',
        track: 'Leadership',
        topic: 'Emotional Intelligence as Your Leadership Superpower',
        speaker: 'Simon Alexander',
      },
      {
        id: 'd4s1-4',
        track: 'Master Workshop',
        topic:
          'The Iconic Aesthetic: Building a Visual Empire (Practical Workshop)',
        speaker: 'Mai Atafo',
      },
    ],
  },
  {
    id: 'day4-round2',
    label: 'Day 4 - Session Two',
    heading: 'Day 4 | Parallel Workshops - Round Two',
    options: [
      {
        id: 'd4s2-1',
        track: 'Strategy',
        topic: 'High-Impact Negotiation & Deal-Making',
        speaker: 'Gideon Hermosa',
      },
      {
        id: 'd4s2-2',
        track: 'Wellness / Sustainability & Health',
        topic: 'Longevity Thinking',
        speaker: 'Queen Murielle',
      },
      {
        id: 'd4s2-3',
        track: 'Personal Finance & Wealth',
        topic: 'Building Generational Legacy',
        speaker: 'Stanley C',
      },
      {
        id: 'd4s2-4',
        track: 'The Reputation Playbook',
        topic:
          'Strategic Frameworks for Building Trust, Credibility, and Opportunity',
        speaker: 'Sophie Masipa',
      },
    ],
  },
  {
    id: 'day5-round1',
    label: 'Day 5 - Session One',
    heading: 'Day 5 | Parallel Workshops - Round One',
    options: [
      {
        id: 'd5s1-1',
        track: 'Strategy',
        topic: 'Scaling Smart',
        speaker: 'Lady Dentaa Amoateng',
      },
      {
        id: 'd5s1-2',
        track: 'AI & Strategy',
        topic: 'The Future-Proof Enterprise',
        speaker: 'Sega',
      },
      {
        id: 'd5s1-3',
        track: 'Leadership',
        topic: 'Embodied Leadership & Inner Resilience',
        speaker: 'Anita Erskine',
      },
      {
        id: 'd5s1-4',
        track: 'Masterworkshop',
        topic: 'Building Your Signature Style',
        speaker: 'Gideon Hermosa',
      },
      {
        id: 'd5s1-5',
        track: 'Global Expansions and Networking',
        topic:
          'Building Strategic Relationships Across Borders',
        speaker: 'Kamil Olufowobi',
      },
    ],
  },
  {
    id: 'day5-round2',
    label: 'Day 5 - Session Two',
    heading: 'Day 5 | Parallel Workshops - Round Two',
    options: [
      {
        id: 'd5s2-1',
        track: 'Strategy',
        topic: 'Making Clear Choices for Focus, Alignment & Momentum',
        speaker: 'Charles O Tudor',
      },
      {
        id: 'd5s2-2',
        track: 'Wealth',
        topic: 'The Wealth Operating System',
        speaker: 'Tiffany',
      },
      {
        id: 'd5s2-3',
        track: 'Visual Storytelling & Creative Innovation',
        topic: 'Capturing Ideas That Connect and Convert',
        speaker: 'Henry Oji (Big H)',
      },
      {
        id: 'd5s2-4',
        track: 'Branding',
        topic: 'Building Authentic Personal Brands',
        speaker: 'Samke Mhlongo',
      },
    ],
  },
  {
    id: 'd6-island-experience-day',
    label: 'Day 6 - Experience',
    heading: 'Day 6 | Island Experience Day',
    options: [
      {
        id: 'd6-casela',
        track: 'Experience',
        topic: 'Casela Nature Park',
        speaker: 'Atinuda Hospitality Team',
      },
      {
        id: 'd6-adventure-park',
        track: 'Experience',
        topic: 'Valle Park (Adevnture Park',
        speaker: 'Atinuda Hospitality Team',
      },
      {
        id: 'd6-rum-track',
        track: 'Experience',
        topic: 'Rum Distillery Tour + Chamarel Colored',
        speaker: 'Atinuda Hospitality Team',
      },
      {
        id: 'd6-pottery-track',
        track: 'Experience',
        topic: 'Pottery + Adventure du Sucre + Port Louis Market',
        speaker: 'Atinuda Hospitality Team',
      },
      
    ],
  },
];
