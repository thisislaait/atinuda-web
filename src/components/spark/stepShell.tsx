import React from 'react';

export function StepShell({
  title,
  helper,
  children,
  canNext,
  onPrev,
  onNext,
  isLast,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isLast?: boolean;
}) {
  return (
    <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      {helper && <p className="mt-1 text-sm text-slate-600">{helper}</p>}
      <div className="mt-6">{children}</div>
      <div className="sticky bottom-0 mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="w-full rounded-xl px-4 py-2 ring-1 ring-slate-300 hover:bg-slate-50 sm:w-auto"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={[
            'w-full rounded-xl px-4 py-2 font-medium sm:w-auto',
            canNext ? 'bg-slate-900 text-white hover:opacity-90' : 'bg-slate-200 text-slate-500',
          ].join(' ')}
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
