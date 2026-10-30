'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Scroll-driven pillars for the home page, after forgeautomotive.co.uk: a pinned "Six pillars" title with
// photographs travelling past at different speeds, then pillar panels that stack as each slides over the last.

/* ── A very large title, pinned, with photographs travelling past it ── */
export function BigWord({ word, sub, images }: { word: string; sub: string; images: [string, string] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
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
          <p className="px-label">The conversations</p>
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
        <Link href={href} className="px-btn">{cta}</Link>
      </div>
      <div className="px-panel-img">
        <motion.div className="px-panel-img-inner" style={reduce ? undefined : { y }}>
          <Image src={pillar.image} alt={pillar.alt} fill sizes="(max-width: 860px) 100vw, 55vw" className="px-cover" />
        </motion.div>
      </div>
    </section>
  );
}
