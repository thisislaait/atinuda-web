'use client'

import React, { useState } from 'react';
import { storage, auth } from '@/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export function UploadField({
  value,
  onChange,
  disabled,
  docHint,
}: {
  value?: { url: string; name: string; size: number } | null;
  onChange: (v: { url: string; name: string; size: number } | null) => void;
  disabled?: boolean;
  docHint?: string;
}) {
  const [progress, setProgress] = useState<number>(0);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      alert('Only PDF allowed');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      alert('Max 20MB');
      return;
    }
    const user = auth.currentUser; // anonymous ok
    const key = `spark2025-tempuploads/${user?.uid || 'anon'}/${Date.now()}-${f.name}`;
    const r = ref(storage, key);
    const task = uploadBytesResumable(r, f, { contentType: f.type });
    task.on(
      'state_changed',
      (snap) => {
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      (err) => {
        console.error(err);
        alert('Upload failed');
        setProgress(0);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange({ url, name: f.name, size: f.size });
      }
    );
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-800">Slide deck (PDF, ≤20MB)</p>
          {docHint && <p className="text-xs text-slate-500">{docHint}</p>}
        </div>
        <label className="inline-flex cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50">
          <input
            type="file"
            accept="application/pdf"
            onChange={onPick}
            className="hidden"
            disabled={disabled}
          />
          Choose file
        </label>
      </div>
      {progress > 0 && progress < 100 && (
        <div className="mt-3 h-2 w-full rounded bg-slate-100">
          <div className="h-2 rounded bg-slate-900" style={{ width: `${progress}%` }} />
        </div>
      )}
      {value && (
        <p className="mt-3 text-sm text-slate-700">
          Selected{' '}
          <a href={value.url} target="_blank" className="underline">
            {value.name}
          </a>{' '}
          ({Math.round(value.size / 1024)} KB)
        </p>
      )}
    </div>
  );
}
