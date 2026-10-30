'use client';

import { useEffect, useRef } from 'react';

// Background hero film. React does not reliably render the `muted` attribute from the server,
// and browsers only autoplay muted video, so mute and start it from the browser.
export function HeroVideo({ sources, className }: { sources: string[]; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.play().catch(() => {
      // Autoplay refused (for example in low-power mode): the first frame stays as a still.
    });
  }, []);

  return (
    <video ref={ref} className={className} autoPlay muted loop playsInline preload="auto" aria-hidden="true">
      {sources.map((src) => <source key={src} src={src} type="video/mp4" />)}
    </video>
  );
}
