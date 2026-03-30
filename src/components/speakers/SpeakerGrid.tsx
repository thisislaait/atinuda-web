'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Speaker } from '@/data/speakers';

// ── Initials avatar ───────────────────────────────────────────────────────────

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Single card ───────────────────────────────────────────────────────────────

function SpeakerCard({
  speaker,
  onClick,
}: {
  speaker: Speaker;
  onClick: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = `/assets/images/speakers/${speaker.photoAssetKey}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d2010] rounded-2xl"
      aria-label={`View ${speaker.name}'s profile`}
    >
      {/* Photo area */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#1a2035] mb-4">
        {!imgFailed ? (
          <Image
            src={src}
            alt={speaker.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgFailed(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          // Initials placeholder, shown when image is missing or fails
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0d1e0e] to-[#1f3820]">
            <span
              className="text-white/30 font-light"
              style={{
                fontFamily: 'Orpheus Pro, "Playfair Display", serif',
                fontSize: 'clamp(3rem, 8vw, 5rem)',
              }}
            >
              {initials(speaker.name)}
            </span>
          </div>
        )}

        {/* Track badge, bottom-left overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="nav-text text-xs tracking-[0.15em] uppercase bg-black/60 backdrop-blur-sm text-white/80 px-2.5 py-1 rounded-full">
            {speaker.track}
          </span>
        </div>

        {/* Hover reveal */}
        <div className="absolute inset-0 bg-[#0d2010]/0 group-hover:bg-[#0d2010]/30 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-semibold tracking-wider border border-white/40 rounded-full px-4 py-2">
            View profile
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 px-1">
        <p className="hero-text text-base font-semibold text-[#0d2010] leading-snug group-hover:text-[#1a3d1e] transition-colors">
          {speaker.name}
        </p>
        {speaker.title !== '[TITLE]' && (
          <p className="text-xs text-[#6b7280]">
            {speaker.title}
            {speaker.company !== '[COMPANY]' && `, ${speaker.company}`}
          </p>
        )}
        <p className="text-xs text-[#4b5563] leading-snug mt-1 line-clamp-2">
          {speaker.topic}
        </p>
      </div>
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function SpeakerModal({
  speaker,
  onClose,
}: {
  speaker: Speaker;
  onClose: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = `/assets/images/speakers/${speaker.photoAssetKey}`;

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9000] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} profile`}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white w-full sm:max-w-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row">
          {/* Photo */}
          <div className="relative w-full md:w-80 flex-shrink-0 aspect-[4/3] md:aspect-auto md:min-h-[460px] bg-[#1a2035]">
            {!imgFailed ? (
              <Image
                src={src}
                alt={speaker.name}
                fill
                className="object-cover object-top"
                onError={() => setImgFailed(true)}
                sizes="(max-width: 768px) 100vw, 320px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0d1e0e] to-[#1f3820]">
                <span
                  className="text-white/25 font-light"
                  style={{
                    fontFamily: 'Orpheus Pro, "Playfair Display", serif',
                    fontSize: '5rem',
                  }}
                >
                  {initials(speaker.name)}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-7 md:p-9 flex flex-col gap-5">
            {/* Close */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="hero-text text-2xl md:text-3xl font-semibold text-[#0d2010] leading-tight">
                  {speaker.name}
                </h2>
                {(speaker.title !== '[TITLE]' || speaker.company !== '[COMPANY]') && (
                  <p className="text-sm text-[#6b7280]">
                    {speaker.title !== '[TITLE]' ? speaker.title : ''}
                    {speaker.title !== '[TITLE]' && speaker.company !== '[COMPANY]'
                      ? `, ${speaker.company}`
                      : speaker.company !== '[COMPANY]'
                      ? speaker.company
                      : ''}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#0d2010]/5 transition-colors flex-shrink-0 ml-4"
                aria-label="Close"
              >
                <X size={18} className="text-[#6b7280]" />
              </button>
            </div>

            {/* Track + day badges */}
            <div className="flex flex-wrap gap-2">
              <span className="nav-text text-xs tracking-[0.15em] uppercase bg-[#f2dfd2] text-[#5a433a] px-3 py-1.5 rounded-full">
                {speaker.track}
              </span>
              <span className="nav-text text-xs tracking-[0.15em] uppercase bg-[#eef5ee] text-[#4b5563] px-3 py-1.5 rounded-full">
                {speaker.day}
              </span>
            </div>

            {/* Session topic */}
            <div className="border-l-2 border-[#0d2010]/15 pl-4">
              <p className="text-xs text-[#6b7280] mb-1 nav-text tracking-[0.15em] uppercase">
                Session
              </p>
              <p className="text-base font-semibold text-[#0d2010] leading-snug">
                {speaker.topic}
              </p>
            </div>

            {/* Bio */}
            {speaker.bio !== '[BIO PLACEHOLDER]' ? (
              <p className="text-sm text-[#4b5563] leading-relaxed flex-1">
                {speaker.bio}
              </p>
            ) : (
              <p className="text-sm text-[#9ca3af] italic flex-1">
                Biography coming soon.
              </p>
            )}

            {/* CTA */}
            <Link
              href="/retreat-ticket"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0d2010] text-white text-sm font-semibold hover:bg-[#1a3d1e] transition-colors w-fit"
            >
              Claim your retreat pass
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Grid (exported) ───────────────────────────────────────────────────────────

export default function SpeakerGrid({ speakers }: { speakers: Speaker[] }) {
  const [selected, setSelected] = useState<Speaker | null>(null);

  return (
    <>
      <div className="grid gap-x-5 gap-y-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {speakers.map((speaker) => (
          <SpeakerCard
            key={speaker.id}
            speaker={speaker}
            onClick={() => setSelected(speaker)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
