'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

// The six pillars as a horizontal journey: the section pins, vertical scroll slides the
// pillars in from the right one per screen, and each card opens like a capsule on hover or tap.

export type Pillar = {
  name: string;
  line: string;
  brings: string[];
  image: string;
  alt: string;
};

const BG = '#F4F5F3';
const COPPER = '#cf8550';

export function PillarsJourney({ pillars }: { pillars: Pillar[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // A spring between scroll and movement gives the swipe its hand-moved feel.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const last = pillars.length - 1;
  const x = useTransform(progress, (p) => `${-p * last * 100}vw`);
  const counter = useTransform(progress, (p) => String(Math.min(last, Math.round(p * last)) + 1).padStart(2, '0'));
  const bar = useTransform(progress, (p) => `${(p * last + 1) / pillars.length * 100}%`);

  if (reduce) {
    return (
      <section className="pj-static">
        <Header />
        <div className="pj-static-grid">
          {pillars.map((p, i) => <Capsule key={p.name} pillar={p} index={i} />)}
        </div>
        <style>{styles}</style>
      </section>
    );
  }

  return (
    <section ref={ref} className="pj" style={{ height: `${pillars.length * 100}vh` }} aria-label="The six pillars">
      <div className="pj-sticky">
        <Header />
        <div className="pj-stage">
          <motion.div className="pj-track" style={{ x }}>
            {pillars.map((p, i) => (
              <Panel key={p.name} pillar={p} index={i} progress={progress} last={last} />
            ))}
          </motion.div>
        </div>
        <div className="pj-progress" aria-hidden="true">
          <span className="pj-count"><motion.span>{counter}</motion.span> / {String(pillars.length).padStart(2, '0')}</span>
          <span className="pj-rail"><motion.span className="pj-fill" style={{ width: bar }} /></span>
          <span className="pj-hint">Scroll to move through the pillars</span>
        </div>
      </div>
      <style>{styles}</style>
    </section>
  );
}

function Header() {
  return (
    <div className="pj-head">
      <p className="pj-label">The conversations</p>
      <h2 className="pj-title">Six pillars</h2>
    </div>
  );
}

function Panel({ pillar, index, progress, last }: { pillar: Pillar; index: number; progress: MotionValue<number>; last: number }) {
  // Distance from the pillar in focus: 0 in focus, 1 one screen away.
  const d = useTransform(progress, (p) => index - p * last);
  const rotateY = useTransform(d, [-1, 0, 1], [28, 0, -28]);
  const scale = useTransform(d, [-1, 0, 1], [0.82, 1, 0.82]);
  const opacity = useTransform(d, [-1.2, 0, 1.2], [0.25, 1, 0.25]);
  const z = useTransform(d, [-1, 0, 1], [-220, 0, -220]);

  return (
    <div className="pj-panel">
      <motion.div style={{ rotateY, scale, opacity, z }} className="pj-depth">
        <Capsule pillar={pillar} index={index} />
      </motion.div>
    </div>
  );
}

function Capsule({ pillar, index }: { pillar: Pillar; index: number }) {
  const [open, setOpen] = useState(false);
  const pointer = useRef('');
  const num = String(index + 1).padStart(2, '0');

  return (
    <button
      type="button"
      className={`pj-capsule${open ? ' is-open' : ''}`}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
      onPointerDown={(e) => { pointer.current = e.pointerType; }}
      // A mouse opens on hover; touch and keyboard open on tap or Enter.
      onClick={() => { if (pointer.current !== 'mouse') setOpen((o) => !o); pointer.current = ''; }}
      aria-expanded={open}
      aria-label={`${pillar.name}: ${open ? 'close' : 'open'}`}
    >
      {/* Inside the capsule */}
      <div className="pj-inner">
        <p className="pj-inner-num">{num}</p>
        <p className="pj-inner-name">{pillar.name}</p>
        <p className="pj-inner-line">{pillar.line}</p>
        <p className="pj-inner-label">Who it brings together</p>
        <ul className="pj-inner-list">
          {pillar.brings.map((b) => <li key={b}>{b}</li>)}
        </ul>
      </div>

      {/* The two halves of the shell */}
      <span className="pj-half pj-half-l" aria-hidden="true">
        <Image src={pillar.image} alt="" fill sizes="(max-width: 860px) 90vw, 60vw" className="pj-img" />
      </span>
      <span className="pj-half pj-half-r" aria-hidden="true">
        <Image src={pillar.image} alt={pillar.alt} fill sizes="(max-width: 860px) 90vw, 60vw" className="pj-img" />
      </span>

      {/* Closed face: which pillar this is */}
      <span className="pj-face" aria-hidden="true">
        <span className="pj-face-num">{num}</span>
        <span className="pj-face-name">{pillar.name}</span>
        <span className="pj-face-cue">Hover to open</span>
      </span>
    </button>
  );
}

const styles = `
  .pj { position: relative; background: #0F0F0F; }
  .pj-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; flex-direction: column; }
  .pj-head { position: absolute; top: clamp(88px, 12vh, 120px); left: 0; right: 0; text-align: center; z-index: 2; pointer-events: none; }
  .pj-label { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: ${BG}; margin: 0; padding-bottom: 4px; border-bottom: 2px solid ${COPPER}; }
  .pj-title { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; font-size: clamp(2rem, 3.6vw, 3.2rem); line-height: 1; color: ${BG}; margin: 14px 0 0; }

  .pj-stage { flex: 1; display: flex; align-items: center; perspective: 1600px; padding-top: clamp(120px, 16vh, 170px); }
  .pj-track { display: flex; will-change: transform; transform-style: preserve-3d; }
  .pj-panel { flex: 0 0 100vw; display: flex; justify-content: center; align-items: center; transform-style: preserve-3d; }
  .pj-depth { transform-style: preserve-3d; }

  .pj-capsule { position: relative; display: block; width: min(64vw, 900px); height: min(58vh, 560px); padding: 0; border: 0; background: #1B1E1C; cursor: pointer; overflow: hidden; border-radius: 4px; box-shadow: 0 40px 80px -30px rgba(0,0,0,0.75); text-align: left; perspective: 1400px; }
  .pj-capsule:focus-visible { outline: 2px solid ${COPPER}; outline-offset: 6px; }

  .pj-half { position: absolute; inset: 0; z-index: 2; transition: transform 0.9s cubic-bezier(0.7, 0, 0.2, 1), filter 0.9s ease; }
  .pj-half-l { clip-path: inset(0 50% 0 0); transform-origin: left center; }
  .pj-half-r { clip-path: inset(0 0 0 50%); transform-origin: right center; }
  .pj-img { object-fit: cover; }
  .pj-capsule.is-open .pj-half-l { transform: translateX(-38%) rotateY(32deg); filter: brightness(0.55); }
  .pj-capsule.is-open .pj-half-r { transform: translateX(38%) rotateY(-32deg); filter: brightness(0.55); }

  .pj-face { position: absolute; inset: 0; z-index: 3; display: flex; flex-direction: column; justify-content: flex-end; padding: clamp(24px, 3vw, 40px); background: linear-gradient(to top, rgba(10,10,10,0.7), rgba(10,10,10,0) 55%); transition: opacity 0.4s ease; pointer-events: none; }
  .pj-capsule.is-open .pj-face { opacity: 0; }
  .pj-face-num { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; color: ${COPPER}; }
  .pj-face-name { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-size: clamp(1.8rem, 3.2vw, 3rem); line-height: 1.05; color: ${BG}; margin-top: 10px; max-width: 18ch; }
  .pj-face-cue { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(244,245,243,0.7); margin-top: 18px; }

  .pj-inner { position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: clamp(28px, 6vw, 96px); background: radial-gradient(ellipse at center, #26302A 0%, #141815 75%); opacity: 0; transform: scale(0.9); transition: opacity 0.7s ease 0.2s, transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s; }
  .pj-capsule.is-open .pj-inner { opacity: 1; transform: scale(1); }
  .pj-inner-num { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; color: ${COPPER}; margin: 0; }
  .pj-inner-name { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(244,245,243,0.75); margin: 12px 0 0; }
  .pj-inner-line { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-size: clamp(1.7rem, 3vw, 2.8rem); line-height: 1.1; color: ${BG}; margin: 20px 0 0; max-width: 20ch; }
  .pj-inner-label { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(244,245,243,0.55); margin: clamp(24px, 4vh, 40px) 0 0; }
  .pj-inner-list { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 22px; max-width: 46ch; }
  .pj-inner-list li { font-family: 'Orpheus Pro', Georgia, serif; font-size: clamp(1.05rem, 1.4vw, 1.3rem); color: ${BG}; }

  .pj-progress { position: absolute; left: 0; right: 0; bottom: clamp(24px, 5vh, 48px); display: flex; align-items: center; justify-content: center; gap: 20px; font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; color: rgba(244,245,243,0.7); }
  .pj-rail { position: relative; width: clamp(120px, 18vw, 240px); height: 1px; background: rgba(244,245,243,0.2); }
  .pj-fill { position: absolute; left: 0; top: 0; bottom: 0; background: ${BG}; }
  .pj-hint { text-transform: uppercase; color: rgba(244,245,243,0.45); }

  .pj-static { background: #0F0F0F; padding: 120px clamp(24px, 5vw, 64px); }
  .pj-static .pj-head { position: static; margin-bottom: 56px; }
  .pj-static-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; max-width: 1280px; margin: 0 auto; }
  .pj-static .pj-capsule { width: 100%; height: 440px; }
  .pj-static .pj-half { transition: none; }

  @media (max-width: 860px) {
    .pj-capsule { width: 84vw; height: 60svh; }
    .pj-hint { display: none; }
    .pj-face-cue::after { content: ''; }
  }
  @media (hover: none) {
    .pj-face-cue { font-size: 0; }
    .pj-face-cue::before { content: 'Tap to open'; font-size: 11px; }
  }
`;
