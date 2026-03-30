'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function StickyRetreatNav() {
  // Start hidden on both server and client to avoid hydration mismatch.
  // useEffect runs only client-side and sets true once user scrolls past the hero.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount in case page was already scrolled
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d2010]/96 backdrop-blur-md border-t border-white/10"
          role="complementary"
          aria-label="Retreat booking bar"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            {/* Brand + date, desktop only */}
            <div className="hidden md:flex flex-col gap-0.5">
              <span className="nav-text text-xs tracking-[0.2em] uppercase text-white/40">
                Atinuda Retreat 2026
              </span>
              <span className="text-sm text-white/65">
                Mauritius · March 8–14, 2026
              </span>
            </div>

            {/* Brand, mobile only */}
            <div className="md:hidden">
              <span className="nav-text text-xs tracking-[0.2em] uppercase text-white/50">
                Atinuda 2026
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="#programme"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-white/55 hover:text-white transition-colors"
              >
                View programme
              </Link>
              <Link
                href="/retreat-ticket"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0d2010] text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-black/20"
              >
                Claim your pass
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
