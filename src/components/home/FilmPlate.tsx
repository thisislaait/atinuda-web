'use client';

import { useRef, useState } from 'react';

// Full-width film that plays silently in a loop, with a white play button that restarts it with sound and controls.
export function FilmPlate({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.controls = true;
    void v.play();
    setPlaying(true);
  };

  return (
    <div className="fp">
      <video ref={ref} className="fp-video" autoPlay muted loop playsInline preload="metadata">
        <source src={src} type="video/mp4" />
      </video>
      {!playing && (
        <button type="button" className="fp-play" onClick={play} aria-label="Play the film with sound">
          <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true"><path d="M0 0l16 9-16 9z" fill="#1B1E1C" /></svg>
        </button>
      )}
      <style>{`
        .fp { position: relative; aspect-ratio: 16 / 9; max-height: 86vh; width: 100%; overflow: hidden; background: #0F0F0F; }
        .fp-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .fp-play { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 120px; height: 80px; display: flex; align-items: center; justify-content: center; background: #F4F5F3; border: 0; border-radius: 0; cursor: pointer; transition: transform 0.25s ease; }
        .fp-play:hover { transform: translate(-50%, -50%) scale(1.05); }
        .fp-play:focus-visible { outline: 2px solid #F4F5F3; outline-offset: 4px; }
      `}</style>
    </div>
  );
}
