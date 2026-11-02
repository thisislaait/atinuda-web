'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { formatNaira } from '@/lib/atinuda7Checkout';

export type CurvePoint = { day: string; received: number; total: number };

const LINE = '#1F6B4F';
const HEIGHT = 320;
const M = { top: 20, right: 24, bottom: 32, left: 72 };

const shortDay = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const longDay = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const compact = (n: number) => {
  if (n >= 1_000_000) return `₦${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${+(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
};

// Clean axis steps: 1, 2 or 5 times a power of ten, about four intervals.
function yTicks(max: number) {
  if (max <= 0) return [0, 100_000];
  const rough = max / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = ([1, 2, 5, 10].find((m) => m * power >= rough) ?? 10) * power;
  const ticks = [0];
  while (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

export default function EquityCurve({ points }: { points: CurvePoint[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const last = points.length - 1;
  const ticks = useMemo(() => yTicks(points[last]?.total ?? 0), [points, last]);
  const yMax = ticks[ticks.length - 1];
  const left = width < 480 ? 52 : M.left;
  const right = width < 480 ? 12 : M.right;
  const plotW = Math.max(width - left - right, 1);
  const plotH = HEIGHT - M.top - M.bottom;
  const x = (i: number) => left + (last > 0 ? (i / last) * plotW : plotW);
  const y = (v: number) => M.top + plotH - (v / yMax) * plotH;

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.total).toFixed(1)}`).join('');
  const area = `${line}L${x(last).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`;

  // Fewer date labels on a narrow screen so they never collide.
  const labelCount = width < 480 ? 3 : 6;
  const labels = Array.from(new Set(Array.from({ length: labelCount }, (_, i) => Math.round((i / (labelCount - 1)) * last))));

  const pointerToIndex = (clientX: number, rect: DOMRect) => {
    const ratio = (clientX - rect.left - left) / plotW;
    return Math.min(last, Math.max(0, Math.round(ratio * last)));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const current = active ?? last;
    if (e.key === 'ArrowLeft') setActive(Math.max(0, current - 1));
    else if (e.key === 'ArrowRight') setActive(Math.min(last, current + 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else return;
    e.preventDefault();
  };

  const shown = active !== null ? points[active] : null;
  const tipWidth = 196;
  const tipLeft = active !== null ? Math.min(Math.max(x(active) - tipWidth / 2, 0), Math.max(width - tipWidth, 0)) : 0;
  const end = points[last];

  return (
    <div className="sa-curve" ref={wrap}>
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          tabIndex={0}
          aria-label={`Equity curve from ${longDay(points[0].day)} to ${longDay(end.day)}, reaching ${formatNaira(end.total)}. Use the left and right arrow keys to read each day.`}
          onPointerMove={(e) => setActive(pointerToIndex(e.clientX, e.currentTarget.getBoundingClientRect()))}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(last)}
          onBlur={() => setActive(null)}
          onKeyDown={onKey}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={left} x2={width - right} y1={y(t)} y2={y(t)} stroke="#ECEEF1" strokeWidth={1} />
              <text x={left - 12} y={y(t) + 4} textAnchor="end" className="sa-axis">{compact(t)}</text>
            </g>
          ))}
          {labels.map((i) => (
            <text key={i} x={x(i)} y={HEIGHT - 8} textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'} className="sa-axis">
              {shortDay(points[i].day)}
            </text>
          ))}
          <path d={area} fill={LINE} fillOpacity={0.08} />
          <path d={line} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {active !== null && <line x1={x(active)} x2={x(active)} y1={M.top} y2={y(0)} stroke="#B8BEC8" strokeWidth={1} />}
          <circle cx={x(active ?? last)} cy={y(points[active ?? last].total)} r={4.5} fill={LINE} stroke="#FFFFFF" strokeWidth={2} />
        </svg>
      )}
      {shown && (
        <div className="sa-tip" style={{ left: tipLeft, width: tipWidth }} aria-live="polite">
          <span className="sa-tip-date">{longDay(shown.day)}</span>
          <strong>{formatNaira(shown.total)}</strong>
          <span>{shown.received > 0 ? `+${formatNaira(shown.received)} that day` : 'Nothing that day'}</span>
        </div>
      )}
    </div>
  );
}
