// Styles for the scroll-driven pieces in Parallax.tsx. Kept out of that client module so the
// server-rendered home page can include them in its <style> block.

const LIGHT = '#F4F5F3';
const COPPER = '#cf8550';

export const parallaxStyles = `
  .px-cover { object-fit: cover; }
  .px-kicker { font-family: DIN, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(244,245,243,0.7); margin: 0; }
  .px-display { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; line-height: 1.02; letter-spacing: -0.015em; color: ${LIGHT}; margin: 0; }
  .px-accent { font-family: 'Orpheus Pro', Georgia, serif; font-size: clamp(1.3rem, 1.8vw, 1.6rem); line-height: 1.3; color: ${LIGHT}; margin: 0 0 16px; }
  .px-body { font-family: DIN, system-ui, sans-serif; font-size: 16px; line-height: 1.65; color: rgba(244,245,243,0.72); margin: 0 0 32px; max-width: 46ch; }
  .px-h2 { font-size: clamp(2.4rem, 4.6vw, 4.2rem); margin: 16px 0 22px; }

  .px-btn { display: inline-block; font-family: DIN, system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; padding: 17px 36px; border-radius: 0; transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
  .px-btn-solid { background: ${COPPER}; color: #0E0F0E; border: 1px solid ${COPPER}; }
  .px-btn-solid:hover { background: ${LIGHT}; border-color: ${LIGHT}; }
  .px-btn-line { color: ${LIGHT}; border: 1px solid rgba(244,245,243,0.55); }
  .px-btn-line:hover { background: ${LIGHT}; color: #0E0F0E; }

  .px-progress { position: fixed; left: 0; right: 0; bottom: 0; height: 2px; background: ${COPPER}; transform-origin: 0 50%; z-index: 60; }
  .px-float { position: fixed; right: clamp(16px, 3vw, 40px); bottom: clamp(20px, 4vh, 40px); z-index: 55; }
  .px-float .px-btn { box-shadow: 0 18px 40px -16px rgba(0,0,0,0.6); }

  .px-reveal { font-family: SaolDisplay, Georgia, serif; font-style: italic; font-weight: 400; font-size: clamp(2rem, 4.2vw, 3.9rem); line-height: 1.14; letter-spacing: -0.01em; color: ${LIGHT}; max-width: 22ch; margin: 0 auto; text-align: center; }

  .px-steps { position: relative; }
  .px-steps-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; align-items: center; }
  .px-steps-bg { position: absolute; inset: -40px; filter: blur(22px) brightness(0.45); }
  .px-steps-veil { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(14,15,14,0.2), rgba(14,15,14,0.85)); }
  .px-steps-inner { position: relative; width: 100%; }
  .px-step { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(32px, 6vw, 110px); align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 clamp(24px, 5vw, 64px); }
  .px-step-img { position: relative; aspect-ratio: 4 / 5; overflow: hidden; box-shadow: 0 50px 90px -40px rgba(0,0,0,0.8); }
  .px-steps-still { padding: 120px 0; display: grid; gap: 120px; }

  .px-word { position: relative; height: 220vh; }
  .px-word-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .px-word-text { position: relative; z-index: 2; padding: 0 24px; display: flex; flex-direction: column; align-items: center; }
  .px-word-title { font-size: clamp(4.5rem, 14vw, 14rem); line-height: 0.9; text-align: center; }
  .px-word-img { position: absolute; top: 0; overflow: hidden; z-index: 1; opacity: 0.9; }
  .px-word-a { left: 7%; width: 24vw; aspect-ratio: 3 / 4; }
  .px-word-b { right: 8%; width: 20vw; aspect-ratio: 4 / 5; }

  .px-stack { position: relative; }
  .px-panel { position: sticky; top: 0; height: 100svh; display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); background: #0E0F0E; border-top: 1px solid rgba(244,245,243,0.08); }
  .px-panel-text { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px); }
  .px-panel-title { font-size: clamp(2.2rem, 3.8vw, 3.6rem); margin: 16px 0 18px; max-width: 14ch; }
  .px-panel-img { position: relative; overflow: hidden; }
  .px-panel-img-inner { position: absolute; inset: -12% 0; }

  .px-zoom { position: relative; height: 110svh; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; }
  .px-zoom-img { position: absolute; inset: 0; }
  .px-zoom-veil { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(14,15,14,0.55), rgba(14,15,14,0.35) 45%, rgba(14,15,14,0.75)); }
  .px-zoom-text { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; padding: 0 24px; }
  .px-zoom-title { font-size: clamp(3rem, 7vw, 6.4rem); margin: 18px 0 22px; }

  @media (max-width: 860px) {
    .px-step, .px-panel { grid-template-columns: 1fr; }
    .px-step-img { aspect-ratio: 4 / 3; max-height: 34vh; }
    .px-step { gap: 28px; }
    .px-panel { height: auto; min-height: 100svh; grid-template-rows: 42svh auto; }
    .px-panel-img { order: -1; }
    .px-panel-text { padding: 40px 24px 64px; }
    .px-word { height: 180vh; }
    .px-word-a { width: 44vw; left: 4%; }
    .px-word-b { width: 40vw; right: 4%; }
    .px-float { left: 16px; right: 16px; }
    .px-float .px-btn { display: block; text-align: center; }
  }
`;
