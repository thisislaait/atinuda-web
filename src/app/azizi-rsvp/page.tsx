"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type RSVP = "yes" | "no" | "maybe";

export default function AziziRSVPPage() {
  const [rsvp, setRsvp] = useState<RSVP>("no");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const event = useMemo(
    () => ({
      name: "Azizi by Atinuda",
      dateISO: "2025-10-06",
      dateText: "October 6th 2025",
      venue: "the library, Victoria Island",
    }),
    []
  );

  const [form, setForm] = useState({
    name: "",
    company: "",
    ticketNumber: "",
    email: "",
    mobile: "",
  });

  const wantsEmail = rsvp === "yes" || rsvp === "maybe";

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!form.name.trim() || !form.mobile.trim() || !form.ticketNumber.trim()) {
      setMessage("Please enter your name and mobile.");
      return;
    }

    if (wantsEmail && !form.email.trim()) {
      setMessage("Email is required for Yes/Maybe RSVP.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        eventName: event.name,
        eventDate: event.dateISO,
        eventVenue: event.venue,
        rsvp,
        name: form.name.trim(),
        company: form.company.trim() || null,
        ticketNumber: form.ticketNumber.trim() || null,
        email: form.email.trim() || null,
        mobile: form.mobile.trim(),
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage("Thank you — your RSVP has been recorded.");
      setForm({ name: "", company: "", ticketNumber: "", email: "", mobile: "" });
      setRsvp("no");
    } catch (err: unknown) {
      console.error(err);
      setMessage("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Heights + sources for a true Pinterest-style masonry using azizi1.jpeg - azizi9.jpeg
  const heights = [180, 260, 210, 320, 200, 300, 230, 280, 220, 340, 240, 300];
  const images = useMemo(() => {
    const base = Array.from({ length: 9 }, (_, i) => `/assets/images/azizi${i + 1}.jpeg`);
    // Make 12 tiles by looping over the 9 assets
    return Array.from({ length: 9 }, (_, i) => base[i % base.length]);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#ffffff] text-black">
        <div className="relative w-full h-[400px]">
                <Image src="/assets/images/elementtwo.png" alt="Ticket Banner" fill className="object-cover" />
                <div className="absolute inset-0 z-10 bg-black/40" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <h1 className="text-4xl md:text-6xl text-white font-bold text-center hero-text">
                    RSVP To Azizi
                  </h1>
                </div>
              </div>

      <div className="mx-auto max-w-6xl p-6 lg:p-10">
        <div className="grid items-start gap-7 lg:grid-cols-2">

          {/* LEFT — Masonry with Next/Image */}
          <section
            aria-label="Event moodboard"
            className="[&>*]:mb-4 columns-1 sm:columns-2 lg:columns-3"
            style={{ columnGap: 16 }}
          >
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="break-inside-avoid inline-block w-full overflow-hidden rounded-xl bg-[#111318] shadow-xl"
              >
                <div className="relative w-full" style={{ height: heights[i] }}>
                  <Image
                    src={src}
                    alt={`Azizi gallery ${i + 1}`}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                    priority={i < 3}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* RIGHT — Form over artwork, using Next/Image for the background */}
          <section className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Background artwork */}
            <div className="absolute inset-0 -z-10">
              <Image src="/assets/images/elementthree.png" alt="" fill className="object-cover" priority />
            </div>
            {/* Dark gradient overlay for legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-[#ffffff]/40 to-[#ffffff]/80" />

            <div className="relative z-10 p-6 sm:p-8">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#192066] to-[#0d0f26] px-3 py-2 shadow-xl">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs tracking-widest text-indigo-200">COCKTAIL MIXER</span>
                  </div>
                  <h1 className="mt-2 text-2xl font-extrabold leading-none">{event.name}</h1>
                  <p className="mt-1 text-sm text-black">
                    {event.venue} • {event.dateText}
                  </p>
                </div>
                {/* Date badge */}
                <div className="flex h-36 w-[110px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7f41]-600 to-[#ff7f41]-900 text-4xl font-black leading-none shadow-xl">
                  <div>06</div>
                  <div>10</div>
                  <div className="mt-1 text-xs font-semibold tracking-widest opacity-90">2025</div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-2">
                {["High‑Level Conversations", "Dealflow Connections", "Networking", "Exotic Performances", "Culinary Delights"].map((t) => (
                  <div key={t} className="flex items-center gap-2 rounded-xl bg-[#0f1224] px-3 py-2 text-sm text-indigo-100 shadow">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              {/* RSVP FORM */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* name */}
                <div>
                  <label htmlFor="name" className="text-xs text-black">
                    Full name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    className="mt-1 w-full rounded-xl border border-[#b5b5b5]  px-3 py-2 text-black placeholder-indigo-300/60 outline-none focus:ring-2 focus:ring-[#ff7f41]"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="text-xs text-black">
                      Company
                    </label>
                    <input
                      id="company"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="Company / Organization"
                      className="mt-1 w-full rounded-xl border border-[#b5b5b5] px-3 py-2 text-black placeholder-indigo-300/60 outline-none focus:ring-2 focus:ring-[#ff7f41]"
                    />
                  </div>
                  <div>
                    <label htmlFor="ticketNumber" className="text-xs text-black">
                      Ticket number 
                    </label>
                    <input
                      id="ticketNumber"
                      value={form.ticketNumber}
                      onChange={(e) => update("ticketNumber", e.target.value)}
                      placeholder="If you have one"
                      className="mt-1 w-full rounded-xl border border-[#b5b5b5] px-3 py-2 text-black placeholder-indigo-300/60 outline-none focus:ring-2 focus:ring-[#ff7f41]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="mobile" className="text-xs text-black">
                      Mobile
                    </label>
                    <input
                      id="mobile"
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      placeholder="e.g. +234 801 234 5678"
                      className="mt-1 w-full rounded-xl border border-[#b5b5b5] px-3 py-2 text0=-black placeholder-indigo-300/60 outline-none focus:ring-2 focus:ring-[#ff7f41]"
                    />
                  </div>

                  {wantsEmail ? (
                    <div>
                      <label htmlFor="email" className="text-xs text-black">
                        Email <span className="opacity-70">(required for Yes/Maybe)</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1 w-full rounded-xl border border-[#b5b5b5] px-3 py-2 text-black placeholder-indigo-300/60 outline-none focus:ring-2 focus:ring-[#ff7f41]"
                      />
                    </div>
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                </div>

                {/* RSVP buttons */}
                <div>
                  <div className="text-xs text-black">Are you attending?</div>
                  <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="RSVP response">
                    {["yes", "no", "maybe"].map((v) => {
                      const val = v as RSVP;
                      const active = rsvp === val;
                      return (
                        <button
                          key={v}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setRsvp(val)}
                          className={
                            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-bold tracking-wide transition " +
                            (active
                              ? "border-[#ff7f41] bg-gradient-to-br from-[#ffffff] to-[#ffffff] shadow"
                              : "border-indigo-900/60 bg-gray-400/80 hover:translate-y-[-1px]")
                          }
                        >
                          <span className="relative inline-block h-4 w-4 rounded-full border-2 border-[#ff7f41]">
                            {active && <span className="absolute inset-1 rounded-full bg-[#ff7f41]" />}
                          </span>
                          {v.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#ff7f41] px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit RSVP"}
                </button>

                {message && (
                  <div className="rounded-xl border border-indigo-900/60 bg-black/30 px-3 py-2 text-sm text-indigo-100">
                    {message}
                  </div>
                )}

                <p className="text-center text-xs text-black">
                  We’ll only email you if you RSVP “Yes” or “Maybe”.
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
