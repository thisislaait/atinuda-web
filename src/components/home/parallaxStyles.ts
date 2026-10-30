// Styles for the scroll-driven pillars in Parallax.tsx. Kept out of that client module so the
// server-rendered home page can include them in its <style> block. Light stone canvas, ink type.

const BG = '#F4F5F3';
const INK = '#1B1E1C';
const MUTED = '#5A615C';
const COPPER = '#b5622a';

export const parallaxStyles = `
  .px-cover { object-fit: cover; }
  .px-label { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: ${INK}; margin: 0 0 18px; padding-bottom: 4px; border-bottom: 2px solid ${COPPER}; }
  .px-kicker { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: ${MUTED}; margin: 0; }
  .px-display { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; line-height: 1.02; letter-spacing: -0.015em; color: ${INK}; margin: 0; }
  .px-accent { font-family: 'Orpheus Pro', Georgia, serif; font-size: clamp(1.3rem, 1.8vw, 1.6rem); line-height: 1.3; color: ${INK}; margin: 0 0 16px; }
  .px-body { font-family: DIN, system-ui, sans-serif; font-size: 16px; line-height: 1.6; color: ${MUTED}; margin: 0 0 32px; max-width: 44ch; }
  .px-btn { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; padding: 16px 34px; color: ${BG}; background: ${INK}; border: 1px solid ${INK}; transition: background 0.25s ease, color 0.25s ease; }
  .px-btn:hover { background: transparent; color: ${INK}; }

  .px-word { position: relative; height: 220vh; background: ${BG}; }
  .px-word-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .px-word-text { position: relative; z-index: 2; padding: 0 24px; display: flex; flex-direction: column; align-items: center; }
  .px-word-title { font-size: clamp(4.5rem, 14vw, 14rem); line-height: 0.9; text-align: center; }
  .px-word-img { position: absolute; top: 0; overflow: hidden; z-index: 1; }
  .px-word-a { left: 7%; width: 24vw; aspect-ratio: 3 / 4; }
  .px-word-b { right: 8%; width: 20vw; aspect-ratio: 4 / 5; }

  .px-stack { position: relative; }
  .px-panel { position: sticky; top: 0; height: 100svh; display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); background: ${BG}; border-top: 1px solid #DBDFDB; }
  .px-panel-text { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px); }
  .px-panel-title { font-size: clamp(2.2rem, 3.8vw, 3.6rem); margin: 16px 0 18px; max-width: 14ch; }
  .px-panel-img { position: relative; overflow: hidden; }
  .px-panel-img-inner { position: absolute; inset: -12% 0; }

  @media (max-width: 860px) {
    .px-panel { grid-template-columns: 1fr; height: auto; min-height: 100svh; grid-template-rows: 42svh auto; }
    .px-panel-img { order: -1; }
    .px-panel-text { padding: 40px 24px 64px; }
    .px-word { height: 180vh; }
    .px-word-title { font-size: 17vw; }
    .px-word-text .px-body { max-width: 30ch; }
    .px-word-img { opacity: 0.85; }
    .px-word-a { width: 34vw; left: -6%; }
    .px-word-b { width: 30vw; right: -5%; }
  }
`;
