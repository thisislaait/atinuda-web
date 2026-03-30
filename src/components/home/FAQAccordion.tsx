'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type FAQItem = {
  q: string;
  a: string;
};

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, idx) => {
        const isOpen = open === idx;
        return (
          <div key={idx} className="border-t border-white/8 last:border-b last:border-white/8">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              className="w-full flex items-start gap-6 py-7 text-left group"
              aria-expanded={isOpen}
            >
              {/* Number */}
              <span className="nav-text text-[10px] tracking-[0.25em] text-white/20 shrink-0 pt-[3px] w-6">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Question */}
              <span className="flex-1 text-white/85 text-base leading-snug font-light pr-6">
                {item.q}
              </span>

              {/* Indicator, thin line that rotates to form a cross/minus */}
              <span className="shrink-0 mt-1.5 relative w-4 h-4" aria-hidden="true">
                <span
                  className="absolute inset-y-[7px] left-0 right-0 h-px bg-white/30 group-hover:bg-white/50 transition-colors"
                />
                <span
                  className={`absolute inset-x-[7px] top-0 bottom-0 w-px bg-white/30 group-hover:bg-white/50 transition-all duration-300 ${
                    isOpen ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'
                  }`}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pl-12 pb-8 text-white/45 text-sm leading-relaxed max-w-2xl">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
