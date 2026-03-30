// Source of truth for all Elevation Retreat 2026 event blog posts.
// Each entry maps to /events/[slug].
// Images are placeholders, replace src values with real asset paths before launch.

export type ImageBlock   = { type: 'img';   src?: string; alt: string; caption?: string; portrait?: boolean };
export type TextBlock    = { type: 'p';     text: string };
export type HeadingBlock = { type: 'h3';   text: string };
export type VenueBlock   = { type: 'venue'; name: string; body: string };
export type PullBlock    = { type: 'pull';  text: string };
export type GridBlock    = { type: 'grid';  images: { src?: string; alt: string; caption?: string }[]; cols?: 2 | 3 };

export type ContentBlock =
  | ImageBlock
  | TextBlock
  | HeadingBlock
  | VenueBlock
  | PullBlock
  | GridBlock;

export type RetreatEvent = {
  slug: string;
  day: number;
  date: string;
  title: string;
  subtitle: string;
  excerpt: string;
  primaryVenue: string;
  tag: string;
  heroImageAlt: string;
  heroImageSrc?: string;
  content: ContentBlock[];
};

export const retreatEvents: RetreatEvent[] = [
  // ── DAY 1 ──────────────────────────────────────────────────────────────────
  {
    slug: 'day-1-first-night-mauritius',
    day: 1,
    date: 'March 8, 2026',
    title: 'First Light',
    subtitle: 'The Welcome Cocktail That Started Everything',
    excerpt:
      'The Indian Ocean has a way of making ambition feel possible. When the first delegates of the Atinuda Elevation touched down in Mauritius, something shifted.',
    primaryVenue: 'The Oberoi, Mauritius',
    tag: 'Welcome',
    heroImageAlt: 'Welcome cocktail at The Oberoi at sunset, Mauritius',
    heroImageSrc: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_17.JPG',
    content: [
      {
        type: 'p',
        text: 'The Indian Ocean has a way of making ambition feel possible. When the Atinuda Elevation 2026 cohort touched down in Mauritius on March 8th, something shifted, not just the time zones. Something more fundamental.',
      },
      {
        type: 'p',
        text: 'The welcome cocktail at The Oberoi, Mauritius set the tone for everything that followed. Held as the sun fell behind the Morne Peninsula, casting the lagoon in shades of copper and gold, it was the moment the room became a room.',
      },
      {
        type: 'img',
        src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_30.JPG',
        alt: 'Welcome reception terrace at The Oberoi at golden hour',
        caption: 'The Oberoi, Mauritius · Day 1 welcome reception',
      },
      {
        type: 'p',
        text: 'Founders from Lagos. Executives from London. Creative directors from Johannesburg. Investors from New York. All gathered on one terrace, in one of the world\'s finest hotels, at the beginning of seven days that would change how they saw their work, their networks, and themselves.',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_31.JPG', alt: 'The cohort arrives · Day 1' },
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_32.JPG', alt: 'First connections at the welcome reception' },
        ],
      },
      {
        type: 'pull',
        text: 'This wasn\'t a networking reception with name tags and canapés. This was the opening moment, the first breath of The Elevation.',
      },
      {
        type: 'p',
        text: 'The evening unfolded in two movements. The cocktail hour was the introduction, not the forced kind, but the natural kind that happens when a room has been curated with intention. No stage. No microphone. Just the light off the water and the understanding that everyone here had earned their place.',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_40.JPG', alt: 'Conversations at the cocktail hour' },
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_41.JPG', alt: 'Leaders connecting at The Oberoi' },
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_42.JPG', alt: 'The Elevation cohort beginning to form' },
        ],
      },
      {
        type: 'p',
        text: 'The opening ceremony followed, a moment of collective intention that set the spirit of the week. Not a programme item. A statement of purpose. By the time the beach barbecue began as night settled in, the cohort had already started to form the bonds that the rest of the week was designed to deepen.',
      },
      {
        type: 'img',
        src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_50.JPG',
        alt: 'Beach barbecue under the stars at The Oberoi',
        caption: 'The Elevation begins · beach barbecue, The Oberoi',
      },
      {
        type: 'p',
        text: 'By the end of the evening, cards had stayed in pockets. Names had been learned properly. The week had begun, not with an agenda, but with a feeling. This was Mauritius. This was The Elevation. And for those who were there, the only question by the end of that first night was: how do I make sure I\'m here next year?',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_60.JPG', alt: 'The cohort after the welcome barbecue' },
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_61.JPG', alt: 'Night one in Mauritius · The Elevation begins' },
        ],
      },
      {
        type: 'venue',
        name: 'The Oberoi, Mauritius',
        body: 'Nestled on the northwest coast of Mauritius, The Oberoi is consistently ranked among the finest luxury resort properties in the Indian Ocean. A partner to the Atinuda Elevation Retreat 2026, The Oberoi served as home base for the cohort throughout the week, providing the space, service, and setting that a gathering of this calibre demands.',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_74.JPG', alt: 'The Oberoi, Mauritius · beachfront' },
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_75.JPG', alt: 'The beachfront at The Oberoi' },
          { src: '/assets/images/Mauritius/FirstLight/ATINUDA6_DAY1_76.JPG', alt: 'The Elevation Retreat 2026 · first evening' },
        ],
      },
    ],
  },

  // ── DAY 2 ──────────────────────────────────────────────────────────────────
  {
    slug: 'day-2-rise-within',
    day: 2,
    date: 'March 9, 2026',
    title: 'Rise Within',
    subtitle: 'When Rest Becomes the Most Radical Act',
    excerpt:
      'The most radical act for an ambitious person is to stop. Day 2 was built around one disruptive idea: that restoration is not indulgence, it is infrastructure.',
    primaryVenue: 'LUX* Belle Mare',
    tag: 'Wellness',
    heroImageAlt: 'Morning wellness session on the shores of the Indian Ocean',
    heroImageSrc: '/assets/images/Retreat/Within/ATINUDA6_DAY2_5.JPG',
    content: [
      {
        type: 'p',
        text: 'The most radical act for an ambitious person is to stop. Day 2 of the Atinuda Elevation was built around a single, disruptive idea: that the leaders who will shape the next decade are not those who push hardest, they are those who understand that restoration is not indulgence. It is infrastructure.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_10.JPG',
        alt: 'Morning wellness session on the beach at sunrise',
        caption: 'Day 2 opens, morning practices on the shores of Mauritius',
      },
      {
        type: 'p',
        text: 'The day opened with guided morning practices along the shores of the Indian Ocean. Movement. Breathwork. The kind of communal breakfast that slows time deliberately, where conversations happen unhurried and the agenda is simply: be here.',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_15.JPG', alt: 'Morning gathering by the water, Day 2' },
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_16.JPG', alt: 'The cohort begins the day together' },
        ],
      },
      {
        type: 'p',
        text: 'By mid-morning, the cohort split into two paths: those who chose the open sea, and those who chose stillness.',
      },
      {
        type: 'h3',
        text: 'The Open Sea',
      },
      {
        type: 'p',
        text: 'A private catamaran charter took one group out into the Indian Ocean, past the reef, into open water where the horizon is everything and the city feels genuinely far away. Snorkelling. Dolphins. Lunch on the deck. The kind of afternoon that resets something at the cellular level.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_25.JPG',
        alt: 'Private catamaran on the Indian Ocean, Mauritius',
        caption: 'Open water, Day 2 catamaran experience',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_28.JPG', alt: 'On the catamaran, Indian Ocean' },
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_29.JPG', alt: 'Delegates at sea, Day 2' },
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_30.JPG', alt: 'Lunch on deck, open water' },
        ],
      },
      {
        type: 'h3',
        text: 'The Stillness',
      },
      {
        type: 'p',
        text: 'The other group chose LUX* Belle Mare, a full spa immersion at one of Mauritius\'s most celebrated resort properties. Treatments designed for depth, not luxury ticking-of-boxes. The kind of stillness that senior leaders rarely permit themselves.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_37.JPG',
        alt: 'Spa immersion at LUX* Belle Mare',
        caption: 'LUX* Belle Mare, the stillness path',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_40.JPG', alt: 'LUX* Belle Mare, afternoon stillness' },
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_42.JPG', alt: 'Restoration at LUX* Belle Mare' },
        ],
      },
      {
        type: 'venue',
        name: 'LUX* Belle Mare',
        body: 'Set on one of Mauritius\'s most pristine beaches, LUX* Belle Mare is a world-class resort that combines exceptional design with genuine warmth. A long-standing benchmark for Indian Ocean hospitality, LUX* partnered with Atinuda to host both the wellness day and the chef\'s tasting dinner, creating a Day 2 that represented the very best of what Mauritius can offer.',
      },
      {
        type: 'pull',
        text: 'Both paths converged that evening at a chef\'s tasting dinner that moved through the flavours of the island like a conversation, unhurried, intentional, every dish a reason to linger.',
      },
      {
        type: 'p',
        text: 'The multi-course dinner brought the cohort back together around tables set for intimacy. The sea was audible. The wine was chosen for this evening specifically. And the conversations that continued from the previous night found new depth, people who had been strangers 24 hours ago were now comparing notes on what they\'d experienced, and what they were beginning to understand about themselves.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_46.JPG',
        alt: "Chef's tasting dinner table setup at LUX* Belle Mare",
        caption: "Chef's tasting dinner, LUX* Belle Mare",
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_47.JPG', alt: 'Dinner conversation, LUX* Belle Mare' },
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_48.JPG', alt: 'The cohort at dinner, Day 2 evening' },
          { src: '/assets/images/Retreat/Within/ATINUDA6_DAY2_49.JPG', alt: 'Closing the evening at LUX* Belle Mare' },
        ],
      },
      {
        type: 'p',
        text: 'By the end of Day 2, delegates had already begun to understand something important about The Elevation: it doesn\'t just build leaders. It restores them. And there is nothing more valuable, to a team, to a company, to a vision, than a leader who has been genuinely restored.',
      },
    ],
  },

  // ── DAY 3 ──────────────────────────────────────────────────────────────────
  {
    slug: 'day-3-rise-together',
    day: 3,
    date: 'March 10, 2026',
    title: 'Rise Together',
    subtitle: 'The Room Comes Alive, and Then Divides for Dinner',
    excerpt:
      'Keynotes that challenged everything, leadership panels that ran long because no one wanted to stop, and an evening where four restaurants hosted one conversation.',
    primaryVenue: 'The Oberoi & Four Partner Restaurants',
    tag: 'Summit',
    heroImageAlt: 'Opening keynote session at The Oberoi conference space',
    heroImageSrc: '/assets/images/Retreat/Together/ATINUDA6_DAY3_8.JPG',
    content: [
      {
        type: 'p',
        text: 'The first full day of programming brought everything The Elevation had promised, and the energy only a room that has already spent 48 hours together can generate. The awkwardness was gone. The posturing was gone. What remained was honesty, and the particular kind of engagement that comes when people have earned each other\'s trust.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_3.JPG',
        alt: 'Opening keynote session in full flow at The Oberoi',
        caption: 'Day 3, opening session, The Oberoi',
      },
      {
        type: 'p',
        text: 'Morning keynotes opened the retreat with the kind of ideas that challenge how you think about leadership, ambition, and what Africa means to the global conversation, not as an emerging market waiting to be discovered, but as the most consequential story of the next fifty years.',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_10.JPG', alt: 'Keynote speaker on stage, Day 3' },
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_12.JPG', alt: 'The cohort listening, fully engaged' },
        ],
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_17.JPG',
        alt: 'Leadership panel discussion with multiple speakers on stage',
        caption: 'Leadership panel, Day 3 morning sessions',
      },
      {
        type: 'p',
        text: 'The leadership panels that followed turned the room into a live case study. Speakers who hold genuine institutional authority shared what they wouldn\'t say on a conference stage, because this wasn\'t a conference. Speed connections created in three-minute windows what some people spend years building. Executive office hours gave delegates direct access to the voices in the room, off the record and without an audience.',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_20.JPG', alt: 'Speed connections in motion' },
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_22.JPG', alt: 'Delegates forging connections' },
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_24.JPG', alt: 'Executive office hours, Day 3' },
        ],
      },
      {
        type: 'pull',
        text: 'Rather than one large dinner, a ballroom, a microphone, and the noise that comes with scale, the cohort was divided into four intimate groups. A deliberate act of curation. A masterclass in how to design connection.',
      },
      {
        type: 'p',
        text: 'As evening arrived, Atinuda made a design choice that defined the week: no gala, no plated conference dinner, no speeches. Instead, four restaurants. Four circles of eight to twelve. Four conversations happening simultaneously across the island of Mauritius.',
      },
      {
        type: 'venue',
        name: 'Inti Grand Baie',
        body: 'Mauritius\'s celebrated Peruvian-Japanese fusion restaurant in the heart of Grand Baie. Around tables of eight, founders and executives found that the best business conversations happen when the food demands your attention and the setting makes everyone equal. Collaborations that couldn\'t have been imagined 48 hours earlier were already forming.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_32.JPG',
        alt: 'Intimate group dinner at Inti Grand Baie restaurant',
        caption: 'Inti Grand Baie, Group 1',
      },
      {
        type: 'venue',
        name: 'Sauturelle',
        body: 'Set within a celebrated garden setting, Sauturelle is one of Mauritius\'s finest dining experiences, intimate, considered, and entirely removed from the noise of the ordinary. The group that dined here discovered that the most valuable business conversations happen when the setting strips away hierarchy and leaves only the ideas.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_38.JPG',
        alt: 'Evening dinner at Sauturelle garden restaurant',
        caption: 'Sauturelle, Group 2',
      },
      {
        type: 'venue',
        name: 'Park25',
        body: 'The rooftop dining experience at Park25 offered a view of the island, and the kind of elevation that makes ambition feel proportionate to the sky. A focused gathering of leaders, removed from the machinery of their daily environments, building the kind of relationships that don\'t require a follow-up email to feel real.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_43.JPG',
        alt: 'Rooftop dinner at Park25 with Mauritius skyline',
        caption: 'Park25, Group 3',
      },
      {
        type: 'venue',
        name: 'Pescatore',
        body: 'For those at Pescatore, the evening ended with the simplicity of an island at night, open air, fresh seafood from the waters they\'d sailed that day, and the electricity of a table where every person has decided that ambition is not optional. Deals weren\'t pitched here. They were born.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_47.JPG',
        alt: 'Dinner at Pescatore restaurant, open air waterfront setting',
        caption: 'Pescatore, Group 4',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_49.JPG', alt: 'Evening atmosphere, Day 3 dinner' },
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_50.JPG', alt: 'The cohort at the restaurant evenings' },
          { src: '/assets/images/Retreat/Together/ATINUDA6_DAY3_51.JPG', alt: 'Night three in Mauritius, the community deepens' },
        ],
      },
      {
        type: 'p',
        text: 'By the end of the evening, four conversations had deepened in ways that a single conference dinner never could. The Atinuda Elevation had achieved in three days what most organisations spend years trying to engineer: a genuinely connected room.',
      },
    ],
  },

  // ── DAY 4 ──────────────────────────────────────────────────────────────────
  {
    slug: 'day-4-rise-in-skill',
    day: 4,
    date: 'March 11, 2026',
    title: 'Rise in Skill',
    subtitle: 'The Summit Deepens, and Africa Comes to the Table',
    excerpt:
      'The second summit day opened with the kind of energy only a cohort who already knows each other can generate. Workshop tracks ran in parallel. The Strategy Hot Seat pulled no punches. And the evening belonged to Africa.',
    primaryVenue: 'The Oberoi & African Paradise, Bel Ombre',
    tag: 'Summit',
    heroImageAlt: 'Summit session in full flow, packed room at The Oberoi',
    heroImageSrc: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_415.JPG',
    content: [
      {
        type: 'p',
        text: 'If Day 3 established the community, Day 4 put it to work. The second day of summit sessions opened with an energy that only builds when a cohort has already spent 72 hours together. The hesitation was gone. What remained was the willingness to engage with ideas at full depth, to disagree publicly, to ask the uncomfortable question, to say the thing that usually stays unsaid in professional settings.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_406.JPG',
        alt: 'Summit session, engaged audience at The Oberoi conference space',
        caption: 'Day 4 opens, the second summit day',
      },
      {
        type: 'p',
        text: 'Workshop tracks ran in parallel across the morning and afternoon: business strategy and growth, personal finance and wealth architecture, technology and AI in the African context, and events and experience design. Delegates chose their track and committed, a full half-day of deep immersion with facilitators who brought both theory and the particular authority of lived experience.',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_420.JPG', alt: 'Workshop track in session, deep dive learning' },
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_423.JPG', alt: 'Small group workshop, Day 4' },
        ],
      },
      {
        type: 'h3',
        text: 'The Strategy Hot Seat',
      },
      {
        type: 'p',
        text: 'One founder. One challenge. A room of peers who have seen enough to know exactly which questions to ask, and enough integrity to ask them honestly. The Strategy Hot Seat is one of the most demanding and most valuable hours of the entire week. No softening. No politeness. Just the kind of rigorous, caring interrogation that a paid advisor can\'t provide and a friend won\'t.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_432.JPG',
        alt: 'Strategy Hot Seat, founder at the front, cohort engaged',
        caption: 'The Strategy Hot Seat, Day 4',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_436.JPG', alt: 'The cohort in focus, Strategy Hot Seat' },
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_438.JPG', alt: 'Peer interrogation in session' },
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_440.JPG', alt: 'Candid moment, Day 4 sessions' },
        ],
      },
      {
        type: 'pull',
        text: 'The evening that followed was not just a dinner. It was a declaration.',
      },
      {
        type: 'h3',
        text: 'Dinner at African Paradise, Bel Ombre',
      },
      {
        type: 'p',
        text: 'There are restaurants that serve food. And there are restaurants that tell a story. African Paradise at Bel Ombre is the latter. Set within the grounds of one of Mauritius\'s most historic estate properties in the island\'s south, the evening was a deliberate celebration, of the continent these leaders come from, the heritage they carry, and the ambition that defines what they are building.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_445.JPG',
        alt: 'African Paradise restaurant at Bel Ombre at night, lit beautifully',
        caption: 'African Paradise, Bel Ombre, Day 4 evening',
      },
      {
        type: 'p',
        text: 'The menu honoured the continent. The décor held its history. The cohort, dressed and present after a day of serious work, understood precisely what this moment meant. It was the kind of evening that reminds you why you build, not just for markets and multiples, but for something that outlasts the quarter.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_450.JPG',
        alt: 'Elevation Mini Awards ceremony, recognition and celebration',
        caption: 'The Elevation Mini Awards, Day 4',
      },
      {
        type: 'p',
        text: 'The Elevation Mini Awards closed the evening, a recognition designed not for achievement alone, but for character. The cohort nominated. The cohort voted. The result was a room that celebrated each other, loudly, and meant every word of it.',
      },
      {
        type: 'venue',
        name: 'African Paradise, Bel Ombre',
        body: 'Located within the historic Bel Ombre estate on Mauritius\'s southern coast, African Paradise is one of the island\'s most distinctive dining experiences, a restaurant that draws directly from the richness of African culinary heritage and translates it with sophistication. For a cohort of African and diaspora leaders, it was the most fitting possible setting for the week\'s mid-point celebration.',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_454.JPG', alt: 'Full cohort at dinner, African Paradise' },
          { src: '/assets/images/Retreat/Skill/ATINUDA6_DAY4_457.JPG', alt: 'The 2026 cohort at African Paradise, animated' },
        ],
      },
    ],
  },

  // ── DAY 5 ──────────────────────────────────────────────────────────────────
  {
    slug: 'day-5-rise-in-creativity',
    day: 5,
    date: 'March 12, 2026',
    title: 'Rise in Creativity',
    subtitle: 'When the Room Makes Culture',
    excerpt:
      'The creative summit brought together brand architects, culture-makers, and the founders building companies that lead with aesthetics. What followed was the deepest day of the week.',
    primaryVenue: 'The Oberoi, Mauritius',
    tag: 'Creative',
    heroImageAlt: 'Creative summit session, animated room with speakers and audience',
    heroImageSrc: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_645.JPG',
    content: [
      {
        type: 'p',
        text: 'There is a room that understands creativity is not decoration, it is strategy. Day 5 of the Atinuda Elevation belonged entirely to that room.',
      },
      {
        type: 'p',
        text: 'The second day of workshop sessions leaned into the creative economy: brand architecture, culture-making, experience design, and the particular business case for aesthetic leadership. Tracks for creative directors, brand strategists, and founders building culture-forward companies filled the morning with the kind of depth that can only happen when the people in the conversation have real stakes in the outcome.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_629.JPG',
        alt: 'Creative summit main session, full room engagement',
        caption: 'Day 5, the creative summit opens',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_634.JPG', alt: 'Creative session in motion, Day 5' },
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_637.JPG', alt: 'Engaged delegates, creative summit' },
        ],
      },
      {
        type: 'p',
        text: 'Branding panels dissected how Africa\'s most distinctive companies have built global recognisability without losing cultural specificity, and what every founder in the room could take directly into their own work. The standard of conversation was measurably elevated by the fact that no one in the room needed the basics explained.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_643.JPG',
        alt: 'Branding panel, speakers in discussion on stage',
        caption: 'The branding panel, Day 5',
      },
      {
        type: 'h3',
        text: 'Experience Design Labs',
      },
      {
        type: 'p',
        text: 'The afternoon pushed beyond theory. Delegates worked in small teams, the same circles they\'d eaten dinner with, sailed with, and built trust with over four days, to respond to a live brief. A real challenge. The kind of collaborative pressure that reveals how people think, how they lead under uncertainty, and what they are genuinely capable of when the stakes are real.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_652.JPG',
        alt: 'Experience design lab, teams working intensively around tables',
        caption: 'Experience design labs, Day 5 afternoon',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_657.JPG', alt: 'Team collaboration, design challenge' },
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_660.JPG', alt: 'Working through the brief, Day 5' },
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_663.JPG', alt: 'Team presentation, design challenge finale' },
        ],
      },
      {
        type: 'pull',
        text: 'The table was louder that evening. The laughter came easier. The plans made over dinner were real ones, with names attached, timelines agreed, and the particular credibility that only comes from having worked together.',
      },
      {
        type: 'p',
        text: 'The connection dinner that closed Day 5 had a different quality from the restaurant nights that preceded it. The cohort had found its rhythm. They were no longer strangers discovering common ground, they were a community that had worked together, built something together, and understood each other\'s ambitions at a level that most professional relationships never reach.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_669.JPG',
        alt: 'Connection dinner, the cohort around long tables, animated and close',
        caption: 'The connection dinner, Day 5 evening',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_674.JPG', alt: 'Evening atmosphere, Day 5 dinner' },
          { src: '/assets/images/Retreat/Creativity/ATINUDA6_DAY5_678.JPG', alt: 'The cohort at the close of Day 5' },
        ],
      },
      {
        type: 'p',
        text: 'For any brand that was part of the Elevation experience this week, visible in this room, in this conversation, Day 5 was the clearest possible demonstration of what that partnership means. This is not an audience. This is a community. And communities remember who was in the room with them.',
      },
    ],
  },

  // ── DAY 6 ──────────────────────────────────────────────────────────────────
  {
    slug: 'day-6-island-and-gala',
    day: 6,
    date: 'March 13, 2026',
    title: 'The Island & The Gala',
    subtitle: 'A Final Chapter Written in Two Acts',
    excerpt:
      'The last full day of the Elevation Retreat gave the morning to the island and the evening to something that will not be forgotten. The Gala at Château de Labourdonnais was the night that defined the week.',
    primaryVenue: 'Casela · Valle de Ferney · Château de Labourdonnais',
    tag: 'Gala',
    heroImageAlt: 'Château de Labourdonnais lit up at night, vineyards in the foreground',
    heroImageSrc: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_28.JPG',
    content: [
      {
        type: 'p',
        text: 'The final full day of the Atinuda Elevation Retreat 2026 was designed with the precision of a closing chapter: give the morning to the island, give the afternoon to perspective, and give the evening to a night that the cohort would carry with them for years.',
      },
      {
        type: 'h3',
        text: 'The Island Experiences',
      },
      {
        type: 'p',
        text: 'By Day 6, delegates knew Mauritius from the inside of conference rooms and restaurants. The morning of Day 6 gave them the island itself, its wildlife, its forests, its craft, and its deep cultural memory.',
      },
      {
        type: 'venue',
        name: 'Casela Nature Parks',
        body: 'One of Mauritius\'s most extraordinary natural experiences, an encounter with the island\'s wildlife in the company of people who have spent the week becoming genuinely close. Lions. Zip lines. The silence of being in nature with people you trust. Casela gave the cohort the kind of morning that recalibrates what matters.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_3.JPG',
        alt: 'Casela Nature Parks, delegates experiencing the wildlife encounter',
        caption: 'Casela Nature Parks, Day 6 morning',
      },
      {
        type: 'venue',
        name: 'Valle de Ferney',
        body: 'A walk through endemic Mauritian forest, past species that exist nowhere else on earth. Valle de Ferney offered a different kind of beauty, slower, older, and entirely outside the world of strategy and ambition. The kind of perspective that a morning in a boardroom can never provide.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_8.JPG',
        alt: 'Valle de Ferney, walking through endemic forest, dappled light',
        caption: 'Valle de Ferney, endemic forest walk',
      },
      {
        type: 'h3',
        text: 'Rum & Pottery',
      },
      {
        type: 'p',
        text: 'At the island\'s craft studios and historic distilleries, delegates made things with their hands, a deliberately counterpoint to a week spent making things with their minds. The tactile pleasure of Mauritian pottery. The heritage and precision of the island\'s legendary rum. A morning that reminded every person in that room that mastery takes many forms.',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_14.JPG', alt: 'Pottery studio session, hands shaping clay' },
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_17.JPG', alt: 'Rum heritage experience, Mauritius distillery' },
        ],
      },
      {
        type: 'pull',
        text: 'As the sun moved toward the horizon, the island handed the evening back to Atinuda. And Atinuda handed it to Château de Labourdonnais.',
      },
      {
        type: 'h3',
        text: 'The Elevation Gala',
      },
      {
        type: 'p',
        text: 'There are evenings that exist entirely in their own category. The Elevation Gala at Château de Labourdonnais was one of them.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_22.JPG',
        alt: 'Château de Labourdonnais at night, lit grounds, vineyards visible',
        caption: 'Château de Labourdonnais, The Elevation Gala 2026',
      },
      {
        type: 'p',
        text: 'Held at one of Mauritius\'s most celebrated colonial estates, a château that has stood for over two centuries, surrounded by vineyards in the island\'s north, the black-tie dinner was the pinnacle of a week that had already exceeded every expectation. The estate\'s own wine was poured. The table settings were designed for this evening. The room was exactly the room it needed to be.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_31.JPG',
        alt: 'Gala dinner table setting, candlelight, flowers, crystal, dark elegance',
        caption: 'The Gala table, Château de Labourdonnais',
      },
      {
        type: 'grid',
        cols: 3,
        images: [
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_35.JPG', alt: 'The cohort at the Gala, dressed and present' },
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_37.JPG', alt: 'Gala evening atmosphere, Château de Labourdonnais' },
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_39.JPG', alt: 'The room in full celebration' },
        ],
      },
      {
        type: 'p',
        text: 'For the sponsors and partners whose brands were woven into the Elevation experience, present in the most exclusive context their industry would encounter all year, the Gala was the fullest expression of what that partnership means. This was not a hospitality opportunity. It was a position: inside a room of decision-makers who remember who showed up for them.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_42.JPG',
        alt: 'Elevation Awards ceremony, delegate receiving recognition on stage',
        caption: 'The Elevation Awards 2026',
      },
      {
        type: 'p',
        text: 'The Elevation Awards recognised not achievements catalogued on CVs, but the quality of presence, generosity, and leadership that the cohort had witnessed in each other over six days. Each recipient was chosen by the room itself. Each award was given with a weight that only a community can confer.',
      },
      {
        type: 'img',
        src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_46.JPG',
        alt: 'Full cohort photograph at the Gala, dressed, luminous, together',
        caption: 'The Elevation 2026 cohort, Château de Labourdonnais',
      },
      {
        type: 'p',
        text: 'The music played. The wine was from the château\'s own vineyards. And somewhere between the first course and the last dance, the 2026 Atinuda Elevation cohort made the quiet, collective decision that distinguishes a great event from a transformative one: they decided to come back.',
      },
      {
        type: 'venue',
        name: 'Château de Labourdonnais',
        body: 'Established in 1814, Château de Labourdonnais is one of Mauritius\'s most iconic historic estates, a working vineyard, heritage property, and world-class venue set in the island\'s north. Hosting the Elevation Gala at Labourdonnais was not a location choice. It was a statement about the standard this community holds itself to.',
      },
      {
        type: 'grid',
        cols: 2,
        images: [
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_48.JPG', alt: 'Vineyard at Château de Labourdonnais, golden light' },
          { src: '/assets/images/Retreat/Finale/ATINUDA6_DAY6_50.JPG', alt: 'The Elevation 2026, final night in Mauritius' },
        ],
      },
    ],
  },
];

export const totalEvents = retreatEvents.length;
