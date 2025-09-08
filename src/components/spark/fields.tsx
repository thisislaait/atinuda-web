import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export function TextField({
  label,
  hint,
  error,
  reg,
  type = 'text',
  placeholder,
}: {
  label: string;
  hint?: string;
  error?: string;
  reg: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}
      <input
        {...reg}
        type={type}
        placeholder={placeholder}
        className={[
          'mt-1 w-full rounded-xl border px-3 py-2 outline-none',
          error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-slate-200',
        ].join(' ')}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  error,
  reg,
  rows = 4,
  placeholder,
}: {
  label: string;
  hint?: string;
  error?: string;
  reg: UseFormRegisterReturn;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}
      <textarea
        {...reg}
        rows={rows}
        placeholder={placeholder}
        className={[
          'mt-1 w-full rounded-xl border px-3 py-2 outline-none',
          error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-slate-200',
        ].join(' ')}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export function SelectField({
  label,
  error,
  reg,
  children,
}: {
  label: string;
  error?: string;
  reg: UseFormRegisterReturn;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        {...reg}
        className={[
          'mt-1 w-full rounded-xl border bg-white px-3 py-2',
          error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-slate-200',
        ].join(' ')}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export function CheckboxField({
  label,
  error,
  reg,
}: {
  label: string;
  error?: string;
  reg: UseFormRegisterReturn;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        {...reg}
        className={['h-4 w-4 rounded border', error ? 'border-red-500' : 'border-slate-400'].join(' ')}
      />
      <span className="text-sm text-slate-800">{label}</span>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
