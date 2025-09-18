'use client';

import React, { useEffect, useState } from 'react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAt,
  endAt,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

type SessionType = 'keynote' | 'workshop' | 'panel' | 'breakout' | 'networking';

type NewSession = {
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  room: string;
  capacity?: string; // text field -> number on save
  type: SessionType;
  requiresRegistration: boolean;
};

type ExistingSession = {
  id: string;
  title: string;
  date?: string | null;
  time?: string | null;
  type?: SessionType | null;
};

const SESSION_TYPES: SessionType[] = [
  'keynote',
  'workshop',
  'panel',
  'breakout',
  'networking',
];

const emptySession = (): NewSession => ({
  title: '',
  date: '',
  time: '',
  duration: '',
  location: '',
  room: '',
  capacity: '',
  type: 'workshop',
  requiresRegistration: false,
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function AdminSpeakerCreatePage() {
  // ───────────────── SPEAKER STATE ─────────────────
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [topic, setTopic] = useState(''); // card headline
  const [bio, setBio] = useState('');

  // Key that maps to your bundled image
  const [photoAssetKey, setPhotoAssetKey] = useState('');

  // ───────────────── NEW SESSIONS ─────────────────
  const [newSessions, setNewSessions] = useState<NewSession[]>([emptySession()]);

  // ───────────────── ATTACH EXISTING ──────────────
  const [attachQuery, setAttachQuery] = useState('');
  const [attachResults, setAttachResults] = useState<ExistingSession[]>([]);
  const [selectedExistingIds, setSelectedExistingIds] = useState<Set<string>>(new Set());

  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && photoAssetKey.trim().length > 0;

  // Auto-slugify on name change (editable)
  useEffect(() => {
    if (!slug.trim()) setSlug(slugify(name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  // Prefix search (title) with debounce
  useEffect(() => {
    const id: ReturnType<typeof setTimeout> = setTimeout(async () => {
      if (!attachQuery.trim()) {
        setAttachResults([]);
        return;
      }
      const sessionsRef = collection(db, 'sessions');
      const q = query(
        sessionsRef,
        orderBy('title'),
        startAt(attachQuery),
        endAt(attachQuery + '\uf8ff'),
        limit(12)
      );
      const snap = await getDocs(q);

      type Raw = {
        title?: string;
        date?: string | null;
        time?: string | null;
        type?: SessionType | null;
      };

      const rows: ExistingSession[] = snap.docs.map((d) => {
        const data = d.data() as Raw;
        return {
          id: d.id,
          title: data.title ?? '(untitled)',
          date: data.date ?? null,
          time: data.time ?? null,
          type: data.type ?? null,
        };
      });
      setAttachResults(rows);
    }, 300);
    return () => clearTimeout(id);
  }, [attachQuery]);

  const toggleAttach = (sid: string) => {
    setSelectedExistingIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(sid)) {
        copy.delete(sid);
      } else {
        copy.add(sid);
      }
      return copy;
    });
  };

  const addSessionRow = () => setNewSessions((s) => [...s, emptySession()]);
  const removeSessionRow = (i: number) =>
    setNewSessions((s) => s.filter((_, idx) => idx !== i));
  const updateSession = (i: number, patch: Partial<NewSession>) =>
    setNewSessions((s) => s.map((row, idx) => (i === idx ? { ...row, ...patch } : row)));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    try {
      // 1) Create speaker shell (no uploads)
      const speakerRef = await addDoc(collection(db, 'speakers'), {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        title: title.trim() || null,
        company: company.trim() || null,
        topic: topic.trim() || null,
        bio: bio.trim() || null,
        photoAssetKey: photoAssetKey.trim(), // <-- critical link to your assets
        sessionIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const speakerId = speakerRef.id;

      // 2) Create new sessions (only those with a title)
      const toCreate = newSessions
        .map((s) => ({ ...s, title: s.title.trim() }))
        .filter((s) => s.title);

      const createdIds: string[] = [];
      for (const s of toCreate) {
        const sRef = await addDoc(collection(db, 'sessions'), {
          title: s.title,
          date: s.date || null,
          time: s.time || null,
          duration: s.duration || null,
          location: s.location || null,
          room: s.room || null,
          capacity: s.capacity ? Number(s.capacity) : null,
          type: SESSION_TYPES.includes(s.type) ? s.type : 'workshop',
          requiresRegistration: Boolean(s.requiresRegistration),
          speakers: [speakerId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        createdIds.push(sRef.id);
      }

      // 3) Link all sessions <-> speaker
      const allSessionIds = [...Array.from(selectedExistingIds), ...createdIds];

      const batch = writeBatch(db);
      batch.set(
        doc(db, 'speakers', speakerId),
        { sessionIds: allSessionIds, updatedAt: serverTimestamp() },
        { merge: true }
      );
      for (const sid of allSessionIds) {
        batch.set(
          doc(db, 'sessions', sid),
          { speakers: arrayUnion(speakerId), updatedAt: serverTimestamp() },
          { merge: true }
        );
      }
      await batch.commit();

      alert(`Saved ${name} • linked ${allSessionIds.length} session(s).`);

      // reset
      setName('');
      setSlug('');
      setTitle('');
      setCompany('');
      setTopic('');
      setBio('');
      setPhotoAssetKey('');
      setNewSessions([emptySession()]);
      setAttachQuery('');
      setAttachResults([]);
      setSelectedExistingIds(new Set());
    } catch (err: unknown) {
      console.error(err);
      const msg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to save';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  // shared input class with forced black text & readable placeholder
  const inputCls =
    'rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 text-black placeholder-slate-500';
  const selectCls =
    'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 text-black';
  const textareaCls =
    'min-h-[110px] rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 text-black placeholder-slate-500';

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900">
        Create Speaker & Attach Sessions
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* SPEAKER */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Speaker</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Dr. Sarah Johnson"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">Slug (auto)</span>
              <input
                className={inputCls}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sarah-johnson"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">Title</span>
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chief Innovation Officer"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">Company</span>
              <input
                className={inputCls}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="TechAfrica Inc."
              />
            </label>

            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Card Headline (Topic)</span>
              <input
                className={inputCls}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="AI for Social Good"
              />
            </label>

            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Photo Asset Key (no upload; matches your shipped asset name)
              </span>
              <input
                className={inputCls}
                value={photoAssetKey}
                onChange={(e) => setPhotoAssetKey(e.target.value)}
                required
                placeholder="sarah-johnson"
              />
              <p className="text-xs text-slate-500 mt-1">
                Put your images in <code>/public/speakers/&lt;key&gt;.png</code> (web) and in the RN
                bundle with the same key. Example: <strong>sarah-johnson</strong>.
              </p>
            </label>
          </div>

          <label className="mt-3 grid gap-1">
            <span className="text-sm font-semibold text-slate-700">Bio</span>
            <textarea
              className={textareaCls}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief speaker biography..."
            />
          </label>
        </section>

        {/* ATTACH EXISTING SESSIONS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Attach Existing Sessions</h2>

          <input
            className={inputCls + ' w-full'}
            placeholder="Search sessions by title…"
            value={attachQuery}
            onChange={(e) => setAttachQuery(e.target.value)}
          />

          {attachResults.length > 0 && (
            <div className="mt-3 divide-y overflow-hidden rounded-xl border border-slate-200">
              {attachResults.map((s) => (
                <label key={s.id} className="flex items-center gap-3 bg-white px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedExistingIds.has(s.id)}
                    onChange={() => toggleAttach(s.id)}
                  />
                  <span className="font-medium text-slate-900">{s.title}</span>
                  <span className="text-slate-500">
                    {s.date ? `• ${s.date}` : ''}
                    {s.time ? ` • ${s.time}` : ''}
                    {s.type ? ` • ${s.type}` : ''}
                  </span>
                </label>
              ))}
            </div>
          )}

          <p className="mt-2 text-xs text-slate-500">
            Tip: leave blank if you’ll only create new sessions below.
          </p>
        </section>

        {/* CREATE NEW SESSIONS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">New Sessions for this Speaker</h2>
            <button
              type="button"
              onClick={addSessionRow}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              + Add another session
            </button>
          </div>

          <div className="space-y-4">
            {newSessions.map((row, idx) => (
              <div key={idx} className="rounded-xl border border-dashed border-slate-300 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <strong className="text-sm text-slate-900">Session #{idx + 1}</strong>
                  {newSessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSessionRow(idx)}
                      className="text-sm font-semibold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-slate-700">Title</span>
                  <input
                    className={inputCls}
                    value={row.title}
                    onChange={(e) => updateSession(idx, { title: e.target.value })}
                    placeholder="Hands-on Machine Learning"
                  />
                </label>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Date (YYYY-MM-DD)</span>
                    <input
                      className={inputCls}
                      value={row.date}
                      onChange={(e) => updateSession(idx, { date: e.target.value })}
                      placeholder="2025-10-06"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Time (HH:mm)</span>
                    <input
                      className={inputCls}
                      value={row.time}
                      onChange={(e) => updateSession(idx, { time: e.target.value })}
                      placeholder="09:00"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Duration</span>
                    <input
                      className={inputCls}
                      value={row.duration}
                      onChange={(e) => updateSession(idx, { duration: e.target.value })}
                      placeholder="60 min"
                    />
                  </label>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Location</span>
                    <input
                      className={inputCls}
                      value={row.location}
                      onChange={(e) => updateSession(idx, { location: e.target.value })}
                      placeholder="Main Hall"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Room</span>
                    <input
                      className={inputCls}
                      value={row.room}
                      onChange={(e) => updateSession(idx, { room: e.target.value })}
                      placeholder="Room A"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Capacity (optional)</span>
                    <input
                      type="number"
                      min={0}
                      className={inputCls}
                      value={row.capacity ?? ''}
                      onChange={(e) => updateSession(idx, { capacity: e.target.value })}
                      placeholder="60"
                    />
                  </label>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Type</span>
                    <select
                      className={selectCls}
                      value={row.type}
                      onChange={(e) => updateSession(idx, { type: e.target.value as SessionType })}
                    >
                      {SESSION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">
                      Requires Registration?
                    </span>
                    <select
                      className={selectCls}
                      value={row.requiresRegistration ? 'yes' : 'no'}
                      onChange={(e) =>
                        updateSession(idx, { requiresRegistration: e.target.value === 'yes' })
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canSave || saving}
            className="inline-flex items-center justify-center rounded-xl bg-[#1B365D] px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Speaker + Links'}
          </button>

          <button
            type="button"
            onClick={() => {
              setName('');
              setSlug('');
              setTitle('');
              setCompany('');
              setTopic('');
              setBio('');
              setPhotoAssetKey('');
              setNewSessions([emptySession()]);
              setAttachQuery('');
              setAttachResults([]);
              setSelectedExistingIds(new Set());
            }}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}