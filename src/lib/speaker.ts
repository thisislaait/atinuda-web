// lib/speakers.ts
export type Session = {
    id:string;
    title: string;
    date: string;
    time: string;
    location: string;
};

export type Speaker = {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string; // emoji or URL
  topics: string[];
  sessions: Session[];
  rating: number;
  expertise: string[];
};

export const SPEAKERS: Speaker[] = [
  {id: '1',
    name: 'Governor Babajide Sanwo-Olu',
    title: 'Governor of Lagos State',
    company: 'Lagos State Government',
    bio:
      'Keynote speaker shaping the vision for business and creative growth in Lagos. Focus on innovation, infrastructure, and inclusive opportunities.',
    image: '🏛️',
    topics: ['Governance', 'Innovation', 'Creative Economy'],
    sessions: [
      {
        id: 's1',
        title: 'Opening Keynote: The Future of Technology',
        date: '2025-10-06',
        time: '09:00',
        location: 'Main Hall',
      },
    ],
    rating: 4.9,
    expertise: ['AI Strategy', 'Team Leadership', 'Innovation'],
  },
  
  {
    id: '2',
    name: 'Seyi Tinubu',
    title: 'Chief Technology Officer',
    company: 'TechCorp Global',
    bio: 'Leading expert in AI and machine learning with 15+ years of experience in enterprise technology solutions.',
    image: '👩‍💼',
    topics: ['Artificial Intelligence', 'Machine Learning', 'Digital Transformation'],
    sessions: [
      { id: 's2', title: 'The Future of AI in Enterprise', date: '2024-02-15', time: '10:00 AM', location: 'Main Hall' },
      { id: 'w1', title: 'ML Workshop: Practical Applications', date: '2024-02-16', time: '02:00 PM', location: 'Workshop Room A' },
    ],
    rating: 4.8,
    expertise: ['AI Strategy', 'Team Leadership', 'Innovation'],
  },
  {
    id: '3',
    name: 'Lilian Olubi',
    title: 'Founder & CEO',
    company: 'StartupVentures',
    bio: 'Serial entrepreneur and investor with successful exits in fintech and healthtech sectors.',
    image: '👨‍💼',
    topics: ['Entrepreneurship', 'Venture Capital', 'Startup Strategy'],
    sessions: [
      { id: 's3', title: 'Building Scalable Startups', date: '2024-02-15', time: '02:30 PM', location: 'Conference Room B' },
    ],
    rating: 4.9,
    expertise: ['Fundraising', 'Product Strategy', 'Market Expansion'],
  },
  {
    id: '4',
    name: 'TY Bello',
    title: 'Head of Innovation',
    company: 'African Development Bank',
    bio: 'Driving financial inclusion across Africa through innovative fintech solutions and policy development.',
    image: '👩‍🔬',
    topics: ['Fintech', 'Financial Inclusion', 'African Markets'],
    sessions: [
      { id: 's4', title: 'Fintech Revolution in Africa', date: '2024-02-16', time: '09:00 AM', location: 'Main Hall' },
    ],
    rating: 4.7,
    expertise: ['Policy Development', 'Financial Services', 'Market Research'],
  },

  
  {
    id: '5',
    name: 'Abas Idaresit',
    title: 'Founder & Investor',
    company: 'Wild Fusion / Growth Capital',
    bio:
      'Entrepreneur and investor focused on building scalable companies and driving growth across Africa’s digital economy.',
    image: '🚀',
    topics: ['Growth', 'Digital Strategy', 'Startups'],
    sessions: [
      {
        id: 's5',
        title: 'AI Workshop: Hands-on Machine Learning',
        date: '2025-10-06',
        time: '10:30',
        location: 'Room A',
      },
    ],
    rating: 4.8,
    expertise: ['AI Strategy', 'Team Leadership', 'Innovation'],
  },
  {
    id: '6',
    name: 'Chioma Dure',
    title: 'CEO / Founder',
    company: 'Dure Consulting',
    bio:
      'Strategy and execution leader helping companies scale sustainably through partnerships, funding readiness, and operations.',
    image: '💼',
    topics: ['Funding', 'Partnerships', 'Operations'],
    sessions: [
      {
        id: 's6',
        title: 'Startup Funding Panel',
        date: '2025-10-06',
        time: '14:00',
        location: 'Hall B',
      },
    ],
    rating: 4.7,
    expertise: ['AI Strategy', 'Team Leadership', 'Innovation'],
  },
];

// quick helpers
export const getSpeakerById = (id: string) => SPEAKERS.find(s => s.id === id);

export const getSpeakerBySessionTitle = (title: string) =>
  SPEAKERS.find(s => s.sessions.some(sess => sess.title === title));
