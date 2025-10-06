// lib/breakouts.ts
export type Session = {
  id: string;
  round: 1 | 2 | 3;
  room: string;
  track: string;
  title: string;
  speakers: string[];
  moderator?: string;
  startsAt?: string;
};

const SESSIONS: Session[] = [
  // Round 1 (12:00 – 2:10 PM)
  {
    id: "r1-main-business",
    round: 1,
    room: "Main Stage",
    track: "Business",
    title: "Recovery strategies: Rebuilding after business setbacks in a competitive market",
    speakers: ["Mary Akpobome", "Angela Jide-Jones", "Obafemi Banigbe", "Chioma Adure Nwog-Johnson"],
    moderator: "Jennifer Odufuwa",
    startsAt: "12:00 – 14:10"
  },
  {
    id: "r1-victoria-events",
    round: 1,
    room: "Victoria",
    track: "Events",
    title: "Scaling Events: Operational excellence from local to international",
    speakers: ["Christine Ogbeh", "Bryan Tachie-Menson", "Abokuma Ellis", "Debola Lewis", "Eunice Showunmi-Adeyemi", "Gbemisola Ope"],
    moderator: undefined,
    startsAt: "12:00 – 14:10"
  },
  {
    id: "r1-abuja-finance",
    round: 1,
    room: "Abuja",
    track: "Finance",
    title: "How to invest wisely for long-term growth and build investor confidence",
    speakers: ["Samke Mhlongo", "Ajibade Laolu-Adewale"],
    moderator: "Oluwatosin Olaseinde",
    startsAt: "12:00 – 14:10"
  },
  {
    id: "r1-atlas-legal",
    round: 1,
    room: "Atlas",
    track: "Legal",
    title: "Intellectual property protection: Safeguarding your concepts globally",
    speakers: ["Omeiza Alao"],
    moderator: undefined,
    startsAt: "12:00 – 14:10"
  },
  {
    id: "r1-kano-sustain",
    round: 1,
    room: "Kano",
    track: "Sustainability",
    title: "Embedding sustainability in corporate DNA",
    speakers: ["Titi Oshodi", "Sophie Masipa", "Dr. Martin Kwende"],
    moderator: "Isabella Adediji",
    startsAt: "12:00 – 14:10"
  },

  // Round 2 (2:45 – 3:45 PM)
  {
    id: "r2-main-wealth",
    round: 2,
    room: "Main Stage",
    track: "Generational Wealth",
    title: "The Future of Money: Mastering Financial Intelligence for Sustainable Growth in Uncertain Times",
    speakers: ["Samke Mhlongo", "Dr. Martin Kwende", "Angela Jide-Jones", "Akwasi Peprah"],
    moderator: "Gbemileke Oscar Oyinsan",
    startsAt: "14:45 – 15:45"
  },
  {
    id: "r2-victoria-luxury",
    round: 2,
    room: "Victoria",
    track: "Luxury Market",
    title: "Luxury Client Psychology: Understanding High Net Worth Expectations Across Cultures",
    speakers: ["Ezinne Chinkata", "Frank Oshodi Richard", "Olivia Okeke", "Veronica Odeka"],
    moderator: "Chioma Adure Nwog-Johnson",
    startsAt: "14:45 – 15:45"
  },
  {
    id: "r2-abuja-strategy",
    round: 2,
    room: "Abuja",
    track: "Strategy",
    title: "Adapting leadership styles for international growth and mapping your path from local presence to global influence",
    speakers: ["Stephaine Obi", "Damon Haley", "Kelvin Okafor", "Ayo Mario-Ese"],
    moderator: undefined,
    startsAt: "14:45 – 15:45"
  },
  {
    id: "r2-atlas-comm",
    round: 2,
    room: "Atlas",
    track: "Communication",
    title: "Media & Communication – The Art of Connection & Audience Engagement",
    speakers: ["Stephanie Busari"],
    moderator: undefined,
    startsAt: "14:45 – 15:45"
  },
  {
    id: "r2-kano-wellness",
    round: 2,
    room: "Kano",
    track: "Wellness",
    title: "Wellness & Holistic Balance (Topic TBC)",
    speakers: ["Queen Murielle"],
    moderator: undefined,
    startsAt: "14:45 – 15:45"
  },

  // Round 3 (4:00 – 5:00 PM)
  {
    id: "r3-main-leadership",
    round: 3,
    room: "Main Stage",
    track: "Leadership",
    title: "The Loneliness Epidemic Among Leaders: Why Connection, Not Charisma, Builds Empires",
    speakers: ["Mary Ojulari", "Gbemi Ope", "Akwasi Peprah"],
    moderator: "Juliet Ibrahim",
    startsAt: "16:00 – 17:00"
  },
  {
    id: "r3-victoria-pr",
    round: 3,
    room: "Victoria",
    track: "PR / Branding",
    title: "Crafting your identity in Global Markets: Authentic Brand Storytelling",
    speakers: ["Salem King", "Claudia Lumor", "Chichi Nwoko", "Sophie Masipa"],
    moderator: undefined,
    startsAt: "16:00 – 17:00"
  },
  {
    id: "r3-abuja-entre",
    round: 3,
    room: "Abuja",
    track: "Entrepreneurship",
    title: "The Loyalty Loop: Turning customers into evangelists through exceptional experiences",
    speakers: ["Bisola Borha Arigbe", "Fisayo Beecroft", "Uzo Orimalade"],
    moderator: "Chioma Adure Nwog-Johnson",
    startsAt: "16:00 – 17:00"
  },
  {
    id: "r3-atlas-network",
    round: 3,
    room: "Atlas",
    track: "Networking",
    title: "Success without Social Media – Building Networks that Open Any Door",
    speakers: ["Kamil Olufowobi"],
    moderator: undefined,
    startsAt: "16:00 – 17:00"
  },
  {
    id: "r3-kano-destination",
    round: 3,
    room: "Kano",
    track: "Destination Events",
    title: "Curating destination experiences that tell a story",
    speakers: ["Seyi Olusanya"],
    moderator: undefined,
    startsAt: "16:00 – 17:00"
  }
];

export default SESSIONS;
