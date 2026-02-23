'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

type Workshop = {
  track: string;
  topic: string;
  speaker: string;
  image: string;
  description: string;
  takeaways: string[];
};

type SessionBlock = {
  id: string;
  label: string;
  heading: string;
  workshops: Workshop[];
};

const sessionBlocks: SessionBlock[] = [
  {
    id: 'day4-round1',
    label: 'Day 4 - Session One',
    heading: 'Day 4 | Parallel Workshops - Round One',
    workshops: [
      {
        track: 'Design',
        topic: 'The Business & Currency of Creativity',
        speaker: 'David Stark',
        image: '/assets/images/speakers/David.jpg',
        description:
          'Global brands do not simply look good; they are legible. Their creative language travels across cultures, categories, and markets without losing meaning. This session explores the commercial role of creativity in international positioning: how design creates trust at first glance, earns premium pricing, and becomes a recognisable signature that partners, press and clients can identify anywhere in the world.',
        takeaways: [
          'Brand codes that travel: globally legible identity without dilution',
          'Recognition assets that compound: signature motifs, materials, experience grammar',
          'Pricing power in new markets: signals of credibility, craft, restraint, consistency',
          'Presenting creative value to international rooms: proof, narrative, selective visibility',
        ],
      },
      
      {
        track: 'AI & Tech',
        topic: 'Digital Transformation in Practice',
        speaker: 'Justin Irabor',
        image: '/assets/images/speakers/Justin.jpeg',
        description:
          'Technology is most powerful when it is almost invisible. It should remove friction, protect discretion, and make excellence feel effortless, especially at scale. This session explores digital transformation as credibility infrastructure: the systems and operating rhythm that allow a brand to deliver consistently across borders, personalise with taste, and modernise without losing its human signature.',
        takeaways: [
          'Export-ready operations: standards, documentation, service rhythm',
          'AI as quiet advantage: speed, precision, personalisation with discretion',
          'Transformation scorecard: efficiency, quality, risk, experience impact',
          'Digital restraint: what premium brands automate and what they never do',
        ],
      },


      {
        track: 'Leadership',
        topic: 'Emotional Intelligence as Your Leadership Superpower',
        speaker: 'Simon Alexander',
        image: '/assets/images/speakers/Simon.JPG',
        description:
          'In global rooms, authority is often subtle. It is carried in pace, tone, composure, and in the ability to hold tension without making it louder. This session explores emotional intelligence as reputational capital: how trust is built quickly, how conflict is handled cleanly, and how influence is sustained across complex stakeholder relationships where perception matters as much as performance.',
        takeaways: [
          'Authority that travels: presence, pace, language in global rooms',
          'High-trust relationship building: cultural intelligence, stakeholder nuance',
          'Pressure moments and reputation: composure under scrutiny',
          'Partnership leadership: expectations, boundaries, repair without drama',
        ],
      },

      {
        track: 'Master Workshop',
        topic: 'Strategic Choice Architecture - The Iconic Aesthetic: Building a Visual Empire (Practical Workshop)',
        speaker: 'Mai Atafo',
        image: '/assets/images/speakers/Mai.jpeg',
        description:
        'Iconic brands are recognisable before they are read. In this practical workshop, you will build a visual system that makes your work instantly legible: a signature aesthetic, a repeatable design language, and clear rules that keep quality consistent across every touchpoint. You will translate taste into structure—so your visuals stop feeling “randomly beautiful” and start functioning like an empire: coherent, scalable, and unmistakably yours.',
        takeaways: [
        'Aesthetic DNA map: define your signature elements (palette, type, shapes, textures, composition rules) and what they signal',
        'Empire-ready visual system: create brand rules that scale across web, decks, social, packaging, and environments without dilution',
        'Content architecture: build repeatable templates and a “visual series” format that compounds recognition over time',
        'Quality control toolkit: set standards, checklists, and a review process that protects the look as teams and vendors grow',
        ],
      }

    ],
  },
  {
    id: 'day4-round2',
    label: 'Day 4 - Session Two',
    heading: 'Day 4 | Parallel Workshops - Round Two',
    workshops: [
      

      {
        track: 'Strategy',
        topic: 'High-Impact Negotiation & Deal-Making',
        speaker: 'Gideon Hermosa',
        image: '/assets/images/speakers/Gideon.jpg',
        description:
          'The strongest deals feel calm because they are structured. They protect value, reduce future friction, and elevate reputation through the right affiliations. This session explores negotiation as brand protection: how terms, governance, and clarity create power that lasts beyond the closing moment, especially in cross-border partnerships where misalignment is expensive.',
        takeaways: [
          'Partnerships that elevate: affiliation logic and brand adjacency',
          'Brand equity protection in contracts: usage, approvals, exclusivity, reputation clauses',
          'Deal structure that holds: governance, decision rights, performance terms, exits',
          'Elegant refusal: saying no without closing future access',
        ],
      },

      {
        track: 'Wellness / Sustainability & Health',
        topic: 'Longevity Thinking',
        speaker: 'Queen',
        image: '/assets/images/speakers/Queen.jpeg',
        description:
          'Longevity is not a trend; it is the quiet discipline behind sustained excellence. It shows up in your energy, your clarity, and your capacity to travel, deliver, recover, and return with the same standard intact. This session reframes wellbeing as performance infrastructure: how to protect your pace, reduce invisible strain, and build resilience that supports high-demand seasons without asking you to slow your ambition.',
        takeaways: [
          'Travel-proof performance: energy, sleep, recovery under movement',
          'Sustainable excellence: resilience without visible strain',
          'Cognitive clarity under demand: fatigue reduction, decision hygiene',
          'Longevity strategy that is sustainable: habits built daily',
        ],
      },
    
      {
        track: 'Personal Finance & Wealth',
        topic: 'Building Generational Legacy',
        speaker: 'Stanley C',
        image: '/assets/images/speakers/Stanley.jpeg',
        description:
          'Legacy is built deliberately, not accidentally. It is the outcome of structure, protection, and decisions that keep working long after the moment has passed. This session frames wealth as long-term power: optionality, stability, and the ability to invest in opportunity, reputation, and continuity without strain. It is about building a life and a lineage that can hold success with grace.',
        takeaways: [
          'Optionality as advantage: liquidity, buffers, freedom of movement',
          'Protection architecture: risk, safeguards, continuity planning',
          'Generational clarity: transfer, governance, responsible stewardship',
          'Wealth aligned with reputation: stability that supports stature',
        ],
      },

      {
        track: 'The Reputation Playbook',
        topic: 'Design/Luxury - Luxury & Client Experience Design: Strategic Frameworks for Building Trust, Credibility, and Opportunity',
        speaker: 'Sophie Masipa',
        image: '/assets/images/speakers/Sophie.jpeg',
        description:
          'This session gives you practical frameworks for becoming “low-risk, high-trust” in the eyes of clients, partners, investors, press, and institutions so opportunity finds you, and doors open faster. You’ll learn how to translate competence into credibility signals, how to reduce perceived risk with proof and process, and how to build a defensible public narrative that compounds over time.',
        takeaways: [
          'Trust mechanics: the few signals that consistently convert sceptics into believers (proof, process, proximity, performance).',
          'Credibility assets: how to build a “reputation stack” (case studies, third-party validation, credentials, media, references) that sells before you speak.',
          'Risk reversal frameworks: contracts, guarantees, governance, and communication rhythms that reduce friction and accelerate yeses.',
          'Opportunity design: turning reputation into a pipeline of referrals, partnerships, premium pricing, and inbound demand through consistent positioning.',
        ],
      },
    ],
  },
  {
    id: 'day5-round1',
    label: 'Day 5 - Session One',
    heading: 'Day 5 | Parallel Workshops - Round One',
    workshops: [
      {
        track: 'Strategy',
        topic: 'Scaling Smart',
        speaker: 'Lady Dentaa Amoateng',
        image: '/assets/images/speakers/LD.jpeg',
        description:
          'Scaling is where many brands lose their magic. What was once rare becomes routine; what was once precise becomes inconsistent; what was once premium starts to feel mass. This session explores scaling as refinement: building capacity without dilution, expanding without noise, and creating systems that protect quality as the brand moves into bigger rooms, new markets, and broader demand.',
        takeaways: [
          'Scale without dilution: protecting standard, tone, brand feel',
          'International delivery readiness: partners, QA, consistency controls',
          'Reputation-sensitive growth: avoiding failures that damage trust in new markets',
          'Growth that compounds brand equity: expansion with coherence',
        ],
      },

      {
        track: 'AI & Strategy',
        topic: 'The Future-Proof Enterprise',
        speaker: 'Sega',
        image: '/assets/images/speakers/Sega.jpeg',
        description:
          'The future belongs to brands that can adapt without losing themselves. This session explores future-proofing as a discipline: building agility into operations, strengthening decision-making with intelligence, and using AI to create leverage without turning the business into a laboratory. The focus is readiness so you can move with the market and still keep your standard intact.',
        takeaways: [
          'Competitive readiness: agility without identity loss',
          'AI for executive leverage: insight, speed, precision in decisions',
          'A 6-12 month evolution map: priorities, sequencing, adoption rhythm',
          'Protecting the premium: trust, discretion, quality as non-negotiables',
        ],
      },

      {
        track: 'Leadership',
        topic: 'Embodied Leadership & Inner Resilience',
        speaker: 'Anita Erskine',
        image: '/assets/images/speakers/Anita.jpg',
        description:
          'Presence is not performance; it is stamina, clarity, and self-possession. In high-visibility environments, people read your nervous system before they read your resume. This session explores the internal foundations of leadership that holds: resilience under scrutiny, boundaries without hardness, and a steadiness that makes others feel safe, confident, and willing to follow.',
        takeaways: [
          'Steadiness under pressure: composure, pacing, clarity in demanding rooms',
          'Recovery as leadership: resetting without withdrawal or collapse',
          'Boundaries with elegance: access, expectations, energy protection',
          'Resilience that sustains visibility: consistency across heavy seasons',
        ],
      },
      {
        track: 'Masterworkshop',
        topic: 'Building Your Signature Style',
        speaker: 'Gideon Hermosa',
        image: '/assets/images/speakers/Gideon.jpg',
        description:
          'Signature style is not about fashion; it is about recognition. The most memorable presence is coherent, repeatable, intentional, and quietly distinctive. This masterworkshop explores style as personal branding: how to refine your codes, build visual consistency across settings, and create an aesthetic that looks like you before you even speak.',
        takeaways: [
          'Personal style codes: silhouette, palette, texture, signature details',
          'Consistency across contexts: boardroom, travel, camera, evening',
          'Dressing as positioning: taste cues that read premium globally',
          'Wardrobe strategy that holds: edit, repeatability, effortless polish',
        ],
      },

      {
        track: 'Global Expansions and Networking',
        topic: 'MasterWorkshop - The Iconic Aesthetic: Building Strategic Relationships Across Borders',
        speaker: 'Kamil Olufowobi',
        image: '/assets/images/speakers/kamil.webp',
        description:
        'Global growth is rarely blocked by talent—it is blocked by access. This session breaks down how cross-border opportunities actually move: through trust, warm pathways, and value-led relationships that compound over time. You will learn how to position yourself to be “safely introducible”, how to build a network that spans markets without feeling transactional, and how to convert conversations into partnerships, distribution, and international credibility.',
        takeaways: [
        'Cross-border positioning: clarify what you’re known for, who you’re for, and the specific value you export into new markets',
        'Network architecture: map the three relationship tiers that unlock growth (gatekeepers, validators, and deal-makers) and how to reach each',
        'Warm-intro playbooks: outreach scripts, follow-up rhythms, and “give-first” assets that make people want to connect you',
        'Partnership conversion: how to move from conversation to collaboration—clear asks, deal frames, and next steps that close',
        ],
      }


      // {
      //   track: 'Design / Luxury',
      //   topic: 'Luxury & Client Experience Design',
      //   speaker: 'Eleanor Wren',
      //   image: '/assets/images/MichaelWard.png',
      //   description:
      //     'Luxury is not the price; it is the feeling that stays. The best brands create trust through detail, and loyalty through consistency, so every touchpoint quietly confirms value. This workshop explores experience as choreography: anticipation, welcome, service rhythm, discretion, and recovery when things go wrong. The goal is a client journey that reads premium anywhere in the world.',
      //   takeaways: [
      //     'Premium experience signals: universal markers that read as luxury globally',
      //     'Signature moments that travel: loyalty, referrals, press-worthiness',
      //     'Consistency at scale: standards across teams, partners, locations',
      //     'Discretion and personalisation: intimacy without intrusion',
      //   ],
      // },
      
    ],
  },
  {
    id: 'day5-round2',
    label: 'Day 5 - Session Two',
    heading: 'Day 5 | Parallel Workshops - Round Two',
    workshops: [
      {
        track: 'Strategy',
        topic: 'Making Clear Choices for Focus, Alignment & Momentum',
        speaker: 'Charles O Tudor',
        image: '/assets/images/speakers/Charles.jpeg',
        description:
          'The most respected brands are not built on endless activity; they are built on intelligent restraint. They know what they stand for, where they compete, and what they refuse to be. This session examines the architecture behind strategic clarity: the decisions that make a brand easy to place, easy to recommend, and difficult to replace as it moves into new markets.',
        takeaways: [
          'Global positioning clarity: one story that holds across markets',
          'Market-entry selectivity: where to play, and why it matters',
          'Trade-offs that protect brand equity: growth without dilution',
          'Strategic narrative that travels: partners, press, stakeholder alignment',
        ],
      },
      {
        track: 'Wealth',
        topic: 'The Wealth Operating System',
        speaker: 'Tiffany',
        image: '/assets/images/speakers/Tiffany.jpg',
        description:
          'Wealth becomes powerful when it becomes organised. This session introduces a practical operating system for financial clarity: cashflow structure, protection layers, and decision rules that remove emotion from important choices. The goal is stability that supports ambition, and a system that quietly compounds in the background.',
        takeaways: [
          'Structured cashflow: clarity, control, confidence',
          'Protection layers: downside planning, stability architecture',
          'Decision rules for wealth: consistency over impulse',
          'Compounding strategy: assets, allocation, long-horizon thinking',
        ],
      },
      
      {
        track: 'Visual Storytelling & Creative Innovation',
        topic: 'Capturing Ideas That Connect and Convert',
        speaker: 'Henry Oji (Big H)',
        image: '/assets/images/speakers/bigh.webp',
        description:
        'Attention is easy to win and hard to keep—unless your ideas land with clarity and feeling. This session shows how to turn concepts into visual stories that people instantly understand, remember, and act on. You will learn how to capture raw ideas, shape them into narrative structures, and translate them into creative formats that travel across platforms—so your content does more than look good; it moves audiences from interest to intent.',
        takeaways: [
        'Idea capture system: a repeatable method for collecting insights and turning them into usable creative angles (not random inspiration)',
        'Narrative frameworks: simple story structures that create meaning fast—hook, tension, proof, payoff, and call-to-action',
        'Conversion-first visuals: how to design for clarity and action using visual hierarchy, sequencing, and messaging alignment',
        'Innovation loops: testing, iterating, and scaling creative concepts across formats (reels, carousels, decks, campaigns) without losing coherence',
        ],
      },


      {
        track: 'Branding',
        topic: 'Building Authentic Personal Brands',
        speaker: 'Samke Mhlongo',
        image: '/assets/images/speakers/Samke.png',
        description:
          'A personal brand is not content; it is what people repeat about you when you are not there. This session explores how to build recognition with discretion: message clarity, positioning, and a voice that feels distinct without trying too hard. The focus is global credibility, being easy to place, trusted quickly, and remembered for the right reasons.',
        takeaways: [
          'Message clarity that travels: one line people can repeat accurately',
          'Visibility with discretion: presence that attracts the right rooms',
          'Reputation-building assets: affiliations, proof, recognisable themes',
          'Global recognition cues: credibility signals beyond follower counts',
        ],
      },
    ],
  },
];

const APP_DEEP_LINK = 'atinuda://';
const IOS_APP_URL = 'https://apps.apple.com/ng/app/atinuda/id6755419370';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.laait.atinudaconferenceapp&pcampaignid=web_share';

export default function RetreatSpeakersPage() {
  const [activeSessionId, setActiveSessionId] = useState(sessionBlocks[0].id);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);

  const activeSession = useMemo(
    () => sessionBlocks.find((session) => session.id === activeSessionId) ?? sessionBlocks[0],
    [activeSessionId]
  );

  const activeSpeaker = activeSession.workshops[activeSpeakerIndex];

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setActiveSpeakerIndex(0);
  };

  const showNextSpeaker = () => {
    setActiveSpeakerIndex((index) => (index + 1) % activeSession.workshops.length);
  };

  const openAtinudaApp = () => {
    if (typeof window === 'undefined') return;

    const ua = window.navigator.userAgent;
    const isAndroid = /Android/i.test(ua);

    const start = Date.now();
    window.location.href = APP_DEEP_LINK;

    window.setTimeout(() => {
      if (Date.now() - start < 1800) {
        window.location.href = isAndroid ? PLAY_STORE_URL : IOS_APP_URL;
      }
    }, 1200);
  };

  return (
    <main className="bg-[#f6f3ee] text-[#171412]">
      <section className="relative flex min-h-[90vh] items-end overflow-hidden px-6 pb-16 pt-36 md:pb-24">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/wrkshop.jpeg"
            alt="Retreat setting"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(13,11,10,0.82)_5%,rgba(13,11,10,0.45)_55%,rgba(13,11,10,0.7)_100%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#ede7dd]">
            Atinuda Retreat Speakers
          </p>
          <h1 className="hero-text max-w-4xl text-4xl leading-[1.05] text-[#f4efe5] md:text-6xl lg:text-7xl">
            Voices That Shape the Next Era of Premium Leadership.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#e7ded0] md:text-lg">
            Four focused sessions across Day 4 and Day 5. Select a session to explore each
            workshop speaker and move through the lineup one at a time.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-10 rounded-[24px] border border-[#d5cebf] bg-[#fbf8f3] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#7b7468]">Workshop Selection</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#2a241c] md:text-base">
            Ticket confirmed? Head back to your Atinuda app dashboard to curate your workshop sessions.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* <button
              type="button"
              onClick={openAtinudaApp}
              className="inline-flex items-center rounded-full border border-[#1d1915] bg-[#1d1915] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#f6f3ee] transition hover:bg-[#2b251f]"
            >
              Open Atinuda App
            </button> */}
            <a
              href={IOS_APP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Download Atinuda on iOS"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b9b09f] text-[#3f382f] transition hover:border-[#8f8473] hover:text-[#201b16]"
            >
              <FaApple size={18} />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Download Atinuda on Google Play"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b9b09f] text-[#3f382f] transition hover:border-[#8f8473] hover:text-[#201b16]"
            >
              <FaGooglePlay size={16} />
            </a>
          </div>
        </div>

        <div className="grid gap-10 lg:min-h-[760px] lg:grid-cols-[0.86fr_1.14fr]">
          <aside className="h-full rounded-[30px] border border-[#d5cebf] bg-[#fbf8f3] p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7b7468]">Day & Session</p>
            <div className="mt-8 flex h-[calc(100%-2.25rem)] min-h-[420px] grid-rows-4 flex-col border-y border-[#d9d1c2] lg:grid">
              {sessionBlocks.map((session) => {
                const isActive = session.id === activeSession.id;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleSessionSelect(session.id)}
                    className={`group flex h-full w-full items-center justify-between border-t border-[#d9d1c2] px-0 py-6 text-left transition first:border-t-0 ${
                      isActive ? 'text-[#15120f]' : 'text-[#7f786d] hover:text-[#221d18]'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="text-lg tracking-[0.02em]">{session.label}</span>
                    <span
                      className={`h-px w-10 transition-all ${
                        isActive ? 'w-16 bg-[#181411]' : 'bg-[#b7aea0] group-hover:w-14'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[#d5cebf] bg-[#fbf8f3]">
            <div className="border-b border-[#d9d1c2] px-8 py-6 md:px-10">
              <p className="text-xs uppercase tracking-[0.28em] text-[#7b7468]">
                {activeSession.heading}
              </p>
            </div>

            <div className="group/card relative flex-1">
              <div className="grid h-full md:grid-cols-[0.88fr_1.12fr]">
                <div className="relative min-h-[320px] md:min-h-[470px]">
                  <Image
                    src={activeSpeaker.image}
                    alt={activeSpeaker.speaker}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#8d8577]">
                      {activeSpeaker.track}
                    </p>
                    <h2 className="hero-text text-3xl leading-tight text-[#181411] md:text-4xl">
                      {activeSpeaker.speaker}
                    </h2>
                    <p className="mt-5 text-sm uppercase tracking-[0.18em] text-[#4b4337]">
                      Workshop Topic
                    </p>
                    <p className="mt-2 text-xl leading-snug text-[#2a241c]">{activeSpeaker.topic}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8d8577]">
                    Hover to preview workshop details
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 hidden bg-[rgba(20,17,14,0.94)] p-9 text-[#f0e8da] opacity-0 transition duration-300 group-hover/card:opacity-100 md:block">
                <p className="text-sm leading-relaxed text-[#eee4d2]">{activeSpeaker.description}</p>
                <div className="mt-6 h-px w-full bg-[#94836a]/50" />
                <p className="mt-6 text-[0.68rem] uppercase tracking-[0.28em] text-[#d6c7af]">
                  Session Takeaways
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#eadfcf]">
                  {activeSpeaker.takeaways.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b9a78a]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#d9d1c2] p-8 md:hidden">
              <p className="text-sm leading-relaxed text-[#2a241c]">{activeSpeaker.description}</p>
              <p className="mt-6 text-[0.68rem] uppercase tracking-[0.28em] text-[#7a7266]">
                Session Takeaways
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#2a241c]">
                {activeSpeaker.takeaways.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9d8e79]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#d9d1c2] px-8 py-6 md:px-10">
              <button
                type="button"
                onClick={showNextSpeaker}
                className="group/button inline-flex items-center gap-4 text-left"
              >
                <span className="h-px w-24 bg-[#b9b09f] transition-all duration-300 group-hover/button:w-36" />
                <span className="grid h-16 w-16 place-items-center rounded-full border border-[#b9b09f] text-[#2c251d] transition-transform duration-300 group-hover/button:translate-x-1">
                  <ArrowRight size={40} strokeWidth={1.35} />
                </span>
                <span className="text-xs uppercase tracking-[0.28em] text-[#4f473b]">
                  Next Speaker
                </span>
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
