'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from 'framer-motion';

// Scroll-driven pieces for the home page, after forgeautomotive.co.uk: a progress line, a statement that
// lights up word by word, a pinned three-step sequence, stacking pillar panels with drifting photographs,
// a large word with photographs passing at different speeds, and full-bleed panels that settle as they arrive.

const LIGHT = '#F4F5F3';
const COPPER = '#cf8550';

/* ── Thin progress line along the bottom of the screen ── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="px-progress" style={{ scaleX }} aria-hidden="true" />;
}

/* ── Floating call to action, shown between the hero and the closing section ── */
export function FloatingCta({ href, label }: { href: string; label: string }) {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setShow(p > 0.06 && p < 0.92));
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="px-float" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.35 }}>
          <Link href={href} className="px-btn px-btn-solid">{label}</Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── A statement whose words brighten as it scrolls through the screen ── */
export function RevealStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="px-reveal">
      {words.map((w, i) => (
        <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} still={!!reduce} />
      ))}
    </p>
  );
}

function Word({ word, index, total, progress, still }: { word: string; index: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; still: boolean }) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  const color = useTransform(progress, [start, end, end + 0.08], [LIGHT, COPPER, LIGHT]);
  return (
    <motion.span style={still ? undefined : { opacity, color }}>{word} </motion.span>
  );
}

/* ── Pinned three-step sequence: a blurred photograph behind, a sharp one in front, a counter ── */
export type Step = { label: string; title: string; body: string; cta: string; href: string; image: string; alt: string };

export function PinnedSteps({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(steps.length - 1, Math.floor(p * steps.length))));

  if (reduce) {
    return (
      <section className="px-steps-still">
        {steps.map((s, i) => <StepFace key={s.title} step={s} index={i} total={steps.length} />)}
      </section>
    );
  }

  const s = steps[active];
  return (
    <section ref={ref} className="px-steps" style={{ height: `${steps.length * 110}vh` }}>
      <div className="px-steps-sticky">
        <AnimatePresence mode="sync">
          <motion.div key={s.image} className="px-steps-bg" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <Image src={s.image} alt="" fill sizes="100vw" className="px-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="px-steps-veil" />
        <AnimatePresence mode="wait">
          <motion.div key={s.title} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }} className="px-steps-inner">
            <StepFace step={s} index={active} total={steps.length} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function StepFace({ step, index, total }: { step: Step; index: number; total: number }) {
  return (
    <div className="px-step">
      <div className="px-step-img">
        <Image src={step.image} alt={step.alt} fill sizes="(max-width: 860px) 90vw, 30vw" className="px-cover" />
      </div>
      <div className="px-step-text">
        <p className="px-kicker">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} &nbsp;·&nbsp; {step.label}</p>
        <h2 className="px-display px-h2">{step.title}</h2>
        <p className="px-body">{step.body}</p>
        <Link href={step.href} className="px-btn px-btn-solid">{step.cta}</Link>
      </div>
    </div>
  );
}

/* ── A very large word with photographs drifting past it at different speeds ── */
export function BigWord({ word, sub, images }: { word: string; sub: string; images: [string, string] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // The title holds in the centre of a pinned screen while two photographs travel upward past it at different speeds.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const slow = useTransform(scrollYProgress, [0, 1], ['70vh', '-85vh']);
  const fast = useTransform(scrollYProgress, [0, 1], ['105vh', '-120vh']);
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 1.04]);
  return (
    <section ref={ref} className="px-word" style={reduce ? { height: 'auto' } : undefined}>
      <div className="px-word-sticky" style={reduce ? { position: 'relative' } : undefined}>
        <motion.div className="px-word-img px-word-a" style={reduce ? undefined : { y: slow }} aria-hidden="true">
          <Image src={images[0]} alt="" fill sizes="30vw" className="px-cover" />
        </motion.div>
        <motion.div className="px-word-img px-word-b" style={reduce ? undefined : { y: fast }} aria-hidden="true">
          <Image src={images[1]} alt="" fill sizes="26vw" className="px-cover" />
        </motion.div>
        <motion.div className="px-word-text" style={reduce ? undefined : { scale: titleScale }}>
          <h2 className="px-display px-word-title">{word}</h2>
          <p className="px-body" style={{ margin: '24px auto 0', textAlign: 'center' }}>{sub}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Stacking pillar panels: each slides over the last, its photograph drifting inside ── */
export type PillarPanel = { name: string; line: string; body: string; image: string; alt: string };

export function PillarStack({ pillars, cta, href }: { pillars: PillarPanel[]; cta: string; href: string }) {
  return (
    <div className="px-stack">
      {pillars.map((p, i) => <PillarPanelView key={p.name} pillar={p} index={i} total={pillars.length} cta={cta} href={href} />)}
    </div>
  );
}

function PillarPanelView({ pillar, index, total, cta, href }: { pillar: PillarPanel; index: number; total: number; cta: string; href: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  return (
    <section ref={ref} className="px-panel" style={{ zIndex: index + 1 }}>
      <div className="px-panel-text">
        <p className="px-kicker">Pillar {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
        <h3 className="px-display px-panel-title">{pillar.name}</h3>
        <p className="px-accent">{pillar.line}</p>
        <p className="px-body">{pillar.body}</p>
        <Link href={href} className="px-btn px-btn-line">{cta}</Link>
      </div>
      <div className="px-panel-img">
        <motion.div className="px-panel-img-inner" style={reduce ? undefined : { y }}>
          <Image src={pillar.image} alt={pillar.alt} fill sizes="(max-width: 860px) 100vw, 55vw" className="px-cover" />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Full-bleed panel: the photograph settles from a slight zoom as it arrives ── */
export function ZoomPanel({ label, title, body, cta, href, image, alt }: { label: string; title: string; body: string; cta: string; href: string; image: string; alt: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.02, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], ['18%', '0%', '-12%']);
  return (
    <section ref={ref} className="px-zoom">
      <motion.div className="px-zoom-img" style={reduce ? undefined : { scale }}>
        <Image src={image} alt={alt} fill sizes="100vw" className="px-cover" />
      </motion.div>
      <div className="px-zoom-veil" />
      <motion.div className="px-zoom-text" style={reduce ? undefined : { y: textY }}>
        <p className="px-kicker">{label}</p>
        <h2 className="px-display px-zoom-title">{title}</h2>
        <p className="px-body" style={{ margin: '0 auto 36px', textAlign: 'center' }}>{body}</p>
        <Link href={href} className="px-btn px-btn-solid">{cta}</Link>
      </motion.div>
    </section>
  );
}
