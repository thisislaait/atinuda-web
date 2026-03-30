'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'Founders & Entrepreneurs',
    desc: 'Building category-defining companies across Africa and the diaspora.',
    detail:
      'These are the builders, visionaries who moved from idea to institution and are still mid-sprint. At Atinuda they find peers who understand the particular weight of making something from nothing, and the discipline required to scale it.',
    image: '/assets/images/Retreat/attendee1.JPG',
  },
  {
    title: 'Executives & Corporate Leaders',
    desc: 'Shaping institutions, capital flows, and influence at scale.',
    detail:
      'Senior leaders navigating the gap between legacy structures and the pace of modern markets. They come to recalibrate, away from the quarterly calendar, inside a room built to think about the next decade.',
    image: '/assets/images/Retreat/attendee2.jpg',
  },
  {
    title: 'Creative Directors & Brand Strategists',
    desc: 'Defining culture through craft, vision, and precise execution.',
    detail:
      'Taste-makers, brand architects, and cultural translators. They know that aesthetics are strategy, and they want to be around others who take that seriously, not justify it.',
    image: '/assets/images/Retreat/attendee3.jpg',
  },
  {
    title: 'Investors & Operators',
    desc: 'Deploying capital, enabling ecosystems, and moving markets.',
    detail:
      'Capital allocators, board advisors, and operators who hold the levers of scale. At Atinuda they engage with founders directly, away from pitch decks and due-diligence walls.',
    image: '/assets/images/Retreat/attendee4.jpg',
  },
  {
    title: 'Innovators & Visionaries',
    desc: 'At the intersection of technology, policy, and what comes next.',
    detail:
      'Researchers, technologists, policy shapers, and provocateurs who make everyone in the room smarter. They are not speakers, they are participants, and the retreat is better because they are in it.',
    image: '/assets/images/Retreat/attendee5.jpg',
  },
];

const TICKET_URL = '/retreat-ticket';

export default function WhoAttendsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = Math.min(Math.floor(latest * CATEGORIES.length), CATEGORIES.length - 1);
    setActiveIndex(idx);
  });

  return (
    // Outer container drives scroll height: 5 screens
    <div
      ref={containerRef}
      style={{ height: `${CATEGORIES.length * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex">

        {/* ── Left column, static ── */}
        <div className="hidden lg:flex flex-col justify-center bg-[#f2dfd2] w-[42%] flex-shrink-0 px-12 xl:px-16 py-16 relative">
          <p className="nav-text text-xs tracking-[0.3em] uppercase text-[#5a433a] mb-4">
            The Room
          </p>
          <h2
            className="text-4xl xl:text-5xl leading-tight text-[#2b1f1a] mb-6"
            style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}
          >
            Who you&apos;ll find<br />in Mauritius.
          </h2>
          <p className="text-[#5a433a] text-sm leading-relaxed mb-10 max-w-xs">
            Atinuda does not collect attendees. It curates a room, one where
            calibre, intention, and ambition are the entry criteria.
          </p>

          {/* Category navigator */}
          <nav aria-label="Audience categories" className="space-y-0 mb-10">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                animate={{
                  opacity: i === activeIndex ? 1 : 0.38,
                }}
                transition={{ duration: 0.35 }}
                className="py-3 border-t border-[#c9b8ab] last:border-b"
              >
                <motion.p
                  animate={{
                    color: i === activeIndex ? '#2b1f1a' : '#7a6058',
                    x: i === activeIndex ? 4 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-semibold leading-snug"
                >
                  {i === activeIndex && (
                    <span className="inline-block w-2 h-2 rounded-full bg-[#2b1f1a] mr-2 mb-[1px] align-middle" />
                  )}
                  {cat.title}
                </motion.p>
              </motion.div>
            ))}
          </nav>

          <Link
            href={TICKET_URL}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d2010] text-white text-sm font-semibold hover:bg-[#1a3d1e] transition-colors w-fit"
          >
            Apply for your place
            <ArrowRight size={14} aria-hidden="true" />
          </Link>

          {/* Progress dots */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {CATEGORIES.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: i === activeIndex ? 24 : 6,
                  opacity: i === activeIndex ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="w-[3px] rounded-full bg-[#5a433a] origin-top"
              />
            ))}
          </div>
        </div>

        {/* ── Right column, animated content ── */}
        <div className="flex-1 relative bg-[#0d2010] overflow-hidden">
          {/* Image crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${activeIndex}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={CATEGORIES[activeIndex].image}
                alt={CATEGORIES[activeIndex].title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority={activeIndex === 0}
              />
              {/* Gradient over image, bottom half */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2010] via-[#0d2010]/50 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Text content, bottom of right column */}
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 lg:p-14">
            {/* Mobile heading (left column hidden on mobile) */}
            <p className="lg:hidden nav-text text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
              The Room · Who you&apos;ll find in Mauritius
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeIndex}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-3 max-w-lg"
              >
                {/* Counter */}
                <p className="nav-text text-xs tracking-[0.25em] uppercase text-white/35">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(CATEGORIES.length).padStart(2, '0')}
                </p>

                <h3
                  className="text-3xl md:text-4xl leading-tight text-white"
                  style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}
                >
                  {CATEGORIES[activeIndex].title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {CATEGORIES[activeIndex].detail}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mobile CTA + progress */}
            <div className="lg:hidden mt-6 flex items-center justify-between">
              <Link
                href={TICKET_URL}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0d2010] text-xs font-semibold hover:bg-white/90 transition-colors"
              >
                Apply for your place
                <ArrowRight size={12} aria-hidden="true" />
              </Link>

              {/* Mobile progress dots, horizontal */}
              <div className="flex gap-2 items-center">
                {CATEGORIES.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === activeIndex ? 20 : 6,
                      opacity: i === activeIndex ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-[3px] rounded-full bg-white"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
