'use client';

import { useState } from 'react';

// Phone version of the benefit matrix: pick a pass, read its benefits as one column.
// The full table stays for wider screens, where every pass fits side by side.

type Cell = 'yes' | 'no' | 'partial';

const INK = '#1B1E1C';
const MUTED = '#8D948E';

export function CompareMobile({ passes, features, matrix }: {
  passes: { id: string; name: string; price: string }[];
  features: string[];
  matrix: Cell[][];
}) {
  const [active, setActive] = useState(passes.length - 1);
  const pass = passes[active];
  const rows = features.map((f, i) => ({ feature: f, val: matrix[i][active] }));
  const included = rows.filter((r) => r.val !== 'no');
  const excluded = rows.filter((r) => r.val === 'no');

  return (
    <div className="cm">
      <div className="cm-tabs" role="tablist" aria-label="Choose a pass">
        {passes.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`cm-tab${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={`${pass.name} benefits`}>
        <p className="cm-price">{pass.name} <span>{pass.price}</span></p>
        <ul className="cm-list">
          {included.map((r) => (
            <li key={r.feature}>
              <span className={r.val === 'partial' ? 'cm-mark cm-partial' : 'cm-mark'} aria-hidden="true" />
              <span>{r.feature}{r.val === 'partial' && <em> · selected sessions only</em>}</span>
            </li>
          ))}
        </ul>
        {excluded.length > 0 && (
          <>
            <p className="cm-sub">Not included</p>
            <ul className="cm-list cm-list-out">
              {excluded.map((r) => (
                <li key={r.feature}><span className="cm-dash" aria-hidden="true" /><span>{r.feature}</span></li>
              ))}
            </ul>
          </>
        )}
      </div>

      <style>{`
        .cm-tabs { display: grid; grid-template-columns: repeat(${passes.length}, 1fr); border-bottom: 1px solid #DBDFDB; margin-bottom: 28px; }
        .cm-tab { background: transparent; border: 0; padding: 14px 0 12px; font-family: SaolDisplay, Georgia, serif; font-size: 1.15rem; color: ${MUTED}; cursor: pointer; position: relative; }
        .cm-tab.is-active { color: ${INK}; }
        .cm-tab.is-active::after { content: ''; position: absolute; left: 20%; right: 20%; bottom: -1px; height: 2px; background: ${INK}; }
        .cm-tab:focus-visible { outline: 2px solid ${INK}; outline-offset: -2px; }
        .cm-price { font-family: SaolDisplay, Georgia, serif; font-size: 1.6rem; color: ${INK}; margin: 0 0 18px; }
        .cm-price span { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 14px; color: ${MUTED}; margin-left: 8px; }
        .cm-list { list-style: none; margin: 0; padding: 0; }
        .cm-list li { display: flex; gap: 14px; align-items: baseline; padding: 13px 0; border-bottom: 1px solid #E4E7E4; font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 15px; line-height: 1.45; color: #3A403C; }
        .cm-list em { font-style: normal; color: ${MUTED}; font-size: 13px; }
        .cm-list-out li { color: ${MUTED}; }
        .cm-mark { flex: 0 0 8px; width: 8px; height: 8px; border-radius: 50%; background: ${INK}; transform: translateY(-1px); }
        .cm-partial { background: transparent; border: 1.5px solid ${INK}; }
        .cm-dash { flex: 0 0 8px; width: 8px; height: 1px; background: #B7BBB7; transform: translateY(-4px); }
        .cm-sub { font-family: "Hanken Grotesk", system-ui, sans-serif; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: ${MUTED}; margin: 32px 0 4px; }
      `}</style>
    </div>
  );
}
