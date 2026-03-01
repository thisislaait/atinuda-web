'use client';

import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { speakerSlotSessions } from '@/data/speakerSlots';

type SelectionState = Record<string, string>;
const fullSpeakerSlotOptionIds = new Set<string>([
  'd2-spa-day-experience',
  'd6-rum-track',
  'd6-pottery-track',
]);

const buildInitialSelections = (): SelectionState =>
  Object.fromEntries(speakerSlotSessions.map((session) => [session.id, '']));

export default function SpeakerSlotsPage() {
  const params = useParams<{ eventslug: string }>();
  const eventSlug = Array.isArray(params?.eventslug) ? params.eventslug[0] : (params?.eventslug ?? '');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selections, setSelections] = useState<SelectionState>(() => buildInitialSelections());
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const allSessionsSelected = useMemo(
    () => speakerSlotSessions.every((session) => Boolean(selections[session.id])),
    [selections]
  );

  const isReadyToSubmit =
    Boolean(eventSlug) &&
    Boolean(firstName.trim()) &&
    Boolean(lastName.trim()) &&
    Boolean(email.trim()) &&
    allSessionsSelected &&
    !submitting;

  const handleSessionSelection = (sessionId: string, optionId: string) => {
    setSelections((current) => ({
      ...current,
      [sessionId]: optionId,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!eventSlug) {
      setErrorMessage('Missing event slug in URL.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/events/${encodeURIComponent(eventSlug)}/speaker-slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          selections,
        }),
      });

      const body = (await response.json()) as { ok?: boolean; message?: string; id?: string };
      if (!response.ok || !body.ok) {
        throw new Error(body.message ?? 'Unable to save selections.');
      }

      setSuccessMessage(`Selection saved successfully. Record ID: ${body.id ?? 'N/A'}`);
      setSelections(buildInitialSelections());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save selections.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#171412]">
      <section className="relative overflow-hidden px-6 pb-16 pt-28 md:pb-20 md:pt-36">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Tourism.jpg"
            alt="Mauritius experience"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,9,8,0.78)] via-[rgba(10,9,8,0.48)] to-[rgba(10,9,8,0.68)]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[#f2eadc]">Atinuda Retreat 2026</p>
          <h1 className="hero-text mt-4 max-w-3xl text-4xl leading-[1.05] text-[#f8f3ea] md:text-6xl">
            Select Your Workshops and Experiences
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#e7dece] md:text-base">
            Complete your speaker slots and experience picks for Day 2, Day 4, Day 5, and Day 6.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-14 md:pb-20">
        <div className="rounded-[30px] border border-[#d5cebf] bg-[#fbf8f3] p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-[#7b7468]">Speaker Slots</p>
        <h1 className="mt-3 text-3xl leading-tight text-[#1b1612] md:text-4xl">
          Workshop & Experience Selection
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#2a241c] md:text-base">
          Event: <span className="font-semibold">{eventSlug || 'Missing event slug'}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#7b7468]">Delegate Details</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#5b5348]">
                  Firstname
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(inputEvent) => setFirstName(inputEvent.target.value)}
                  required
                  className="w-full rounded-xl border border-[#d2cab9] bg-[#fffdf9] px-4 py-3 text-sm text-[#211c16] outline-none transition focus:border-[#95856f]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#5b5348]">
                  Lastname
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(inputEvent) => setLastName(inputEvent.target.value)}
                  required
                  className="w-full rounded-xl border border-[#d2cab9] bg-[#fffdf9] px-4 py-3 text-sm text-[#211c16] outline-none transition focus:border-[#95856f]"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#5b5348]">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                  required
                  className="w-full rounded-xl border border-[#d2cab9] bg-[#fffdf9] px-4 py-3 text-sm text-[#211c16] outline-none transition focus:border-[#95856f]"
                />
              </label>
            </div>
          </div>

          <div className="space-y-8">
            {speakerSlotSessions.map((session) => {
              const firstSelectableOptionIndex = session.options.findIndex(
                (option) => !fullSpeakerSlotOptionIds.has(option.id)
              );

              return (
                <fieldset
                  key={session.id}
                  className="rounded-2xl border border-[#dbd2c3] bg-[#fefcf8] p-5 md:p-6"
                >
                  <legend className="px-2 text-sm uppercase tracking-[0.2em] text-[#4f473b]">
                    {session.label}
                  </legend>
                  <p className="mt-3 text-sm text-[#6a6256]">{session.heading}</p>

                  <div className="mt-4 space-y-3">
                    {session.options.map((option, optionIndex) => {
                      const radioId = `${session.id}-${option.id}`;
                      const isOptionFull = fullSpeakerSlotOptionIds.has(option.id);

                      return (
                        <label
                          key={radioId}
                          htmlFor={radioId}
                          className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition ${
                            isOptionFull
                              ? 'cursor-not-allowed border-[#d7d2c8] bg-[#f2f0ea]'
                              : 'cursor-pointer border-[#e3dbcd] bg-[#fffefb] hover:border-[#bcae99]'
                          }`}
                        >
                          <input
                            id={radioId}
                            type="radio"
                            name={session.id}
                            value={option.id}
                            checked={selections[session.id] === option.id}
                            onChange={(inputEvent) =>
                              handleSessionSelection(session.id, inputEvent.target.value)
                            }
                            disabled={isOptionFull}
                            required={
                              firstSelectableOptionIndex !== -1 &&
                              optionIndex === firstSelectableOptionIndex
                            }
                            className={`mt-1 h-4 w-4 ${
                              isOptionFull
                                ? 'border-[#b8b2a7] text-[#b8b2a7] focus:ring-0'
                                : 'border-[#9c8c77] text-[#2f2921] focus:ring-[#9c8c77]'
                            }`}
                          />
                          <span
                            className={`text-sm leading-relaxed ${
                              isOptionFull ? 'text-[#8e877b]' : 'text-[#251f18]'
                            }`}
                          >
                            <strong>{option.topic}</strong> - {option.speaker}
                            {isOptionFull ? (
                              <span className="ml-2 rounded-full border border-[#c6c0b4] px-2 py-0.5 text-[11px] uppercase tracking-[0.14em]">
                                Full
                              </span>
                            ) : null}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          {errorMessage ? <p className="text-sm text-[#8d1f1f]">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-[#0f5c34]">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={!isReadyToSubmit}
            className="inline-flex items-center rounded-full border border-[#1d1915] bg-[#1d1915] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#f6f3ee] transition hover:bg-[#2b251f] disabled:cursor-not-allowed disabled:border-[#a59b8b] disabled:bg-[#a59b8b]"
          >
            {submitting ? 'Submitting...' : 'Submit Selection'}
          </button>
        </form>
        </div>
      </section>
    </main>
  );
}
