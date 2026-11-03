export const CSS = `
  .sa-app {
    --ink: #101828; --ink-2: #475467; --ink-3: #667085; --line: #E7E9EE; --line-2: #F0F1F4;
    --canvas: #F5F6F8; --panel: #FFFFFF; --forest: #12291F; --forest-2: #1D3B2E; --money: #1F6B4F;
    --money-bg: #E8F3EE; --loss: #A63A2B; --loss-bg: #FBEDEA; --warn: #8A5A00; --warn-bg: #FBF2DD; --copper: #D98A52;
    display: grid; grid-template-columns: 232px minmax(0, 1fr); min-height: 100vh;
    background: var(--canvas); color: var(--ink);
    font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 14px; line-height: 1.45;
    font-feature-settings: "tnum" 1, "lnum" 1;
  }
  .sa-app *, .sa-signin-page * { box-sizing: border-box; }
  .sa-app p, .sa-app h1, .sa-app h2, .sa-app dl, .sa-app dd { margin: 0; }
  .sa-app button, .sa-app input, .sa-signin-page button, .sa-signin-page input { font: inherit; color: inherit; }
  .sa-app button { cursor: pointer; }
  .sa-app button:disabled { opacity: 0.45; cursor: default; }
  .sa-app :focus-visible, .sa-signin-page :focus-visible { outline: 2px solid var(--money, #1F6B4F); outline-offset: 2px; }

  .sa-side { position: sticky; top: 0; height: 100vh; background: var(--forest); color: #fff; display: flex; flex-direction: column; padding: 24px 12px 16px; }
  .sa-logo { display: block; align-self: flex-start; height: auto; width: 116px; margin: 0 12px 32px; }
  .sa-nav { display: grid; gap: 2px; }
  .sa-nav button { display: flex; justify-content: space-between; align-items: center; width: 100%; background: none; border: 0; border-radius: 8px; padding: 9px 12px; text-align: left; color: #B9C7C0; font-weight: 500; }
  .sa-nav button:hover { color: #fff; background: rgba(255,255,255,0.05); }
  .sa-nav button[aria-current="page"] { color: #fff; background: var(--forest-2); }
  .sa-nav button:focus-visible, .sa-who button:focus-visible { outline-color: #fff; }
  .sa-count { min-width: 20px; padding: 0 6px; border-radius: 10px; background: var(--copper); color: #1F1208; font-size: 12px; font-weight: 700; text-align: center; }
  .sa-who { margin-top: auto; padding: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 13px; }
  .sa-who p { color: #DDE5E1; overflow-wrap: anywhere; }
  .sa-who button { background: none; border: 0; padding: 0; margin-top: 4px; color: #B9C7C0; text-decoration: underline; text-underline-offset: 2px; }

  .sa-main { min-width: 0; padding: 28px 32px 64px; }
  .sa-inner { max-width: 1240px; margin: 0 auto; display: grid; gap: 20px; }
  .sa-sample { background: var(--warn-bg); color: #5C3D00; border-radius: 8px; padding: 8px 12px; font-size: 13px; }
  .sa-error { background: var(--loss-bg); color: var(--loss); border-radius: 8px; padding: 8px 12px; font-size: 13px; }
  .sa-top { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .sa-top h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
  .sa-top-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .sa-updated { color: var(--ink-3); font-size: 13px; }

  .sa-seg { display: inline-flex; padding: 3px; gap: 2px; background: #E9EBEF; border-radius: 9px; }
  .sa-seg button { background: none; border: 0; border-radius: 7px; padding: 5px 11px; font-size: 13px; font-weight: 500; color: var(--ink-2); white-space: nowrap; }
  .sa-seg button[aria-pressed="true"] { background: var(--panel); color: var(--ink); box-shadow: 0 1px 2px rgba(16,24,40,0.12); }
  .sa-btn { background: var(--panel); border: 1px solid #D5D9E0; border-radius: 8px; padding: 6px 12px; font-size: 13px; font-weight: 500; }
  .sa-btn:hover:not(:disabled) { background: #F9FAFB; }
  .sa-app .sa-textbtn { background: none; border: 0; padding: 0; font-size: 13px; font-weight: 500; color: var(--money); }
  .sa-app .sa-textbtn:hover { text-decoration: underline; text-underline-offset: 2px; }

  .sa-panel { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; min-width: 0; }
  .sa-hero-head { padding: 24px 24px 4px; }
  .sa-hero-label { color: var(--ink-2); font-weight: 500; }
  .sa-hero-figure { font-size: 44px; line-height: 1.1; font-weight: 600; letter-spacing: -0.03em; margin-top: 6px !important; overflow-wrap: anywhere; }
  .sa-hero-sub { color: var(--ink-2); margin-top: 6px !important; }
  .sa-hero-sub b { color: var(--money); font-weight: 600; }
  .sa-curve { position: relative; min-height: 320px; padding: 0; touch-action: pan-y; }
  .sa-curve svg { display: block; cursor: crosshair; }
  .sa-axis { font-size: 12px; fill: var(--ink-3); font-variant-numeric: tabular-nums; }
  .sa-tip { position: absolute; top: 4px; pointer-events: none; background: var(--ink); color: #D0D5DD; border-radius: 8px; padding: 10px 12px; display: grid; gap: 1px; font-size: 12px; }
  .sa-tip strong { color: #fff; font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
  .sa-tip-date { color: #98A2B3; }
  .sa-curve-empty { display: grid; place-items: center; min-height: 240px; margin: 16px 24px 24px; border: 1px dashed #D5D9E0; border-radius: 8px; color: var(--ink-2); text-align: center; padding: 24px; }

  .sa-strip { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); }
  .sa-stat { padding: 16px 24px; }
  .sa-stat + .sa-stat { border-left: 1px solid var(--line); }
  .sa-stat-label { color: var(--ink-2); font-size: 13px; }
  .sa-stat-figure { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; margin-top: 2px !important; overflow-wrap: anywhere; }
  .sa-stat-note { color: var(--ink-3); font-size: 13px; }
  .sa-details { border-top: 1px solid var(--line); padding: 12px 24px; font-size: 13px; }
  .sa-details summary { cursor: pointer; color: var(--ink-2); font-weight: 500; }
  .sa-daily { border-collapse: collapse; margin-top: 8px; width: 100%; max-width: 520px; }
  .sa-daily th { text-align: left; font-weight: 500; color: var(--ink-3); padding: 6px 16px 6px 0; }
  .sa-daily td { padding: 6px 16px 6px 0; border-top: 1px solid var(--line-2); }

  .sa-cols { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 20px; align-items: start; }
  .sa-stack { display: grid; gap: 20px; min-width: 0; }
  .sa-phead { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 20px; flex-wrap: wrap; }
  .sa-phead h2 { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
  .sa-empty { padding: 4px 20px 20px; color: var(--ink-2); }

  .sa-table { width: 100%; border-collapse: collapse; }
  .sa-table th { text-align: left; font-size: 12px; font-weight: 500; color: var(--ink-3); background: #FAFBFC; padding: 8px 12px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); white-space: nowrap; }
  .sa-table td { padding: 11px 12px; border-bottom: 1px solid var(--line-2); vertical-align: middle; }
  .sa-table th:first-child, .sa-table td:first-child { padding-left: 20px; }
  .sa-table th:last-child, .sa-table td:last-child { padding-right: 20px; }
  .sa-table tbody tr { cursor: pointer; }
  .sa-table tbody tr:hover { background: #FAFBFC; }
  .sa-table tbody tr:last-child td { border-bottom: 0; }
  .sa-num { text-align: right !important; font-weight: 600; white-space: nowrap; }
  .sa-buyer { display: block; width: 100%; background: none; border: 0; padding: 0; text-align: left; font-weight: 500; overflow-wrap: anywhere; }
  .sa-subline { display: block; color: var(--ink-3); font-size: 13px; overflow-wrap: anywhere; }
  .sa-date { color: var(--ink-2); white-space: nowrap; }

  .sa-pill { display: inline-block; border-radius: 999px; padding: 2px 9px; font-size: 12px; font-weight: 500; white-space: nowrap; }
  .sa-pill-paid { background: var(--money-bg); color: var(--money); }
  .sa-pill-part { background: #EEF1F6; color: #344054; }
  .sa-pill-check, .sa-pill-overdue, .sa-pill-cancelled { background: var(--loss-bg); color: var(--loss); }
  .sa-pill-due { background: var(--warn-bg); color: var(--warn); }

  .sa-flags { display: grid; }
  .sa-flag { padding: 12px 20px; border-top: 1px solid var(--line-2); display: grid; gap: 4px; }
  .sa-flag-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; flex-wrap: wrap; }
  .sa-flag-name { font-weight: 500; }
  .sa-flag-amount { font-weight: 600; white-space: nowrap; }
  .sa-flag-note { color: var(--ink-2); font-size: 13px; }
  .sa-flag-contact { color: var(--ink-3); font-size: 13px; overflow-wrap: anywhere; }
  .sa-transfer { padding: 14px 20px; border-top: 1px solid var(--line-2); display: grid; gap: 4px; }
  .sa-transfer:first-child { border-top: 0; }
  .sa-transfer b { font-weight: 600; color: var(--ink); overflow-wrap: anywhere; }
  .sa-transfer-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 8px; }
  .sa-cta-sm { padding: 6px 12px; font-size: 13px; }
  .sa-check { padding: 12px 20px 16px; border-top: 1px solid var(--line-2); color: var(--ink-2); font-size: 13px; }

  .sa-bars { display: grid; gap: 14px; padding: 0 20px 20px; }
  .sa-bar-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 5px; }
  .sa-bar-row b { font-weight: 600; }
  .sa-bar-track { height: 6px; border-radius: 3px; background: var(--line-2); }
  .sa-bar-fill { height: 100%; border-radius: 3px; background: var(--money); }

  .sa-tools { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; padding: 14px 20px; }
  .sa-search { flex: 1 1 240px; min-width: 0; background: var(--panel); border: 1px solid #D5D9E0; border-radius: 8px; padding: 7px 12px; font-size: 14px; }
  .sa-search:focus { outline: 2px solid var(--money); outline-offset: -1px; border-color: transparent; }
  .sa-pager { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 20px; border-top: 1px solid var(--line); color: var(--ink-2); font-size: 13px; }
  .sa-pager div { display: flex; gap: 8px; }

  .sa-drawer { position: fixed; inset: 0 0 0 auto; margin: 0; height: 100dvh; max-height: 100dvh; width: min(440px, 100vw); max-width: 100vw; border: 0; padding: 0; background: var(--panel); color: var(--ink); box-shadow: -12px 0 40px rgba(16,24,40,0.16); font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 14px; overflow-y: auto; }
  .sa-drawer::backdrop { background: rgba(16,24,40,0.4); }
  .sa-drawer[open] { animation: sa-in 180ms ease-out; }
  @keyframes sa-in { from { transform: translateX(24px); opacity: 0; } to { transform: none; opacity: 1; } }
  .sa-drawer-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 24px; border-bottom: 1px solid var(--line); }
  .sa-drawer-figure { font-size: 30px; font-weight: 600; letter-spacing: -0.02em; margin: 6px 0 8px; font-feature-settings: "tnum" 1; }
  .sa-dl { padding: 8px 24px 24px; }
  .sa-dl > div { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--line-2); }
  .sa-dl dt { color: var(--ink-3); }
  .sa-dl dd { margin: 0; overflow-wrap: anywhere; }
  .sa-drawer .sa-btn { font: inherit; font-size: 13px; color: inherit; cursor: pointer; }

  .sa-receipt { padding: 20px 24px 24px; display: grid; gap: 14px; justify-items: start; }
  .sa-receipt img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: 8px; }
  .sa-receipt iframe { width: 100%; height: 70vh; border: 1px solid var(--line); border-radius: 8px; }
  .sa-btn-link { display: inline-block; color: var(--ink); text-decoration: none; }
  .sa-skel { background: var(--line-2); border-radius: 12px; animation: sa-pulse 1.4s ease-in-out infinite; }
  @keyframes sa-pulse { 50% { opacity: 0.55; } }

  .sa-signin-page { min-height: 100vh; display: grid; place-items: center; padding: 24px 16px; background: #12291F; font-family: "Hanken Grotesk", system-ui, sans-serif; color: #101828; }
  .sa-signin-wrap { width: 100%; max-width: 400px; display: grid; gap: 28px; }
  .sa-signin-logo { height: auto; width: 140px; justify-self: center; }
  .sa-signin { background: #fff; border-radius: 14px; padding: 28px; display: grid; gap: 16px; }
  .sa-signin h1 { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; margin: 0; }
  .sa-signin p { margin: 0; font-size: 14px; color: #475467; }
  .sa-field { display: grid; gap: 6px; font-size: 13px; font-weight: 500; color: #344054; }
  .sa-field input { background: #fff; border: 1px solid #D5D9E0; border-radius: 8px; padding: 10px 12px; font-size: 16px; font-weight: 400; color: #101828; }
  .sa-field input:focus { outline: 2px solid #1F6B4F; outline-offset: -1px; border-color: transparent; }
  .sa-cta { background: #1F6B4F; color: #fff !important; border: 0; border-radius: 8px; padding: 11px 16px; font-weight: 600; cursor: pointer; }
  .sa-cta:hover:not(:disabled) { background: #195A42; }
  .sa-cta:disabled { opacity: 0.5; cursor: default; }
  .sa-signin-link { justify-self: center; background: none; border: 0; padding: 0; font-size: 13px; color: #475467; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }

  @media (max-width: 1040px) {
    .sa-cols { grid-template-columns: minmax(0, 1fr); }
  }
  @media (max-width: 800px) {
    .sa-app { grid-template-columns: minmax(0, 1fr); }
    .sa-side { position: static; height: auto; padding: 14px 16px 8px; }
    .sa-logo { margin: 0 0 12px; width: 96px; }
    .sa-nav { display: flex; overflow-x: auto; gap: 4px; }
    .sa-nav button { padding: 7px 10px; gap: 8px; white-space: nowrap; }
    .sa-who { display: none; }
    .sa-main { padding: 20px 16px 48px; }
    .sa-hero-head { padding: 20px 16px 4px; }
    .sa-hero-figure { font-size: 34px; }
    .sa-strip { grid-template-columns: 1fr 1fr; }
    .sa-stat { padding: 14px 16px; }
    .sa-stat:nth-child(3) { grid-column: 1 / -1; border-left: 0; border-top: 1px solid var(--line); }
    .sa-details { padding: 12px 16px; }
    .sa-seg { max-width: 100%; }
    .sa-table thead { display: none; }
    .sa-table, .sa-table tbody { display: block; }
    .sa-table tbody tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 12px; padding: 12px 16px; border-top: 1px solid var(--line-2); }
    .sa-table td, .sa-table td:first-child, .sa-table td:last-child { padding: 0; border: 0; }
    .sa-td-buyer { grid-column: 1; grid-row: 1; }
    .sa-table td.sa-num { grid-column: 2; grid-row: 1; }
    .sa-td-pass { grid-column: 1; grid-row: 2; color: var(--ink-2); font-size: 13px; }
    .sa-td-status { grid-column: 2; grid-row: 2; justify-self: end; }
    .sa-td-date { grid-column: 1 / -1; grid-row: 3; font-size: 13px; }
    .sa-tools, .sa-phead, .sa-pager { padding-left: 16px; padding-right: 16px; }
    .sa-flag { padding-left: 16px; padding-right: 16px; }
    .sa-check { padding-left: 16px; padding-right: 16px; }
    .sa-transfer { padding-left: 16px; padding-right: 16px; }
    .sa-bars { padding: 0 16px 16px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sa-drawer[open], .sa-skel { animation: none; }
  }
`;
