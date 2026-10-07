'use client';

import { useRef, useEffect, ReactNode } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  height?: string;
  speed?: number;
  children?: ReactNode;
}

export function ParallaxBreak({ src, height = '82vh', speed = 80, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef     = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const image     = imageRef.current;
    if (!container || !image) return;

    const update = () => {
      const rect     = container.getBoundingClientRect();
      const viewH    = window.innerHeight;
      const midpoint = rect.top + rect.height / 2;
      const progress = (viewH / 2 - midpoint) / (viewH / 2 + rect.height / 2);
      image.style.transform = `translateY(${progress * speed}px)`;
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  return (
    <div ref={containerRef} style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div
        ref={imageRef}
        style={{
          position: 'absolute',
          inset: `-${speed}px 0`,
          willChange: 'transform',
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>
      {children && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  );
}
