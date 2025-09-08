import React from 'react';

type Step = {
  key: string;
  label: string;
  done?: boolean;
  disabled?: boolean;
};

export function Stepper({
  steps,
  currentIndex,
  onClick,
}: {
  steps: Step[];
  currentIndex: number;
  onClick?: (i: number) => void;
}) {
  return (
    <ol className="flex w-full items-center justify-between gap-2">
      {steps.map((s, i) => {
        const active = i === currentIndex;
        const clickable = onClick && i < currentIndex && !s.disabled;
        return (
          <li key={s.key} className="flex-1">
            <button
              type="button"
              onClick={() => clickable && onClick!(i)}
              className={[
                'group flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left',
                active
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700',
                clickable ? 'hover:border-slate-900' : 'opacity-100',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  active ? 'bg-white text-slate-900' : 'bg-slate-900 text-white',
                ].join(' ')}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium">{s.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}